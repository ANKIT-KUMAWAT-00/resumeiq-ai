import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} min-h-screen antialiased`}>
        {/* All of your pages will render right here inside {children} */}
        {children}
        <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="beforeInteractive"
/>
      </body>
    </html>
  );
}