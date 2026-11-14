import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

const playfair = Playfair_Display({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const viewport: Viewport = {
  themeColor: "#050814",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://coxsbazarfullmoon.com"),
  title: "Full Moon, Sea & Seafood Night | জোছনা মাখা সমুদ্র, মুগ্ধতার এক রাত",
  description: "২৪ নভেম্বর ২০২৬, কোস্টাল হেভেন, কক্সবাজার। Full Moon, Sea & Seafood Night - জোছনা মাখা সমুদ্র, মুগ্ধতার এক রাত। অর্গানাইজড বাই রিমার্ক (Remark)।",
  keywords: [
    "Full Moon Sea Seafood Night",
    "Cox's Bazar",
    "Coastal Heaven",
    "Remark",
    "জোছনা মাখা সমুদ্র",
    "মুগ্ধতার এক রাত",
    "Seafood Dinner",
    "Seafood Khichuri"
  ],
  openGraph: {
    title: "Full Moon, Sea & Seafood Night | 24 November 2026",
    description: "জোছনা মাখা সমুদ্র, মুগ্ধতার এক রাত • Coastal Heaven, Cox's Bazar • Presented by Remark",
    type: "website",
    locale: "bn_BD",
    siteName: "Full Moon, Sea & Seafood Night",
    images: [
      {
        url: "/images/event-poster.jpg",
        width: 1200,
        height: 630,
        alt: "Full Moon, Sea & Seafood Night, Cox's Bazar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Moon, Sea & Seafood Night | Cox's Bazar",
    description: "জোছনা মাখা সমুদ্র, মুগ্ধতার এক রাত • 24 November 2026",
    images: ["/images/event-poster.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${playfair.variable} font-sans`}>
      <body className="bg-night-950 text-gray-100 min-h-screen flex flex-col selection:bg-moon-gold selection:text-night-950 antialiased overflow-x-hidden">
        {pixelId && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        {children}
      </body>
    </html>
  );
}
