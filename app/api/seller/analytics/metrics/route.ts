import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { sellerId } = await req.json();

  const items = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId
      }
    }
  });

  let revenue = 0;
  let orders = items.length;

  items.forEach((item) => {
    revenue += item.sellerRevenue;
  });

  const avgOrderValue = orders > 0 ? revenue / orders : 0;

  return NextResponse.json({
    success: true,
    revenue,
    orders,
    avgOrderValue
  });
}