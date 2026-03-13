import { prisma } from "@/lib/prisma";

export const COMMISSION_RATE = 0.10;

export async function creditSellerWallet(
  sellerId: string,
  orderId: string,
  price: number,
  quantity: number
) {

  const total = price * quantity;

  const sellerAmount = total * (1 - COMMISSION_RATE);

  let wallet = await prisma.sellerWallet.findUnique({
    where: { sellerId }
  });

  if (!wallet) {

    wallet = await prisma.sellerWallet.create({
      data: {
        sellerId,
        balance: 0
      }
    });

  }

  await prisma.sellerWallet.update({
    where: { sellerId },
    data: {
      balance: {
        increment: sellerAmount
      }
    }
  });

  await prisma.walletTransaction.create({
    data: {
      sellerId,
      orderId,
      amount: sellerAmount,
      type: "CREDIT"
    }
  });

}