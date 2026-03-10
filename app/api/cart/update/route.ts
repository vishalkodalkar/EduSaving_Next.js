import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {

  const { cartItemId, quantity } = await req.json();

  const item = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity }
  });

  return NextResponse.json({
    success: true,
    data: item
  });
}