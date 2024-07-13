<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { strategy } from '$lib/strategy';
  import type { PageData } from './$types';

  export let data: PageData;

  const strategyStore = writable(data.strategy);

  let interval: ReturnType<typeof setInterval>;
  onMount(() => {
    interval = setInterval(() => {
      console.log('Refreshing strategy');
      strategyStore.set(strategy(data.index));
    }, 10000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<svelte:head>
  <title>&lt;🌊&#64;☁️.🌲&gt :: strategy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="container mx-auto flex min-h-screen items-center justify-center">
  <main class="w-full max-w-4xl">
    <div class="flex min-h-screen flex-col items-center justify-center">
      {#key $strategyStore}
        <div class="card flex rounded-2xl p-16">
          <h1 class="text-6xl" aria-live="polite" in:fade={{ delay: 1000, duration: 4000 }}>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $strategyStore}
          </h1>
        </div>
      {/key}
    </div>
  </main>
</div>

<style lang="postcss">
  :global(:root) {
    @apply bg-gray-50 dark:bg-gray-950;
    font-family: 'Instrument Serif', serif;
  }

  main .card {
    @apply bg-white text-dark-green dark:bg-black dark:text-light-blue;
  }
</style>
