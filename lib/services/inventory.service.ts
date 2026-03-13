import { prisma } from "@/lib/prisma";

export async function reserveStock(productId: string, qty: number, userId: string) {

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || product.stock < qty) {
    throw new Error("Insufficient stock");
  }

  return prisma.stockReservation.create({
    data: {
      productId,
      userId,
      quantity: qty,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }
  });
}