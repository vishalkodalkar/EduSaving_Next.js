import { startReservationExpiryWorker } from "@/lib/queue/reservationExpiry.worker";

if (process.env.NODE_ENV === "development") {
  startReservationExpiryWorker();
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}