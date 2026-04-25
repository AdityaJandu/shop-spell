import Image from "next/image";

export function SigninForm() {
  return (
    <form className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <label
          className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-xs"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          className="bg-surface-container-low border-none rounded-lg px-md py-[14px] font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary-container focus:outline-none transition-shadow placeholder:text-outline-variant"
          id="email"
          placeholder="hello@example.com"
          type="email"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label
          className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-xs"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="bg-surface-container-low border-none rounded-lg px-md py-[14px] font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary-container focus:outline-none transition-shadow placeholder:text-outline-variant"
          id="password"
          placeholder="••••••••"
          type="password"
        />
      </div>

      <div className="mt-sm flex flex-col gap-md">
        <button
          className="bg-primary-container text-on-primary rounded-full font-label-caps text-label-caps uppercase py-[16px] px-lg w-full flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all tracking-widest shadow-[0_2px_12px_rgba(244,97,78,0.2)]"
          type="button"
        >
          Sign In
        </button>

        <div className="flex items-center gap-md">
          <div className="h-px bg-surface-variant flex-1"></div>
          <span className="font-label-caps text-label-caps text-outline-variant uppercase">
            Or continue with
          </span>
          <div className="h-px bg-surface-variant flex-1"></div>
        </div>

        <button
          className="bg-surface-container-lowest border border-outline rounded-full font-label-caps text-label-caps text-on-surface uppercase py-[14px] px-lg w-full flex items-center justify-center gap-sm hover:bg-surface-container-low active:bg-surface-variant transition-colors tracking-widest"
          type="button"
        >
          <Image
            src="/icons/google.svg"
            alt="Google Icon"
            width={20}
            height={20}
          />
          Google
        </button>
      </div>
    </form>
  );
}
