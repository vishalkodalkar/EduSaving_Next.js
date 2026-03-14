import cron from "node-cron";
import {prisma} from "@/lib/prisma";

export const startReservationExpiryWorker = () => {

  cron.schedule("* * * * *", async () => {

    console.log("Running reservation expiry worker...");

    const now = new Date();

    const expiredReservations = await prisma.stockReservation.findMany({
      where: {
        expiresAt: {
          lt: now
        },
        status: "ACTIVE"
      }
    });

    for (const reservation of expiredReservations) {

      // Restore product stock
      await prisma.product.update({
        where: { id: reservation.productId },
        data: {
          stock: {
            increment: reservation.quantity
          }
        }
      });

      // Mark reservation expired
      await prisma.stockReservation.update({
        where: { id: reservation.id },
        data: {
          status: "EXPIRED"
        }
      });

      console.log(`Reservation ${reservation.id} expired and stock restored`);
    }

  });

};