<script>
  export let title;
  export let subtitle;
  export let headerImage;
  export let headerAlt;
</script>

<svelte:head>
  <title>{title} | Stephen Cook Dev</title>
</svelte:head>

<h2>
  {title}
  <small>{subtitle}</small>
</h2>

<img src={headerImage} alt={headerAlt} />
