/**
 * BBT DESIGN SYSTEM — THEME CONSTANTS
 *
 * Industrial geometric style: hard shadows, zero radius, strict 4px grid
 * Geometry carries hierarchy. Color carries semantics. Typography carries order.
 */

// === COLORS ===
export const COLORS = {
  // Primary — Signal Red: actions and emphasis
  red: "#cc0000",
  redLight: "#e02020",
  redDark: "#990000",

  // Secondary — Brass/Gold, the color of achievement
  gold: "#d4a017",
  goldLight: "#e6b830",
  goldDark: "#b08610",

  // Neutrals — Industrial palette
  black: "#1a1a1a",
  industrialBlack: "#2b2b2b",
  metalWhite: "#f2ede6",
  concrete: "#fdfbf8",
  pureWhite: "#ffffff",

  // Accent — Military Green (use sparingly)
  militaryGreen: "#4a6741",
  militaryGreenLight: "#5a7a50",

  // Velocity — Electric signals cutting through industrial matter
  electricCyan: "#3a8a9a",
  velocityOrange: "#b86030",
  signalGreen: "#5a8a3a",

  // Semantic
  statusGreen: "#3d8b37",
  statusAmber: "#cc8800",
  statusRed: "#cc0000",
} as const;

// === TYPOGRAPHY ===
export const FONT = {
  sans: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", "Arial", sans-serif',
  mono: '"Noto Sans Mono SC", "SF Mono", "Menlo", "Consolas", monospace',
} as const;

export const WEIGHT = {
  light: 300,
  regular: 400,
  bold: 700,
  black: 900,
} as const;

// === SPACING (4px grid) ===
export const SPACE = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
} as const;

// === BORDERS ===
export const BORDER = {
  standard: "2px solid",
  heavy: "3px solid",
  hairline: "1px solid",
} as const;

// === GEOMETRY (no border-radius) ===
export const RADIUS = {
  none: "0px",
} as const;

// === ANIMATION DURATIONS ===
export const DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  ceremonial: 1.5,
} as const;

// === EASING ===
export const EASING = {
  launch: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
  decelerate: [0.0, 0.0, 0.35, 1.0] as [number, number, number, number],
  accelerate: [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
  sharp: [0.4, 0.0, 0.6, 1.0] as [number, number, number, number],
} as const;

// === Z-INDEX LAYERS ===
export const Z_INDEX = {
  base: 0,
  content: 10,
  overlay: 100,
  navigation: 200,
  modal: 300,
  alert: 400,
} as const;

// === SHADOWS (hard, industrial + velocity glow) ===
export const SHADOW = {
  none: "none",
  small: "2px 2px 0px rgba(0,0,0,0.15)",
  medium: "4px 4px 0px rgba(0,0,0,0.2)",
  large: "6px 6px 0px rgba(0,0,0,0.25)",
  red: "4px 4px 0px #cc0000",
  gold: "4px 4px 0px #d4a017",
  cyan: "4px 4px 0px #3a8a9a",
  signal: "0 0 10px rgba(90,138,58,0.3)",
  orange: "4px 4px 0px #b86030",
} as const;

// === DESIGN TOKENS (composed) ===
export const TOKENS = {
  buttonPrimary: {
    bg: COLORS.red,
    color: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.redDark}`,
    shadow: SHADOW.red,
    fontFamily: FONT.sans,
    fontWeight: WEIGHT.black,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  buttonSecondary: {
    bg: COLORS.pureWhite,
    color: COLORS.black,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
    fontFamily: FONT.sans,
    fontWeight: WEIGHT.bold,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  buttonGhost: {
    bg: "transparent",
    color: COLORS.black,
    border: `${BORDER.standard} ${COLORS.industrialBlack}`,
    fontFamily: FONT.sans,
    fontWeight: WEIGHT.bold,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  cardDefault: {
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
  },
  cardAlert: {
    bg: COLORS.red,
    border: `${BORDER.heavy} ${COLORS.redDark}`,
    color: COLORS.pureWhite,
  },
  inputDefault: {
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.industrialBlack}`,
    fontFamily: FONT.mono,
  },
  headingHero: {
    fontFamily: FONT.sans,
    fontWeight: WEIGHT.black,
    letterSpacing: "-0.02em",
    lineHeight: 0.9,
  },
  label: {
    fontFamily: FONT.sans,
    fontWeight: WEIGHT.bold,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    fontSize: "11px",
  },
} as const;
