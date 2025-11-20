import { browser } from "$app/environment";
import { writable, derived } from "svelte/store";
import type { RoutineDay, Exercise } from "../data/routine";
import { routineDays } from "../data/routine";

const STORAGE_KEY = "calisthenics-custom-routine-v1";

export type RoutineMode = "default" | "custom";

export interface CustomRoutineState {
  mode: RoutineMode;
  customDays: RoutineDay[];
}

const getDefaultState = (): CustomRoutineState => ({
  mode: "default",
  customDays: JSON.parse(JSON.stringify(routineDays)), // Deep clone default routine
});

const createCustomRoutineStore = () => {
  const initial = browser
    ? (() => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            return { ...getDefaultState(), ...parsed };
          }
        } catch (error) {
          console.warn("No se pudo leer la rutina personalizada guardada", error);
        }
        return getDefaultState();
      })()
    : getDefaultState();

  const store = writable<CustomRoutineState>(initial);

  if (browser) {
    store.subscribe((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  const { subscribe, update, set } = store;

  return {
    subscribe,
    
    setMode(mode: RoutineMode) {
      update((state) => ({
        ...state,
        mode,
      }));
    },

    addExercise(dayId: string, blockIndex: number, exercise: Exercise) {
      update((state) => {
        const customDays = [...state.customDays];
        const dayIndex = customDays.findIndex((d) => d.id === dayId);
        
        if (dayIndex === -1) return state;

        customDays[dayIndex] = {
          ...customDays[dayIndex],
          blocks: customDays[dayIndex].blocks.map((block, idx) =>
            idx === blockIndex
              ? {
                  ...block,
                  exercises: [...block.exercises, exercise],
                }
              : block
          ),
        };

        return {
          ...state,
          customDays,
        };
      });
    },

    removeExercise(dayId: string, blockIndex: number, exerciseName: string) {
      update((state) => {
        const customDays = [...state.customDays];
        const dayIndex = customDays.findIndex((d) => d.id === dayId);
        
        if (dayIndex === -1) return state;

        customDays[dayIndex] = {
          ...customDays[dayIndex],
          blocks: customDays[dayIndex].blocks.map((block, idx) =>
            idx === blockIndex
              ? {
                  ...block,
                  exercises: block.exercises.filter((ex) => ex.name !== exerciseName),
                }
              : block
          ),
        };

        return {
          ...state,
          customDays,
        };
      });
    },

    resetToDefault() {
      update((state) => ({
        ...state,
        customDays: JSON.parse(JSON.stringify(routineDays)),
      }));
    },

    reset() {
      set(getDefaultState());
    },
  };
};

export const customRoutineStore = createCustomRoutineStore();

// Derived store that returns the currently active routine (default or custom)
export const activeRoutine = derived(
  customRoutineStore,
  ($customRoutineStore) =>
    $customRoutineStore.mode === "custom"
      ? $customRoutineStore.customDays
      : routineDays
);

// Get all unique exercises from all days for the exercise pool
export const getAllExercises = (): Exercise[] => {
  const exercisesMap = new Map<string, Exercise>();
  
  for (const day of routineDays) {
    for (const block of day.blocks) {
      for (const exercise of block.exercises) {
        if (!exercisesMap.has(exercise.name)) {
          exercisesMap.set(exercise.name, exercise);
        }
      }
    }
  }
  
  return Array.from(exercisesMap.values());
};
