<script>
  import { Highlight } from "svelte-highlight";
  import * as languages from "svelte-highlight/languages";

  export let code;
  export let language;
</script>

<div class="container">
  <div class="inner">
    <Highlight language={languages[language]} code={code.trim()} />
  </div>
</div>

<style>
  .container {
    width: 100%;
    max-width: none;
    box-sizing: border-box;
    background: #6a3459;
    margin-top: 2rem;
    margin-bottom: 2rem;
    overflow: auto;
  }

  .container :global(*) {
    font-family: monospace;
    font-size: 1rem;
  }

  .inner {
    max-width: 42.5rem;
    margin: auto;
  }

  .inner :global(pre) {
    /* this 1.5rem matches that of the mobile gutter width of the whole page */
    padding: 1.5rem;
    margin: 0 -1.5rem;
  }

  .container :global(.hljs) {
    display: block;
    overflow: visible;
    font-weight: normal;
  }

  .container :global(.hljs-title) {
    color: #32a58c;
    font-weight: normal;
  }

  .container :global(.hljs-name) {
    color: #a1feff;
  }

  .container :global(.hljs-tag) {
    color: #fafafa;
  }

  .container :global(.hljs-attr) {
    color: #f8d000;
    font-style: italic;
  }

  .container :global(.hljs-built_in),
  .container :global(.hljs-selector-tag),
  .container :global(.hljs-section) {
    color: #e04e1c;
  }

  .container :global(.hljs-keyword) {
    color: #e04e1c;
  }

  .container :global(.hljs),
  .container :global(.hljs-subst) {
    color: #e3dfff;
  }

  .container :global(.hljs-string),
  .container :global(.hljs-attribute),
  .container :global(.hljs-symbol),
  .container :global(.hljs-bullet),
  .container :global(.hljs-addition),
  .container :global(.hljs-code),
  .container :global(.hljs-regexp),
  .container :global(.hljs-selector-class),
  .container :global(.hljs-selector-attr),
  .container :global(.hljs-selector-pseudo),
  .container :global(.hljs-template-tag),
  .container :global(.hljs-quote),
  .container :global(.hljs-deletion) {
    color: #1ce05a;
  }

  .container :global(.hljs-meta),
  .container :global(.hljs-meta-string) {
    color: #e04e1c;
  }

  .container :global(.hljs-comment) {
    color: #a7a;
  }

  .container :global(.hljs-literal),
  .container :global(.hljs-number) {
    color: #6ec3e0;
  }

  .container :global(.hljs-emphasis) {
    font-style: italic;
  }

  .container :global(.hljs-strong) {
    font-weight: bold;
  }
</style>
