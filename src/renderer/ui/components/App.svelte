<script>
  import Button from "./Button.svelte";
  export let name;

  let caption = "Drück mich";
  $: dblCaption = caption + caption;

  function machwas() {
    caption = window.api.buttonPressed(43);
  }
</script>

<main>
  <h1>Hello {name}</h1>
  <Button on:click={machwas}>
    {dblCaption}
  </Button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
