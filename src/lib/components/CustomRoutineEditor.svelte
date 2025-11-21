<script lang="ts">
  import type { Exercise } from "$lib";
  import {
    customRoutineStore,
    getAllExercises,
  } from "$lib/stores/customRoutine";

  export let dayId: string;
  export let blockIndex: number;
  export let currentExercises: Exercise[];

  const allExercises = getAllExercises();
  let isOpen = false;
  let searchQuery = "";

  $: availableExercises = allExercises.filter((ex) => {
    const alreadyAdded = currentExercises.some((curr) => curr.name === ex.name);
    const matchesSearch = searchQuery
      ? ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.target.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return !alreadyAdded && matchesSearch;
  });

  const addExercise = (exercise: Exercise) => {
    customRoutineStore.addExercise(dayId, blockIndex, exercise);
  };

  const removeExercise = (exerciseName: string) => {
    customRoutineStore.removeExercise(dayId, blockIndex, exerciseName);
  };

  const togglePanel = () => {
    isOpen = !isOpen;
    if (isOpen) {
      searchQuery = "";
    }
  };
</script>

<div class="editor-panel">
  <button type="button" class="toggle-btn" on:click={togglePanel}>
    <span class="material-icon">{isOpen ? "expand_less" : "expand_more"}</span>
    {isOpen ? "Cerrar editor" : "Editar ejercicios del bloque"}
  </button>

  {#if isOpen}
    <div class="editor-content">
      <div class="current-exercises">
        <h5>Ejercicios actuales</h5>
        {#if currentExercises.length === 0}
          <p class="empty-state">No hay ejercicios en este bloque</p>
        {:else}
          <ul>
            {#each currentExercises as exercise}
              <li>
                <div class="exercise-info">
                  <strong>{exercise.name}</strong>
                  <small>{exercise.target}</small>
                </div>
                <button
                  type="button"
                  class="remove-btn"
                  on:click={() => removeExercise(exercise.name)}
                  aria-label="Eliminar {exercise.name}"
                >
                  <span class="material-icon">close</span>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="add-exercises">
        <h5>Agregar ejercicio</h5>
        <input
          type="text"
          placeholder="Buscar ejercicios..."
          bind:value={searchQuery}
          class="search-input"
        />
        {#if availableExercises.length === 0}
          <p class="empty-state">
            {searchQuery
              ? "No se encontraron ejercicios"
              : "Todos los ejercicios ya están agregados"}
          </p>
        {:else}
          <ul class="exercise-list">
            {#each availableExercises as exercise}
              <li>
                <button
                  type="button"
                  class="add-btn"
                  on:click={() => addExercise(exercise)}
                >
                  <div class="exercise-info">
                    <strong>{exercise.name}</strong>
                    <small>{exercise.target} · {exercise.difficulty}</small>
                  </div>
                  <span class="material-icon">add</span>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .editor-panel {
    margin-top: 1rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.02);
    overflow: hidden;
  }

  .toggle-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: #8fb5ff;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.2s ease;
    font-size: 0.9rem;
  }

  .toggle-btn:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .editor-content {
    padding: 1rem;
    display: grid;
    gap: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  h5 {
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #9fa6d4;
  }

  .current-exercises ul,
  .exercise-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .current-exercises li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    gap: 0.75rem;
  }

  .exercise-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  .exercise-info strong {
    font-size: 0.9rem;
    color: #f2f3ff;
  }

  .exercise-info small {
    font-size: 0.8rem;
    color: #9fa6d4;
  }

  .remove-btn {
    background: transparent;
    border: 1px solid rgba(255, 100, 100, 0.3);
    color: #ff6b81;
    border-radius: 0.5rem;
    padding: 0.35rem;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    background: rgba(255, 100, 100, 0.1);
    border-color: #ff6b81;
  }

  .search-input {
    width: 100%;
    padding: 0.65rem 0.75rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    color: #f2f3ff;
    font-size: 0.9rem;
    font-family: inherit;
    margin-bottom: 0.75rem;
    box-sizing: border-box;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .add-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    color: inherit;
    cursor: pointer;
    transition: all 0.15s ease;
    gap: 0.75rem;
    text-align: left;
  }

  .add-btn:hover {
    background: rgba(102, 255, 216, 0.08);
    border-color: rgba(102, 255, 216, 0.3);
  }

  .add-btn .material-icon {
    color: var(--accent);
    flex-shrink: 0;
  }

  .empty-state {
    padding: 1rem;
    text-align: center;
    color: #7a8099;
    font-size: 0.85rem;
    font-style: italic;
  }

  @media (max-width: 640px) {
    .editor-content {
      padding: 0.75rem;
    }
  }
</style>
