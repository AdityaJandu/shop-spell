import React from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { BrowserMockup } from "../components/BrowserMockup";
import { HowItWorks } from "../components/HowItWorks";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-10 pb-32">
        <Hero />
        <BrowserMockup />
        <HowItWorks />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
