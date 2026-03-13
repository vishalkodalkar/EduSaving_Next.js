import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/services/checkoutSession.service";

export async function POST(req: Request) {
  try {

    const { userId, pincode } = await req.json();

    const session = await createCheckoutSession(userId, pincode);

    return NextResponse.json({
      success: true,
      data: session
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      message: error.message
    });

  }
}