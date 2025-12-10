"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MainTab = "executive-summary" | "seo-health" | "ai-insights";
type CountryCode = "GB" | "DE" | "FR" | "IT" | "ES" | "NL" | "BE" | "AT" | "SE" | "NO" | "DK" | "FI" | "PL" | "PT" | "IE" | "GR" | "CZ" | "RO" | "HU" | "CH";

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("executive-summary");
  const [keywordCountry, setKeywordCountry] = useState<CountryCode>("GB");
  const [keywordMovementCountry, setKeywordMovementCountry] = useState<CountryCode>("GB");
  const [keywordPerformanceCountry, setKeywordPerformanceCountry] = useState<CountryCode>("GB");
  const [serpFeatureCountry, setSerpFeatureCountry] = useState<CountryCode>("GB");
  const [landingPageFilter, setLandingPageFilter] = useState<string>("all");
  const [queryPositionFilter, setQueryPositionFilter] = useState<string>("all");
  const [brandQueryFilter, setBrandQueryFilter] = useState<string>("brand");
  const [aiTrafficMetric, setAiTrafficMetric] = useState<"visits" | "cdcs">("visits");

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
        return "Keyword coverage, ranking distribution, and query-level performance across markets.";
      case "ai-insights":
        return "AI-generated opportunities, risks, and experiments.";
      default:
        return (
          <>
            Sony Professional's organic search performance across the PSE region.
            <br />
            Monitor monthly trends in traffic and lead conversions, see which search terms perform best, track keyword ranking movements, and identify pages winning premium search features.
          </>
        );
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
    <>
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    <main className="min-h-screen flex bg-transparent text-slate-900">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 border-r border-slate-900 bg-[#333333] px-6 py-6 flex flex-col gap-8">
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

        <nav className="flex flex-col gap-1.5 text-sm text-slate-200 overflow-y-auto">
          <p className="px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Tabs
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
        </nav>

        <div className="mt-auto px-3 pb-10">
          <p className="text-xs italic text-slate-400">
            📊 Sample data for demo purposes
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
            <button
              onClick={() => window.print()}
              className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-100 sm:inline-flex"
            >
              Export snapshot
            </button>
            {activeTab === "seo-health" && (
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                <span>Country</span>
                <select
                  value={keywordCountry}
                  onChange={(e) => setKeywordCountry(e.target.value as CountryCode)}
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-100 border-none outline-none cursor-pointer"
                >
                  <option value="GB">GB</option>
                  <option value="DE">DE</option>
                  <option value="FR">FR</option>
                  <option value="IT">IT</option>
                  <option value="ES">ES</option>
                  <option value="NL">NL</option>
                  <option value="BE">BE</option>
                  <option value="AT">AT</option>
                  <option value="SE">SE</option>
                  <option value="NO">NO</option>
                  <option value="DK">DK</option>
                  <option value="FI">FI</option>
                  <option value="PL">PL</option>
                  <option value="PT">PT</option>
                  <option value="IE">IE</option>
                  <option value="GR">GR</option>
                  <option value="CZ">CZ</option>
                  <option value="RO">RO</option>
                  <option value="HU">HU</option>
                  <option value="CH">CH</option>
                </select>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
              <span>Period</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                Last month
              </span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-[#f8fafc]">
          {/* Executive summary KPI cards */}
          <section
            className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ${
              activeTab === "executive-summary" ? "opacity-100" : "hidden"
            }`}
          >
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Avg. Google rank
                </p>
                <div className="group relative">
                  <svg className="h-3.5 w-3.5 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                  <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-48 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
                    The average position of Domains in search results, based on their highest position whenever they appeared in a search
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">7.4</p>
                <span className="text-xs text-[#4aa6c5]">+1.2 vs. last month</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                For the 3 Primary markets: GB, FR, ES
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  CTR
                </p>
                <div className="group relative">
                  <svg className="h-3.5 w-3.5 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                  <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-48 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
                    Click-through rate: percentage of impressions that result in clicks
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">4.9%</p>
                <span className="text-xs text-emerald-400">+0.4 pts vs last month</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Click-through rate across all markets
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Organic Entries
                </p>
                <div className="group relative">
                  <svg className="h-3.5 w-3.5 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                  <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-48 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
                    Total number of Adobe entries from Natural Search
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">182k</p>
                <span className="text-xs text-[#4aa6c5]">+6.8% vs last month</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Entries from Organic Sessions across all markets
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Organic CDC
                </p>
                <div className="group relative">
                  <svg className="h-3.5 w-3.5 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                  <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-48 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
                    Total Adobe CDC from Natural Search
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">150</p>
                <span className="text-xs text-[#4aa6c5]">+12% vs. last month</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Submitted Forms from Organic Sessions across all markets
              </p>
            </article>
          </section>

          {/* Keywords / SEO health content */}
          <section
            className={`grid gap-4 lg:grid-cols-5 ${
              activeTab === "seo-health" ? "opacity-100" : "hidden"
            }`}
          >
            {false && (
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Keywords Ranking
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Distribution of tracked queries by Google position group.
              </p>
              <div className="mt-4 space-y-3 text-[11px] text-slate-700">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
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

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Keywords Ranking
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Distribution of tracked queries by Google position group over recent months.
              </p>
              <div className="mt-4 text-[11px] text-slate-700">
                <div className="h-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Ranking buckets (by position group)</span>
                    <span className="text-slate-400">From Apr to last month</span>
                  </div>
                  <div className="mt-3 flex h-24 items-end gap-2">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-between text-[9px] text-slate-400 mr-1 pb-5">
                      <span>100</span>
                      <span>75</span>
                      <span>50</span>
                      <span>25</span>
                      <span>0</span>
                    </div>

                    <div className="flex-1 flex h-24 items-end gap-2">
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
                            <p className="text-[11px] text-slate-500 text-center">
                              {monthData.month}
                            </p>
                          </div>
                        );
                      });
                    })()}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
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

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between lg:col-span-2">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Ranking KPIs
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Snapshot of keywords in each position group.
                </p>
              </div>
              <div className="mt-3 space-y-2 text-[11px] text-slate-700">
                <div className="flex items-center text-[11px] font-medium text-slate-500">
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
                  <span className="w-1/3 text-right text-[11px] text-emerald-500">
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
                  <span className="w-1/3 text-right text-[11px] text-emerald-500">
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
                  <span className="w-1/3 text-right text-[11px] text-amber-500">
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
                  <span className="w-1/3 text-right text-[11px] text-slate-500">
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
                  <span className="w-1/3 text-right text-[11px] text-emerald-500">
                    -3
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  Data for last completed month.
                </p>
              </div>
            </article>

            <article className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Keyword visibility & traffic
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Snapshot of how priority queries rank, attract impressions, and convert into clicks.
              </p>
              <div className="mt-4 h-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Ranking buckets (by clicks)</span>
                  <span className="text-slate-400">Last month</span>
                </div>
                <div className="mt-3 flex h-24 items-end gap-2">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between text-[9px] text-slate-400 mr-1 pb-5">
                    <span>20k</span>
                    <span>15k</span>
                    <span>10k</span>
                    <span>5k</span>
                    <span>0</span>
                  </div>

                  <div className="flex-1 flex h-24 items-end gap-4 relative">
                    <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-full items-end gap-[3px] relative group">
                      <div className="h-16 flex-1 rounded-sm bg-[#4aa6c5]/80 hover:bg-[#4aa6c5] transition-colors cursor-pointer relative">
                        <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                          13.5k
                        </span>
                      </div>
                      <div className="h-8 flex-1 rounded-sm bg-[#3551e6]/70 hover:bg-[#3551e6] transition-colors cursor-pointer relative">
                        <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                          6.8k
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">Pos. 1–3</p>
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-full items-end gap-[3px] relative group">
                      <div className="h-11 flex-1 rounded-sm bg-[#4aa6c5]/80 hover:bg-[#4aa6c5] transition-colors cursor-pointer relative">
                        <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                          9.2k
                        </span>
                      </div>
                      <div className="h-9 flex-1 rounded-sm bg-[#3551e6]/70 hover:bg-[#3551e6] transition-colors cursor-pointer relative">
                        <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                          7.5k
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">Pos. 4–10</p>
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-full items-end gap-[3px] relative group">
                      <div className="h-7 flex-1 rounded-sm bg-[#4aa6c5]/80 hover:bg-[#4aa6c5] transition-colors cursor-pointer relative">
                        <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                          5.9k
                        </span>
                      </div>
                      <div className="h-10 flex-1 rounded-sm bg-[#3551e6]/70 hover:bg-[#3551e6] transition-colors cursor-pointer relative">
                        <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                          8.4k
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">Pos. 11–20</p>
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-1">
                    <div className="flex h-full items-end gap-[3px] relative group">
                      <div className="h-4 flex-1 rounded-sm bg-[#4aa6c5]/80 hover:bg-[#4aa6c5] transition-colors cursor-pointer relative">
                        <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                          3.4k
                        </span>
                      </div>
                      <div className="h-9 flex-1 rounded-sm bg-[#3551e6]/70 hover:bg-[#3551e6] transition-colors cursor-pointer relative">
                        <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                          7.5k
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">Pos. 21+</p>
                  </div>
                  </div>
                </div>
                <div className="mt-2 mb-2 flex items-center gap-4 text-[11px]">
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
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Top queries (sample)</span>
                  <div className="flex items-center gap-1">
                    <span>Position</span>
                    <select
                      className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px]"
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
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
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
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
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
                  <span className="rounded-full bg-[#4aa6c5]/10 px-2 py-0.5 text-[11px] font-semibold text-[#4aa6c5]">
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
                  <span className="rounded-full bg-[#3551e6]/10 px-2 py-0.5 text-[11px] font-semibold text-[#3551e6]">
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
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-600">
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
                  <span className="rounded-full bg-[#3551e6]/10 px-2 py-0.5 text-[11px] font-semibold text-[#3551e6]">
                    Backlog
                  </span>
                </div>
              </div>
            </article>
            )}

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <div className="mb-3">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500 whitespace-nowrap">
                  Landing pages by keyword
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Explore how key queries map to core landing pages.
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Filter</span>
                  <select
                    className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px]"
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

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span className="w-2/5">Landing page</span>
                  <span className="w-1/5 text-right">Keywords</span>
                  <span className="w-1/5 text-right">Impr.</span>
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

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Brand Split & Keywords Performance
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Filter</span>
                  <select
                    className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px]"
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
                {/* Brand split (moved to left) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Brand Split</span>
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
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
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


            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Top keywords by country
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Last month • Top queries for key European markets.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-2 text-[11px] text-slate-600">
                  {(["GB", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "SE", "NO", "DK", "FI", "PL", "PT", "IE", "GR", "CZ", "RO", "HU", "CH"] as CountryCode[]).map((country) => (
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
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span className="w-2/5">Query</span>
                  <span className="w-1/5 text-right">Clicks</span>
                  <span className="w-1/5 text-right">Impr.</span>
                  <span className="w-1/5 text-right">Avg. pos.</span>
                  <span className="w-1/5 text-right">Avg.pos. MoM</span>
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
                  {!["GB", "DE", "FR", "IT", "ES"].includes(keywordCountry) && (
                    <div className="py-8 text-center text-slate-500">
                      <p className="text-sm">Data for {keywordCountry} coming soon.</p>
                      <p className="mt-1 text-xs">This country is being tracked and data will be available in the next update.</p>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Avg.pos. MoM = Average position month-over-month change.
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
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      SEO performance
                    </p>
                    <div className="group relative">
                      <svg className="h-3.5 w-3.5 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                      </svg>
                      <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-64 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
                        <p className="font-semibold">Organic Entries:</p>
                        <p className="mb-2">Total number of Adobe entries from Natural Search</p>
                        <p className="font-semibold">Clicks:</p>
                        <p className="mb-2">Times users clicked Sony Professional pages in Google search results (source: Search Console)</p>
                        <p className="font-semibold">Impressions:</p>
                        <p>Times Sony Professional pages appeared in Google search results (source: Search Console)</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Organic entries, impressions, and clicks trends.
                  </p>
                </div>
                <div className="hidden gap-2 text-[11px] text-slate-400 md:flex">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#4aa6c5]" />
                    Organic Entries
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#3551e6]" />
                    Clicks
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#1e40af]" />
                    Impressions
                  </span>
                </div>
              </div>
              <div className="mt-4 h-56 rounded-lg border border-slate-200 bg-white px-3 py-3 pb-1">
                <div className="relative h-full flex gap-2">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between text-[10px] text-slate-400 pt-1 pb-2">
                    <span>18k</span>
                    <span>13k</span>
                    <span>9k</span>
                    <span>4k</span>
                    <span>0</span>
                  </div>

                  <div className="relative flex-1 h-full">
                    <div className="flex h-full items-end gap-2">
                      {(() => {
                        const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
                        const organic = [10, 12, 11, 13, 14, 13, 15, 16];
                        const impressions = [7, 8, 9, 10, 11, 10, 12, 13];
                        const clicks = [5, 6, 7, 8, 9, 8, 10, 11];

                        const maxVal = Math.max(...organic) + 2;
                        const toHeight = (val: number) => `${(val / maxVal) * 100}%`;

                        return months.map((month, idx) => (
                          <div key={month} className="flex flex-1 flex-col justify-end gap-1">
                            <div className="flex h-36 items-end gap-[3px] relative group">
                              <div
                                className="flex-1 rounded-sm bg-[#4aa6c5]/80 hover:bg-[#4aa6c5] transition-colors cursor-pointer relative"
                                style={{ height: toHeight(organic[idx]) }}
                              >
                                <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                                  {organic[idx]}k
                                </span>
                              </div>
                              <div
                                className="flex-1 rounded-sm bg-[#3551e6]/70 hover:bg-[#3551e6] transition-colors cursor-pointer relative"
                                style={{ height: toHeight(clicks[idx]) }}
                              >
                                <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                                  {clicks[idx]}k
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500">{month}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  {(() => {
                    const impressions = [7, 8, 9, 10, 11, 10, 12, 13];
                    const maxVal = Math.max(16, ...impressions) + 2;
                    const xStep = 100 / 7;
                    const points = impressions.map((val, idx) => {
                      const x = idx * xStep;
                      const y = 100 - (val / maxVal) * 100;
                      return `${idx === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
                    });
                    const path = points.join(" ");

                    return (
                      <svg
                        className="pointer-events-none absolute inset-0 h-full w-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path d={path} fill="none" stroke="#1e40af" strokeWidth="1.4" />
                      </svg>
                    );
                  })()}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs italic text-slate-500">
                Note: Data reflects PSE region totals
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Keyword movements
                </p>
                <div className="group relative">
                  <svg className="h-3.5 w-3.5 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                  <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-48 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
                    Position = where your page appears in Google when users search for that term. Position 1 is the top result on page 1. Moving up means better visibility.
                  </div>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Monthly position changes for tracked keywords.
              </p>
              <div className="mt-3 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-2 text-[11px] text-slate-600">
                {(["GB", "ES", "FR", "DE", "IT", "NL"] as CountryCode[]).map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => setKeywordMovementCountry(country)}
                    className={`px-2 py-0.5 rounded-full border text-xs ${
                      keywordMovementCountry === country
                        ? "border-slate-900 bg-white font-semibold text-slate-900 shadow-sm"
                        : "border-transparent hover:border-slate-300 hover:bg-white/60"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-3 text-xs">
                {keywordMovementCountry === "GB" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">broadcast camera systems</span>
                      <span className="text-emerald-400">+8 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">4k studio cameras</span>
                      <span className="text-emerald-400">+5 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">ptz camera remote control</span>
                      <span className="text-emerald-400">+3 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">live production switcher</span>
                      <span className="text-emerald-400">+2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">professional video monitor</span>
                      <span className="text-amber-300">-1 position</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">ip live production workflow</span>
                      <span className="text-amber-300">-2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">xdcam recorder</span>
                      <span className="text-amber-300">-3 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">hdr reference monitor</span>
                      <span className="text-red-400">-5 positions</span>
                    </div>
                  </>
                )}
                {keywordMovementCountry === "ES" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">cámaras de estudio profesionales</span>
                      <span className="text-emerald-400">+7 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">sistemas de producción en vivo</span>
                      <span className="text-emerald-400">+4 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">cámaras broadcast sony</span>
                      <span className="text-emerald-400">+3 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">monitores de video profesionales</span>
                      <span className="text-emerald-400">+2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">control remoto ptz</span>
                      <span className="text-slate-400">0 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">grabadoras xdcam</span>
                      <span className="text-amber-300">-2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">flujo de trabajo ip</span>
                      <span className="text-amber-300">-3 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">monitores hdr</span>
                      <span className="text-red-400">-4 positions</span>
                    </div>
                  </>
                )}
                {keywordMovementCountry === "FR" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">caméras de diffusion professionnelles</span>
                      <span className="text-emerald-400">+9 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">systèmes de studio 4k</span>
                      <span className="text-emerald-400">+6 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">production en direct sony</span>
                      <span className="text-emerald-400">+4 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">commande à distance ptz</span>
                      <span className="text-emerald-400">+1 position</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">moniteurs vidéo professionnels</span>
                      <span className="text-slate-400">0 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">enregistreurs xdcam</span>
                      <span className="text-amber-300">-1 position</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">flux de travail ip</span>
                      <span className="text-amber-300">-2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">moniteurs de référence hdr</span>
                      <span className="text-amber-300">-3 positions</span>
                    </div>
                  </>
                )}
                {keywordMovementCountry === "DE" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">professionelle broadcast kameras</span>
                      <span className="text-emerald-400">+10 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">4k studiokameras</span>
                      <span className="text-emerald-400">+6 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">live produktion systeme</span>
                      <span className="text-emerald-400">+5 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">ptz kamera fernsteuerung</span>
                      <span className="text-emerald-400">+2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">professionelle videomonitore</span>
                      <span className="text-slate-400">0 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">ip produktions workflow</span>
                      <span className="text-amber-300">-1 position</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">xdcam rekorder</span>
                      <span className="text-amber-300">-2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">hdr referenzmonitore</span>
                      <span className="text-amber-300">-3 positions</span>
                    </div>
                  </>
                )}
                {keywordMovementCountry === "IT" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">telecamere broadcast professionali</span>
                      <span className="text-emerald-400">+8 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">telecamere da studio 4k</span>
                      <span className="text-emerald-400">+5 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">sistemi di produzione live</span>
                      <span className="text-emerald-400">+4 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">controllo remoto ptz</span>
                      <span className="text-emerald-400">+2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">monitor video professionali</span>
                      <span className="text-emerald-400">+1 position</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">flusso di lavoro ip</span>
                      <span className="text-amber-300">-2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">registratori xdcam</span>
                      <span className="text-amber-300">-3 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">monitor di riferimento hdr</span>
                      <span className="text-red-400">-4 positions</span>
                    </div>
                  </>
                )}
                {keywordMovementCountry === "NL" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">professionele broadcast camera's</span>
                      <span className="text-emerald-400">+7 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">4k studiocamera's</span>
                      <span className="text-emerald-400">+5 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">live productie systemen</span>
                      <span className="text-emerald-400">+4 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">ptz camera bediening</span>
                      <span className="text-emerald-400">+3 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">professionele videomonitoren</span>
                      <span className="text-slate-400">0 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">ip productie workflow</span>
                      <span className="text-amber-300">-1 position</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">xdcam recorders</span>
                      <span className="text-amber-300">-2 positions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">hdr referentie monitoren</span>
                      <span className="text-amber-300">-3 positions</span>
                    </div>
                  </>
                )}
              </div>
            </article>

            {/* Keyword Performance Table */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Keyword Performance Overview
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Top performing keywords with position, volume, and landing pages.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-2 text-[11px] text-slate-600">
                {(["GB", "ES", "FR", "DE", "IT", "NL", "BE", "AT", "SE"] as CountryCode[]).map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => setKeywordPerformanceCountry(country)}
                    className={`px-2 py-0.5 rounded-full border text-xs ${
                      keywordPerformanceCountry === country
                        ? "border-slate-900 bg-white font-semibold text-slate-900 shadow-sm"
                        : "border-transparent hover:border-slate-300 hover:bg-white/60"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 font-medium text-slate-500">Keyword</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">Position</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">Volume</th>
                      <th className="px-3 py-2 font-medium text-slate-500">URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {keywordPerformanceCountry === "GB" && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">sony broadcast cameras</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">2</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">12,400</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/broadcast-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">4k professional camera</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 font-medium text-[10px]">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                              </svg>
                              PAA
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">8,900</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/4k-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">sony ptz camera</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">4</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">6,700</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/ptz-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">live production switcher</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-red-700 font-medium text-[10px]">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                              Video
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">5,200</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/live-production</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">sony system camera</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">3</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">4,800</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/system-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">professional video monitor</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 font-medium">7</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">3,900</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/monitors</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">sony xdcam camcorder</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 font-medium">8</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">3,100</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/xdcam</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">remote production solutions</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 font-medium text-[10px]">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                              </svg>
                              PAA
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">2,500</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/solutions/remote-production</td>
                        </tr>
                      </>
                    )}
                    {keywordPerformanceCountry === "ES" && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">cámaras profesionales sony</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">1</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">8,200</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/es/productos/camaras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">cámara 4k profesional</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">3</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">5,600</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/es/productos/4k-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">producción en vivo</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 font-medium">5</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">4,100</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/es/productos/produccion-vivo</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">cámaras ptz</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">2</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">3,800</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/es/productos/ptz-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">monitores profesionales</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 font-medium">6</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">2,900</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/es/productos/monitores</td>
                        </tr>
                      </>
                    )}
                    {keywordPerformanceCountry === "FR" && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">caméras professionnelles sony</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">1</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">7,800</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/fr/produits/cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">caméra 4k broadcast</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 font-medium text-[10px]">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                              </svg>
                              PAA
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">6,200</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/fr/produits/4k-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">production vidéo en direct</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">4</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">4,500</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/fr/produits/production-live</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">caméra ptz sony</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">3</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">3,400</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/fr/produits/ptz-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">moniteur professionnel</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 font-medium">7</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">3,100</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/fr/produits/moniteurs</td>
                        </tr>
                      </>
                    )}
                    {(keywordPerformanceCountry === "DE" || keywordPerformanceCountry === "IT" || keywordPerformanceCountry === "NL" || keywordPerformanceCountry === "BE" || keywordPerformanceCountry === "AT" || keywordPerformanceCountry === "SE") && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">professional broadcast camera</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">2</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">9,500</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/broadcast-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">4k video camera</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">3</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">7,200</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/4k-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">ptz camera system</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">4</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">5,800</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/ptz-cameras</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">live production equipment</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 font-medium">6</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">4,300</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/live-production</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700">professional video monitor</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 font-medium">5</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600">3,600</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">/products/monitors</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            {/* SERP Features Table */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    SERP Feature Wins
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Pages winning premium search features.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-2 text-[11px] text-slate-600">
                {(["GB", "ES", "FR", "DE", "IT", "NL"] as CountryCode[]).map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => setSerpFeatureCountry(country)}
                    className={`px-2 py-0.5 rounded-full border text-xs ${
                      serpFeatureCountry === country
                        ? "border-slate-900 bg-white font-semibold text-slate-900 shadow-sm"
                        : "border-transparent hover:border-slate-300 hover:bg-white/60"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 font-medium text-slate-500">Page</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">Volume</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">Feature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {serpFeatureCountry === "GB" && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/broadcast-cameras</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">12.4k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-indigo-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                              </svg>
                              Featured
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/4k-cameras</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">8.9k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-blue-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                              </svg>
                              PAA
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/ptz-cameras</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">6.7k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-1.5 py-0.5 text-purple-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              Images
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/live-production</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">5.2k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-red-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                              Video
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/system-cameras</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">4.8k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-blue-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                              </svg>
                              PAA
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                    {(serpFeatureCountry === "ES" || serpFeatureCountry === "FR" || serpFeatureCountry === "DE" || serpFeatureCountry === "IT" || serpFeatureCountry === "NL") && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/4k-cameras</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">7.2k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-indigo-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                              </svg>
                              Featured
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/broadcast-cameras</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">6.8k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-blue-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                              </svg>
                              PAA
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/ptz-cameras</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">5.4k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-1.5 py-0.5 text-purple-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              Images
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/live-production</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">4.6k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-red-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                              Video
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-700 truncate">/products/monitors</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">3.2k</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-red-700 text-[9px] font-medium">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                              Video
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          {/* AI Performance graphs (AI tab only) */}
          <section
            className={`grid gap-4 lg:grid-cols-3 ${
              activeTab === "ai-insights" ? "opacity-100" : "hidden"
            }`}
          >
            {/* 3.1 Total AI Traffic Trend */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Total AI traffic trend
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Monthly AI-driven sessions and comparison vs. organic sessions.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Last 12 months</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-3 rounded-full bg-[#4aa6c5]" />
                    AI sessions
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-3 rounded-full bg-slate-300" />
                    Organic Entries
                  </span>
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setAiTrafficMetric("visits")}
                      className={`px-2 py-0.5 rounded-full transition-colors ${
                        aiTrafficMetric === "visits" ? "bg-[#4aa6c5]/10 text-slate-900" : ""
                      }`}
                    >
                      Visits
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiTrafficMetric("cdcs")}
                      className={`px-2 py-0.5 rounded-full transition-colors ${
                        aiTrafficMetric === "cdcs" ? "bg-[#4aa6c5]/10 text-slate-900" : ""
                      }`}
                    >
                      CDCs
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-40 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px]">
                <div className="flex h-full gap-2">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between text-[10px] text-slate-400 pt-1 pb-6">
                    <span>50k</span>
                    <span>37k</span>
                    <span>25k</span>
                    <span>12k</span>
                    <span>0</span>
                  </div>

                  <div className="flex-1 flex h-full items-end gap-2">
                    {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m, idx) => (
                      <div
                        key={m}
                        className="flex flex-1 flex-col justify-end gap-1"
                      >
                        <div className="relative flex h-24 items-end gap-[3px] group">
                          {(() => {
                            const baseHeights =
                              aiTrafficMetric === "visits"
                                ? { ai: 30, organic: 55 }
                                : { ai: 18, organic: 38 };

                            const aiHeight = Math.min(88, baseHeights.ai + idx * 4);
                            const organicHeight = Math.min(92, baseHeights.organic + idx * 2);

                            // Calculate display values based on metric type
                            const aiValue = aiTrafficMetric === "visits"
                              ? Math.round(15 + idx * 2.5)
                              : Math.round(9 + idx * 1.5);
                            const organicValue = aiTrafficMetric === "visits"
                              ? Math.round(28 + idx * 1.5)
                              : Math.round(19 + idx * 1);

                            return (
                              <>
                                {/* AI sessions (left) */}
                                <div
                                  className="flex-1 rounded-sm bg-[#4aa6c5]/80 hover:bg-[#4aa6c5] transition-colors cursor-pointer relative"
                                  style={{ height: `${aiHeight}%` }}
                                >
                                  <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                                    {aiValue}k
                                  </span>
                                </div>
                                {/* organic baseline (right) */}
                                <div
                                  className="flex-1 rounded-sm bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer relative"
                                  style={{ height: `${organicHeight}%` }}
                                >
                                  <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-10">
                                    {organicValue}k
                                  </span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        <p className="text-[11px] text-slate-500 text-center">
                          {m}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* 3.2 Top LLM Traffic Sources */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Top LLM traffic sources
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Share of visits from AI assistants and copilots.
              </p>
              <div className="mt-3 h-64 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                <div className="space-y-1.5">
                  {[
                    { label: "ChatGPT", value: "32%", width: "w-[32%]", color: "bg-[#4aa6c5]" },
                    { label: "Perplexity", value: "21%", width: "w-[21%]", color: "bg-[#3551e6]" },
                    { label: "Bing Copilot", value: "18%", width: "w-[18%]", color: "bg-emerald-400" },
                    { label: "Google Gemini", value: "14%", width: "w-[14%]", color: "bg-amber-400" },
                    { label: "Claude", value: "9%", width: "w-[9%]", color: "bg-sky-400" },
                    { label: "Mistral & others", value: "6%", width: "w-[6%]", color: "bg-slate-400" },
                  ].map((s) => (
                    <div key={s.label} className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span>{s.label}</span>
                        <span className="text-slate-500">{s.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${s.color} ${s.width}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* 3.3 AI product interest from LLM traffic */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Products viewed from AI tools
              </p>
              <p className="mt-1 text-xs text-slate-500">
                LLM-driven visits to key broadcast and production products.
              </p>
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-700 max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>(last 30d)</span>
                  <span>MoM %</span>
                </div>
                {[
                  { label: "HDC-5500 system camera", visits: "9.6k", mom: "+5.8%", deltaClass: "text-emerald-500" },
                  { label: "BRC-X400 PTZ", visits: "7.4k", mom: "+3.1%", deltaClass: "text-emerald-500" },
                  { label: "XVS-G1 switcher", visits: "6.2k", mom: "+2.4%", deltaClass: "text-emerald-500" },
                  { label: "PVM-X2400 monitor", visits: "4.9k", mom: "-1.8%", deltaClass: "text-amber-500" },
                  { label: "DWX wireless audio", visits: "3.7k", mom: "+4.2%", deltaClass: "text-emerald-500" },
                  { label: "Ci Media Cloud workflow", visits: "2.9k", mom: "+0.9%", deltaClass: "text-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-slate-500">LLM visits: {item.visits}</p>
                    </div>
                    <span className={`text-sm font-semibold ${item.deltaClass}`}>{item.mom}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* 3.4 Website areas viewed from AI tools */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Website areas viewed from AI tools
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Content areas most visited by AI-referred users.
              </p>
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-700 max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>(last 30d)</span>
                  <span>MoM %</span>
                </div>
                {[
                  { label: "Professional Cameras", visits: "12.4k", mom: "+6.2%", deltaClass: "text-emerald-500" },
                  { label: "Production switchers", visits: "8.1k", mom: "+3.4%", deltaClass: "text-emerald-500" },
                  { label: "Professional displays", visits: "6.7k", mom: "+1.1%", deltaClass: "text-emerald-500" },
                  { label: "Cloud production tools", visits: "5.3k", mom: "-2.4%", deltaClass: "text-amber-500" },
                  { label: "Solutions pages", visits: "4.1k", mom: "+4.6%", deltaClass: "text-emerald-500" },
                  { label: "Support content", visits: "2.5k", mom: "-1.2%", deltaClass: "text-amber-500" },
                ].map((area) => (
                  <div key={area.label} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-900">{area.label}</p>
                    <p className="text-slate-500">LLM visits: {area.visits}</p>
                    </div>
                    <span className={`text-sm font-semibold ${area.deltaClass}`}>{area.mom}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* 3.5 AI visits by market */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                AI visits by market
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Share of LLM-driven visits by country (last 30d).
              </p>
              <div className="mt-3 space-y-2 text-[11px] text-slate-700">
                <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-700">
                  <div className="relative h-32 w-32 rounded-full border border-slate-100 bg-slate-50">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundImage:
                          "conic-gradient(#1f78ff 0 32%, #4aa6c5 32% 56%, #5dcf98 56% 74%, #f2c94c 74% 88%, #94a3b8 88% 100%)",
                      }}
                    />
                    <div className="absolute inset-4 rounded-full bg-white" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[11px] text-slate-500">Top market</p>
                        <p className="text-sm text-slate-900">GB - 32%</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[
                      { code: "GB", label: "United Kingdom", value: "32%", color: "bg-[#1f78ff]" },
                      { code: "DE", label: "Germany", value: "24%", color: "bg-[#4aa6c5]" },
                      { code: "FR", label: "France", value: "18%", color: "bg-[#5dcf98]" },
                      { code: "IT", label: "Italy", value: "14%", color: "bg-[#f2c94c]" },
                      { code: "ES", label: "Spain", value: "12%", color: "bg-[#94a3b8]" },
                    ].map((c) => (
                      <div key={c.code} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                          <span className="font-medium text-slate-900">{c.label}</span>
                        </div>
                        <span className="text-sm text-slate-700">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* 3.6 Brand visibility & representation in LLMs */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Brand visibility in LLMs
              </p>
              <p className="mt-1 text-xs text-slate-500">
                How often Sony appears vs. competitors in AI answers.
              </p>
              <div className="mt-3 space-y-2 text-[11px] text-slate-700">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[11px] text-slate-500">Sony mention rate</p>
                    <p className="text-lg font-semibold text-slate-900">64%</p>
                    <p className="text-[11px] text-emerald-500">+6 pts vs last month</p>
                  </div>
                  <div className="space-y-1 rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[11px] text-slate-500">Answers without Sony</p>
                    <p className="text-lg font-semibold text-slate-900">21%</p>
                    <p className="text-[11px] text-amber-500">Watch high‑intent queries</p>
                  </div>
                </div>
                {[
                  { label: "Sony", value: "64%" },
                  { label: "Competitor A", value: "58%" },
                  { label: "Competitor B", value: "41%" },
                ].map((entry) => (
                  <div key={entry.label} className="flex items-center justify-between">
                    <span>{entry.label}</span>
                    <span className="text-slate-700 font-medium">{entry.value}</span>
                  </div>
                ))}
                <div className="mt-2 space-y-1">
                  <p className="text-[11px] text-slate-500">Example AI answers mentioning Sony:</p>
                  <p className="rounded-md bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700">
                    “For broadcast‑grade cameras, Sony’s system camera line is frequently recommended
                    alongside <span className="italic">[Competitor A]</span> for live production workflows.”
                  </p>
                  <p className="rounded-md bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700">
                    “Sony’s PTZ range is often suggested for remote production and houses of worship
                    thanks to integration with IP‑based control solutions.”
                  </p>
                </div>
              </div>
            </article>

            {/* 3.7 Brand citations trend */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Brand citations trend
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Monthly Sony citation counts across sampled LLM answers.
              </p>
                <div className="mt-3 h-56 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                {(() => {
                  const points = [
                    { month: "Apr", sony: 48, comp: 42 },
                    { month: "May", sony: 54, comp: 46 },
                    { month: "Jun", sony: 60, comp: 51 },
                    { month: "Jul", sony: 67, comp: 55 },
                    { month: "Aug", sony: 73, comp: 58 },
                    { month: "Sep", sony: 78, comp: 61 },
                    { month: "Oct", sony: 84, comp: 64 },
                  ];
                  const maxVal = 100;
                  const padding = 8;
                  const viewWidth = 100;
                  const viewHeight = 120;
                  const step = points.length > 1 ? viewWidth / (points.length - 1) : viewWidth;

                  const toCoord = (val: number, idx: number) => ({
                    x: idx * step,
                    y: viewHeight - (val / maxVal) * (viewHeight - padding * 2) - padding,
                  });

                  const buildPath = (series: "sony" | "comp") =>
                    points
                      .map((p, idx) => {
                        const { x, y } = toCoord(p[series], idx);
                        return `${idx === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
                      })
                      .join(" ");

                  const sonyPath = buildPath("sony");
                  const compPath = buildPath("comp");
                  const yTicks = [100, 80, 60, 40, 20];

                  return (
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex h-full">
                        <div className="flex w-10 flex-col justify-between pr-1 text-[10px] text-slate-500">
                          {yTicks.map((tick) => (
                            <span key={tick}>{tick}</span>
                          ))}
                        </div>
                        <div className="relative flex-1">
                          <svg
                            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                            className="h-full w-full overflow-hidden"
                            preserveAspectRatio="none"
                          >
                            {yTicks.map((tick) => {
                              const y = toCoord(tick, 0).y;
                              return (
                                <line
                                  key={tick}
                                  x1={0}
                                  x2={viewWidth}
                                  y1={y}
                                  y2={y}
                                  stroke="#e2e8f0"
                                  strokeWidth="0.5"
                                />
                              );
                            })}
                            <path d={compPath} fill="none" stroke="#94a3b8" strokeWidth="1.6" />
                            <path d={sonyPath} fill="none" stroke="#4aa6c5" strokeWidth="2" />
                          </svg>
                          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between text-[11px] text-slate-500">
                            {points.map((p) => (
                              <span key={p.month}>{p.month}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div className="mt-10 flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#4aa6c5]" />
                    Sony citations
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#94a3b8]" />
                    Competitor avg.
                  </span>
                </div>
              </div>
            </article>

          </section>
        </div>
      </section>
    </main>
    </>
  );
}


