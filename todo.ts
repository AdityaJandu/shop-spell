export const ImageGuidelines = {
  // 1. Assets Location
  // Place all static images (SVG, PNG, JPG, WebP) inside the `/public` directory at the root of the project.
  // For better organization, use sub-directories such as `/public/icons` and `/public/images`.
  publicDirectory: "/public",
  
  // 2. Next.js Image Component
  // Use the built-in Next.js <Image /> component for all images to ensure they are optimized (lazy loading, responsive sizing, correct format).
  // Example Usage:
  // import Image from "next/image";
  // <Image src="/images/hero-bg.webp" alt="Hero Background" width={800} height={600} />
  useNextImageComponent: true,

  // 3. SVG Icons
  // Avoid inline SVGs inside JSX whenever possible to keep components clean.
  // Store icons in `/public/icons` and load them as standard images or create custom React Icon components in `src/components/icons`.
  iconsDirectory: "/public/icons",

  // 4. External Images
  // Ensure that external images' domains (like Google Cloud Storage, Unsplash, etc.) are properly configured in `next.config.ts` under the `images.remotePatterns` array.
  configureRemoteDomains: true,
};
