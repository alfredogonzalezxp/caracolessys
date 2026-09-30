import dotenv from 'dotenv';
dotenv.config();

export default { 
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbUrl: process.env.DB_URL || 'postgresql://postgresadmin:TuPasswordSeguro123!@pg-alfredo-demo.postgres.database.azure.com/postgres?sslmode=require',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
};
