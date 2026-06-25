import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "CSD Los Apostoles",
  description: "Plataforma digital para clubes de futbol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${lexend.className} ${lexend.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
