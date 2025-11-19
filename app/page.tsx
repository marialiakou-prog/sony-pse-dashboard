"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MainTab =
  | "executive-summary"
  | "seo-health"
  | "content-performance"
  | "ai-insights";

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("executive-summary");

  const headerTitle = useMemo(() => {
    switch (activeTab) {
      case "seo-health":
        return "Keywords";
      case "content-performance":
        return "Content performance";
      case "ai-insights":
        return "AI Performance";
      default:
        return "SEO Overview";
    }
  }, [activeTab]);

  const headerSubtitle = useMemo(() => {
    switch (activeTab) {
      case "seo-health":
        return "Technical, on-page, and core web vitals signals.";
      case "content-performance":
        return "How content formats, topics, and pages perform.";
      case "ai-insights":
        return "AI-generated opportunities, risks, and experiments.";
      default:
        return "SEO & AI performance at a glance.";
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen flex bg-transparent text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-[#333333] px-6 py-6 flex flex-col gap-8">
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Image
                src="/sony-logo.png"
                alt="Sony"
                width={80}
                height={24}
                priority
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-white">
                SEO & AI Dashboard
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">
                PSE
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 text-sm text-slate-200">
          <p className="px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            SEO Overview
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("executive-summary")}
            className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
              activeTab === "executive-summary"
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-medium">SEO Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("seo-health")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
              activeTab === "seo-health"
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400/60" />
            <span>Keywords</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("content-performance")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
              activeTab === "content-performance"
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400/60" />
            <span>Content performance</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai-insights")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
              activeTab === "ai-insights"
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
            <span>AI Performance</span>
          </button>

          <p className="mt-4 px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Operations
          </p>
          <button className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span>Experiments</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span>Technical issues</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-3.5 text-xs text-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Today&apos;s focus
          </p>
          <p className="mt-2 text-[13px]">
            Monitor SEO health for flagship product pages and review AI
            content opportunities.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-[#f8fafc] px-8 py-5">
          <div>
            <h1 className="text-[1.4rem] font-semibold tracking-tight text-slate-900">
              {headerTitle}
            </h1>
            <p className="mt-1 text-xs text-slate-500">{headerSubtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs text-slate-500 sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span>Last sync: 3 min ago</span>
            </div>
            <button className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-100 sm:inline-flex">
              Export snapshot
            </button>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
              <span>Period</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                Last 7 days
              </span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-[#f8fafc]">
          {/* Executive summary KPI cards */}
          <section
            className={`grid gap-4 md:grid-cols-2 xl:grid-cols-4 ${
              activeTab === "executive-summary" ? "opacity-100" : "hidden"
            }`}
          >
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Avg. Google rank
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">7.4</p>
                <span className="text-xs text-emerald-400">+1.2 vs. last week</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Top 3 positions for 29 high-intent keywords.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Organic sessions
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">182k</p>
                <span className="text-xs text-emerald-400">+6.8%</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Sessions from non-branded organic search across all markets.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                CTR on key SERPs
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">4.9%</p>
                <span className="text-xs text-emerald-400">+0.4 pts</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Blended click-through rate for product and category pages.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Open technical issues
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">14</p>
                <span className="text-xs text-amber-300">4 critical</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Canonical conflicts, slow templates, and indexing gaps.
              </p>
            </article>
          </section>

          {/* SEO health content (static placeholder) */}
          <section
            className={`grid gap-4 lg:grid-cols-3 ${
              activeTab === "seo-health" ? "opacity-100" : "hidden"
            }`}
          >
            <article className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Technical health
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Static slots for core web vitals, crawl stats, and index coverage.
              </p>
              <div className="mt-4 h-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Core Web Vitals</span>
                  <span className="text-slate-400">Sample distribution</span>
                </div>
                <div className="mt-3 flex h-24 items-end gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex h-full items-end gap-[3px]">
                      <div className="h-5 flex-1 rounded-sm bg-emerald-400/70" />
                      <div className="h-3 flex-1 rounded-sm bg-amber-300/80" />
                      <div className="h-2 flex-1 rounded-sm bg-red-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">LCP</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex h-full items-end gap-[3px]">
                      <div className="h-6 flex-1 rounded-sm bg-emerald-400/70" />
                      <div className="h-2 flex-1 rounded-sm bg-amber-300/80" />
                      <div className="h-1 flex-1 rounded-sm bg-red-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">CLS</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex h-full items-end gap-[3px]">
                      <div className="h-4 flex-1 rounded-sm bg-emerald-400/70" />
                      <div className="h-3 flex-1 rounded-sm bg-amber-300/80" />
                      <div className="h-2 flex-1 rounded-sm bg-red-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">FID</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex h-full items-end gap-[3px]">
                      <div className="h-7 flex-1 rounded-sm bg-emerald-400/70" />
                      <div className="h-2 flex-1 rounded-sm bg-amber-300/80" />
                      <div className="h-1 flex-1 rounded-sm bg-red-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">INP</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[10px]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-4 rounded-full bg-emerald-400" />
                    Good
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-4 rounded-full bg-amber-300" />
                    Needs improvement
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-4 rounded-full bg-red-400" />
                    Poor
                  </span>
                </div>
              </div>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Checks overview
              </p>
              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Valid pages</span>
                  <span className="text-emerald-400">342</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Warnings</span>
                  <span className="text-amber-300">27</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Errors</span>
                  <span className="text-red-400">6</span>
                </div>
              </div>
            </article>
          </section>

          {/* Executive summary charts & tables */}
          <section
            className={`grid gap-4 lg:grid-cols-3 ${
              activeTab === "executive-summary" ? "opacity-100" : "hidden"
            }`}
          >
            <article className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    SEO performance
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Traffic, impressions, and ranking trends (illustrative).
                  </p>
                </div>
                <div className="hidden gap-2 text-[11px] text-slate-400 md:flex">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-emerald-400" />
                    Traffic
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-sky-400" />
                    Impressions
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-violet-400" />
                    Ranking
                  </span>
                </div>
              </div>
              <div className="mt-4 h-40 rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="flex h-full items-end gap-2">
                  {/* Day 1 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-10 flex-1 rounded-sm bg-emerald-400/80" />
                      <div className="h-7 flex-1 rounded-sm bg-sky-400/80" />
                      <div className="h-5 flex-1 rounded-sm bg-violet-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">Mon</p>
                  </div>
                  {/* Day 2 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-12 flex-1 rounded-sm bg-emerald-400/80" />
                      <div className="h-8 flex-1 rounded-sm bg-sky-400/80" />
                      <div className="h-6 flex-1 rounded-sm bg-violet-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">Tue</p>
                  </div>
                  {/* Day 3 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-11 flex-1 rounded-sm bg-emerald-400/80" />
                      <div className="h-9 flex-1 rounded-sm bg-sky-400/80" />
                      <div className="h-7 flex-1 rounded-sm bg-violet-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">Wed</p>
                  </div>
                  {/* Day 4 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-13 flex-1 rounded-sm bg-emerald-400/80" />
                      <div className="h-10 flex-1 rounded-sm bg-sky-400/80" />
                      <div className="h-8 flex-1 rounded-sm bg-violet-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">Thu</p>
                  </div>
                  {/* Day 5 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-14 flex-1 rounded-sm bg-emerald-400/80" />
                      <div className="h-11 flex-1 rounded-sm bg-sky-400/80" />
                      <div className="h-9 flex-1 rounded-sm bg-violet-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">Fri</p>
                  </div>
                  {/* Day 6 */}
                  <div className="hidden flex-1 flex-col justify-end gap-1 sm:flex">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-13 flex-1 rounded-sm bg-emerald-400/80" />
                      <div className="h-10 flex-1 rounded-sm bg-sky-400/80" />
                      <div className="h-8 flex-1 rounded-sm bg-violet-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">Sat</p>
                  </div>
                  {/* Day 7 */}
                  <div className="hidden flex-1 flex-col justify-end gap-1 md:flex">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-15 flex-1 rounded-sm bg-emerald-400/80" />
                      <div className="h-12 flex-1 rounded-sm bg-sky-400/80" />
                      <div className="h-10 flex-1 rounded-sm bg-violet-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-500">Sun</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Keyword movements
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Static summary of wins, risks, and opportunities.
              </p>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Brand cameras</span>
                  <span className="text-emerald-400">+6 positions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Mirrorless comparison</span>
                  <span className="text-emerald-400">+3 positions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">4K vlog camera</span>
                  <span className="text-amber-300">-2 positions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Best camera for travel</span>
                  <span className="text-red-400">-4 positions</span>
                </div>
              </div>
            </article>
          </section>

          {/* AI insights & alerts (also shown on AI insights tab) */}
          <section
            className={`grid gap-4 lg:grid-cols-3 ${
              activeTab === "ai-insights" || activeTab === "executive-summary"
                ? "opacity-100"
                : "hidden"
            }`}
          >
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                AI content ideas
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Static examples of prompts for the future AI engine.
              </p>
              <ul className="mt-4 space-y-3 text-xs text-slate-700">
                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  Generate an FAQ block for the &ldquo;vlog camera&rdquo; hub
                  page using language from top 5 SERPs.
                </li>
                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  Suggest 3 meta description variants for ZV-E10 with a max of
                  150 characters.
                </li>
                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  Rewrite the hero copy for &ldquo;mirrorless for creators&rdquo;
                  to emphasise low-light performance.
                </li>
              </ul>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Alerts
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Static list of issues to mimic future monitoring.
              </p>
              <ul className="mt-4 space-y-2 text-xs">
                <li className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <div>
                    <p className="font-medium text-amber-300">Indexing drop</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      17 product URLs lost impressions in the last 48 hours.
                    </p>
                  </div>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-amber-300">
                    High
                  </span>
                </li>
                <li className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <div>
                    <p className="font-medium text-sky-300">Slow template</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Category pages above 2.5s LCP in US mobile.
                    </p>
                  </div>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-sky-300">
                    Medium
                  </span>
                </li>
                <li className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <div>
                    <p className="font-medium text-slate-200">Schema coverage</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Review rich results missing on 5 key markets.
                    </p>
                  </div>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                    Info
                  </span>
                </li>
              </ul>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Experiments backlog
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Static roadmap-style list for upcoming tests.
              </p>
              <ul className="mt-4 space-y-3 text-xs text-slate-700">
                <li className="flex items-center justify-between">
                  <span>Product card copy test &mdash; cameras</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                    In design
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Title tag pattern for category pages</span>
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-600">
                    Ready
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Internal linking slot in blog</span>
                  <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    Backlog
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>AI-generated alt text pilot</span>
                  <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-600">
                    Idea
                  </span>
                </li>
              </ul>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
