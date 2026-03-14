import { Worker } from "bullmq";

const worker = new Worker(
  "order-events",
  async (job) => {

    if (job.name === "order-created") {

      const { orderId, userId } = job.data;

      console.log("Processing order:", orderId);

      // Future tasks
      // send email
      // notify seller
      // update analytics
      // create shipment

    }

  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379
    }
  }
);

console.log("Order worker started...");-[]