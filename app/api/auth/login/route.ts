import { NextRequest, NextResponse } from 'next/server'
import { getUserQueries } from '@/lib/database'
import { verifyPassword } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: 'Email, password, and role are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const userQueries = getUserQueries()
    const user = userQueries.findByEmail.get(email) as any

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if role matches
    if (user.role !== role) {
      return NextResponse.json(
        { message: 'Invalid role for this user' },
        { status: 401 }
      )
    }

    // Update last login
    userQueries.updateLastLogin.run(user.id)

    // Return user data (without password)
    const { password_hash, ...userData } = user
    return NextResponse.json(userData)

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}