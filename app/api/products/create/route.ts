import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      price,
      images,
      stock,
      categoryId,
      sellerId
    } = body;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        images,
        stock,
        categoryId,
        sellerId
      }
    });

    return NextResponse.json(product);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Product creation failed" },
      { status: 500 }
    );
  }
}