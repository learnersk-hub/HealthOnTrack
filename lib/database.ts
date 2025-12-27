// Database abstraction layer - automatically switches between local SQLite and serverless

// Check if we're in a serverless environment
const isServerless = !!(
  process.env.NETLIFY || 
  process.env.AWS_LAMBDA_FUNCTION_NAME || 
  process.env.VERCEL
)

// Import the appropriate database module
let dbModule: any = null

function getDbModule() {
  if (!dbModule) {
    if (isServerless) {
      dbModule = require('./database-serverless')
    } else {
      try {
        dbModule = require('./database-local')
      } catch (error) {
        console.warn('Local database not available, falling back to serverless')
        dbModule = require('./database-serverless')
      }
    }
  }
  return dbModule
}

// Re-export all database functions
export function initializeDatabase() {
  const db = getDbModule()
  return db.initializeDatabase()
}

export function ensureDatabaseInitialized() {
  const db = getDbModule()
  return db.ensureDatabaseInitialized()
}

export function getUserQueries() {
  const db = getDbModule()
  return db.getUserQueries()
}

export function getEmergencyQueries() {
  const db = getDbModule()
  return db.getEmergencyQueries()
}

export function getMessageQueries() {
  const db = getDbModule()
  return db.getMessageQueries()
}

export function getVitalQueries() {
  const db = getDbModule()
  return db.getVitalQueries()
}

export function getPrescriptionQueries() {
  const db = getDbModule()
  return db.getPrescriptionQueries()
}

export function getTrainQueries() {
  const db = getDbModule()
  return db.getTrainQueries()
}