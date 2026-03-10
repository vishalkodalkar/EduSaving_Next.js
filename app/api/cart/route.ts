import { NextResponse } from "next/server";
import { calculateCart } from "@/lib/services/cart.service";

export async function POST(req: Request) {

  const { userId } = await req.json();

  const cart = await calculateCart(userId);

  return NextResponse.json({
    success: true,
    data: cart
  });
}