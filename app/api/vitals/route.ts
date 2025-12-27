import { NextRequest, NextResponse } from 'next/server'
import { getVitalQueries } from '@/lib/database'
import { generateId } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const {
      patientId,
      emergencyRequestId,
      heartRate,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      temperature,
      oxygenSaturation,
      respiratoryRate,
      recordedBy
    } = await request.json()

    if (!patientId || !recordedBy) {
      return NextResponse.json(
        { message: 'Patient ID and recorded by are required' },
        { status: 400 }
      )
    }

    // Generate vital signs ID
    const vitalId = generateId('vital_')

    // Create vital signs record
    const vitalQueries = getVitalQueries()
    vitalQueries.create.run(
      vitalId,
      patientId,
      emergencyRequestId || null,
      heartRate || null,
      bloodPressureSystolic || null,
      bloodPressureDiastolic || null,
      temperature || null,
      oxygenSaturation || null,
      respiratoryRate || null,
      recordedBy
    )

    // Return the created vital signs record
    const vitalSigns = vitalQueries.findByPatient.get(patientId)
    return NextResponse.json(vitalSigns, { status: 201 })

  } catch (error) {
    console.error('Vital signs creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const latest = searchParams.get('latest')

    if (!patientId) {
      return NextResponse.json(
        { message: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const vitalQueries = getVitalQueries()

    if (latest === 'true') {
      // Get latest vital signs for patient
      const vitals = vitalQueries.findLatestByPatient.get(patientId)
      return NextResponse.json(vitals)
    } else {
      // Get all vital signs for patient
      const vitals = vitalQueries.findByPatient.all(patientId)
      return NextResponse.json(vitals)
    }

  } catch (error) {
    console.error('Vital signs fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}