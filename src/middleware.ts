import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Placeholder roles - replace with actual roles from your system
type UserRole = 'admin' | 'ops' | 'agent' | 'guest';

// Function to simulate getting user role from token/session
// TODO: Replace with actual JWT verification and role extraction from token payload
async function getUserRoleFromToken(request: NextRequest): Promise<UserRole> {
  // Temporarily bypass authentication and always return admin role
  return 'admin';
}

// Define protected routes and required roles
const protectedRoutes: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/ops': ['ops', 'admin'], // Admins can also access Ops dashboard
  '/agent': ['agent', 'admin'], // Admins can also access Agent dashboard
  // Add more protected routes as needed
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = await getUserRoleFromToken(request);

  // Find if the current path is protected
  const requiredRoles = Object.entries(protectedRoutes).find(([pathPrefix]) =>
    pathname.startsWith(pathPrefix)
  )?.[1];

  // If route is protected and user doesn't have the required role
  if (requiredRoles && !requiredRoles.includes(userRole)) {
    // Redirect unauthenticated users to login
    if (userRole === 'guest') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }
    // Redirect authenticated users with wrong role to a generic page or root
    // Or show an "Unauthorized" page
    console.warn(`Unauthorized access attempt to ${pathname} by role: ${userRole}`);
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
    // Alternatively: return new NextResponse('Unauthorized', { status: 403 });
  }

  // Allow the request to proceed if not protected or role is sufficient
  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - apply (public application page)
     * - login (public login page)
     * - / (root page, allow access for demo links)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|apply|login|$).*)', // Apply to protected routes
    // Include root if you want to protect it based on auth status, but exclude for demo
    // '/'
  ],
};

// Note: This is a basic middleware structure. For production, you'll need:
// 1. Robust JWT verification using a library like `jose`.
// 2. Secure token storage (e.g., HttpOnly cookies).
// 3. More sophisticated role checking, possibly fetching permissions from a database.
// 4. Proper error handling and logging.
// 5. Consider edge cases like token expiry and refresh tokens.
