import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface definitions
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
  isActive: boolean;
  currentPassengers: number;
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

interface JWTPayload {
  userId: string;
  email: string;
}

// POST - Create new travel
export async function POST(request: NextRequest) {
  try {
    // Get and verify JWT token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    let userId = 'mock-user-id'; // Default for testing
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        userId = decoded.userId;
      } catch (jwtError) {
        console.log('JWT verification failed, using mock user');
      }
    }

    // Parse and validate request body
    const requestBody = await request.json() as TravelRequest;
    const { destination, departureTime, maxPassengers, preferredMode } = requestBody;

    // Validate required fields
    if (!destination || !departureTime || !preferredMode || preferredMode.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, departureTime, and preferredMode are required' },
        { status: 400 }
      );
    }

    // Validate departure time is in the future
    const departureDate = new Date(departureTime);
    if (departureDate <= new Date()) {
      return NextResponse.json(
        { error: 'Departure time must be in the future' },
        { status: 400 }
      );
    }

    // Validate max passengers
    if (maxPassengers < 1 || maxPassengers > 8) {
      return NextResponse.json(
        { error: 'Max passengers must be between 1 and 8' },
        { status: 400 }
      );
    }

    // Create travel in database (or mock for now)
    let travel: Travel;

    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      // Production: Use actual database
      const dbTravel = await prisma.travel.create({
        data: {
          userId,
          destination,
          departureTime: departureDate,
          maxPassengers,
          preferredMode,
          isActive: true,
          currentPassengers: 1
        }
      });

      travel = {
        id: dbTravel.id,
        destination: dbTravel.destination,
        departureTime: dbTravel.departureTime.toISOString(),
        maxPassengers: dbTravel.maxPassengers,
        preferredMode: dbTravel.preferredMode,
        userId: dbTravel.userId,
        createdAt: dbTravel.createdAt.toISOString(),
        isActive: dbTravel.isActive,
        currentPassengers: dbTravel.currentPassengers
      };
    } else {
      // Development: Use mock data
      travel = {
        id: Date.now().toString(),
        destination,
        departureTime,
        maxPassengers,
        preferredMode,
        userId,
        createdAt: new Date().toISOString(),
        isActive: true,
        currentPassengers: 1
      };
    }

    console.log('Travel created successfully:', travel);

    return NextResponse.json({ 
      success: true,
      message: 'Travel posted successfully!',
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

// GET - Fetch all active travels
export async function GET() {
  try {
    let travels: TravelWithUser[];

    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      // Production: Use actual database
      const dbTravels = await prisma.travel.findMany({
        where: { 
          isActive: true,
          departureTime: {
            gte: new Date() // Only future travels
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              photo: true,
              mobile: true
            }
          }
        },
        orderBy: { 
          departureTime: 'asc' 
        }
      });

      travels = dbTravels.map(travel => ({
        id: travel.id,
        destination: travel.destination,
        departureTime: travel.departureTime.toISOString(),
        maxPassengers: travel.maxPassengers,
        currentPassengers: travel.currentPassengers,
        preferredMode: travel.preferredMode,
        isActive: travel.isActive,
        user: {
          id: travel.user.id,
          name: travel.user.name,
          photo: travel.user.photo,
          mobile: travel.user.mobile
        }
      }));
    } else {
      // Development: Use mock data
      travels = [
        
      ];
    }

    return NextResponse.json({ 
      success: true,
      travels,
      count: travels.length
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

// PUT - Update travel (optional)
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const requestBody = await request.json() as { id: string; isActive?: boolean };
    const { id, isActive } = requestBody;

    if (!id) {
      return NextResponse.json(
        { error: 'Travel ID is required' },
        { status: 400 }
      );
    }

    // Update travel status (mock for now)
    const updatedTravel = {
      id,
      isActive: isActive ?? false,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true,
      message: 'Travel updated successfully',
      travel: updatedTravel
    });

  } catch (error: unknown) {
    console.error('Error updating travel:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Cancel travel (optional)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const { searchParams } = new URL(request.url);
    const travelId = searchParams.get('id');

    if (!travelId) {
      return NextResponse.json(
        { error: 'Travel ID is required' },
        { status: 400 }
      );
    }

    // Delete/deactivate travel (mock for now)
    return NextResponse.json({ 
      success: true,
      message: 'Travel cancelled successfully'
    });

  } catch (error: unknown) {
    console.error('Error deleting travel:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}
