import { Ratelimit } from "@unkey/ratelimit"

export const unkey = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY!,
  namespace: "devTinderNamespace",
  limit: 5,
  duration: "10s",
  async: true
})
