<script>
  import BlogMeta from "../../components/blog-meta.svelte";
</script>

<BlogMeta
  slug="speeding-up-webpack"
  title="🔥 Speeding Up Webpack"
  subtitle="Seven 3 second changes to reduce build time by 77%"
  headerImage="/blog/speeding-up-webpack/snail.jpg"
  headerAlt={'a snail on a clock'}
  keywords="webpack,speed,slow,optimise"
  published="2018-03-28">
  true
</BlogMeta>

<p>
  It’s only so often you can wait 5 whole seconds for your build to apply your
  <code>color: blue;</code>
  to
  <code>color: red;</code>
  change…
</p>

<p>
  At Onfido, we use webpack as our module bundler. As is always the case given
  the speed of development, our webpack config grew organically, and the speed
  of the pipeline was an after-thought.
</p>

<img
  src="/blog/speeding-up-webpack/stop-the-madness.gif"
  alt="Stop the madness" />

<p>
  But there came a tipping point. Eventually, we snapped and decided to get that
  build time
  <i>way</i>
  down.
</p>

<p>
  There are already some great articles that discuss ways to increase build
  speed. To name just a few:
</p>

<ul>
  <li>
    <a
      href="https://medium.com/ottofellercom/0-100-in-two-seconds-speed-up-webpack-465de691ed4a">
      0–100 in two seconds — speed up webpack
    </a>
    <a href="https://medium.com/@gvidon">(by gvidon)</a>
  </li>
  <li>
    <a
      href="https://slack.engineering/keep-webpack-fast-a-field-guide-for-better-build-performance-f56a5995e8f1">
      Keep webpack Fast
    </a>
    <a href="https://slack.engineering/@rowanoulton">(by Rowan Oulton)</a>
  </li>
  <li>
    <a href="https://github.com/webpack/docs/wiki/build-performance">
      build performance
    </a>
    (on the webpack wiki)
  </li>
</ul>

<p>
  We followed these articles very closely, and used a lot of their suggestions.
  But, we also made some changes that haven’t been commonly mentioned anywhere
  else — so I want to discuss them here.
</p>

<h2>1. Measure</h2>

<p>
  We started by measuring our performance. This really helps to find your
  current bottlenecks, and compare your progress as you make changes.
</p>

<p>
  I created the
  <a href="https://github.com/stephencookdev/speed-measure-webpack-plugin/">
    Speed Measure Plugin
  </a>
  for webpack, which we used to analyse the performance of our plugins and
  loaders. This let us focus our search, and work out where the easiest wins
  were.
  <a href="/blog/announcing-smp">I’ve talked about SMP a bit already,</a>
  so won’t go into it in any more detail in this post.
</p>

<p>
  Overall, in a repo containing around 50,000 lines of JS/CSS code, these were
  our build times:
</p>

<ul>
  <li>
    Locally (full build):
    <b>1 min, 48 secs</b>
  </li>
  <li>
    Locally (watch mode changes
    <b>): 6.49 secs</b>
  </li>
  <li>
    Jenkins (full production build):
    <b>3 mins, 26 secs</b>
  </li>
</ul>

<h2>
  2. Upgrade and Parallelise
  <code>UglifyJsPlugin</code>
</h2>

<p>
  Even a cursory glance at SMP’s output shows that
  <code>UglifyJsPlugin</code>
  takes a long time to run. For us it took
  <b>65%</b>
  of the
  <b>entire build</b>
  time!
</p>

<p>
  We were originally using webpack 3’s built-in
  <code>UglifyJsPlugin</code>
  which is set at version 0.4.6.
</p>

<p>
  However, there’s nothing stopping you from upgrading your
  <code>UglifyJsPlugin</code>
  version without upgrading webpack, and just manually importing the plugin
  instead.
</p>

<p>
  Version 1 of the plugin introduces some performance features — namely
  parallelisation, and caching. If you’re only uglifying on a build server like
  Jenkins, then caching doesn’t really help you.
</p>

<p>
  Turning on the
  <code>parallel</code>
  flag, however, can save you a lot of time — depending on how beefy your
  machine is, and how many cores it has. For us, running on i3.4xlarge EC2
  instances with 16 vCPUs, this was considerable.
</p>

<p>
  <i>
    Time saved: 🔥
    <b>1 minute</b>
    on Jenkins
  </i>
</p>

<h2>3. Remove Image Loaders for Local Development</h2>

<p>
  Most webpack configs have a rule to handle images, and that rule is normally
  <code>file-loader</code>
  followed by
  <code>image-webpack-loader</code>
  , or some other similar image loader.
</p>

<p>
  But the only necessary loader here is the
  <code>file-loader</code>
  , which actually allows the image to end up in the output directory, and its
  URI passed to the bundle.
</p>

<p>
  The
  <code>image-webpack-loader</code>
  optimises these images, minifying and re-encoding them. For local development,
  this is quite a lot of unnecessary work.
</p>

<p>
  <i>
    Time saved:
    <b>20 seconds</b>
    locally
  </i>
</p>

<h2>4. Don’t Cache for Production Builds</h2>

<p>
  There are a few ways to cache with webpack — like using
  <code>cache-loader</code>
  ,
  <code>HardSourceWebpackPlugin</code>
  , or the
  <code>?cacheLoader</code>
  babel flag. All of these caching methods have an overhead to boot up. The time
  saved locally during a re-run is huge, but the
  <b>initial</b>
  (cold) run will actually be slower.
</p>

<p>
  Caching on production builds that should be running from scratch each time
  anyway will just be slowing you down.
</p>

<p>
  <i>
    Time saved:
    <b>15 seconds</b>
    on Jenkins
  </i>
</p>

<h2>
  5. Remove
  <code>coffee-loader</code>
</h2>

<p>
  We had some legacy code that was written in CoffeeScript. This was never seen
  as that big a deal before, as the code was rarely touched, and the loader did
  its job fine.
</p>

<p>
  However, SMP revealed that
  <code>coffee-loader</code>
  was taking
  <b>1,078 ms</b>
  on average for each module. Compared with
  <code>babel-loader</code>
  taking an average of
  <b>561 ms,</b>
  this was an obvious enough opportunity for improvement. Not to mention the
  benefit of reducing the npm install time, and reducing our dependency count!
</p>

<p>
  Simply transpiling the CoffeeScript files to JS with the
  <code>coffee</code>
  CLI, and then manually cleaning them up removed this dependency for us.
</p>

<p>
  <i>
    Time saved:
    <b>10 seconds</b>
  </i>
</p>

<h2>6. Remove ExtractTextPlugin for Local Development</h2>

<p>
  Using
  <code>ExtractTextPlugin</code>
  splits out part of your bundle into a separate files — most often by splitting
  out stylesheets into a separate CSS file.
</p>

<p>
  This can speed up the end-user’s experience, but adds overhead into the
  compilation steps. So again, when running locally, this is unnecessary work.
  Fortunately, this plugin comes with a simple
  <code>disable</code>
  flag!
</p>

<p>
  (note that this is different to
  <code>DllPlugin</code>
  which splits out your bundle into a separate file, but does so in an entirely
  different process — which does massively help with your build speed).
</p>

<p>
  Time saved:
  <b>7 seconds</b>
  locally
</p>

<h2>
  7. Use Vanilla
  <code>css-loader</code>
  When Possible
</h2>

<p>
  Whether you’re using PostCSS, SASS, or any other CSS tool, you likely don’t
  need it running on
  <i>all</i>
  of your stylesheets. For us, we had some old legacy stylesheets, and
  stylesheets coming from third-party dependencies, which were all vanilla CSS.
</p>

<p>
  These don’t need to run through PostCSS or SASS to compile into CSS — so
  separating out these into separate loader configs can give you a slight speed
  boost.
</p>

<p>
  Time saved:
  <b>2 seconds</b>
</p>

<hr />

<p>All things said and done, we reduced our build times to the following:</p>

<ul>
  <li>
    Locally (full build, cold) — 1m48s →
    <b>58 secs</b>
    / (-46%)
  </li>
  <li>
    Locally (full build, warm) — 1m48s →
    <b>25 secs</b>
    / (-77%)
  </li>
  <li>
    Locally (watch mode changes) — 6.49s →
    <b>1.93 secs</b>
    / (-70%)
  </li>
  <li>
    Jenkins (full production build)— 3m26s →
    <b>1 min, 5 secs</b>
    / (-61%)
  </li>
</ul>

<p>Not too shabby!</p>

<img
  src="/blog/speeding-up-webpack/the-flash.gif"
  alt="The Flash running quickly" />

<p>
  But the webpack arts are dark ones, and I’m sure that we’ve missed many good
  tricks. Keep vigilant, webpackers — and be sure to
  <a href="https://twitter.com/stephencookdev/">
    share anything you think we’ve missed here!
  </a>
</p>
