import { redis } from "@/lib/redis";

const LOCK_TTL = 10; // seconds

export async function acquireLock(productId: string) {

  const lockKey = `lock:product:${productId}`;

  const result = await redis.set(lockKey, "locked", "NX", "EX", LOCK_TTL);

  return result === "OK";
}

export async function releaseLock(productId: string) {

  const lockKey = `lock:product:${productId}`;

  await redis.del(lockKey);
}