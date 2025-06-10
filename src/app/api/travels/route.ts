import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { destination, departureTime, maxPassengers, preferredMode } = await request.json();

    // Validate required fields
    if (!destination || !departureTime || !preferredMode || preferredMode.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, return a mock success response
    // Later you can integrate with your database
    const travel = {
      id: Date.now().toString(),
      destination,
      departureTime,
      maxPassengers,
      preferredMode,
      userId: 'mock-user-id',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      travel 
    });

  } catch (error) {
    console.error('Error creating travel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return mock travels for now
    const travels = [
      {
        id: '1',
        destination: 'Airport',
        departureTime: '2025-06-11T10:00:00',
        maxPassengers: 4,
        currentPassengers: 2,
        preferredMode: ['Cab'],
        user: {
          id: '1',
          name: 'John Doe',
          photo: null,
          mobile: '+91 9876543210'
        }
      }
    ];

    return NextResponse.json({ travels });
  } catch (error) {
    console.error('Error fetching travels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
