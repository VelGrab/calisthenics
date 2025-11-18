<script lang="ts">
  import {
    ExerciseTracker,
    generalTips,
    progressStore,
    routineDays,
    weeklyProgression,
    weeklyRegister,
  } from "$lib";

  const totalExercises = routineDays.reduce(
    (acc, day) =>
      acc +
      day.blocks.reduce((bAcc, block) => bAcc + block.exercises.length, 0),
    0
  );

  const structureHighlights = [
    {
      label: "Bloques EMOM",
      value: "2 ejercicios × 10 min",
      detail: "Ritmo constante (RPE 7–8)",
    },
    {
      label: "Series tradicionales",
      value: "3–4 ejercicios",
      detail: "Fallo técnico con 60–90 s de descanso",
    },
    {
      label: "ABS sin suelo",
      value: "2 días/sem",
      detail: "Solo barra, paralelas o banda",
    },
  ];

  const weekLabels = ["Semanas 1–2", "Semanas 3–4", "Semanas 5–6", "Semana 7+"];

  const numericValue = (value: string) => {
    const match = value.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  const progressHistory = weekLabels.map((label, index) => {
    const values = weeklyRegister.map((entry) =>
      numericValue(entry.weeks[index])
    );
    const average =
      values.reduce((acc, value) => acc + value, 0) /
      Math.max(values.length, 1);
    return { label, value: Math.round(average) };
  });

  const maxHistoryValue = Math.max(
    ...progressHistory.map((item) => item.value),
    1
  );

  let selectedDayId = routineDays[0]?.id ?? "";
  const selectDay = (dayId: string) => {
    selectedDayId = dayId;
  };

  const resetProgress = () => {
    if (confirm("¿Seguro que quieres borrar los registros guardados?")) {
      progressStore.reset();
    }
  };

  const scrollToSection = (targetId: string) => {
    if (typeof document === "undefined") return;
    const section = document.getElementById(targetId);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  $: completedExercises = Object.values($progressStore.log ?? {}).reduce(
    (acc, exercises) =>
      acc +
      Object.values(exercises).filter((exercise) => exercise.completed).length,
    0
  );
  $: completionPercent = Math.round(
    (completedExercises / totalExercises) * 100
  );
  $: selectedDay =
    routineDays.find((day) => day.id === selectedDayId) ?? routineDays[0];
  $: chartPoints = progressHistory
    .map((point, index) => {
      if (progressHistory.length === 1) {
        return `0,${100 - (point.value / maxHistoryValue) * 100}`;
      }
      const x = (index / (progressHistory.length - 1)) * 100;
      const y = 100 - (point.value / maxHistoryValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");
</script>

<svelte:head>
  <title>Calisthenics · Seguimiento híbrido</title>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
  />
</svelte:head>

<main class="page">
  <section class="hero" id="overview-section">
    <div class="hero-content">
      <p class="eyebrow">Rutina híbrida · EMOM + Tradicional</p>
      <h1>Calistenia orientada a fuerza, control y estética</h1>
      <p class="lede">
        Sigue los bloques diarios, registra reps/minuto y percibe tu progreso
        semana a semana. Todo se guarda en tu navegador para que retomes cada
        sesión rápidamente.
      </p>

      <div class="stats-grid">
        <div class="stat-card stat-card--accent">
          <p>Completado</p>
          <strong>{completionPercent}%</strong>
          <small
            >{completedExercises}/{totalExercises} ejercicios marcados</small
          >
        </div>

        {#each structureHighlights as item}
          <div class="stat-card">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </div>
        {/each}
      </div>

      <button class="reset" on:click={resetProgress}>Limpiar progreso</button>
    </div>

  </section>

  <section class="shortcuts" aria-label="Accesos rápidos">
    <h2>Simplifica tu sesión</h2>
    <div class="shortcut-grid">
      <button
        type="button"
        on:click={() => scrollToSection("overview-section")}
      >
        <span class="material-icon">insights</span>
        <div>
          <strong>Ver resumen general</strong>
          <small>Consulta progreso y highlights rápidamente.</small>
        </div>
      </button>
      <button type="button" on:click={() => scrollToSection("routine-section")}>
        <span class="material-icon">view_agenda</span>
        <div>
          <strong>Ver agenda</strong>
          <small>Salta directo al bloque del día.</small>
        </div>
      </button>
      <button
        type="button"
        on:click={() => scrollToSection("registro-section")}
      >
        <span class="material-icon">assignment</span>
        <div>
          <strong>Actualizar registro</strong>
          <small>Comparte tus números semana a semana.</small>
        </div>
      </button>
      <button type="button" on:click={() => scrollToSection("tips-section")}>
        <span class="material-icon">lightbulb</span>
        <div>
          <strong>Consejos rápidos</strong>
          <small>Repasa técnica y descansos clave.</small>
        </div>
      </button>
      <button type="button" class="reset-shortcut" on:click={resetProgress}>
        <span class="material-icon">delete_sweep</span>
        <div>
          <strong>Limpiar progreso</strong>
          <small>Reinicia todos los registros.</small>
        </div>
      </button>
    </div>
  </section>

  <section class="tips" id="tips-section">
    <div>
      <h2>Consejos clave</h2>
      <p>
        Repásalos antes de cada sesión para mantener la técnica y recuperación
        bajo control.
      </p>
    </div>
    <ul>
      {#each generalTips as tip}
        <li>{tip}</li>
      {/each}
    </ul>
  </section>

  <section class="routine" id="routine-section">
    <div class="routine-header">
      <div>
        <h2>Agenda semanal</h2>
        <p>
          Selecciona el día y marca cada bloque apenas lo termines para
          visualizar tu carga real.
        </p>
      </div>
      <div
        class="day-selector"
        role="tablist"
        aria-label="Días de entrenamiento"
      >
        {#each routineDays as day}
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
                <ExerciseTracker dayId={selectedDay.id} {exercise} />
              {/each}
            </div>
          </section>
        {/each}
      </article>
    {/if}
  </section>

  <section class="progress-area" id="registro-section">
    <div class="progression">
      <h2>Progresión semanal</h2>
      <ul>
        {#each weeklyProgression as item}
          <li>
            <label>
              <input
                type="checkbox"
                checked={$progressStore.weeklyCheck?.[item.week]}
                on:change={() => progressStore.toggleWeekly(item.week)}
              />
              <span>
                <strong>{item.week}</strong>
                <small>{item.adjustment}</small>
              </span>
            </label>
          </li>
        {/each}
      </ul>
    </div>

    <div class="register">
      <h2>Registro sugerido</h2>
      <table>
        <thead>
          <tr>
            <th>Día</th>
            <th>Ejercicio</th>
            {#each weekLabels as week}
              <th>{week}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each weeklyRegister as row}
            <tr>
              <td>{row.day}</td>
              <td>{row.exercise}</td>
              {#each row.weeks as cell}
                <td>{cell}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="chart-card">
      <h2>Histórico promedio (experiencia)</h2>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={chartPoints} />
      </svg>
      <div class="chart-labels">
        {#each progressHistory as point}
          <div>
            <strong>{point.value}</strong>
            <span>{point.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>
</main>

<style>
  :global(body) {
    background: radial-gradient(circle at top, #111527, #05060c);
    color: #f2f3ff;
    font-family:
      "Inter",
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    margin: 0;
  }

  :root {
    --accent: #66ffd8;
  }

  :global(.material-icon) {
    font-family: "Material Symbols Rounded";
    font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
    font-size: 1.25rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: none;
    letter-spacing: normal;
  }

  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .hero {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    align-items: center;
  }

  .hero-content {
    background: rgba(10, 11, 20, 0.65);
    padding: 2rem;
    border-radius: 1.75rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 25px 60px rgba(8, 12, 26, 0.4);
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent);
    font-size: 0.75rem;
  }

  h1 {
    margin-top: 0.35rem;
    font-size: clamp(2rem, 4vw, 3rem);
  }

  .lede {
    color: #b7beda;
    font-size: 1rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .stat-card {
    padding: 1rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .stat-card p {
    margin: 0;
    color: #a9b0d8;
    font-size: 0.85rem;
  }

  .stat-card strong {
    display: block;
    font-size: 1.6rem;
    margin-top: 0.35rem;
  }

  .stat-card small {
    color: #7d83b2;
  }

  .stat-card--accent {
    background: rgba(102, 255, 216, 0.1);
    border-color: rgba(102, 255, 216, 0.4);
  }

  .reset {
    border: none;
    padding: 0.65rem 1.25rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  .shortcuts {
    background: rgba(13, 14, 25, 0.85);
    border-radius: 1.5rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .shortcuts h2 {
    margin-top: 0;
  }

  .shortcut-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .shortcut-grid button {
    border: none;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.04);
    color: inherit;
    padding: 0.85rem 1rem;
    text-align: left;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    cursor: pointer;
    border: 1px solid transparent;
    transition: transform 0.15s ease, border-color 0.15s ease;
  }

  .shortcut-grid button:hover {
    border-color: rgba(102, 255, 216, 0.4);
    transform: translateY(-2px);
  }

  .shortcut-grid .material-icon {
    font-size: 1.5rem;
    color: #66ffd8;
  }

  .shortcut-grid strong {
    display: block;
  }

  .shortcut-grid small {
    color: #9ca2ce;
  }

  .reset-shortcut {
    border-color: rgba(255, 117, 117, 0.4) !important;
  }

  .tips {
    background: rgba(11, 12, 24, 0.8);
    border-radius: 1.5rem;
    padding: 2rem;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: start;
  }

  .tips ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.65rem;
  }

  .tips li {
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .routine-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .routine-header h2 {
    margin-bottom: 0.35rem;
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

  .day-selector .material-icon {
    font-size: 1.1rem;
  }

  .day-card {
    margin-top: 1.5rem;
    padding: 1.75rem;
    border-radius: 1.5rem;
    background: rgba(9, 9, 18, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.05);
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

  .day-label .material-icon {
    text-transform: none;
    color: #fff;
    font-size: 1rem;
  }

  .day-card h3 {
    margin: 0.35rem 0;
  }

  .day-card .highlight {
    margin: 0;
    color: #d5dbff;
  }

  .chip {
    align-self: flex-start;
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    font-weight: 600;
  }

  .block {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .block-style {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    margin: 0;
  }

  .block-header {
    display: flex;
    flex-direction: column;
  }

  .block-header h4 {
    margin: 0.35rem 0;
  }

  .block-header small {
    color: #9ca1c8;
  }

  .exercise-grid {
    display: grid;
    gap: 1rem;
  }

  .progress-area {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .progression,
  .register,
  .chart-card {
    background: rgba(10, 11, 22, 0.7);
    padding: 1.5rem;
    border-radius: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .progression ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .progression label {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    cursor: pointer;
  }

  .progression strong {
    display: block;
  }

  .register {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    min-width: 520px;
  }

  th,
  td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.6rem 0.4rem;
    text-align: left;
  }

  th {
    color: #9ca2ce;
    font-weight: 600;
  }

  .chart-card svg {
    width: 100%;
    height: 200px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 1rem;
    margin-bottom: 1rem;
  }

  .chart-card polyline {
    fill: none;
    stroke: var(--accent);
    stroke-width: 2;
  }

  .chart-labels {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    text-align: center;
  }

  .chart-labels strong {
    display: block;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    .tips {
      grid-template-columns: 1fr;
    }

    .hero-content {
      order: 2;
    }
  }

  @media (max-width: 640px) {
    .page {
      padding: 2rem 1rem 4rem;
    }

    .hero-content,
    .day-card,
    .tips,
    .progression,
    .register,
    .chart-card {
      padding: 1.25rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
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

    .block {
      padding: 1rem;
    }

    .progress-area {
      grid-template-columns: 1fr;
    }
  }
</style>
