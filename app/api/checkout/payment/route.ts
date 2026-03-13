import { NextResponse } from "next/server";
import { createPayment } from "@/lib/services/checkout.service";

export async function POST(req: Request) {

  try {

    const { userId } = await req.json();

    const payment = await createPayment(userId);

    return NextResponse.json({
      success: true,
      data: payment
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      message: error.message
    });

  }

}