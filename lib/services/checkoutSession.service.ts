import { prisma } from "@/lib/prisma";
import { acquireLock } from "@/lib/services/inventoryLock.service";

export async function createCheckoutSession(userId: string, pincode: string) {

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // ✅ Zone-based delivery check
  const mapping = await prisma.pincodeZone.findUnique({
    where: { pincode }
  });

  if (!mapping) {
    throw new Error("Delivery not available in this area");
  }

  const zone = await prisma.deliveryZone.findUnique({
    where: { id: mapping.zoneId }
  });

  if (!zone || !zone.deliveryAvailable) {
    throw new Error("Delivery not available in this zone");
  }

  let total = 0;

  for (const item of cart.items) {

    if (!item.product) {
      throw new Error("Product not found");
    }

    if (item.product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.product.title}`);
    }

    // reserve inventory lock
    const lock = await acquireLock(item.productId);

    if (!lock) {
      throw new Error("Product currently locked by another checkout");
    }

    total += item.product.price * item.quantity;
  }

  return prisma.checkoutSession.create({
    data: {
      userId,
      total,
      status: "CREATED"
    }
  });
}