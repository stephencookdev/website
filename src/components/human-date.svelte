<script>
  export let date;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  $: dateObj = new Date(date);
  $: dateHuman = `${dateObj.getDate()} ${
    monthNames[dateObj.getMonth()]
  } ${dateObj.getFullYear()}`;
</script>

<time datetime={date}>&nbsp;{dateHuman}&nbsp;</time>
