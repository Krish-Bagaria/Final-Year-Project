// 🎨 Real Estate Platform - Styles Constants
// Professional theme with corporate-grade design

export const COLORS = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  // Secondary Colors (Real Estate Theme)
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Main secondary
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Accent Colors
  accent: {
    gold: '#f59e0b',
    green: '#10b981',
    red: '#ef4444',
    purple: '#8b5cf6',
    orange: '#f97316',
  },
  
  // Status Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Real Estate Specific Colors
  realEstate: {
    luxury: '#d4af37',
    premium: '#8b5cf6',
    standard: '#3b82f6',
    budget: '#10b981',
    commercial: '#f59e0b',
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const SPACING = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

export const BORDER_RADIUS = {
  none: '0px',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

export const ANIMATIONS = {
  // Framer Motion Variants
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideInFromTop: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  
  slideInFromBottom: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  
  slideInFromLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  
  slideInFromRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  
  // Stagger animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  
  // Hover animations
  hoverScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
  
  hoverLift: {
    whileHover: { y: -5 },
    transition: { duration: 0.2 },
  },
  
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  secondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  luxury: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
  premium: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  sunset: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  ocean: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
} as const;

export const COMPONENT_STYLES = {
  // Button styles
  button: {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-800 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    ghost: 'text-primary-500 hover:bg-primary-50 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
  },
  
  // Card styles
  card: {
    base: 'bg-white rounded-xl shadow-md border border-neutral-200 p-6',
    elevated: 'bg-white rounded-xl shadow-lg border border-neutral-200 p-6',
    interactive: 'bg-white rounded-xl shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer',
  },
  
  // Input styles
  input: {
    base: 'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200',
    error: 'w-full px-3 py-2 border border-error-500 rounded-lg focus:ring-2 focus:ring-error-500 focus:border-transparent transition-colors duration-200',
  },
  
  // Property card styles
  propertyCard: {
    base: 'bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group',
    image: 'w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300',
    content: 'p-4',
    price: 'text-2xl font-bold text-primary-600',
    location: 'text-secondary-600 text-sm',
    features: 'flex flex-wrap gap-2 mt-2',
    feature: 'bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium',
  },
} as const;

export const LAYOUT = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 lg:py-16',
  grid: {
    '2': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    '3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    '4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  },
} as const;

// Export all styles as a single object for easy access
export const STYLES = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
  gradients: GRADIENTS,
  components: COMPONENT_STYLES,
  layout: LAYOUT,
} as const;

export default STYLES;
