import { NextResponse } from "next/server";
import { completeCheckout } from "@/lib/services/checkout.service";


export async function POST(req: Request) {

  try {

    const { userId, pincode } = await req.json();

    // Validate required fields
    if (!userId || !pincode) {
      return NextResponse.json({
        success: false,
        message: "userId and pincode are required"
      });
    }

    const order = await  completeCheckout(userId, pincode);

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