"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MainTab = "executive-summary" | "seo-health" | "ai-insights";
type CountryCode = "GB" | "DE" | "FR" | "IT" | "ES";

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("executive-summary");
  const [keywordCountry, setKeywordCountry] = useState<CountryCode>("GB");
  const [landingPageFilter, setLandingPageFilter] = useState<string>("all");
  const [queryPositionFilter, setQueryPositionFilter] = useState<string>("all");
  const [brandQueryFilter, setBrandQueryFilter] = useState<string>("brand");

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

  const keywordRankingByMonth = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 = Jan

    // Start from April of the current year
    const startMonth = 3; // April

    // Last month relative to "now"
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);

    const months: {
      month: string;
      top3: number;
      fourTo10: number;
      elevenTo20: number;
      twentyOneTo50: number;
      fiftyOneTo100: number;
    }[] = [];

    for (
      let d = new Date(currentYear, startMonth, 1);
      d <= lastMonthDate;
      d.setMonth(d.getMonth() + 1)
    ) {
      const label = d.toLocaleString("en-GB", {
        month: "short",
        year: "2-digit",
      });

      // Simple synthetic pattern so bars change over time
      const monthIndexFromApril = d.getMonth() - startMonth;
      const baseTop3 = 18 + monthIndexFromApril * 1.2;
      const baseFourTo10 = 24 + monthIndexFromApril * 1.5;
      const baseElevenTo20 = 20 - monthIndexFromApril * 0.8;
      const baseTwentyOneTo50 = 12 - monthIndexFromApril * 0.6;
      const baseFiftyOneTo100 = 6 - monthIndexFromApril * 0.4;

      months.push({
        month: label.replace(" ", "-"),
        top3: Math.max(5, Math.round(baseTop3)),
        fourTo10: Math.max(5, Math.round(baseFourTo10)),
        elevenTo20: Math.max(3, Math.round(baseElevenTo20)),
        twentyOneTo50: Math.max(2, Math.round(baseTwentyOneTo50)),
        fiftyOneTo100: Math.max(1, Math.round(baseFiftyOneTo100)),
      });
    }

    if (months.length === 0) {
      return [
        { month: "Apr-25", top3: 18, fourTo10: 24, elevenTo20: 20, twentyOneTo50: 12, fiftyOneTo100: 6 },
        { month: "May-25", top3: 20, fourTo10: 26, elevenTo20: 19, twentyOneTo50: 11, fiftyOneTo100: 5 },
        { month: "Jun-25", top3: 22, fourTo10: 27, elevenTo20: 18, twentyOneTo50: 10, fiftyOneTo100: 5 },
        { month: "Jul-25", top3: 23, fourTo10: 28, elevenTo20: 17, twentyOneTo50: 9, fiftyOneTo100: 5 },
        { month: "Aug-25", top3: 24, fourTo10: 29, elevenTo20: 16, twentyOneTo50: 9, fiftyOneTo100: 4 },
        { month: "Sep-25", top3: 25, fourTo10: 30, elevenTo20: 15, twentyOneTo50: 8, fiftyOneTo100: 4 },
        { month: "Oct-25", top3: 26, fourTo10: 31, elevenTo20: 14, twentyOneTo50: 8, fiftyOneTo100: 3 },
      ];
    }

    return months;
  }, []);

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
            {false && (
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Keywords Ranking
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Distribution of tracked queries by Google position group.
              </p>
              <div className="mt-4 space-y-3 text-[11px] text-slate-700">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>All tracked keywords</span>
                    <span className="text-slate-400">Count by position group</span>
                  </div>
                  <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-[#4aa6c5]/80"
                      style={{ width: "24%" }}
                    />
                    <div
                      className="h-full bg-[#3551e6]/80"
                      style={{ width: "32%" }}
                    />
                    <div
                      className="h-full bg-emerald-400/80"
                      style={{ width: "22%" }}
                    />
                    <div
                      className="h-full bg-amber-400/80"
                      style={{ width: "16%" }}
                    />
                    <div
                      className="h-full bg-slate-300/90"
                      style={{ width: "6%" }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4aa6c5]" />
                      Top 3
                    </span>
                    <span className="font-medium text-slate-900">24 keywords</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3551e6]" />
                      4–10
                    </span>
                    <span className="font-medium text-slate-900">32 keywords</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      11–20
                    </span>
                    <span className="font-medium text-slate-900">22 keywords</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      21–50
                    </span>
                    <span className="font-medium text-slate-900">16 keywords</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      51–100
                    </span>
                    <span className="font-medium text-slate-900">6 keywords</span>
                  </div>
                </div>
              </div>
            </article>
            )}

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Keywords Ranking
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Distribution of tracked queries by Google position group over recent months.
              </p>
              <div className="mt-4 text-[11px] text-slate-700">
                <div className="h-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Ranking buckets (by position group)</span>
                    <span className="text-slate-400">From Apr to last month</span>
                  </div>
                  <div className="mt-3 flex h-24 items-end gap-2">
                    {(() => {
                      const baseHeight = 40; // px
                      const step = 6;       // px per month

                      return keywordRankingByMonth.map((monthData, index) => {
                        const total =
                          monthData.top3 +
                          monthData.fourTo10 +
                          monthData.elevenTo20 +
                          monthData.twentyOneTo50 +
                          monthData.fiftyOneTo100;

                        const barHeight = baseHeight + index * step;

                        const top3Height = Math.max(
                          3,
                          (monthData.top3 / total) * barHeight
                        );
                        const fourTo10Height = Math.max(
                          3,
                          (monthData.fourTo10 / total) * barHeight
                        );
                        const elevenTo20Height = Math.max(
                          3,
                          (monthData.elevenTo20 / total) * barHeight
                        );
                        const twentyOneTo50Height = Math.max(
                          3,
                          (monthData.twentyOneTo50 / total) * barHeight
                        );
                        const fiftyOneTo100Height = Math.max(
                          3,
                          (monthData.fiftyOneTo100 / total) * barHeight
                        );

                        return (
                          <div
                            key={monthData.month}
                            className="flex flex-1 flex-col justify-end gap-1"
                          >
                          <div className="flex h-full w-8 flex-col-reverse overflow-hidden rounded-sm bg-slate-100 mx-auto">
                              <div
                                className="w-full bg-slate-300/90"
                                style={{ height: `${fiftyOneTo100Height}px` }}
                              />
                              <div
                                className="w-full bg-amber-400/80"
                                style={{ height: `${twentyOneTo50Height}px` }}
                              />
                              <div
                                className="w-full bg-emerald-400/80"
                                style={{ height: `${elevenTo20Height}px` }}
                              />
                              <div
                                className="w-full bg-[#3551e6]/80"
                                style={{ height: `${fourTo10Height}px` }}
                              />
                              <div
                                className="w-full bg-[#4aa6c5]/80"
                                style={{ height: `${top3Height}px` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500 text-center">
                              {monthData.month}
                            </p>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[10px]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4aa6c5]" />
                    Top 3
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3551e6]" />
                    4–10
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    11–20
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    21–50
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    51–100
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Ranking KPIs
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Snapshot of keywords in each position group.
                </p>
              </div>
              <div className="mt-3 space-y-2 text-[11px] text-slate-700">
                <div className="flex items-center text-[10px] font-medium text-slate-500">
                  <span className="w-1/3">Bucket</span>
                  <span className="w-1/3 text-right">Keywords</span>
                  <span className="w-1/3 text-right">vs. prev. month</span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="flex w-1/3 items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4aa6c5]" />
                    Top 3
                  </span>
                  <span className="w-1/3 text-right text-slate-900">
                    124
                  </span>
                  <span className="w-1/3 text-right text-[10px] text-emerald-500">
                    +8
                  </span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="flex w-1/3 items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3551e6]" />
                    4–10
                  </span>
                  <span className="w-1/3 text-right text-slate-900">
                    212
                  </span>
                  <span className="w-1/3 text-right text-[10px] text-emerald-500">
                    +14
                  </span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="flex w-1/3 items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    11–20
                  </span>
                  <span className="w-1/3 text-right text-slate-900">
                    178
                  </span>
                  <span className="w-1/3 text-right text-[10px] text-amber-500">
                    -6
                  </span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="flex w-1/3 items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    21–50
                  </span>
                  <span className="w-1/3 text-right text-slate-900">
                    96
                  </span>
                  <span className="w-1/3 text-right text-[10px] text-slate-500">
                    0
                  </span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="flex w-1/3 items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    51–100
                  </span>
                  <span className="w-1/3 text-right text-slate-900">
                    38
                  </span>
                  <span className="w-1/3 text-right text-[10px] text-emerald-500">
                    -3
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  Data for last completed month.
                </p>
              </div>
            </article>

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
                <div className="mt-3 flex h-24 items-end gap-4 relative">
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
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Top queries (sample)</span>
                  <div className="flex items-center gap-1">
                    <span>Position</span>
                    <select
                      className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px]"
                      value={queryPositionFilter}
                      onChange={(e) => setQueryPositionFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="1-3">1–3</option>
                      <option value="4-10">4–10</option>
                      <option value="11-20">11–20</option>
                      <option value="21+">21+</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                  <span className="w-2/5">Query</span>
                  <span className="w-1/5 text-right">Avg. pos.</span>
                  <span className="w-1/5 text-right">Impr.</span>
                  <span className="w-1/5 text-right">CTR</span>
                </div>
                <div className="mt-2 max-h-24 overflow-y-auto pr-1 space-y-1.5">
                  {[
                    {
                      id: "q-broadcast",
                      query: "sony broadcast cameras",
                      avgPos: "2.3",
                      avgTone: "text-[#4aa6c5]",
                      impr: "92k",
                      ctr: "8.4%",
                      bucket: "1-3",
                    },
                    {
                      id: "q-ptz",
                      query: "sony ptz camera",
                      avgPos: "4.7",
                      avgTone: "text-[#4aa6c5]",
                      impr: "41k",
                      ctr: "6.1%",
                      bucket: "4-10",
                    },
                    {
                      id: "q-switcher",
                      query: "sony live production switcher",
                      avgPos: "9.8",
                      avgTone: "text-[#3551e6]",
                      impr: "18k",
                      ctr: "3.2%",
                      bucket: "4-10",
                    },
                    {
                      id: "q-bravia",
                      query: "sony bravia broadcast monitor",
                      avgPos: "14.2",
                      avgTone: "text-[#3551e6]",
                      impr: "11k",
                      ctr: "1.9%",
                      bucket: "11-20",
                    },
                    {
                      id: "q-remote-production",
                      query: "sony remote production",
                      avgPos: "5.6",
                      avgTone: "text-[#4aa6c5]",
                      impr: "23k",
                      ctr: "4.2%",
                      bucket: "4-10",
                    },
                    {
                      id: "q-4k-switcher",
                      query: "sony 4k switcher",
                      avgPos: "8.9",
                      avgTone: "text-[#3551e6]",
                      impr: "15k",
                      ctr: "3.0%",
                      bucket: "4-10",
                    },
                    {
                      id: "q-studio-camera",
                      query: "sony studio camera system",
                      avgPos: "3.8",
                      avgTone: "text-[#4aa6c5]",
                      impr: "37k",
                      ctr: "5.6%",
                      bucket: "1-3",
                    },
                    {
                      id: "q-bravia-professional",
                      query: "sony bravia professional display",
                      avgPos: "12.4",
                      avgTone: "text-[#3551e6]",
                      impr: "19k",
                      ctr: "2.3%",
                      bucket: "11-20",
                    },
                    {
                      id: "q-broadcast-monitor",
                      query: "sony hdr broadcast monitor",
                      avgPos: "22.1",
                      avgTone: "text-[#3551e6]",
                      impr: "9.8k",
                      ctr: "1.4%",
                      bucket: "21+",
                    },
                    {
                      id: "q-system-camera",
                      query: "sony system camera",
                      avgPos: "2.9",
                      avgTone: "text-[#4aa6c5]",
                      impr: "34k",
                      ctr: "7.2%",
                      bucket: "1-3",
                    },
                    {
                      id: "q-broadcast-lens",
                      query: "sony broadcast lens",
                      avgPos: "6.3",
                      avgTone: "text-[#4aa6c5]",
                      impr: "27k",
                      ctr: "3.9%",
                      bucket: "4-10",
                    },
                    {
                      id: "q-replay-server",
                      query: "sony replay server",
                      avgPos: "13.6",
                      avgTone: "text-[#3551e6]",
                      impr: "12k",
                      ctr: "2.0%",
                      bucket: "11-20",
                    },
                    {
                      id: "q-production-accessories",
                      query: "sony production accessories",
                      avgPos: "24.4",
                      avgTone: "text-[#3551e6]",
                      impr: "8.1k",
                      ctr: "1.1%",
                      bucket: "21+",
                    },
                  ]
                    .filter((row) =>
                      queryPositionFilter === "all"
                        ? true
                        : row.bucket === queryPositionFilter
                    )
                    .map((row) => (
                      <div
                        key={row.id}
                        className="flex items-center justify-between"
                      >
                        <span className="w-2/5 truncate">{row.query}</span>
                        <span
                          className={`w-1/5 text-right font-medium ${row.avgTone}`}
                        >
                          {row.avgPos}
                        </span>
                        <span className="w-1/5 text-right">{row.impr}</span>
                        <span className="w-1/5 text-right">{row.ctr}</span>
                      </div>
                    ))}
                </div>
              </div>
            </article>

            {false && (
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
            )}

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Landing pages by keyword
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Explore how key queries map to core landing pages.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span>Filter</span>
                    <select
                      className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px]"
                      value={landingPageFilter}
                      onChange={(e) => setLandingPageFilter(e.target.value)}
                    >
                      <option value="all">All queries</option>
                      <option value="sony-broadcast-cameras">sony broadcast cameras</option>
                      <option value="sony-ptz-camera">sony ptz camera</option>
                      <option value="sony-live-production-switcher">sony live production switcher</option>
                      <option value="sony-bravia-broadcast-monitor">sony bravia broadcast monitor</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                  <span className="w-2/5">Landing page</span>
                  <span className="w-1/5 text-right">Keywords</span>
                  <span className="w-1/5 text-right">Impressions</span>
                  <span className="w-1/5 text-right">Clicks</span>
                  <span className="w-1/5 text-right">Avg. pos.</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {[
                    {
                      id: "lp-broadcast",
                      path: "/broadcast-cameras/4k-system",
                      keywords: "18",
                      impressions: "92k",
                      clicks: "4.2k",
                      avgPos: "3.1",
                      avgPosTone: "text-emerald-500",
                      query: "sony-broadcast-cameras",
                    },
                    {
                      id: "lp-ptz",
                      path: "/ptz-remote-cameras/overview",
                      keywords: "14",
                      impressions: "61k",
                      clicks: "2.8k",
                      avgPos: "4.4",
                      avgPosTone: "text-emerald-500",
                      query: "sony-ptz-camera",
                    },
                    {
                      id: "lp-switchers",
                      path: "/live-production-switchers",
                      keywords: "11",
                      impressions: "48k",
                      clicks: "1.9k",
                      avgPos: "6.2",
                      avgPosTone: "text-amber-500",
                      query: "sony-live-production-switcher",
                    },
                    {
                      id: "lp-bravia",
                      path: "/bravia-broadcast-monitors",
                      keywords: "9",
                      impressions: "33k",
                      clicks: "1.1k",
                      avgPos: "7.5",
                      avgPosTone: "text-amber-500",
                      query: "sony-bravia-broadcast-monitor",
                    },
                    {
                      id: "lp-ip-live",
                      path: "/ip-live-production/solutions",
                      keywords: "7",
                      impressions: "21k",
                      clicks: "680",
                      avgPos: "9.8",
                      avgPosTone: "text-red-400",
                      query: "sony-live-production-switcher",
                    },
                    {
                      id: "lp-system-entry",
                      path: "/system-cameras/entry-level",
                      keywords: "6",
                      impressions: "14k",
                      clicks: "520",
                      avgPos: "8.7",
                      avgPosTone: "text-amber-500",
                      query: "sony-broadcast-cameras",
                    },
                    {
                      id: "lp-remote-cloud",
                      path: "/remote-production/cloud",
                      keywords: "5",
                      impressions: "11k",
                      clicks: "390",
                      avgPos: "10.4",
                      avgPosTone: "text-red-400",
                      query: "sony-ptz-camera",
                    },
                    {
                      id: "lp-virtual-stage",
                      path: "/virtual-production/stage",
                      keywords: "4",
                      impressions: "9.2k",
                      clicks: "310",
                      avgPos: "9.1",
                      avgPosTone: "text-amber-500",
                      query: "sony-live-production-switcher",
                    },
                    {
                      id: "lp-sports",
                      path: "/solutions/sports-production",
                      keywords: "4",
                      impressions: "8.5k",
                      clicks: "280",
                      avgPos: "9.6",
                      avgPosTone: "text-amber-500",
                      query: "sony-broadcast-cameras",
                    },
                    {
                      id: "lp-house-of-worship",
                      path: "/solutions/house-of-worship",
                      keywords: "3",
                      impressions: "7.9k",
                      clicks: "250",
                      avgPos: "9.9",
                      avgPosTone: "text-amber-500",
                      query: "sony-bravia-broadcast-monitor",
                    },
                    {
                      id: "lp-education",
                      path: "/education/lecture-capture",
                      keywords: "3",
                      impressions: "7.1k",
                      clicks: "230",
                      avgPos: "10.2",
                      avgPosTone: "text-amber-500",
                      query: "sony-ptz-camera",
                    },
                    {
                      id: "lp-cinema-line",
                      path: "/cinema-line/cameras",
                      keywords: "3",
                      impressions: "6.4k",
                      clicks: "210",
                      avgPos: "10.8",
                      avgPosTone: "text-amber-500",
                      query: "sony-broadcast-cameras",
                    },
                  ]
                    .filter((row) =>
                      landingPageFilter === "all"
                        ? true
                        : row.query === landingPageFilter
                    )
                    .map((row) => (
                      <div
                        key={row.id}
                        className="flex items-center justify-between"
                      >
                        <span className="w-2/5 truncate">{row.path}</span>
                        <span className="w-1/5 text-right text-slate-700">
                          {row.keywords}
                        </span>
                        <span className="w-1/5 text-right text-slate-700">
                          {row.impressions}
                        </span>
                        <span className="w-1/5 text-right text-slate-700">
                          {row.clicks}
                        </span>
                        <span
                          className={`w-1/5 text-right font-medium ${row.avgPosTone}`}
                        >
                          {row.avgPos}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Keyword movement & intent mix
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Filter</span>
                  <select
                    className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px]"
                    value={brandQueryFilter}
                    onChange={(e) => setBrandQueryFilter(e.target.value)}
                  >
                    <option value="brand">Brand queries</option>
                    <option value="non-brand">Non‑brand queries</option>
                    <option value="all">All queries</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 grid gap-8 md:grid-cols-2 text-xs text-slate-700">
                {/* Intent & brand split (moved to left) */}
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

                {/* Brand / non-brand queries table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                    <span className="w-2/5">Query</span>
                    <span className="w-1/5 text-right">Impr.</span>
                    <span className="w-1/5 text-right">CTR</span>
                  </div>
                  <div className="mt-1 max-h-24 space-y-1.5 overflow-y-auto pr-1">
                    {[
                      {
                        id: "brand-1",
                        query: "sony broadcast cameras",
                        type: "brand",
                        impr: "92k",
                        ctr: "8.4%",
                      },
                      {
                        id: "brand-2",
                        query: "sony bravia broadcast monitor",
                        type: "brand",
                        impr: "33k",
                        ctr: "5.1%",
                      },
                      {
                        id: "brand-3",
                        query: "sony ptz camera",
                        type: "brand",
                        impr: "41k",
                        ctr: "6.1%",
                      },
                      {
                        id: "brand-4",
                        query: "sony live production switcher",
                        type: "brand",
                        impr: "18k",
                        ctr: "3.2%",
                      },
                      {
                        id: "non-1",
                        query: "4k broadcast camera",
                        type: "non-brand",
                        impr: "27k",
                        ctr: "3.9%",
                      },
                      {
                        id: "non-2",
                        query: "ptz camera for church",
                        type: "non-brand",
                        impr: "19k",
                        ctr: "2.8%",
                      },
                      {
                        id: "non-3",
                        query: "live production switcher",
                        type: "non-brand",
                        impr: "22k",
                        ctr: "2.3%",
                      },
                      {
                        id: "non-4",
                        query: "hdr broadcast monitor",
                        type: "non-brand",
                        impr: "14k",
                        ctr: "1.6%",
                      },
                    ]
                      .filter((row) =>
                        brandQueryFilter === "all"
                          ? true
                          : row.type === brandQueryFilter
                      )
                      .map((row) => (
                        <div
                          key={row.id}
                          className="flex items-center justify-between"
                        >
                          <span className="w-2/5 truncate">{row.query}</span>
                          <span className="w-1/5 text-right">
                            {row.impr}
                          </span>
                          <span className="w-1/5 text-right">{row.ctr}</span>
                        </div>
                      ))}
                  </div>
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
