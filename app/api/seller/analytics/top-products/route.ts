import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { sellerId } = await req.json();

  const products = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      product: {
        sellerId
      }
    },
    _sum: {
      quantity: true
    },
    orderBy: {
      _sum: {
        quantity: "desc"
      }
    },
    take: 5
  });

  return NextResponse.json({
    success: true,
    products
  });
}