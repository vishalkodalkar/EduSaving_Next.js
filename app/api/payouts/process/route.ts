import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {

  try {

    const { payoutId } = await req.json();

    const payout = await prisma.payout.findUnique({
      where: { id: payoutId }
    });

    if (!payout) {
      return NextResponse.json(
        { message: "Payout not found" },
        { status: 404 }
      );
    }

    // Razorpay payout
    await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_ACCOUNT!,
      amount: payout.amount * 100,
      currency: "INR",
      mode: "IMPS",
      purpose: "payout",
      fund_account: {
        account_type: "bank_account",
        bank_account: {
          name: "Seller",
          ifsc: "HDFC000000",
          account_number: "123456789"
        },
        contact: {
          name: "Seller",
          email: "seller@email.com",
          type: "vendor"
        }
      }
    });

    // Deduct wallet
    await prisma.sellerWallet.update({
      where: { sellerId: payout.sellerId },
      data: {
        balance: {
          decrement: payout.amount
        }
      }
    });

    await prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: "COMPLETED"
      }
    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Payout failed" },
      { status: 500 }
    );

  }
}