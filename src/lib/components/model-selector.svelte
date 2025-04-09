<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Loader2 } from "lucide-svelte";
  import * as Select from "$lib/components/ui/select";

  export let modelId: string;

  interface Model {
    id: string;
    name: string;
  }

  let models: Model[] = [];
  let loading = true;
  let error: Error | null = null;
  let selectedValue = modelId;

  $: {
    if (selectedValue && selectedValue !== modelId) {
      const url = new URL(window.location.href);
      url.searchParams.set("modelId", selectedValue);
      goto(url.toString(), { replaceState: true });
    }
  }

  $: triggerContent =
    models.find((m) => m.id === selectedValue)?.name ||
    selectedValue ||
    "Select a model";

  onMount(async () => {
    try {
      const response = await fetch("/api/models");
      const data = await response.json();
      models = data.models || [];
    } catch (err) {
      error = err as Error;
      console.error("Failed to fetch models:", error);
    } finally {
      loading = false;
    }
  });
</script>

<Select.Root
  type="single"
  bind:value={selectedValue}
  disabled={loading || !!error || !models.length}
>
  <Select.Trigger class="w-[180px]">
    {#if loading}
      <div class="flex items-center gap-2">
        <Loader2 class="h-4 w-4 animate-spin" />
        <span class="overflow-hidden whitespace-nowrap text-ellipsis"
          >Loading</span
        >
      </div>
    {:else if error}
      <span class="text-red-500 overflow-hidden whitespace-nowrap text-ellipsis"
        >Error</span
      >
    {:else if !models.length}
      <span class="overflow-hidden whitespace-nowrap text-ellipsis"
        >No models</span
      >
    {:else}
      <span class="overflow-hidden whitespace-nowrap text-ellipsis block"
        >{triggerContent}</span
      >
    {/if}
  </Select.Trigger>

  <Select.Content>
    <Select.Group>
      <Select.GroupHeading>Models</Select.GroupHeading>
      {#each models as model (model.id)}
        <Select.Item value={model.id} label={model.name || model.id}>
          {model.name || model.id}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
