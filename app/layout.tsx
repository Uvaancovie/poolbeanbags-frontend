import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { CartProvider } from "../components/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","600","700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Pool Beanbags Durban North",
  description: "Naomi Bassioni's Pool Beanbags shop in Durban North, South Africa. Premium quality pool beanbags, outdoor beanbags, waterproof beanbags, and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="aquarius">
      <body className={`${poppins.variable} antialiased` }>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
