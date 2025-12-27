import { NextRequest, NextResponse } from 'next/server'
import { getEmergencyQueries } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const emergencyQueries = getEmergencyQueries()
    const emergencyRequest = emergencyQueries.findById.get(params.id)
    
    if (!emergencyRequest) {
      return NextResponse.json(
        { message: 'Emergency request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(emergencyRequest)

  } catch (error) {
    console.error('Emergency request fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, assignedAttendantId, assignedDoctorId } = await request.json()

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'assigned', 'in_progress', 'resolved', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update emergency request
    const emergencyQueries = getEmergencyQueries()
    emergencyQueries.updateStatus.run(
      status,
      assignedAttendantId || null,
      assignedDoctorId || null,
      params.id
    )

    // Return updated emergency request
    const updatedRequest = emergencyQueries.findById.get(params.id)
    return NextResponse.json(updatedRequest)

  } catch (error) {
    console.error('Emergency request update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}