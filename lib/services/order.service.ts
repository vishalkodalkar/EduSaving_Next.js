import { prisma } from "@/lib/prisma";
import { creditSellerWallet } from "@/lib/services/wallet.service";
import { acquireLock, releaseLock } from "@/lib/services/inventoryLock.service";
import { orderQueue } from "@/lib/queue/order.queue";

const COMMISSION_RATE = 0.10;

export async function completeCheckout(userId: string) {

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

  return await prisma.$transaction(async (tx) => {

    let total = 0;

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

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: "CONFIRMED",
        paymentStatus: "PAID"
      }
    });

    await orderQueue.add("order-created", {
      orderId: order.id,
      userId
    });

    for (const item of cart.items) {

      const lock = await acquireLock(item.productId);

      if (!lock) {
        throw new Error("Product is currently locked");
      }

      try {

        const totalPrice = item.product.price * item.quantity;
        const commission = totalPrice * COMMISSION_RATE;
        const sellerRevenue = totalPrice - commission;

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

        const product = await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });

        if (product.stock < 0) {
          throw new Error("Stock race condition detected");
        }

        await creditSellerWallet(
          item.product.sellerId,
          order.id,
          item.product.price,
          item.quantity
        );

      } finally {
        await releaseLock(item.productId);
      }
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return order;

  });
}