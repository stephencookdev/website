<script>
  export let allPosts;
  export let recommendedSlug;
  export let previousSlug;

  $: recommended = allPosts.find((post) => post.slug === recommendedSlug);
  $: previous = allPosts.find((post) => post.slug === previousSlug);

  $: tiles = [
    { tileType: "Up Next", ...previous },
    { tileType: "Recommended", ...recommended },
  ];
</script>

<div class="tiles">
  {#each tiles as tile}
    <a href="/blog/{tile.slug}" rel="prefetch" class="tile">
      {#if tile.headerimage}
        <img src={tile.headerimage} alt={tile.headeralt} />
      {/if}
      <div class="tile-title">
        <div class="tile-type">{tile.tileType}</div>
        {tile.title}
      </div>
    </a>
  {/each}
</div>

<style>
  .tiles {
    display: flex;
  }

  .tile {
    width: 50%;
    height: 16rem;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    text-decoration: none;
    background: #50113c;
  }
  .tile:last-child {
    justify-content: flex-start;
  }

  .tile img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .tile-title {
    background: #e04e1c;
    color: #fafafa;
    position: relative;
    max-width: 80%;
    font-size: 1.5rem;
    padding: 1rem 0.5rem 0.5rem;
    border-bottom: 0.5rem solid #e04e1c;
    margin-top: 10%;
    margin-right: 1rem;
  }
  .tile:last-child .tile-title {
    margin-right: 0;
    margin-left: 1rem;
  }
  .tile:hover .tile-title {
    background: #fafafa;
    color: #e04e1c;
  }

  .tile-type {
    font-size: 2rem;
  }

  @media (max-width: 800px) {
    .tiles {
      flex-direction: column;
    }

    .tile {
      width: 100%;
    }
  }
</style>
