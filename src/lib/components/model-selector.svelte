<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Loader2 } from "@lucide/svelte";
  import * as Select from "$lib/components/ui/select";
  import { SUPPORTED_MODELS } from "$lib/constants";

  export let modelId: string;

  interface Model {
    id: string;
    name: string;
  }

  const DEFAULT_MODELS: Model[] = [
    { id: "xai/grok-3-beta", name: "Grok 3 Beta" },
    { id: "bedrock/amazon.nova-lite-v1:0", name: "Nova Lite" },
    { id: "bedrock/amazon.nova-micro-v1:0", name: "Nova Micro" },
    { id: "openai/gpt-4o-mini", name: "GPT-4o Mini" },
    { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
    { id: "vertex/gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
    { id: "groq/llama-3.1-8b", name: "Llama 3.1 8B" },
    { id: "groq/gemma2-9b-it", name: "Gemma 2 9B IT" },
    { id: "mistral/ministral-8b-latest", name: "Ministral 8B" },
    { id: "mistral/ministral-3b-latest", name: "Ministral 3B" },
  ];

  let models: Model[] = DEFAULT_MODELS;
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

  function buildModelList(models: any[]): Model[] {
    // Filter to only include supported models
    const supportedModels = models.filter(model => 
      SUPPORTED_MODELS.includes(model.id)
    );
    
    return supportedModels.map((model) => ({
      id: model.id,
      name: model.name || model.id,
    }));
  }

  onMount(async () => {
    try {
      const response = await fetch("/api/models");
      const data = await response.json();
      const newModels = buildModelList(data.models || []);
      models = newModels.length > 0 ? newModels : DEFAULT_MODELS;
    } catch (err) {
      error = err as Error;
      console.error("Failed to fetch models:", error);
      models = DEFAULT_MODELS;
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
        <Loader2 size={16} />
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
