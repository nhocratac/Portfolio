import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nguyễn Việt Thắng - Web Developer | Backend & Fullstack",
    template: "%s | Nguyễn Việt Thắng Portfolio"
  },
  description: "Portfolio của Nguyễn Việt Thắng (nhocratac) - Web Developer chuyên về Backend & Fullstack. Sinh viên UIT với GPA 9.0, đam mê phát triển ứng dụng web với Spring Boot, Node.js, Next.js và nhiều công nghệ hiện đại.",
  keywords: [
    "Nguyễn Việt Thắng",
    "nhocratac",
    "Web Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Spring Boot",
    "Node.js",
    "Next.js",
    "Java Developer",
    "React Developer",
    "UIT",
    "Portfolio",
    "TP Hồ Chí Minh",
    "Vietnam Developer"
  ],
  authors: [{ name: "Nguyễn Việt Thắng" }],
  creator: "Nguyễn Việt Thắng",
  publisher: "Nguyễn Việt Thắng",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'), // TODO: Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://your-domain.com', // TODO: Replace with your actual domain
    siteName: 'Nguyễn Việt Thắng Portfolio',
    title: 'Nguyễn Việt Thắng - Web Developer | Backend & Fullstack',
    description: 'Portfolio của Nguyễn Việt Thắng (nhocratac) - Web Developer chuyên về Backend & Fullstack với kinh nghiệm Spring Boot, Node.js, Next.js',
    images: [
      {
        url: '/og-image.png', // TODO: Add an Open Graph image to /public folder
        width: 1200,
        height: 630,
        alt: 'Nguyễn Việt Thắng Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nguyễn Việt Thắng - Web Developer | Backend & Fullstack',
    description: 'Portfolio của Nguyễn Việt Thắng - Web Developer chuyên về Backend & Fullstack',
    images: ['/og-image.png'], // TODO: Add an Open Graph image to /public folder
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code', // TODO: Add after setting up Google Search Console
    // yandex: 'your-yandex-verification-code',
    // other: 'your-other-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
