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
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      strategyIdx.set(parseInt(hash, 10));
    }
    strategyIdx.subscribe((idx) => {
      window.location.hash = `#${idx}`;
    });

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
    const idx = rng();
    console.log(`Drawing next card: ${idx}`);
    strategyIdx.set(idx);
  };
</script>

<svelte:window
  on:keypress={(ev) => {
    if (ev.key === '*') {
      shuffle(1000);
      draw();
    }
    if (ev.key === ' ') {
      draw();
    }
  }}
/>

<div class="container mx-auto flex h-10 min-h-screen items-center justify-center">
  <main class="flex min-h-screen items-center justify-center">
    <button
      class="card flex h-full w-full items-center justify-center rounded-3xl shadow-sm hover:shadow-lg"
      on:click={draw}
      on:dblclick={() => {
        shuffle(1000);
        draw();
      }}
      tabindex="0"
      aria-live="polite"
    >
      {#key $strategyIdx}
        <div
          class="card-content flex h-full w-full items-center justify-center rounded-3xl p-10 text-left text-4xl"
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
    @apply dark:shadow-cyan-950;
    /* Keep things roughly card-shaped */
    min-width: 252px;
    min-height: 180px;
    max-width: 756px;
    max-height: 540px;
    box-sizing: border-box;
  }

  .card-content {
    @apply bg-gray-50 text-dark-green dark:bg-gray-950 dark:text-light-blue;
  }
</style>
