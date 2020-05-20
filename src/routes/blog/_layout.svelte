<script>
  import CondensedHeader from "../../components/condensed-header.svelte";
</script>

<style>
  main :global(h2) {
    text-align: center;
    margin: 3rem auto;
  }

  main :global(h2 small) {
    display: block;
    font-weight: 500;
    text-transform: none;
    font-size: 0.9rem;
  }

  main :global(blockquote) {
    margin-top: 3.5rem;
    margin-bottom: 3rem;
  }
  main :global(blockquote p) {
    margin-bottom: 0.7rem;
    font-weight: 100;
    position: relative;
  }
  main :global(blockquote p::before),
  main :global(blockquote p::after) {
    position: absolute;
    font-size: 4rem;
    line-height: 0;
    color: #e04e1c;
  }
  main :global(blockquote p::before) {
    content: "“";
    top: 1rem;
    left: -1.5rem;
    margin-left: -0.5rem;
  }
  main :global(blockquote p::after) {
    content: "”";
    margin-top: 1.5rem;
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
</style>

<CondensedHeader />

<main>
  <slot />
</main>
