<script lang="ts">
  import type { Exercise, ExerciseProgress, WorkoutStyle } from "$lib";
  import { createEmptyExerciseProgress, progressStore } from "$lib";

  export let dayId: string;
  export let exercise: Exercise;

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
    limits: { min: number; max: number },
  ) => {
    const next = Math.min(
      limits.max,
      Math.max(limits.min, (current?.[field] ?? 0) + delta),
    );
    updateProgress({ [field]: next } as Partial<ExerciseProgress>);
  };

  const handleInputValue = (
    field: "repsPerMin" | "minutesCompleted",
    value: string,
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
  $: completionLabel = "Repeticiones completadas";
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
    <div class="header-actions">
      {#if exercise.videoUrl}
        <a
          class="video-link"
          rel="noreferrer"
          target="_blank"
          href={exercise.videoUrl}
        >
          Video ↗
        </a>
      {/if}
      <button
        type="button"
        class:selected={current.completed}
        on:click={toggleCompleted}
      >
        {current.completed ? "Completado" : "Marcar como completo"}
      </button>
    </div>
  </header>

  {#if exercise.notes}
    <p class="notes">{exercise.notes}</p>
  {/if}

  <div class="metrics">
    <label>
      <span>Reps/min</span>
      <div class="field">
        <button
          type="button"
          class="btn-minus"
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
          class="btn-plus"
          on:click={() => adjustValue("repsPerMin", 1, { min: 0, max: 60 })}
          aria-label="Sumar una repetición"
        >
          +
        </button>
      </div>
    </label>

    <label>
      <span>{completionLabel}</span>
      <div class="field">
        <button
          type="button"
          class="btn-minus"
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
          class="btn-plus"
          on:click={() =>
            adjustValue("minutesCompleted", 1, { min: 0, max: 20 })}
          aria-label="Sumar un minuto"
        >
          +
        </button>
      </div>
    </label>

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
  :global(.exercise-card) {
    border-radius: 1rem;
    padding: 1.5rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
    margin-top: 0.5rem;
  }

  :global(.exercise-card:hover) {
    border-color: rgba(255, 255, 255, 0.15);
  }

  :global(.exercise-card.completed) {
    border-color: rgba(102, 255, 216, 0.5);
    background: rgba(102, 255, 216, 0.03);
  }

  header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-left: auto;
    flex-wrap: wrap;
    min-width: 0;
  }

  h4 {
    margin: 0.25rem 0 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 1.1rem;
  }

  .target {
    font-size: 0.75rem;
    color: #9fa6d4;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }

  .badge {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    color: #05060d;
    margin-top: 0.35rem;
  }

  .video-link {
    font-weight: 600;
    color: #8fd4ff;
    text-decoration: none;
    white-space: nowrap;
    font-size: 0.85rem;
    transition: color 0.2s ease;
  }

  .video-link:hover {
    color: #66ffd8;
  }

  .notes {
    margin: 0;
    color: #b7beda;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 0.9rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .metrics {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    padding: 0.5rem 0;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #9fa6d4;
    min-width: 0;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: none;
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
  }

  .btn-minus,
  .btn-plus {
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    font-size: 1.2rem;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
    outline: none;
  }

  .btn-minus:focus-visible {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(102, 255, 216, 0.3);
  }

  .btn-plus:focus-visible {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(102, 255, 216, 0.3);
  }

  .btn-minus:active {
    transform: scale(0.95);
  }

  .btn-plus:active {
    transform: scale(0.95);
  }

  input[type="number"],
  textarea {
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: transparent;
    padding: 0.5rem 0.75rem;
    color: #f3f5ff;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
  }

  textarea {
    min-height: 60px;
    width: 100%;
    resize: vertical;
    font-family: inherit;
  }

  .metrics input[type="number"] {
    width: 100%;
    flex: 1;
    text-align: center;
    padding: 0.35rem 0.5rem;
    min-width: 0;
    font-weight: 600;
    font-size: 1.05rem;
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

  .header-actions button {
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    background: transparent;
    color: white;
    font-weight: 600;
    padding: 0.4rem 1rem;
    cursor: pointer;
    white-space: nowrap;
    font-size: 0.85rem;
    transition: all 0.2s ease;
  }

  .header-actions button:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent);
  }

  .header-actions button.selected {
    background: var(--accent);
    color: #05060d;
    border-color: var(--accent);
  }

  .rpe {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    grid-column: 1 / -1;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .rpe > span {
    font-size: 0.8rem;
    color: #9fa6d4;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip-row button {
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0.5rem;
    padding: 0.4rem 0.9rem;
    background: transparent;
    color: #f6f8ff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.95rem;
  }

  .chip-row button:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent);
  }

  .chip-row button.selected {
    background: var(--accent);
    border-color: var(--accent);
    color: #05060d;
  }

  .reset-rpe {
    background: transparent !important;
    border-style: dashed !important;
    color: #9fa6d4 !important;
  }

  .reset-rpe:hover {
    color: white !important;
  }

  .note-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .note-chips button {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.5rem;
    background: transparent;
    color: #b7beda;
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .note-chips button:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent);
    color: white;
  }

  .notes-area {
    width: 100%;
    box-sizing: border-box;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .notes-area > span {
    font-size: 0.8rem;
    color: #9fa6d4;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 480px) {
    :global(.exercise-card) {
      padding: 1.25rem;
    }

    .metrics {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .field {
      max-width: 100%;
    }

    header {
      gap: 0.75rem;
    }

    .header-actions {
      width: 100%;
      margin-left: 0;
      gap: 0.5rem;
    }

    .header-actions button {
      flex: 1;
      justify-content: center;
      padding: 0.4rem 0.75rem;
      font-size: 0.85rem;
    }

    h4 {
      font-size: 1rem;
    }

    .video-link {
      font-size: 0.85rem;
    }
  }
</style>
