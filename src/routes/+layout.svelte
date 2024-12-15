<script lang="ts">
  import '../app.css';
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
  const { domain } = data;
</script>

<svelte:head>
  <title>{domain}{titleSuffix}</title>
</svelte:head>

{@render children()}
