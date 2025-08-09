import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "ArtExplorer - Discover Metropolitan Museum Art",
  description:
    " Jaya Tech React Test - Explore and discover amazing artworks from the Metropolitan Museum of Art collection",
  keywords: [
    "art",
    "museum",
    "metropolitan",
    "paintings",
    "culture",
    "history",
  ],
  authors: [{ name: "Jonathas Germano de Oliveira" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${mulish.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-8">{children}</main>
              <Footer />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
