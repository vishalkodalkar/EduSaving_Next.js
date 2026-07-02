import { redis } from "@/lib/redis";

const LOCK_TTL = 10; // seconds

export async function acquireLock(productId: string) {
  const lockKey = `lock:product:${productId}`;

  const result = await redis.set(
    lockKey,
    "locked",
    "EX",
    LOCK_TTL,
    "NX"
  );

  return result === "OK";
}

export async function releaseLock(productId: string) {
  const lockKey = `lock:product:${productId}`;

  await redis.del(lockKey);
}