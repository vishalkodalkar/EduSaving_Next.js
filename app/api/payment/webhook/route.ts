import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  const body = await req.text();

  const signature = req.headers.get("x-razorpay-signature")!;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ success: false });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {

    const paymentId = event.payload.payment.entity.id;

    const orderId = event.payload.payment.entity.notes.orderId;

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId,
        paymentStatus: "SUCCESS",
        status: "CONFIRMED"
      }
    });

  }

  return NextResponse.json({ received: true });
}