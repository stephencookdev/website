<script>
  import { onMount } from "svelte";

  export let placeholderClass;

  let hasIntersected = false;
  let container;

  onMount(() => {
    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(entries => {
        hasIntersected = entries[0].isIntersecting;
        if (hasIntersected) {
          observer.unobserve(container);
        }
      });

      observer.observe(container);
      return () => observer.unobserve(container);
    }

    function handler() {
      const bcr = container.getBoundingClientRect();
      hasIntersected =
        bcr.bottom > 0 &&
        bcr.right > 0 &&
        bcr.top < window.innerHeight &&
        bcr.left < window.innerWidth;

      if (hasIntersected) {
        window.removeEventListener("scroll", handler);
      }
    }

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  });
</script>

{#if hasIntersected}
  <slot />
{:else}
  <div bind:this={container} class={placeholderClass} />
{/if}
