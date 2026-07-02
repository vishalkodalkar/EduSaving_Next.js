import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { trackingNumber } = await request.json();

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: "SHIPPED",
        trackingNumber,
        shippedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}