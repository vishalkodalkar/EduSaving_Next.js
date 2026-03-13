import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { pincode } = await req.json();

  const service = await prisma.pincodeService.findUnique({
    where: { pincode }
  });

  if (!service) {

    return NextResponse.json({
      available: false,
      message: "Delivery not available"
    });

  }

  return NextResponse.json({
    available: service.deliveryAvailable,
    cod: service.codAvailable,
    deliveryDays: service.deliveryDays
  });

}