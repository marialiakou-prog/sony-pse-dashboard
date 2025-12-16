"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import useSWR from "swr";

type MainTab = "executive-summary" | "seo-health" | "ai-insights";
type CountryCode = "GB" | "DE" | "FR" | "IT" | "ES" | "NL" | "BE" | "AT" | "SE" | "NO" | "DK" | "FI" | "PL" | "PT" | "IE" | "GR" | "CZ" | "RO" | "HU" | "CH";

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("executive-summary");
  const [keywordCountry, setKeywordCountry] = useState<CountryCode>("GB");
  const [keywordMovementCountry, setKeywordMovementCountry] = useState<CountryCode>("GB");
  const [serpFeatureCountry, setSerpFeatureCountry] = useState<CountryCode>("GB");
  const [landingPageFilter, setLandingPageFilter] = useState<string>("all");
  const [queryPositionFilter, setQueryPositionFilter] = useState<string>("all");
  const [brandQueryFilter, setBrandQueryFilter] = useState<string>("brand");
  const [aiTrafficMetric, setAiTrafficMetric] = useState<"entries" | "cdcs">("entries");
  const [trafficSessionType, setTrafficSessionType] = useState<"llms" | "organic">("llms");
  const [productPagesMetric, setProductPagesMetric] = useState<"entries" | "visits">("entries");

  const formatWithKSuffix = (value: number) => {
    if (value >= 10000) {
      return `${Math.round(value / 1000)}k`;
    }

    if (value >= 1000) {
      const rounded = Math.round((value / 1000) * 10) / 10;
      return `${rounded.toLocaleString("en-GB", { maximumFractionDigits: 1 })}k`;
    }

    return value.toLocaleString("en-GB");
  };

  // Calculate nice Y-axis ticks (e.g., 0, 50, 100, 150, 200)
  const getNiceAxisTicks = (maxValue: number, tickCount: number = 5): number[] => {
    if (maxValue <= 0) return [0];

    // Nice intervals to choose from
    const niceIntervals = [10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000];

    // Find the best interval that gives us around tickCount ticks
    const rawInterval = maxValue / (tickCount - 1);
    const niceInterval = niceIntervals.find(i => i >= rawInterval) || Math.ceil(rawInterval / 1000) * 1000;

    // Generate ticks from 0 to a nice max that covers the data
    const niceMax = Math.ceil(maxValue / niceInterval) * niceInterval;
    const ticks: number[] = [];
    for (let i = 0; i <= niceMax; i += niceInterval) {
      ticks.push(i);
      if (ticks.length >= tickCount) break;
    }

    return ticks.reverse(); // Reverse for top-to-bottom display
  };

  // SWR fetcher function
  const fetcher = (url: string) => fetch(url).then(res => res.json());

  // Fetch organic sessions with SWR - caches data and shows instantly on refresh
  const { data: seoData } = useSWR('/api/seo-data', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute - don't re-fetch within this window
  });

  // Fetch search console data for clicks and impressions (filtered by content = '___')
  const { data: searchConsoleData } = useSWR('/api/search-console?content=___', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  // Fetch Adobe reporting data for GEO Performance / AI traffic trend
  const { data: adobeData } = useSWR('/api/adobe-reporting', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  // Fetch LLM Traffic Sources data from CSV
  const { data: llmTrafficSourcesData } = useSWR('/api/llm-traffic-sources', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  // Fetch LLM Countries data
  const { data: llmCountriesData } = useSWR('/api/llm-countries', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  // Process SEO data to get organic sessions with MoM comparison
  const organicSessions = useMemo(() => {
    if (!seoData?.success || !seoData?.data?.length) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMonthValue = (row: any): string => {
      const month = row?.month;
      return (month && typeof month === "object" ? month.value : month) ?? "";
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getEntriesValue = (row: any): number => {
      const value = Number(row?.entries ?? 0);
      return Number.isFinite(value) ? value : 0;
    };

    // Get unique months sorted descending
    const uniqueMonths = [...new Set(seoData.data.map(getMonthValue))]
      .filter((m): m is string => Boolean(m))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (uniqueMonths.length === 0) return null;

    const latestMonth = uniqueMonths[0];
    const previousMonth = uniqueMonths[1];

    // Sum all entries from the latest month
    const latestMonthData = seoData.data.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (row: any) => getMonthValue(row) === latestMonth
    );
    const totalEntries = latestMonthData.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, row: any) => sum + getEntriesValue(row),
      0
    );

    // Calculate MoM comparison if previous month exists
    let momChange: number | null = null;
    if (previousMonth) {
      const previousMonthData = seoData.data.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row: any) => getMonthValue(row) === previousMonth
      );
      const previousTotal = previousMonthData.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum: number, row: any) => sum + getEntriesValue(row),
        0
      );
      if (previousTotal > 0) {
        momChange = ((totalEntries - previousTotal) / previousTotal) * 100;
      }
    }

    // Format with 'k' suffix
    const formatted = formatWithKSuffix(totalEntries);

    // Format month for display
    const monthDate = new Date(latestMonth);
    const monthLabel = Number.isNaN(monthDate.getTime())
      ? latestMonth
      : monthDate.toLocaleString("en-GB", { month: "long", year: "numeric" });

    return { total: formatted, month: monthLabel, momChange };
  }, [seoData]);

  // Process SEO data for the performance chart (monthly visits)
  const seoChartData = useMemo(() => {
    if (!seoData?.success || !seoData?.data?.length) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMonthValue = (row: any): string => {
      const month = row?.month;
      return (month && typeof month === "object" ? month.value : month) ?? "";
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getEntriesValue = (row: any): number => {
      const value = Number(row?.entries ?? 0);
      return Number.isFinite(value) ? value : 0;
    };

    // Get unique months sorted ascending (oldest to newest for chart)
    const uniqueMonths = [...new Set(seoData.data.map(getMonthValue))]
      .filter((m): m is string => Boolean(m))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (uniqueMonths.length === 0) return null;

    // Aggregate entries by month
    const monthlyData = uniqueMonths.map(month => {
      const monthData = seoData.data.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row: any) => getMonthValue(row) === month
      );
      const totalEntries = monthData.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum: number, row: any) => sum + getEntriesValue(row),
        0
      );

      // Format month label (e.g., "Apr", "May")
      const monthDate = new Date(month);
      const label = Number.isNaN(monthDate.getTime())
        ? month
        : monthDate.toLocaleString("en-GB", { month: "short" });

      return {
        month: label,
        entries: totalEntries,
        entriesK: Math.round(totalEntries / 1000), // Value in thousands
      };
    });

    return monthlyData;
  }, [seoData]);

  // Process search console data for clicks and impressions chart
  const searchConsoleChartData = useMemo(() => {
    if (!searchConsoleData?.success || !searchConsoleData?.data?.length) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMonthValue = (row: any): string => {
      const month = row?.month;
      return (month && typeof month === "object" ? month.value : month) ?? "";
    };

    // Get unique months sorted ascending (oldest to newest for chart)
    const uniqueMonths = [...new Set(searchConsoleData.data.map(getMonthValue))]
      .filter((m): m is string => Boolean(m))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (uniqueMonths.length === 0) return null;

    // Aggregate clicks and impressions by month
    const monthlyData = uniqueMonths.map(month => {
      const monthData = searchConsoleData.data.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row: any) => getMonthValue(row) === month
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalClicks = monthData.reduce((sum: number, row: any) => {
        const clicks = Number(row?.clicks ?? 0);
        return sum + (Number.isFinite(clicks) ? clicks : 0);
      }, 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalImpressions = monthData.reduce((sum: number, row: any) => {
        const impressions = Number(row?.impressions ?? 0);
        return sum + (Number.isFinite(impressions) ? impressions : 0);
      }, 0);

      // Format month label (e.g., "Apr", "May")
      const monthDate = new Date(month);
      const label = Number.isNaN(monthDate.getTime())
        ? month
        : monthDate.toLocaleString("en-GB", { month: "short" });

      return {
        month: label,
        clicks: totalClicks,
        clicksK: Math.round(totalClicks / 1000),
        impressions: totalImpressions,
        impressionsK: Math.round(totalImpressions / 1000),
      };
    });

    return monthlyData;
  }, [searchConsoleData]);

  // Process Adobe reporting data for AI traffic trend chart
  const aiTrafficChartData = useMemo(() => {
    if (!adobeData?.success || !adobeData?.data?.length) return null;

    // Filter by pse_bu = 'Media Solutions'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredData = adobeData.data.filter((row: any) => row?.pse_bu === 'Media Solutions');

    if (filteredData.length === 0) return null;

    // Debug: Log first row to see available fields
    if (filteredData.length > 0) {
      console.log('First row keys:', Object.keys(filteredData[0]));
      console.log('First row sample:', filteredData[0]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMonthValue = (row: any): string => {
      const month = row?.month;
      return (month && typeof month === "object" ? month.value : month) ?? "";
    };

    // Get unique months sorted ascending (oldest to newest for chart)
    // Filter to only include months from April 2025 onwards
    const april2025 = new Date('2025-04-01');
    const uniqueMonths = [...new Set(filteredData.map(getMonthValue))]
      .filter((m): m is string => Boolean(m))
      .filter(m => new Date(m) >= april2025)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    console.log('Unique months found:', uniqueMonths);

    if (uniqueMonths.length === 0) return null;

    // Aggregate data by month
    const monthlyData = uniqueMonths.map(month => {
      const monthData = filteredData.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row: any) => getMonthValue(row) === month
      );

      // Sum LLM entries for the month
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalEntries = monthData.reduce((sum: number, row: any) => {
        const entries = Number(row?.entries ?? 0);
        return sum + (Number.isFinite(entries) ? entries : 0);
      }, 0);

      // Calculate LLM CDC as sum of rfis + form_submissions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalCDC = monthData.reduce((sum: number, row: any) => {
        const rfis = Number(row?.rfis ?? 0);
        const forms = Number(row?.form_submissions ?? 0);
        return sum + (Number.isFinite(rfis) ? rfis : 0) + (Number.isFinite(forms) ? forms : 0);
      }, 0);

      // Sum Organic entries for the month
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalOrganicEntries = monthData.reduce((sum: number, row: any) => {
        const organicEntries = Number(row?.organic_entries ?? 0);
        if (organicEntries > 0) {
          console.log('Found organic_entries:', organicEntries, 'for month:', month);
        }
        return sum + (Number.isFinite(organicEntries) ? organicEntries : 0);
      }, 0);

      // Sum Organic CDCs for the month
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalOrganicCDC = monthData.reduce((sum: number, row: any) => {
        const organicCdc = Number(row?.organic_cdc ?? 0);
        if (organicCdc > 0) {
          console.log('Found organic_cdc:', organicCdc, 'for month:', month);
        }
        return sum + (Number.isFinite(organicCdc) ? organicCdc : 0);
      }, 0);

      console.log(`Month ${month}: organicEntries=${totalOrganicEntries}, organicCdc=${totalOrganicCDC}`);

      // Format month label (e.g., "Apr", "May")
      const monthDate = new Date(month);
      const label = Number.isNaN(monthDate.getTime())
        ? month
        : monthDate.toLocaleString("en-GB", { month: "short" });

      return {
        month: label,
        entries: totalEntries,
        entriesK: Math.round(totalEntries / 1000),
        cdc: totalCDC,
        cdcK: Math.round(totalCDC / 1000),
        organicEntries: totalOrganicEntries,
        organicEntriesK: Math.round(totalOrganicEntries / 1000),
        organicCdc: totalOrganicCDC,
        organicCdcK: Math.round(totalOrganicCDC / 1000),
      };
    });

    return monthlyData;
  }, [adobeData]);

  // Process Adobe reporting data for website areas with MoM comparison
  const websiteAreasData = useMemo(() => {
    if (!adobeData?.success || !adobeData?.data?.length) return null;

    // Filter by pse_bu = 'Media Solutions'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredData = adobeData.data.filter((row: any) => row?.pse_bu === 'Media Solutions');

    if (filteredData.length === 0) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMonthValue = (row: any): string => {
      const month = row?.month;
      return (month && typeof month === "object" ? month.value : month) ?? "";
    };

    // Get unique months and find the last two months
    const uniqueMonths = [...new Set(filteredData.map(getMonthValue))]
      .filter((m): m is string => Boolean(m))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (uniqueMonths.length === 0) return null;

    const lastMonth = uniqueMonths[uniqueMonths.length - 1];
    const previousMonth = uniqueMonths.length > 1 ? uniqueMonths[uniqueMonths.length - 2] : null;

    // Aggregate by website_area for last month
    const lastMonthData = filteredData.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (row: any) => getMonthValue(row) === lastMonth
    );

    const lastMonthMap = new Map<string, number>();
    lastMonthData.forEach((row: any) => {
      const websiteArea = row?.website_area;
      const entries = Number(row?.entries ?? 0);

      if (websiteArea && Number.isFinite(entries)) {
        const currentTotal = lastMonthMap.get(websiteArea) || 0;
        lastMonthMap.set(websiteArea, currentTotal + entries);
      }
    });

    // Aggregate by website_area for previous month (if available)
    const previousMonthMap = new Map<string, number>();
    if (previousMonth) {
      const previousMonthData = filteredData.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row: any) => getMonthValue(row) === previousMonth
      );

      previousMonthData.forEach((row: any) => {
        const websiteArea = row?.website_area;
        const entries = Number(row?.entries ?? 0);

        if (websiteArea && Number.isFinite(entries)) {
          const currentTotal = previousMonthMap.get(websiteArea) || 0;
          previousMonthMap.set(websiteArea, currentTotal + entries);
        }
      });
    }

    // Convert to array with MoM calculation and sort by entries descending
    const websiteAreasArray = Array.from(lastMonthMap.entries())
      .map(([area, entries]) => {
        const previousEntries = previousMonthMap.get(area) || 0;
        let mom = 0;
        let momString = "N/A";

        if (previousEntries > 0) {
          mom = ((entries - previousEntries) / previousEntries) * 100;
          momString = mom >= 0 ? `+${mom.toFixed(1)}%` : `${mom.toFixed(1)}%`;
        }

        return {
          area,
          entries,
          mom,
          momString,
        };
      })
      .sort((a, b) => b.entries - a.entries);

    return websiteAreasArray;
  }, [adobeData]);

  // Product pages data - filter by specific website areas and aggregate by page_detail
  const productPagesData = useMemo(() => {
    if (!adobeData || !adobeData.success || !adobeData.data) {
      return null;
    }

    // Filter for specific website areas
    const filteredData = adobeData.data.filter((row: any) =>
      row?.website_area === 'Professional Cameras' ||
      row?.website_area === 'Audio' ||
      row?.website_area === 'Broadcast and Production'
    );

    if (filteredData.length === 0) {
      return [];
    }

    // Get unique months and sort them - handle month object with value property
    const uniqueMonths = [...new Set(filteredData.map((row: any) => {
      // Handle both string and object formats
      return typeof row.month === 'string' ? row.month : row.month?.value;
    }))].filter(Boolean).sort();

    if (uniqueMonths.length === 0) {
      return [];
    }

    // Get last two months for MoM comparison
    const lastMonth = uniqueMonths[uniqueMonths.length - 1];
    const previousMonth = uniqueMonths[uniqueMonths.length - 2];

    // Aggregate by page_detail for last month - track both entries and visits
    const lastMonthEntriesMap = new Map<string, number>();
    const previousMonthEntriesMap = new Map<string, number>();
    const lastMonthVisitsMap = new Map<string, number>();
    const previousMonthVisitsMap = new Map<string, number>();

    filteredData.forEach((row: any) => {
      const pageDetail = row.page_detail;
      const entries = parseInt(row.entries) || 0;
      const visits = parseInt(row.visits) || 0;
      const rowMonth = typeof row.month === 'string' ? row.month : row.month?.value;

      if (!pageDetail || pageDetail.trim() === '') return;

      if (rowMonth === lastMonth) {
        lastMonthEntriesMap.set(pageDetail, (lastMonthEntriesMap.get(pageDetail) || 0) + entries);
        lastMonthVisitsMap.set(pageDetail, (lastMonthVisitsMap.get(pageDetail) || 0) + visits);
      } else if (rowMonth === previousMonth) {
        previousMonthEntriesMap.set(pageDetail, (previousMonthEntriesMap.get(pageDetail) || 0) + entries);
        previousMonthVisitsMap.set(pageDetail, (previousMonthVisitsMap.get(pageDetail) || 0) + visits);
      }
    });

    // Calculate MoM and create array
    const productPagesArray = Array.from(lastMonthEntriesMap.entries())
      .map(([pageDetail, entries]) => {
        const previousEntries = previousMonthEntriesMap.get(pageDetail) || 0;
        const visits = lastMonthVisitsMap.get(pageDetail) || 0;
        const previousVisits = previousMonthVisitsMap.get(pageDetail) || 0;

        let entriesMom = 0;
        let entriesMomString = "N/A";
        let visitsMom = 0;
        let visitsMomString = "N/A";

        // Calculate entries MoM
        if (previousEntries > 0) {
          entriesMom = ((entries - previousEntries) / previousEntries) * 100;
          entriesMomString = entriesMom >= 0 ? `+${entriesMom.toFixed(1)}%` : `${entriesMom.toFixed(1)}%`;
        } else if (entries > 0) {
          entriesMomString = "New";
          entriesMom = 100;
        }

        // Calculate visits MoM
        if (previousVisits > 0) {
          visitsMom = ((visits - previousVisits) / previousVisits) * 100;
          visitsMomString = visitsMom >= 0 ? `+${visitsMom.toFixed(1)}%` : `${visitsMom.toFixed(1)}%`;
        } else if (visits > 0) {
          visitsMomString = "New";
          visitsMom = 100;
        }

        return {
          pageDetail,
          entries,
          visits,
          entriesMom,
          entriesMomString,
          visitsMom,
          visitsMomString
        };
      })
      .sort((a, b) => b.entries - a.entries);

    return productPagesArray;
  }, [adobeData]);

  const headerTitle = useMemo(() => {
    switch (activeTab) {
      case "seo-health":
        return "Keywords";
      case "ai-insights":
        return "GEO Performance";
      default:
        return "SEO Overview";
    }
  }, [activeTab]);

  const headerSubtitle = useMemo(() => {
    switch (activeTab) {
      case "seo-health":
        return (
          <>
            Deep dive into keyword performance <strong>for the selected market</strong>.
            <br />
            Track ranking distribution, identify top-performing search terms, and analyze how keywords drive traffic and visibility.
          </>
        );
      case "ai-insights":
        return (<>
      GEO: Generative Engine Optimization.
      <br />
      Discover how LLMs drive visits to Sony Professional and how the brand appears in AI answers.
    </>
  );
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

  const landingPagesOverview = [
    {
      landingPage: "/products/broadcast-cameras",
      keyword: "sony broadcast cameras",
      position: { type: "badge", label: "2", className: "bg-emerald-100 text-emerald-700" },
      impressions: "12,400",
      clicks: "42",
      ctr: "5.1%",
      ctrMom: "+0.4 pts",
    },
    {
      landingPage: "/products/4k-cameras",
      keyword: "4k professional camera",
      position: { type: "badge", label: "3", className: "bg-emerald-100 text-emerald-700" },
      impressions: "8,900",
      clicks: "31",
      ctr: "4.6%",
      ctrMom: "+0.3 pts",
    },
    {
      landingPage: "/products/ptz-cameras",
      keyword: "sony ptz camera",
      position: { type: "badge", label: "4", className: "bg-emerald-100 text-emerald-700" },
      impressions: "6,700",
      clicks: "24",
      ctr: "4.2%",
      ctrMom: "+0.2 pts",
    },
    {
      landingPage: "/products/live-production",
      keyword: "live production switcher",
      position: { type: "badge", label: "5", className: "bg-amber-100 text-amber-700" },
      impressions: "5,200",
      clicks: "19",
      ctr: "3.8%",
      ctrMom: "+0.1 pts",
    },
    {
      landingPage: "/products/system-cameras",
      keyword: "sony system camera",
      position: { type: "badge", label: "3", className: "bg-emerald-100 text-emerald-700" },
      impressions: "4,800",
      clicks: "17",
      ctr: "4.0%",
      ctrMom: "+0.3 pts",
    },
    {
      landingPage: "/products/monitors",
      keyword: "professional video monitor",
      position: { type: "badge", label: "7", className: "bg-amber-100 text-amber-700" },
      impressions: "3,900",
      clicks: "11",
      ctr: "3.1%",
      ctrMom: "-0.1 pts",
    },
    {
      landingPage: "/products/xdcam",
      keyword: "sony xdcam camcorder",
      position: { type: "badge", label: "8", className: "bg-amber-100 text-amber-700" },
      impressions: "3,100",
      clicks: "9",
      ctr: "2.9%",
      ctrMom: "+0.2 pts",
    },
    {
      landingPage: "/solutions/remote-production",
      keyword: "remote production solutions",
      position: { type: "badge", label: "6", className: "bg-amber-100 text-amber-700" },
      impressions: "2,500",
      clicks: "7",
      ctr: "3.4%",
      ctrMom: "+0.2 pts",
    },
  ] as const;

  const renderPositionBadge = (position: { type: "badge" | "tag"; label: string; className: string; icon?: "paa" | "video" }) => {
    if (position.type === "badge") {
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${position.className}`}>
          {position.label}
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${position.className}`}>
        {position.icon === "paa" && (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        )}
        {position.icon === "video" && (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        )}
        {position.label}
      </span>
    );
  };

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
            <span>GEO Performance</span>
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
        <header className={`flex items-center justify-between border-b border-slate-200 bg-[#f8fafc] px-8 py-5 ${
          activeTab === "seo-health" ? "sticky top-0 z-20 shadow-sm" : ""
        }`}>
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
                <p className="text-2xl font-semibold text-slate-900">
                  {organicSessions?.total || '—'}
                </p>
                {organicSessions?.momChange !== null && organicSessions?.momChange !== undefined && (
                  <span className={`text-xs ${organicSessions.momChange >= 0 ? 'text-[#4aa6c5]' : 'text-red-500'}`}>
                    {organicSessions.momChange >= 0 ? '+' : ''}{Math.round(organicSessions.momChange)}% vs last month
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {organicSessions
                  ? 'Entries from Organic Sessions across all markets'
                  : 'Loading...'}
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
                    <span className="w-1/5 text-right">Impressions</span>
                    <span className="w-1/5 text-right">Click-Through Rate</span>
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
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Top Keywords by Clicks
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Last month • Top queries for the selected Country
                </p>
              </div>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span className="w-2/5">Query</span>
                  <span className="w-1/5 text-right">Clicks</span>
                  <span className="w-1/5 text-right">Impressions</span>
                  <span className="w-1/5 text-right">Avg. Position</span>
                  <span className="w-1/5 text-right">Avg. Position MoM</span>
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
              <div className="mt-4 h-48 rounded-lg border border-slate-200 bg-white px-3 py-3">
                {seoChartData ? (
                <div className="relative h-full flex gap-2">
                  {/* Left Y-axis labels - for Organic Entries and Clicks */}
                  {(() => {
                    const maxEntriesK = Math.max(...seoChartData.map(d => d.entriesK));
                    const maxClicksK = searchConsoleChartData ? Math.max(...searchConsoleChartData.map(d => d.clicksK)) : 0;
                    const maxDataValue = Math.max(maxEntriesK, maxClicksK);
                    const ticks = getNiceAxisTicks(maxDataValue, 5);
                    return (
                      <div className="flex flex-col justify-between text-[10px] text-slate-400 pt-1 pb-6 min-w-[32px]">
                        {ticks.map((tick, idx) => (
                          <span key={idx}>{tick}k</span>
                        ))}
                      </div>
                    );
                  })()}

                  <div className="relative flex-1 h-full">
                    <div className="flex h-full items-end gap-2">
                      {(() => {
                        // Use real entries data from BigQuery
                        const entriesK = seoChartData.map(d => d.entriesK);
                        const months = seoChartData.map(d => d.month);

                        // Get real clicks data from search console, matched by month
                        const clicksK = months.map(month => {
                          const scData = searchConsoleChartData?.find(d => d.month === month);
                          return scData?.clicksK ?? 0;
                        });

                        const maxEntriesK = Math.max(...entriesK);
                        const maxClicksK = Math.max(...clicksK);
                        const leftTicks = getNiceAxisTicks(Math.max(maxEntriesK, maxClicksK), 5);
                        const maxYLeft = leftTicks[0]; // First tick is the max (reversed array)
                        const toHeight = (val: number) => `${(val / maxYLeft) * 100}%`;

                        return months.map((month, idx) => (
                          <div key={month} className="flex flex-1 flex-col justify-end gap-1">
                            <div className="flex h-28 items-end gap-[3px] relative">
                              <div
                                className="group flex-1 relative flex flex-col justify-end"
                                style={{ height: toHeight(entriesK[idx]) }}
                              >
                                <div className="w-full h-full rounded-sm bg-[#4aa6c5]/80 hover:bg-[#4aa6c5] transition-colors cursor-pointer" />
                                <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-30">
                                  {entriesK[idx]}k
                                </span>
                              </div>
                              <div
                                className="group flex-1 relative flex flex-col justify-end"
                                style={{ height: toHeight(clicksK[idx]) }}
                              >
                                <div className="w-full h-full rounded-sm bg-[#3551e6]/70 hover:bg-[#3551e6] transition-colors cursor-pointer" />
                                <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-30">
                                  {clicksK[idx]}k
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500">{month}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  {(() => {
                    // Use real impressions data from search console - scaled to RIGHT Y-axis
                    const months = seoChartData.map(d => d.month);
                    const impressionsK = months.map(month => {
                      const scData = searchConsoleChartData?.find(d => d.month === month);
                      return scData?.impressionsK ?? 0;
                    });

                    // Impressions use their own scale (right Y-axis) with nice ticks
                    const maxImpressionsK = Math.max(...impressionsK);
                    const rightTicks = getNiceAxisTicks(maxImpressionsK, 5);
                    const maxYRight = rightTicks[0]; // First tick is the max (reversed array)
                    const numMonths = seoChartData.length;

                    // Calculate point coordinates for line and hover points
                    // Position each dot at the center of its month column
                    const pointCoords = impressionsK.map((val, idx) => ({
                      x: (100 * (2 * idx + 1)) / (2 * numMonths),
                      y: 100 - (val / maxYRight) * 100,
                      value: val,
                    }));

                    const pathD = pointCoords.map((p, idx) =>
                      `${idx === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
                    ).join(" ");

                    return (
                      <>
                        {/* Line path */}
                        <svg
                          className="pointer-events-none absolute inset-0 h-full w-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <path d={pathD} fill="none" stroke="#1e40af" strokeWidth="1.4" />
                        </svg>
                        {/* Hoverable data points - pointer-events-none on container so bars can be hovered */}
                        <div className="absolute inset-0 h-full w-full pointer-events-none" style={{ marginBottom: '24px' }}>
                          {pointCoords.map((point, idx) => (
                            <div
                              key={idx}
                              className="absolute group pointer-events-auto"
                              style={{
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <div className="w-3 h-3 rounded-full bg-[#1e40af] border-2 border-white shadow-sm cursor-pointer hover:scale-125 transition-transform" />
                              <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap z-20">
                                {(point.value / 1000).toFixed(point.value >= 1000 ? 1 : 2)}M
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                  </div>

                  {/* Right Y-axis labels - for Impressions (in Millions) */}
                  {(() => {
                    const months = seoChartData.map(d => d.month);
                    const impressionsK = months.map(month => {
                      const scData = searchConsoleChartData?.find(d => d.month === month);
                      return scData?.impressionsK ?? 0;
                    });
                    const maxImpressionsK = Math.max(...impressionsK);
                    const ticks = getNiceAxisTicks(maxImpressionsK, 5);
                    return (
                      <div className="flex flex-col justify-between text-[10px] text-slate-400 pt-1 pb-6 min-w-[32px] text-right">
                        {ticks.map((tick, idx) => (
                          <span key={idx}>{(tick / 1000).toFixed(tick >= 1000 ? 0 : 1)}M</span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Loading chart data...
                  </div>
                )}
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

            {/* Landing Pages Overview Table */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Landing Pages Overview
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Top performing Entry Pages.
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 font-medium text-slate-500">Landing Pages</th>
                      <th className="px-3 py-2 font-medium text-slate-500">Keywords</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">Avg. Position</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">Impressions</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">Clicks</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">CTR</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">CTR MoM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {landingPagesOverview.map((row) => (
                      <tr key={row.landingPage} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-slate-700">{row.landingPage}</td>
                        <td className="px-3 py-2.5 text-slate-700">{row.keyword}</td>
                        <td className="px-3 py-2.5 text-center">
                          {renderPositionBadge(row.position)}
                        </td>
                        <td className="px-3 py-2.5 text-center text-slate-600">{row.impressions}</td>
                        <td className="px-3 py-2.5 text-center text-slate-600">{row.clicks}</td>
                        <td className="px-3 py-2.5 text-center text-slate-600">{row.ctr}</td>
                        <td className={`px-3 py-2.5 text-center font-medium ${row.ctrMom.startsWith('-') ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {row.ctrMom}
                        </td>
                      </tr>
                    ))}
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
                Total AI traffic trend | Media Solutions
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Monthly AI-driven sessions and comparison vs. organic sessions.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Last 12 months</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-3 rounded-full bg-[#4aa6c5]" />
                    Entries
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-3 rounded-full bg-slate-300" />
                    CDCs
                  </span>
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setTrafficSessionType("llms")}
                      className={`px-2 py-0.5 rounded-full transition-colors ${
                        trafficSessionType === "llms" ? "bg-[#4aa6c5]/10 text-slate-900" : ""
                      }`}
                    >
                      LLMs sessions
                    </button>
                    <span className="text-slate-400 px-1">vs</span>
                    <button
                      type="button"
                      onClick={() => setTrafficSessionType("organic")}
                      className={`px-2 py-0.5 rounded-full transition-colors ${
                        trafficSessionType === "organic" ? "bg-[#4aa6c5]/10 text-slate-900" : ""
                      }`}
                    >
                      Organic
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-58 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px]">
                {!aiTrafficChartData || !seoChartData ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    {adobeData?.success === false ? (
                      <div className="text-center">
                        <div className="text-red-500 font-medium">Error loading AI traffic data</div>
                        <div className="text-[10px] mt-1">{adobeData?.error || 'Unknown error'}</div>
                      </div>
                    ) : (
                      <div>Loading data...</div>
                    )}
                  </div>
                ) : (
<div className="flex gap-2">
                    {(() => {
                      // Use aiTrafficChartData for both LLMs and Organic (both come from Adobe data)
                      const chartData = aiTrafficChartData;

                      if (!chartData || chartData.length === 0) {
                        return (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            No data available
                          </div>
                        );
                      }

                      // Extract values for scaling
                      // For LLMs: use entries and cdc from Adobe
                      // For Organic: use organic_entries and organic_cdc from Adobe
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const entriesValues = chartData.map((d: any) => {
                        if (trafficSessionType === "llms") {
                          return d.entries ?? 0;
                        } else {
                          return d.organicEntries ?? 0;
                        }
                      });

                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const cdcValues = chartData.map((d: any) => {
                        if (trafficSessionType === "llms") {
                          return d.cdc ?? 0;
                        } else {
                          return d.organicCdc ?? 0;
                        }
                      });

                      // Helper functions for rounding
                      const roundUpToNearest100 = (value: number) => Math.ceil(value / 100) * 100;
                      const roundUpToNearest10k = (value: number) => Math.ceil(value / 10000) * 10000;

                      // Left axis: Different logic for LLM vs Organic
                      const maxEntriesValue = Math.max(...entriesValues);
                      let leftAxisMax, leftAxisTicks = [];

                      if (trafficSessionType === "llms") {
                        // LLM: add 100, round to nearest 100, increment by 100
                        leftAxisMax = roundUpToNearest100(maxEntriesValue + 100);
                        for (let i = 0; i <= leftAxisMax; i += 100) {
                          leftAxisTicks.push(i);
                        }
                      } else {
                        // Organic: fixed max at 25k with 5k increments
                        leftAxisMax = 25000;
                        // Generate ticks: 0, 5k, 10k, 15k, 20k, 25k
                        for (let i = 0; i <= leftAxisMax; i += 5000) {
                          leftAxisTicks.push(i);
                        }
                      }

                      // Right axis: max CDC value + 100, rounded to nearest 100
                      const maxCdcValue = Math.max(...cdcValues);
                      const rightAxisMax = roundUpToNearest100(maxCdcValue + 100);
                      const rightAxisTicks = [];
                      for (let i = 0; i <= rightAxisMax; i += 100) {
                        rightAxisTicks.push(i);
                      }

                      return (
                        <>
                          {/* Left Y-axis labels (Entries) */}
                          <div className="flex flex-col justify-between text-[10px] text-slate-400 h-52 pb-6">
                            {leftAxisTicks.slice().reverse().map(tick => (
                              <span key={tick}>{formatWithKSuffix(tick)}</span>
                            ))}
                          </div>

                          <div className="flex-1 flex h-52 items-end gap-2">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {chartData.map((monthData: any) => {
                              // Get entries and CDC values based on session type
                              let entriesValue, cdcValue;

                              if (trafficSessionType === "llms") {
                                // LLMs: use entries and cdc from Adobe
                                entriesValue = monthData.entries ?? 0;
                                cdcValue = monthData.cdc ?? 0; // Sum of form_submissions + rfis
                              } else {
                                // Organic: use organic_entries and organic_cdc from Adobe
                                entriesValue = monthData.organicEntries ?? 0;
                                cdcValue = monthData.organicCdc ?? 0;
                              }

                              // Calculate bar heights as percentage based on axis max values
                              const entriesHeight = leftAxisMax > 0 ? (entriesValue / leftAxisMax) * 100 : 0;
                              const cdcHeight = rightAxisMax > 0 ? (cdcValue / rightAxisMax) * 100 : 0;

                              return (
                                <div
                                  key={monthData.month}
                                  className="flex flex-1 flex-col items-center gap-1"
                                >
                                  <div className="relative flex h-52 w-full items-end gap-[3px] group">
                                    {/* Combined tooltip for both metrics */}
                                    <div className="hidden group-hover:block absolute top-2 left-1/2 -translate-x-1/2 bg-white px-2 py-1.5 rounded shadow-lg border border-slate-200 z-20 text-left">
                                      <div className="text-[9px] font-medium text-slate-700 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                          <span className="w-2 h-2 rounded-full bg-[#4aa6c5]"></span>
                                          <span>{trafficSessionType === "llms" ? "LLM" : "Organic"} Entries: {formatWithKSuffix(entriesValue)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                          <span>{trafficSessionType === "llms" ? "LLM" : "Organic"} CDCs: {formatWithKSuffix(cdcValue)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Blue bar - Entries */}
                                    <div
                                      className="flex-1 rounded-sm bg-[#4aa6c5]/80 hover:bg-[#4aa6c5] transition-colors cursor-pointer relative"
                                      style={{ height: `${Math.max(2, entriesHeight)}%` }}
                                    />
                                    {/* Gray bar - CDCs */}
                                    <div
                                      className="flex-1 rounded-sm bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer relative"
                                      style={{ height: `${Math.max(2, cdcHeight)}%` }}
                                    />
                                  </div>
                                  <p className="text-[11px] text-slate-500 text-center">
                                    {monthData.month}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Right Y-axis labels (CDCs) */}
                          <div className="flex flex-col justify-between text-[10px] text-slate-400 h-52 pb-6">
                            {rightAxisTicks.slice().reverse().map(tick => (
                              <span key={tick}>{tick}</span>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </article>

            {/* 3.2 Top LLM Traffic Sources */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Top LLM traffic sources | PSE
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Share of Entries from AI assistants - Last Month Data
              </p>
              <div className="mt-3 h-64 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                {!llmTrafficSourcesData || !llmTrafficSourcesData.success ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    {llmTrafficSourcesData === undefined ? (
                      <div>Loading data...</div>
                    ) : llmTrafficSourcesData?.success === false ? (
                      <div className="text-center">
                        <div className="text-red-500 font-medium">Error loading LLM traffic data</div>
                        <div className="text-[10px] mt-1">{llmTrafficSourcesData?.error || 'Unknown error'}</div>
                      </div>
                    ) : (
                      <div>Loading data...</div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {llmTrafficSourcesData.sources?.map((source: any) => {
                      // Color mapping for different LLM sources
                      const colorMap: { [key: string]: string } = {
                        'ChatGPT': 'bg-[#4aa6c5]',
                        'Perplexity': 'bg-[#3551e6]',
                        'Copilot': 'bg-emerald-400',
                        'Gemini': 'bg-amber-400',
                        'Claude': 'bg-sky-400',
                        'Bing': 'bg-purple-400',
                        'Mistral': 'bg-rose-400',
                        'DeepSeek': 'bg-indigo-400',
                        'Other': 'bg-slate-400',
                      };

                      const color = colorMap[source.llm] || 'bg-slate-400';
                      const percentage = parseFloat(source.percentage);

                      return (
                        <div key={source.llm} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span>{source.llm}</span>
                            <span className="text-slate-500">{source.percentage}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${color}`}
                              style={{ width: `${Math.min(100, percentage)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>

            {/* 3.3 Website areas */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Website areas
              </p>
              <p className="mt-1 text-xs text-slate-500">
                LLM sessions | Filtered for Media Solutions
              </p>
              <div className="mt-3 text-[11px] text-slate-700 max-h-60 overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white pb-1.5 text-[11px] text-slate-500">
                  <span>Last Month</span>
                  <span>MoM %</span>
                </div>
                <div className="space-y-1.5">
                {!websiteAreasData ? (
                  <div className="flex items-center justify-center text-slate-400 py-4">
                    {adobeData?.success === false ? (
                      <div className="text-center">
                        <div className="text-red-500 font-medium">Error loading website areas data</div>
                        <div className="text-[10px] mt-1">{adobeData?.error || 'Unknown error'}</div>
                      </div>
                    ) : (
                      <div>Loading data...</div>
                    )}
                  </div>
                ) : websiteAreasData.length === 0 ? (
                  <div className="flex items-center justify-center text-slate-400 py-4">
                    No website area data available
                  </div>
                ) : (
                  websiteAreasData.map((area) => (
                    <div key={area.area} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                      <div>
                        <p className="font-medium text-slate-900">{area.area}</p>
                        <p className="text-slate-500">LLM entries: {formatWithKSuffix(area.entries)}</p>
                      </div>
                      <span className={`text-sm font-semibold ${area.mom >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {area.momString}
                      </span>
                    </div>
                  ))
                )}
                </div>
              </div>
            </article>

            {/* 3.4 Product pages */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Product pages
              </p>
              <p className="mt-1 text-xs text-slate-500">
                LLM sessions | Filtered for Media Solutions
              </p>
              <div className="mt-3 text-[11px] text-slate-700 max-h-60 overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white pb-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>Last Month</span>
                    <div className="flex gap-1 rounded-md bg-slate-100 p-0.5">
                      <button
                        onClick={() => setProductPagesMetric("entries")}
                        className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          productPagesMetric === "entries"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Entries
                      </button>
                      <button
                        onClick={() => setProductPagesMetric("visits")}
                        className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          productPagesMetric === "visits"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Visits
                      </button>
                    </div>
                  </div>
                  <span>MoM %</span>
                </div>
                <div className="space-y-1.5">
                {!productPagesData ? (
                  <div className="flex items-center justify-center text-slate-400 py-4">
                    {adobeData?.success === false ? (
                      <div className="text-center">
                        <div className="text-red-500 font-medium">Error loading product pages data</div>
                        <div className="text-[10px] mt-1">{adobeData?.error || 'Unknown error'}</div>
                      </div>
                    ) : (
                      <div>Loading data...</div>
                    )}
                  </div>
                ) : productPagesData.length === 0 ? (
                  <div className="flex items-center justify-center text-slate-400 py-4">
                    No product pages data available
                  </div>
                ) : (
                  productPagesData
                    .filter((page) => {
                      // Only show pages that have a non-zero value for the selected metric
                      const value = productPagesMetric === "entries" ? page.entries : page.visits;
                      return value > 0;
                    })
                    .map((page) => {
                      const value = productPagesMetric === "entries" ? page.entries : page.visits;
                      const mom = productPagesMetric === "entries" ? page.entriesMom : page.visitsMom;
                      const momString = productPagesMetric === "entries" ? page.entriesMomString : page.visitsMomString;

                      return (
                        <div key={page.pageDetail} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                          <div>
                            <p className="font-medium text-slate-900">{page.pageDetail}</p>
                            <p className="text-slate-500">
                              LLM {productPagesMetric}: {formatWithKSuffix(value)}
                            </p>
                          </div>
                          <span className={`text-sm font-semibold ${mom >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {momString}
                          </span>
                        </div>
                      );
                    })
                )}
                </div>
              </div>
            </article>

            {/* 3.5 LLM entries by Market */}
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                LLM entries by Market
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Top Markets based on Users&apos; Location
              </p>
              <div className="mt-3 space-y-2 text-[11px] text-slate-700">
                <div className="text-[11px] text-slate-500 mb-2">Last Month</div>
                {!llmCountriesData || !llmCountriesData.success ? (
                  <div className="flex items-center justify-center text-slate-400 py-4">
                    {llmCountriesData === undefined ? (
                      <div>Loading data...</div>
                    ) : llmCountriesData?.success === false ? (
                      <div className="text-center">
                        <div className="text-red-500 font-medium">Error loading countries data</div>
                        <div className="text-[10px] mt-1">{llmCountriesData?.error || 'Unknown error'}</div>
                      </div>
                    ) : (
                      <div>Loading data...</div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-[11px] text-slate-700">
                    {/* Pie chart */}
                    <div className="relative h-32 w-32 rounded-full border border-slate-100 bg-slate-50">
                      {(() => {
                        const topCountries = llmCountriesData.countries?.slice(0, 5) || [];
                        const colors = ['#1f78ff', '#4aa6c5', '#5dcf98', '#f2c94c', '#94a3b8'];

                        // Calculate conic gradient stops
                        let currentPercentage = 0;
                        const gradientStops = topCountries.map((country: any, index: number) => {
                          const startPercentage = currentPercentage;
                          currentPercentage += parseFloat(country.percentage);
                          return `${colors[index]} ${startPercentage}% ${currentPercentage}%`;
                        }).join(', ');

                        const topCountry = topCountries[0];

                        return (
                          <>
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{
                                backgroundImage: `conic-gradient(${gradientStops})`,
                              }}
                            />
                            <div className="absolute inset-4 rounded-full bg-white" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-[11px] text-slate-500">Top market</p>
                                <p className="text-sm font-semibold text-slate-900">{topCountry?.country}</p>
                                <p className="text-[11px] text-slate-600">{topCountry?.percentage}%</p>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* List of countries */}
                    <div className="flex-1 space-y-1">
                      {llmCountriesData.countries?.slice(0, 5).map((country: any, index: number) => {
                        // Color palette for top 5 countries
                        const colors = [
                          "bg-[#1f78ff]",
                          "bg-[#4aa6c5]",
                          "bg-[#5dcf98]",
                          "bg-[#f2c94c]",
                          "bg-[#94a3b8]"
                        ];

                        return (
                          <div key={country.country} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${colors[index] || 'bg-slate-400'}`} />
                              <span className="font-medium text-slate-900">{country.country}</span>
                            </div>
                            <span className="text-sm text-slate-700">{country.percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
