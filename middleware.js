import { NextResponse } from 'next/server';

const ratelimit = new Map();

export function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // Simple in-memory rate limit (Reset every 60s)
  // For production, use Vercel KV or Upstash
  if (request.nextUrl.pathname.startsWith('/api/proxy')) {
    const count = ratelimit.get(ip) || 0;
    if (count > 20) { // Max 20 requests per minute per IP
      return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    ratelimit.set(ip, count + 1);
    setTimeout(() => ratelimit.set(ip, (ratelimit.get(ip) || 1) - 1), 60000);
  }
}
