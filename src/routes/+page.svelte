<script lang="ts">
  import GitHubProjectOverview from '$lib/GitHubProjectOverview.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div class="container mx-auto p-4">
  <header class="header">
    <nav>
      <div class="flex">
        <img src={data.avatar} alt={data.email} class="mr-2 h-8 w-8 rounded-full" />
        <div class="flex flex-col">
          <h1 class="text-3xl font-bold text-dark-gold dark:text-light-gold">
            Oliver Gould &lt;{data.email}&gt;
          </h1>
          <ul class="ml-1 flex space-x-4 text-sm text-dark-green dark:text-light-blue">
            <li><a href="#whoami">whoami</a></li>
            <!-- li><a href="#work">work</a></li -->
            <li><a href="#wares">wares</a></li>
            <li><a href="/strategy">strategies</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <section id="whoami">
      <h2>whoami 🌊</h2>
      <div class="p-2 pl-0 text-xl">
        <p>Hi, I'm Oliver Gould. I live in California.</p>
        <p>I build trustworthy software systems.</p>
      </div>
    </section>

    <!-- section id="work">
      <h2>☁️ work</h2>
      <div class="p-2">
        <p>
          I am the co-founder and CTO of a company called <a href="https://buoyant.io">Buoyant</a>.
          Buoyant helps organizations make their software more secure and more reliable using the
          innovative open source service mesh,
          <a href="https://linkerd.io">Linkerd</a>.
        </p>
        <p>
          Before that, I helped build and run a website called twitter.com. That's all dead now.
        </p>
      </div>
    </section -->

    <section id="wares">
      <h2>wares 🌲</h2>
      <div class="p-2 pl-0">
        <p>What I'm working on:</p>
        <div class="p-2 pl-0">
          <ul class="list-none text-base">
            <li>
              <GitHubProjectOverview org="linkerd" repo="linkerd2-proxy">
                <p>
                  Where I've spent the majority of my time over the past few years. The Linkerd
                  proxy is a high-performance, open source service mesh data plane written in Rust.
                </p>
              </GitHubProjectOverview>
            </li>
            <li>
              <GitHubProjectOverview org="olix0r" repo="kubert">
                <p>
                  Utilities for Kubernetes-oriented applications in Rust. We use this to write both
                  CLIs and controllers in Linkerd.
                </p>
              </GitHubProjectOverview>
            </li>
            <li>
              <GitHubProjectOverview org="tower-rs" repo="tower" name="tower-balance">
                <p>A generic request load balancer for Tokio. Used by Linkerd.</p>
              </GitHubProjectOverview>
            </li>
            <li>
              <GitHubProjectOverview org="olix0r" repo="ver.ooo">
                <p>
                  This website; an excuse to play with Typescript, SvelteKit, Tailwind CSS, and
                  Cloudflare Pages.
                </p>
                <p>
                  This features a landing page inspired by Brian Eno & Peter Schmidt's
                  <a href="/strategy"><i>Oblique Strategies</i></a>: a minimalist, randomized deck
                  of cards to help you break out of creative ruts. I use it as a home page and on a
                  spare monitor.
                </p>
              </GitHubProjectOverview>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</div>

<style lang="postcss">
  main section {
    @apply ml-2 mt-8;
  }

  main section h2 {
    @apply text-2xl text-dark-green dark:text-light-blue;
  }

  main section p {
    @apply mt-2 text-dark-blue dark:text-light-green;
  }

  main section :global(a) {
    @apply text-dark-gold hover:underline dark:text-light-gold;
  }

  main section#wares li {
    @apply mt-4;
  }
  main section#wares li p {
    @apply text-dark-blue dark:text-light-green;
  }
</style>
