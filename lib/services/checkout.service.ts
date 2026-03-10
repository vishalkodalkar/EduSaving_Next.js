import {prisma} from "@/lib/prisma";

export async function checkout(userId: string) {

  // 1️⃣ Get user cart
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

  let total = 0;

  // 2️⃣ Validate products
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

  // 3️⃣ Create order
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "PENDING"
    }
  });

  // 4️⃣ Create order items
  for (const item of cart.items) {

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }
    });

    // 5️⃣ Reduce product stock
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity
        }
      }
    });
  }

  // 6️⃣ Clear cart
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id
    }
  });

  return order;
}