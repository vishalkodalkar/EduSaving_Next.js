import { prisma } from "@/lib/prisma";

export async function releaseEscrowFunds() {

  const now = new Date();

  const escrows = await prisma.escrowTransaction.findMany({
    where: {
      status: "HOLDING",
      releaseAt: {
        lte: now
      }
    }
  });

  for (const escrow of escrows) {

    const wallet = await prisma.sellerWallet.findUnique({
      where: {
        sellerId: escrow.sellerId
      }
    });

    if (!wallet) {
      continue;
    }

    await prisma.$transaction(async (tx) => {

      await tx.sellerWallet.update({
        where: {
          sellerId: escrow.sellerId
        },
        data: {
          balance: {
            increment: escrow.amount
          }
        }
      });

      await tx.walletTransaction.create({
        data: {
          sellerId: escrow.sellerId,
          orderId: escrow.orderId,
          amount: escrow.amount,
          type: "ESCROW_RELEASE"
        }
      });

      await tx.escrowTransaction.update({
        where: {
          id: escrow.id
        },
        data: {
          status: "RELEASED",
          releasedAt: new Date()
        }
      });

    });

  }

  return {
    processed: escrows.length
  };
}