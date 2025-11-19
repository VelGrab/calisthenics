<script lang="ts">
  export let onScrollToSection: (targetId: string) => void = () => {};
  export let onReset: () => void = () => {};
</script>

<section class="shortcuts" aria-label="Accesos rápidos">
  <h2>Simplifica tu sesión</h2>
  <div class="shortcut-grid">
    <button type="button" on:click={() => onScrollToSection("overview-section")}>
      <span class="material-icon">insights</span>
      <div>
        <strong>Ver resumen general</strong>
        <small>Consulta progreso y highlights rápidamente.</small>
      </div>
    </button>
    <button type="button" on:click={() => onScrollToSection("routine-section")}>
      <span class="material-icon">view_agenda</span>
      <div>
        <strong>Ver agenda</strong>
        <small>Salta directo al bloque del día.</small>
      </div>
    </button>
    <button type="button" on:click={() => onScrollToSection("calorias-section")}>
      <span class="material-icon">local_fire_department</span>
      <div>
        <strong>Calcular calorías</strong>
        <small>Estima mantenimiento, déficit o superávit.</small>
      </div>
    </button>
    <button type="button" on:click={() => onScrollToSection("registro-section")}>
      <span class="material-icon">assignment</span>
      <div>
        <strong>Actualizar registro</strong>
        <small>Comparte tus números semana a semana.</small>
      </div>
    </button>
    <button type="button" on:click={() => onScrollToSection("tips-section")}>
      <span class="material-icon">lightbulb</span>
      <div>
        <strong>Consejos rápidos</strong>
        <small>Repasa técnica y descansos clave.</small>
      </div>
    </button>
    <button type="button" class="reset-shortcut" on:click={onReset}>
      <span class="material-icon">delete_sweep</span>
      <div>
        <strong>Limpiar progreso</strong>
        <small>Reinicia todos los registros.</small>
      </div>
    </button>
  </div>
</section>

<style>
  .shortcuts {
    background: rgba(13, 14, 25, 0.85);
    border-radius: 1.5rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .shortcut-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }

  button {
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

  button:hover {
    border-color: rgba(102, 255, 216, 0.4);
    transform: translateY(-2px);
  }

  .material-icon {
    font-size: 1.5rem;
    color: #66ffd8;
  }

  strong {
    display: block;
  }

  small {
    color: #9ca2ce;
  }

  .reset-shortcut {
    border-color: rgba(255, 117, 117, 0.4) !important;
  }
</style>
