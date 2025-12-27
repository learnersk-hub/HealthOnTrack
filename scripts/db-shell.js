const Database = require('better-sqlite3');
const path = require('path');
const readline = require('readline');

// Connect to database
const dbPath = path.join(__dirname, '..', 'data', 'healthontrack.db');
const db = new Database(dbPath);

console.log('Connected to database:', dbPath);
console.log('Type your SQL queries or "exit" to quit.\n');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function executeQuery(query) {
  try {
    // Handle SQLite CLI commands
    if (query.startsWith('.schema')) {
      const tableName = query.split(' ')[1];
      if (tableName) {
        const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name=?").get(tableName);
        if (schema) {
          console.log(schema.sql);
        } else {
          console.log(`Table '${tableName}' not found.`);
        }
      } else {
        const schemas = db.prepare("SELECT sql FROM sqlite_master WHERE type='table'").all();
        schemas.forEach(schema => {
          console.log(schema.sql + ';');
        });
      }
      promptUser();
      return;
    }
    
    if (query.startsWith('.tables')) {
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      console.log(tables.map(t => t.name).join('  '));
      promptUser();
      return;
    }
    
    // Remove trailing semicolon if present
    query = query.trim().replace(/;$/, '');
    
    // Check if it's a SELECT query
    if (query.toLowerCase().startsWith('select')) {
      const stmt = db.prepare(query);
      const results = stmt.all();
      
      if (results.length === 0) {
        console.log('No results found.');
      } else {
        console.log(`Found ${results.length} row(s):`);
        results.forEach((row, index) => {
          console.log(`\nRow ${index + 1}:`);
          for (const [key, value] of Object.entries(row)) {
            console.log(`  ${key}: ${value}`);
          }
        });
      }
    } else {
      // For INSERT, UPDATE, DELETE queries
      const stmt = db.prepare(query);
      const info = stmt.run();
      console.log(`Query executed successfully.`);
      console.log(`Changes: ${info.changes}`);
    }
  } catch (error) {
    console.error('Error executing query:', error.message);
  }
  promptUser();
}

function promptUser() {
  rl.question('\nSQL> ', (query) => {
    if (query.toLowerCase() === 'exit') {
      db.close();
      console.log('Database connection closed.');
      rl.close();
      return;
    }
    
    if (query.trim() !== '') {
      executeQuery(query);
    } else {
      promptUser();
    }
  });
}

// Show available tables
console.log('Available tables:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(table => {
  console.log(`- ${table.name}`);
});

console.log('\nExample queries:');
console.log('- SELECT * FROM users;');
console.log('- SELECT * FROM emergency_requests;');
console.log('- SELECT * FROM trains;');
console.log('SQLite CLI commands:');
console.log('- .tables');
console.log('- .schema');
console.log('- .schema table_name');
console.log('- Type "exit" to quit\n');

promptUser();