// Database type definitions

export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: 'passenger' | 'attendant' | 'doctor' | 'admin'
  train_id?: string
  created_at: string
  updated_at: string
}

export interface EmergencyRequest {
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

export interface Prescription {
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
  doctor_name?: string // From JOIN with users table
}

export interface PrescriptionWithDoctor extends Prescription {
  doctor_name: string
}

export interface VitalSigns {
  id: string
  passenger_id: string
  heart_rate?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  temperature?: number
  oxygen_saturation?: number
  respiratory_rate?: number
  recorded_at: string
  recorded_by?: string
}

export interface Train {
  id: string
  name: string
  route: string
  current_location?: string
  status: 'active' | 'maintenance' | 'inactive'
  medical_equipment?: string // JSON string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id?: string
  emergency_request_id?: string
  content: string
  message_type: 'text' | 'image' | 'file'
  is_read: boolean
  created_at: string
}