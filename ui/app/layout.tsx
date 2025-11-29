import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { AppProvider } from "@/contexts/app-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A2A Handson",
  description: "A2A Protocol Hands-on Workshop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AppProvider>
          <Header />
          <main className="container mx-auto py-6 px-4">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
