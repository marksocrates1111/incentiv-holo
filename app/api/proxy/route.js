import { NextResponse } from 'next/server';

// Simple in-memory rate limit (Map acts as a cache for this serverless instance)
const ratelimit = new Map();

export async function GET(request) {
  // --- SECURITY: Rate Limiting ---
  // We handle this here to avoid "middleware.js" build warnings in newer Next.js versions
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const count = ratelimit.get(ip) || 0;

  if (count > 20) { // Max 20 requests per minute
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Increment count and set simple cleanup (resetting count after 60s)
  ratelimit.set(ip, count + 1);
  setTimeout(() => {
    const current = ratelimit.get(ip);
    if (current) ratelimit.set(ip, Math.max(0, current - 1));
  }, 60000);

  // --- PROXY LOGIC ---
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const endpoint = searchParams.get('endpoint'); // e.g., 'xp', 'badges', 'mystery-box'

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  // Define target URLs based on endpoint type
  let targetUrl = '';
  const baseUrl = '[https://leaderboard.incentiv.io](https://leaderboard.incentiv.io)';

  switch (endpoint) {
    case 'xp':
      targetUrl = `${baseUrl}/xp/${address}`;
      break;
    case 'badges':
      targetUrl = `${baseUrl}/xp/${address}/badges`;
      break;
    case 'mystery-box':
      targetUrl = `${baseUrl}/xp/${address}/mystery-box?page_size=20&page=1`;
      break;
    default:
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': '[https://portal.incentiv.io](https://portal.incentiv.io)',
        'Referer': '[https://portal.incentiv.io/](https://portal.incentiv.io/)'
      }
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
