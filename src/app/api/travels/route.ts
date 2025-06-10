import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const travels = await prisma.travel.findMany({
      where: { isActive: true },
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
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ travels });
  } catch (error) {
    console.error('Error fetching travels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { destination, departureTime, maxPassengers, preferredMode } = await request.json();

    const travel = await prisma.travel.create({
      data: {
        userId: decoded.userId,
        destination,
        departureTime: new Date(departureTime),
        maxPassengers,
        preferredMode
      }
    });

    return NextResponse.json({ travel });
  } catch (error) {
    console.error('Error creating travel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
