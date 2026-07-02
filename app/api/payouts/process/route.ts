import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Seller payouts will be implemented in Phase 4 using RazorpayX."
    },
    { status: 501 }
  );
}