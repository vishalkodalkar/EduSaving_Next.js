import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productId } = await req.json();

  const product = await prisma.product.update({
    where: { id: productId },
    data: { status: "APPROVED" }
  });

  return NextResponse.json(product);
}