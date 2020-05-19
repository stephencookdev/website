<script context="module">
  export async function preload() {
    const res = await this.fetch(`blog/posts.json`);
    const posts = await res.json();
    if (res.status !== 200) {
      return this.error(res.status, posts.message);
    }

    return { posts };
  }
</script>

<script>
  export let posts;
</script>

{#each posts as post}
  <div>
    <h2>{post.title}</h2>
    <p>{post.subtitle}</p>
  </div>
{/each}
