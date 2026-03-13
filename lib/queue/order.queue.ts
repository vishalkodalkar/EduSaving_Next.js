import { Queue } from "bullmq";

export const orderQueue = new Queue("order-events", {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
});