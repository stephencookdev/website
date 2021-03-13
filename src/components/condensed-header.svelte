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
        <a href="/blog">Blog</a>
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
    padding: 0.7rem 0.5rem 0.3rem;
    color: #fafafa;
    font-size: 1.2rem;
    font-weight: 100;
  }
</style>
