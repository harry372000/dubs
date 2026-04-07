import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // DUBS Design System — "The Digital Polyglot"
      colors: {
        /* Brand — fixed */
        primary:                   "#000666",
        "primary-container":       "#1a237e",
        "on-primary":              "#ffffff",
        "on-primary-fixed":        "#000767",
        secondary:                 "#006875",
        "on-secondary":            "#ffffff",
        tertiary:                  "#1f005d",
        "tertiary-fixed":          "#e8deff",
        "surface-tint":            "#4c56af",
        "surface-bright":          "var(--color-surface)",
        "inverse-primary":         "#bdc2ff",

        /* Theme-aware tokens — driven by CSS variables (RGB components for runtime theming) */
        background:                    "rgb(var(--color-background) / <alpha-value>)",
        surface:                       "rgb(var(--color-surface) / <alpha-value>)",
        "surface-low":                 "rgb(var(--color-surface-low) / <alpha-value>)",
        "surface-container":           "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-low":       "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container-high":      "rgb(var(--color-surface-high) / <alpha-value>)",
        "surface-high":                "rgb(var(--color-surface-high) / <alpha-value>)",
        "surface-highest":             "rgb(var(--color-surface-highest) / <alpha-value>)",
        "surface-container-highest":   "rgb(var(--color-surface-highest) / <alpha-value>)",
        "surface-lowest":              "rgb(var(--color-surface-lowest) / <alpha-value>)",
        "surface-container-lowest":    "rgb(var(--color-surface-lowest) / <alpha-value>)",
        "surface-dim":                 "rgb(var(--color-surface-dim) / <alpha-value>)",
        "on-surface":                  "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant":          "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        outline:                       "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant":             "rgb(var(--color-outline-variant) / <alpha-value>)",
        "primary-fixed":               "rgb(var(--color-primary-fixed) / <alpha-value>)",
        "primary-fixed-dim":           "rgb(var(--color-primary-fixed-dim) / <alpha-value>)",
        "on-primary-container":        "rgb(var(--color-on-primary-container) / <alpha-value>)",
        "secondary-container":         "rgb(var(--color-secondary-container) / <alpha-value>)",
        "secondary-fixed":             "rgb(var(--color-secondary-fixed) / <alpha-value>)",
        "on-secondary-container":      "rgb(var(--color-on-secondary-container) / <alpha-value>)",
        "tertiary-container":          "rgb(var(--color-tertiary-container) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "dubs-gradient": "linear-gradient(135deg, #000666 0%, #1a237e 50%, #006875 100%)",
        "ai-pulse": "linear-gradient(90deg, #006875 0%, #00e3fd 100%)",
        "midnight": "linear-gradient(160deg, #000666 0%, #000933 40%, #001020 100%)",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "shimmer-border": "shimmerBorder 4s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out both",
        "fade-up": "fadeUp 0.6s ease-out both",
        "slide-down": "slideDown 0.5s ease-out both",
        "float-orb": "floatOrb 9s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        "intelligence-pulse": "intelligencePulse 2.4s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shimmerBorder: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "300% center" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatOrb: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "33%": { transform: "translateY(-24px) scale(1.04)" },
          "66%": { transform: "translateY(12px) scale(0.97)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        intelligencePulse: {
          "0%, 100%": { transform: "scale(1)", borderRadius: "50%" },
          "25%": { transform: "scale(1.12)", borderRadius: "45% 55% 52% 48% / 48% 45% 55% 52%" },
          "50%": { transform: "scale(0.92)", borderRadius: "55% 45% 48% 52% / 52% 55% 45% 48%" },
          "75%": { transform: "scale(1.07)", borderRadius: "48% 52% 55% 45% / 55% 48% 52% 45%" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 227, 253, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 227, 253, 0.5)" },
        },
      },
      boxShadow: {
        ambient: "0 20px 40px rgba(0, 6, 102, 0.06)",
        glass: "0 8px 32px rgba(0, 6, 102, 0.08)",
        glow: "0 0 40px rgba(0, 227, 253, 0.25)",
        "glow-strong": "0 0 60px rgba(0, 227, 253, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
