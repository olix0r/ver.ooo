<script lang="ts">
  import '../app.css';
  import '@fontsource/barlow/400.css';
  import '@fontsource/quattrocento/400.css';
  import '@fontsource/quattrocento/700.css';
  import type { LayoutData } from './$types';
  import type { Snippet } from 'svelte';

  interface Props {
    data: LayoutData;
    titleSuffix?: string;
    children: Snippet;
  }
  const { data, children, titleSuffix = '' }: Props = $props();
  let { domain } = data;
</script>

<svelte:head>
  <title>{domain}{titleSuffix}</title>
</svelte:head>

<div
  data-theme={domain}
  class="h-full min-h-screen w-full bg-primary-light font-default text-text-light dark:bg-primary-dark dark:text-text-dark"
>
  {@render children()}
</div>
