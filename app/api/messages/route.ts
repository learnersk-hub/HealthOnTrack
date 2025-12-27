import { NextRequest, NextResponse } from 'next/server'
import { getMessageQueries } from '@/lib/database'
import { generateId } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { emergencyRequestId, senderId, message, messageType = 'text' } = await request.json()

    if (!emergencyRequestId || !senderId || !message) {
      return NextResponse.json(
        { message: 'Emergency request ID, sender ID, and message are required' },
        { status: 400 }
      )
    }

    // Generate message ID
    const messageId = generateId('msg_')

    // Create message
    const messageQueries = getMessageQueries()
    messageQueries.create.run(messageId, emergencyRequestId, senderId, message, messageType)

    // Return the created message with sender info
    const messages = messageQueries.findByEmergencyRequest.all(emergencyRequestId)
    const newMessage = messages.find(m => m.id === messageId)
    
    return NextResponse.json(newMessage, { status: 201 })

  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const emergencyRequestId = searchParams.get('emergencyRequestId')

    if (!emergencyRequestId) {
      return NextResponse.json(
        { message: 'Emergency request ID is required' },
        { status: 400 }
      )
    }

    // Get all messages for emergency request
    const messageQueries = getMessageQueries()
    const messages = messageQueries.findByEmergencyRequest.all(emergencyRequestId)
    return NextResponse.json(messages)

  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}