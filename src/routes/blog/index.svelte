<script context="module">
  const DEV_MODE = process.env.NODE_ENV !== "production";

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
  import HumanDate from "../../components/human-date.svelte";

  export let posts;
</script>

<style>
  .post h2 {
    text-align: left;
    margin: 3rem 0 1rem;
    display: inline-block;
    background: inherit;
    color: inherit;
  }

  .published {
    display: flex;
    align-items: center;
    color: #999;
    font-style: italic;
    font-weight: 100;
    flex-wrap: wrap;
  }

  .post p {
    margin: 0.6rem 0 3rem;
  }

  .dev-post {
    opacity: 0.5;
  }
</style>

<svelte:head>
  <title>Blog | Stephen Cook Dev</title>
  <meta
    name="description"
    content={'Blog posts of a software engineer at Thread. Saving up to fulfil true dream of professional Mario Kart'} />
</svelte:head>

{#each posts as post}
  {#if DEV_MODE || post.live}
    <div class={'post' + (!post.live ? ' dev-post' : '')}>
      <a href="/blog/{post.slug}" rel="prefetch">
        <h2>{post.title}</h2>
      </a>
      <span class="published">
        Posted on
        <HumanDate date={post.published} />
      </span>
      <p>{post.opening}</p>
    </div>
  {/if}
{/each}
