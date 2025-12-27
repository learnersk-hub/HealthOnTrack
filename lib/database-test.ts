// Simple test to verify database abstraction works
import { getUserQueries, initializeDatabase } from './database'

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    
    // Initialize database
    initializeDatabase()
    
    // Test user queries
    const userQueries = getUserQueries()
    console.log('Database connection successful!')
    console.log('User queries available:', Object.keys(userQueries))
    
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Export for testing
export { getUserQueries, initializeDatabase }