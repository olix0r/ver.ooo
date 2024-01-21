<script lang="ts">
	export let org: string;
	export let repo: string;
</script>

<a href={`https://github.com/${org}/${repo}`}>{repo}</a>
<slot />
