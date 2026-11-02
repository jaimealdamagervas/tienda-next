import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // Ya hay sesión (si no, withAuth manda a /login).
  // Además, /admin solo lo puede ver un usuario con rol admin.
  function proxy(req) {
    const esAdmin = req.nextauth.token?.rol === 'admin';
    if (req.nextUrl.pathname.startsWith('/admin') && !esAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: '/login' },
  }
);

export const config = {
  matcher: ['/cuenta/:path*', '/admin/:path*'],
};
