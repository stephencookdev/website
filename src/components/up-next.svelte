<script>
  export let allPosts;
  export let recommendedSlug;
  export let previousSlug;

  $: recommended = allPosts.find((post) => post.slug === recommendedSlug);
  $: previous = allPosts.find((post) => post.slug === previousSlug);

  console.log({ recommended, previous });
</script>

<div />

<style>
</style>
