<script lang="ts">
  import { weeklyProgression, weeklyRegister } from "../data/routine";
  import { progressStore } from "../stores/progress";

  const weekLabels = ["Semanas 1–2", "Semanas 3–4", "Semanas 5–6", "Semana 7+"];

  const numericValue = (value: string) => {
    const match = value.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  // Calculate progression indicators
  const getProgressionIndicator = (current: string, previous: string) => {
    const currentVal = numericValue(current);
    const prevVal = numericValue(previous);
    if (currentVal > prevVal)
      return {
        icon: "arrow_upward",
        color: "#66ffd8",
        label: "+",
        trend: "up",
      };
    if (currentVal < prevVal)
      return {
        icon: "arrow_downward",
        color: "#ff6b81",
        label: "-",
        trend: "down",
      };
    return {
      icon: "drag_handle",
      color: "#9ca2ce",
      label: "=",
      trend: "stable",
    };
  };

  const progressHistory = weekLabels.map((label, index) => {
    const values = weeklyRegister.map((entry) =>
      numericValue(entry.weeks[index] ?? "0"),
    );
    const average =
      values.reduce((acc, value) => acc + value, 0) /
      Math.max(values.length, 1);
    return { label, value: Math.round(average) };
  });

  const maxHistoryValue = Math.max(
    ...progressHistory.map((item) => item.value),
    1,
  );

  // Calculate chart points with proper scaling
  $: chartPoints = progressHistory
    .map((point, index) => {
      if (progressHistory.length === 1) {
        return `0,${100 - (point.value / maxHistoryValue) * 80}`; // Leave 20% padding at top
      }
      const x = (index / (progressHistory.length - 1)) * 100;
      const y = 100 - (point.value / maxHistoryValue) * 80; // Leave 20% padding at top
      return `${x},${y}`;
    })
    .join(" ");

  // Create area chart polygon
  $: areaPoints = (() => {
    const points = chartPoints;
    return `0,100 ${points} 100,100`;
  })();

  // Statistics
  $: totalChecked = Object.values($progressStore.weeklyCheck ?? {}).filter(
    Boolean,
  ).length;
  $: completionPercentage = Math.round(
    (totalChecked / weeklyProgression.length) * 100,
  );

  $: avgProgress = Math.round(
    progressHistory.reduce((acc, item) => acc + item.value, 0) /
      progressHistory.length,
  );

  $: bestWeek = progressHistory.reduce(
    (best, current) => (current.value > best.value ? current : best),
    progressHistory[0],
  );

  $: trend = (() => {
    if (progressHistory.length < 2) return "stable";
    const lastTwo = progressHistory.slice(-2);
    if (lastTwo[1].value > lastTwo[0].value) return "up";
    if (lastTwo[1].value < lastTwo[0].value) return "down";
    return "stable";
  })();

  $: trendInfo = {
    up: { icon: "trending_up", color: "#66ffd8", text: "Mejorando" },
    down: { icon: "trending_down", color: "#ff6b81", text: "En descenso" },
    stable: { icon: "trending_flat", color: "#9ca2ce", text: "Estable" },
  }[trend];
</script>

<section class="progress-area" id="registro-section">
  <div class="progression">
    <div class="section-header">
      <div>
        <span class="material-icon section-icon">event_available</span>
        <h2>Progresión semanal</h2>
      </div>
      <div class="completion-badge">
        <span>{completionPercentage}%</span>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" style="width: {completionPercentage}%"></div>
    </div>

    <ul>
      {#each weeklyProgression as item}
        <li>
          <label class:checked={$progressStore.weeklyCheck?.[item.week]}>
            <input
              type="checkbox"
              checked={$progressStore.weeklyCheck?.[item.week]}
              on:change={() => progressStore.toggleWeekly(item.week)}
            />
            <span class="checkbox-custom">
              <span class="material-icon">check</span>
            </span>
            <span class="week-content">
              <strong>{item.week}</strong>
              <small>{item.adjustment}</small>
            </span>
          </label>
        </li>
      {/each}
    </ul>
  </div>

  <div class="register">
    <div class="section-header">
      <span class="material-icon section-icon">table_chart</span>
      <h2>Registro sugerido</h2>
    </div>

    <div class="table-wrapper">
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
              <td class="day-cell">{row.day}</td>
              <td class="exercise-cell">{row.exercise}</td>
              {#each row.weeks as cell, idx}
                <td class="value-cell">
                  <span>{cell}</span>
                  {#if idx > 0}
                    {@const indicator = getProgressionIndicator(
                      cell,
                      row.weeks[idx - 1],
                    )}
                    <span
                      class="trend-indicator"
                      style="color: {indicator.color}"
                      title={indicator.trend === "up"
                        ? "Incremento"
                        : indicator.trend === "down"
                          ? "Descenso"
                          : "Sin cambios"}
                    >
                      <span class="material-icon">{indicator.icon}</span>
                    </span>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="chart-card">
    <div class="section-header">
      <span class="material-icon section-icon">insights</span>
      <h2>Histórico promedio</h2>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="material-icon">functions</span>
        <div>
          <strong>{avgProgress}</strong>
          <small>Promedio</small>
        </div>
      </div>
      <div class="stat-item">
        <span class="material-icon" style="color: {trendInfo.color}"
          >{trendInfo.icon}</span
        >
        <div>
          <strong style="color: {trendInfo.color}">{trendInfo.text}</strong>
          <small>Tendencia</small>
        </div>
      </div>
      <div class="stat-item">
        <span class="material-icon">star</span>
        <div>
          <strong>{bestWeek.value}</strong>
          <small>{bestWeek.label}</small>
        </div>
      </div>
    </div>

    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <!-- Grid lines -->
      <line x1="0" y1="20" x2="100" y2="20" class="grid-line" />
      <line x1="0" y1="40" x2="100" y2="40" class="grid-line" />
      <line x1="0" y1="60" x2="100" y2="60" class="grid-line" />
      <line x1="0" y1="80" x2="100" y2="80" class="grid-line" />

      <!-- Area under curve -->
      <polygon points={areaPoints} class="area-fill" />

      <!-- Line -->
      <polyline points={chartPoints} class="line" />

      <!-- Data points -->
      {#each progressHistory as point, index}
        {@const x =
          progressHistory.length === 1
            ? 0
            : (index / (progressHistory.length - 1)) * 100}
        {@const y = 100 - (point.value / maxHistoryValue) * 80}
        <circle cx={x} cy={y} r="2" class="data-point" />
      {/each}
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
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .progression,
  .register,
  .chart-card {
    background: linear-gradient(
      135deg,
      rgba(15, 16, 32, 0.95),
      rgba(10, 11, 22, 0.9)
    );
    padding: 1.75rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    gap: 1rem;
  }

  .section-header > div:first-child {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-icon {
    color: var(--accent);
    font-size: 1.5rem;
  }

  .section-header h2 {
    margin: 0;
  }

  .completion-badge {
    background: rgba(102, 255, 216, 0.15);
    color: var(--accent);
    padding: 0.35rem 0.85rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), #4de0c4);
    border-radius: 999px;
    transition: width 0.3s ease;
  }

  .progression ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .progression label {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
    cursor: pointer;
    padding: 0.85rem;
    border-radius: 0.85rem;
    transition: background 0.2s ease;
  }

  .progression label:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .progression label.checked {
    background: rgba(102, 255, 216, 0.08);
  }

  .progression input[type="checkbox"] {
    display: none;
  }

  .checkbox-custom {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .checkbox-custom .material-icon {
    font-size: 18px;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.2s ease;
  }

  label.checked .checkbox-custom {
    background: var(--accent);
    border-color: var(--accent);
  }

  label.checked .checkbox-custom .material-icon {
    opacity: 1;
    transform: scale(1);
    color: #05060d;
  }

  .week-content {
    flex: 1;
  }

  .week-content strong {
    display: block;
    margin-bottom: 0.25rem;
    color: #e8eaff;
  }

  .week-content small {
    color: #9ca2ce;
    line-height: 1.4;
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.02);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    min-width: 600px;
  }

  th,
  td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: 0.85rem 0.65rem;
    text-align: left;
  }

  th {
    color: var(--accent);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    background: rgba(255, 255, 255, 0.03);
    position: sticky;
    top: 0;
  }

  .day-cell {
    font-weight: 600;
    color: #8fb5ff;
  }

  .exercise-cell {
    color: #b7beda;
    max-width: 200px;
  }

  .value-cell {
    font-weight: 600;
    position: relative;
  }

  .trend-indicator {
    margin-left: 0.35rem;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }

  .trend-indicator .material-icon {
    font-size: 16px;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.85rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .stat-item .material-icon {
    font-size: 1.75rem;
    color: var(--accent);
  }

  .stat-item strong {
    display: block;
    font-size: 1.25rem;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .stat-item small {
    color: #9ca2ce;
    font-size: 0.75rem;
  }

  .chart-card svg {
    width: 100%;
    height: 220px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 1rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .grid-line {
    stroke: rgba(255, 255, 255, 0.05);
    stroke-width: 0.5;
  }

  .area-fill {
    fill: url(#gradient);
    opacity: 0.2;
  }

  .line {
    fill: none;
    stroke: var(--accent);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .data-point {
    fill: var(--accent);
    stroke: #05060d;
    stroke-width: 1.5;
  }

  .chart-labels {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    text-align: center;
  }

  .chart-labels > div {
    flex: 1;
  }

  .chart-labels strong {
    display: block;
    font-size: 1.35rem;
    color: var(--accent);
    margin-bottom: 0.25rem;
  }

  .chart-labels span {
    font-size: 0.75rem;
    color: #9ca2ce;
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

    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .stats-row {
      grid-template-columns: 1fr;
    }

    .chart-labels {
      flex-wrap: wrap;
    }
  }
</style>
