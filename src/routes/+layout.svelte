<script lang="ts">
  import '../app.css';

  export let titleSuffix = '';
</script>

<svelte:head>
  <title>&lt;🌊&#64;☁️.🌲&gt{titleSuffix}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<slot />

<style lang="postcss">
  :global(:root) {
    @apply bg-white dark:bg-black;
    font-family: 'Instrument Serif', serif;
  }
</style>
