import { prisma } from "@/lib/prisma";
import { createEscrowTransaction } from "@/lib/services/escrow.service";
import { acquireLock, releaseLock } from "@/lib/services/inventoryLock.service";
import { orderQueue } from "@/lib/queue/order.queue";
import { razorpay } from "@/lib/razorpay";

const COMMISSION_RATE = 0.10;

export async function completeCheckout(userId: string, pincode: string) {

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // ✅ PINCODE DELIVERY CHECK
  const service = await prisma.pincodeZone.findUnique({
  where: { pincode }
});

if (!service) {
  throw new Error("Delivery not available in this area");
}

const zone = await prisma.deliveryZone.findUnique({
  where: {
    id: service.zoneId
  }
});

if (!zone || !zone.deliveryAvailable) {
  throw new Error("Delivery not available in this area");
}

  return await prisma.$transaction(async (tx) => {

    let total = 0;

    // 1️⃣ Validate cart items + calculate total
    for (const item of cart.items) {

      if (!item.product) {
        throw new Error("Product not found");
      }

      if (item.product.status !== "APPROVED") {
        throw new Error("Product not approved");
      }

      if (item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.title}`);
      }

      total += item.product.price * item.quantity;
    }

    // 2️⃣ Create order
    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        paymentStatus: "PENDING"
      }
    });

    // publish order event
    await orderQueue.add("order-created", {
      orderId: order.id,
      userId: userId
    });

    // 3️⃣ Process items
    for (const item of cart.items) {

      // 🔐 Acquire inventory lock
      const lock = await acquireLock(item.productId);

      if (!lock) {
        throw new Error(
          "Product is currently being purchased by another user. Please retry."
        );
      }

      try {

        const totalPrice = item.product.price * item.quantity;

        const commission = totalPrice * COMMISSION_RATE;

        const sellerRevenue = totalPrice - commission;

        // create order item
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            commission,
            sellerRevenue
          }
        });

        // reduce stock safely
        const product = await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        // extra protection
        if (product.stock < 0) {
          throw new Error("Stock race condition detected");
        }

        // credit seller wallet
        await createEscrowTransaction(
  order.id,
  item.product.sellerId,
  sellerRevenue,
  commission
);

      } finally {

        // 🔓 Release inventory lock
        await releaseLock(item.productId);

      }

    }

    // 4️⃣ Clear cart
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    });

    return order;

  });
}
export async function createPayment(userId: string) {

  const session = await prisma.checkoutSession.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  if (!session) {
    throw new Error("Checkout session not found");
  }

  const order = await razorpay.orders.create({
    amount: session.total * 100, // Razorpay uses paise
    currency: "INR",
    receipt: `receipt_${session.id}`,
  });

  return {
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency
  };
}