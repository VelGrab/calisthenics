<script lang="ts">
  export let tips: string[] = [];
</script>

<section class="tips" id="tips-section">
  <div>
    <h2>Consejos clave</h2>
    <p>Repásalos antes de cada sesión para mantener la técnica y recuperación bajo control.</p>
  </div>
  <ul>
    {#each tips as tip}
      <li>{tip}</li>
    {/each}
  </ul>
</section>

<style>
  .tips {
    background: rgba(11, 12, 24, 0.8);
    border-radius: 1.5rem;
    padding: 2rem;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: start;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.65rem;
  }

  li {
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    .tips {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .tips {
      padding: 1.25rem;
    }
  }
</style>
