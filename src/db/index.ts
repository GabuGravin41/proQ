import { neon, neonConfig } from '@neondatabase/serverless';

// Configure Neon client for optimal serverless execution
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';

export const isDbConfigured = Boolean(connectionString);

export const sql = connectionString ? neon(connectionString) : null;

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  if (!sql) {
    console.warn('Neon DB not configured. Using in-memory fallback.');
    return [];
  }
  try {
    const result = await sql(query, params);
    return result as T[];
  } catch (error) {
    console.error('Neon DB Query Error:', error);
    throw error;
  }
}
