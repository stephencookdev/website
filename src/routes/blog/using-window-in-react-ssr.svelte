<script>
  import BlogMeta from "../../components/blog-meta.svelte";
  import Quote from "../../components/quote.svelte";
  import CodeSandbox from "../../components/code-sandbox.svelte";
</script>

<BlogMeta
  slug="using-window-in-react-ssr"
  title="Using window in React SSR: The Complete Guide"
  subtitle="What “window is not defined” and “expected server html to contain
  div” really mean"
  headerImage="/blog/using-window-in-react-ssr/sad-window.jpg"
  headerAlt="someone's hand placed on a rainy window, looking out at other
  windows"
  keywords="react,ssr,how-to,error"
  published="2020-05-27">
  false
</BlogMeta>

<p>
  You add Server-Side Rendering (SSR) to your React app and a terrifying
  “uncaught reference error” greets you:
</p>

<p>
  <code>window is not defined</code>
</p>

<p>
  If you side-step that issue, this equally unhelpful warning raises its head:
</p>

<p>
  <code>Expected server HTML to contain a div</code>
</p>

<p>Uhh… What’s going on?</p>

<h2>
  Why is
  <code>window</code>
  not defined?
</h2>

<p>
  With SSR, your app runs twice. In the end, it runs on the user’s browser,
  business as usual. But
  <i>first,</i>
  it runs on a server.
</p>

<p>
  What you need to remember is that on a server, things like
  <code>window.innerWidth</code>
  do not make sense. What’s the width of the browser window? There is no browser
  window. Because of this, servers don’t provide a
  <code>window</code>
  global.
</p>

<p>
  The same goes for
  <code>document</code>
  and the
  <code>document is not defined</code>
  error, as well as some other browser globals.
</p>

<p>
  Sometimes, it’s not even your code that depends on
  <code>window</code>
  . At the time of writing this,
  <b>hellosign-embedded,</b>
  <b>react-stripe-elements,</b>
  and
  <b>react-chartjs</b>
  all depend on
  <code>window</code>
  and break if you try to render them with SSR.
</p>

<p>
  To get around this, we can check if
  <code>window</code>
  is available before using it, by running something like
  <code>if (typeof window === "undefined") return null</code>
  . This lets us run the same code on the server and the browser.
</p>

<h2>Hydration Warnings</h2>

<p>
  But wait! Returning
  <code>null</code>
  in your component’s render function when
  <code>window</code>
  isn’t defined is dangerous if you don’t understand what’s going on.
</p>

<p>
  When
  <code>ReactDOM.hydrate</code>
  runs, it builds up the VDOM of your app on the user’s browser and then
  compares this to the
  <i>actual</i>
  DOM (which has been SSR’d with some initial content).
</p>

<p>
  If the VDOM and the DOM don’t match up, then
  <code>ReactDOM</code>
  gets very confused. That is what
  <code>expected server code to contain div</code>
  means; in the VDOM there’s a div, but not in the DOM.
</p>

<p>But why do we care? Can’t we suppress or ignore the warning?</p>

<p>
  Yes, you
  <i>can</i>
  suppress the warning with
  <code>suppressHydrationWarning</code>
  — but you shouldn’t. Doing so can seriously break your app.
</p>

<p>
  If the VDOM and DOM don’t match up, then React might ignore an entire part of
  the VDOM. In other words, if you do something like this:
</p>

<code>
  {`const MyComponent = () => {
  // Careful, this can cause hydration issues and break your app!
  if (typeof window === "undefined") return null;

  return <div>🍩</div>;
}`}
</code>

<p>
  Then you might
  <i>never</i>
  see your precious 🍩.
</p>

<p>
  You might get away with it, depending on how the React internals happens to
  render the specific component. But in my experience, you have about a 50/50
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
  Fortunately, we can create a small React hook to detect if we’re on the server
  or not.
</p>

<code>
  {`import { useState, useEffect } from "react";

const useIsSsr = () => {
  // we always start off in "SSR mode", to ensure our initial browser render
  // matches the SSR render
  const [isSsr, setIsSsr] = useState(true);

  useEffect(() => {
    // \`useEffect\` never runs on the server, so we must be on the client if
    // we hit this block
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
  This hook guarantees that our initial browser render matches the initial
  server render. Then, we immediately render again, filling in the components
  that need
  <code>window</code>
  , all without confusing ReactDOM.
</p>

<h2>Preventing Flashing</h2>

<p>
  Great, we’re doing things safely now — but now we see our components that rely
  on
  <code>window</code>
  pop in, which looks a bit janky.
</p>

<p>
  The key here is to do more than
  <code>return null</code>
  when on the server. Although
  <code>return null</code>
  is super easy, it means that in the initial payload we’re not sending the
  component’s markup at all. So when we eventually boot up the app fully on the
  browser, the component
  <i>suddenly</i>
  appears — since it wasn’t there at all before.
</p>

<p>
  For some components, this is okay. When it’s not — we need to create a
  <i>placeholder</i>
  version of the component.
</p>

<p>
  We don’t need this placeholder component to have any functionality. We only
  need it to
  <i>look</i>
  like the component, without depending on
  <code>window</code>
  .
</p>

<p>Let’s take this component, for example:</p>

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
  of a component render, then directly check
  <code>typeof window === "undefined"</code>
  to see if you’re on the server or the browser.
</p>

<p>
  You can just
  <code>if (isSsr) return null</code>
  , but if this causes visual flashing, then consider showing a placeholder
  instead. It’s extra work, but the polish is worth it!
</p>
