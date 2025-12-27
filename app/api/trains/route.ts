import { NextRequest, NextResponse } from 'next/server'
import { getTrainQueries } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const trainQueries = getTrainQueries()
    const trains = trainQueries.findAll.all()
    
    // Parse medical equipment JSON for each train
    const trainsWithEquipment = trains.map(train => ({
      ...train,
      medical_equipment: train.medical_equipment ? JSON.parse(train.medical_equipment) : []
    }))

    return NextResponse.json(trainsWithEquipment)

  } catch (error) {
    console.error('Trains fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}