import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { sellerId } = await req.json();

  const data = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId
      }
    },
    include: {
      order: true
    }
  });

  const monthly: Record<string, number> = {};

  data.forEach((item) => {

    const month = item.order.createdAt.toISOString().slice(0, 7);

    if (!monthly[month]) {
      monthly[month] = 0;
    }

    monthly[month] += item.sellerRevenue;
  });

  return NextResponse.json({
    success: true,
    monthly
  });
}