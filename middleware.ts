import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/auth';

const publicPaths = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  const token = request.cookies.get('session')?.value;
  const session = token ? await verifySession(token) : null;

  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicPath && session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
