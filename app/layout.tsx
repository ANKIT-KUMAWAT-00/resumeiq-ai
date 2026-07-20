import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Initializes the font
const inter = Inter({ subsets: ["latin"] });

// Defines standard page metadata for the app
export const metadata: Metadata = {
  title: "ResumeIQ AI",
  description: "AI-powered resume analysis built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        {/* All of your pages will render right here inside {children} */}
        {children}
      </body>
    </html>
  );
}