import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/wip', request.url));
}

export const config = {
  matcher: ['/u/:path*', '/wallet/:path*', '/home/:path*'],
};
