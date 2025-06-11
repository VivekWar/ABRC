import { NextRequest, NextResponse } from 'next/server';

interface TravelRequest {
  destination: string;
  departureTime: string;
  maxPassengers: number;
  preferredMode: string[];
}

interface TravelWithUser {
  id: string;
  destination: string;
  departureTime: string;
  maxPassengers: number;
  currentPassengers: number;
  preferredMode: string[];
  isActive: boolean;
  user: {
    id: string;
    name: string;
    photo: string | null;
    mobile: string | null;
  };
}

// Use a global variable that persists across requests in development
let globalTravels: TravelWithUser[] = [];

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/travels called'); // Debug log
    
    const requestBody = await request.json() as TravelRequest;
    const { destination, departureTime, maxPassengers, preferredMode } = requestBody;

    console.log('Request data:', { destination, departureTime, maxPassengers, preferredMode }); // Debug log

    // Validate required fields
    if (!destination || !departureTime || !preferredMode || preferredMode.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, departureTime, and preferredMode are required' },
        { status: 400 }
      );
    }

    // Create new travel
    const newTravel: TravelWithUser = {
      id: Date.now().toString(),
      destination,
      departureTime,
      maxPassengers,
      preferredMode,
      isActive: true,
      currentPassengers: 1,
      user: {
        id: 'current-user',
        name: 'Current User',
        photo: null,
        mobile: '+91 9876543213'
      }
    };

    // Add to global travels array
    globalTravels.unshift(newTravel); // Add to beginning of array

    console.log('New travel created:', newTravel); // Debug log
    console.log('Total travels now:', globalTravels.length); // Debug log

    return NextResponse.json({ 
      success: true,
      message: 'Travel posted successfully!',
      travel: newTravel,
      totalTravels: globalTravels.length
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
    console.log('GET /api/travels called'); // Debug log
    console.log('Current travels:', globalTravels.length); // Debug log

    // Filter only future travels
    const now = new Date();
    const activeTravels = globalTravels.filter(travel => {
      const departureDate = new Date(travel.departureTime);
      return travel.isActive && departureDate > now;
    });

    console.log('Active travels:', activeTravels.length); // Debug log

    return NextResponse.json({ 
      success: true,
      travels: activeTravels,
      count: activeTravels.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Error fetching travels:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}
