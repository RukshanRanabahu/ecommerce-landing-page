import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
});

const nunito = Nunito({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Flat Rock Tech",
  description: "Product Listing",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${nunito.variable} min-h-full bg-[#f5f5f7]`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
