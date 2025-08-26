
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware para monitoreo automático
export function middleware(request: NextRequest) {
  const startTime = Date.now();
  
  // Log request start
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  
  // Add custom headers for monitoring
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-start', startTime.toString());
  requestHeaders.set('x-request-id', generateRequestId());
  
  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Add monitoring headers to response
  response.headers.set('x-request-id', requestHeaders.get('x-request-id') || '');
  response.headers.set('x-response-time', '0'); // Will be updated by API routes
  
  // Log response
  response.headers.set('x-monitoring-enabled', 'true');
  
  return response;
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Configure which paths should be monitored
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
