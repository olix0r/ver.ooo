<script lang="ts">
  import GitHubProjectOverview from '$lib/GitHubProjectOverview.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const { domain, avatar } = data;
  const email = domain === 'olix0r.net' ? 'ver@olix0r.net' : 'oli@ver.ooo';
</script>

<div class="container mx-auto p-4">
  <header class="header">
    <nav>
      <div class="flex">
        <img src={avatar} alt={email} class="mr-2 h-8 w-8 rounded-full" />
        <div class="flex flex-col">
          <h1 class="text-3xl font-bold text-header-light dark:text-header-dark">
            Oliver Gould &lt;{email}&gt;
          </h1>
          <ul class="ml-1 flex space-x-4 text-sm text-accent-light dark:text-accent-dark">
            {#if domain === 'olix0r.net'}
              <li><a href="https://ver.ooo/">@ooo</a></li>
            {:else}
              <li><a href="/strategy">@strategy</a></li>
              <li><a href="https://olix0r.net/">@wfh</a></li>
            {/if}
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main class="ml-10 max-w-3xl">
    <section id="whoami" class="text-lg">
      <p>Hi, I'm Oliver Gould. I live in California.</p>
      {#if domain === 'olix0r.net'}
        <p>I build trustworthy software systems.</p>
        <p>
          I am the creator of <a href="https://linkerd.io">Linkerd</a>, the original service mesh;
        </p>
        <p>
          And the co-founder and CTO of <a href="https://buoyant.io">Buoyant</a>.
        </p>
      {:else}
        <p>I like to run.</p>
      {/if}
    </section>
    <hr />
    <section id="wares">
      <div class="p-2 pl-0">
        <h2>What I'm working on</h2>
        <div class="p-2 pl-0">
          <ul class="list-none text-base">
            {#if domain === 'olix0r.net'}
              <li>
                <GitHubProjectOverview org="linkerd" repo="linkerd2-proxy">
                  <p>
                    Where I've spent the majority of my time over the past few years. The Linkerd
                    proxy is a high-performance, open source service mesh data plane written in
                    Rust.
                  </p>
                </GitHubProjectOverview>
              </li>
              <li>
                <GitHubProjectOverview org="olix0r" repo="kubert">
                  <p>
                    Utilities for Kubernetes-oriented applications in Rust. We use this to write
                    both CLIs and controllers in Linkerd.
                  </p>
                </GitHubProjectOverview>
              </li>
              <li>
                <GitHubProjectOverview org="tower-rs" repo="tower" name="tower-balance">
                  <p>A generic request load balancer for Tokio. Used by Linkerd.</p>
                </GitHubProjectOverview>
              </li>
            {:else}
              <li>
                <GitHubProjectOverview org="olix0r" repo="ver.ooo">
                  <p>
                    <a href="/strategy"><i>Oblique Strategies</i></a>: a creative tool devised by
                    musician Brian Eno and artist Peter Schmidt in 1975. It consists of a deck of
                    cards, each bearing a cryptic, open-ended prompt or instruction designed to
                    overcome creative blocks and stimulate lateral thinking.
                  </p>
                </GitHubProjectOverview>
              </li>
            {/if}
          </ul>
        </div>
      </div>
    </section>
  </main>
</div>

<style lang="postcss">
  main section {
    @apply mb-4 mt-4;
  }

  main hr {
    @apply my-4 border-t border-border-light dark:border-border-dark;
  }

  main section h2 {
    @apply text-2xl text-header-light dark:text-header-dark;
  }

  main section :global(a) {
    @apply text-accent-light hover:underline dark:text-accent-dark;
  }

  main section#wares li {
    @apply mt-4;
  }
</style>
