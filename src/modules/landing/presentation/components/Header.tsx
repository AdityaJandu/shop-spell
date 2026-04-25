import React from "react";

export function Header() {
  return (
    <header className="w-full flex justify-between items-center px-lg py-md md:px-xl sticky top-0 z-50 bg-background/90 backdrop-blur-md">
      <a className="flex items-center gap-sm text-on-background" href="#">
        <span className="material-symbols-outlined icon-fill text-primary-container">
          magic_button
        </span>
        <span className="font-h3 text-h3 tracking-tight font-extrabold">
          ShopSpell
        </span>
      </a>
      <nav className="hidden md:flex items-center gap-lg">
        <a
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary-container transition-colors"
          href="#features"
        >
          Features
        </a>
        <a
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary-container transition-colors"
          href="#pricing"
        >
          Pricing
        </a>
      </nav>
      <div className="flex items-center gap-md">
        <a
          className="font-body-md text-body-md text-on-surface-variant hover:text-on-background hidden sm:block"
          href="#"
        >
          Log in
        </a>
        <button className="bg-primary-container text-on-primary font-body-md text-body-md font-semibold px-lg py-sm rounded-full hover:opacity-90 transition-opacity shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          Get Started
        </button>
      </div>
    </header>
  );
}
