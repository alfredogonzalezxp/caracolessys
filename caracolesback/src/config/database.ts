import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import env from './env';
import logger from '../utils/logger';

const pool = new Pool({
  connectionString: env.dbUrl,
  ssl: {
    rejectUnauthorized: false, // Required for Azure PostgreSQL
  },
});

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createUsersTableQuery);

    const createPaymentsTableQuery = `
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        card_number VARCHAR(20) NOT NULL,
        expiration_date VARCHAR(10) NOT NULL,
        cvv VARCHAR(5) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        amount NUMERIC NOT NULL,
        status VARCHAR(20) DEFAULT 'COMPLETED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createPaymentsTableQuery);

    // In case the table already existed without user_id and status
    try {
      await client.query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
      await client.query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'COMPLETED'`);
    } catch (e: any) {
      logger.error('Error altering payments table', e);
    }
    logger.info('Users table initialized successfully');

    // Check if any users exist
    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) === 0) {
      // Insert default user
      logger.info('No users found. Creating the default admin user...');
      const defaultName = 'Admin';
      const defaultEmail = 'admin@snailsite.com';
      const defaultPassword = 'adminpassword123';

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      await client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [defaultName, defaultEmail, hashedPassword]
      );
      logger.info(`Default user created. Email: ${defaultEmail}`);
    }

  } catch (error: any) {
    logger.error('Error initializing database', error);
  } finally {
    client.release();
  }
};

const connectDB = async () => {
  try {
    // This connects to verify everything is working and runs table init
    await pool.query('SELECT 1');
    logger.info('Database connection established successfully');
    await initializeDatabase();
  } catch (error: any) {
    logger.error('Database connection failed (This is expected if there is no running postgres instance right now)', error);
    // don't exit process so app can start for demonstration without real DB
    // process.exit(1); 
  }
};

export {
  connectDB,
  pool,
};
