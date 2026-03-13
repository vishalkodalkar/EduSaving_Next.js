import crypto from "crypto";
import { NextResponse } from "next/server";
import { completeCheckout } from "@/lib/services/order.service";

export async function POST(req: Request) {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({
        success: false,
        message: "Payment verification failed"
      });
    }

    const order = await completeCheckout(userId);

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