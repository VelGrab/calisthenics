<script lang="ts">
  import { weeklyProgression, weeklyRegister } from "../data/routine";
  import { progressStore } from "../stores/progress";

  const weekLabels = ["Semanas 1–2", "Semanas 3–4", "Semanas 5–6", "Semana 7+"];

  const numericValue = (value: string) => {
    const match = value.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  const progressHistory = weekLabels.map((label, index) => {
    const values = weeklyRegister.map((entry) => numericValue(entry.weeks[index] ?? "0"));
    const average = values.reduce((acc, value) => acc + value, 0) / Math.max(values.length, 1);
    return { label, value: Math.round(average) };
  });

  const maxHistoryValue = Math.max(...progressHistory.map((item) => item.value), 1);

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

<style>
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

  @media (max-width: 640px) {
    .progression,
    .register,
    .chart-card {
      padding: 1.25rem;
    }

    .progress-area {
      grid-template-columns: 1fr;
    }
  }
</style>
