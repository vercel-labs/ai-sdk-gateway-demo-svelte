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

<div class="grid w-screen h-screen grid-rows-[1fr_auto] max-w-[800px] m-auto">
  <ul>
    {#each chat.messages as message}
      <li>{message.role}: {message.content}</li>
    {/each}
  </ul>
  <form
    on:submit={chat.handleSubmit}
    class="flex justify-center px-8 pt-0 pb-8"
  >
    <Card class="w-full p-0">
      <CardContent class="flex items-center gap-3 p-2">
        <ModelSelector {modelId} />

        <div class="flex flex-1 items-center">
          <Input
            bind:this={inputElement}
            bind:value={chat.input}
            name="prompt"
            placeholder="Type your message..."
            class="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            on:keydown={handleKeyDown}
          />

          <Button
            type="submit"
            size="icon"
            variant="ghost"
            class="h-8 w-8 ml-1"
          >
            <Send class="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </form>
</div>
