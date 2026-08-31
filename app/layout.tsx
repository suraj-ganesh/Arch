import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientShell from '@/components/ClientShell';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Arch",
  description: "Next-gen shoe store with eSewa ePay v2 payment integration.",
  icons: {
    icon: '/arch-logo.svg',
    shortcut: '/arch-logo.svg',
    apple: '/arch-logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <body
        className="font-sans bg-[#f4f3ee] text-[#463f3a] antialiased min-h-screen flex flex-col justify-between selection:bg-[#839788] selection:text-white"
        suppressHydrationWarning
      >
        <ClientShell>
          <main className="flex-1">{children}</main>
        </ClientShell>
      </body>
    </html>
  );
}
