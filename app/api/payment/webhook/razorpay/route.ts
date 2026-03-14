export const config = {
  api: {
    bodyParser: false
  }
};

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {

    const rawBody = await req.text();

    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { success: false, message: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    // Example event
    const payment = event.payload.payment.entity;

    const razorpay_payment_id = payment.id;
    const razorpay_order_id = payment.order_id;

    if (event.event === "payment.captured") {

      console.log("Payment captured:", razorpay_payment_id);

      // You can now trigger your order creation logic
      // Example: call a service that handles order creation

    }

    return NextResponse.json({ received: true });

  } catch (error) {

    console.error("Webhook error:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}