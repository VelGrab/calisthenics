<script lang="ts">
  import { onMount } from "svelte";
  import ExerciseTracker from "./ExerciseTracker.svelte";
  import CustomRoutineEditor from "./CustomRoutineEditor.svelte";
  import { routineDays } from "../data/routine";
  import { customRoutineStore, activeRoutine } from "$lib/stores/customRoutine";

  let selectedDayId = routineDays[0]?.id ?? "";

  // Auto-select current weekday
  onMount(() => {
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayMap: Record<number, string> = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      0: "monday", // Sunday defaults to Monday
      6: "monday", // Saturday defaults to Monday
    };
    selectedDayId = dayMap[dayOfWeek] || "monday";
  });

  const selectDay = (dayId: string) => {
    selectedDayId = dayId;
  };

  const toggleMode = () => {
    const newMode =
      $customRoutineStore.mode === "default" ? "custom" : "default";
    customRoutineStore.setMode(newMode);
  };

  const resetCustomRoutine = () => {
    if (
      confirm(
        "¿Seguro que quieres restaurar la rutina personalizada a los valores por defecto?",
      )
    ) {
      customRoutineStore.resetToDefault();
    }
  };

  $: selectedDay =
    $activeRoutine.find((day) => day.id === selectedDayId) ?? $activeRoutine[0];
  $: isCustomMode = $customRoutineStore.mode === "custom";
</script>

<section class="routine" id="routine-section">
  <div class="routine-header">
    <div>
      <h2>Agenda semanal</h2>
      <p>
        Selecciona el día y marca cada bloque apenas lo termines para visualizar
        tu carga real.
      </p>
    </div>

    <div class="mode-selector">
      <button
        type="button"
        class:selected={!isCustomMode}
        on:click={toggleMode}
      >
        <span class="material-icon">fitness_center</span>
        Rutina por defecto
      </button>
      <button type="button" class:selected={isCustomMode} on:click={toggleMode}>
        <span class="material-icon">edit</span>
        Rutina personalizada
      </button>
      {#if isCustomMode}
        <button
          type="button"
          class="reset-btn"
          on:click={resetCustomRoutine}
          title="Restaurar rutina a valores por defecto"
        >
          <span class="material-icon">refresh</span>
          Restaurar
        </button>
      {/if}
    </div>
  </div>

  <div class="day-selector" role="tablist" aria-label="Días de entrenamiento">
    {#each $activeRoutine as day}
      <button
        type="button"
        class:selected={day.id === selectedDayId}
        on:click={() => selectDay(day.id)}
        aria-pressed={day.id === selectedDayId}
      >
        <span class="material-icon">{day.icon}</span>
        {day.label}
      </button>
    {/each}
  </div>

  {#if selectedDay}
    <article class="day-card" aria-live="polite">
      <header>
        <div>
          <p class="day-label">
            <span class="material-icon">{selectedDay.icon}</span>
            {selectedDay.label}
          </p>
          <h3>{selectedDay.focus}</h3>
          <p class="highlight">{selectedDay.highlight}</p>
        </div>
        {#if selectedDay.core}
          <span class="chip">Incluye core</span>
        {/if}
      </header>

      {#each selectedDay.blocks as block, blockIndex}
        <section class="block">
          <div class="block-header">
            <p class="block-style">{block.style}</p>
            <h4>{block.description}</h4>
            {#if block.duration}
              <small>{block.duration}</small>
            {/if}
          </div>

          <div class="exercise-grid">
            {#each block.exercises as exercise}
              <ExerciseTracker dayId={selectedDay.id} {exercise} />
            {/each}
          </div>

          {#if isCustomMode}
            <CustomRoutineEditor
              dayId={selectedDay.id}
              {blockIndex}
              currentExercises={block.exercises}
            />
          {/if}
        </section>
      {/each}
    </article>
  {/if}
</section>

<style>
  .routine {
    border-radius: 1.5rem;
    background: rgba(9, 9, 18, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .routine-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .day-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.02);
    padding: 0.5rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .day-selector button {
    background: transparent;
    border: none;
    color: #cfd3f7;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    cursor: pointer;
    display: flex;
    gap: 0.4rem;
    align-items: center;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  .day-selector button.selected {
    background: rgba(255, 255, 255, 0.12);
    color: #07070f;
  }

  .mode-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .mode-selector button {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #cfd3f7;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    cursor: pointer;
    display: flex;
    gap: 0.4rem;
    align-items: center;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
    font-size: 0.85rem;
  }

  .mode-selector button:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent);
  }

  .mode-selector button.selected {
    background: var(--accent);
    color: #05060d;
    border-color: var(--accent);
  }

  .reset-btn {
    background: transparent !important;
    border-style: dashed !important;
    color: #ff9a66 !important;
  }

  .reset-btn:hover {
    background: rgba(255, 154, 102, 0.1) !important;
    border-color: #ff9a66 !important;
  }

  .day-card {
    /* padding: 1.75rem; */
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .day-label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8fb5ff;
    font-size: 0.8rem;
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .highlight {
    color: #b7beda;
  }

  .chip {
    background: rgba(102, 255, 216, 0.15);
    color: var(--accent);
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .block {
    padding: 1rem 1.25rem;
    border-radius: 1.25rem;
    width: 100%; /* Añadido */
    box-sizing: border-box; /* Añadido */
  }

  .block-style {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    margin: 0;
  }

  .exercise-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;
  }

  @media (max-width: 640px) {
    .routine,
    .day-card,
    .block {
      padding: 0.5rem;
    }

    .routine-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .mode-selector {
      width: 100%;
    }

    .mode-selector button {
      flex: 1;
      min-width: fit-content;
    }

    .day-selector {
      width: 100%;
      overflow-x: auto;
      flex-wrap: nowrap;
      justify-content: flex-start;
      scroll-snap-type: x proximity;
      padding: 0.5rem 0.25rem;
      margin: 0;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */
    }

    .day-selector::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    .day-selector button {
      flex: 0 0 auto;
      scroll-snap-align: start;
      padding: 0.5rem 0.85rem;
    }
  }
</style>
