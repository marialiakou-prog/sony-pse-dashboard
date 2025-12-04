import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server';

// In-memory cache for BigQuery results (keyed by query params)
const cache = new Map();

// Cache duration: 5 minutes (300,000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse optional query parameters
        const content = searchParams.get('content');
        const limit = parseInt(searchParams.get('limit')) || 1000;
        const orderBy = searchParams.get('orderBy') || 'month';
        const orderDir = (searchParams.get('orderDir') || 'DESC').toUpperCase();

        // Validate orderDir
        const validOrderDir = ['ASC', 'DESC'].includes(orderDir) ? orderDir : 'DESC';

        // Create cache key based on parameters
        const cacheKey = JSON.stringify({ content, limit, orderBy, orderDir: validOrderDir });
        const now = Date.now();

        // Check cache
        const cached = cache.get(cacheKey);
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
            console.log('Returning cached Search Console data');
            return NextResponse.json(cached.data, {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                    'X-Cache': 'HIT',
                },
            });
        }

        console.log('Search Console endpoint called - fetching fresh data');
        console.log('Parameters:', { content, limit, orderBy, orderDir: validOrderDir });

        // Parse GCP credentials from environment variable
        const credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);

        // Initialize BigQuery client
        const bigquery = new BigQuery({
            projectId: credentials.project_id,
            credentials: credentials,
        });

        // Build the query with required and optional filters
        // Allowed columns for orderBy to prevent SQL injection
        const allowedColumns = [
            'month', 'locale', 'content', 'page', 'query',
            'impressions', 'clicks', 'position', 'page_uri',
            'product_area', 'business_unit', 'FY', 'Month_number'
        ];
        const safeOrderBy = allowedColumns.includes(orderBy) ? orderBy : 'month';

        // Track applied filters
        const appliedFilters = {
            region: 'PSE',
            month: '>= 2025-04-01',
        };

        // Build WHERE clause
        let whereClause = `
            region = 'PSE'
            AND month >= '2025-04-01'
        `;

        // Add optional content filter
        if (content) {
            whereClause += `\n            AND content = @content`;
            appliedFilters.content = content;
        }

        const query = `
            SELECT
                month,
                locale,
                content,
                page,
                query,
                impressions,
                clicks,
                position,
                page_uri,
                product_area,
                business_unit,
                FY,
                Month_number
            FROM \`sony-pro-test-310213.search_console.monthly_totals_page_query_table\`
            WHERE ${whereClause}
            ORDER BY ${safeOrderBy} ${validOrderDir}
            LIMIT @limit
        `;

        // Query parameters for parameterized query (prevents SQL injection)
        const queryParams = {
            limit: limit,
        };
        if (content) {
            queryParams.content = content;
        }

        console.log('Executing BigQuery query...');
        const [rows] = await bigquery.query({
            query,
            params: queryParams,
        });

        console.log(`Retrieved ${rows.length} rows from Search Console data`);

        // Prepare response data
        const responseData = {
            success: true,
            data: rows,
            count: rows.length,
            filters: appliedFilters,
            timestamp: new Date().toISOString(),
        };

        // Update cache
        cache.set(cacheKey, {
            data: responseData,
            timestamp: now,
        });

        // Clean old cache entries (keep cache size manageable)
        if (cache.size > 50) {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        }

        // Return the data with cache headers
        return NextResponse.json(responseData, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'X-Cache': 'MISS',
            },
        });

    } catch (error) {
        console.error('Search Console endpoint error:', error.message);

        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
