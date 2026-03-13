import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { sellerId } = await req.json();

  const orders = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId: sellerId
      }
    },
    include: {
      order: true,
      product: true
    }
  });

  return NextResponse.json({
    success: true,
    data: orders
  });
}