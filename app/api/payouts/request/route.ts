import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {

  try {

    const { sellerId, amount } = await req.json();

    const wallet = await prisma.sellerWallet.findUnique({
      where: { sellerId }
    });

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    const payout = await prisma.payout.create({
      data: {
        sellerId,
        amount,
        status: "PENDING"
      }
    });

    return NextResponse.json({
      success: true,
      payout
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Payout request failed" },
      { status: 500 }
    );

  }
}