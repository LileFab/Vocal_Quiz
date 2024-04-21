import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";

const roboto = Roboto_Mono({ subsets: ["latin"],  weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  title: "Quiz'In",
  description: "Quiz'In le quiz vocal !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${roboto.className} dark:bg-gray-800 text-white h-screen `}>
          <Navbar/> 
          {children}
          </body>
      </html>
    </ClerkProvider>
  );
}
