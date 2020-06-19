<script>
  import BlogMeta from "../../components/blog-meta.svelte";
  import Code from "../../components/code.svelte";
</script>

<BlogMeta
  slug="announcing-smp"
  title="⏱ Announcing SMP: Speeding Up webpack With Timers"
  subtitle="Measure the Speed of Your webpack Loaders and Plugins"
  ogImage="/blog/announcing-smp/smp-logo.png"
  keywords="webpack,speed,tools,javascript"
  published="2018-02-26">
  false
</BlogMeta>

<p>
  Measuring may not be the sexiest part of going fast, but it’s an important
  one. That’s why I’m excited to announce the
  <a href="https://github.com/stephencookdev/speed-measure-webpack-plugin">
    Speed Measure Plugin
  </a>
  for webpack, that I’ve been working on. Super easy to use, and compatible with
  all loaders and plugins by default — it’s available to use now, from
  <a href="https://github.com/stephencookdev/speed-measure-webpack-plugin">
    GitHub
  </a>
  and
  <a href="https://www.npmjs.com/package/speed-measure-webpack-plugin">npm.</a>
</p>

<img src="./blog/announcing-smp/smp-logo.png" alt="SMP logo" />

<p>
  Just changing your webpack config from
  <code>{'{ plugins: [new XPlugin()] }'}</code>
  to
  <code>{'smp.wrap({ plugins: [new XPlugin()] })'}</code>
  — gives you console output like this:
</p>

<img
  src="./blog/announcing-smp/smp-output.png"
  alt="Preview of console output from SMP" />

<p>
  Knowing which plugins and loaders are causing lag is half the battle — the
  other half is cutting out or trimming down the parts that are slowing you
  down.
</p>

<h2>Using SMP</h2>

<p>
  So how do we use the plugin? And how will that ultimately help us to speed up
  our webpack build?
</p>

<p>
  Let’s look at a basic example — imagine we have the following webpack config:
</p>

<Code
  language="javascript"
  code={`
const ForceCaseSensitivityPlugin = require("force-case-sensitivity-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");

module.exports = {
  entry: {
    app: ["./app.js"]
  },
  output: "./public",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.coffee$/,
        use: [{ loader: "coffee-loader" }]
      }
    ]
  },
  plugins: [
    new ForceCaseSensitivityPlugin(),
    new ManifestPlugin()
  ]
};`} />

<p>
  As it stands, webpack will tell us that our build takes however long overall.
  But from there on, other than adding/removing plugins and loaders to see how
  that number changes, we don’t know which parts are taking the longest.
</p>

<p>
  So let’s first add
  <code>SpeedMeasurePlugin</code>
  . To do this, we need to change our webpack config to something like this:
</p>

<Code
  language="javascript"
  code={`
const ForceCaseSensitivityPlugin = require("force-case-sensitivity-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  entry: {
    app: ["./app.js"]
  },
  output: "./public",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.coffee$/,
        use: [{ loader: "coffee-loader" }]
      }
    ]
  },
  plugins: [
    new ForceCaseSensitivityPlugin(),
    new ManifestPlugin()
  ]
});`} />

<p>
  And that’s it! By default, SMP will now start printing timing output to your
  console (you can also
  <a
    href="https://github.com/stephencookdev/speed-measure-webpack-plugin#optionsdisable">
    disable SMP entirely
  </a>
  with a flag).
</p>

<p>
  Now let’s have a look at the plugins section of our output, which should look
  something like this:
</p>

<Code
  code={`
ForceCaseSensitivityPlugin took 4.21 secs
ManifestPlugin took 0.11 secs`} />

<p>
  So immediately we see that the
  <a href="https://github.com/dcousineau/force-case-sensitivity-webpack-plugin">
    force-case-sensitivity-webpack-plugin
  </a>
  is taking an inordinately large amount of time for what it’s doing (just
  comparing case-sensitivity of require statements). And indeed, looking at the
  GitHub page, the author has actually archived the project in favour of
  <a href="https://github.com/Urthen/case-sensitive-paths-webpack-plugin">
    case-sensitive-paths-webpack-plugin,
  </a>
  because of performance issues. So let’s give that plugin a spin, instead.
</p>

<Code
  code={`
CaseSensitivePathsPlugin took 0.32 secs
ManifestPlugin took 0.12 secs`} />

<p>A pretty noticeable improvement!</p>

<p>So that’s the plugins, how about the loaders?</p>

<Code
  code={`
babel-loader took 21.51 secs
  module count = 150
coffee-loader took 5.52 secs
  module count = 21
modules with no loaders took 3.13 secs
  module count = 143`} />

<p>
  First of all, what’s
  <code>modules with no loaders</code>
  ? Not all modules get piped through webpack through a named loader (e.g. plain
  ol’ JS files from
  <code>node_modules</code>
  ) — the timings of these modules goes under this
  <code>modules with no loaders</code>
  section.
</p>

<p>
  Second of all, what’s a
  <code>module</code>
  ? Each file or fragment that gets loaded into webpack (usually via a loader)
  is called a “module”. In most cases, you can just think of this as a file that
  you’re
  <code>require</code>
  ing somewhere in your code. You can read more about it in the
  <a href="https://webpack.js.org/concepts/modules/">official webpack docs,</a>
  if you want a more in depth explanation.
</p>

<p>
  So, in this example we can see that the coffee-loader is taking 5.52s for just
  21 files. These coffeescript files have probably just never been ported
  because no-one wanted to touch some legacy code, and they weren’t doing any
  harm.
</p>

<p>
  But looking at how long they’re taking in the grand-scheme of things, it might
  well by worth porting them now to vanilla JS.
</p>

<Code
  code={`
babel-loader took 24.41 secs
  module count = 171
modules with no loaders took 3.13 secs
  module count = 143`} />

<p>Much better!</p>

<p>
  And if you’re struggling to compare these results in your workspace, more
  explicit statistical information (such as mean, median, and standard deviation
  of time) are available in
  <code>humanVerbose</code>
  mode — as explained in the section about
  <code>options.outputFormat</code>
  in
  <a
    href="https://github.com/stephencookdev/speed-measure-webpack-plugin#optionsoutputformat">
    the README.
  </a>
</p>

<p>Hopefully this glimpse into what SMP can give you has been helpful!</p>

<h2>Give it a Spin!</h2>

<p>
  SMP is ready to go, so please — try it out, and see where your webpack build
  is dragging its feet!
</p>

<ul>
  <li>
    <a href="https://github.com/stephencookdev/speed-measure-webpack-plugin">
      GitHub
    </a>
  </li>
  <li>
    <a href="https://www.npmjs.com/package/speed-measure-webpack-plugin">npm</a>
  </li>
</ul>

<p>
  Let me know how you get on, and don’t be shy about raising issues or requests!
</p>
