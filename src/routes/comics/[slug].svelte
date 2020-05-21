<script context="module">
  const relativeComicSrc = comic => `/comics/${comic.slug}.png`;

  export async function preload({ params }) {
    const res = await this.fetch(`comics/${params.slug}.json`);
    const comic = await res.json();
    if (res.status !== 200) {
      return this.error(res.status, comic.message);
    }

    // we don't do anything with this, we just want to preload it for speed of
    // it loading later
    this.fetch(relativeComicSrc(comic));

    return { comic };
  }
</script>

<script>
  import Comic from "../../components/comic.svelte";
  import CondensedHeader from "../../components/condensed-header.svelte";

  export let comic;

  const absoluteComicSrc = comic =>
    `https://stephencook.dev${relativeComicSrc(comic)}`;
  const canonicalComicUrl = comic =>
    `https://stephencook.dev/comics/${comic.slug}/`;

  const comicKeywords = comic =>
    ["comic", comic.keywords].filter(Boolean).join(", ");

  const twitterShareText = comic => `${comic.title} by @StephenCookDev`;
  const twitterShareUrl = comic =>
    `https://twitter.com/share?url=https://stephencook.dev/comics/${
      comic.slug
    }&amp;text=${encodeURIComponent(twitterShareText(comic))}`;

  const shareTwitter = comic => e => {
    e.preventDefault();
    window.open(twitterShareUrl(comic), "name", "width=600,height=400");
  };
</script>

<style>
  h2 {
    text-align: center;
    margin: 3rem auto 2rem;
  }

  .comic {
    width: max-content;
    margin: auto;
    display: flex;
    align-items: center;
    max-width: 100%;
  }

  @media (max-width: 800px) {
    .comic {
      display: grid;
      justify-items: center;
      grid-gap: 1rem;
      grid-template-columns: 1fr 1fr;
    }

    .comic :global(.comic-img) {
      grid-row: 1 / span 1;
      grid-column: 1 / span 2;
    }
  }

  .comic :global(.comic-img) {
    display: block;
    max-width: 100%;
    width: 600px;
  }

  .arrow-link {
    display: flex;
    color: #e04e1c;
    background: none;
  }
  .before-arrow,
  .after-arrow {
    border: 20px solid transparent;
    width: 0;
    height: 0;
    padding: 0;
    transition: transform 0.1s ease;
  }
  .before-arrow {
    border-right-color: currentColor;
  }
  .after-arrow {
    border-left-color: currentColor;
  }
  .before-arrow[disabled],
  .after-arrow[disabled] {
    cursor: not-allowed;
    opacity: 0.2;
  }
  .arrow-link:hover .before-arrow,
  .arrow-link:focus .before-arrow {
    transform: translateX(-10%);
  }
  .arrow-link:hover .after-arrow,
  .arrow-link:focus .after-arrow {
    transform: translateX(10%);
  }

  .share {
    display: flex;
    justify-content: center;
    max-width: 800px;
    margin: auto;
    padding: 4rem 0;
  }
  .share a {
    position: relative;
    font-family: "Inconsolata", monospace;
    font-size: 1.5rem;
    font-weight: 400;
    text-transform: uppercase;
    text-decoration: none;
  }
  .share a:not(:last-child) {
    margin-right: 2rem;
  }
  .share a:not(:last-child)::after {
    content: "";
    pointer-events: none;
    display: block;
    width: 2px;
    height: 2px;
    background: #e04e1c;
    position: absolute;
    right: -1rem;
    top: calc(50% - 1px);
  }
</style>

<svelte:head>
  <title>{comic.title} | Stephen Cook Dev Comics</title>
  <meta name="description" content="{comic.title} | {comic.hoverText}" />
  <meta name="keywords" content={comicKeywords(comic)} />
  <meta property="og:title" content={comic.title} />
  <link rel="canonical" href={canonicalComicUrl} />
  <meta property="og:url" content={canonicalComicUrl} />
  <meta property="og:image" content={absoluteComicSrc(comic)} />
  <meta name="twitter:image" content={absoluteComicSrc(comic)} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@StephenCookDev" />
  <meta name="twitter:creator" content="@StephenCookDev" />
  <meta name="twitter:title" content={comic.title} />
  <meta name="twitter:description" content={comic.hoverText} />

  <link rel="canonical" href={canonicalComicUrl(comic)} />
</svelte:head>

<CondensedHeader />

<section>
  <h2>{comic.title}</h2>

  <div class="comic">
    {#if comic.before}
      <a
        href="/comics/{comic.before}"
        rel="prefetch"
        class="arrow-link"
        aria-label="Before">
        <span class="before-arrow" />
      </a>
    {:else}
      <span disabled class="before-arrow" aria-label="Before" />
    {/if}
    <Comic
      src={relativeComicSrc(comic)}
      alt={comic.alt}
      title={comic.hoverText}
      class="comic-img" />
    {#if comic.after}
      <a
        href="/comics/{comic.after}"
        rel="prefetch"
        class="arrow-link"
        aria-label="After">
        <span class="after-arrow" />
      </a>
    {:else}
      <span disabled class="after-arrow" aria-label="After" />
    {/if}
  </div>
</section>

<section class="share">
  <a href="https://twitter.com/StephenCookDev">Follow Me</a>
  <a href={twitterShareUrl(comic)} on:click={shareTwitter(comic)}>Share</a>
</section>
