import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pincode } = await req.json();

    const service = await prisma.pincodeZone.findUnique({
      where: { pincode }
    });

    if (!service) {
      return NextResponse.json({
        available: false,
        message: "Delivery not available"
      });
    }

    const zone = await prisma.deliveryZone.findUnique({
      where: {
        id: service.zoneId
      }
    });

    if (!zone) {
      return NextResponse.json({
        available: false,
        message: "Delivery zone not found"
      });
    }

    return NextResponse.json({
      available: zone.deliveryAvailable,
      cod: zone.codAvailable,
      deliveryDays: zone.deliveryDays
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        available: false,
        message: error.message
      },
      { status: 500 }
    );
  }
}