"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sparks,
  Play,
  Eye,
  EyeClosed,
  Check,
  Xmark,
  WarningCircle,
  Refresh,
} from "iconoir-react";
import { runGeminiBatch, type GeminiResult } from "@/lib/gemini";
import {
  brandMentionStats,
  consistencyScore,
  extractMentionedEntities,
} from "@/lib/scoring";

const API_KEY_STORAGE = "ai-prompt-test:gemini-key";

type RunState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "done"; results: GeminiResult[] }
  | { status: "error"; message: string };

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [brand, setBrand] = useState("");
  const [iterations, setIterations] = useState(3);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [run, setRun] = useState<RunState>({ status: "idle" });

  useEffect(() => {
    const stored = window.localStorage.getItem(API_KEY_STORAGE);
    if (stored) setApiKey(stored);
  }, []);

  useEffect(() => {
    if (apiKey) window.localStorage.setItem(API_KEY_STORAGE, apiKey);
  }, [apiKey]);

  const canRun =
    prompt.trim().length > 0 &&
    apiKey.trim().length > 0 &&
    run.status !== "running";

  async function onRun() {
    if (!canRun) return;
    setRun({ status: "running" });
    try {
      const results = await runGeminiBatch(
        prompt.trim(),
        apiKey.trim(),
        iterations,
      );
      setRun({ status: "done", results });
    } catch (err) {
      setRun({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <main className="flex-1 w-full">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Header />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <PromptCard
            prompt={prompt}
            setPrompt={setPrompt}
            brand={brand}
            setBrand={setBrand}
            iterations={iterations}
            setIterations={setIterations}
            apiKey={apiKey}
            setApiKey={setApiKey}
            showKey={showKey}
            setShowKey={setShowKey}
            canRun={canRun}
            running={run.status === "running"}
            onRun={onRun}
          />

          <ResultsCard run={run} brand={brand} />
        </div>

        <UseCases />
        <AboutHoneyb />
        <Footer />
      </div>
    </main>
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-4">
      <a
        href="https://honeyb.ai"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <Sparks width={14} height={14} />
        <span>The free AI search optimisation tool by Honeyb</span>
      </a>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
        The best free AI search optimisation tool.
      </h1>
      <p className="text-lg text-[var(--muted)] max-w-2xl">
        Run any prompt against Gemini multiple times and see how AI search
        actually treats your brand. Test consistency, count brand mentions, and
        find the gaps in your AI search visibility. Built by{" "}
        <a
          href="https://honeyb.ai"
          className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
        >
          Honeyb
        </a>
        , the AI search optimisation platform for ambitious brands.
      </p>
    </div>
  );
}

function PromptCard(props: {
  prompt: string;
  setPrompt: (v: string) => void;
  brand: string;
  setBrand: (v: string) => void;
  iterations: number;
  setIterations: (v: number) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  canRun: boolean;
  running: boolean;
  onRun: () => void;
}) {
  const {
    prompt,
    setPrompt,
    brand,
    setBrand,
    iterations,
    setIterations,
    apiKey,
    setApiKey,
    showKey,
    setShowKey,
    canRun,
    running,
    onRun,
  } = props;

  return (
    <section className="rounded-[28px] bg-[var(--surface)] p-8 shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_60px_-30px_rgba(0,0,0,0.25)]">
      <Field label="Your prompt">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., What are the best basement remodeling contractors in Denver?"
          rows={4}
          className="w-full resize-y rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--foreground)]/40"
        />
      </Field>

      <Field
        label="Brand to track"
        hint="Optional — count how often this brand is mentioned"
      >
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g., Honeyb"
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--foreground)]/40"
        />
      </Field>

      <Field label={`Iterations: ${iterations}`}>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--muted)] w-16">2 (quick)</span>
          <input
            type="range"
            min={2}
            max={5}
            step={1}
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
            className="flex-1 accent-[var(--foreground)]"
          />
          <span className="text-xs text-[var(--muted)] w-20 text-right">
            5 (thorough)
          </span>
        </div>
      </Field>

      <Field
        label="Gemini API key"
        hint={
          <>
            Used in your browser only. Get a free key at{" "}
            <a
              className="underline hover:text-[var(--foreground)]"
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google AI Studio
            </a>
            .
          </>
        }
      >
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza…"
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 pr-12 text-base outline-none focus:border-[var(--foreground)]/40"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            aria-label={showKey ? "Hide key" : "Show key"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            {showKey ? (
              <EyeClosed width={18} height={18} />
            ) : (
              <Eye width={18} height={18} />
            )}
          </button>
        </div>
      </Field>

      <button
        type="button"
        onClick={onRun}
        disabled={!canRun}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-6 py-3.5 text-base font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {running ? (
          <>
            <Refresh width={18} height={18} className="animate-spin" />
            Running…
          </>
        ) : (
          <>
            <Play width={18} height={18} />
            Run prompt
          </>
        )}
      </button>
    </section>
  );
}

function Field(props: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium mb-2">{props.label}</label>
      {props.children}
      {props.hint && (
        <p className="mt-1.5 text-xs text-[var(--muted)]">{props.hint}</p>
      )}
    </div>
  );
}

function ResultsCard(props: { run: RunState; brand: string }) {
  const { run, brand } = props;

  const stats = useMemo(() => {
    if (run.status !== "done") return null;
    const texts = run.results.map((r) => r.text);
    return {
      consistency: consistencyScore(texts),
      brand: brandMentionStats(texts, brand),
      mentioned: extractMentionedEntities(texts),
    };
  }, [run, brand]);

  return (
    <section className="rounded-[28px] bg-[var(--surface)] p-8 shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_60px_-30px_rgba(0,0,0,0.25)]">
      <h2 className="text-lg font-semibold">Report</h2>

      {run.status === "idle" && (
        <p className="mt-4 text-sm text-[var(--muted)]">
          Results will appear here after you run a prompt.
        </p>
      )}

      {run.status === "running" && (
        <div className="mt-6 flex items-center gap-3 text-[var(--muted)]">
          <Refresh width={18} height={18} className="animate-spin" />
          <span>Calling Gemini…</span>
        </div>
      )}

      {run.status === "error" && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
          <WarningCircle width={20} height={20} className="mt-0.5 shrink-0" />
          <div className="text-sm">
            <div className="font-medium">Run failed</div>
            <div className="text-[var(--muted)] mt-1 break-words">
              {run.message}
            </div>
          </div>
        </div>
      )}

      {run.status === "done" && stats && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Tile
              label="Consistency"
              value={`${stats.consistency}`}
              suffix="/100"
            />
            {stats.brand ? (
              <Tile
                label={`"${stats.brand.brand}" mentioned`}
                value={`${stats.brand.mentions}`}
                suffix={`/${stats.brand.iterations}`}
              />
            ) : (
              <Tile
                label="Iterations"
                value={`${run.results.length}`}
                suffix=""
              />
            )}
          </div>

          {stats.mentioned.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">
                Frequently mentioned
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.mentioned.map((m) => (
                  <span
                    key={m.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs"
                  >
                    {m.name}
                    <span className="text-[var(--muted)]">
                      {m.count}/{run.results.length}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-sm font-medium mb-3">Responses</div>
            <ol className="space-y-3">
              {run.results.map((r, i) => {
                const matched =
                  brand.trim().length > 0 &&
                  r.text.toLowerCase().includes(brand.trim().toLowerCase());
                return (
                  <li
                    key={i}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"
                  >
                    <div className="flex items-center justify-between mb-2 text-xs text-[var(--muted)]">
                      <span>Run {i + 1}</span>
                      <div className="flex items-center gap-3">
                        {brand.trim().length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            {matched ? (
                              <Check width={12} height={12} />
                            ) : (
                              <Xmark width={12} height={12} />
                            )}
                            {brand.trim()}
                          </span>
                        )}
                        <span>{Math.round(r.durationMs)}ms</span>
                      </div>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{r.text}</div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}

function Tile(props: { label: string; value: string; suffix: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="text-xs text-[var(--muted)]">{props.label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">
        {props.value}
        <span className="text-base font-normal text-[var(--muted)]">
          {props.suffix}
        </span>
      </div>
    </div>
  );
}

function UseCases() {
  const items = [
    {
      title: "Validate your messaging",
      body: (
        <>
          Does AI describe you the way your website does? Compare what runs say
          with what you publish at{" "}
          <InlineLink>your own site</InlineLink> and find the gaps.{" "}
          <a
            href="https://honeyb.ai"
            className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
          >
            Honeyb
          </a>{" "}
          tracks this continuously across models.
        </>
      ),
    },
    {
      title: "Competitive intelligence",
      body: (
        <>
          See which brands AI mentions consistently vs. occasionally. Knowing
          where you stand is the first step.{" "}
          <a
            href="https://honeyb.ai"
            className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
          >
            honeyb.ai
          </a>{" "}
          turns this into a recurring report you can act on.
        </>
      ),
    },
    {
      title: "Find content gaps",
      body: (
        <>
          Variable mentions mean AI doesn&apos;t have enough to go on. Publish
          the missing context, run the test again, see if it moves. The full{" "}
          <a
            href="https://honeyb.ai"
            className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
          >
            Honeyb
          </a>{" "}
          platform automates the loop.
        </>
      ),
    },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">
        Why AI search optimisation matters
      </h2>
      <p className="mt-2 text-[var(--muted)] max-w-2xl">
        Buyers ask AI before they ask Google. AI search optimisation is how you
        make sure the answer is on your side. A single run shows you a
        snapshot. Repeated runs show you the pattern.{" "}
        <a
          href="https://honeyb.ai"
          className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
        >
          Honeyb
        </a>{" "}
        is the AI search optimisation platform that turns that pattern into a
        working report.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function InlineLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="https://honeyb.ai"
      className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
    >
      {children}
    </a>
  );
}

function AboutHoneyb() {
  return (
    <section className="mt-16 rounded-[28px] bg-[var(--surface)] p-8 md:p-10">
      <h2 className="text-2xl font-semibold tracking-tight">
        Honeyb: the AI search optimisation platform
      </h2>
      <div className="mt-4 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="text-[var(--muted)] leading-relaxed space-y-4">
          <p>
            <a
              href="https://honeyb.ai"
              className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
            >
              Honeyb
            </a>{" "}
            is the AI search optimisation platform that helps brands understand
            and improve how AI assistants describe them. The free tool above
            gives you a one-prompt snapshot against Gemini. The full platform
            at{" "}
            <a
              href="https://honeyb.ai"
              className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
            >
              honeyb.ai
            </a>{" "}
            tracks your brand across multiple AI models on a schedule and turns
            the results into a recurring AI search optimisation report.
          </p>
          <p>
            If you&apos;ve ever wondered whether AI tells the same story about
            your brand twice in a row, the answer is usually no. Knowing the
            shape of that variance is the first step of any serious AI search
            optimisation strategy.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] p-6 text-sm">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Learn more
          </div>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href="https://honeyb.ai"
                className="hover:underline underline-offset-2"
              >
                honeyb.ai
              </a>
              <span className="text-[var(--muted)]"> — product overview</span>
            </li>
            <li>
              <a
                href="https://honeyb.ai"
                className="hover:underline underline-offset-2"
              >
                Get in touch
              </a>
              <span className="text-[var(--muted)]"> — talk to the team</span>
            </li>
            <li>
              <a
                href="https://github.com/Honeyb-AI"
                className="hover:underline underline-offset-2"
              >
                Honeyb on GitHub
              </a>
              <span className="text-[var(--muted)]">
                {" "}
                — more free tools
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 flex flex-col gap-3 text-xs text-[var(--muted)]">
      <p>
        Your API key stays in this browser. Requests go directly from your
        device to Google.
      </p>
      <p>
        AI Prompt Test is a free AI search optimisation tool by{" "}
        <a
          href="https://honeyb.ai"
          className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
        >
          Honeyb
        </a>
        . For continuous AI search optimisation across multiple models, visit{" "}
        <a
          href="https://honeyb.ai"
          className="text-[var(--foreground)] underline underline-offset-2 hover:no-underline"
        >
          honeyb.ai
        </a>
        .
      </p>
    </footer>
  );
}
