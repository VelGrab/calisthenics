import { browser } from "$app/environment";
import { writable } from "svelte/store";

const STORAGE_KEY = "calisthenics-nutrition-v1";

export interface NutritionData {
  weight: number | string;
  height: number | string;
  age: number | string;
  sex: "male" | "female";
  activity: string;
  goal: "deficit" | "maintain" | "surplus";
}

const getDefaultData = (): NutritionData => ({
  weight: 70,
  height: 175,
  age: 28,
  sex: "male",
  activity: "light",
  goal: "deficit",
});

const createNutritionStore = () => {
  const initial = browser
    ? (() => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            return { ...getDefaultData(), ...parsed };
          }
        } catch (error) {
          console.warn("No se pudo leer los datos de nutrición guardados", error);
        }
        return getDefaultData();
      })()
    : getDefaultData();

  const store = writable<NutritionData>(initial);

  if (browser) {
    store.subscribe((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  const { subscribe, update, set } = store;

  return {
    subscribe,
    updateField<K extends keyof NutritionData>(
      field: K,
      value: NutritionData[K]
    ) {
      update((state) => ({
        ...state,
        [field]: value,
      }));
    },
    reset() {
      set(getDefaultData());
    },
  };
};

export const nutritionStore = createNutritionStore();
