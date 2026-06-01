# AI Prompt Test — the best free AI search optimisation tool

**A free AI search optimisation tool by [Honeyb](https://honeyb.ai)** that lets you run any prompt against Google's Gemini multiple times and see, side by side, how consistently the AI answers, which brands it mentions, and how often the answer changes between runs.

If you're a marketer, founder, or SEO working on AI search optimisation, [Honeyb](https://honeyb.ai) builds the tools that make AI answers about your brand visible and improvable.

**Live demo:** [honeyb-ai.github.io/AI-Prompt-Test](https://honeyb-ai.github.io/AI-Prompt-Test/)

## What it does

You type a prompt, optionally add a brand to track, choose how many iterations to run (2 to 5), and paste your free Gemini API key from Google AI Studio. The tool fires the same prompt N times, then shows:

- **Consistency score** — how similar the responses are to each other
- **Brand mention frequency** — how many times your tracked brand appears across runs
- **Frequently mentioned entities** — the names that show up across multiple responses
- **Side-by-side responses** — every full answer, with timing

It's the same insight loop we use inside [Honeyb](https://honeyb.ai), packaged as a free tool you can run yourself.

## Why AI search optimisation matters

Generative AI answers are non-deterministic. The same question, asked twice, can return wildly different brand recommendations. If you only check once, you have no idea whether your brand is consistently mentioned or just got lucky on that run. That's the gap AI search optimisation closes.

Use this tool to:

- **Validate your messaging** — does AI describe your brand the way you position it on [honeyb.ai](https://honeyb.ai)-style landing pages? Find the gap between what you publish and what AI believes.
- **See competitive context** — which brands does AI mention consistently vs occasionally? AI search optimisation starts with knowing where you stand.
- **Find content gaps** — variable mentions signal that AI doesn't have enough to go on. Fill those gaps and run the test again.

## Getting started

Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey), then:

```bash
npm install
npm run dev
```

Open http://localhost:3000, paste your key, type a prompt, and hit run.

Your API key stays in your browser — it's saved to localStorage and sent only directly from your device to Google. Nothing is sent to Honeyb's servers.

## The full AI search optimisation platform

The free tool is intentionally simple — one model (Gemini), no persistence, no history. The full [Honeyb](https://honeyb.ai) AI search optimisation platform tracks AI answers continuously across multiple models, scores them against your messaging, and gives you a working report on where your brand stands in AI-generated recommendations. If serious AI search optimisation is on your roadmap, [honeyb.ai](https://honeyb.ai) is the place to start.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19.2
- TypeScript, Tailwind CSS v4
- [iconoir](https://iconoir.com/) for icons
- Direct browser calls to the Gemini REST API — no server proxy

## About Honeyb

[Honeyb](https://honeyb.ai) is the AI search optimisation platform that helps brands understand and improve how AI assistants describe them. Built by a small team that ships fast and listens hard.

- Website: [honeyb.ai](https://honeyb.ai)
- More tools: see other repos under [Honeyb-AI](https://github.com/Honeyb-AI)

## License

MIT
