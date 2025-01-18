import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project",
  description: "uOttaHack 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800&family=Lexend:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-Outfit">{children}</body>
    </html>
  );
}
