<script>
  import BlogMeta from "../../components/blog-meta.svelte";
  import Quote from "../../components/quote.svelte";
  import CodeSandbox from "../../components/code-sandbox.svelte";
</script>

<BlogMeta
  slug="mario-kart-css"
  title="🏎 Mario Kart: CSS 🏁"
  subtitle="Interactive Mario Kart with Only CSS"
  headerImage="/blog/mario-kart-css/mario-kart-header.png"
  headerAlt="Mario Kart alongside a sample 13 lines of HTML"
  keywords="mario-kart,css,silly"
  published="2018-04-16"
>
  true
</BlogMeta>

<p>
  People say JavaScript is a bad language. No built-in types, a fatiguing
  ecosystem, and demanding you to constantly explain, “no, no, Java<b
    ><i>Script</i></b
  >” to anyone even vaguely non-technical.
</p>

<p>
  That’s why for my new Mario Kart knock-off game, I’ve logically decided
  against using JavaScript at all. To be clear, this is
  <i>100% CSS.</i>
  My Photoshop licence ran out a while back, so this is:
</p>

<ul>
  <li>0 images</li>
  <li>0 lines of JavaScript</li>
  <li>Just 100% CSS</li>
  <li>(okay fine, and 13 lines of HTML)</li>
</ul>

<CodeSandbox id="zk15o120xl" title="Mario Kart CSS" initialFile="main.css" />

<p>
  You can control the racer using
  <a href="https://en.wikipedia.org/wiki/Arrow_keys#WASD_keys">
    WASD controls.
  </a>
  So how does it work? Let’s break it down.
</p>

<h2>Racers</h2>

<p>
  A cool thing that the CSS spec allows you to do with
  <code>box-shadow</code>
  and
  <code>linear-gradient</code>
  is to specify an arbitrary number of points. This is useful if you wanted two or
  three gradients, or to create some very basic CSS shapes.
</p>

<p>
  It’s also helpful if you wanted to manually specify every individual pixel of
  an image… one-by-one… in order… directly into your stylesheet… until
  eventually you have the original image stored in your source file!
</p>

<p>
  I actually got this idea from reading
  <a
    href="https://medium.com/@alcidesqueiroz/super-mario-world-in-css-100-css-no-javascript-no-embedded-images-data-uris-no-external-e43dc0c2b1f4"
  >
    Alcides Queiroz’ great post
  </a>
  on creating a Pure CSS Super Mario animation.
</p>

<p>
  You might argue that this is absurd, has a much larger data cost than even the
  most naive image encoding, without
  <i>even going into</i>
  the implications of putting image-data into source files. And I might ignore your
  argument, and continue to speak, but slightly louder.
</p>

<p>Doing so allows us to create our racers, like below:</p>

<CodeSandbox
  id="7jk054508q"
  title="Mario Kart CSS (Just Mario)"
  initialFile="mario.css"
/>

<h2>Driving</h2>

<p>
  CSS is intentionally designed to be minimally interactive, so getting a kart
  that changes direction depending on keyboard input is a challenge.
</p>

<p>
  My initial thought was to have an
  <code>&lt;input type="text" /&gt;</code>, and have some selectors like
  <code>[type="text"][value="foo"]</code>.
</p>

<p>
  Tim Carry
  <a href="https://stories.algolia.com/a-search-engine-in-css-b5ec4e902e97">
    gave a great talk
  </a>
  on a Pure CSS search engine (with equally horrifying CSS). He used a very similar
  idea to drive his dynamic search results. The only drawback to the idea is that
  <b>
    <i>it doesn’t actually work.</i>
  </b>
  <code>value</code>
  isn’t set when you type — it’s only the
  <i>initial</i>
  value that you can see in CSS. To get around this, Tim used
  <i>1 line</i>
  of JavaScript to set the
  <code>value</code>
  on input change.
</p>

<p>
  This is a fine workaround, and I certainly can’t fault Tim for it. In fact, I
  would have loved to have used the workaround. Unfortunately, I accidentally
  disabled JavaScript on my browser a few weeks ago, and still haven’t worked
  out how to turn it back on.
</p>

<p>
  So I needed something that CSS
  <i>did</i>
  respond to, with no JavaScript workarounds. After a few hours of searching around,
  I finally found a pseudoselector that looked to be of use —
  <code>:valid</code>.
</p>

<p>
  An input <a
    href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-pattern"
    >with a pattern</a
  >
  specified has the corresponding <code>:valid</code> and <code>:invalid</code>
  pseudoselectors. This gives us 2 states to play with. Along with the
  <code>:placeholder-shown</code>
  selector, which tells us if the input is empty, we have 3 total states.
  <b>Empty</b>
  (middle), <b>valid</b> (left), and <b>invalid</b> (right).
</p>

<p>
  So with a giant invisible input, we get an interactive page that responds to
  left-right input.
</p>

<CodeSandbox id="8ylwqq8j39" title="CSS Input Example" initialFile="main.css" />

<h2>Animation</h2>

<p>
  Once <i>able</i> to respond to left/right input, we need to get the racers to
  <i>actually</i> turn left or right.
</p>

<p>
  We can do this by making 1 big racer image, made up of each frame of the
  “turning” animation. This gives us our sprite, like the following image:
</p>

<img
  src="./blog/mario-kart-css/mario-sprite-example.png"
  alt="A sprite of Mario"
/>

<p>
  This allows us to then specify a manual keyframe animation, going through each
  “frame” of the image.
</p>

<CodeSandbox
  id="62r107792k"
  title="Mario Turning Example"
  initialFile="main.css"
/>

<h2>Racer Select</h2>

<p>
  My brother always takes Mario when we play together, so I needed to be able to
  pick another racer. I picked Bowser because I respect how he’s not afraid to
  fail repeatedly at a task, despite not having a clear end-goal.
</p>

<p>
  To make the selection menu, we can make some <code>radio</code> inputs
  representing each racer. Our output should then show a different thing
  depending on which input is <code>:checked</code>, using the sibling
  combinators <code>+</code>, and <code>~</code>.
</p>

<CodeSandbox
  id="y0wk0920kx"
  title="Racer Selection Example"
  initialFile="main.css"
/>

<h2>Toggle Menus</h2>

<p>
  And lastly we need a way to be able to “toggle” menus as either open or
  closed.
</p>

<p>
  I was originally planning on having the menus just be permanently open — but
  this isn’t great for small screens, and my mum insisted on having the game on
  her phone so she could show her friends “how grown-up he’s getting”. So
  toggling menus it is.
</p>

<p>
  We can do this by listening to the <code>:focus</code> of whichever button you
  want to open the menu, and then allowing that button to lose focus when you want
  the menu to close.
</p>

<CodeSandbox
  id="ymxzyqlypz"
  title="Menu Toggle Example"
  initialFile="main.css"
/>

<h2>Conclusion</h2>

<p>
  In case it wasn’t painfully clear when I mentioned injecting pixel-by-pixel
  image data in your stylesheets, allow me to emphasise:
  <b>please don’t do any of these things.</b>
</p>

<p>
  This is mostly a thought experiment to see how far CSS can be pushed when you
  don’t have to worry about peer reviews, or your peers’ respect.
</p>

<p>
  But do <a href="https://twitter.com/StephenCookDev">follow me on Twitter,</a> and
  share this if you enjoyed it!
</p>

<p>
  And keep an eye out for my next instalment: <b
    >Converting Your webpack Config to be 100% CSS.</b
  >
</p>
