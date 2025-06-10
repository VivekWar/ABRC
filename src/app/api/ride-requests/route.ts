import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendRideRequestEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { travelId } = await request.json();

    // Get travel details with owner info
    const travel = await prisma.travel.findUnique({
      where: { id: travelId },
      include: {
        user: true
      }
    });

    if (!travel) {
      return NextResponse.json({ error: 'Travel not found' }, { status: 404 });
    }

    // Get requester info
    const requester = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    // Create ride request
    const rideRequest = await prisma.rideRequest.create({
      data: {
        travelId,
        userId: decoded.userId
      }
    });

    // Send email notification
    if (travel.user.email && requester) {
      await sendRideRequestEmail(
        travel.user.email,
        travel.user.name,
        requester.name,
        travel.destination,
        travel.departureTime.toISOString()
      );
    }

    return NextResponse.json({ rideRequest });
  } catch (error) {
    console.error('Error creating ride request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
