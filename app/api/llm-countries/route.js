import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// In-memory cache for Google Sheets results
let cache = {
    data: null,
    timestamp: 0,
};

// Cache duration: 5 minutes (300,000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

export async function GET(request) {
    try {
        const now = Date.now();

        // Return cached data if still valid
        if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
            console.log('Returning cached LLM Countries data');
            return NextResponse.json(cache.data, {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                    'X-Cache': 'HIT',
                },
            });
        }

        console.log('LLM Countries endpoint called - fetching fresh data from Google Sheets');

        // Parse GCP credentials from environment variable
        const credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);

        // Initialize Google Sheets API
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Google Sheets ID and range
        const spreadsheetId = '1OwgK83BM7Ms22NL9Sb_pD_yExl1fxBJIdSdAALivOw4';
        const range = 'Countries!A:E'; // Reading from the 'Countries' tab

        // Fetch data from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const sheetData = response.data.values;

        if (!sheetData || sheetData.length === 0) {
            throw new Error('No data found in Google Sheet');
        }

        console.log(`Fetched ${sheetData.length} rows from Google Sheets`);

        // Parse the data (first row is headers)
        const headers = sheetData[0];
        const rows = [];

        for (let i = 1; i < sheetData.length; i++) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = sheetData[i][index] || '';
            });
            rows.push(row);
        }

        console.log(`Parsed ${rows.length} rows from Google Sheets`);

        // Filter for PSE region only
        const pseRows = rows.filter(row => row.Region === 'PSE');

        // Find the last available month
        const months = [...new Set(pseRows.map(row => row.Month))].sort();
        const lastMonth = months[months.length - 1];

        console.log(`Last available month: ${lastMonth}`);

        // Filter data for the last month only (exclude "Total" country)
        const lastMonthData = pseRows.filter(row =>
            row.Month === lastMonth &&
            row.Country !== 'Total'
        );

        // Aggregate by Country (sum entries for each country)
        const countryTotals = {};
        let grandTotal = 0;

        lastMonthData.forEach(row => {
            const country = row.Country;
            const entries = parseInt(row.Entries) || 0;

            if (!countryTotals[country]) {
                countryTotals[country] = 0;
            }
            countryTotals[country] += entries;
            grandTotal += entries;
        });

        // Calculate percentages and create sorted array
        const countries = Object.entries(countryTotals)
            .map(([country, entries]) => ({
                country,
                entries,
                percentage: grandTotal > 0 ? ((entries / grandTotal) * 100).toFixed(1) : 0
            }))
            .sort((a, b) => b.entries - a.entries); // Sort by entries descending

        console.log(`Processed ${countries.length} countries for ${lastMonth}`);

        // Prepare response data
        const responseData = {
            success: true,
            lastMonth,
            grandTotal,
            countries: countries,
            timestamp: new Date().toISOString(),
        };

        // Update cache
        cache = {
            data: responseData,
            timestamp: now,
        };

        // Return the data with cache headers
        return NextResponse.json(responseData, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'X-Cache': 'MISS',
            },
        });

    } catch (error) {
        console.error('LLM Countries endpoint error:', error.message);

        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
