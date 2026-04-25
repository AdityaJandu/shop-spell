import React from "react";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20 py-xl px-lg md:px-xl">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined icon-fill text-outline">
            magic_button
          </span>
          <span className="font-h3 text-[18px] tracking-tight font-bold text-on-surface-variant">
            ShopSpell
          </span>
        </div>
        <div className="flex gap-lg">
          <a
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary-container"
            href="#"
          >
            Terms
          </a>
          <a
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary-container"
            href="#"
          >
            Privacy
          </a>
          <a
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary-container"
            href="#"
          >
            Contact
          </a>
        </div>
        <p className="font-code text-code text-outline">
          © 2024 ShopSpell. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
