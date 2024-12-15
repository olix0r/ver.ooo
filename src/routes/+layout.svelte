<script lang="ts">
  import '../app.css'
  import '@fontsource/quattrocento/400.css';
  import '@fontsource/quattrocento/700.css';

  export let titleSuffix = '';
</script>

<svelte:head>
  <title>&lt;🌊&#64;☁️.🌲&gt{titleSuffix}</title>
</svelte:head>

<slot />

<style lang="postcss">
  :global(:root) {
    @apply bg-white dark:bg-black;
    font-family: 'Quattrocento', serif;
  }
</style>
