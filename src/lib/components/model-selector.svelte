<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  export let modelId: string;

  // Debug output
  console.log("Current modelId:", modelId);

  interface Model {
    id: string;
    name: string;
  }

  let models: Model[] = [];
  let loading = true;

  onMount(async () => {
    console.log("Component mounted, loading:", loading);
    try {
      const response = await fetch("/api/models");
      const data = await response.json();
      models = data.models || [];
      console.log("Models loaded:", models);
      console.log("Current modelId after loading:", modelId);
    } catch (error) {
      console.error("Failed to fetch models:", error);
    } finally {
      loading = false;
      console.log("Loading complete, loading state:", loading);
    }
  });

  function handleModelChange(event: Event) {
    const newModelId = (event.target as HTMLSelectElement).value;
    console.log("Model changed to:", newModelId);
    const url = new URL(window.location.href);

    if (newModelId) {
      url.searchParams.set("modelId", newModelId);
    } else {
      url.searchParams.delete("modelId");
    }

    goto(url.toString(), { replaceState: true });
  }
</script>

<div class="relative inline-block">
  <select
    value={modelId}
    on:change={handleModelChange}
    class="h-9 w-full min-w-[180px] appearance-none rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    {#if loading}
      <option value="">Loading models...</option>
    {:else if models.length === 0}
      <option value="">No models available</option>
    {:else}
      {#each models as model}
        <option value={model.id}>{model.name || model.id}</option>
      {/each}
    {/if}
  </select>
  <div
    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-down h-4 w-4 opacity-50"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
</div>
