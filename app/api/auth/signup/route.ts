import { NextRequest, NextResponse } from 'next/server'
import { getUserQueries } from '@/lib/database'
import { hashPassword, generateId } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['passenger', 'attendant', 'doctor', 'admin']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const userQueries = getUserQueries()
    const existingUser = userQueries.findByEmail.get(email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = hashPassword(password)

    // Generate user ID
    const userId = generateId('user_')

    // Assign default train ID (in a real app, this would be more sophisticated)
    const trainId = 'TR-001'

    // Create user
    userQueries.create.run(userId, name, email, passwordHash, role, trainId)

    // Return user data (without password)
    const userData = {
      id: userId,
      name,
      email,
      role,
      train_id: trainId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(userData, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}