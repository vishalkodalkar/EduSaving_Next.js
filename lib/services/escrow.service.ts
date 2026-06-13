import { prisma } from "@/lib/prisma";

export async function createEscrowTransaction(
orderId: string,
sellerId: string,
amount: number,
commission: number
) {
const releaseDate = new Date();

releaseDate.setDate(releaseDate.getDate() + 7);

return prisma.escrowTransaction.create({
data: {
orderId,
sellerId,
amount,
commission,
status: "HOLDING",
releaseAt: releaseDate
}
});
}
