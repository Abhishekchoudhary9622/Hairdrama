import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If navigating to / and cookie exists, continue or redirect
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/settings/:path*'],
};
