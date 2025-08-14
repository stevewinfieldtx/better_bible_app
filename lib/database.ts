import { Pool } from 'pg';

// Railway automatically provides these environment variables when you add a PostgreSQL service
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database tables
export async function initDatabase() {
  try {
    const client = await pool.connect();
    
    // Create content cache table
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_cache (
        id SERIAL PRIMARY KEY,
        cache_key VARCHAR(255) UNIQUE NOT NULL,
        verse VARCHAR(100) NOT NULL,
        age_group VARCHAR(20) NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create image cache table
    await client.query(`
      CREATE TABLE IF NOT EXISTS image_cache (
        id SERIAL PRIMARY KEY,
        cache_key VARCHAR(255) UNIQUE NOT NULL,
        verse VARCHAR(100) NOT NULL,
        age_group VARCHAR(20) NOT NULL,
        image_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_content_cache_key ON content_cache(cache_key);
      CREATE INDEX IF NOT EXISTS idx_content_verse_age ON content_cache(verse, age_group);
      CREATE INDEX IF NOT EXISTS idx_image_cache_key ON image_cache(cache_key);
    `);

    client.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    // Don't throw - app can still work with in-memory cache
  }
}

// Content cache functions
export async function getCachedContent(cacheKey: string) {
  try {
    const result = await pool.query(
      'SELECT content FROM content_cache WHERE cache_key = $1',
      [cacheKey]
    );
    return result.rows[0]?.content || null;
  } catch (error) {
    console.error('Error getting cached content:', error);
    return null;
  }
}

export async function setCachedContent(cacheKey: string, verse: string, ageGroup: string, content: any) {
  try {
    await pool.query(
      `INSERT INTO content_cache (cache_key, verse, age_group, content) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (cache_key) 
       DO UPDATE SET content = $4, updated_at = CURRENT_TIMESTAMP`,
      [cacheKey, verse, ageGroup, content]
    );
    console.log('Content cached successfully:', cacheKey);
  } catch (error) {
    console.error('Error caching content:', error);
  }
}

// Image cache functions
export async function getCachedImage(cacheKey: string) {
  try {
    const result = await pool.query(
      'SELECT image_data FROM image_cache WHERE cache_key = $1',
      [cacheKey]
    );
    return result.rows[0]?.image_data || null;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
}

export async function setCachedImage(cacheKey: string, verse: string, ageGroup: string, imageData: any) {
  try {
    await pool.query(
      `INSERT INTO image_cache (cache_key, verse, age_group, image_data) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (cache_key) 
       DO UPDATE SET image_data = $4`,
      [cacheKey, verse, ageGroup, imageData]
    );
    console.log('Image cached successfully:', cacheKey);
  } catch (error) {
    console.error('Error caching image:', error);
  }
}

// Utility functions
export async function clearOldCache(daysOld: number = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    await pool.query(
      'DELETE FROM content_cache WHERE updated_at < $1',
      [cutoffDate]
    );
    
    await pool.query(
      'DELETE FROM image_cache WHERE created_at < $1',
      [cutoffDate]
    );
    
    console.log('Old cache cleared successfully');
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
}

export async function getCacheStats() {
  try {
    const contentResult = await pool.query('SELECT COUNT(*) FROM content_cache');
    const imageResult = await pool.query('SELECT COUNT(*) FROM image_cache');
    
    return {
      contentCount: parseInt(contentResult.rows[0].count),
      imageCount: parseInt(imageResult.rows[0].count),
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { contentCount: 0, imageCount: 0 };
  }
}

// Graceful shutdown
export async function closeDatabase() {
  await pool.end();
}
