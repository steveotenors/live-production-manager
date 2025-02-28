# Live Production Manager Design System

This design system provides a consistent set of UI components, styles, and patterns for building interfaces in the Live Production Manager application.

## Overview

The design system is built on several key principles:

1. **Consistency**: A unified visual language across the application
2. **Flexibility**: Components that adapt to different contexts
3. **Accessibility**: Interfaces that work for all users
4. **Efficiency**: Reusable patterns that speed up development

## Core Elements

### Design Tokens

Design tokens are located in `src/styles/tokens.ts` and define the foundational values for:

- Colors
- Typography
- Spacing
- Shadows
- Border radius
- Z-index

These tokens are integrated with Tailwind CSS through the configuration file.

### Component Library

The component library includes the following UI elements:

- **Typography**: Headings, body text, and text styles
- **Colors**: Primary, secondary, and semantic color system
- **Buttons**: Various button variants, sizes, and states
- **Badges**: Status indicators and labels
- **Cards**: Content containers with different variants
- **Dialogs**: Modal interfaces in standard, panel, fullscreen, and mini variants
- **Forms**: Input fields, labels, and validation components
- **Empty States**: Components for when no content is available
- **Loading States**: Spinners and progress indicators
- **Progress**: Progress bars with different variants
- **Container**: Layout containers for consistent spacing

## Implementation

All components are located in the `src/components/ui/` directory. Each component is implemented as a standalone React component with TypeScript typing.

### Component Structure

A typical component follows this structure:

```tsx
// Import dependencies
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

// Define variants using class-variance-authority
const componentVariants = cva("base-styles", {
  variants: {
    variant: {
      default: "default-styles",
      secondary: "secondary-styles",
      // other variants...
    },
    size: {
      sm: "small-styles",
      default: "default-styles",
      lg: "large-styles",
      // other sizes...
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// Define component props including variants
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Additional props...
}

// Component implementation
export function Component({
  className,
  variant,
  size,
  ...props
}: ComponentProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## Usage

### Style Guide

The design system includes a comprehensive style guide at `/design-system` in the application. This guide serves as living documentation for the component library, showing:

- Available components
- Variants and configurations
- Usage examples
- Visual reference

### Using Components

To use components in your application:

1. Import the component from the UI directory:

```tsx
import { Button } from "@/components/ui/button";
```

2. Use the component with appropriate props:

```tsx
<Button variant="primary" size="lg">
  Click Me
</Button>
```

## Extending the Design System

When adding new components or modifying existing ones:

1. Follow the established patterns for component structure
2. Use design tokens for values like colors, spacing, etc.
3. Implement variants using class-variance-authority
4. Add proper TypeScript typing
5. Update the style guide to showcase the new component

## Best Practices

- Use design tokens instead of hardcoded values
- Follow the component composition patterns
- Maintain accessibility standards
- Test components across different viewport sizes
- Document any special considerations for components

## Development Roadmap

Future enhancements to the design system include:

- Dark mode support
- Additional component variants
- Animation standards
- Responsive design patterns
- More complex component compositions 