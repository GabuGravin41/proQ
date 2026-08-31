/**
 * Neon Serverless PostgreSQL Database Client
 * Uses connection pooling with automatic fallback to mock data when in dev/demo mode.
 */

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export async function queryNeon<T = any>(queryText: string, params: any[] = []): Promise<QueryResult<T>> {
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

  if (!connectionString || connectionString.includes('placeholder')) {
    // Return empty / simulated response if Neon is in mock mode
    return { rows: [], rowCount: 0 };
  }

  try {
    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString });
    const res = await pool.query(queryText, params);
    return { rows: res.rows as T[], rowCount: res.rowCount ?? res.rows.length };
  } catch (error) {
    console.error('Neon DB Query Error:', error);
    return { rows: [], rowCount: 0 };
  }
}
