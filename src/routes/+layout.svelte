<script>
  import "../app.pcss";
</script>

<svelte:head>
  <title>AI Gateway Demo</title>
  <meta
    name="description"
    content="A demo of the Vercel AI Gateway with the AI SDK by Vercel"
  />
</svelte:head>

<div class="min-h-screen bg-background antialiased">
  <main class="flex min-h-screen flex-col">
    <slot />
  </main>
</div>
