import { NextResponse } from "next/server";
import { checkout } from "@/lib/services/checkout.service";

export async function POST(req: Request) {

  try {

    const { userId } = await req.json();

    const order = await checkout(userId);

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}