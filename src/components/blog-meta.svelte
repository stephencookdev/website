<script>
  import HumanDate from "./human-date.svelte";
  import TwitterFollowButton from "./twitter-follow-button.svelte";

  export let slug;
  export let title;
  export let subtitle;
  export let headerImage;
  export let headerAlt;
  export let ogImage;
  export let keywords;
  export let published;

  const makeAbsolute = (url) =>
    `https://stephencook.dev${url.startsWith("/") ? "" : "/"}${url}`;

  $: canonicalBlogUrl = `https://stephencook.dev/blog/${slug}`;
</script>

<svelte:head>
  <title>{title} | Stephen Cook Dev</title>
  <meta name="description" content="{title} | {subtitle}" />
  <meta name="keywords" content={keywords} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <link rel="canonical" href={canonicalBlogUrl} />
  <meta property="og:url" content={canonicalBlogUrl} />
  <meta property="og:image" content={makeAbsolute(ogImage || headerImage)} />
  <meta property="og:description" content={subtitle} />
  <meta name="twitter:image" content={makeAbsolute(ogImage || headerImage)} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@StephenCookDev" />
  <meta name="twitter:creator" content="@StephenCookDev" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={subtitle} />
  <script
    async
    src="https://platform.twitter.com/widgets.js"
    charset="utf-8"></script>
</svelte:head>

<h2>
  {title}
  <small>{subtitle}</small>
</h2>

{#if headerImage}
  <img src={headerImage} alt={headerAlt} />
{/if}

<span class="published">
  Posted on
  <HumanDate date={published} />
  by Stephen Cook
  <TwitterFollowButton className="twitter-follow-button" />
</span>

<style>
  .published {
    display: flex;
    align-items: center;
    color: #999;
    font-style: italic;
    font-weight: 100;
    margin-top: -1.5rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }
  :global(.twitter-follow-button) {
    margin-left: 0.7rem;
    margin-top: -0.45rem;
  }
  @media (max-width: 800px) {
    :global(.twitter-follow-button) {
      width: 100% !important;
      margin-left: 0;
      margin-top: 0.3rem;
    }
  }

  :global(.twitter-tweet) {
    box-sizing: border-box;
    margin: 3rem auto !important;
  }
</style>
