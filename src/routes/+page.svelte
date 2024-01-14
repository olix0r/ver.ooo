<svelte:head>
	<title>ver.ooo</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="container mx-auto p-4">
	<header class="header">
		<nav>
			<h1 class="text-3xl text-dark-gold dark:text-light-gold">&lt;oli@ver.ooo&gt;</h1>
			<ul class="flex space-x-4 text-dark-blue dark:text-light-blue">
				<li><a href="#whoami">whoami</a></li>
				<li><a href="#work">work</a></li>
				<li><a href="#wares">wares</a></li>
			</ul>
		</nav>
	</header>

	<main>
		<section id="whoami" class="mt-10">
			<h2>whoami</h2>
			<p class="mt-4">Hi, I'm Oliver.</p>
			<p class="mt-4">I think software isn't trustworthy enough.</p>
		</section>

		<section id="work" class="mt-10">
			<h2>work</h2>
			<p class="mt-4">
				I am the co-founder of a company called <a href="https://buoyant.io">Buoyant</a>. Buoyant
				pioneered the service mesh pattern with the open source project
				<a href="https://linkerd.io">Linkerd</a>.
			</p>
			<p class="mt-4">
				Before that, I helped build and run a website called twitter.com. That's all long-dead now.
			</p>
		</section>

		<section id="wares" class="mt-10">
			<h2>wares</h2>
			<ul class="list-inside list-disc">
				<li>
					<a href="https://github.com/olix0r/ver.ooo">olix0r/ver.ooo</a>
					<p>This website, an excuse to play with Typescript, SvelteKit, and Tailwind CSS.</p>
				</li>
				<li>
					<a href="https://github.com/linkerd/linkerd2-proxy">linkerd/linkerd2-proxy</a>
					<p>
						Where I've spent the majority of my time over the past few years, the Linkerd proxy is a
						high-performance, open source service mesh data plane written in Rust.
					</p>
				</li>
				<li>
					<a href="https://github.com/olix0r/kubert">olix0r/kubert</a>
					<p>Kubernetes client utilities for Rust. We use this to write both CLIs and controller</p>
				</li>
				<li>
					<a href="https://github.com/tower-rs/tower">tower-rs/tower</a>
					<p>Primitives for building services and clients in Rust.</p>
				</li>
			</ul>
		</section>
	</main>
</div>

<style>
	:global(:root) {
		@apply bg-white dark:bg-black;
		font-family: 'Instrument Serif', serif;
	}

	main section h2 {
		@apply text-2xl text-dark-blue dark:text-light-blue;
	}

	main section p {
		@apply text-lg text-dark-green dark:text-light-green;
	}

	main section a {
		@apply text-dark-gold hover:underline dark:text-light-gold;
	}

	main section#wares li {
		@apply text-lg text-dark-green dark:text-light-green;
	}
	main section#wares li p {
		@apply ml-6;
	}
</style>
