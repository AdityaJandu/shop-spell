import React from "react";
import { SignupForm } from "../components/SignupForm";

export function SignupPage() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-gutter antialiased text-on-surface selection:bg-primary-container selection:text-on-primary">
      <main className="w-full max-w-[420px]">
        <div className="bg-surface-container-lowest rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-lg md:p-xl flex flex-col">
          <header className="flex flex-col items-center text-center mb-xl">
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-md text-primary-container">
              <span className="material-symbols-outlined text-[32px] icon-fill">
                auto_fix_high
              </span>
            </div>
            <h1 className="font-h2 text-h2 text-on-surface mb-xs">
              Create your store
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Step into the future of commerce. Let&apos;s craft your vision together.
            </p>
          </header>

          <SignupForm />
        </div>

        <div className="mt-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Already have an account?{" "}
            <a
              className="text-secondary font-semibold hover:text-on-secondary-container hover:underline transition-colors"
              href="/sign-in"
            >
              Log in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
