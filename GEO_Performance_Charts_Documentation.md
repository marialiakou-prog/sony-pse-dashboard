# GEO Performance Dashboard - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Data Sources & BigQuery Tables](#data-sources--bigquery-tables)
3. [Chart Details & Refresh Behavior](#chart-details--refresh-behavior)
4. [Last Month Data Process](#last-month-data-process)
5. [Automatic Data Update Timeline](#automatic-data-update-timeline)

---

## Overview

The GEO Performance tab displays 6 charts that visualize AI-driven traffic and performance metrics for Sony's Media Solutions business unit. All charts use **SWR (Stale-While-Revalidate)** for data fetching with both server-side and client-side caching.

### Global Refresh Strategy
- **Server-side cache:** 5 minutes
- **Client-side deduplication:** 60 seconds
- **Revalidation:** On reconnect only (NOT on tab focus)
- **Cache headers:** `s-maxage=300, stale-while-revalidate=600`

---

## Data Sources & BigQuery Tables

### API Endpoints and Their Data Sources

| API Endpoint | Data Source Type | BigQuery Project.Dataset.Table/View | Google Sheets Info | Used In GEO Performance |
|--------------|-----------------|-------------------------------------|-------------------|------------------------|
| `/api/adobe-reporting` | BigQuery | `sony-pro-test-310213.geo.adobe_monthly_data_reporting_PSE_Dashboard_test` | - | ✅ Yes (Charts 1, 3, 4) |
| `/api/llm-traffic-sources` | Google Sheets | - | **Spreadsheet ID:** `1OwgK83BM7Ms22NL9Sb_pD_yExl1fxBJIdSdAALivOw4`<br>**Tab:** `Referrer` | ✅ Yes (Chart 2) |
| `/api/llm-countries` | Google Sheets | - | **Spreadsheet ID:** `1OwgK83BM7Ms22NL9Sb_pD_yExl1fxBJIdSdAALivOw4`<br>**Tab:** `Countries` | ✅ Yes (Chart 5) |
| `/api/seo-data` | BigQuery | `sony-pro-test-310213.SEO_adobe.monthly_seo_adobe` | - | ❌ No (Executive Summary) |
| `/api/search-console` | BigQuery | `sony-pro-test-310213.search_console.monthly_totals_page_query_table` | - | ❌ No (SEO Health) |

### Detailed BigQuery Information

#### 1. Adobe Reporting API
- **Project:** `sony-pro-test-310213`
- **Dataset:** `geo`
- **Table/View:** `adobe_monthly_data_reporting_PSE_Dashboard_test`
- **Type:** Table or View

**Query:**
```sql
SELECT *
FROM `sony-pro-test-310213.geo.adobe_monthly_data_reporting_PSE_Dashboard_test`
WHERE month >= '2025-04-01'
ORDER BY month DESC
```

**Filters Applied in Dashboard:**
- `pse_bu = 'Media Solutions'` (frontend filter)

**Key Columns Used:**
- `month` - Month identifier (YYYY-MM-DD format)
- `pse_bu` - Business unit (filtered to 'Media Solutions')
- `website_area` - Website section (Professional Cameras, Audio, Broadcast and Production)
- `page_detail` - Product page name
- `entries` - LLM entries count
- `visits` - LLM visits count
- `rfis` - Request for Information count
- `form_submissions` - Form submission count
- `organic_entries` - Organic entries count
- `organic_cdc` - Organic CDC count

#### 2. SEO Data API (Not used in GEO Performance)
- **Project:** `sony-pro-test-310213`
- **Dataset:** `SEO_adobe`
- **Table/View:** `monthly_seo_adobe`

**Query:**
```sql
SELECT *
FROM `sony-pro-test-310213.SEO_adobe.monthly_seo_adobe`
WHERE region = 'PSE' AND month >= '2025-04-01'
ORDER BY month DESC
```

#### 3. Search Console API (Not used in GEO Performance)
- **Project:** `sony-pro-test-310213`
- **Dataset:** `search_console`
- **Table/View:** `monthly_totals_page_query_table`

**Query:**
```sql
SELECT month, locale, content, page, query, impressions, clicks, position,
       page_uri, product_area, business_unit, FY, Month_number
FROM `sony-pro-test-310213.search_console.monthly_totals_page_query_table`
WHERE region = 'PSE' AND month >= '2025-04-01'
ORDER BY month DESC
LIMIT 1000
```

---

## Chart Details & Refresh Behavior

### Chart 1: Total AI Traffic Trend | Media Solutions

**Chart Type:** Dual-axis bar chart with toggle

**Data Source:**
- API: `/api/adobe-reporting`
- BigQuery: `sony-pro-test-310213.geo.adobe_monthly_data_reporting_PSE_Dashboard_test`
- Filter: `pse_bu = 'Media Solutions'`, `month >= '2025-04-01'`

**Metrics Displayed:**
- **LLMs Mode:**
  - Blue bars: Entries (from `entries` column)
  - Gray bars: CDCs (calculated as `rfis + form_submissions`)
- **Organic Mode:**
  - Blue bars: Organic Entries (from `organic_entries` column)
  - Gray bars: Organic CDCs (from `organic_cdc` column)

**Data Processing:**
```javascript
// Groups data by month and aggregates sums
const totalEntries = monthData.reduce((sum, row) => sum + row.entries, 0);
const totalCDC = monthData.reduce((sum, row) => sum + row.rfis + row.form_submissions, 0);
```

**Y-Axis Scaling:**
- **LLMs:** Dynamic max (rounded to nearest 100, increments of 100)
- **Organic:** Fixed max at 25k (increments of 5k)

**Time Range:** FY25 up to last month (April 2025 onwards)

**Refresh Conditions:**
- Server cache: 5 minutes
- Client deduplication: 60 seconds
- Revalidation: On reconnect only
- Manual: Browser refresh if cache expired

**Interactive Features:**
- Toggle between LLMs/Organic sessions
- Hover tooltips with exact values
- Bar height animation on toggle

---

### Chart 2: Top LLM Traffic Sources | PSE

**Chart Type:** Horizontal bar chart (percentage distribution)

**Data Source:**
- API: `/api/llm-traffic-sources`
- Google Sheets ID: `1OwgK83BM7Ms22NL9Sb_pD_yExl1fxBJIdSdAALivOw4`
- Tab: `Referrer`
- Filter: `Region = 'PSE'`, last available month only

**Metrics Displayed:**
- LLM source name (ChatGPT, Perplexity, Copilot, Gemini, Claude, Bing, Mistral, DeepSeek, Other)
- Percentage share of total entries
- Color-coded bars:
  - ChatGPT: `#4aa6c5` (blue)
  - Perplexity: `#3551e6` (royal blue)
  - Copilot: emerald
  - Gemini: amber
  - Claude: sky blue
  - Bing: purple
  - Mistral: rose
  - DeepSeek: indigo
  - Other: slate gray

**Data Processing:**
```javascript
// Dynamically fetches latest available month
const months = [...new Set(pseRows.map(row => row.Month))].sort();
const lastMonth = months[months.length - 1];

// Aggregates entries by LLM source and calculates percentage
const percentage = (llmEntries / grandTotal) * 100;
```

**Refresh Conditions:**
- Server cache: 5 minutes
- Client deduplication: 60 seconds
- Updates automatically when Google Sheets is updated

**Interactive Features:**
- Full-width horizontal bars with percentage labels
- Sorted by percentage descending

---

### Chart 3: Website Areas

**Chart Type:** List view with Month-over-Month comparison

**Data Source:**
- API: `/api/adobe-reporting` (same as Chart 1)
- BigQuery: `sony-pro-test-310213.geo.adobe_monthly_data_reporting_PSE_Dashboard_test`
- Filter: `pse_bu = 'Media Solutions'`

**Metrics Displayed:**
- Website area name (Professional Cameras, Audio, Broadcast and Production)
- LLM entries count for last month
- MoM % change (green ↑ for positive, amber ↓ for negative)

**Data Processing:**
```javascript
// Groups by website_area column
const lastMonthData = filteredData.filter(row => row.month === lastMonth);
const previousMonthData = filteredData.filter(row => row.month === previousMonth);

// Calculates MoM percentage change
const momChange = ((lastMonth - previousMonth) / previousMonth) * 100;
```

**MoM Calculation Formula:**
```
MoM % = ((Current Month Entries - Previous Month Entries) / Previous Month Entries) × 100
```

**Refresh Conditions:**
- Same as Chart 1 (shares same API endpoint)

**Interactive Features:**
- Scrollable list with sticky header showing "Last Month" and "MoM %"
- Sorted by entries descending

---

### Chart 4: Product Pages

**Chart Type:** List view with toggle and Month-over-Month comparison

**Data Source:**
- API: `/api/adobe-reporting` (same as Chart 1)
- BigQuery: `sony-pro-test-310213.geo.adobe_monthly_data_reporting_PSE_Dashboard_test`
- Filter: `pse_bu = 'Media Solutions'`, `website_area IN ('Professional Cameras', 'Audio', 'Broadcast and Production')`

**Metrics Displayed:**
- Page detail (product page name) from `page_detail` column
- Toggle between:
  - **Entries:** LLM entries count with MoM %
  - **Visits:** LLM visits count with MoM %

**Data Processing:**
```javascript
// Groups by page_detail column
const lastMonthEntriesMap = new Map();
const lastMonthVisitsMap = new Map();

// Calculates separate MoM for both metrics
const entriesMom = ((currentEntries - previousEntries) / previousEntries) * 100;
const visitsMom = ((currentVisits - previousVisits) / previousVisits) * 100;

// Filters out pages with 0 value for selected metric
.filter(page => {
  const value = productPagesMetric === "entries" ? page.entries : page.visits;
  return value > 0;
})
```

**Refresh Conditions:**
- Same as Chart 1 (shares same API endpoint)
- Toggle is instant (client-side state change)

**Interactive Features:**
- Toggle between Entries/Visits metrics
- Scrollable list with sticky header showing "Last Month" and "MoM %"
- Dynamic filtering: only shows pages with non-zero values for selected metric
- Sorted by entries descending

---

### Chart 5: LLM Entries by Market | PSE

**Chart Type:** Pie chart + scrollable country list with MoM comparison

**Data Source:**
- API: `/api/llm-countries`
- Google Sheets ID: `1OwgK83BM7Ms22NL9Sb_pD_yExl1fxBJIdSdAALivOw4`
- Tab: `Countries`
- Filter: `Region = 'PSE'`, excludes `Country = 'Total'`

**Metrics Displayed:**
- **Pie Chart:** Top 5 countries by share percentage with dynamic conic gradient
- **Country List:** All countries with:
  - 2-letter ISO code (FR, DE, JP, US, etc.)
  - Share % (percentage of total entries)
  - MoM in percentage points (e.g., +3.2p.p, -1.5p.p)

**Data Processing:**
```javascript
// Fetches last 2 months of data
const lastMonth = months[months.length - 1];
const previousMonth = months[months.length - 2];

// Calculates share % for each country
const currentShare = (countryEntries / totalEntries) * 100;
const previousShare = (previousCountryEntries / previousTotalEntries) * 100;

// Calculates MoM in percentage points (NOT percentage change)
const momPP = currentShare - previousShare;
```

**MoM Calculation (Percentage Points):**
```
MoM p.p = Current Month Share % - Previous Month Share %

Example:
- France current: 8.7%
- France previous: 8.2%
- MoM = 8.7 - 8.2 = +0.5p.p
```

**ISO Country Code Mapping:**
- Comprehensive mapping for 150+ countries
- Covers all European, Asian, African, American, and Oceanian countries
- Fallback to full country name if ISO code not found

**Pie Chart Colors:**
- Top 1: `#1f78ff` (bright blue)
- Top 2: `#4aa6c5` (teal blue)
- Top 3: `#5dcf98` (mint green)
- Top 4: `#f2c94c` (amber yellow)
- Top 5: `#94a3b8` (slate gray)
- Others: No color (not shown in pie)

**Refresh Conditions:**
- Server cache: 5 minutes
- Client deduplication: 60 seconds
- Updates automatically when Google Sheets is updated

**Interactive Features:**
- Dynamic pie chart with top country displayed in center
- Scrollable country list (7 rows visible, rest scrollable)
- Column headers: "Share %" and "MoM" (left-aligned)
- Color indicators match pie chart colors for top 5 countries
- Green MoM for positive changes, amber for negative

---

### Chart 6: Brand Visibility in LLMs

**Status:** Placeholder/In development

**Current Display:**
- Static mockup data
- Sony mention rate: 64%
- Top competitor mention: Canon (78%)

---

## Last Month Data Process

### How "Last Month" Detection Works

The dashboard uses **dynamic "last month" detection** that automatically identifies the most recent month in the data without hardcoding dates.

#### For BigQuery Data (Charts 1, 3, 4):

**Step 1: Query Fetches All Available Months**
```sql
WHERE month >= '2025-04-01'
ORDER BY month DESC
```

**Step 2: Frontend Finds Latest Month**
```javascript
// Extract all unique months from data
const uniqueMonths = [...new Set(filteredData.map(row => row.month))]
  .filter(m => Boolean(m))
  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

// Automatically detect last month (most recent)
const lastMonth = uniqueMonths[uniqueMonths.length - 1];
const previousMonth = uniqueMonths[uniqueMonths.length - 2];
```

**Step 3: Automatic Update Process**
- ✅ When new month data is added to BigQuery table
- ✅ Dashboard automatically detects it as the new "last month"
- ✅ No code changes needed
- ✅ MoM comparison automatically uses the previous month
- ✅ All charts update simultaneously (same data source)

#### For Google Sheets Data (Charts 2, 5):

**Step 1: API Fetches All Months**
```javascript
// Find the last available month dynamically
const pseRows = rows.filter(row => row.Region === 'PSE');
const months = [...new Set(pseRows.map(row => row.Month))].sort();
const lastMonth = months[months.length - 1];
const previousMonth = months[months.length - 2]; // For MoM
```

**Step 2: Automatic Update Process**
- ✅ When new month data is added to Google Sheets
- ✅ Dashboard automatically detects it as the new "last month"
- ✅ No code changes needed
- ✅ Updates within 5 minutes (cache expiration)
- ✅ Each chart updates independently (separate API calls)

---

## Automatic Data Update Timeline

### When Will New Data Appear in the Dashboard?

#### Scenario: New Month Data Added to BigQuery or Google Sheets

| Step | What Happens | Timing |
|------|-------------|--------|
| 1️⃣ | New data inserted into BigQuery table or Google Sheets | Immediate |
| 2️⃣ | Server cache expires | API fetches fresh data from source | Within 5 minutes |
| 3️⃣ | Client cache expires | Browser requests fresh data from API | Within 1-5 minutes |
| 4️⃣ | Dashboard displays new month | Frontend automatically detects latest month | Immediate after fetch |
| 5️⃣ | MoM calculations update | Previous "last month" becomes comparison baseline | Automatic |

**Maximum Latency for New Data:**
- **Worst case:** ~10 minutes (5 min server cache + 5 min propagation)
- **Best case:** ~5 minutes (if cache just expired)
- **Force immediate update:** Browser hard refresh (Ctrl+Shift+R) + wait for cache expiration

---

### Example Timeline

**Scenario:** December 2025 data is added to BigQuery on January 5, 2026 at 9:00 AM

| Time | Event | Dashboard Shows |
|------|-------|----------------|
| 9:00 AM | Dec 2025 data added to BigQuery | Still shows Nov 2025 as "last month" (cached) |
| 9:05 AM | Server cache expires, API fetches fresh data including Dec 2025 | Dec 2025 detected as latest month |
| 9:05 AM | Client browsers request fresh data | Dashboard automatically updates to show Dec 2025 |
| 9:05 AM | MoM calculations update | Now compares Dec 2025 vs Nov 2025 automatically |
| 9:06 AM | All users see new data | Charts 1, 3, 4 show Dec 2025; Charts 2, 5 show new month from Sheets |

---

### Cache Invalidation Flow

```
New Data Added to Source
         ↓
Server Cache (5 min TTL)
         ↓
API Response with Fresh Data
         ↓
Client Cache (SWR, 60 sec deduplication)
         ↓
Dashboard Re-renders with New Month
         ↓
MoM Calculations Update Automatically
```

---

## Key Points Summary

### ✅ Fully Automatic System
- No code changes needed when new months are added
- No manual configuration required
- No hardcoded dates in the frontend

### ✅ Dynamic Month Detection
- Always picks the latest available month from data
- Automatically identifies previous month for MoM
- Works for any month >= April 2025

### ✅ MoM Always Current
- Always compares last month vs previous month
- Percentage calculations for most metrics
- Percentage point calculations for market share (Chart 5)

### ✅ Cache-Based Refresh
- Updates within 5 minutes of new data
- Server-side: 5-minute in-memory cache
- Client-side: 60-second deduplication interval
- Stale-while-revalidate strategy for better UX

### ✅ No Manual Intervention
- Dashboard self-updates when data source is updated
- All charts refresh automatically
- MoM comparisons recalculate automatically

### ✅ Error Handling
- Graceful loading states
- Detailed error messages
- Fallback to cached data if API fails

---

## Data Update Checklist

When adding new month data, follow this checklist:

### For BigQuery Data (Charts 1, 3, 4):
- [ ] Insert new month data into `sony-pro-test-310213.geo.adobe_monthly_data_reporting_PSE_Dashboard_test`
- [ ] Ensure `month` column is in YYYY-MM-DD format
- [ ] Ensure `pse_bu = 'Media Solutions'` for relevant rows
- [ ] Verify all required columns are populated:
  - `month`, `pse_bu`, `website_area`, `page_detail`
  - `entries`, `visits`, `rfis`, `form_submissions`
  - `organic_entries`, `organic_cdc`
- [ ] Wait 5-10 minutes for cache to expire
- [ ] Verify dashboard shows new month as "last month"
- [ ] Verify MoM comparisons are correct

### For Google Sheets Data (Charts 2, 5):
- [ ] Add new month data to Google Sheets (`1OwgK83BM7Ms22NL9Sb_pD_yExl1fxBJIdSdAALivOw4`)
- [ ] **Chart 2 (Referrer tab):**
  - Ensure columns: `Month`, `Region`, `LLM`, `Referrer`, `Entries`
  - Set `Region = 'PSE'` for all rows
  - Exclude rows where `LLM = 'Total'` or `LLM = 'Other'`
- [ ] **Chart 5 (Countries tab):**
  - Ensure columns: `Month`, `Region`, `Country`, `Entries`
  - Set `Region = 'PSE'` for all rows
  - Exclude rows where `Country = 'Total'`
- [ ] Wait 5-10 minutes for cache to expire
- [ ] Verify dashboard shows new month data
- [ ] Verify MoM percentage points are correct

---

## Troubleshooting

### Dashboard Not Showing New Month Data

**Problem:** New data added but dashboard still shows old month

**Solutions:**
1. **Check cache timing:** Wait 5-10 minutes for caches to expire
2. **Force refresh:** Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check data format:** Ensure month column is YYYY-MM-DD format
4. **Check filters:** Verify `pse_bu = 'Media Solutions'` and `Region = 'PSE'`
5. **Check API logs:** Look for errors in server console
6. **Verify BigQuery/Sheets:** Manually query to confirm data exists

### MoM Calculations Showing Incorrect Values

**Problem:** Month-over-Month percentages don't match expectations

**Solutions:**
1. **Verify two months exist:** Need at least 2 months of data for MoM
2. **Check previous month data:** Ensure previous month has complete data
3. **Understand calculation types:**
   - Charts 1, 3, 4: Percentage change `((current - previous) / previous) × 100`
   - Chart 5: Percentage point difference `current% - previous%`
4. **Check for data gaps:** Missing data in previous month causes high MoM

### API Errors

**Problem:** "Error loading data" message appears

**Solutions:**
1. **Check GCP credentials:** Verify `GCP_SERVICE_ACCOUNT` env variable is set
2. **Check BigQuery permissions:** Ensure service account has read access
3. **Check Google Sheets permissions:** Ensure service account can read sheets
4. **Check network:** Verify API endpoints are accessible
5. **Review error details:** Check browser console for specific error messages

---

## Contact & Support

For questions about this documentation or technical issues:
- **Dashboard Code:** Check `/app/page.tsx` for frontend logic
- **API Routes:** Check `/app/api/*` for backend logic
- **BigQuery Tables:** Contact data engineering team
- **Google Sheets:** Contact data management team

---

**Document Version:** 1.0
**Last Updated:** January 2025
**Dashboard Version:** Next.js 16.0.7 with App Router
