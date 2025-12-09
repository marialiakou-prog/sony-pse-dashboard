import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server';

// In-memory cache for BigQuery results
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
            console.log('Returning cached SEO data');
            return NextResponse.json(cache.data, {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                    'X-Cache': 'HIT',
                },
            });
        }

        console.log('SEO data endpoint called - fetching fresh data');

        // Parse GCP credentials from environment variable
        const credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);

        // Initialize BigQuery client
        const bigquery = new BigQuery({
            projectId: credentials.project_id,
            credentials: credentials,
        });

        // Query your BigQuery view
        const query = `
  SELECT *
  FROM \`sony-pro-test-310213.SEO_adobe.monthly_seo_adobe\`
  WHERE
    region = 'PSE'
    AND month >= '2025-04-01'
  ORDER BY month DESC
`;

        console.log('Executing BigQuery query...');
        const [rows] = await bigquery.query({ query });

        console.log(`Retrieved ${rows.length} rows from BigQuery`);

        // Prepare response data
        const responseData = {
            success: true,
            data: rows,
            count: rows.length,
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
        console.error('SEO data endpoint error:', error.message);

        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}