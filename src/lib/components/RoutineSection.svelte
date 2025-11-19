<script lang="ts">
  import ExerciseTracker from "./ExerciseTracker.svelte";
  import { routineDays } from "../data/routine";

  const days = routineDays;
  let selectedDayId = days[0]?.id ?? "";

  const selectDay = (dayId: string) => {
    selectedDayId = dayId;
  };

  $: selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
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
    <div class="day-selector" role="tablist" aria-label="Días de entrenamiento">
      {#each days as day}
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

      {#each selectedDay.blocks as block}
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
              <ExerciseTracker
                dayId={selectedDay.id}
                {exercise}
                blockStyle={block.style}
              />
            {/each}
          </div>
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

    .day-selector {
      width: 100%;
      overflow-x: auto;
      flex-wrap: nowrap;
      justify-content: flex-start;
      scroll-snap-type: x proximity;
    }

    .day-selector button {
      flex: 0 0 auto;
      scroll-snap-align: start;
    }
  }
</style>
