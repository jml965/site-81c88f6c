const { Pool } = require('pg');
const logger = require('../utils/logger');
const { DATABASE_URL, NODE_ENV } = require('./env');

// PostgreSQL connection pool configuration
const poolConfig = {
  connectionString: DATABASE_URL,
  max: 20, // Maximum number of connections in the pool
  min: 5,  // Minimum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Wait 10 seconds for a connection
  query_timeout: 30000, // Query timeout 30 seconds
  ssl: NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};

// Create connection pool
const pool = new Pool(poolConfig);

// Connection event handlers
pool.on('connect', (client) => {
  logger.info('📦 New PostgreSQL client connected');
});

pool.on('error', (err, client) => {
  logger.error('❌ Unexpected error on idle PostgreSQL client:', err);
});

pool.on('remove', (client) => {
  logger.info('📤 PostgreSQL client removed from pool');
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    client.release();
    
    logger.info('✅ PostgreSQL database connected successfully');
    logger.info(`🕒 Current time: ${result.rows[0].current_time}`);
    logger.info(`🐘 PostgreSQL version: ${result.rows[0].version.split(',')[0]}`);
    
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Initialize database connection
const connectDB = async () => {
  try {
    await testConnection();
    
    // Set up connection pool monitoring
    setInterval(() => {
      const stats = {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      };
      logger.debug('📊 Database pool stats:', stats);
    }, 60000); // Log every minute in development
    
  } catch (error) {
    logger.error('💥 Failed to connect to database:', error);
    process.exit(1);
  }
};

// Database query helper with error handling and logging
const query = async (text, params = []) => {
  const start = Date.now();
  const client = await pool.connect();
  
  try {
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug('🔍 Database query executed:', {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      rows: result.rowCount
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('❌ Database query failed:', {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      error: error.message,
      params: params
    });
    throw error;
  } finally {
    client.release();
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    
    logger.debug('✅ Database transaction completed successfully');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Database transaction rolled back:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

// Health check for database
const healthCheck = async () => {
  try {
    const result = await query('SELECT 1 as health_check');
    return {
      status: 'healthy',
      latency: 'low',
      connections: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};

// Close all connections (for graceful shutdown)
const closeConnections = async () => {
  try {
    await pool.end();
    logger.info('🔒 All database connections closed');
  } catch (error) {
    logger.error('❌ Error closing database connections:', error);
  }
};

// Export database utilities
module.exports = {
  pool,
  query,
  transaction,
  connectDB,
  testConnection,
  healthCheck,
  closeConnections
};