'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DesignSystemDocs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/design-system">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Style Guide
            </Button>
          </Link>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1>Live Production Manager Design System</h1>
          
          <p>This design system provides a consistent set of UI components, styles, and patterns for building interfaces in the Live Production Manager application.</p>
          
          <h2>Overview</h2>
          
          <p>The design system is built on several key principles:</p>
          
          <ol>
            <li><strong>Consistency</strong>: A unified visual language across the application</li>
            <li><strong>Flexibility</strong>: Components that adapt to different contexts</li>
            <li><strong>Accessibility</strong>: Interfaces that work for all users</li>
            <li><strong>Efficiency</strong>: Reusable patterns that speed up development</li>
          </ol>
          
          <h2>Core Elements</h2>
          
          <h3>Design Tokens</h3>
          
          <p>Design tokens are located in <code>src/styles/tokens.ts</code> and define the foundational values for:</p>
          
          <ul>
            <li>Colors</li>
            <li>Typography</li>
            <li>Spacing</li>
            <li>Shadows</li>
            <li>Border radius</li>
            <li>Z-index</li>
          </ul>
          
          <p>These tokens are integrated with Tailwind CSS through the configuration file.</p>
          
          <h3>Component Library</h3>
          
          <p>The component library includes the following UI elements:</p>
          
          <ul>
            <li><strong>Typography</strong>: Headings, body text, and text styles</li>
            <li><strong>Colors</strong>: Primary, secondary, and semantic color system</li>
            <li><strong>Buttons</strong>: Various button variants, sizes, and states</li>
            <li><strong>Badges</strong>: Status indicators and labels</li>
            <li><strong>Cards</strong>: Content containers with different variants</li>
            <li><strong>Dialogs</strong>: Modal interfaces in standard, panel, fullscreen, and mini variants</li>
            <li><strong>Forms</strong>: Input fields, labels, and validation components</li>
            <li><strong>Empty States</strong>: Components for when no content is available</li>
            <li><strong>Loading States</strong>: Spinners and progress indicators</li>
            <li><strong>Progress</strong>: Progress bars with different variants</li>
            <li><strong>Container</strong>: Layout containers for consistent spacing</li>
          </ul>
          
          <h2>Implementation</h2>
          
          <p>All components are located in the <code>src/components/ui/</code> directory. Each component is implemented as a standalone React component with TypeScript typing.</p>
          
          <h3>Component Structure</h3>
          
          <p>A typical component follows this structure:</p>
          
          <div className="bg-muted p-4 rounded-md overflow-auto">
            <pre className="text-xs">
{`// Import dependencies
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
}`}
            </pre>
          </div>
          
          <h2>Usage</h2>
          
          <h3>Style Guide</h3>
          
          <p>The design system includes a comprehensive style guide at <code>/design-system</code> in the application. This guide serves as living documentation for the component library, showing:</p>
          
          <ul>
            <li>Available components</li>
            <li>Variants and configurations</li>
            <li>Usage examples</li>
            <li>Visual reference</li>
          </ul>
          
          <h3>Using Components</h3>
          
          <p>To use components in your application:</p>
          
          <ol>
            <li>Import the component from the UI directory:</li>
          </ol>
          
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-xs">
              {`import { Button } from "@/components/ui/button";`}
            </pre>
          </div>
          
          <p className="mt-4 font-medium">2. Use the component with appropriate props:</p>
          
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-xs">
              {`<Button variant="primary" size="lg">
  Click Me
</Button>`}
            </pre>
          </div>
          
          <h2>Extending the Design System</h2>
          
          <p>When adding new components or modifying existing ones:</p>
          
          <ol>
            <li>Follow the established patterns for component structure</li>
            <li>Use design tokens for values like colors, spacing, etc.</li>
            <li>Implement variants using class-variance-authority</li>
            <li>Add proper TypeScript typing</li>
            <li>Update the style guide to showcase the new component</li>
          </ol>
          
          <h2>Best Practices</h2>
          
          <ul>
            <li>Use design tokens instead of hardcoded values</li>
            <li>Follow the component composition patterns</li>
            <li>Maintain accessibility standards</li>
            <li>Test components across different viewport sizes</li>
            <li>Document any special considerations for components</li>
          </ul>
          
          <h2>Development Roadmap</h2>
          
          <p>Future enhancements to the design system include:</p>
          
          <ul>
            <li>Dark mode support</li>
            <li>Additional component variants</li>
            <li>Animation standards</li>
            <li>Responsive design patterns</li>
            <li>More complex component compositions</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 