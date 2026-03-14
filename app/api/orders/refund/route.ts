import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {

    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Razorpay refund
    await razorpay.payments.refund(order.paymentId!);

    for (const item of order.items) {

      // Restore stock
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      });

      const sellerId = item.product.sellerId;

      const sellerAmount = item.sellerRevenue * item.quantity;

      // Deduct seller wallet
      await prisma.sellerWallet.update({
        where: { sellerId },
        data: {
          balance: {
            decrement: sellerAmount
          }
        }
      });

      // Wallet transaction
      await prisma.walletTransaction.create({
        data: {
          sellerId,
          orderId: order.id,
          amount: sellerAmount,
          type: "DEBIT"
        }
      });

    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "REFUNDED" }
    });

    return NextResponse.json({
      success: true,
      message: "Refund successful"
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Refund failed" },
      { status: 500 }
    );

  }
}