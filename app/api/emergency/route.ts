import { NextRequest, NextResponse } from 'next/server'
import { getEmergencyQueries } from '@/lib/database'
import { generateId } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { passengerId, trainId, description, severity, location } = await request.json()

    if (!passengerId || !trainId || !description || !severity) {
      return NextResponse.json(
        { message: 'Passenger ID, train ID, description, and severity are required' },
        { status: 400 }
      )
    }

    // Validate severity
    const validSeverities = ['low', 'medium', 'high', 'critical']
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { message: 'Invalid severity level' },
        { status: 400 }
      )
    }

    // Generate emergency request ID
    const emergencyId = generateId('emr_')

    // Create emergency request
    const emergencyQueries = getEmergencyQueries()
    emergencyQueries.create.run(emergencyId, passengerId, trainId, description, severity, location || null)

    // Return the created emergency request
    const emergencyRequest = emergencyQueries.findById.get(emergencyId)
    return NextResponse.json(emergencyRequest, { status: 201 })

  } catch (error) {
    console.error('Emergency request creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const passengerId = searchParams.get('passengerId')
    const status = searchParams.get('status')

    const emergencyQueries = getEmergencyQueries()

    if (passengerId) {
      // Get emergency requests for a specific passenger
      const requests = emergencyQueries.findByPassenger.all(passengerId)
      return NextResponse.json(requests)
    } else if (status === 'pending') {
      // Get all pending emergency requests (for attendants/doctors)
      const requests = emergencyQueries.findPending.all()
      return NextResponse.json(requests)
    } else {
      return NextResponse.json(
        { message: 'Invalid query parameters' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Emergency request fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}