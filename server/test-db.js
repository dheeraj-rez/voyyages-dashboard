const pool = require('./config/db');

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database!');
    
    // Test query
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('Test query result:', rows[0]);
    
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

testConnection(); 