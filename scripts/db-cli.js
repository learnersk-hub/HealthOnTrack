const Database = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, '..', 'data', 'healthontrack.db');
const db = new Database(dbPath);

console.log('Connected to database:', dbPath);

// Example queries
console.log('\n=== Users ===');
const users = db.prepare('SELECT * FROM users').all();
users.forEach(user => {
  console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
});

console.log('\n=== Emergency Requests ===');
const emergencies = db.prepare('SELECT * FROM emergency_requests').all();
emergencies.forEach(req => {
  console.log(`- ${req.id}: ${req.description} (Severity: ${req.severity}, Status: ${req.status})`);
});

console.log('\n=== Trains ===');
const trains = db.prepare('SELECT * FROM trains').all();
trains.forEach(train => {
  console.log(`- ${train.name} (${train.route}) - Status: ${train.status}`);
});

// Close database connection
db.close();
console.log('\nDatabase connection closed.');