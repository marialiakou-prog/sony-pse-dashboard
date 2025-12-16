import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// In-memory cache for Google Sheets results
let cache = {
    data: null,
    timestamp: 0,
};

// Cache duration: 5 minutes (300,000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

// Country name to ISO code mapping
const countryToISO = {
    'France': 'FR',
    'Germany': 'DE',
    'United Kingdom': 'GB',
    'Italy': 'IT',
    'Spain': 'ES',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Poland': 'PL',
    'Sweden': 'SE',
    'Austria': 'AT',
    'Switzerland': 'CH',
    'Denmark': 'DK',
    'Norway': 'NO',
    'Finland': 'FI',
    'Czech Republic': 'CZ',
    'Portugal': 'PT',
    'Greece': 'GR',
    'Hungary': 'HU',
    'Romania': 'RO',
    'Ireland': 'IE',
    'Slovakia': 'SK',
    'Bulgaria': 'BG',
    'Croatia': 'HR',
    'Slovenia': 'SI',
    'Lithuania': 'LT',
    'Latvia': 'LV',
    'Estonia': 'EE',
    'Luxembourg': 'LU',
    'Malta': 'MT',
    'Cyprus': 'CY',
    'Iceland': 'IS',
    'Liechtenstein': 'LI',
    'Monaco': 'MC',
    'San Marino': 'SM',
    'Vatican City': 'VA',
    'Andorra': 'AD',
    'Albania': 'AL',
    'Bosnia and Herzegovina': 'BA',
    'Kosovo': 'XK',
    'Macedonia': 'MK',
    'Moldova': 'MD',
    'Montenegro': 'ME',
    'Serbia': 'RS',
    'Turkey': 'TR',
    'Ukraine': 'UA',
    'Belarus': 'BY',
    'Russia': 'RU',
    'Israel': 'IL',
    'Palestine': 'PS',
    'Egypt': 'EG',
    'Morocco': 'MA',
    'Tunisia': 'TN',
    'Algeria': 'DZ',
    'Libya': 'LY',
    'Lebanon': 'LB',
    'Jordan': 'JO',
    'Syria': 'SY',
    'Iraq': 'IQ',
    'Saudi Arabia': 'SA',
    'United Arab Emirates': 'AE',
    'Kuwait': 'KW',
    'Qatar': 'QA',
    'Bahrain': 'BH',
    'Oman': 'OM',
    'Yemen': 'YE',
    'Iran': 'IR',
    'Armenia': 'AM',
    'Azerbaijan': 'AZ',
    'Georgia': 'GE',
    'Kazakhstan': 'KZ',
    'Kyrgyzstan': 'KG',
    'Tajikistan': 'TJ',
    'Turkmenistan': 'TM',
    'Uzbekistan': 'UZ',
    'Afghanistan': 'AF',
    'Pakistan': 'PK',
    'South Africa': 'ZA',
    'Japan': 'JP',
    'United States': 'US',
    'India': 'IN',
    'China': 'CN',
    'Australia': 'AU',
    'Canada': 'CA',
    'Brazil': 'BR',
    'Mexico': 'MX',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'South Korea': 'KR',
    'Singapore': 'SG',
    'Malaysia': 'MY',
    'Thailand': 'TH',
    'Indonesia': 'ID',
    'Philippines': 'PH',
    'Vietnam': 'VN',
    'New Zealand': 'NZ',
    'Hong Kong': 'HK',
    'Taiwan': 'TW',
    'Viet Nam': 'VN',
    'Bangladesh': 'BD',
    'Taiwan region': 'TW',
    'Nepal': 'NP',
    'Ecuador': 'EC',
    'Paraguay': 'PY',
    'Russian Federation': 'RU',
    'Benin': 'BJ',
    'Nigeria': 'NG',
    'Ethiopia': 'ET',
    'Democratic Republic of The Congo': 'CD',
    'Costa Rica': 'CR',
    'Hong Kong SAR of China': 'HK',
    'Cote D Ivoire': 'CI',
    'Guatemala': 'GT',
    'Cambodia': 'KH',
    'Kenya': 'KE',
    'Nicaragua': 'NI',
    'Slovakia (Slovak Republic)': 'SK',
    'Senegal': 'SN',
    'Mozambique': 'MZ',
    'Reunion': 'RE',
    'Palestinian Territories': 'PS',
    'Maldives': 'MV',
    'Rwanda': 'RW',
    'Somalia': 'SO',
    'Northern Mariana Islands': 'MP',
    'Uruguay': 'UY',
    'Bolivia': 'BO',
    'Guinea': 'GN',
    'Madagascar': 'MG',
    'Myanmar': 'MM',
    'Cayman Islands': 'KY',
    'Togo': 'TG',
    'Lao Peoples Democratic Republic': 'LA',
    'Congo': 'CG',
    'Bermuda': 'BM',
};

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

        // Find the last two available months
        const months = [...new Set(pseRows.map(row => row.Month))].sort();
        const lastMonth = months[months.length - 1];
        const previousMonth = months[months.length - 2];

        console.log(`Last available month: ${lastMonth}, Previous month: ${previousMonth}`);

        // Filter data for the last month (exclude "Total" country)
        const lastMonthData = pseRows.filter(row =>
            row.Month === lastMonth &&
            row.Country !== 'Total'
        );

        // Filter data for the previous month (exclude "Total" country)
        const previousMonthData = pseRows.filter(row =>
            row.Month === previousMonth &&
            row.Country !== 'Total'
        );

        // Aggregate by Country for last month
        const lastMonthCountryTotals = {};
        let lastMonthGrandTotal = 0;

        lastMonthData.forEach(row => {
            const country = row.Country;
            const entries = parseInt(row.Entries) || 0;

            if (!lastMonthCountryTotals[country]) {
                lastMonthCountryTotals[country] = 0;
            }
            lastMonthCountryTotals[country] += entries;
            lastMonthGrandTotal += entries;
        });

        // Aggregate by Country for previous month
        const previousMonthCountryTotals = {};
        let previousMonthGrandTotal = 0;

        previousMonthData.forEach(row => {
            const country = row.Country;
            const entries = parseInt(row.Entries) || 0;

            if (!previousMonthCountryTotals[country]) {
                previousMonthCountryTotals[country] = 0;
            }
            previousMonthCountryTotals[country] += entries;
            previousMonthGrandTotal += entries;
        });

        // Calculate percentages and MoM comparison
        const countries = Object.entries(lastMonthCountryTotals)
            .map(([country, entries]) => {
                // Calculate current month percentage
                const currentPercentage = lastMonthGrandTotal > 0
                    ? (entries / lastMonthGrandTotal) * 100
                    : 0;

                // Calculate previous month percentage
                const previousEntries = previousMonthCountryTotals[country] || 0;
                const previousPercentage = previousMonthGrandTotal > 0
                    ? (previousEntries / previousMonthGrandTotal) * 100
                    : 0;

                // Calculate MoM difference in percentage points
                const momPP = currentPercentage - previousPercentage;
                const momPPString = momPP >= 0
                    ? `+${momPP.toFixed(1)}p.p`
                    : `${momPP.toFixed(1)}p.p`;

                // Get ISO code (fallback to country name if not found)
                const isoCode = countryToISO[country] || country;

                return {
                    country,
                    countryISO: isoCode,
                    entries,
                    percentage: currentPercentage.toFixed(1),
                    momPP: momPP,
                    momPPString: momPPString
                };
            })
            .sort((a, b) => b.entries - a.entries); // Sort by entries descending

        console.log(`Processed ${countries.length} countries for ${lastMonth}`);

        // Prepare response data
        const responseData = {
            success: true,
            lastMonth,
            grandTotal: lastMonthGrandTotal,
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
