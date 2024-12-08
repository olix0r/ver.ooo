<script lang="ts">
  // Based on Brian Eno and Peter Schmidt's Oblique Strategies.
  import { onMount } from 'svelte';
  import { derived, writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { prng } from '$lib/prng';
  import { setSchedule } from '$lib/schedule';
  import { strategies } from '$lib/strategies.json';

  const refreshPeriod = 15 * 60 * 1000;
  const epoch = (now: Date) => {
    return new Date(Math.floor(now.getTime() / refreshPeriod) * refreshPeriod);
  };
  const seedTs = writable(epoch(new Date()), (set) => {
    return setSchedule(
      () => {
        set(epoch(new Date()));
      },
      epoch(new Date()),
      refreshPeriod
    );
  });

  const shuffling = writable(false);
  const shuffled = writable(false);

  const deck = derived(seedTs, ($ts) => prng($ts.toISOString()).shuffle(strategies));
  const index = writable(0);

  onMount(() => {
    return seedTs.subscribe(() => {
      shuffling.set(true);
      let t = setTimeout(() => {
        shuffling.set(false);
        shuffled.set(false);
      }, 3100);
      return () => {
        clearTimeout(t);
      };
    });
  });

  const hash = derived([seedTs, index], ([$seedTs, $index]) => {
    if (!$seedTs && $index == 0) return '';
    let h = `#${$seedTs.toISOString()}`;
    if ($index) {
      h += `;${$index}`;
    }
    return h;
  });

  const help = writable(false);

  onMount(() => {
    const initHash = window.location.hash.replace('#', '');
    if (initHash) {
      const [s, i] = initHash.split(';');
      seedTs.set(new Date(s));
      if (i) {
        index.set(parseInt(i, 10));
      } else {
        index.set(0);
      }
    } else {
      seedTs.set(epoch(new Date()));
      index.set(0);
    }

    const hashUnsub = hash.subscribe((h) => {
      window.location.hash = h;
    });

    const keyup = (ev: KeyboardEvent) => {
      if (ev.key === '*') {
        ev.preventDefault();
        seedTs.set(new Date());
        index.set(0);
        help.set(false);
        return;
      }

      if (ev.key === 'Enter' || ev.key === 'ArrowRight') {
        ev.preventDefault();
        help.set(false);
        if ($index < $deck.length - 1) {
          index.set($index + 1);
        }
        return;
      }

      if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        help.set(false);
        if ($index > 0) {
          index.set($index - 1);
        }
        return;
      }

      if (ev.key === '?') {
        ev.preventDefault();
        help.update((h) => !h);
        return;
      }

      if (ev.key === 'Escape') {
        ev.preventDefault();
        if ($help) {
          help.set(false);
          return;
        }

        if ($index != 0) {
          index.set(0);
          return;
        }

        const ts = epoch(new Date());
        if (ts.getTime() !== $seedTs.getTime()) {
          seedTs.set(ts);
        }
      }
    };

    window.addEventListener('keyup', keyup);
    return () => {
      window.removeEventListener('keyup', keyup);
      hashUnsub();
    };
  });
</script>

<div class="container mx-auto flex h-[100vh] min-h-screen items-center justify-center">
  <main class="flex h-full min-h-screen w-full items-center justify-center">
    {#key derived([deck, shuffling, shuffled], (_, set) => set(true))}
      <button
        class="card flex h-full w-full items-center justify-center rounded-3xl shadow-sm hover:shadow-lg"
        on:click={() => {
          index.set(($index + 1) % $deck.length);
        }}
        tabindex="0"
        aria-live="polite"
        in:fade={{ delay: 1000 }}
      >
        {#if $help}
          <div
            class="card-content help flex h-full w-full items-center justify-center rounded-3xl p-10 text-left"
          >
            <table class="table-auto">
              <thead>
                <th class="key">Key</th>
                <th>Action</th>
              </thead>
              <tbody>
                <tr>
                  <td class="key">Tab</td>
                  <td>Next card</td>
                </tr>
                <tr>
                  <td class="key">*</td>
                  <td>Shuffle deck</td>
                </tr>
                <tr>
                  <td class="key">?</td>
                  <td>Toggle help</td>
                </tr>
                <tr>
                  <td class="key">Esc</td>
                  <td>Clear</td>
                </tr>
              </tbody>
            </table>
          </div>
        {:else if $shuffling}
          <div
            class="card-content flex h-full w-full items-center justify-center rounded-3xl p-10 text-left text-sm"
            in:fade={{ duration: 500 }}
            out:fade={{ duration: 500 }}
            on:outroend={() => {
              shuffled.set(true);
            }}
          >
            {$seedTs.toISOString()}
          </div>
        {:else if $shuffled && $index >= 0 && $index < $deck.length - 1}
          <div
            class="card-content flex h-full w-full items-center justify-center rounded-3xl p-10 text-left text-2xl"
            in:fade={{ duration: 400 }}
          >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $deck[$index]}
          </div>
        {/if}
      </button>
    {/key}
  </main>
</div>

<style lang="postcss">
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

  .help thead th {
    @apply border-b border-b-yellow-200 px-6 dark:border-b-blue-900;
  }
  .help thead th.key {
    @apply rounded-tl-lg;
  }
  .help tbody td {
    @apply px-6;
  }
  .help .key {
    @apply bg-gray-100 px-6 text-center dark:bg-gray-900;
  }
  .help tbody td.key {
    @apply font-mono text-xs;
  }
  /* Only round the last cell in the table */
  .help tbody tr:last-child td.key {
    @apply rounded-bl-lg;
  }
</style>
