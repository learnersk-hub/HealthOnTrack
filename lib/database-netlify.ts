// Netlify-compatible database configuration
// Uses in-memory storage for demo purposes on serverless platforms

interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: 'passenger' | 'attendant' | 'doctor' | 'admin'
  train_id?: string
  created_at: string
  updated_at: string
}

interface EmergencyRequest {
  id: string
  passenger_id: string
  train_id: string
  type: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  location?: string
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
  assigned_to?: string
  response?: string
  created_at: string
  updated_at: string
}

interface Prescription {
  id: string
  patient_id: string
  doctor_id: string
  emergency_request_id?: string
  medication_name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
}

// In-memory storage (for demo purposes)
const inMemoryDB = {
  users: [] as User[],
  emergencyRequests: [] as EmergencyRequest[],
  prescriptions: [] as Prescription[],
  vitals: [] as any[],
  messages: []
}