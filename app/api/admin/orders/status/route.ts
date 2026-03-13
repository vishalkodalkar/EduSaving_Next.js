import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {

  const { orderId, status } = await req.json();

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });

  return NextResponse.json({
    success: true,
    data: order
  });
}