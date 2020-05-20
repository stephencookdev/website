<style>
  header nav {
    margin-top: 10vh;
  }
  @media (max-width: 600px) {
    header nav {
      margin-top: 20vh;
    }
  }

  section .talks-seperated {
    display: flex;
    flex-wrap: wrap;
  }
  section .talks-seperated a:not(:last-of-type) {
    position: relative;
    margin-right: 1em;
  }
  section .talks-seperated a:not(:last-of-type):after {
    position: absolute;
    top: 50%;
    right: calc(-0.5em - 1px);
    display: block;
    width: 2px;
    height: 2px;
    background: #999;
    content: "";
    pointer-events: none;
  }
</style>

<svelte:head>
  <title>Stephen Cook Dev</title>
</svelte:head>

<header class="grand">
  <h1>Stephen Cook</h1>
  <p>
    <a href="https://twitter.com/StephenCookDev">@stephencookdev</a>
  </p>

  <nav>
    <a title="About" href="#about">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12" y2="17" />
      </svg>
    </a>

    <a title="Talks" href="#talks">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
      </svg>
    </a>

    <a title="Blog" href="/blog" rel="prefetch">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 6.35 6.35">
        <defs />
        <g
          fill="none"
          stroke="currentColor"
          stroke-width=".4"
          style="transform: scale(1.1) translateX(-8%)">
          <path
            d="M1.32
            5.6c.43.54.68-.38.93-.3.12.04.2.52.46.26.38-.38.4-.59.99-.71.07-.02.15-.05.22-.03.1.03
            0 .28.1.28.03
            0-.08-.26-.12-.28-.38-.15-.87.26-.61.66.04.07.13.1.2.13.5.17.5-.56.48-.56-.02
            0 .05.46.3.46.58 0 .42-1.52.41-1.52-.12 0 .04.23.05.35.16
            1.57-.07-.37.05.76l.03.15v.18c.03.4-.02-.43
            0-.46.06-.12.53-.42.68-.15.3.52-.35.52-.63.61" />
          <path d="M.68 5.51s1.14-2.55 2.05-3.26c.91-.7 2.23-1.21 2.23-1.21" />
          <path
            d="M1.04
            4.68s.07-1.82.2-2.18c.13-.35.6-.98.6-.98l.1.53s.44-1.01.72-1.22C2.93.63
            4.05.48 4.2.48l1.34.05" />
          <path
            d="M1.04 4.68s.6-.13.93-.36c.33-.22 1.8-1.2 2.2-1.69.4-.48 1.37-2.1
            1.37-2.1" />
        </g>
      </svg>
    </a>

    <a title="Comics" href="/comics" rel="prefetch">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 6.35 6.35"
        fill="none"
        stroke="currentColor"
        stroke-width=".25"
        stroke-linecap="round">
        <path
          stroke-width=".5"
          d="M1.4559.8301C1.911.7791 2.3847.6625 2.8564.599c1.1499-.155
          1.4022-.1654
          2.3109.5285.2225.17.5114.3713.6302.6261.1344.2896.1274.5024.1401.8267.0206.5242-.1263.9362-.3852
          1.386-.037.0651-.058.1391-.105.1982-.0252.0318-.0767.0367-.105.0661-.0734.0762-.6086.7416-.8754.8936-.6865.3827-1.5014.4624-2.2759.4624-.1984
          0-.401.0386-.5952 0-.4947-.0983-.9037-.5763-1.0154-1.0212C.4057
          3.8662.477 2.778.7205
          2.091c.0886-.2505.1942-.506.3502-.7294.0315-.0447.1166-.1568.175-.1982.0296-.021.079-.0085.1051-.033.0165-.0157-.0165-.0505
          0-.0661.0039-.0037.1367-.033.035-.033" />
        <path
          d="M3.2039 2.4555c.0308-.0889-.035-.2167
          0-.304.0476-.119.2503-.2126.3508-.2572.6949-.3089.7245.8424.4443
          1.216-.1842.2456-.5014.2566-.6314-.0467-.088-.2052-.082-.4037-.1637-.608zM4.42
          4.1393c-.2735-.1367-.8055.0328-1.1226-.0467-.2616.4781.5328.6495.8186.421.1214-.0972.2095-.2483.304-.3743zM4.5369
          2.5257c-.0039-.1682.0536-.4934.2572-.5613.466-.1553.4498.68.3742.9822-.031.1239-.1736.2672-.2572.3508-.3307.3308-.568-.4486-.3742-.7717z" />
        <path
          fill="currentColor"
          d="M3.7184
          2.6894c-.01-.9235.4647-.111.2806.2572-.0976.1953-.3995-.0195-.2806-.2572zM4.876
          2.6894c.1532-.5518.2756.0568.152.304-.0149.0298-.1386.0635-.152.0234-.0348-.1043.046-.2353
          0-.3274z" />
      </svg>
    </a>

    <a title="GitHub" href="#open-source">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1024"
        height="1024"
        viewBox="0 0 1024 1024">
        <path
          fill="currentColor"
          d="M512 0C229.25 0 0 229.25 0 512c0 226.25 146.688 418.125 350.156
          485.812 25.594 4.688 34.938-11.125 34.938-24.625
          0-12.188-0.469-52.562-0.719-95.312C242 908.812 211.906 817.5 211.906
          817.5c-23.312-59.125-56.844-74.875-56.844-74.875-46.531-31.75
          3.53-31.125 3.53-31.125 51.406 3.562 78.47 52.75 78.47 52.75 45.688
          78.25 119.875 55.625 149 42.5 4.654-33 17.904-55.625
          32.5-68.375C304.906 725.438 185.344 681.5 185.344 485.312c0-55.938
          19.969-101.562 52.656-137.406-5.219-13-22.844-65.094 5.062-135.562 0 0
          42.938-13.75 140.812 52.5 40.812-11.406 84.594-17.031 128.125-17.219
          43.5 0.188 87.312 5.875 128.188 17.281 97.688-66.312 140.688-52.5
          140.688-52.5 28 70.531 10.375 122.562 5.125 135.5 32.812 35.844 52.625
          81.469 52.625 137.406 0 196.688-119.75 240-233.812 252.688 18.438
          15.875 34.75 47 34.75 94.75 0 68.438-0.688 123.625-0.688 140.5 0
          13.625 9.312 29.562 35.25 24.562C877.438 930 1024 738.125 1024 512
          1024 229.25 794.75 0 512 0z" />
      </svg>
    </a>
  </nav>
</header>

<section class="grand" id="about">
  <h1>About</h1>
  <div class="content">
    <h2>Who Am I?</h2>
    <p>
      I'm Stephen. I gave up a promising Mario Kart career in 2014, to instead
      focus on software engineering full-time.
    </p>
    <p>
      I'm reasonably full-stack, but I much prefer to focus on the front-end.
      Feel free to check out
      <a href="https://www.linkedin.com/in/scook628/">my LinkedIn</a>
      if you want some more words about projects and stacks.
    </p>

    <h2>Where Do I Work?</h2>
    <p>
      I currently work
      <a href="https://thread.com/">at Thread</a>
      as a front-end engineer.
    </p>
    <p>
      Thread is trying to make it easy to find clothes online, using fancy
      machine learning and in-house stylists to show you only clothes you'll
      like. It is a pretty cool company,
      <a href="https://thread.com/jobs">if you were looking&hellip;</a>
    </p>

    <h2>Find Me</h2>
    <p>You can find me on the internet in these places:</p>
    <ul>
      <li>
        <a href="https://twitter.com/StephenCookDev">Twitter</a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/scook628/">LinkedIn</a>
      </li>
      <li>
        <a href="https://medium.com/@stephen.cook/">Medium</a>
      </li>
    </ul>
  </div>
</section>

<section class="grand" id="talks">
  <h1>Talks</h1>
  <div class="content">
    <p>
      You can view my
      <a href="https://noti.st/stephencookdev/">Notist</a>
      here.
    </p>

    <h2>100% CSS Mario Kart</h2>
    <p>CSS allows us to select elements in the DOM, and style them.</p>
    <p>
      But how much more can it do &mdash; can we use it to make a fully
      interactive game, without touching JavaScript at all?
    </p>
    <p>
      This talk explores some cool CSS features, and applies them in such a way
      that brings the CSS Working Group to tears.
    </p>
    <p class="talks-seperated">
      <a href="https://vimeo.com/364369506">video</a>
      <a href="https://stephencookdev.co.uk/slides/mario-kart-css-talk">
        slides
      </a>
      <a href="https://github.com/stephencookdev/mario-kart-css-talk">
        slides source
      </a>
    </p>

    <h2>SVGs So Good, You Dodge the Blueshell</h2>
    <p>
      Icons on the web are everywhere, but sometimes it feels like just using
      normal img tags with PNGs is the easiest way.
    </p>
    <p>
      This talks looks at some common icon use-cases, and how using SVGs can
      make your life easier, and your website shinier.
    </p>
    <p class="talks-seperated">
      <a href="https://www.youtube.com/watch?v=oxInrNWKcIw">video</a>
      <a href="https://stephencook.dev/slides/dodge-the-blue-shell">slides</a>
      <a href="https://github.com/stephencookdev/dodge-the-blue-shell-talk">
        slides source
      </a>
    </p>

    <h2>Native-Like Animations with React-Router</h2>
    <p>
      React-router makes linking between parts of React applications a breeze.
    </p>
    <p>
      However, pages suddenly loading can look a bit janky, especially when
      compared to the swish animations that have become more the norm in native
      applications.
    </p>
    <p>
      This talk takes a look at how to achieve native-like transitions on the
      web, still using react-router, and without making your codebase
      unreadable.
    </p>
    <p class="talks-seperated">
      <a href="https://youtu.be/XVq86QKFcFI">video</a>
      <a href="https://stephencookdev.co.uk/slides/react-router-talk">slides</a>
      <a href="https://github.com/stephencookdev/react-router-talk">
        slides source
      </a>
    </p>
  </div>
</section>

<section class="grand" id="open-source">
  <h1>Open Source</h1>
  <div class="content">
    <p>
      You can view
      <a href="https://github.com/stephencookdev">my GitHub page</a>
      here.
    </p>
    <p>I do this and that with Open Source, but my main focuses are:</p>

    <h2>Speed Measure Plugin</h2>
    <p>
      <a href="https://github.com/stephencookdev/speed-measure-webpack-plugin/">
        Speed Measure Plugin
      </a>
      is a webpack plugin I created to help measure your build times.
    </p>
    <p>
      See how fast (or not) your plugins and loaders are, so you can optimise
      your builds.
    </p>

    <h2>React Static Render Plugin</h2>
    <p>
      <a href="https://github.com/thread/react-static-render-plugin/">
        React Static Render Plugin
      </a>
      is a webpack plugin I helped create at
      <a href="https://github.com/thread">Thread</a>
      to make statically rendering a React application embedded in a legacy site
      easier.
    </p>
    <p>
      It generates HTML fragments, that can then be included in your server
      templates.
    </p>

    <h2>Strict CSS Modules Loader</h2>
    <p>
      <a href="https://github.com/thread/strict-css-modules-loader/">
        Strict CSS Modules Loader
      </a>
      is a webpack plugin I helped create at
      <a href="https://github.com/thread">Thread</a>
      to help you detect bugs in your code, when accessing styling information.
    </p>
    <p>
      Wrap your CSS Modules objects in a proxy object, to warn if you attempt to
      access a non-existent style-name.
    </p>
  </div>
</section>
