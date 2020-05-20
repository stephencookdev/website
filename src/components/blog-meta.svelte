<script>
  import HumanDate from "./human-date.svelte";

  export let title;
  export let subtitle;
  export let headerImage;
  export let headerAlt;
  export let published;
</script>

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
    display: none;
    margin-left: 0.7rem;
  }
  :global(.twitter-follow-button-rendered) {
    display: block;
  }
  @media (max-width: 800px) {
    :global(.twitter-follow-button) {
      width: 100% !important;
      margin-left: 0;
      margin-top: 0.7rem;
    }
  }
</style>

<svelte:head>
  <title>{title} | Stephen Cook Dev</title>
</svelte:head>

<h2>
  {title}
  <small>{subtitle}</small>
</h2>

<img src={headerImage} alt={headerAlt} />

<span class="published">
  Posted on
  <HumanDate date={published} />
  by Stephen Cook
  <a
    href="https://twitter.com/stephencookdev?ref_src=twsrc%5Etfw"
    class="twitter-follow-button"
    data-show-screen-name="false"
    data-show-count="true">
    Follow
  </a>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8">

  </script>
</span>
