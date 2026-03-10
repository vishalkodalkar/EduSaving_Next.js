import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description
      }
    });

    return NextResponse.json({
      success: true,
      data: category
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "Category creation failed"
    });
  }
}