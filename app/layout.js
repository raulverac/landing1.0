import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "LandingBuilder · Mentalidad Web",
  description: "Constructor de landing pages profesionales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
