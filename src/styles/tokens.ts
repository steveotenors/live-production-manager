// src/styles/tokens.ts
export const tokens = {
    colors: {
      primary: {
        DEFAULT: '#2563eb',
        foreground: '#ffffff',
      },
      secondary: {
        DEFAULT: '#6b7280',
        foreground: '#ffffff',
      },
      success: {
        DEFAULT: '#10b981',
        foreground: '#ffffff',
      },
      info: {
        DEFAULT: '#2563eb',
        foreground: '#ffffff',
      },
      warning: {
        DEFAULT: '#f59e0b',
        foreground: '#ffffff',
      },
      danger: {
        DEFAULT: '#dc2626',
        foreground: '#ffffff',
      },
      background: {
        DEFAULT: '#ffffff',
        alt: '#f9fafb',
      },
      foreground: {
        DEFAULT: '#0f172a',
        muted: '#64748b',
      },
      border: {
        DEFAULT: '#e2e8f0',
      },
      muted: {
        DEFAULT: '#f1f5f9',
        foreground: '#64748b',
      },
    },
    spacing: {
      0: '0',
      0.5: '0.125rem',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
    },
    typography: {
      fontFamily: {
        sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: 'SF Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        relaxed: '1.75',
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
      },
    },
    animations: {
      duration: {
        fast: '100ms',
        default: '150ms',
        medium: '200ms',
        slow: '300ms',
        attention: '400ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    elevation: {
      0: 'none',
      1: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
      2: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      3: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    },
  };