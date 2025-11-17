<script lang="ts">
  import type { Exercise, ExerciseProgress } from "$lib";
  import { createEmptyExerciseProgress, progressStore } from "$lib";

  export let dayId: string;
  export let exercise: Exercise;

  let current: ExerciseProgress = createEmptyExerciseProgress();

  const difficultyColors: Record<Exercise["difficulty"], string> = {
    Básico: "#66ffd8",
    Intermedio: "#ffd166",
    Avanzado: "#ff6b81",
  };

  const toNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const updateProgress = (patch: Partial<ExerciseProgress>) => {
    progressStore.updateExercise(dayId, exercise.name, patch);
  };

  $: current =
    $progressStore.log?.[dayId]?.[exercise.name] ??
    createEmptyExerciseProgress();
</script>

<article class="exercise-card">
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

  {#if exercise.notes}
    <p class="notes">{exercise.notes}</p>
  {/if}

  <div class="inputs">
    <label>
      <span>Reps/min</span>
      <input
        type="number"
        min="0"
        max="30"
        step="1"
        value={current.repsPerMin}
        on:change={(event) =>
          updateProgress({ repsPerMin: toNumber(event.currentTarget.value) })}
      />
    </label>

    <label>
      <span>Min completados</span>
      <input
        type="number"
        min="0"
        max="15"
        step="1"
        value={current.minutesCompleted}
        on:change={(event) =>
          updateProgress({
            minutesCompleted: toNumber(event.currentTarget.value),
          })}
      />
    </label>

    <label class="rpe">
      <span>RPE (Esfuerzo)</span>
      <div class="rpe-control">
        <input
          type="range"
          min="1"
          max="10"
          value={current.rpe}
          on:input={(event) =>
            updateProgress({ rpe: toNumber(event.currentTarget.value) })}
        />
        <strong>{current.rpe}/10</strong>
      </div>
    </label>
  </div>

  <label class="notes-area">
    <span>Notas</span>
    <textarea
      rows="2"
      placeholder="Sensaciones, ajustes, lastre usado..."
      value={current.notes}
      on:input={(event) => updateProgress({ notes: event.currentTarget.value })}
    ></textarea>
  </label>

  <label class="checkbox">
    <input
      type="checkbox"
      checked={current.completed}
      on:change={(event) =>
        updateProgress({ completed: event.currentTarget.checked })}
    />
    <span>Bloque completado ✔</span>
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

  .inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: #9fa6d4;
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

  .rpe-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  input[type="range"] {
    flex: 1;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #c6ffbf;
  }

  .checkbox input {
    width: 18px;
    height: 18px;
  }
</style>
