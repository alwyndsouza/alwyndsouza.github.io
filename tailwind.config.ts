import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.md",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      colors: {
        zinc: {
          950: "#09090b",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--color-text-secondary)",
            "--tw-prose-headings": "var(--color-text-primary)",
            "--tw-prose-lead": "var(--color-text-secondary)",
            "--tw-prose-links": "var(--color-accent)",
            "--tw-prose-bold": "var(--color-text-primary)",
            "--tw-prose-counters": "var(--color-text-muted)",
            "--tw-prose-bullets": "var(--color-text-muted)",
            "--tw-prose-hr": "var(--color-border)",
            "--tw-prose-quotes": "var(--color-text-primary)",
            "--tw-prose-quote-borders": "var(--color-accent)",
            "--tw-prose-captions": "var(--color-text-muted)",
            "--tw-prose-code": "var(--color-text-primary)",
            "--tw-prose-pre-code": "var(--color-text-primary)",
            "--tw-prose-pre-bg": "var(--color-surface-elevated)",
            "--tw-prose-th-borders": "var(--color-border)",
            "--tw-prose-td-borders": "var(--color-border)",
          },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
