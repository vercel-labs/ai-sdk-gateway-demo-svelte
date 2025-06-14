<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Send } from "@lucide/svelte";
  import ModelSelector from "../lib/components/model-selector.svelte";
  import { Chat } from "@ai-sdk/svelte";
  import { DEFAULT_MODEL } from "$lib/constants";

  let inputElement: any;

  const modelId = $derived($page.url.searchParams.get("modelId") || DEFAULT_MODEL);

  const chat = new Chat({
    maxSteps: 5,
  });

  let input = $state("");
  
  const disabled = $derived(chat.status !== "ready");

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (!input.trim() || disabled) return;
    
    chat.sendMessage({ text: input });
    input = "";
  }

  onMount(() => {
    setTimeout(() => {
      if (inputElement && inputElement.focus) {
        inputElement.focus();
      }
    }, 0);
  });
</script>

<div
  class="container flex flex-col items-center justify-between max-w-[800px] mx-auto p-4 h-screen"
>
  <div class="flex-1 w-full overflow-y-auto space-y-4 py-4">
    {#each chat.messages as message (message.id)}
      <div
        class={message.role === "user"
          ? "bg-muted/50 rounded-md p-3 ml-auto max-w-[80%]"
          : "whitespace-pre-wrap mr-auto max-w-[80%]"}
      >
        {#each message.parts as part}
          {#if part.type === "text"}
            {part.text}
          {/if}
        {/each}
      </div>
    {/each}
  </div>

  <form onsubmit={handleSubmit} class="w-full pb-4">
    <Card class="w-full">
      <CardContent class="flex items-center gap-3 p-3">
        <ModelSelector {modelId} />
        <div class="flex flex-1 items-center">
          <Input
            bind:this={inputElement}
            bind:value={input}
            name="prompt"
            placeholder="Type your message..."
            class="flex-1 focus-visible:ring-1"
            disabled={disabled}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            class="h-9 w-9 ml-1"
            disabled={disabled}
          >
            <Send size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  </form>

  <footer class="w-full px-4 pb-4 text-center">
    <p class="text-sm text-muted-foreground">
      The models in the list are a small subset of those available in the Vercel AI Gateway.
      <br />
      See the{" "}
      <Button 
        variant="link" 
        class="p-0 h-auto text-sm font-normal inline"
      >
        <a 
          href="https://ai-sdk.dev/model-library" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          model library
        </a>
      </Button>{" "}
      for the full set.
    </p>
  </footer>
</div>
