export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/company/:path*",
    "/student/:path*",
    "/college/:path*",
  ],
};