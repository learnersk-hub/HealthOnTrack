// Serverless-compatible database layer for Netlify
// Uses in-memory storage for demo purposes

import type { User, EmergencyRequest, Prescription, VitalSigns, Message } from '@/types/database'

// In-memory storage (resets on each function invocation)
let inMemoryDB = {
  users: [] as User[],
  emergencyRequests: [] as EmergencyRequest[],
  prescriptions: [] as Prescription[],
  vitals: [] as VitalSigns[],
  messages: [] as Message[],
}

// Initialize with some demo data
function initializeDemoData() {
  if (inMemoryDB.users.length === 0) {
    // Add demo users
    inMemoryDB.users = [
      {
        id: 'user_demo_passenger',
        name: 'John Doe',
        email: 'passenger@demo.com',
        password_hash: '$2b$10$demo.hash.for.password123', // Demo hash
        role: 'passenger',
        train_id: 'TR-001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'user_demo_doctor',
        name: 'Dr. Smith',
        email: 'doctor@demo.com',
        password_hash: '$2b$10$demo.hash.for.password123',
        role: 'doctor',
        train_id: 'TR-001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }
}

// User queries
export function getUserQueries() {
  initializeDemoData()
  
  return {
    create: {
      run: (id: string, name: string, email: string, passwordHash: string, role: string, trainId?: string) => {
        const user: User = {
          id,
          name,
          email,
          password_hash: passwordHash,
          role: role as User['role'],
          train_id: trainId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        inMemoryDB.users.push(user)
        return user
      }
    },
    findByEmail: {
      get: (email: string) => {
        return inMemoryDB.users.find(user => user.email === email)
      }
    },
    updateLastLogin: {
      run: (id: string) => {
        const user = inMemoryDB.users.find(u => u.id === id)
        if (user) {
          user.updated_at = new Date().toISOString()
        }
      }
    }
  }
}

// Emergency queries
export function getEmergencyQueries() {
  return {
    create: {
      run: (id: string, passengerId: string, trainId: string, description: string, severity: string, location?: string) => {
        const emergency: EmergencyRequest = {
          id,
          passenger_id: passengerId,
          train_id: trainId,
          type: 'medical',
          description,
          severity: severity as EmergencyRequest['severity'],
          location,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        inMemoryDB.emergencyRequests.push(emergency)
        return emergency
      }
    },
    findById: {
      get: (id: string) => {
        return inMemoryDB.emergencyRequests.find(req => req.id === id)
      }
    },
    findByPassenger: {
      all: (passengerId: string) => {
        return inMemoryDB.emergencyRequests.filter(req => req.passenger_id === passengerId)
      }
    },
    findPending: {
      all: () => {
        return inMemoryDB.emergencyRequests.filter(req => req.status === 'pending')
      }
    },
    updateStatus: {
      run: (status: string, assignedAttendantId?: string, assignedDoctorId?: string, id?: string) => {
        const emergency = inMemoryDB.emergencyRequests.find(req => req.id === id)
        if (emergency) {
          emergency.status = status as EmergencyRequest['status']
          emergency.assigned_to = assignedAttendantId || assignedDoctorId
          emergency.updated_at = new Date().toISOString()
        }
      }
    }
  }
}

// Prescription queries
export function getPrescriptionQueries() {
  return {
    create: {
      run: (id: string, patientId: string, doctorId: string, emergencyRequestId: string | null, medicationName: string, dosage: string, frequency: string, duration: string, instructions: string | null) => {
        const prescription: Prescription = {
          id,
          patient_id: patientId,
          doctor_id: doctorId,
          emergency_request_id: emergencyRequestId || undefined,
          medication_name: medicationName,
          dosage,
          frequency,
          duration,
          instructions: instructions || undefined,
          status: 'active',
          created_at: new Date().toISOString()
        }
        inMemoryDB.prescriptions.push(prescription)
        return prescription
      }
    },
    findByPatient: {
      all: (patientId: string) => {
        return inMemoryDB.prescriptions
          .filter(p => p.patient_id === patientId)
          .map(p => ({
            ...p,
            doctor_name: inMemoryDB.users.find(u => u.id === p.doctor_id)?.name || 'Unknown Doctor'
          }))
      }
    }
  }
}

// Vital signs queries
export function getVitalQueries() {
  return {
    create: {
      run: (id: string, patientId: string, emergencyRequestId: string | null, heartRate: number | null, bloodPressureSystolic: number | null, bloodPressureDiastolic: number | null, temperature: number | null, oxygenSaturation: number | null, respiratoryRate: number | null, recordedBy: string) => {
        const vital: VitalSigns = {
          id,
          passenger_id: patientId,
          heart_rate: heartRate || undefined,
          blood_pressure_systolic: bloodPressureSystolic || undefined,
          blood_pressure_diastolic: bloodPressureDiastolic || undefined,
          temperature: temperature || undefined,
          oxygen_saturation: oxygenSaturation || undefined,
          respiratory_rate: respiratoryRate || undefined,
          recorded_at: new Date().toISOString(),
          recorded_by: recordedBy
        }
        inMemoryDB.vitals.push(vital)
        return vital
      }
    },
    findByPatient: {
      get: (patientId: string) => {
        return inMemoryDB.vitals.find(v => v.passenger_id === patientId)
      },
      all: (patientId: string) => {
        return inMemoryDB.vitals.filter(v => v.passenger_id === patientId)
      }
    },
    findLatestByPatient: {
      get: (patientId: string) => {
        const vitals = inMemoryDB.vitals
          .filter(v => v.passenger_id === patientId)
          .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
        return vitals[0] || null
      }
    }
  }
}

// Message queries
export function getMessageQueries() {
  return {
    create: {
      run: (id: string, emergencyRequestId: string, senderId: string, message: string, messageType: string) => {
        const msg: Message = {
          id,
          sender_id: senderId,
          emergency_request_id: emergencyRequestId,
          content: message,
          message_type: messageType as Message['message_type'],
          is_read: false,
          created_at: new Date().toISOString()
        }
        inMemoryDB.messages.push(msg)
        return msg
      }
    },
    findByEmergencyRequest: {
      all: (emergencyRequestId: string) => {
        return inMemoryDB.messages
          .filter(m => m.emergency_request_id === emergencyRequestId)
          .map(m => ({
            ...m,
            sender_name: inMemoryDB.users.find(u => u.id === m.sender_id)?.name || 'Unknown User'
          }))
      }
    }
  }
}

// Train queries
export function getTrainQueries() {
  return {
    findAll: {
      all: () => {
        return [
          {
            id: 'TR-001',
            name: 'Express Medical Train',
            route: 'Mumbai - Delhi',
            current_location: 'Bhopal Junction',
            status: 'active',
            medical_equipment: JSON.stringify(['AED', 'Oxygen Tank', 'First Aid Kit', 'Blood Pressure Monitor']),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }
    }
  }
}

// Initialize database (no-op for serverless)
export function initializeDatabase() {
  initializeDemoData()
  return true
}

// Ensure database is initialized (no-op for serverless)
export function ensureDatabaseInitialized() {
  initializeDemoData()
  return true
}