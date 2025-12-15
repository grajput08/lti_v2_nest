import { Client } from 'pg';

async function createDatabase() {
  // Connect to the default 'postgres' database to create our target database
  const adminClient = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default database
    user: 'gatikrajput',
    password: 'Gatik@12345',
  });

  try {
    await adminClient.connect();
    console.log('Connected to PostgreSQL server');

    // Check if database exists
    const checkResult = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = 'nestdb'`,
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ Database "nestdb" already exists');
      await adminClient.end();
      return;
    }

    // Create the database
    await adminClient.query(`CREATE DATABASE nestdb`);
    console.log('✅ Database "nestdb" created successfully!');
  } catch (error: any) {
    if (error.code === '42P04') {
      console.log('✅ Database "nestdb" already exists');
    } else {
      console.error('❌ Error creating database:', error.message);
      process.exit(1);
    }
  } finally {
    await adminClient.end();
  }
}

void createDatabase();
