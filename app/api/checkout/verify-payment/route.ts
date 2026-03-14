import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import crypto from "crypto";

const PLATFORM_COMMISSION = 0.10; // 10%

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      checkoutSessionId
    } = body;

    // ----------------------------
    // 1. VERIFY RAZORPAY SIGNATURE
    // ----------------------------

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // ----------------------------
    // 2. FETCH ACTIVE RESERVATIONS
    // ----------------------------

    const reservations = await prisma.stockReservation.findMany({
      where: {
        checkoutSessionId,
        status: "ACTIVE"
      }
    });

    if (!reservations.length) {
      return NextResponse.json(
        { success: false, message: "No reservations found" },
        { status: 404 }
      );
    }

    // ----------------------------
    // 3. CALCULATE ORDER TOTAL
    // ----------------------------

    let total = 0;

    const products = [];

    for (const r of reservations) {

      const product = await prisma.product.findUnique({
        where: { id: r.productId }
      });

      if (!product) continue;

      const subtotal = product.price * r.quantity;

      total += subtotal;

      products.push({
        reservation: r,
        product
      });
    }

    // ----------------------------
    // 4. CREATE ORDER
    // ----------------------------

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        paymentId: razorpay_payment_id,
        paymentStatus: "PAID",
        status: "CONFIRMED"
      }
    });

    // ----------------------------
    // 5. CREATE ORDER ITEMS
    // ----------------------------

    for (const item of products) {

      const commission = item.product.price * PLATFORM_COMMISSION;

      const sellerRevenue = item.product.price - commission;

      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.product.id,
          quantity: item.reservation.quantity,
          price: item.product.price,
          commission,
          sellerRevenue
        }
      });

      const sellerId = item.product.sellerId;

      // ----------------------------
      // 6. UPDATE SELLER WALLET
      // ----------------------------

      await prisma.sellerWallet.upsert({
        where: { sellerId },
        update: {
          balance: {
            increment: sellerRevenue * item.reservation.quantity
          }
        },
        create: {
          sellerId,
          balance: sellerRevenue * item.reservation.quantity
        }
      });

      // ----------------------------
      // 7. WALLET TRANSACTION
      // ----------------------------

      await prisma.walletTransaction.create({
        data: {
          sellerId,
          orderId: order.id,
          amount: sellerRevenue * item.reservation.quantity,
          type: "CREDIT"
        }
      });

      // ----------------------------
      // 8. MARK RESERVATION COMPLETE
      // ----------------------------

      await prisma.stockReservation.update({
        where: { id: item.reservation.id },
        data: { status: "COMPLETED" }
      });

    }

    // ----------------------------
    // 9. CLEAR USER CART
    // ----------------------------

    const cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order created",
      orderId: order.id
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}