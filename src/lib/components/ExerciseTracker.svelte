<script lang="ts">
  import type { Exercise, ExerciseProgress, WorkoutStyle } from "$lib";
  import { createEmptyExerciseProgress, progressStore } from "$lib";

  export let dayId: string;
  export let exercise: Exercise;
  export let blockStyle: WorkoutStyle = "EMOM";

  let current: ExerciseProgress = createEmptyExerciseProgress();

  const difficultyColors: Record<Exercise["difficulty"], string> = {
    Básico: "#66ffd8",
    Intermedio: "#ffd166",
    Avanzado: "#ff6b81",
  };

  const noteSuggestions = [
    "Con banda",
    "Usé lastre ligero",
    "Tempo lento",
    "Agregar pausa arriba",
  ];
  const rpeOptions = [6, 7, 8, 9, 10];

  const toNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const updateProgress = (patch: Partial<ExerciseProgress>) => {
    progressStore.updateExercise(dayId, exercise.name, patch);
  };

  const adjustValue = (
    field: "repsPerMin" | "minutesCompleted" | "rpe",
    delta: number,
    limits: { min: number; max: number }
  ) => {
    const next = Math.min(
      limits.max,
      Math.max(limits.min, (current?.[field] ?? 0) + delta)
    );
    updateProgress({ [field]: next } as Partial<ExerciseProgress>);
  };

  const handleInputValue = (
    field: "repsPerMin" | "minutesCompleted",
    value: string
  ) => {
    const parsed = toNumber(value);
    updateProgress({ [field]: parsed } as Partial<ExerciseProgress>);
  };

  const toggleCompleted = () => {
    updateProgress({ completed: !current.completed });
  };

  const appendNote = (snippet: string) => {
    const existing = current.notes?.trim();
    const alreadyIncluded = existing
      ?.toLowerCase()
      .includes(snippet.toLowerCase());
    if (alreadyIncluded) return;
    const next = existing ? `${existing} · ${snippet}` : snippet;
    updateProgress({ notes: next });
  };

  $: current =
    $progressStore.log?.[dayId]?.[exercise.name] ??
    createEmptyExerciseProgress();
  $: completionLabel =
    blockStyle === "EMOM" ? "Min completados" : "Repeticiones completadas";
</script>

<article class="exercise-card" class:completed={current.completed}>
  <header>
    <div>
      <p class="target">{exercise.target}</p>
      <h4>{exercise.name}</h4>
      <span
        class="badge"
        style={`background:${difficultyColors[exercise.difficulty]}`}
        >{exercise.difficulty}</span
      >
    </div>
    {#if exercise.videoUrl}
      <a
        class="video-link"
        rel="noreferrer"
        target="_blank"
        href={exercise.videoUrl}>Video ↗</a
      >
    {/if}
  </header>

  <div class="quick-actions">
    {#if exercise.notes}
      <p class="notes">{exercise.notes}</p>
    {/if}
    <button
      type="button"
      class:selected={current.completed}
      on:click={toggleCompleted}
    >
      {current.completed ? "Completado" : "Marcar como completo"}
    </button>
  </div>

  <div class="inputs">
    <div class="counter-pair">
      <label class="counter">
        <span>Reps/min</span>
        <div class="counter-control">
          <button
            type="button"
            on:click={() => adjustValue("repsPerMin", -1, { min: 0, max: 60 })}
            aria-label="Restar una repetición"
          >
            –
          </button>
          <input
            type="number"
            inputmode="numeric"
            min="0"
            max="60"
            step="1"
            value={current.repsPerMin}
            on:input={(event) =>
              handleInputValue("repsPerMin", event.currentTarget.value)}
          />
          <button
            type="button"
            on:click={() => adjustValue("repsPerMin", 1, { min: 0, max: 60 })}
            aria-label="Sumar una repetición"
          >
            +
          </button>
        </div>
      </label>

      <label class="counter">
        <span>{completionLabel}</span>
        <div class="counter-control">
          <button
            type="button"
            on:click={() =>
              adjustValue("minutesCompleted", -1, { min: 0, max: 20 })}
            aria-label="Restar un minuto"
          >
            –
          </button>
          <input
            type="number"
            inputmode="numeric"
            min="0"
            max="20"
            step="1"
            value={current.minutesCompleted}
            on:input={(event) =>
              handleInputValue("minutesCompleted", event.currentTarget.value)}
          />
          <button
            type="button"
            on:click={() =>
              adjustValue("minutesCompleted", 1, { min: 0, max: 20 })}
            aria-label="Sumar un minuto"
          >
            +
          </button>
        </div>
      </label>
    </div>

    <div class="rpe">
      <span>RPE (esfuerzo)</span>
      <div class="chip-row">
        {#each rpeOptions as rpeValue}
          <button
            type="button"
            class:selected={current.rpe === rpeValue}
            on:click={() => updateProgress({ rpe: rpeValue })}
          >
            {rpeValue}
          </button>
        {/each}
        <button
          type="button"
          class="reset-rpe"
          on:click={() => updateProgress({ rpe: 7 })}
        >
          Reset
        </button>
      </div>
    </div>
  </div>

  <label class="notes-area">
    <span>Notas</span>
    <textarea
      rows="2"
      placeholder="Sensaciones, ajustes, lastre usado..."
      value={current.notes}
      on:input={(event) => updateProgress({ notes: event.currentTarget.value })}
    ></textarea>
    <div class="note-chips">
      {#each noteSuggestions as suggestion}
        <button type="button" on:click={() => appendNote(suggestion)}>
          {suggestion}
        </button>
      {/each}
    </div>
  </label>

</article>

<style>
  .exercise-card {
    border-radius: 1.25rem;
    padding: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(17, 18, 32, 0.75);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: border-color 0.2s ease, background 0.2s ease,
      box-shadow 0.2s ease;
  }

  .exercise-card.completed {
    border-color: rgba(102, 255, 216, 0.5);
    background: rgba(23, 25, 43, 0.85);
    box-shadow: 0 0 25px rgba(102, 255, 216, 0.12);
  }

  header {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  h4 {
    margin: 0.15rem 0;
  }

  .target {
    font-size: 0.85rem;
    color: #9fa6d4;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .badge {
    display: inline-block;
    padding: 0.2rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #05060d;
  }

  .video-link {
    font-weight: 600;
    color: #8fd4ff;
    text-decoration: none;
    align-self: center;
  }

  .notes {
    margin: 0;
    color: #cfd3f7;
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .quick-actions button {
    align-self: flex-start;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    font-weight: 600;
    padding: 0.4rem 1.2rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .quick-actions button.selected {
    background: var(--accent);
    color: #05060d;
  }

  .inputs {
    display: grid;
    gap: 1.25rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: #9fa6d4;
  }

  .counter-control {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .counter-control button {
    border: none;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 0.85rem;
    font-size: 1.2rem;
    cursor: pointer;
  }

  input[type="number"],
  textarea {
    border-radius: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(10, 10, 20, 0.4);
    padding: 0.5rem 0.85rem;
    color: #f3f5ff;
    font-size: 1rem;
  }

  textarea {
    min-height: 70px;
  }

  .rpe {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip-row button {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    padding: 0.3rem 0.8rem;
    background: transparent;
    color: #f6f8ff;
    font-weight: 600;
    cursor: pointer;
  }

  .chip-row button.selected {
    background: rgba(102, 255, 216, 0.25);
    border-color: var(--accent);
    color: #05060d;
  }

  .reset-rpe {
    background: rgba(255, 255, 255, 0.05) !important;
    border-style: dashed !important;
  }

  .note-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .note-chips button {
    border: none;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    padding: 0.3rem 0.75rem;
    font-size: 0.8rem;
    cursor: pointer;
  }

  input[type="number"] {
    width: 3rem;
    text-align: center;
    padding: 0.25rem 0.5rem;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  .counter-pair {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .inputs {
      grid-template-columns: minmax(0, 1fr) 240px;
      align-items: flex-start;
    }

    .counter-pair {
      flex-direction: row;
    }
  }
</style>
