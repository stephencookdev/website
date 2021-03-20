<script>
  export let allPosts;
  export let recommendedSlug;
  export let previousSlug;

  const sendGa = (type, slug) => (e) => {
    if (!window.ga) return;

    e.preventDefault();
    gtag("event", "click", {
      event_category: "UpNext",
      event_label: type,
      event_value: slug,
      transport_type: "beacon",
      event_callback: () => {
        document.location = `/blog/${slug}`;
      },
    });
  };

  $: recommended = allPosts.find((post) => post.slug === recommendedSlug);
  $: previous = allPosts.find((post) => post.slug === previousSlug);

  $: tiles = [
    {
      tileType: "Up Next",
      onClick: sendGa("previous-article", previousSlug),
      ...previous,
    },
    {
      tileType: "Recommended",
      onClick: sendGa("recommended", recommendedSlug),
      ...recommended,
    },
  ];
</script>

<div class="tiles">
  {#each tiles as tile}
    <a
      href="/blog/{tile.slug}"
      rel="prefetch"
      class="tile"
      on:click={tile.onClick}
    >
      {#if tile.headerimage}
        <img src={tile.headerimage} alt={tile.headeralt} />
      {/if}
      <div class="tile-title-group">
        <div class="tile-type">{tile.tileType}</div>
        <span class="tile-title">{tile.title}</span>
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

  .tile-title-group {
    color: #e04e1c;
    background: #fafafa;
    position: relative;
    max-width: 80%;
    font-size: 1.5rem;
    padding: 1rem 0.5rem 0.5rem;
    border-bottom: 0.5rem solid #e04e1c;
    margin-top: 10%;
    margin-right: 1rem;
  }
  .tile:last-child .tile-title-group {
    margin-right: 0;
    margin-left: 1rem;
  }
  .tile:hover .tile-title-group {
    color: #fafafa;
    background: #e04e1c;
  }

  .tile-type {
    font-size: 2rem;
  }

  .tile-title {
    line-height: 1;
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
