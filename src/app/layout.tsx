import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const spaceGroteskHeading = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopSpell - AI Store Builder",
  description: "Your store. One sentence away.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, jetBrainsMono.variable, "font-sans", geist.variable, spaceGroteskHeading.variable)}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <TRPCReactProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </TRPCReactProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
