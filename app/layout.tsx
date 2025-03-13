import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EBS PMO Software",
  description: "EBS Internal Project Management Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "antialiased min-h-screen")}
        >
        <QueryProvider>
          <Toaster />
          <Analytics />
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
