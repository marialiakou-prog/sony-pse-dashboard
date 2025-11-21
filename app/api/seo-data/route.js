import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        console.log('SEO data endpoint called');

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
      ORDER BY date DESC
      LIMIT 100
    `;

        console.log('Executing BigQuery query...');
        const [rows] = await bigquery.query({ query });

        console.log(`✅ Retrieved ${rows.length} rows from BigQuery`);

        // Return the data
        return NextResponse.json({
            success: true,
            data: rows,
            count: rows.length,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('❌ SEO data endpoint error:', error.message);

        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}