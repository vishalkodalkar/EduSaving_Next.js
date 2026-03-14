import cron from "node-cron";
import {prisma} from "../prisma";

export function startReservationExpiryWorker() {

  cron.schedule("* * * * *", async () => {

    console.log("Checking expired reservations...");

   const expired = await prisma.stockReservation.findMany({
  where: {
    expiresAt: { lt: new Date() },
    status: "ACTIVE"
  }
});
    for (const reservation of expired) {

      // restore stock
      await prisma.product.update({
        where: { id: reservation.productId },
        data: {
          stock: {
            increment: reservation.quantity
          }
        }
      });

      // mark expired
      await prisma.stockReservation.update({
  where: { id: reservation.id },
  data: {
    status: "EXPIRED"
  }
});

      console.log(`Expired reservation restored: ${reservation.id}`);
    }

  });

}