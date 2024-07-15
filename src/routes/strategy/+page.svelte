<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { derived, writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  // Based on Brian Eno and Peter Schmidt's Oblique Strategies.
  import { strategies } from '$lib/strategies.json';
  import { prng } from '$lib/prng';

  const refreshPeriod = 15 * 60 * 1000;
  const epoch = () => {
    const now = new Date();
    return new Date(Math.floor(now.getTime() / refreshPeriod) * refreshPeriod);
  };
  const seed = writable('', (set) => {
    const interval = setInterval(() => {
      const seed = epoch().toISOString();
      console.log(`Setting seed: ${seed}`);
      set(seed);
    }, 60 * 1000);
    return () => clearInterval(interval);
  });

  const deck = derived(seed, ($seed) => prng($seed).shuffle(strategies));
  const index = writable(0);
  const hash = derived([seed, index], ([$seed, $index]) => {
    if (!$seed && $index == 0) return '';
    let h = `#${$seed}`;
    if ($index) {
      h += `;${$index}`;
    }
    return h;
  });

  const hashUnsub = hash.subscribe((h) => {
    if (typeof window !== 'undefined') {
      window.location.hash = h;
    }
  });

  onMount(() => {
    const initHash = window.location.hash.replace('#', '');
    if (initHash) {
      const [s, i] = initHash.split(';');
      if (seed) {
        seed.set(s);
      }
      if (i) {
        index.set(parseInt(i, 10));
      }
    } else {
      seed.set(epoch().toISOString());
    }

    const keydown = (ev: KeyboardEvent) => {
      if (ev.key === '*') {
        seed.set(new Date().toISOString());
        index.set(0);
      }
      if (ev.key === ' ') {
        index.set(($index + 1) % strategies.length);
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  });

  onDestroy(() => {
    hashUnsub();
  });
</script>

<div class="container mx-auto flex h-10 min-h-screen items-center justify-center">
  <main class="flex min-h-screen items-center justify-center">
    {#key $deck}
      <button
        class="card flex h-full w-full items-center justify-center rounded-3xl shadow-sm hover:shadow-lg"
        on:click={() => {
          index.set(($index + 1) % $deck.length);
        }}
        tabindex="0"
        aria-live="polite"
        in:fade={{ delay: 1000 }}
      >
        {#key $index}
          <div
            class="card-content flex h-full w-full items-center justify-center rounded-3xl p-10 text-left text-4xl"
            in:fade={{ duration: 400 }}
          >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $deck[$index]}
          </div>
        {/key}
      </button>
    {/key}
  </main>
</div>

<style lang="postcss">
  .container {
    display: flex;
    height: 100vh;
  }

  main {
    display: flex;
    height: 100%;
    width: 100%;
  }

  .card {
    @apply shadow-yellow-100 dark:shadow-blue-950;
    /* Keep things roughly card-shaped */
    min-width: 252px;
    min-height: 180px;
    max-width: 756px;
    max-height: 540px;
    box-sizing: border-box;
  }

  .card-content {
    @apply bg-gray-50 text-dark-green dark:bg-gray-950 dark:text-blue-400;
  }
</style>
