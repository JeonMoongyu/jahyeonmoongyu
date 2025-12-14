import { NextResponse } from "next/server";

export const config = {
  matcher: ["/stats/:path*", "/api/stats/:path*"],
};

export function middleware(req) {
  const user = process.env.STATS_USER || "";
  const pass = process.env.STATS_PASS || "";

  // 비번을 아직 안 넣었으면 잠금 비활성(원하면 이 줄 삭제 가능)
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization") || "";
  const expected = "Basic " + btoa(`${user}:${pass}`);

  if (auth === expected) return NextResponse.next();

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Stats"' },
  });
}
