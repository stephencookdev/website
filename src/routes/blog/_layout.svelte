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
    padding: 0;
  }
  @media (max-width: 800px) {
    nav ul {
      margin: 0 -0.5rem;
    }
  }
  nav ul a {
    padding: 0.5rem;
    color: #fafafa;
    font-size: 1.2rem;
    font-weight: 100;
  }

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

<main>
  <slot />
</main>
