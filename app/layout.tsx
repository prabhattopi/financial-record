import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes' // Use their dark theme to match your app
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Glass Expense Tracker",
  description: "Optimized Daily & Monthly Tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#6366f1' } // Matches your Indigo theme
      }}
    > 
    <html lang="en" className="dark"> 
      <body className={inter.className}>
        <main className="min-h-screen p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
    </ClerkProvider>
  );
}