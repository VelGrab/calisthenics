<script lang="ts">
  type Highlight = {
    label: string;
    value: string;
    detail: string;
  };

  export let highlights: Highlight[] = [];
  export let completionPercent = 0;
  export let completedExercises = 0;
  export let totalExercises = 0;
  export let onReset: () => void = () => {};
</script>

<section class="hero" id="overview-section">
  <div class="hero-content">
    <p class="eyebrow">Rutina híbrida · EMOM + Tradicional</p>
    <h1>Calistenia orientada a fuerza, control y estética</h1>
    <p class="lede">
      Sigue los bloques diarios, registra reps/minuto y percibe tu progreso semana a semana.
      Todo se guarda en tu navegador para que retomes cada sesión rápidamente.
    </p>

    <div class="stats-grid">
      <div class="stat-card stat-card--accent">
        <p>Completado</p>
        <strong>{completionPercent}%</strong>
        <small>{completedExercises}/{totalExercises} ejercicios marcados</small>
      </div>

      {#each highlights as item}
        <div class="stat-card">
          <p>{item.label}</p>
          <strong>{item.value}</strong>
          <small>{item.detail}</small>
        </div>
      {/each}
    </div>

    <button class="reset" type="button" on:click={onReset}>Limpiar progreso</button>
  </div>
</section>

<style>
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

  .hero-content h1 {
    margin-top: 0.35rem;
    font-size: clamp(2rem, 4vw, 3rem);
  }

  .lede {
    color: #b7beda;
    font-size: 1rem;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent);
    font-size: 0.75rem;
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

  @media (max-width: 768px) {
    .hero-content {
      order: 2;
    }
  }
</style>
