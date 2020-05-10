<script context="module">
  export async function preload({ params }) {
    const res = await this.fetch(`comics/${params.slug}.json`);
    const data = await res.json();
    if (res.status !== 200) {
      return this.error(res.status, data.message);
    }

    return { comic: data };
  }
</script>

<script>
  export let comic;

  const relativeComicSrc = comic => `/comics/${comic.slug}.png`;
  const absoluteComicSrc = comic =>
    `https://stephencook.dev${relativeComicSrc(comic)}`;

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
  header {
    align-items: center;
  }

  @media (max-width: 800px) {
    header {
      flex-direction: column;
      align-items: flex-end;
    }
  }

  .title {
    font-size: 2rem;
  }
  .title a {
    font: inherit;
    color: #fafafa;
    text-decoration: none;
  }
  .title a:hover,
  .title a:focus {
    text-decoration: underline;
  }

  nav {
    margin-left: auto;
  }
  nav ul {
    display: flex;
    list-style: none;
    margin: 0;
  }
  nav ul a {
    padding: 0.5rem;
    color: #fafafa;
    font-size: 1.2rem;
    font-weight: 100;
  }

  h2 {
    text-align: center;
    margin-bottom: 2rem;
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

    .comic img {
      grid-row: 1 / span 1;
      grid-column: 1 / span 2;
    }
  }

  .comic img {
    display: block;
    max-width: 100%;
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
    font-weight: 700;
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
  <meta property="og:title" content={comic.title} />
  <meta property="og:site_name" content="Stephen Cook Dev" />
  <meta
    property="og:url"
    content="https://stephencook.dev/comics/{comic.slug}" />
  <meta property="og:image" content={absoluteComicSrc(comic)} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@StephenCookDev" />
  <meta name="twitter:creator" content="@StephenCookDev" />
  <meta name="twitter:title" content={comic.title} />
  <meta name="twitter:description" content={comic.hoverText} />
</svelte:head>

<header>
  <h1 class="title">
    <a href="/">StephenCookDev</a>
  </h1>
  <nav>
    <ul>
      <li>
        <a href="/#about">About</a>
      </li>
      <li>
        <a href="/#talks">Talks</a>
      </li>
      <li>
        <a href="/comics/latest">Comics</a>
      </li>
      <li>
        <a href="/#open-source">GitHub</a>
      </li>
    </ul>
  </nav>
</header>

<section>
  <h2>{comic.title}</h2>

  <div class="comic">
    {#if comic.before}
      <a
        href="/comics/{comic.before}"
        rel="preload"
        class="arrow-link"
        aria-label="Before">
        <span class="before-arrow" />
      </a>
    {:else}
      <span disabled class="before-arrow" aria-label="Before" />
    {/if}
    <img
      src={relativeComicSrc(comic)}
      alt={comic.alt}
      title={comic.hoverText} />
    {#if comic.after}
      <a
        href="/comics/{comic.after}"
        rel="preload"
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
