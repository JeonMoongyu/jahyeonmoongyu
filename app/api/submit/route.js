import { redis } from "@/lib/redis";

export async function POST(req) {
  const { winner } = await req.json(); // "/photos/01.jpg"
  const m = String(winner || "").match(/\/photos\/(\d+)\.jpg$/);
  if (!m) {
    return new Response(JSON.stringify({ ok: false, error: "bad winner" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const id = m[1]; // "01" ~ "32"
  await redis.incr(`photo:${id}:wins`);
  await redis.incr("total:plays");

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}
