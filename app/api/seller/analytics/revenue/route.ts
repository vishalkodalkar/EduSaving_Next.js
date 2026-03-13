import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { sellerId } = await req.json();

  const revenue = await prisma.orderItem.aggregate({
    where: {
      product: {
        sellerId: sellerId
      }
    },
    _sum: {
      sellerRevenue: true
    },
    _count: {
      id: true
    }
  });

  return NextResponse.json({
    success: true,
    totalRevenue: revenue._sum.sellerRevenue || 0,
    totalOrders: revenue._count.id
  });
}