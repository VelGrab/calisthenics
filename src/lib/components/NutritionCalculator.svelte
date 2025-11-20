<script lang="ts">
  import { nutritionStore } from "$lib/stores/nutrition";
  
  type GoalValue = "deficit" | "maintain" | "surplus";

  const activityLevels = [
    { value: "sedentary", label: "Sedentario/Oficina", factor: 1.2 },
    { value: "light", label: "Ligero (2-3 sesiones)", factor: 1.375 },
    { value: "moderate", label: "Moderado (4-5 sesiones)", factor: 1.55 },
    { value: "active", label: "Activo (6+ sesiones)", factor: 1.725 },
    { value: "athlete", label: "Muy activo/Atleta", factor: 1.9 },
  ];

  const goalOptions = [
    {
      value: "deficit",
      label: "Déficit controlado",
      helper: "Enfocado en perder grasa sin comprometer rendimiento.",
    },
    {
      value: "maintain",
      label: "Mantenimiento",
      helper: "Mantén tu peso actual mientras mejoras marcas.",
    },
    {
      value: "surplus",
      label: "Superávit ligero",
      helper: "Ideal para ganar masa muscular gradualmente.",
    },
  ] satisfies { value: GoalValue; label: string; helper: string }[];

  const ensureNumber = (value: number | string) => {
    if (typeof value === "number") return value;
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const formatCalories = (value: number) => value.toLocaleString("es-MX");

  const getActivityFactor = (value: string) =>
    activityLevels.find((level) => level.value === value)?.factor ?? 1.2;

  const suggestAdjustment = (
    maintenance: number,
    weightKg: number,
    objective: GoalValue
  ) => {
    if (!maintenance || objective === "maintain") return 0;

    if (objective === "deficit") {
      const percent = weightKg <= 60 ? 0.15 : weightKg >= 90 ? 0.25 : 0.2;
      const suggested = maintenance * percent;
      return Math.round(clamp(suggested, 300, Math.min(800, maintenance)));
    }

    const percent = weightKg <= 65 ? 0.15 : weightKg >= 85 ? 0.08 : 0.1;
    const suggested = maintenance * percent;
    return Math.round(clamp(suggested, 200, 500));
  };

  // Initialize from store
  let weight: number | string = $nutritionStore.weight;
  let height: number | string = $nutritionStore.height;
  let age: number | string = $nutritionStore.age;
  let sex: "male" | "female" = $nutritionStore.sex;
  let activity = $nutritionStore.activity;
  let goal: GoalValue = $nutritionStore.goal;
  
  // Update store when values change
  $: nutritionStore.updateField("weight", weight);
  $: nutritionStore.updateField("height", height);
  $: nutritionStore.updateField("age", age);
  $: nutritionStore.updateField("sex", sex);
  $: nutritionStore.updateField("activity", activity);
  $: nutritionStore.updateField("goal", goal);

  $: parsedWeight = ensureNumber(weight);
  $: parsedHeight = ensureNumber(height);
  $: parsedAge = ensureNumber(age);
  $: bmr = Math.max(
    0,
    Math.round(10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge + (sex === "male" ? 5 : -161))
  );
  $: maintenanceCalories = Math.max(0, Math.round(bmr * getActivityFactor(activity)));
  $: goalAdjustment = suggestAdjustment(maintenanceCalories, parsedWeight, goal);
  $: goalPercent = maintenanceCalories > 0 && goalAdjustment > 0
    ? Math.round((goalAdjustment / maintenanceCalories) * 100)
    : 0;
  $: targetCalories =
    goal === "deficit"
      ? Math.max(0, maintenanceCalories - goalAdjustment)
      : goal === "surplus"
        ? maintenanceCalories + goalAdjustment
        : maintenanceCalories;
  $: goalSummary =
    goal === "deficit"
      ? goalAdjustment
        ? `Recortamos ${formatCalories(goalAdjustment)} kcal (~${goalPercent}%) para perder grasa de forma sostenible.`
        : "Ingresa tus datos para estimar tu déficit sugerido."
      : goal === "surplus"
        ? goalAdjustment
          ? `Añadimos ${formatCalories(goalAdjustment)} kcal (~${goalPercent}%) para ganar peso sin excesos.`
          : "Ingresa tus datos para estimar tu superávit sugerido."
        : "Mantén tu ingesta actual para sostener rendimiento y recuperación.";
  $: goalLabel =
    goal === "deficit"
      ? "Objetivo con déficit"
      : goal === "surplus"
        ? "Objetivo con superávit"
        : "Objetivo diario";
  $: goalInfo = goalOptions.find((option) => option.value === goal);
</script>

<section class="nutrition" id="calorias-section">
  <div class="nutrition-info">
    <p class="eyebrow">Nutrición</p>
    <h2>Calcula tus calorías diarias</h2>
    <p>
      Introduce tus datos y te sugeriremos automáticamente el rango de calorías para mantener, bajar grasa o ganar músculo sin improvisar.
      La fórmula usa Mifflin-St Jeor, precisa para deportistas recreativos.
    </p>
    <ul>
      <li>Actualiza peso y actividad cada 4–6 semanas.</li>
      <li>Déficits sugeridos entre el 15–25% del mantenimiento.</li>
      <li>Superávits ligeros (8–15%) para minimizar grasa acumulada.</li>
      <li>Prioriza proteína (1.6–2 g/kg) para preservar masa muscular.</li>
    </ul>
  </div>

  <form class="calculator" aria-label="Calculadora de calorías">
    <div class="input-grid">
      <label>
        <span>Peso (kg)</span>
        <input type="number" min="35" max="200" step="0.5" bind:value={weight} inputmode="decimal" />
      </label>
      <label>
        <span>Altura (cm)</span>
        <input type="number" min="120" max="220" step="1" bind:value={height} inputmode="decimal" />
      </label>
      <label>
        <span>Edad</span>
        <input type="number" min="14" max="80" bind:value={age} inputmode="numeric" />
      </label>
      <label>
        <span>Sexo biológico</span>
        <select bind:value={sex}>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
        </select>
      </label>
      <label>
        <span>Nivel de actividad</span>
        <select bind:value={activity}>
          {#each activityLevels as level}
            <option value={level.value}>{level.label}</option>
          {/each}
        </select>
      </label>
    </div>

    <fieldset class="goal-field">
      <legend>Objetivo actual</legend>
      <div class="goal-options">
        {#each goalOptions as option}
          <label class:selected={goal === option.value} class="goal-option">
            <input type="radio" bind:group={goal} value={option.value} />
            <div>
              <strong>{option.label}</strong>
              <small>{option.helper}</small>
            </div>
          </label>
        {/each}
      </div>
      <p class="goal-hint">{goalInfo?.helper}</p>
    </fieldset>

    <div class="calorie-results">
      <div class="result-card">
        <p>Metabolismo basal</p>
        <strong>{bmr ? `${formatCalories(bmr)} kcal` : "--"}</strong>
        <small>Lo que gastas en reposo.</small>
      </div>
      <div class="result-card">
        <p>Mantenimiento estimado</p>
        <strong>{maintenanceCalories ? `${formatCalories(maintenanceCalories)} kcal` : "--"}</strong>
        <small>Incluyendo movimiento diario.</small>
      </div>
      <div class="result-card result-card--accent">
        <p>{goalLabel}</p>
        <strong>{targetCalories ? `${formatCalories(targetCalories)} kcal` : "--"}</strong>
        <small>{goalSummary}</small>
      </div>
    </div>
  </form>
</section>

<style>
  .nutrition {
    background: radial-gradient(circle at top right, rgba(102, 255, 216, 0.15), transparent),
      rgba(15, 16, 32, 0.9);
    border-radius: 1.75rem;
    padding: 2rem;
    display: grid;
    grid-template-columns: minmax(240px, 1fr) minmax(320px, 1.1fr);
    gap: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 25px 70px rgba(6, 10, 24, 0.55);
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent);
    font-size: 0.75rem;
  }

  .nutrition ul {
    padding-left: 1.25rem;
    color: #b0b6db;
    display: grid;
    gap: 0.5rem;
    margin: 1rem 0 0;
  }

  .calculator {
    background: rgba(4, 5, 11, 0.65);
    border-radius: 1.5rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .input-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.9rem;
  }

  input,
  select {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 0.65rem 0.75rem;
    color: inherit;
    font-size: 1rem;
    font-family: inherit;
  }

  .goal-field {
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.25rem;
    padding: 1rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .goal-field legend {
    font-weight: 600;
    padding: 0 0.35rem;
    color: #d8dbff;
  }

  .goal-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .goal-option {
    display: flex;
    gap: 0.65rem;
    align-items: flex-start;
    padding: 0.85rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .goal-option.selected {
    border-color: rgba(102, 255, 216, 0.5);
    background: rgba(102, 255, 216, 0.08);
  }

  .goal-option strong {
    display: block;
    font-size: 0.95rem;
  }

  .goal-option small {
    color: #9ea4cf;
  }

  .goal-option input {
    margin-top: 0.3rem;
    accent-color: var(--accent);
    flex-shrink: 0;
  }

  .goal-hint {
    margin: 0;
    font-size: 0.85rem;
    color: #8b92bd;
  }

  .calorie-results {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .result-card {
    padding: 1rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .result-card strong {
    display: block;
    font-size: 1.4rem;
    margin-top: 0.4rem;
  }

  .result-card--accent {
    background: rgba(102, 255, 216, 0.12);
    border-color: rgba(102, 255, 216, 0.4);
  }

  @media (max-width: 768px) {
    .nutrition {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .nutrition,
    .calculator {
      padding: 1.25rem;
    }
  }
</style>
