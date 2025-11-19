import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { routineDays, weeklyProgression } from "../data/routine";

const STORAGE_KEY = "calisthenics-progress-v1";

export interface ExerciseProgress {
  repsPerMin: number;
  minutesCompleted: number;
  rpe: number;
  notes: string;
  completed: boolean;
}

export interface RoutineProgressState {
  log: Record<string, Record<string, ExerciseProgress>>;
  weeklyCheck: Record<string, boolean>;
}

export const createEmptyExerciseProgress = (): ExerciseProgress => ({
  repsPerMin: 0,
  minutesCompleted: 0,
  rpe: 7,
  notes: "",
  completed: false,
});

const buildDefaultLog = () => {
  const result: RoutineProgressState["log"] = {};
  for (const day of routineDays) {
    result[day.id] = {};
    for (const block of day.blocks) {
      for (const exercise of block.exercises) {
        result[day.id][exercise.name] = createEmptyExerciseProgress();
      }
    }
  }
  return result;
};

const buildDefaultWeekly = () => {
  const result: RoutineProgressState["weeklyCheck"] = {};
  for (const phase of weeklyProgression) {
    result[phase.week] = false;
  }
  return result;
};

const getDefaultState = (): RoutineProgressState => ({
  log: buildDefaultLog(),
  weeklyCheck: buildDefaultWeekly(),
});

const mergeState = (
  stored: RoutineProgressState | null
): RoutineProgressState => {
  const base = getDefaultState();
  if (!stored) return base;

  for (const dayId of Object.keys(base.log)) {
    base.log[dayId] = { ...base.log[dayId], ...(stored.log?.[dayId] ?? {}) };
  }

  for (const weekKey of Object.keys(base.weeklyCheck)) {
    base.weeklyCheck[weekKey] = stored.weeklyCheck?.[weekKey] ?? false;
  }

  return base;
};

const createProgressStore = () => {
  const initial = browser
    ? mergeState(
        (() => {
          try {
            const parsed = JSON.parse(
              localStorage.getItem(STORAGE_KEY) ?? "null"
            );
            return parsed;
          } catch (error) {
            console.warn("No se pudo leer el progreso guardado", error);
            return null;
          }
        })()
      )
    : getDefaultState();

  const store = writable<RoutineProgressState>(initial);

  if (browser) {
    store.subscribe((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  const { subscribe, update, set } = store;

  return {
    subscribe,
    updateExercise(
      dayId: string,
      exerciseName: string,
      payload: Partial<ExerciseProgress>
    ) {
      update((state) => {
        const day = state.log[dayId] ?? {};
        const current = day[exerciseName] ?? createEmptyExerciseProgress();
        const next = { ...current, ...payload };
        return {
          ...state,
          log: {
            ...state.log,
            [dayId]: {
              ...day,
              [exerciseName]: next,
            },
          },
        };
      });
    },
    toggleWeekly(weekKey: string) {
      update((state) => ({
        ...state,
        weeklyCheck: {
          ...state.weeklyCheck,
          [weekKey]: !state.weeklyCheck[weekKey],
        },
      }));
    },
    reset() {
      set(getDefaultState());
    },
  };
};

export const progressStore = createProgressStore();
