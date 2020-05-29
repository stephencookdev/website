<script>
  import BlogMeta from "../../components/blog-meta.svelte";
  import CodeSandbox from "../../components/code-sandbox.svelte";
  import Code from "../../components/code.svelte";
</script>

<BlogMeta
  slug="writing-a-babel-plugin-with-grandma"
  title="Writing a Babel Plugin with Grandma"
  subtitle="How to Write a Custom Babel Plugin 👵📚"
  ogImage="/blog/writing-a-babel-plugin-with-grandma/parseTransformGenerate.png"
  keywords="javascript,babel,plugins,tutorial"
  published="2020-04-25">
  true
</BlogMeta>

<p>
  I wrote a custom Babel plugin that lets you write React with emoji. It was not
  a productive use of time.
</p>

<CodeSandbox id="like-grandma-made-jgri5" title="Like Grandma Made" />

<h2>How To Write a Babel Plugin</h2>

<p>
  In this post I’m going to walk you through how to make a Babel plugin, so you
  can make your own custom one, like
  <a href="https://github.com/stephencookdev/grandmas-own-jsx">
    grandmas-own-jsx.
  </a>
</p>

<p>
  I
  <i>suppose</i>
  you could also make a plugin that’s actually useful. I mean — I can’t
  physically stop you.
</p>

<h2>What is Babel?</h2>

<p>
  Before we add anything to Babel, we first need to understand it a bit. I
  assume you’re
  <i>roughly</i>
  familiar with Babel (if not,
  <a href="https://babeljs.io/docs/en/6.26.3/">give this a read first</a>
  ) — but let’s break it down a bit.
</p>

<p>
  At its heart, Babel does these 3 things:
  <b>parse,</b>
  <b>transform,</b>
  and
  <b>generate.</b>
</p>

<img
  src="/blog/writing-a-babel-plugin-with-grandma/parseTransformGenerate.png"
  alt={'a hand-drawn diagram showing some code being parsed, transformed, then generated'} />

<p>
  In other words, it
  <b>parses</b>
  our
  <i>input code</i>
  into an Abstract Syntax Tree (AST),
  <b>transforms</b>
  that AST into a different shape, and then
  <b>generates</b>
  code from the transformed AST.
</p>

<p>
  “AST” sounds confusing, but it’s just a fancy way of saying “code, but
  represented as a tree”.
</p>

<h2>What is a Babel Plugin</h2>

<p>
  A Babel plugin is code that we can add into the
  <b>transform</b>
  step. It’s important to note that this is the
  <i>only</i>
  step that we can influence. We can’t do anything to the
  <b>parse</b>
  step, which means
  <i>we can’t add custom syntax.</i>

</p>
<p>
  In other words, we’re limited to transforming
  <i>from</i>
  valid JavaScript,
  <i>to</i>
  valid JavaScript. If we want to transform something that isn’t valid
  JavaScript, we would
  <a href="https://github.com/babel/babylon/pull/5#issuecomment-195801336">
    need to modify Babel itself.
  </a>
</p>

<h2>How Do We Transform Code</h2>

<p>
  To transform the code, we need to traverse the AST we get given from the
  <b>parse</b>
  step. We can traverse this using a
  <b>visitor.</b>
  Let’s look at this simple Babel plugin:
</p>

<Code
  language="javascript"
  code={`
module.exports = function () {
  const SimpleVisitor = {
    StringLiteral(path, state) {
      if (path.node.value === "We'll never survive!") {
        path.node.value = "Nonsense. You're only saying that because no one ever has.";
      }
    },
  };
  
  return { visitor: SimpleVisitor };
};`} />

<p>Now, we could write code like this:</p>

<Code
  language="javascript"
  code={`
function fireSwamp () {  
  return "We'll never survive!";  
}`} />

<p>And it would run through Babel with our plugin, and compile to this:</p>

<Code
  language="javascript"
  code={`
function fireSwamp () {  
  return "Nonsense. You're only saying that because no one ever has.";  
}`} />

<p>
  What’s happening here? The visitor is an object mapping from the name of an
  AST node, to a function describing what to do with that node. So when Babel
  sees the matching
  <code>StringLiteral</code>
  , our plugin kicks in and transforms the string’s value.
</p>

<h2>How Do We Transform More Code?</h2>

<p>
  So we’ve looked at a really simple Babel plugin — let’s make something a bit
  more complicated. We’ll break down the code in the
  <a href="https://github.com/stephencookdev/grandmas-own-jsx">
    grandmas-own-jsx plugin
  </a>
  , step by step.
</p>

<Code
  language="javascript"
  code={`
module.exports = function ({ types: t }) {
  const GrandmaVisitorInitiator = {
    Program(path) {
      const commentLineTokens = path.parent.comments.filter(
        (token) => token.type === "CommentLine"
      );
      const commentBlockTokens = path.parent.comments.filter(
        (token) => token.type === "CommentBlock"
      );

      if (!commentLineTokens.length || !commentBlockTokens.length) return;

      const grandmasReference = buildGrandmasReference(commentLineTokens);
      const grandmasRecipes = buildGrandmasRecipe(commentBlockTokens);

      path.traverse(GrandmaVisitor, {
        grandmasReference: grandmasReference,
        grandmasRecipes: grandmasRecipes,
      });
    },
  };
  
  return { visitor: GrandmaVisitorInitiator };
};`} />

<p>
  Since
  <code>grandmas-own-jsx</code>
  leverages comments, the first thing we do is look through the
  <code>CommentLine</code>
  and
  <code>CommentBlock</code>
  elements in the
  <code>Program</code>
  node. We use these comments to get the information we need to build our React
  elements later on.
</p>

<p>
  Next, we set up a
  <i>new</i>
  visitor to run on the rest of the tree. This lets us pass down state as we
  traverse the tree, without depending on global state.
</p>

<Code
  language="javascript"
  code={`
path.traverse( // traverse the tree down from the current node  
  GrandmaVisitor, // the new visitor  
  { ... } // the state our new visitor should get  
);`} />

<p>So let’s take a look at the new visitor:</p>

<Code
  language="javascript"
  code={`
module.exports = function ({ types: t }) {
  const GrandmaVisitor = {
    StringLiteral(path, state) {
      if (path.node.value === "👵") {
        const recipeRef = state.grandmasRecipes[path.node.loc.start.line];
        const recipeMatches = recipeRef && recipeRef.start > path.node.start;
        if (recipeMatches) {
          const recipe = recipeRef.value;
          const domStruc = cookRecipe(recipe, state.grandmasReference);

          const typeExpression = genTypeExpression(domStruc);

          path.replaceWith(typeExpression);
        }
      }
    },
  };
  
  const GrandmaVisitorInitiator = { /* ... */ };

  return { visitor: GrandmaVisitorInitiator };
};`} />

<p>
  Here, we first look for any string that is just
  <code>"👵"</code>
  in our program. From the state that we were passed from the
  <code>GrandmaVisitorInitiator</code>
  , we grab the reference of what React elements are meant to be there.
</p>

<p>
  Then, we generate a
  <i>new sub-tree</i>
  with
  <code>genTypeExpression</code>
  (we’ll look at that in a moment).
</p>

<p>
  Finally, we
  <i>replace</i>
  the current node (the
  <code>"👵"</code>
  string) with
  <i>the new sub-tree</i>
  using
  <code>replaceWith</code>
  . In other words, we’re performing a transform like this:
</p>

<img
  src="/blog/writing-a-babel-plugin-with-grandma/parseTransformGrandmaGenerate.png"
  alt={'a hand-written diagram showing the AST transform of ‘👵’ to a React expression'}
  title="The most ridiculous diagram I think I’ve ever drawn" />

<h2>Generating Sub-Trees (Type Expressions)</h2>

<p>
  In the previous step we created a whole new sub-tree of our AST using
  <code>genTypeExpression</code>
  . Babel lets us generate these AST sub-trees using type expressions — let’s
  dig into how create these using the
  <code>types</code>
  builders that Babel provides:
</p>

<Code
  language="javascript"
  code={`
module.exports = function ({ types: t }) {
  const genTypeExpression = (node) => {
    return t.callExpression(
      t.memberExpression(t.identifier("React"), t.identifier("createElement")),
      [
        /^[A-Z]/.test(node.type[0])
          ? t.identifier(node.type)
          : t.stringLiteral(node.type),
        t.objectExpression(node.args),
        ...node.children.map(genTypeExpression),
      ]
    );
  };

  const GrandmaVisitor = { /* ... */ };
  const GrandmaVisitorInitiator = { /* ... */ };
  
  return { visitor: GrandmaVisitorInitiator };
};`} />

<p>
  By calling e.g.
  <code>t.callExpression</code>
  we create a
  <code>CallExpression</code>
  node. Similarly, to create a
  <code>StringLiteral</code>
  we would call
  <code>t.stringLiteral</code>
  .
</p>

<p>
  To build a particularly complex tree, I would strongly recommend first using
  something like
  <a href="https://astexplorer.net/">AST explorer</a>
  to get the AST node names, and then find the corresponding builder in
  <a href="https://babeljs.io/docs/en/next/babel-types.html">
    the babel-types documentation,
  </a>
  so you know which arguments are needed.
</p>

<h2>Summary</h2>

<p>You should now know:</p>

<ul>
  <li>What Babel does (parse, transform, generate)</li>
  <li>
    To use
    <a href="https://astexplorer.net/">AST explorer</a>
    to view code’s corresponding AST
  </li>
  <li>How to create a visitor to traverse and modify an AST</li>
</ul>

<p>
  And that’s it! Go forth and create your own Babel plugins! You could turn
  <a href="https://github.com/styled-components/babel-plugin-styled-components">
    CSS comments into real CSS,
  </a>
  transpile
  <a href="https://github.com/airbnb/babel-plugin-dynamic-import-node">
    import statements to deferred require statements,
  </a>
  or maybe… just maybe… make a stupid alternative to JSX that depends heavily on
  the 👵 emoji.
</p>

<blockquote class="twitter-tweet">
  <p lang="en" dir="ltr">
    I made my own babel plugin so I can stop writing JSX and just write emoji
    instead.
    <br />
    <br />
    I&#39;m not doing so well with the isolation.
    <a href="https://t.co/EzbqLDMiJC">https://t.co/EzbqLDMiJC</a>
  </p>
  &mdash; Stephen Cook (@StephenCookDev)
  <a
    href="https://twitter.com/StephenCookDev/status/1246887081277902852?ref_src=twsrc%5Etfw">
    April 5, 2020
  </a>
</blockquote>
