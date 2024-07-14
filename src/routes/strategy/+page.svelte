<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  // Based on Brian Eno and Peter Schmidt's Oblique Strategies.
  import { strategies } from '$lib/strategies.json';
  import { dateStablePRNG } from '$lib/prng';

  const refreshPeriod = 15 * 60 * 1000;

  let rng = dateStablePRNG(refreshPeriod);

  const strategyIdx = writable(rng());

  let interval: ReturnType<typeof setInterval>;
  onMount(() => {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      console.log('Refreshing strategy');
      shuffle(refreshPeriod);
      draw();
    }, refreshPeriod);
  });
  onDestroy(() => {
    if (interval) {
      clearInterval(interval);
    }
  });

  const shuffle = (granularity: number) => {
    console.log(`Shuffling deck (@${granularity / 1000}s)`);
    rng = dateStablePRNG(granularity);
  };

  const draw = () => {
    console.log('Drawing next card');
    strategyIdx.set(rng());
  };
</script>

<div class="container mx-auto flex min-h-screen items-center justify-center">
  <main class="flex min-h-screen items-center justify-center">
    <button
      class="card flex items-center justify-center rounded-2xl text-6xl"
      on:click={draw}
      on:dblclick={() => shuffle(1000)}
      tabindex="0"
      aria-live="polite"
    >
      {#key $strategyIdx}
        <div
          class="card-content flex items-center justify-center"
          aria-live="polite"
          in:fade={{ delay: 1000, duration: 4000 }}
        >
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html strategies[$strategyIdx]}
        </div>
      {/key}
    </button>
  </main>
</div>

<style lang="postcss">
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  main {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .card {
    @apply bg-gray-50 text-dark-green dark:bg-gray-950 dark:text-light-blue;
    font-size: xx-large;
    /* Keep things roughly card-shaped */
    min-width: 252px;
    min-height: 180px;
    max-width: 504px;
    max-height: 360px;
    width: 100%;
    height: 100%;
    /* display: flex;
    align-items: center;
    justify-content: center;
    text-align: center; */
    padding: 2rem;
    box-sizing: border-box;
  }

  .card-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
