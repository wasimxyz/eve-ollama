# Run a local eve agent with Ollama

This project is an [eve](https://eve.dev) agent that chats with a model running in [Ollama](https://ollama.com) on the same machine. eve compiles the files in `agent/` and runs the agent. You talk to it in the eve terminal UI, a chat in your terminal. The agent runs shell commands and file tools in a sandbox at `/workspace`, not in your home directory.

Run `eve dev` on the same computer as Ollama. The agent calls `http://localhost:11434/v1`. A Vercel deployment cannot reach Ollama on your machine.

## What you need

You need:

- Node.js 24
- [Ollama](https://ollama.com) installed and running
- A pulled model that can use tools, such as `llama3.2`

Pull the default model if you don’t have it yet:

```bash
ollama pull llama3.2
```

## Install and configure

Install packages, copy the env file, and name the model you pulled:

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.

   ```bash
   cp .env.example .env.local
   ```

3. Set `OLLAMA_MODEL` in `.env.local` to a name from `ollama list`.

## Match the model’s context window

eve uses `OLLAMA_CONTEXT_WINDOW` to decide when to summarize a long chat. Set it to Ollama’s context window for that model, in tokens.

Ollama’s default window is 4096 tokens. `.env.example` uses `32768`. If eve’s number is larger than Ollama’s window, Ollama can drop the start of a long prompt. Ollama reports no error when that happens.

Ollama reads its window from `num_ctx` or `OLLAMA_CONTEXT_LENGTH`, not from `.env.local`. To raise Ollama’s window, set `PARAMETER num_ctx` in a [Modelfile](https://docs.ollama.com/modelfile) and rebuild the model. You can also set `OLLAMA_CONTEXT_LENGTH` when you start Ollama.

## Start the agent

Run `npm run dev` from the project root to open the terminal UI:

```bash
npm run dev
```

To start the server without the UI:

```bash
npx eve dev --no-ui
```

## Change the model

Set `OLLAMA_MODEL` in `.env.local` to a name from `ollama list`. Restart `npm run dev` after you change it.

The `/model` command in the terminal UI only accepts Vercel AI Gateway ids.

## Files that control this agent

These files set the model, prompt, sandbox, and tools:

- **`agent/agent.ts`**: selects the Ollama model
- **`agent/instructions.md`**: standing instructions the agent always sees
- **`agent/sandbox.ts`**: picks a local sandbox with `defaultBackend()` (Docker, then microsandbox, then just-bash)
- **`agent/tools/glob.ts`**: finds files in `/workspace` by name pattern
- **`agent/tools/grep.ts`**: searches file contents in `/workspace`
- **`agent/tools/web_search.ts`**: turns off `web_search` because Ollama does not search the web

The agent can run commands and read or write files in `/workspace`.

If Docker is not running, eve uses microsandbox on Apple Silicon Macs or on Linux with Kernel-based Virtual Machine (KVM). Otherwise eve uses just-bash, which simulates bash without real programs such as `git` or `node`.

## eve documentation

Read these when you add tools, skills, or channels:

- [eve documentation](https://eve.dev/docs)
- [Build an Agent tutorial](https://eve.dev/docs/tutorial/first-agent)
- [eve on GitHub](https://github.com/vercel/eve)
