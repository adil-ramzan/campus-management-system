// The colour system for the whole app. Every colour is defined once here and reaches
// the UI in two ways: as Tailwind class names (bg-navy, text-ink-secondary, border-line,
// bg-primary, text-danger, ...) and as plain values for code that cannot use classes,
// such as Chart.js options.
export const COLORS = {
  navy: "#173B70", // deep blue: the sidebar (primary navigation) and dark brand blocks
  primary: "#1E4D8F", // academic blue: primary actions, links and selected states
  primaryHover: "#173B70",
  secondary: "#4F7FB8", // lighter blue: secondary chart series and quiet highlights
  gold: "#C9A227", // accent, for very small highlights only

  page: "#F5F7FA", // page background
  surface: "#FFFFFF", // navbar, cards, panels, forms and tables
  line: "#E2E8F0", // borders and dividers

  ink: "#1F2937", // main text
  inkSecondary: "#667085",
  inkMuted: "#98A2B3", // icons and decorative text only; too light for body text

  // The footer is dark slate, deliberately different from the deep blue sidebar.
  footer: "#263746",
  footerText: "#E5E7EB",
  footerSecondary: "#AAB4BF",

  // Status colours: use only where the meaning requires it.
  success: "#2E7D32",
  warning: "#B7791F",
  danger: "#C62828",
  info: "#2878A8",
};

// Chart colours in a fixed order: blue, gold and secondary blue, then lighter tints of
// blue and gold. Extra categories fold into a neutral "Other". Shared by every dashboard.
export const CHART_SERIES = [COLORS.primary, COLORS.gold, COLORS.secondary, "#A9C1DE", "#E3CF87"];

// Registers the colours with Tailwind, which is loaded from the CDN script in
// public/index.html. Call once before the app renders.
export function applyTheme() {
  if (!window.tailwind) return;
  window.tailwind.config = {
    theme: {
      extend: {
        // A bare `border` or `divide-y` class uses the standard border colour.
        borderColor: { DEFAULT: COLORS.line },
        divideColor: { DEFAULT: COLORS.line },
        colors: {
          navy: COLORS.navy,
          primary: { DEFAULT: COLORS.primary, hover: COLORS.primaryHover },
          secondary: COLORS.secondary,
          gold: COLORS.gold,
          page: COLORS.page,
          surface: COLORS.surface,
          line: COLORS.line,
          ink: { DEFAULT: COLORS.ink, secondary: COLORS.inkSecondary, muted: COLORS.inkMuted },
          success: COLORS.success,
          warning: COLORS.warning,
          danger: COLORS.danger,
          info: COLORS.info,
          footer: { DEFAULT: COLORS.footer, text: COLORS.footerText, secondary: COLORS.footerSecondary },
        },
      },
    },
  };
}
