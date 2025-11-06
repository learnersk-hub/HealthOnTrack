import { NextRequest, NextResponse } from 'next/server'
import { getPrescriptionQueries } from '@/lib/database'
import { generateId } from '@/lib/auth-utils'
import type { PrescriptionWithDoctor } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patientId,
      doctorId,
      emergencyRequestId,
      medicationName,
      dosage,
      frequency,
      duration,
      instructions
    } = body

    // Validate required fields
    if (!patientId || !doctorId || !medicationName || !dosage || !frequency || !duration) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Patient ID, doctor ID, medication name, dosage, frequency, and duration are required' 
        },
        { status: 400 }
      )
    }

    // Validate field types and formats
    if (typeof patientId !== 'string' || typeof doctorId !== 'string' || 
        typeof medicationName !== 'string' || typeof dosage !== 'string' ||
        typeof frequency !== 'string' || typeof duration !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid field types provided' 
        },
        { status: 400 }
      )
    }

    // Generate prescription ID
    const prescriptionId = generateId('rx_')

    // Create prescription
    const prescriptionQueries = getPrescriptionQueries()
    prescriptionQueries.create.run(
      prescriptionId,
      patientId,
      doctorId,
      emergencyRequestId || null,
      medicationName,
      dosage,
      frequency,
      duration,
      instructions || null
    )

    // Return the created prescription with doctor info
    const prescriptions = prescriptionQueries.findByPatient.all(patientId) as PrescriptionWithDoctor[]
    const newPrescription = prescriptions.find(p => p.id === prescriptionId)

    if (!newPrescription) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to retrieve created prescription' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newPrescription
    }, { status: 201 })

  } catch (error) {
    console.error('Prescription creation error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    if (!patientId) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Patient ID is required' 
        },
        { status: 400 }
      )
    }

    // Validate patientId format
    if (typeof patientId !== 'string' || patientId.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid patient ID format' 
        },
        { status: 400 }
      )
    }

    // Get all prescriptions for patient
    const prescriptionQueries = getPrescriptionQueries()
    const prescriptions = prescriptionQueries.findByPatient.all(patientId.trim()) as PrescriptionWithDoctor[]
    
    return NextResponse.json({
      success: true,
      data: prescriptions,
      count: prescriptions.length
    })

  } catch (error) {
    console.error('Prescriptions fetch error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}