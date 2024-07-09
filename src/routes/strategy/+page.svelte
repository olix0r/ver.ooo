<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  let index = data.index;
  export let strategy: string = data.strategies[index];
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
    <div class="flex min-h-screen items-center justify-center">
      <h1 class="text-6xl">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html strategy}
      </h1>
    </div>
  </main>
</div>

<style lang="postcss">
  :global(:root) {
    @apply bg-white dark:bg-black;
    font-family: 'Instrument Serif', serif;
  }

  main h1 {
    @apply text-dark-green dark:text-light-blue;
  }
</style>
