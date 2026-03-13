import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return NextResponse.json({
    success: true,
    data: order
  });
}