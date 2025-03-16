// import { redirect } from "next/dist/server/api-utils";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: "/", whenAutthenticated: "next" },
  { path: "/checkout", whenAutthenticated: "next" },
  { path: "/contact", whenAutthenticated: "next" },
  { path: "/demonstration", whenAutthenticated: "next" },
  { path: "/politica-privacidade", whenAutthenticated: "next" },
  { path: "/politica-reembolso", whenAutthenticated: "next" },
  { path: "/recuperar-senha", whenAutthenticated: "next" },
  { path: "/sign-in", whenAutthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/sign-in";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("jwt");

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAutthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/painel";
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
