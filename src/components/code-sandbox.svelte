<script>
  export let title;
  export let id;
  export let initialFile;

  const moduleParam = initialFile ? `&module=${initialFile}` : "";
</script>

<style>
  .sandbox-iframe {
    width: 100%;
    height: 50vh;
    min-height: 500px;
    border: 0;
    padding: 0;
    max-width: none;
  }
</style>

<iframe
  src="https://codesandbox.io/embed/{id}?theme=dark{moduleParam}"
  {title}
  class="sandbox-iframe"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media;
  geolocation; gyroscope; hid; microphone; midi; payment; usb; vr;
  xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation
  allow-same-origin allow-scripts" />
