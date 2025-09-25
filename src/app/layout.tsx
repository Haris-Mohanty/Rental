import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { UserProvider } from "@/app/context/UserContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallbackRequestForm from "@/components/CallbackRequestForm";
import CallbackPopup from "@/components/CallbackPopup";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://banajatravels.com"),
  title: "Banaja Travels | Car Rental & Booking",
  description: "Book cars easily with Banaja Travels. Affordable car rentals, seamless booking, and reliable service for all your travel needs.",
  keywords: [
    "Banaja Travels",
    "Car Rental",
    "Car Booking",
    "Travel Agency",
    "Affordable Car Hire",
    "Online Car Booking",
  ],
  authors: [{ name: "Banaja Travels" }],
  openGraph: {
    title: "Banaja Travels | Car Rental & Booking",
    description: "Find and book cars quickly with Banaja Travels. Affordable rentals, flexible booking, and trusted travel services.",
    url: "https://banajatravels.com",
    siteName: "Banaja Travels",
    images: [
      {
        url: "/drivewithus.png",
        width: 1200,
        height: 630,
        alt: "Banaja Travels - Car Booking",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <UserProvider>
          <Header />
          <main role="main" className="min-h-screen">
            {children}
            <Toaster position="top-right" richColors />
          </main>
          <Footer />
          <WhatsAppButton />
          <CallbackPopup />
        </UserProvider>
      </body>
    </html>
  );
}
