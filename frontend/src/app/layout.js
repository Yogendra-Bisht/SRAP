import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NEST — Student Room Accommodation Platform",
  description: "Find verified rooms near your college campus with transparent prices.",
  openGraph: {
    title: "NEST — Student Room Accommodation Platform",
    description: "Find verified rooms near your college campus with transparent prices.",
    url: "https://srap.vercel.app", // Fallback, will be replaced by actual domain later
    siteName: "NEST Platform",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=630&fit=crop", // placeholder cover image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEST — Student Room Accommodation Platform",
    description: "Find verified rooms near your college campus with transparent prices.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=630&fit=crop"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar/>
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
