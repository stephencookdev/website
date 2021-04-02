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
  import CondensedHeader from "../../components/condensed-header.svelte";
  import EmailListSubscribe from "../../components/email-list-subscribe.svelte";
  import UpNext from "../../components/up-next.svelte";

  export let segment;
  export let posts;

  $: specificPost = posts.find((post) => post.slug === segment);
</script>

<CondensedHeader />

<main>
  <slot />
</main>

{#if specificPost}
  <footer>
    <div class="full">
      <UpNext
        allPosts={posts}
        previousSlug={specificPost.before || specificPost.after}
        recommendedSlug={specificPost.recommended}
      />
    </div>

    <div class="bio">
      <a href="/" class="bio-title">Stephen Cook Dev</a>
      <img src="/me.jpg" alt="Stephen Cook" class="me" />

      <p>
        I’m Stephen. I gave up a promising Mario Kart career in 2014, to instead
        focus on software engineering full-time.
      </p>
      <p>
        Why not
        <a href="https://twitter.com/stephencookdev">follow me on Twitter?</a>
      </p>
    </div>

    <EmailListSubscribe />
  </footer>
{/if}

<style>
  main :global(h2) {
    text-align: center;
    margin: 3rem auto;
  }

  main :global(h2 small) {
    display: block;
    font-weight: 400;
    text-transform: none;
    font-size: 1.3rem;
    margin-top: 1rem;
    color: #555;
  }

  main :global(blockquote) {
    margin-top: 3.5rem;
    margin-bottom: 3rem;
  }
  main :global(blockquote p) {
    margin-bottom: 0.6rem;
    font-style: italic;
    position: relative;
  }
  main :global(blockquote p::before),
  main :global(blockquote p::after) {
    position: absolute;
    font-size: 4rem;
    line-height: 0;
    font-style: normal;
    color: #e04e1c;
  }
  main :global(blockquote p::before) {
    content: "“";
    top: 1.3rem;
    left: -1.4rem;
    margin-left: -0.5rem;
  }
  main :global(blockquote p::after) {
    content: "”";
    margin-top: 1.7rem;
    margin-left: 0.5rem;
  }
  main :global(blockquote cite) {
    color: #999;
    font-weight: 100;
  }

  @media (max-width: 800px) {
    main :global(blockquote p::before),
    main :global(blockquote p::after) {
      margin-left: 0;
    }
  }

  .bio {
    margin-top: 5rem;
  }

  .me {
    float: left;
    height: 6.5rem;
    margin: 1.6rem 1.6rem 1rem 0;
  }

  .bio-title {
    font-family: "Inconsolata", monospace;
    font-size: 1.5rem;
    font-weight: 400;
    text-transform: uppercase;
    text-decoration: none;
    display: block;
    width: fit-content;
  }
</style>
