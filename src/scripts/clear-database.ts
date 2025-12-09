import { Client } from 'pg';

async function clearDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'nestdb',
    user: 'gatikrajput',
    password: 'Gatik@12345',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get all table names
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    const tables = result.rows.map((row) => row.tablename);

    if (tables.length === 0) {
      console.log('No tables found in the database');
      await client.end();
      return;
    }

    console.log(`Found ${tables.length} table(s): ${tables.join(', ')}`);

    // Disable foreign key checks temporarily by truncating with CASCADE
    // First, truncate all tables
    for (const table of tables) {
      try {
        await client.query(`TRUNCATE TABLE "${table}" CASCADE`);
        console.log(`✓ Cleared table: ${table}`);
      } catch (error) {
        console.error(`✗ Error clearing table ${table}:`, error.message);
      }
    }

    console.log('\n✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void clearDatabase();
