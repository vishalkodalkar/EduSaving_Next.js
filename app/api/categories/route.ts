import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import Category from "@/models/category.model";

export async function GET() {
  await prisma.$connect();

  try {
    const categories = await Category.find({ isActive: true });

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
}