<script lang="ts">
  import { onDestroy } from "svelte";

  const minuteOptions = [8, 10, 12, 15];

  export let title = "Temporizador EMOM";
  export let minuteLength = 1;
  export let totalMinutes = 10;

  let elapsedSeconds = 0;
  let running = false;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let cue = "";

  const tick = () => {
    elapsedSeconds += 1;

    if (elapsedSeconds % (minuteLength * 60) === 0) {
      cue = "¡Nuevo minuto, respira y reinicia el esfuerzo!";
      setTimeout(() => (cue = ""), 2500);
    }

    if (elapsedSeconds >= totalMinutes * minuteLength * 60) {
      stop();
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    intervalId = setInterval(tick, 1000);
  };

  const stop = () => {
    running = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const reset = () => {
    stop();
    elapsedSeconds = 0;
    cue = "";
  };

  const handleMinutesChange = (value: number) => {
    totalMinutes = value;
    reset();
  };

  onDestroy(() => stop());

  $: totalSeconds = totalMinutes * minuteLength * 60;
  $: remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);
  $: currentMinute = Math.floor(elapsedSeconds / 60) + 1;
  $: secondsWithinMinute = remainingSeconds % 60;
  $: minutesWithinMinute = Math.floor(remainingSeconds / 60);
  $: roundsCompleted = Math.floor(elapsedSeconds / (minuteLength * 60));
  $: progress =
    totalSeconds === 0
      ? 0
      : Math.min((elapsedSeconds / totalSeconds) * 100, 100);
  $: isFinished = remainingSeconds === 0 && elapsedSeconds > 0;
</script>

<section class="timer-card">
  <div class="timer-header">
    <div>
      <p class="eyebrow">{title}</p>
      <h3>Bloque de {totalMinutes} min</h3>
    </div>
    <label class="minutes-select">
      <span>Duración</span>
      <select
        on:change={(e) => handleMinutesChange(Number(e.currentTarget.value))}
        bind:value={totalMinutes}
        disabled={running}
      >
        {#each minuteOptions as option}
          <option value={option}>{option} min</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="display">
    <div class="time">
      <span>{String(minutesWithinMinute).padStart(2, "0")}</span>
      <small>min</small>
    </div>
    <div class="time">
      <span>{String(secondsWithinMinute).padStart(2, "0")}</span>
      <small>s</small>
    </div>
    <div class="rounds">
      <p>Minuto actual</p>
      <strong
        >{currentMinute > totalMinutes
          ? totalMinutes
          : currentMinute}/{totalMinutes}</strong
      >
    </div>
  </div>

  <div class="progress">
    <div class="bar">
      <div class="fill" style={`width:${progress}%`}></div>
    </div>
    <p>{Math.floor(progress)}% completado · {roundsCompleted} min listos</p>
  </div>

  {#if cue}
    <p class="cue">{cue}</p>
  {/if}

  {#if isFinished}
    <p class="finished">Bloque finalizado. Marca tu registro abajo.</p>
  {/if}

  <div class="controls">
    <button class="ghost" on:click={reset}>Reiniciar</button>
    {#if running}
      <button class="danger" on:click={stop}>Pausar</button>
    {:else}
      <button class="primary" on:click={start}>Iniciar</button>
    {/if}
  </div>
</section>

<style>
  .timer-card {
    padding: 1.5rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(
      135deg,
      rgba(23, 23, 31, 0.9),
      rgba(43, 44, 64, 0.95)
    );
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    box-shadow: 0 20px 60px rgba(13, 14, 27, 0.35);
  }

  .timer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .eyebrow {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: 0.25rem;
  }

  h3 {
    margin: 0;
    font-size: 1.4rem;
  }

  .minutes-select {
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
    color: #dfe3f7;
  }

  select {
    margin-top: 0.25rem;
    padding: 0.35rem 0.85rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.2);
    color: inherit;
  }

  .display {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .time {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .time small {
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #8e95c9;
  }

  .rounds {
    margin-left: auto;
    text-align: right;
    min-width: 120px;
  }

  .rounds p {
    margin: 0;
    color: #a8aed7;
    font-size: 0.85rem;
  }

  .rounds strong {
    font-size: 1.15rem;
  }

  .progress .bar {
    height: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .fill {
    height: 100%;
    background: linear-gradient(90deg, #66ffd8, #50b5ff);
  }

  .progress p {
    margin: 0.35rem 0 0;
    color: #cfd3f3;
    font-size: 0.85rem;
  }

  .cue,
  .finished {
    margin: 0;
    font-weight: 600;
    color: var(--accent);
  }

  .finished {
    color: #a0ffa6;
  }

  .controls {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  button {
    border: none;
    border-radius: 999px;
    padding: 0.55rem 1.4rem;
    font-weight: 600;
    cursor: pointer;
  }

  .primary {
    background: var(--accent);
    color: #0f111b;
  }

  .danger {
    background: rgba(255, 97, 111, 0.85);
    color: white;
  }

  .ghost {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  @media (max-width: 640px) {
    .rounds {
      margin-left: 0;
      text-align: left;
    }
  }
</style>
