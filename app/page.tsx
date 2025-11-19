"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MainTab = "executive-summary" | "seo-health" | "ai-insights";
type CountryCode = "GB" | "DE" | "FR" | "IT" | "ES";

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("executive-summary");
  const [keywordCountry, setKeywordCountry] = useState<CountryCode>("GB");

  const headerTitle = useMemo(() => {
    switch (activeTab) {
      case "seo-health":
        return "Keywords";
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
                alt="Sony logo"
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
            <span className="h-1.5 w-1.5 rounded-full bg-[#4aa6c5]" />
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
            <span className="h-1.5 w-1.5 rounded-full bg-[#3551e6]" />
            <span>Keywords</span>
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
            <span className="h-1.5 w-1.5 rounded-full bg-[#3551e6]" />
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
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4aa6c5]/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4aa6c5]" />
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
                <span className="text-xs text-[#4aa6c5]">+1.2 vs. last week</span>
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
                <span className="text-xs text-[#4aa6c5]">+6.8%</span>
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

          {/* Keywords / SEO health content */}
          <section
            className={`grid gap-4 lg:grid-cols-3 ${
              activeTab === "seo-health" ? "opacity-100" : "hidden"
            }`}
          >
            <article className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Keyword visibility & traffic
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Snapshot of how priority queries rank, attract impressions, and convert into clicks.
              </p>
              <div className="mt-4 h-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Ranking buckets (by clicks)</span>
                  <span className="text-slate-400">Last 7 days</span>
                </div>
                <div className="mt-3 flex h-24 items-end gap-4">
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-full items-end gap-[3px]">
                      <div className="h-16 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-8 flex-1 rounded-sm bg-[#3551e6]/70" />
                    </div>
                    <p className="text-[10px] text-slate-500">Pos. 1–3</p>
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-full items-end gap-[3px]">
                      <div className="h-11 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-9 flex-1 rounded-sm bg-[#3551e6]/70" />
                    </div>
                    <p className="text-[10px] text-slate-500">Pos. 4–10</p>
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-full items-end gap-[3px]">
                      <div className="h-7 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-10 flex-1 rounded-sm bg-[#3551e6]/70" />
                    </div>
                    <p className="text-[10px] text-slate-500">Pos. 11–20</p>
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-full items-end gap-[3px]">
                      <div className="h-4 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-9 flex-1 rounded-sm bg-[#3551e6]/70" />
                    </div>
                    <p className="text-[10px] text-slate-500">Pos. 21+</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-[10px]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#4aa6c5]" />
                    Clicks
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#3551e6]" />
                    Impressions
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                  <span className="w-2/5">Query</span>
                  <span className="w-1/5 text-right">Avg. pos.</span>
                  <span className="w-1/5 text-right">Impr.</span>
                  <span className="w-1/5 text-right">CTR</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-2/5 truncate">sony broadcast cameras</span>
                    <span className="w-1/5 text-right text-[#4aa6c5] font-medium">2.3</span>
                    <span className="w-1/5 text-right">92k</span>
                    <span className="w-1/5 text-right text-[#4aa6c5]">8.4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-2/5 truncate">sony ptz camera</span>
                    <span className="w-1/5 text-right text-[#4aa6c5] font-medium">4.7</span>
                    <span className="w-1/5 text-right">41k</span>
                    <span className="w-1/5 text-right text-[#4aa6c5]">6.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-2/5 truncate">sony live production switcher</span>
                    <span className="w-1/5 text-right text-[#3551e6] font-medium">9.8</span>
                    <span className="w-1/5 text-right">18k</span>
                    <span className="w-1/5 text-right text-[#3551e6]">3.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-2/5 truncate">sony bravia broadcast monitor</span>
                    <span className="w-1/5 text-right text-[#3551e6] font-medium">14.2</span>
                    <span className="w-1/5 text-right">11k</span>
                    <span className="w-1/5 text-right text-[#3551e6]">1.9%</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Priority keyword actions
              </p>
              <div className="mt-3 space-y-3 text-xs text-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">Protect #1–3 rankings</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Monitor cannibalisation and keep core product queries above competitors.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#4aa6c5]/10 px-2 py-0.5 text-[10px] font-semibold text-[#4aa6c5]">
                    Stable
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">Push 4–10 into top 3</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Optimise on-page copy and internal links for high-intent queries in striking distance.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#3551e6]/10 px-2 py-0.5 text-[10px] font-semibold text-[#3551e6]">
                    Opportunity
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">Fix low-CTR queries</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Test title/meta variants where CTR is below benchmark for the position.
                    </p>
                  </div>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
                    Experiment
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">Capture new intent</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Create landing pages for emerging search themes (e.g. bundles, accessories, TV + console).
                    </p>
                  </div>
                  <span className="rounded-full bg-[#3551e6]/10 px-2 py-0.5 text-[10px] font-semibold text-[#3551e6]">
                    Backlog
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Keyword movement & intent mix
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2 text-xs text-slate-700">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Movement vs. last 7 days</span>
                    <span className="text-slate-400">Top 100 tracked queries</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4aa6c5]" />
                        Improved
                      </span>
                      <span className="text-emerald-500 font-medium">38</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3551e6]" />
                        Stable
                      </span>
                      <span className="text-slate-700 font-medium">44</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#f4716a]" />
                        Declined
                      </span>
                      <span className="text-red-400 font-medium">18</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[38%] bg-[#4aa6c5]/80" />
                    <div className="h-full w-[44%] bg-[#3551e6]/80" />
                    <div className="h-full w-[18%] bg-[#f4716a]/80" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Intent & brand split</span>
                    <span className="text-slate-400">By impressions</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span>Brand</span>
                      <span className="text-slate-700 font-medium">58%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-full w-[58%] rounded-full bg-[#3551e6]/80" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Non-brand</span>
                      <span className="text-slate-700 font-medium">42%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-full w-[42%] rounded-full bg-[#4aa6c5]/80" />
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Aim to grow non-brand discovery without losing share on core brand queries.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Keyword landing pages
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Pages that capture the most keyword demand and where to optimise next.
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2 text-xs text-slate-700">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="w-2/5">Landing page</span>
                    <span className="w-1/5 text-right">Clicks</span>
                    <span className="w-1/5 text-right">Conv.</span>
                    <span className="w-1/5 text-right">Cluster</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-2/5 truncate">/broadcast-cameras</span>
                    <span className="w-1/5 text-right">32k</span>
                    <span className="w-1/5 text-right text-emerald-500">3.4%</span>
                    <span className="w-1/5 text-right text-slate-500">System cameras</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-2/5 truncate">/ptz-cameras</span>
                    <span className="w-1/5 text-right">18k</span>
                    <span className="w-1/5 text-right text-emerald-500">2.1%</span>
                    <span className="w-1/5 text-right text-slate-500">PTZ & remote</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-2/5 truncate">/live-production-switchers</span>
                    <span className="w-1/5 text-right">9.4k</span>
                    <span className="w-1/5 text-right text-amber-400">1.6%</span>
                    <span className="w-1/5 text-right text-slate-500">Switchers & servers</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-2/5 truncate">/bravia-broadcast-monitors</span>
                    <span className="w-1/5 text-right">6.8k</span>
                    <span className="w-1/5 text-right text-sky-500">1.2%</span>
                    <span className="w-1/5 text-right text-slate-500">Broadcast monitors</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>SERP features coverage</span>
                    <span className="text-slate-400">Share of tracked queries</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4aa6c5]" />
                        Sitelinks
                      </span>
                      <span className="text-slate-700 font-medium">62%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-full w-[62%] rounded-full bg-[#4aa6c5]/80" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3551e6]" />
                        FAQ / rich results
                      </span>
                      <span className="text-slate-700 font-medium">28%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-full w-[28%] rounded-full bg-[#3551e6]/80" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3551e6]" />
                        Video / Discover
                      </span>
                      <span className="text-slate-700 font-medium">14%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-full w-[14%] rounded-full bg-[#3551e6]/80" />
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Prioritise schema and on-page enhancements for pages that could win additional features.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Top keywords by country
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Last 7 days • Top queries for key European markets.
                  </p>
                </div>
                <div className="flex gap-1 rounded-full bg-slate-100 p-0.5 text-[11px] text-slate-600">
                  {(["GB", "DE", "FR", "IT", "ES"] as CountryCode[]).map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => setKeywordCountry(country)}
                      className={`px-2 py-0.5 rounded-full border text-xs ${
                        keywordCountry === country
                          ? "border-slate-900 bg-white font-semibold text-slate-900 shadow-sm"
                          : "border-transparent hover:border-slate-300 hover:bg-white/60"
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                  <span className="w-2/5">Query</span>
                  <span className="w-1/5 text-right">Clicks</span>
                  <span className="w-1/5 text-right">Impr.</span>
                  <span className="w-1/5 text-right">Avg. pos.</span>
                  <span className="w-1/5 text-right">PoP</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {keywordCountry === "GB" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony broadcast cameras</span>
                        <span className="w-1/5 text-right">4.2k</span>
                        <span className="w-1/5 text-right">38k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">2.1</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+12%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony system camera</span>
                        <span className="w-1/5 text-right">2.9k</span>
                        <span className="w-1/5 text-right">31k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">3.4</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony ptz camera</span>
                        <span className="w-1/5 text-right">2.1k</span>
                        <span className="w-1/5 text-right">19k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">4.2</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony live production switcher</span>
                        <span className="w-1/5 text-right">1.8k</span>
                        <span className="w-1/5 text-right">15k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">3.9</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">4k broadcast camera sony</span>
                        <span className="w-1/5 text-right">1.5k</span>
                        <span className="w-1/5 text-right">13k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">5.4</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">+3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony hdr reference monitor</span>
                        <span className="w-1/5 text-right">1.3k</span>
                        <span className="w-1/5 text-right">11k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">6.2</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+6%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony xdcam camcorder</span>
                        <span className="w-1/5 text-right">1.1k</span>
                        <span className="w-1/5 text-right">9k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">7.1</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">+2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">remote production sony</span>
                        <span className="w-1/5 text-right">980</span>
                        <span className="w-1/5 text-right">8.4k</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">11.3</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">-4%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony bravia pro display</span>
                        <span className="w-1/5 text-right">910</span>
                        <span className="w-1/5 text-right">7.9k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">8.7</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">ip live production sony</span>
                        <span className="w-1/5 text-right">860</span>
                        <span className="w-1/5 text-right">7.3k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">9.4</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">-2%</span>
                      </div>
                    </>
                  )}
                  {keywordCountry === "DE" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony broadcast kamera</span>
                        <span className="w-1/5 text-right">3.4k</span>
                        <span className="w-1/5 text-right">27k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">2.7</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+10%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony studiokamera</span>
                        <span className="w-1/5 text-right">2.2k</span>
                        <span className="w-1/5 text-right">20k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">3.9</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony ptz kamera</span>
                        <span className="w-1/5 text-right">1.7k</span>
                        <span className="w-1/5 text-right">14k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">6.1</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony live mixer</span>
                        <span className="w-1/5 text-right">1.4k</span>
                        <span className="w-1/5 text-right">12k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">4.1</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+6%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">4k broadcast kamera sony</span>
                        <span className="w-1/5 text-right">1.2k</span>
                        <span className="w-1/5 text-right">10k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">5.6</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">+4%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony hdr monitor</span>
                        <span className="w-1/5 text-right">1.0k</span>
                        <span className="w-1/5 text-right">8.6k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">6.8</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony xdcam recorder</span>
                        <span className="w-1/5 text-right">930</span>
                        <span className="w-1/5 text-right">7.5k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">7.4</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">+1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">sony ip live produktion</span>
                        <span className="w-1/5 text-right">880</span>
                        <span className="w-1/5 text-right">7.1k</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">10.2</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">-3%</span>
                      </div>
                    </>
                  )}
                  {keywordCountry === "FR" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">caméra broadcast sony</span>
                        <span className="w-1/5 text-right">3.1k</span>
                        <span className="w-1/5 text-right">25k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">2.4</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+11%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">caméra studio sony</span>
                        <span className="w-1/5 text-right">2.0k</span>
                        <span className="w-1/5 text-right">18k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">3.8</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">caméra ptz sony</span>
                        <span className="w-1/5 text-right">1.5k</span>
                        <span className="w-1/5 text-right">13k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">6.5</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+4%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">régie vidéo sony</span>
                        <span className="w-1/5 text-right">1.3k</span>
                        <span className="w-1/5 text-right">11k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">3.6</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">moniteur hdr sony</span>
                        <span className="w-1/5 text-right">1.1k</span>
                        <span className="w-1/5 text-right">9.4k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">4.9</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+6%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">caméra 4k broadcast sony</span>
                        <span className="w-1/5 text-right">980</span>
                        <span className="w-1/5 text-right">8.1k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">7.3</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">+2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">solution ip live sony</span>
                        <span className="w-1/5 text-right">930</span>
                        <span className="w-1/5 text-right">7.8k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">8.6</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">-3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">écran professionnel sony</span>
                        <span className="w-1/5 text-right">870</span>
                        <span className="w-1/5 text-right">7.1k</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">10.4</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">-5%</span>
                      </div>
                    </>
                  )}
                  {keywordCountry === "IT" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">telecamera broadcast sony</span>
                        <span className="w-1/5 text-right">2.4k</span>
                        <span className="w-1/5 text-right">19k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">3.1</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">telecamera ptz sony</span>
                        <span className="w-1/5 text-right">1.6k</span>
                        <span className="w-1/5 text-right">12k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">4.4</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+6%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">regia video sony</span>
                        <span className="w-1/5 text-right">1.3k</span>
                        <span className="w-1/5 text-right">10k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">6.9</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">telecamera studio 4k sony</span>
                        <span className="w-1/5 text-right">1.2k</span>
                        <span className="w-1/5 text-right">9.4k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">4.0</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">monitor hdr sony</span>
                        <span className="w-1/5 text-right">1.0k</span>
                        <span className="w-1/5 text-right">8.1k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">4.8</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">telecamera spalla xdcam</span>
                        <span className="w-1/5 text-right">920</span>
                        <span className="w-1/5 text-right">7.5k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">7.2</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">+2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">soluzioni ip live sony</span>
                        <span className="w-1/5 text-right">870</span>
                        <span className="w-1/5 text-right">7.0k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">8.9</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">-3%</span>
                      </div>
                    </>
                  )}
                  {keywordCountry === "ES" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">cámara broadcast sony</span>
                        <span className="w-1/5 text-right">2.6k</span>
                        <span className="w-1/5 text-right">21k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">3.0</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+10%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">cámara ptz sony</span>
                        <span className="w-1/5 text-right">1.8k</span>
                        <span className="w-1/5 text-right">13k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">4.6</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+6%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">mesa de realización sony</span>
                        <span className="w-1/5 text-right">1.4k</span>
                        <span className="w-1/5 text-right">11k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">6.7</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+4%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">cámara de estudio 4k sony</span>
                        <span className="w-1/5 text-right">1.2k</span>
                        <span className="w-1/5 text-right">9.6k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">5.9</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">monitor hdr profesional sony</span>
                        <span className="w-1/5 text-right">1.0k</span>
                        <span className="w-1/5 text-right">8.2k</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">4.3</span>
                        <span className="w-1/5 text-right text-emerald-500 font-medium">+7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">cámara hombro xdcam sony</span>
                        <span className="w-1/5 text-right">950</span>
                        <span className="w-1/5 text-right">7.7k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">7.0</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">+3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-2/5 truncate">producción remota sony</span>
                        <span className="w-1/5 text-right">900</span>
                        <span className="w-1/5 text-right">7.2k</span>
                        <span className="w-1/5 text-right text-amber-400 font-medium">8.5</span>
                        <span className="w-1/5 text-right text-red-400 font-medium">-2%</span>
                      </div>
                    </>
                  )}
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  PoP = change vs. previous 7 days (clicks).
                </p>
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
                    <span className="h-1.5 w-4 rounded-full bg-[#4aa6c5]" />
                    Traffic
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#3551e6]" />
                    Impressions
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#4aa6c5]" />
                    Ranking
                  </span>
                </div>
              </div>
              <div className="mt-4 h-40 rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="flex h-full items-end gap-2">
                  {/* Day 1 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-10 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-7 flex-1 rounded-sm bg-[#3551e6]/80" />
                      <div className="h-5 flex-1 rounded-sm bg-[#4aa6c5]/40" />
                    </div>
                    <p className="text-[10px] text-slate-500">Mon</p>
                  </div>
                  {/* Day 2 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-12 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-8 flex-1 rounded-sm bg-[#3551e6]/80" />
                      <div className="h-6 flex-1 rounded-sm bg-[#4aa6c5]/40" />
                    </div>
                    <p className="text-[10px] text-slate-500">Tue</p>
                  </div>
                  {/* Day 3 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-11 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-9 flex-1 rounded-sm bg-[#3551e6]/80" />
                      <div className="h-7 flex-1 rounded-sm bg-[#4aa6c5]/40" />
                    </div>
                    <p className="text-[10px] text-slate-500">Wed</p>
                  </div>
                  {/* Day 4 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-13 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-10 flex-1 rounded-sm bg-[#3551e6]/80" />
                      <div className="h-8 flex-1 rounded-sm bg-[#4aa6c5]/40" />
                    </div>
                    <p className="text-[10px] text-slate-500">Thu</p>
                  </div>
                  {/* Day 5 */}
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-14 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-11 flex-1 rounded-sm bg-[#3551e6]/80" />
                      <div className="h-9 flex-1 rounded-sm bg-[#4aa6c5]/40" />
                    </div>
                    <p className="text-[10px] text-slate-500">Fri</p>
                  </div>
                  {/* Day 6 */}
                  <div className="hidden flex-1 flex-col justify-end gap-1 sm:flex">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-13 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-10 flex-1 rounded-sm bg-[#3551e6]/80" />
                      <div className="h-8 flex-1 rounded-sm bg-[#4aa6c5]/40" />
                    </div>
                    <p className="text-[10px] text-slate-500">Sat</p>
                  </div>
                  {/* Day 7 */}
                  <div className="hidden flex-1 flex-col justify-end gap-1 md:flex">
                    <div className="flex h-24 items-end gap-[3px]">
                      <div className="h-15 flex-1 rounded-sm bg-[#4aa6c5]/80" />
                      <div className="h-12 flex-1 rounded-sm bg-[#3551e6]/80" />
                      <div className="h-10 flex-1 rounded-sm bg-[#4aa6c5]/40" />
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
                  <span className="rounded-full bg-[#4aa6c5]/10 px-2 py-0.5 text-[10px] font-medium text-[#4aa6c5]">
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
                  <span className="rounded-full bg-[#3551e6]/10 px-2 py-0.5 text-[10px] font-medium text-[#3551e6]">
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
