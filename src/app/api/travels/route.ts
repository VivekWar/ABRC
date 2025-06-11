import { NextRequest, NextResponse } from 'next/server';

interface TravelRequest {
  destination: string;
  departureTime: string;
  maxPassengers: number;
  preferredMode: string[];
}

interface Travel {
  id: string;
  destination: string;
  departureTime: string;
  maxPassengers: number;
  preferredMode: string[];
  userId: string;
  createdAt: string;
}

interface TravelWithUser {
  id: string;
  destination: string;
  departureTime: string;
  maxPassengers: number;
  currentPassengers: number;
  preferredMode: string[];
  user: {
    id: string;
    name: string;
    photo: string | null;
    mobile: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { destination, departureTime, maxPassengers, preferredMode }: TravelRequest = await request.json();

    // Validate required fields
    if (!destination || !departureTime || !preferredMode || preferredMode.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, return a mock success response
    const travel: Travel = {
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

  } catch (error: unknown) {
    console.error('Error creating travel:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return mock travels for now
    const travels: TravelWithUser[] = [
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
  } catch (error: unknown) {
    console.error('Error fetching travels:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}
