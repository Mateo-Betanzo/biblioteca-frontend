import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RegistroServiceWorker } from "./RegistroServiceWorker";
import { BotonInstalar } from "./BotonInstalar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Biblioteca App',
  description: 'Catálogo de la biblioteca',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RegistroServiceWorker />
        
        <header className="w-full p-4 bg-slate-900 text-white flex justify-between items-center">
          <h1 className="font-bold text-lg">Biblioteca App</h1>
          <BotonInstalar />
        </header>

        <main className="flex-1">{children}</main>
      </body>

    </html>
  );
}