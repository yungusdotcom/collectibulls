import "./globals.css";

export const metadata = {
  title: "Collectibulls — Track. Trade. Triumph.",
  description:
    "Premium trading card portfolio tracker. Monitor your collection value, log trades, and track market trends.",
  metadataBase: new URL("https://collectibulls.vercel.app"),
  openGraph: {
    title: "Collectibulls",
    description: "Premium trading card portfolio tracker.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#06060C",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
