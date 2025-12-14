import { redis } from "@/lib/redis";

export async function GET() {
  const total = Number((await redis.get("total:plays")) || 0);

  const ids = Array.from({ length: 32 }, (_, i) => String(i + 1).padStart(2, "0"));
  const keys = ids.map((id) => `photo:${id}:wins`);
  const values = await redis.mget(...keys);

  const stats = ids
    .map((id, idx) => ({ id, wins: Number(values[idx] || 0) }))
    .sort((a, b) => b.wins - a.wins);

  return new Response(JSON.stringify({ total, stats }), {
    headers: { "content-type": "application/json" },
  });
}
