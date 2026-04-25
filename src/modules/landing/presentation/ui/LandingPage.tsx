import React from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { BrowserMockup } from "../components/BrowserMockup";
import { HowItWorks } from "../components/HowItWorks";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      {/* Main Content Canvas */}
      <main className="grow flex flex-col items-center justify-center w-full max-w-container-max mx-auto px-gutter pt-24 pb-32">
        <Hero />
        <BrowserMockup />
        <HowItWorks />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
