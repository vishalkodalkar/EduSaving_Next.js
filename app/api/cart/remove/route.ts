import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {

  const { cartItemId } = await req.json();

  await prisma.cartItem.delete({
    where: { id: cartItemId }
  });

  return NextResponse.json({
    success: true,
    message: "Item removed"
  });
}