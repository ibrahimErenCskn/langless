import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "LangLess",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <SessionProvider>
          <Header />
          <div className="w-full px-24">
            {children}
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}