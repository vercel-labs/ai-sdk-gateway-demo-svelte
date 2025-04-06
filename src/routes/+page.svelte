<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Send } from "lucide-svelte";
  import ModelSelector from "$lib/components/model-selector.svelte";
  import { Chat } from "@ai-sdk/svelte";

  const DEFAULT_MODEL = "xai/grok-2-1212";
  let modelId = DEFAULT_MODEL;
  let inputElement: any;

  const chat = new Chat({
    body: {
      modelId: modelId,
    },
  });

  onMount(() => {
    const url = new URL(window.location.href);
    modelId = url.searchParams.get("modelId") || DEFAULT_MODEL;

    setTimeout(() => {
      if (inputElement && inputElement.focus) {
        inputElement.focus();
      }
    }, 0);
  });

  $: {
    console.log("Model changed to:", modelId);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      const target = event.target as HTMLElement;
      const form = target.closest("form");
      if (form) form.requestSubmit();
    }
  }
</script>

<div
  class="container flex flex-col items-center justify-between max-w-[800px] mx-auto p-4 h-screen"
>
  <div class="flex-1 w-full overflow-y-auto space-y-4 py-4">
    {#each chat.messages as message}
      <div
        class="rounded-lg p-4 {message.role === 'user'
          ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
          : 'bg-muted mr-auto max-w-[80%]'}"
      >
        {message.content}
      </div>
    {/each}
  </div>
  <form on:submit={chat.handleSubmit} class="w-full pb-4">
    <Card class="w-full">
      <CardContent class="flex items-center gap-3 p-3">
        <ModelSelector {modelId} />
        <div class="flex flex-1 items-center">
          <Input
            bind:this={inputElement}
            bind:value={chat.input}
            name="prompt"
            placeholder="Type your message..."
            class="flex-1 focus-visible:ring-1"
            on:keydown={handleKeyDown}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            class="h-9 w-9 ml-1"
          >
            <!-- <Send class="h-5 w-5" />  Temporarily comment out or remove -->
            Test <!-- Add some text instead -->
          </Button>
        </div>
      </CardContent>
    </Card>
  </form>
</div>
