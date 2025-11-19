<script lang="ts">
  import {
    generalTips,
    progressStore,
    routineDays,
    HeroSection,
    ShortcutsSection,
    NutritionCalculator,
    TipsSection,
    RoutineSection,
    ProgressSection,
  } from "$lib";

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

  const totalExercises = routineDays.reduce(
    (acc, day) =>
      acc + day.blocks.reduce((blockAcc, block) => blockAcc + block.exercises.length, 0),
    0
  );

  const resetProgress = () => {
    if (confirm("¿Seguro que quieres borrar los registros guardados?")) {
      progressStore.reset();
    }
  };

  const scrollToSection = (targetId: string) => {
    if (typeof document === "undefined") return;
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  $: completedExercises = Object.values($progressStore.log ?? {}).reduce(
    (acc, exercises) =>
      acc + Object.values(exercises).filter((exercise) => exercise.completed).length,
    0
  );
  $: completionPercent = Math.round((completedExercises / totalExercises) * 100);
</script>

<svelte:head>
  <title>Calisthenics · Seguimiento híbrido</title>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
  />
</svelte:head>

<main class="page">
  <HeroSection
    highlights={structureHighlights}
    {completionPercent}
    {completedExercises}
    {totalExercises}
    onReset={resetProgress}
  />

  <ShortcutsSection onScrollToSection={scrollToSection} onReset={resetProgress} />

  <NutritionCalculator />

  <TipsSection tips={generalTips} />

  <RoutineSection />

  <ProgressSection />
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

  @media (max-width: 640px) {
    .page {
      padding: 2rem 1rem 4rem;
    }
  }
</style>
