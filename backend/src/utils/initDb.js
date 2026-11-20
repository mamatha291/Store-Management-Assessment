const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function initDb() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT) || 3307;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'assessment';

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  // Connect without database first to ensure database exists
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true
  });

  console.log(`Ensuring database '${dbName}' exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.query(`USE \`${dbName}\`;`);

  // Read schema file
  const schemaPath = path.resolve(__dirname, '../../../Database/schema.sql');
  if (fs.existsSync(schemaPath)) {
    console.log(`Reading schema from ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('Schema tables and indexes created successfully.');
  }

  const [tables] = await connection.query(`SHOW TABLES FROM \`${dbName}\`;`);
  console.log(`Tables in '${dbName}':`, tables.map(t => Object.values(t)[0]));

  await connection.end();
  console.log('Database initialization completed successfully!');
}

if (require.main === module) {
  initDb().catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
}

module.exports = initDb;
