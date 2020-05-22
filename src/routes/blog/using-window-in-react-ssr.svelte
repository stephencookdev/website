<script>
  import BlogMeta from "../../components/blog-meta.svelte";
  import Quote from "../../components/quote.svelte";
  import CodeSandbox from "../../components/code-sandbox.svelte";
</script>

<BlogMeta
  slug="using-window-in-react-ssr"
  title="Using window in React SSR: The Complete Guide"
  subtitle="What “window is not defined” and “expected server html to div”
  really mean"
  headerImage="/blog/using-window-in-react-ssr/broken-window.jpg"
  headerAlt="2 people stood in a glass house with broken windows"
  keywords="react,ssr,how-to,error"
  published="2020-05-25">
  false
</BlogMeta>

<p>
  You’ve just made your React app Server Side Rendered (SSR), and you’re greeted
  with a terrifying “uncaught reference error” telling you that
  <code>window is not defined</code>
  , or
  <code>document is not defined</code>
  . You side-step that, and now you see some warnings telling you
  <code>Warning: Expected server HTML to contain a div</code>
  .
</p>

<p>Uhh… What’s going on?</p>

<h2>
  Why is
  <code>window</code>
  not defined?
</h2>

<p>
  With SSR, your app basically runs twice. In the end, it will run on the user’s
  browser, like normal. But
  <i>first</i>
  it will run on a server.
</p>

<p>
  What you need to remember is that this is a
  <i>server</i>
  , so things like
  <code>window.innerWidth</code>
  simply does not make sense. What’s the width of the browser window? There is
  no browser window. Because of this, servers simply don’t provide a
  <code>window</code>
  global.
</p>

<p>
  The same goes for
  <code>document</code>
  .
</p>

<p>
  Sometimes it’s not even your code that depends on
  <code>window</code>
  ! At the time of writing this, hellosign-embedded, react-stripe-elements,
  react-chartjs all depend on
  <code>window</code>
  and will break if you try to render them with SSR.
</p>

<p>
  To get around this, you can check before using
  <code>window</code>
  in your app, by running
  <code>if (typeof window === "undefined") return null</code>
  .
</p>

<h2>Hydration Warnings</h2>

<p>
  But wait! Although you can just
  <code>return null</code>
  if
  <code>window</code>
  isn’t defined — but this is going to run you into more problems, if you don’t
  understand what’s going on.
</p>

<p>
  When
  <code>ReactDOM.hydrate</code>
  runs, it builds up the VDOM of your app fully on the user’s browser, and then
  compares this to the
  <i>actual</i>
  DOM (which has been SSR’d with some initial content).
</p>

<p>
  If the VDOM and the DOM don’t match up, then
  <code>ReactDOM</code>
  gets very confused, and tries to warn you by telling you that it
  <code>expected server code to contain div</code>
  (or whatever tag it was expecting, it doesn’t have to be a
  <code>div</code>
  ).
</p>

<p>But why do we care? Can’t we just supress or ignore the warning?</p>

<p>
  So, yes, you can supress the warning with
  <code>suppressHydrationWarning</code>
  — but you shouldn’t! Doing so can seriously break your app.
</p>

<p>
  If the VDOM and DOM don’t match up, then React might just ignore an entire
  part of the VDOM. In other words, if you do something like this:
</p>

<code>
  {`const MyComponent = () => {
  if (typeof window === "undefined") return null;

  return <div>🍩</div>;
}`}
</code>

<p>Then you might never see your 🍩.</p>

<p>
  You
  <i>might</i>
  get away with it, depending on how the React internals happen to end up
  rendering this specific component… But in my experience you have about a 50/50
  chance of something going wrong.
</p>

<h2>
  Safely Using
  <code>window</code>
</h2>

<p>
  So how do we safely use
  <code>window</code>
  without causing our app to break?
</p>

<p>
  Fortunately, we can create a very simply React hook in order to detect if
  we’re on the server or not.
</p>

<code>
  {`import { useState, useEffect } from "react";

const useIsSsr = () => {
  // we always start off in "SSR mode", to ensure our initial browser render
  // matches the SSR render
  const [isSsr, setIsSsr] = useState(true);

  useEffect(() => {
    // \`useEffect\` never runs on the server, so we must be on the client
    setIsSsr(false);
  }, []);

  return isSsr;
}
`}
</code>

<p>
  Now we can use this hook instead of checking for
  <code>typeof window</code>
  directly.
</p>

<code>
  {`const MyComponent = () => {
  const isSsr = useIsSsr();
  if (isSsr) return null;

  return <div>🍩</div>;
}`}
</code>

<p>
  And this guarantees that our initial browser render will match the initial
  server render. Then, we immediately render again, filling in all of the
  components that need
  <code>window</code>
  , all without confusing ReactDOM.
</p>

<h2>Preventing Flashing</h2>

<p>
  Great, we’re doing things safely now — but now we’re seeing all of our
  components that rely on
  <code>window</code>
  pop in, which looks a bit janky.
</p>

<p>
  The key here is to do a bit more than just
  <code>return null</code>
  . Although this is super easy, it means that in the initial payload we’re
  literally not sending the component’s markup at all.
</p>

<p>
  For some components, this is okay. When it’s not — we need to create a
  <i>placeholder</i>
  version of the component.
</p>

<p>
  We don’t need this placeholder component to have any functionality, we just
  need it to
  <i>look</i>
  as close to the component as we can, without depending on
  <code>window</code>
  at all.
</p>

<p>For example, in this component:</p>

<code>
  {`const WindowSizePredictor = () => {
  const isSsr = useIsSsr();
  if (isSsr) return null;

  const screenWidth = window.innerWidth;
  const lookIntoBall =
    '🔮 Look into the crystal ball... Yes, I see it clearly...';
  const yourWidthIs = \`Your window is \${screenWidth}!\`;

  return (
    <div>
      <p>{lookIntoBall}</p>
      <p>{yourWidthIs}</p>
    </div>
  );
}
`}
</code>

<p>We might prevent the flash by changing it to this:</p>

<code>
  {`const WindowSizePredictor = () => {
  const isSsr = useIsSsr();

  const screenWidth = isSsr ? null : window.innerWidth;
  const lookIntoBall = screenWidth
    ? '🔮 Look into the crystal ball... Yes, I see it clearly...'
    : '🔮 Look into the crystal ball...'; 
  const yourWidthIs = screenWidth
    ? \`Your window is \${screenWidth}!\`
    : 'Hmm...';

  return (
    <div>
      <p>{lookIntoBall}</p>
      <p>{yourWidthIs}</p>
    </div>
  );
}
`}
</code>

<h2>Summary</h2>

<p>
  <code>window</code>
  is not defined on the server, so you can’t use it during the render of a
  component being SSR’d.
</p>

<p>
  During a component render, use the
  <code>useIsSsr</code>
  hook.
</p>

<p>
  If
  <i>outside</i>
  of a component render, then you can directly check
  <code>typeof window === "undefined"</code>
  to check if you’re on the server, or the browser.
</p>

<p>
  You can just
  <code>if (isSsr) return null</code>
  , but if this causes visual flashing, then consider showing a placeholder
  instead. It’s extra work, but the polish is worth it!
</p>