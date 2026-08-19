import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import dotenv from "dotenv";

dotenv.config();

// create a ratelimiter that allows 100 requests per 30 seconds
// Upstash is optional for local work: without the two env vars, Redis.fromEnv()
// throws and the whole server refuses to boot. Fall back to no rate limiting
// and say so, rather than blocking `npm run dev`.
let ratelimit = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "30 s"),
  });
} else {
  console.warn(
    "UPSTASH_REDIS_REST_URL / _TOKEN not set — rate limiting is OFF for this run"
  );
}

export default ratelimit;
