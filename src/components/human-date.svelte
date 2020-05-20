<script>
  export let date;

  const dateHuman = new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(new Date(date));
</script>

<time datetime={date}>&nbsp;{dateHuman}&nbsp;</time>
