/**
 * Design System Validator
 * 
 * This utility provides functions to validate design system implementation
 * across components and provide guidance for maintaining consistency.
 */

import { tokens } from '@/styles/tokens';

/**
 * Color tokens that should be used instead of hardcoded colors
 */
export const validColorTokens = [
  // Primary colors
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  
  // Background colors
  'background',
  'foreground',
  'muted',
  'muted-foreground',
  
  // UI colors 
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'border',
  'input',
  'ring',
  
  // Status colors
  'success',
  'success-foreground',
  'info',
  'info-foreground',
  'warning',
  'warning-foreground',
  'destructive',
  'destructive-foreground',
  
  // Accent colors
  'accent',
  'accent-foreground',
];

/**
 * Spacing tokens that should be used instead of arbitrary values
 */
export const validSpacingTokens = [
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '8',
  '10',
  '12',
  '16',
  '20',
  '24',
];

/**
 * Font size tokens that should be used instead of arbitrary values
 */
export const validFontSizeTokens = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
];

/**
 * Font weight tokens that should be used instead of arbitrary values
 */
export const validFontWeightTokens = [
  'normal',
  'medium',
  'semibold',
  'bold',
];

/**
 * Validates if a component's Tailwind classes follow design system guidelines
 * 
 * @param className - The class string to validate
 * @returns Validation results with warnings and suggestions
 */
export function validateClassNames(className: string): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const classes = className.split(' ');
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check for hardcoded colors
  const colorRegex = /^(bg|text|border|ring|shadow|fill|stroke)-([a-z]+(-[0-9]{3})?|#[0-9a-f]{3,6}|rgba?\([^)]+\))$/;
  const hardcodedColors = classes.filter(cls => {
    const match = cls.match(colorRegex);
    if (!match) return false;
    
    // Check if it's using a valid token
    return match && !validColorTokens.some(token => cls.includes(token));
  });
  
  if (hardcodedColors.length > 0) {
    warnings.push(`Found hardcoded colors: ${hardcodedColors.join(', ')}`);
    suggestions.push('Use design system color tokens (e.g., bg-primary, text-destructive)');
  }
  
  // Check for arbitrary spacing values
  const spacingRegex = /^(p|m|gap)[xy]?-\[([^\]]+)\]$/;
  const arbitrarySpacing = classes.filter(cls => cls.match(spacingRegex));
  
  if (arbitrarySpacing.length > 0) {
    warnings.push(`Found arbitrary spacing values: ${arbitrarySpacing.join(', ')}`);
    suggestions.push('Use design system spacing tokens (e.g., p-4, mx-6, gap-2)');
  }
  
  // Check for arbitrary font sizes
  const fontSizeRegex = /^text-\[([^\]]+)\]$/;
  const arbitraryFontSizes = classes.filter(cls => cls.match(fontSizeRegex));
  
  if (arbitraryFontSizes.length > 0) {
    warnings.push(`Found arbitrary font sizes: ${arbitraryFontSizes.join(', ')}`);
    suggestions.push('Use design system font size tokens (e.g., text-sm, text-lg)');
  }
  
  // Check for arbitrary rounded corners
  const roundedRegex = /^rounded(-[a-z]+)?-\[([^\]]+)\]$/;
  const arbitraryRounded = classes.filter(cls => cls.match(roundedRegex));
  
  if (arbitraryRounded.length > 0) {
    warnings.push(`Found arbitrary border radius values: ${arbitraryRounded.join(', ')}`);
    suggestions.push('Use design system radius tokens (e.g., rounded-md, rounded-lg)');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
  };
}

/**
 * Design system patterns that should be followed
 */
export const designPatterns = {
  buttons: {
    variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    sizes: ['xs', 'sm', 'default', 'lg', 'xl', 'icon'],
  },
  inputs: {
    wrapperPattern: 'space-y-2 with Label + FormDescription if needed',
    validation: 'Use FormMessage for validation errors',
  },
  cards: {
    composition: 'Use CardHeader, CardTitle, CardDescription, CardContent, CardFooter',
    spacing: 'CardHeader (p-6), CardContent (p-6 pt-0), CardFooter (p-6 pt-0)',
  },
  dialogs: {
    variants: ['standard', 'panel', 'fullscreen', 'mini'],
    composition: 'DialogHeader, DialogTitle, DialogDescription, DialogFooter',
  },
  alerts: {
    variants: ['default', 'success', 'info', 'warning', 'destructive'],
    composition: 'AlertTitle + AlertDescription',
  },
  forms: {
    composition: 'FormField > FormItem > FormLabel + FormControl + FormDescription/FormMessage',
    validation: 'Use form.formState.errors with FormMessage',
  },
};

/**
 * Component checklist for ensuring design system compliance
 */
export const componentChecklist = {
  accessibility: [
    'Has appropriate ARIA attributes',
    'Works with keyboard navigation',
    'Has sufficient color contrast',
    'Includes proper focus states',
  ],
  responsiveness: [
    'Adapts appropriately across breakpoints',
    'Uses responsive spacing and typography',
    'Touch targets are large enough on mobile (min 44px)',
  ],
  performance: [
    'Avoids unnecessary re-renders',
    'Uses appropriate loading states',
    'Properly handles async operations',
  ],
  interaction: [
    'Provides appropriate feedback for user actions',
    'Has consistent hover/focus/active states',
    'Handles loading and error states appropriately',
  ],
  composition: [
    'Follows component composition patterns',
    'Properly forwards refs when needed',
    'Uses slot pattern appropriately for customization',
  ],
};

/**
 * Design token usage guide with examples
 */
export const designTokenUsage = {
  colors: {
    primary: {
      usage: 'Main brand colors and primary actions',
      example: 'bg-primary text-primary-foreground',
    },
    secondary: {
      usage: 'Secondary actions and highlights',
      example: 'bg-secondary text-secondary-foreground',
    },
    muted: {
      usage: 'Subdued elements, backgrounds, disabled states',
      example: 'bg-muted text-muted-foreground',
    },
    accent: {
      usage: 'Highlights and accents',
      example: 'bg-accent text-accent-foreground',
    },
    destructive: {
      usage: 'Errors, deletions, destructive actions',
      example: 'bg-destructive text-destructive-foreground',
    },
    success: {
      usage: 'Success states, confirmations',
      example: 'bg-success text-success-foreground',
    },
    info: {
      usage: 'Informational states, notifications',
      example: 'bg-info text-info-foreground',
    },
    warning: {
      usage: 'Warning states, cautions',
      example: 'bg-warning text-warning-foreground',
    },
  },
  
  spacing: {
    componentInternals: {
      usage: 'Use 0.5, 1, 2 (2px, 4px, 8px)',
      example: 'p-2 gap-1',
    },
    betweenComponents: {
      usage: 'Use 4, 6 (16px, 24px)',
      example: 'space-y-4',
    },
    sections: {
      usage: 'Use 8, 12, 16 (32px, 48px, 64px)',
      example: 'py-12',
    },
  },
  
  typography: {
    headings: {
      usage: 'For page and section titles',
      example: 'text-2xl font-semibold, text-xl font-medium',
    },
    body: {
      usage: 'For main content text',
      example: 'text-base, text-sm text-muted-foreground',
    },
    captions: {
      usage: 'For supporting text',
      example: 'text-xs text-muted-foreground',
    },
  },
  
  elevation: {
    low: {
      usage: 'Subtle elevation for cards, buttons',
      example: 'shadow-sm',
    },
    medium: {
      usage: 'Medium elevation for popovers, dropdowns',
      example: 'shadow',
    },
    high: {
      usage: 'High elevation for modals, dialogs',
      example: 'shadow-lg',
    },
  },
  
  animation: {
    transitions: {
      usage: 'Smooth state changes',
      example: 'transition-colors duration-150',
    },
    hover: {
      usage: 'Interactive element hover states',
      example: 'hover:bg-accent hover:text-accent-foreground',
    },
    focus: {
      usage: 'Focus states for accessibility',
      example: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    },
  },
}; 