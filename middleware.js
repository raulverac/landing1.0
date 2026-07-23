export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Protege todas las rutas excepto:
     * - /login
     * - /api/auth/* (nextauth endpoints)
     * - /landing/* (landings publicadas, acceso público)
     * - /_next/* (assets de Next.js)
     * - /favicon, imágenes estáticas, etc.
     */
    "/((?!login|api/auth|landing|_next/static|_next/image|favicon.ico).*)",
  ],
};
