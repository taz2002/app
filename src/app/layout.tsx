import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ZehnX } from "@/components/Chatbot";
import IntroExperience from "@/components/IntroExperience";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppinsHeadings = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TAZKHIIR",
  description: "AI integration, web platforms, data systems, cloud DevOps, and product engineering.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interSans.variable} ${poppinsHeadings.variable} scroll-smooth antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const savedTheme = localStorage.getItem("theme");
              const theme = savedTheme || "dark";
              document.documentElement.setAttribute("data-theme", theme);
              document.documentElement.style.colorScheme = theme;
            })();`,
          }}
        />
      </head>
      <body className="bg-[var(--background-base)] text-[var(--text-primary)] min-h-screen flex flex-col font-sans transition-colors duration-300">
        <IntroExperience>
          {children}
          <ZehnX />
        </IntroExperience>
      </body>
    </html>
  );
}
