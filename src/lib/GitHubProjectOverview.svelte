<script lang="ts">
  export let org: string;
  export let repo: string;
  export let name: string = repo;
</script>

<a href={`https://github.com/${org}/${repo}`} class="text-xl">{name}</a>
<slot />
