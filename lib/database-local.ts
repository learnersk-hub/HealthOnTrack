// Local SQLite database implementation
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

let db: Database.Database | null = null
let isInitialized = false

function getDatabase() {
  if (!db) {
    // Ensure database directory exists
    const dbDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }

    const dbPath = path.join(dbDir, 'healthontrack.db')

    // Create database connection
    db = new Database(dbPath)

    // Enable foreign keys
    db.pragma('foreign_keys = ON')
  }
  return db
}

// Initialize database schema
export function initializeDatabase() {
  const database = getDatabase()
  
  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('passenger', 'attendant', 'doctor', 'admin')),
      train_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Emergency requests table
  database.exec(`
    CREATE TABLE IF NOT EXISTS emergency_requests (
      id TEXT PRIMARY KEY,
      passenger_id TEXT NOT NULL,
      train_id TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved', 'cancelled')),
      assigned_attendant_id TEXT,
      assigned_doctor_id TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (passenger_id) REFERENCES users (id),
      FOREIGN KEY (assigned_attendant_id) REFERENCES users (id),
      FOREIGN KEY (assigned_doctor_id) REFERENCES users (id)
    )
  `)

  // Messages table for chat functionality
  database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      emergency_request_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      message TEXT NOT NULL,
      message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emergency_request_id) REFERENCES emergency_requests (id),
      FOREIGN KEY (sender_id) REFERENCES users (id)
    )
  `)

  // Vital signs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS vital_signs (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      emergency_request_id TEXT,
      heart_rate INTEGER,
      blood_pressure_systolic INTEGER,
      blood_pressure_diastolic INTEGER,
      temperature REAL,
      oxygen_saturation INTEGER,
      respiratory_rate INTEGER,
      recorded_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users (id),
      FOREIGN KEY (emergency_request_id) REFERENCES emergency_requests (id),
      FOREIGN KEY (recorded_by) REFERENCES users (id)
    )
  `)

  // Prescriptions table
  database.exec(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      emergency_request_id TEXT,
      medication_name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      duration TEXT NOT NULL,
      instructions TEXT,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users (id),
      FOREIGN KEY (doctor_id) REFERENCES users (id),
      FOREIGN KEY (emergency_request_id) REFERENCES emergency_requests (id)
    )
  `)

  // Trains table for admin monitoring
  database.exec(`
    CREATE TABLE IF NOT EXISTS trains (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      route TEXT NOT NULL,
      current_location TEXT,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
      medical_equipment TEXT, -- JSON string of available equipment
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Insert default trains if they don't exist
  const trainCount = database.prepare('SELECT COUNT(*) as count FROM trains').get() as { count: number }
  if (trainCount.count === 0) {
    const insertTrain = database.prepare(`
      INSERT INTO trains (id, name, route, current_location, medical_equipment)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    insertTrain.run('TR-001', 'Express 12A', 'Mumbai - Delhi', 'Central Station', JSON.stringify([
      'AED', 'Oxygen Tank', 'First Aid Kit', 'Blood Pressure Monitor', 'Thermometer'
    ]))
  }

  console.log('Database initialized successfully')
}

// Initialize database lazily
export function ensureDatabaseInitialized() {
  if (!isInitialized) {
    initializeDatabase()
    isInitialized = true
  }
}

// Database query functions
export function getUserQueries() {
  ensureDatabaseInitialized()
  const database = getDatabase()
  
  return {
    create: database.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, train_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `),
    
    findByEmail: database.prepare(`
      SELECT * FROM users WHERE email = ?
    `),
    
    findById: database.prepare(`
      SELECT * FROM users WHERE id = ?
    `),
    
    updateLastLogin: database.prepare(`
      UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)
  }
}

export function getEmergencyQueries() {
  ensureDatabaseInitialized()
  const database = getDatabase()
  
  return {
    create: database.prepare(`
      INSERT INTO emergency_requests (id, passenger_id, train_id, description, severity, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `),
    
    findByPassenger: database.prepare(`
      SELECT * FROM emergency_requests WHERE passenger_id = ? ORDER BY created_at DESC
    `),
    
    findPending: database.prepare(`
      SELECT er.*, u.name as passenger_name, u.email as passenger_email
      FROM emergency_requests er
      JOIN users u ON er.passenger_id = u.id
      WHERE er.status = 'pending'
      ORDER BY er.created_at DESC
    `),
    
    updateStatus: database.prepare(`
      UPDATE emergency_requests 
      SET status = ?, assigned_attendant_id = ?, assigned_doctor_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `),
    
    findById: database.prepare(`
      SELECT er.*, 
             p.name as passenger_name, p.email as passenger_email,
             a.name as attendant_name, a.email as attendant_email,
             d.name as doctor_name, d.email as doctor_email
      FROM emergency_requests er
      JOIN users p ON er.passenger_id = p.id
      LEFT JOIN users a ON er.assigned_attendant_id = a.id
      LEFT JOIN users d ON er.assigned_doctor_id = d.id
      WHERE er.id = ?
    `)
  }
}

export function getMessageQueries() {
  ensureDatabaseInitialized()
  const database = getDatabase()
  
  return {
    create: database.prepare(`
      INSERT INTO messages (id, emergency_request_id, sender_id, message, message_type)
      VALUES (?, ?, ?, ?, ?)
    `),
    
    findByEmergencyRequest: database.prepare(`
      SELECT m.*, u.name as sender_name, u.role as sender_role
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.emergency_request_id = ?
      ORDER BY m.created_at ASC
    `)
  }
}

export function getVitalQueries() {
  ensureDatabaseInitialized()
  const database = getDatabase()
  
  return {
    create: database.prepare(`
      INSERT INTO vital_signs (id, patient_id, emergency_request_id, heart_rate, blood_pressure_systolic, 
                             blood_pressure_diastolic, temperature, oxygen_saturation, respiratory_rate, recorded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    findByPatient: database.prepare(`
      SELECT vs.*, u.name as recorded_by_name
      FROM vital_signs vs
      JOIN users u ON vs.recorded_by = u.id
      WHERE vs.patient_id = ?
      ORDER BY vs.created_at DESC
    `),
    
    findLatestByPatient: database.prepare(`
      SELECT vs.*, u.name as recorded_by_name
      FROM vital_signs vs
      JOIN users u ON vs.recorded_by = u.id
      WHERE vs.patient_id = ?
      ORDER BY vs.created_at DESC
      LIMIT 1
    `)
  }
}

export function getPrescriptionQueries() {
  ensureDatabaseInitialized()
  const database = getDatabase()
  
  return {
    create: database.prepare(`
      INSERT INTO prescriptions (id, patient_id, doctor_id, emergency_request_id, medication_name, 
                               dosage, frequency, duration, instructions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    findByPatient: database.prepare(`
      SELECT p.*, d.name as doctor_name
      FROM prescriptions p
      JOIN users d ON p.doctor_id = d.id
      WHERE p.patient_id = ?
      ORDER BY p.created_at DESC
    `),
    
    updateStatus: database.prepare(`
      UPDATE prescriptions SET status = ? WHERE id = ?
    `)
  }
}

export function getTrainQueries() {
  ensureDatabaseInitialized()
  const database = getDatabase()
  
  return {
    findAll: database.prepare(`
      SELECT * FROM trains ORDER BY name
    `),
    
    findById: database.prepare(`
      SELECT * FROM trains WHERE id = ?
    `),
    
    updateLocation: database.prepare(`
      UPDATE trains SET current_location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)
  }
}