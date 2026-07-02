import { prisma } from "@/lib/prisma";

export async function creditSellerWallet(
  sellerId: string,
  orderId: string,
  amount: number
) {

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
        increment: amount
      }
    }
  });

  await prisma.walletTransaction.create({
    data: {
      sellerId,
      orderId,
      amount,
      type: "ESCROW_RELEASE"
    }
  });

}