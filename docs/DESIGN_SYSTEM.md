# Live Production Manager - Design System & Engineering Guide

Version 1.0 | Last Updated: February 27, 2025

## Table of Contents

### Design System
1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Component Library](#component-library)
6. [Space & Layout Foundations](#space--layout-foundations)
7. [Responsive Design System](#responsive-design-system)
8. [User Experience Patterns](#user-experience-patterns)
9. [Application Structure & Patterns](#application-structure--patterns)
10. [Accessibility & Inclusive Design](#accessibility--inclusive-design)
11. [Voice & Tone Guidelines](#voice--tone-guidelines)

### Engineering Guidelines
12. [Code Style & Formatting](#code-style--formatting)
13. [Project Structure](#project-structure)
14. [TypeScript & Type Safety](#typescript--type-safety)
15. [React Components](#react-components)
16. [Supabase Integration](#supabase-integration)
17. [State Management](#state-management)
18. [Error Handling](#error-handling)
19. [File Storage](#file-storage)
20. [Documentation](#documentation)
21. [Database Schema Management](#database-schema-management)
22. [Performance Considerations](#performance-considerations)
23. [Security Best Practices](#security-best-practices)

### Implementation & Governance
24. [User Testing & Validation](#user-testing--validation)
25. [Governance & Contribution](#governance--contribution)
26. [Roadmap & Future Enhancements](#roadmap--future-enhancements)
27. [Related Resources](#related-resources)
28. [Glossary](#glossary)
29. [Appendix: Implementation Checklist](#appendix-implementation-checklist)

## Introduction

This document outlines the comprehensive design system and engineering guidelines used in the Live Production Manager application. It serves as a reference for understanding the UI components, patterns, styles, and code standards to ensure consistency across the application and guide future development. The system has been enhanced with modern best practices inspired by Frame.io's clean aesthetics, macOS Finder's intuitive navigation, and X's smooth user experience.

### Purpose of this Guide

This guide aims to:

- **Establish consistency** across the Live Production Manager application
- **Streamline development** by providing reusable components, patterns, and coding standards
- **Improve user experience** by addressing common pain points and incorporating best practices
- **Ensure accessibility** for all users regardless of abilities or devices
- **Accelerate design and development** through standardized solutions
- **Facilitate collaboration** between designers and developers

### How to Use this Guide

This guide serves as the single source of truth for the Live Production Manager's visual language, component library, and code standards. When designing or developing new features:

1. **Start with existing patterns** - Check if there's an existing component or pattern
2. **Follow established principles** - Ensure new designs align with our core principles
3. **Maintain consistency** - Use the documented styles, spacing, and interactions
4. **Adhere to code standards** - Follow the defined coding practices for maintainability
5. **Contribute improvements** - Suggest enhancements to continually refine the system

### Version and Updates

- **Current Version**: 1.0.0
- **Last Updated**: February 27, 2025
- **Change Log**: [Link to version history document]

For questions or contributions to this guide, please contact the design system team at [designteam@company.com].

## Design Principles

The Live Production Manager follows these core design principles:

### Core Principles

* **Clarity** - Clean interfaces with clear visual hierarchy and reduced visual noise
* **Consistency** - Reusable components and predictable interaction patterns across the application
* **Efficiency** - Streamlined workflows with contextual actions and progressive disclosure
* **Accessibility** - Components designed to WCAG standards with keyboard navigation and screen reader support
* **Fluidity** - Smooth transitions and responsive feedback that enhance the feeling of direct manipulation
* **Hierarchy** - Clear information architecture that helps users understand content relationships

### User-Centered Approach

Our design system is built around addressing common user pain points:

* **Minimize cognitive load** - Simplify interfaces to reduce mental effort required
* **Prevent errors** - Design interfaces that guide users toward correct actions
* **Provide feedback** - Communicate system status clearly at all times
* **Respect user attention** - Focus on essential information and actions
* **Support recovery** - Make it easy to undo actions and recover from mistakes
* **Build trust** - Create predictable patterns that establish user confidence

### Performance as Design

We consider performance a fundamental aspect of good design:

* **Perceived performance** - Use techniques like skeleton loading to improve perceived speed
* **Actual performance** - Optimize assets and code to ensure responsive interactions
* **Loading priorities** - Ensure critical UI elements and content load first
* **Offline capabilities** - Design for resilience during network interruptions

## Color System

The color system uses a refined palette with purposeful application of color to guide attention and communicate status.

### Base Colors

* **Primary (#2563eb)**: Key actions, interactive elements, and focus states
* **Secondary (#6b7280)**: Supporting elements and secondary actions
* **Background (#ffffff)**: Primary surface color (light mode)
* **Background-alt (#f9fafb)**: Secondary surface color for cards and containers
* **Foreground (#0f172a)**: Primary text color
* **Muted (#64748b)**: Secondary text and disabled states

### Status Colors

A streamlined set of semantic colors for consistent status indication:

* **Success (#10b981)**: Completed tasks, successful actions
* **Info (#2563eb)**: Information, neutral status updates
* **Warning (#f59e0b)**: Requires attention, non-critical issues
* **Danger (#dc2626)**: Critical issues, destructive actions

### Elevation

Our surface elevation system uses subtle shadows to create hierarchy:

* **Level 0**: No shadow, flush with background
* **Level 1**: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
* **Level 2**: `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`
* **Level 3**: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`

### Dark Mode

The system includes a true dark mode palette that inverts the brightness values while maintaining contrast ratios:

* **Background (dark)**: `#121212`
* **Background-alt (dark)**: `#1e1e1e`
* **Foreground (dark)**: `#f3f4f6`

## Typography

The typography system uses a modern, highly readable sans-serif with consistent scale and weights.

### Font Family
* Primary: Inter (with system font fallback)
* Monospace: SF Mono, Menlo, Monaco, Consolas (for code and technical content)

### Type Scale
A harmonious scale based on 1.25 ratio:

* **xs**: 0.75rem (12px)
* **sm**: 0.875rem (14px)
* **base**: 1rem (16px)
* **lg**: 1.125rem (18px)
* **xl**: 1.25rem (20px)
* **2xl**: 1.5rem (24px)
* **3xl**: 1.875rem (30px)
* **4xl**: 2.25rem (36px)

### Font Weights
* Regular: 400 (body text, UI elements)
* Medium: 500 (emphasis, interactive elements)
* Semibold: 600 (sub-headings, important UI elements)
* Bold: 700 (headings, key UI elements)

### Line Heights
* **tight**: 1.2 (headings)
* **normal**: 1.5 (body text)
* **relaxed**: 1.75 (larger text blocks)

### Letter Spacing
* **tight**: -0.025em (large headings)
* **normal**: 0 (default)
* **wide**: 0.025em (all-caps, small text)

### Text Styles

Common text styles for consistent application:

* **page-title**: 2xl/3xl weight-bold, tight line height
* **section-title**: xl/2xl weight-semibold, tight line height
* **card-title**: lg/xl weight-semibold, tight line height
* **body-default**: base weight-regular, normal line height
* **body-strong**: base weight-medium, normal line height
* **caption**: sm weight-regular, normal line height
* **overline**: xs weight-medium, wide letter spacing, uppercase

## Component Library

The component library follows atomic design principles, with a focus on accessibility, consistency, and flexibility.

### Core Components

#### Button

Buttons use subtle depth and transitions to enhance affordance with clear hierarchy.

##### Variants

* **Primary**: High-emphasis, for main actions and CTAs
* **Secondary**: Medium-emphasis, for secondary actions
* **Outline**: Low-emphasis, for tertiary actions within content
* **Ghost**: Minimal visual footprint for interface actions
* **Link**: Behaves like a text link, for navigational actions
* **Destructive**: For permanent deletion or irreversible actions

```jsx
<Button>Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
<Button variant="destructive">Delete</Button>
```

##### Sizes

* **XS**: Very compact (h-7, text-xs, px-2.5)
* **SM**: Compact (h-8, text-sm, px-3)
* **MD** (default): Standard (h-10, text-sm, px-4)
* **LG**: Emphasis (h-11, text-base, px-5)
* **XL**: High emphasis (h-12, text-base, px-6)
* **Icon**: For icon-only buttons (square, with appropriate padding)

##### States

* **Default**: Normal state
* **Hover**: Slightly darker/lighter background with smooth transition
* **Focus**: Visible focus ring for keyboard navigation
* **Active**: Pressed state with subtle inset effect
* **Disabled**: Reduced opacity with "not-allowed" cursor
* **Loading**: Loading indicator with text

```jsx
<Button size="sm">Small Button</Button>
<Button>Default Button</Button>
<Button size="lg">Large Button</Button>
<Button size="icon"><Plus className="h-4 w-4" /></Button>

{/* With icon */}
<Button>
  <Upload className="h-4 w-4 mr-2" />
  Upload
</Button>

{/* Loading state */}
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

#### Input Fields

Form controls with consistent styling, validation states, and enhanced interaction patterns.

##### Text Input

```jsx
<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={handleChange}
  aria-label="Text input"
  className="w-full"
/>

{/* With label and helper text */}
<div className="space-y-2">
  <Label htmlFor="email">Email address</Label>
  <Input 
    id="email"
    type="email" 
    placeholder="you@example.com" 
    value={email}
    onChange={handleEmailChange}
  />
  <p className="text-sm text-muted-foreground">We'll never share your email.</p>
</div>

{/* With validation */}
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input 
    id="username"
    type="text" 
    placeholder="username" 
    value={username}
    onChange={handleUsernameChange}
    className={hasError ? "border-danger focus-visible:ring-danger" : ""}
  />
  {hasError && (
    <p className="text-sm text-danger">Username is already taken.</p>
  )}
</div>
```

##### Textarea

Enhanced multi-line text input with auto-resize capability.

```jsx
<Textarea
  placeholder="Enter description"
  rows={4}
  value={value}
  onChange={handleChange}
  className="w-full resize-vertical min-h-[100px]"
/>
```

##### Select

Dropdown selection with enhanced keyboard navigation and search capability.

```jsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Categories</SelectLabel>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
      <SelectItem value="option3">Option 3</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

##### Form Field

Composition pattern for form fields with consistent spacing and validation.

```jsx
<FormField
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="Email address" {...field} />
      </FormControl>
      {fieldState.error && (
        <FormMessage>{fieldState.error.message}</FormMessage>
      )}
      <FormDescription>We'll never share your email.</FormDescription>
    </FormItem>
  )}
/>
```

#### Form Best Practices

Based on user research, our forms follow these principles to minimize friction:

* **Progressive disclosure** - Show only necessary fields initially, reveal additional fields as needed
* **Contextual validation** - Validate fields at appropriate times (on blur for format checks, on submit for business logic)
* **Meaningful defaults** - Pre-populate fields with smart defaults when possible
* **Clear error recovery** - Provide specific error messages and guidance on how to fix issues
* **Logical grouping** - Group related fields together with clear section headings
* **Input masks** - Use input masks for formatted data (phone numbers, dates, etc.)
* **Autosave** - Implement autosave for long forms to prevent data loss
* **Minimal required fields** - Limit required fields to essential information only

```jsx
// Example of progressive disclosure
<Form>
  <FormSection title="Basic Information">
    {/* Essential fields */}
  </FormSection>
  
  {showAdvancedOptions ? (
    <FormSection title="Advanced Options">
      {/* Optional fields */}
    </FormSection>
  ) : (
    <Button 
      variant="ghost" 
      onClick={() => setShowAdvancedOptions(true)}
      className="flex items-center gap-1"
    >
      <PlusIcon className="h-4 w-4" />
      <span>Show Advanced Options</span>
    </Button>
  )}
</Form>
```

#### Card

Versatile container for grouping related content with a range of presets for common use cases.

```jsx
<Card className="overflow-hidden transition-all hover:shadow-md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description text that explains the card content</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here with appropriate spacing.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="ghost">Cancel</Button>
    <Button>Continue</Button>
  </CardFooter>
</Card>
```

##### Card Variants

* **Default**: Standard card with subtle border and shadow
* **Interactive**: With hover and focus states for clickable cards
* **Bordered**: Stronger border emphasis, less shadow
* **Flat**: No shadow, just border
* **Elevated**: More prominent shadow for higher visual hierarchy

#### Badge

Compact visual indicators for status, categories, or counts.

```jsx
<Badge>Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Error</Badge>
```

#### Dialog & Modal System

A flexible layering system for focused interactions, with reduced visual weight and smoother transitions.

```jsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        This dialog presents focused content for a specific task.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4 space-y-4">
      <p>Content goes here with appropriate spacing and structure.</p>
      <Input placeholder="Example input" />
    </div>
    <DialogFooter>
      <Button variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleAction}>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

##### Dialog Variants

* **Standard**: Centered, medium-width dialog
* **Panel**: Side panel that slides in from edge
* **Fullscreen**: For complex workflows needing more space
* **Mini**: Compact dialog for simple actions/confirmations

#### Contextual Menus

Enhanced dropdown for contextual actions with improved organization and keyboard support.

```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
      <span className="sr-only">Open menu</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <Edit className="mr-2 h-4 w-4" />
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Copy className="mr-2 h-4 w-4" />
        <span>Duplicate</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Share className="mr-2 h-4 w-4" />
        <span>Share</span>
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-danger focus:bg-danger/10">
      <Trash className="mr-2 h-4 w-4" />
      <span>Delete</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Navigation Components

##### Tabs

Enhanced tabs with animated transitions and responsive variations.

```jsx
<Tabs defaultValue="tab1" className="w-full">
  <TabsList className="grid grid-cols-2 lg:w-auto lg:inline-flex">
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1" className="mt-4 space-y-4">
    <h3 className="text-lg font-medium">Overview content</h3>
    <p>Tab 1 content with appropriate spacing and structure.</p>
  </TabsContent>
  <TabsContent value="tab2" className="mt-4 space-y-4">
    <h3 className="text-lg font-medium">Analytics content</h3>
    <p>Tab 2 content with appropriate spacing and structure.</p>
  </TabsContent>
</Tabs>
```

##### Breadcrumbs

Hierarchical navigation path with context.

```jsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Project</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

#### Feedback Components

##### Toast Notifications

Non-disruptive notifications with improved positioning and timing.

```jsx
const { toast } = useToast();
// Usage
toast({
  title: "Success",
  description: "Changes saved successfully",
  variant: "default", // default, success, error, warning, info
  action: <ToastAction altText="Undo">Undo</ToastAction>,
  duration: 5000,
});
```

##### Loading States

Consistent loading patterns for different contexts.

```jsx
{/* Skeleton loaders */}
<div className="space-y-3">
  <Skeleton className="h-8 w-full max-w-sm" />
  <Skeleton className="h-4 w-full max-w-md" />
  <Skeleton className="h-4 w-3/4" />
</div>

{/* Ghost cards */}
<Card className="animate-pulse">
  <CardHeader>
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-4 w-3/4" />
  </CardHeader>
  <CardContent className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
  </CardContent>
</Card>
```

### Layouts & Patterns

#### Layout Components

Standardized layout patterns for consistent page structures:

##### Container System

```jsx
<Container>
  <p>Default centered container with responsive padding</p>
</Container>

<Container size="sm">
  <p>Narrow container for focused content (max-w-screen-sm)</p>
</Container>

<Container size="md">
  <p>Medium width container (max-w-screen-md)</p>
</Container>

<Container size="lg">
  <p>Wide container (max-w-screen-lg)</p>
</Container>

<Container size="xl">
  <p>Extra wide container (max-w-screen-xl)</p>
</Container>

<Container fluid>
  <p>Full-width container with just horizontal padding</p>
</Container>
```

##### Grid System

Flexible grid layouts with responsive breakpoints:

```jsx
<Grid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

Implementation with utility classes:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

##### Application Layout

Standard application shell with sidebar navigation:

```jsx
<Layout>
  <Sidebar>
    <SidebarHeader>
      <Logo />
    </SidebarHeader>
    <SidebarNav>
      <NavItem icon={Home} href="/" active>
        Dashboard
      </NavItem>
      <NavItem icon={Folder} href="/projects">
        Projects
      </NavItem>
      {/* Additional navigation */}
    </SidebarNav>
  </Sidebar>
  <Main>
    <Header>
      <Breadcrumb />
      <Actions />
    </Header>
    <Content>
      {/* Page content */}
    </Content>
  </Main>
</Layout>
```

### Icon System

A comprehensive icon system using Lucide React with standardized sizes and accessibility:

```jsx
import { 
  Home,
  Folder,
  Settings,
  CheckSquare,
  Users,
  Calendar,
  Music,
  ArrowLeft,
  Upload,
  Plus,
  File,
  MoreVertical
} from 'lucide-react';

// Usage with explicit labeling
<Button>
  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
  Add Item
</Button>

// Icon-only usage with aria-label
<IconButton aria-label="Add item">
  <Plus className="h-4 w-4" />
</IconButton>
```

#### Icon Sizes

Standardized sizes for consistency:

* **XS**: h-3.5 w-3.5 (14px)
* **SM**: h-4 w-4 (16px) - Default for inline/button icons
* **MD**: h-5 w-5 (20px)
* **LG**: h-6 w-6 (24px) - Navigation/primary icons
* **XL**: h-8 w-8 (32px) - Feature icons
* **2XL**: h-12 w-12 (48px) - Hero/illustration icons

## Space & Layout Foundations

### Spacing System

A purposeful spacing scale that creates visual rhythm and hierarchy:

| Token   | Rem    | Pixels | Description                              |
|---------|--------|--------|------------------------------------------|
| 0       | 0      | 0px    | No spacing                               |
| px      | 1px    | 1px    | Hairline borders                         |
| 0.5     | 0.125  | 2px    | Minimum spacing                          |
| 1       | 0.25   | 4px    | Extra small spacing                      |
| 2       | 0.5    | 8px    | Small spacing, tight components          |
| 3       | 0.75   | 12px   | Medium-small spacing                     |
| 4       | 1      | 16px   | Base spacing unit                        |
| 5       | 1.25   | 20px   | Medium spacing                           |
| 6       | 1.5    | 24px   | Medium-large spacing                     |
| 8       | 2      | 32px   | Large spacing, section breaks            |
| 10      | 2.5    | 40px   | Extra large spacing                      |
| 12      | 3      | 48px   | 2x base spacing                          |
| 16      | 4      | 64px   | 4x base spacing, major sections          |
| 20      | 5      | 80px   | 5x base spacing                          |
| 24      | 6      | 96px   | 6x base spacing, page sections           |

### Spacing Patterns

Consistent application of spacing across components and layouts:

* **Component internals**: 2px, 4px, 8px (0.5, 1, 2)
* **Between related components**: 16px (4)
* **Component groups**: 24px (6)
* **Section spacing**: 32px, 48px (8, 12)
* **Page sections**: 64px, 96px (16, 24)

### Layout Patterns

* **Content container**: max-w-5xl centered with responsive padding
* **Form layout**: space-y-6 with field groups at space-y-4
* **Card content**: p-6 with internal space-y-4
* **Button groups**: space-x-2 (RTL aware)
* **Inline elements**: space-x-1 or space-x-2
* **List items**: space-y-2 or space-y-4 with optional dividers
* **Grid gaps**: gap-4 for card grids, gap-6 for page sections

```jsx
// Section spacing example
<section className="py-12">
  <Container>
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Section Title</h2>
        <p className="text-muted-foreground">Section description text.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards or content items */}
      </div>
    </div>
  </Container>
</section>
```

## Responsive Design System

A comprehensive approach to creating adaptable interfaces across device sizes.

### Breakpoints

Defined breakpoints for consistent responsive behavior:

| Breakpoint | Width        | Description                                    |
|------------|--------------|------------------------------------------------|
| xs         | < 640px      | Mobile phones                                  |
| sm         | ≥ 640px      | Large phones, small tablets in portrait        |
| md         | ≥ 768px      | Tablets                                        |
| lg         | ≥ 1024px     | Laptops and small desktops                     |
| xl         | ≥ 1280px     | Desktop displays                               |
| 2xl        | ≥ 1536px     | Large/high-density desktop displays            |

### Responsive Patterns

#### Progressive Enhancement

UI components adapt to available space rather than dramatic layout shifts:

```jsx
// Responsive typography
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Page Title</h1>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>

// Responsive container padding
<Container className="px-4 py-6 md:px-6 md:py-8 lg:py-12">
  {/* Content */}
</Container>

// Responsive component variants
<Tabs variant={{ base: "underlined", md: "contained" }}>
  {/* Tabs content */}
</Tabs>
```

#### Mobile-First Composition

Components are designed mobile-first with features progressively enhanced:

* **Navigation**: Collapses to menu button on small screens
* **Tables**: Collapse to cards or scrollable containers on small screens
* **Multi-column forms**: Stack to single column below md breakpoint
* **Sidebars**: Collapse to off-canvas navigation on small screens
* **Dialogs**: Full-screen on mobile, contained on larger screens

#### Touch Optimization

Interfaces are optimized for touch with appropriate sizing and spacing:

* **Minimum touch target size**: 44px (11 in Tailwind spacing)
* **Spacing between touch targets**: Minimum 8px
* **Interactive elements**: Clearly visually identifiable as interactive

## Animation & Motion

A subtle animation system that enhances usability without being distracting.

### Animation Principles

* **Purposeful**: Animations serve functional purposes, not decoration
* **Subtle**: Gentle, swift transitions that don't delay interaction
* **Consistent**: Common elements animate in predictable ways
* **Hierarchical**: Motion reinforces visual hierarchy and relationships
* **Accessible**: All animations respect user preferences (prefers-reduced-motion)

### Animation Library

| Purpose                | Duration | Easing              | CSS Class                       |
|------------------------|----------|---------------------|--------------------------------|
| Micro-interactions     | 100ms    | ease-in-out         | transition-fast                |
| UI transitions         | 150ms    | ease-out            | transition                     |
| Container transitions  | 200ms    | ease-in-out         | transition-medium              |
| Page transitions       | 300ms    | cubic-bezier curve  | transition-page                |
| Attention-drawing      | 400ms    | cubic-bezier curve  | transition-attention           |

### Animation Tokens

```css
/* In your CSS variables */
:root {
  --animation-fast: 100ms;
  --animation-default: 150ms;
  --animation-medium: 200ms;
  --animation-slow: 300ms;
  
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Common Animation Patterns

```jsx
// Hover transitions
<Button className="transition-colors duration-150">Button</Button>

// Fade in
<div className="animate-fade-in">Content</div>

// Slide down and fade in (for dropdowns)
<div className="animate-slide-down-fade">Dropdown content</div>

// Scale and fade (for dialogs)
<Dialog className="animate-scale-fade">Dialog content</Dialog>

// Loading spinner
<div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />

// Content loading
<div className="animate-pulse bg-muted rounded h-12 w-full" />
```

### Thoughtful Transitions

Interactive elements provide appropriate visual feedback:

* **Buttons**: Subtle background/color change on hover/focus (150ms)
* **Cards**: Slight elevation increase or border color change on hover (200ms)
* **Page transitions**: Content fade or slide animations when changing routes (300ms)
* **Expandable sections**: Smooth height animations (250ms)
* **Loading states**: Subtle pulse or skeleton loading patterns (800ms cycle)

## User Experience Patterns

### Status & Feedback System

A comprehensive approach to communicating system state and providing user feedback. Based on user research, clear feedback is consistently among the most praised aspects of good UX.

#### Performance Optimization

Our loading states are designed with both perceived and actual performance in mind:

* **Performance Budget**: Components should render within 100ms for optimal user experience
* **Loading Strategy**: Critical UI loads first, followed by content, then enhancement features
* **Asset Optimization**: Images use responsive sizing, lazy loading, and appropriate formats
* **Code Splitting**: Components load only when needed to reduce initial load times

#### Loading States

Multiple patterns for consistent loading feedback:

```jsx
// Page loading
{isPageLoading ? (
  <div className="h-screen w-full flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
) : (
  // Content
)}

// Section loading with skeleton
{isSectionLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
) : (
  // Content
)}

// Button loading
<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <LoadingSpinner className="mr-2 h-4 w-4" />
      Submitting...
    </>
  ) : (
    "Submit"
  )}
</Button>

// Inline loading
<div className="flex items-center gap-2">
  <span>Loading results</span>
  <LoadingDots />
</div>

// Progress bar for longer operations
<ProgressBar 
  value={uploadProgress} 
  max={100}
  showValue
  className="w-full"
/>
```

#### Loading Best Practices

* **Always show loading state** for operations that take more than 300ms
* **Use skeleton loading** for content areas to reduce perceived wait time
* **Provide progress indicators** for operations that take more than 2 seconds
* **Maintain context** during loading states to orient users
* **Prioritize interactivity** by loading the UI shell first, then content

#### Empty States

Useful and actionable empty states that guide users rather than dead-ends:

```jsx
<EmptyState
  icon={<FolderOpen className="h-12 w-12" />}
  title="No projects found"
  description="Get started by creating your first project"
  action={
    <Button>
      <PlusIcon className="mr-2 h-4 w-4" />
      New Project
    </Button>
  }
/>

// Simplified version
<div className="py-12 text-center">
  <div className="rounded-full bg-muted p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
    <Users className="h-6 w-6 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-medium mb-1">No team members</h3>
  <p className="text-muted-foreground mb-4">Invite team members to collaborate</p>
  <Button>Invite Team Members</Button>
</div>
```

#### Empty State Guidelines

Empty states should always provide at least one of these elements:

* **Primary action** - Provide a clear next step relevant to the context
* **Educational content** - Explain the purpose of the screen or feature
* **Visual illustration** - Use appropriate iconography to reinforce the message
* **Search/filter guidance** - If empty due to filters, provide reset options

Different empty state types:

* **First-use empty state** - For new users or features (emphasis on education)
* **Search/filter empty state** - When no results match criteria (emphasis on recovery)
* **Error-based empty state** - When content can't load (emphasis on retry/alternatives)
* **Permissions-based empty state** - When user lacks access (emphasis on explanation)

#### Error States

Context-appropriate error handling designed to help users recover and continue their tasks:

```jsx
// Inline form field error
<FormField
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} className={fieldState.error ? "border-danger" : ""} />
      </FormControl>
      {fieldState.error && (
        <FormMessage>{fieldState.error.message}</FormMessage>
      )}
    </FormItem>
  )}
/>

// Alert error
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    There was a problem with your request. Please try again.
  </AlertDescription>
</Alert>

// Section error with retry
<div className="p-4 border border-danger/20 rounded bg-danger/10 text-danger space-y-2">
  <div className="flex items-center gap-2">
    <AlertCircle className="h-4 w-4" />
    <p className="font-medium">Failed to load data</p>
  </div>
  <p className="text-sm">The server returned an error: {errorMessage}</p>
  <Button variant="outline" size="sm" className="mt-2" onClick={handleRetry}>
    Retry
  </Button>
</div>

// Error boundary fallback
<div className="text-center py-12 px-4 max-w-md mx-auto">
  <div className="rounded-full bg-danger/10 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
    <AlertTriangle className="h-6 w-6 text-danger" />
  </div>
  <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
  <p className="text-muted-foreground mb-4">
    We've encountered an unexpected error. Please try refreshing the page.
  </p>
  <div className="flex gap-3 justify-center">
    <Button variant="outline" onClick={handleReset}>Reset</Button>
    <Button onClick={handleRefresh}>Refresh Page</Button>
  </div>
</div>
```

#### Error Prevention & Recovery Guidelines

Based on user research, clear error handling is crucial for user satisfaction:

* **Prevent errors** before they occur:
  * Use constraints where possible (dropdowns vs. free text)
  * Provide format guidance before submission
  * Offer sensible defaults and examples
  * Use confirmation for destructive actions

* **Error messages must be:**
  * Human-readable (no technical codes without explanation)
  * Specific about what went wrong
  * Constructive with clear next steps
  * Non-accusatory (avoid blaming the user)

* **Recovery paths** should always be provided:
  * Maintain entered data when errors occur
  * Offer multiple recovery options where appropriate
  * Allow users to save partial progress
  * Provide contact options for critical failures

#### Success States

Confirming successful actions with appropriate emphasis based on action importance:

```jsx
// Toast notification
toast({
  variant: "success",
  title: "Project created",
  description: "Your new project has been successfully created.",
  action: <ToastAction altText="View">View</ToastAction>,
});

// Inline success
<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved successfully.
  </AlertDescription>
</Alert>

// Success animation
<div className="flex flex-col items-center py-8">
  <div className="rounded-full bg-success/10 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
    <CheckCircle className="h-6 w-6 text-success animate-success-appear" />
  </div>
  <h3 className="text-xl font-medium">Payment Successful</h3>
</div>
```

#### Feedback Guidelines

Provide appropriate feedback based on the action's importance:

* **Micro-feedback** - Small visual cues for minor actions
  * Button state changes
  * Small icons or color changes
  * Micro-animations (≤150ms)

* **Moderate feedback** - Toast notifications for important actions that don't interrupt flow
  * Saved changes
  * Completed background processes
  * Status updates

* **Major feedback** - Modal confirmations or full-page feedback for critical actions
  * Completed purchases
  * Account changes
  * Critical system changes

#### User Feedback Collection

Incorporate mechanisms to gather user feedback:

```jsx
<FeedbackWidget>
  <FeedbackQuestion>
    How easy was it to complete this task?
  </FeedbackQuestion>
  <FeedbackRating scale={5} />
  <FeedbackComment placeholder="Tell us more about your experience" />
  <Button>Submit Feedback</Button>
</FeedbackWidget>
```

## Application Structure & Patterns

A collection of standardized page layouts and interaction patterns to ensure consistency.

### Navigation Architecture

Navigation is consistently cited as a critical factor in user satisfaction. Our navigation system follows a clear hierarchy designed to minimize common pain points:

* **Global Navigation**: Primary sidebar navigation providing access to major application sections
* **Section Navigation**: Secondary navigation within a section (tabs, segmented controls)
* **Contextual Navigation**: Breadcrumbs, back buttons, and related item links
* **Utility Navigation**: User menu, notifications, and global actions

#### Navigation Best Practices

Based on user research, our navigation system follows these guidelines:

* **Depth Limitations**: Navigation hierarchy is limited to 3 levels deep to prevent confusion
* **Current Location**: Always clearly indicate the user's current location in the navigation
* **Consistent Placement**: Navigation elements maintain consistent positions across screens
* **Search Integration**: Global search is always accessible for direct navigation
* **History Support**: Back buttons and breadcrumbs provide clear navigation paths
* **Progressive Mobile Navigation**: Mobile navigation uses appropriate patterns (bottom bars, hamburger menus)
* **Persistent Access**: Critical functions remain accessible regardless of location
* **Keyboard Navigation**: All navigation supports keyboard shortcuts and tab navigation

#### Sidebar Navigation

```jsx
<SidebarNav>
  <SidebarSection>
    <SidebarItem icon={Home} href="/" label="Dashboard" />
    <SidebarItem icon={Folder} href="/projects" label="Projects" isActive />
    <SidebarItem icon={Calendar} href="/calendar" label="Calendar" />
    <SidebarItem icon={Users} href="/team" label="Team" />
  </SidebarSection>
  
  <SidebarSection title="Resources">
    <SidebarItem icon={HelpCircle} href="/help" label="Help Center" />
    <SidebarItem icon={Settings} href="/settings" label="Settings" />
  </SidebarSection>
</SidebarNav>
```

### Page Structure Patterns

#### Dashboard Page

```
├── Header
│   ├── Page Title
│   ├── View Options
│   └── Primary Actions
├── Overview Stats
│   └── Metric Cards (4-column grid)
├── Main Content
│   ├── Left: Primary Content (Charts, Activity)
│   └── Right: Secondary Content (Status, Upcoming)
└── Footer
```

#### Projects/List Page

```
├── Header
│   ├── Page Title
│   ├── Search/Filter Controls
│   └── Primary Action Button (Create New)
├── List Controls
│   ├── View Options (List/Grid Toggle)
│   ├── Sort Controls
│   └── Filter Chips
├── Content
│   └── List/Grid of Items
└── Footer
    └── Pagination Controls
```

#### Project Detail Page

```
├── Header
│   ├── Breadcrumb Navigation
│   ├── Project Title + Status Badge
│   └── Action Buttons (Settings, Share)
├── Section Navigation (Tabs)
│   ├── Overview
│   ├── Tasks
│   ├── Files
│   ├── Team
│   └── Settings
└── Content Area (Tab-specific content)
```

#### Creation/Edit Form Page

```
├── Header
│   ├── Back Button
│   ├── Form Title (Create/Edit)
│   └── Form Actions (Save Draft)
├── Form Container
│   ├── Form Sections
│   │   ├── Section Title
│   │   ├── Section Description
│   │   └── Form Fields
│   └── Footer Actions
│       ├── Cancel Button
│       └── Submit Button (with loading state)
```

### Common UI Patterns

#### File Browser Pattern

Inspired by macOS Finder with modern web aesthetics:

```jsx
<FileBrowser>
  <FileBrowserHeader>
    <Breadcrumb />
    <FileBrowserControls>
      <ViewToggle />
      <SortMenu />
      <SearchInput />
    </FileBrowserControls>
  </FileBrowserHeader>
  
  <FileBrowserSidebar>
    <FileBrowserNav>
      <FileBrowserNavItem icon={Folder} label="All Files" />
      <FileBrowserNavItem icon={Clock} label="Recent" />
      <FileBrowserNavItem icon={Star} label="Starred" />
      <FileBrowserNavItem icon={Trash} label="Trash" />
    </FileBrowserNav>
    
    <FileBrowserSection title="Libraries">
      <FileBrowserNavItem icon={Music} label="Music" />
      <FileBrowserNavItem icon={Image} label="Images" />
      <FileBrowserNavItem icon={Film} label="Videos" />
    </FileBrowserSection>
  </FileBrowserSidebar>
  
  <FileBrowserContent>
    {/* Grid view with file/folder cards */}
    <FileBrowserGrid>
      {items.map(item => (
        <FileCard 
          key={item.id}
          name={item.name}
          type={item.type}
          icon={getIconForType(item.type)}
          onSelect={handleSelect}
          onOpen={handleOpen}
          actionMenu={<FileActionsMenu file={item} />}
          isSelected={selectedItems.includes(item.id)}
        />
      ))}
    </FileBrowserGrid>
    
    {/* Or list view */}
    <FileBrowserList>
      {items.map(item => (
        <FileListItem 
          key={item.id}
          name={item.name}
          type={item.type}
          size={item.size}
          modifiedDate={item.modifiedDate}
          icon={getIconForType(item.type)}
          isSelected={selectedItems.includes(item.id)}
        />
      ))}
    </FileBrowserList>
  </FileBrowserContent>
  
  <FileBrowserFooter>
    <FilePreview file={selectedFile} />
    <Pagination />
  </FileBrowserFooter>
</FileBrowser>
```

## Accessibility & Inclusive Design

The design system prioritizes accessibility as a fundamental requirement, not an enhancement. Our approach is built on inclusive design principles that benefit all users.

### Core Accessibility Principles

* **Perceivable**: Information is presented in ways all users can perceive
* **Operable**: UI components are operable by all users
* **Understandable**: Information and operation are understandable
* **Robust**: Content is compatible with current and future tools

### Accessibility Compliance

All components must meet the following standards:
* **WCAG 2.1 AA Compliance** as minimum requirement
* **Section 508** compliance for government/education use cases
* **WAI-ARIA** best practices for dynamic content
* **Progressive enhancement** to ensure basic functionality without JavaScript

### Color & Contrast

* All text meets WCAG 2.1 AA standard (4.5:1 for normal text, 3:1 for large text)
* Color is never the sole means of conveying information
* Interactive elements have visible focus states with 3:1 minimum contrast
* The design system includes a color-blind safe palette

### Keyboard Navigation

* All interactive elements are keyboard accessible
* Focus order follows a logical sequence
* Focus states are clearly visible
* Complex components (dropdowns, dialogs) trap focus appropriately
* Skip links are provided for navigation

### Screen Reader Support

* Semantic HTML is used wherever possible
* ARIA attributes supplement when necessary
* Dynamic content changes are announced appropriately
* Icons and visual elements have text alternatives

### Reduced Motion

* Animation respects user preference for reduced motion
* Essential animations are subtle and brief
* Non-essential animations can be disabled

```jsx
// Respecting motion preferences
<div className="transition-opacity motion-safe:animate-fade-in">
  {/* Content that fades in only if user allows motion */}
</div>
```

## Voice & Tone Guidelines

Consistent communication is an extension of our visual design system. Our content follows these principles:

### Content Principles

* **Clear**: Use simple language and avoid jargon
* **Concise**: Be brief and direct
* **Helpful**: Provide guidance that addresses user needs
* **Human**: Sound like a knowledgeable colleague, not a machine
* **Consistent**: Use consistent terminology throughout

### UI Copy Guidelines

* **Buttons**: Use action verbs, 1-3 words ("Save", "Create Project")
* **Form Labels**: Be descriptive and concise ("Email address", not just "Email")
* **Error Messages**: State what went wrong and how to fix it
* **Empty States**: Provide clear next steps
* **Confirmation Messages**: Confirm what happened, with next steps if needed
* **Tooltips & Help Text**: Provide context without being patronizing
* **Menu Items**: Use nouns or verbs + nouns, be consistent

### Writing For Accessibility

* **Alt Text**: Describe image content and function
* **Link Text**: Make links descriptive and avoid "click here"
* **Screen Reader Considerations**: Provide context for unconventional interactions
* **Reading Level**: Aim for 8th-grade reading level or lower
* **Avoid Directional Language**: Don't rely solely on visual position ("below", "right")

## Code Style & Formatting

Consistent code formatting is essential for maintainability and collaboration. These standards ensure our codebase remains clean, readable, and accessible to all team members.

### General Guidelines

- Use 2 spaces for indentation
- Include semicolons at the end of statements
- Use single quotes for string literals
- Add trailing commas in multiline object literals and arrays
- Keep line length under 100 characters
- Use meaningful camelCase variable names
- Ensure code meets accessibility requirements

### JavaScript/TypeScript

```typescript
// Preferred import syntax
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Function declarations
function doSomething() {
  // Implementation
}

// Arrow functions for components
const MyComponent = () => {
  // Implementation
};

// Conditional rendering
{isLoading ? <LoadingSpinner /> : <Content />}
{hasData && <DataDisplay data={data} />}
```

### JSX Formatting

```jsx
// Good: Clean, readable JSX
<Button 
  onClick={handleClick}
  disabled={isLoading}
  className="mt-4"
>
  {isLoading ? 'Processing...' : 'Submit'}
</Button>

// Avoid: Hard to read
<Button onClick={handleClick} disabled={isLoading} className="mt-4">{isLoading ? 'Processing...' : 'Submit'}</Button>
```

### Component Style Implementation

When implementing design system components in code, ensure:

- All components adhere to the visual specs defined in this guide
- Visual states (hover, focus, disabled) match the defined patterns
- Responsive behavior follows the guidelines for different screen sizes
- Accessibility attributes are properly implemented
- Design tokens are used instead of hardcoded values

### Tailwind Usage

- Use design tokens via Tailwind classes
- Group related classes logically
- Use consistent ordering of utility classes
- Extract repetitive patterns to component classes

```jsx
// Example of well-organized Tailwind classes
<div className="
  flex items-center justify-between 
  p-4 
  bg-background 
  border border-border 
  rounded-md
">
  {/* Content */}
</div>
```

## Project Structure

A consistent project structure helps developers quickly locate files and understand how components relate to each other. Our structure follows modern Next.js conventions while organizing components by function.

### Directory Organization

```
/                  # Project root
├── app/          # Next.js App Router pages
│   └── projects/ # Project-related pages 
├── components/   # React components
│   ├── ui/       # Reusable UI components from design system
│   └── [feature] # Feature-specific components
├── docs/         # Documentation
├── lib/          # Utility functions & services
│   ├── supabase/ # Supabase-related utilities
│   └── utils/    # General utility functions
├── public/       # Static assets
├── schema/       # Database schema definitions
├── scripts/      # Build and maintenance scripts
├── styles/       # Global styles and theme configuration
└── types/        # TypeScript type definitions
```

### File Naming Conventions

- React components: PascalCase (e.g., `FileUpload.tsx`)
- Utility files: kebab-case (e.g., `supabase-storage.ts`)
- Types: kebab-case (e.g., `database.types.ts`)
- Page components: kebab-case (e.g., `[projectId]/page.tsx`)
- Component-specific styles: Match component name (e.g., `Button.module.css`)

### Design System Integration

Components in the design system should be located in the appropriate directories:

- **Base UI components**: `/components/ui/` (Button, Input, Card, etc.)
- **Layout components**: `/components/layout/` (Container, Grid, etc.)
- **Pattern components**: `/components/patterns/` (FileUploader, DataTable, etc.)
- **Design tokens**: `/styles/tokens.js` (color, spacing, typography values)

### Component Organization

Organize complex components in directories rather than single files:

```
Button/
├── Button.tsx         # Main component
├── Button.test.tsx    # Component tests
├── Button.stories.tsx # Storybook stories
└── index.ts           # Re-export for clean imports
```

This structure supports maintainability as components grow in complexity while keeping imports clean with `import { Button } from '@/components/ui/Button'`.

## TypeScript & Type Safety

Strong typing is crucial for maintainable code and preventing runtime errors. These guidelines ensure proper use of TypeScript throughout the application.

### Type Definitions

- Define interfaces for all component props
- Use explicit return types for functions
- Use type imports when only importing types
- Use TypeScript's non-null assertion (!) sparingly

```typescript
// Component props interface
interface FileUploadProps {
  projectId: string;
  onUploadComplete?: () => void;
  allowedFileTypes?: string[];
  maxFileSize?: number;
}

// Function with explicit return type
async function uploadFile(file: File): Promise<string> {
  // Implementation
  return url;
}

// Type imports
import type { Database } from '@/types/database.types';
```

### Design System Types

Create TypeScript interfaces for all design system elements to ensure consistency:

```typescript
// Design token types
interface ColorTokens {
  primary: {
    50: string;
    100: string;
    // ...other shades
  };
  // ...other color categories
}

// Component variant types
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

// Component prop types with variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}
```

### Database Types

- Generate TypeScript types from the Supabase schema
- Use generated types throughout the app
- Handle JSON fields cautiously

```typescript
// Using database types
type Asset = Database['public']['Tables']['assets']['Row'];

// Safely accessing JSON fields with type guards
if (asset.metadata && typeof asset.metadata === 'object' && 'song' in asset.metadata) {
  const song = asset.metadata.song;
  // Use song safely here
}
```

### Type Safety Best Practices

- Avoid `any` type except in rare, justified cases
- Use discriminated unions for complex state
- Create meaningful type aliases for better readability
- Use strict mode in tsconfig.json
- Consider using Zod for runtime validation of data

```typescript
// Discriminated union example for state management
type ProjectState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: Project };
```

## React Components

Our components follow a consistent structure and best practices to ensure maintainability, reusability, and alignment with the design system.

### Component Structure

```typescript
'use client'; // For client components

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/types/components';

// Props interface
interface ComponentProps {
  data: string;
  onAction?: () => void;
  variant?: 'default' | 'alternate';
}

// Component definition
export function MyComponent({ data, onAction, variant = 'default' }: ComponentProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect implementation
    return () => {
      // Cleanup
    };
  }, []);

  const handleClick = () => {
    setLoading(true);
    onAction?.();
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Component JSX */}
      <Button 
        onClick={handleClick} 
        disabled={loading}
        variant={variant === 'alternate' ? 'secondary' : 'primary'}
      >
        {loading ? 'Loading...' : 'Action'}
      </Button>
    </div>
  );
}
```

### Design System Component Implementation

When implementing design system components:

1. **Follow atomic design principles** - Build from atoms to organisms
2. **Implement all variants** - Support all defined variants and states
3. **Use design tokens** - Connect to the design system's color, spacing, and typography tokens
4. **Ensure accessibility** - Include proper ARIA attributes and keyboard interactions
5. **Document props** - Clearly document all props and their usage

```typescript
// Example Button component implementation
export function Button({
  variant = 'default',
  size = 'md',
  children,
  className,
  disabled,
  isLoading,
  ...props
}: ButtonProps) {
  // Get classes based on variant and size
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        variantClasses,
        sizeClasses,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
```

### Hooks Usage

- Follow React hooks rules (top-level calls, no conditionals)
- Keep hook dependencies accurate and complete
- Extract complex logic into custom hooks

```typescript
// Custom hook example
function useProjectData(projectId: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await fetchProjectById(projectId);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return { data, loading, error };
}
```

### Component Testing

- Test all components for:
  - Correct rendering of all variants
  - Proper handling of user interactions
  - Accessibility compliance
  - Responsive behavior

```typescript
// Component test example
describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
```

## Supabase Integration

Our application uses Supabase for backend functionality. These guidelines ensure consistent and secure integration with Supabase services.

### Client Initialization

- Use the centralized Supabase client
- Handle authentication errors consistently

```typescript
import { supabaseClient } from '@/lib/supabaseClient';

const { data, error } = await supabaseClient
  .from('projects')
  .select('*');

if (error) {
  // Handle error consistently using our error handling patterns
  handleSupabaseError(error);
}
```

### Queries

- Use strong typing for all queries
- Convert types (e.g., string to number) before querying
- Include explicit error handling
- Follow performance best practices

```typescript
// Good: Type conversion before query
const { data, error } = await supabaseClient
  .from('assets')
  .select('id, name, file_url, created_at') // Only select needed fields
  .eq('project_id', Number(projectId))
  .order('created_at', { ascending: false })
  .limit(20); // Pagination for performance
```

### Real-time Subscriptions

- Clean up subscriptions on unmount
- Use clear channel naming conventions
- Implement appropriate error handling and reconnection logic

```typescript
useEffect(() => {
  const channel = supabaseClient
    .channel(`project-${projectId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'assets',
      filter: `project_id=eq.${projectId}`,
    }, (payload) => {
      // Handle change based on event type
      if (payload.eventType === 'INSERT') {
        // Handle insert
      } else if (payload.eventType === 'UPDATE') {
        // Handle update
      } else if (payload.eventType === 'DELETE') {
        // Handle delete
      }
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscription established');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Subscription error');
        // Implement reconnection logic
      }
    });

  return () => {
    supabaseClient.removeChannel(channel);
  };
}, [projectId]);
```

### Authentication Integration

- Follow design system patterns for authentication UI
- Implement proper loading and error states
- Ensure secure session handling
- Follow accessibility guidelines for auth forms

```typescript
// Authentication with proper UX states
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    // Redirect or update UI on success
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Row-Level Security (RLS) Patterns

- Design database schema with RLS in mind
- Follow consistent patterns for secure access control
- Test RLS policies thoroughly
- Document RLS policies for developer reference

```sql
-- Example RLS policy for projects
CREATE POLICY "Users can view their own projects"
ON projects
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON projects
FOR UPDATE
USING (auth.uid() = user_id);
```

## State Management

Consistent state management patterns ensure our application remains predictable and maintainable as it grows.

### State Management Principles

- Keep state as local as possible
- Use React's built-in tools (useState, useReducer, useContext) for most cases
- Consider state machines for complex workflows
- Use URL parameters for bookmarkable page-level state
- Document state management decisions for complex features

### Component-Level State

Use local state for component-specific concerns:

```typescript
// Local component state
const [isOpen, setIsOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

// Local state with derived values
const [items, setItems] = useState<Item[]>([]);
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

### Application-Level State

For shared state across components:

```typescript
// Create context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export function ProjectProvider({ children, projectId }: ProjectProviderProps) {
  const { data, loading, error } = useProjectData(projectId);
  
  const value = useMemo(() => ({
    project: data,
    isLoading: loading,
    error,
    // Additional methods for updating project
  }), [data, loading, error]);
  
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

// Usage hook
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
```

### Complex State Management

For complex state logic, use reducers or state machines:

```typescript
// Using reducer for complex state
type State = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: Project | null;
  error: Error | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Project }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { status: 'error', data: null, error: action.payload };
    case 'RESET':
      return { status: 'idle', data: null, error: null };
    default:
      return state;
  }
}
```

### URL-Based State

Use URL parameters for shareable and bookmarkable state:

```typescript
// Next.js App Router example
export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  
  return (
    <div>
      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ProjectOverview projectId={projectId} />
        </TabsContent>
        {/* Other tab contents */}
      </Tabs>
    </div>
  );
}
```

### Optimistic Updates

Implement optimistic updates for responsive UI:

```typescript
function useUpdateProjectName(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newName: string) => updateProjectName(projectId, newName),
    // Optimistically update the UI
    onMutate: async (newName) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['project', projectId] });
      
      // Save previous value
      const previousProject = queryClient.getQueryData<Project>(['project', projectId]);
      
      // Optimistically update
      queryClient.setQueryData<Project>(['project', projectId], old => {
        return old ? { ...old, name: newName } : old;
      });
      
      return { previousProject };
    },
    // On error, roll back
    onError: (err, newName, context) => {
      queryClient.setQueryData(
        ['project', projectId],
        context?.previousProject
      );
    },
    // Always refetch after to ensure data is correct
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}
```

## Error Handling

Consistent error handling patterns improve user experience and make debugging easier. Our approach aligns technical error handling with the design system's error presentation patterns.

### API Error Handling

- Use try/catch for async operations
- Log detailed errors to the console in development
- Show user-friendly messages using our design system components
- Categorize errors for appropriate responses

```typescript
import { toast } from '@/components/ui/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

try {
  const result = await uploadFile(file);
  toast({
    title: 'Success',
    description: 'File uploaded successfully',
    variant: 'success',
  });
} catch (error) {
  console.error('Upload error:', error);
  
  // User-friendly error message
  toast({
    title: 'Upload Failed',
    description: getErrorMessage(error),
    variant: 'destructive',
  });
  
  // For critical errors, use Alert component
  if (isCriticalError(error)) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Upload Failed</AlertTitle>
        <AlertDescription>
          {getErrorMessage(error)}
          <Button variant="outline" onClick={handleRetry} className="mt-2">
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
}

// Helper function to extract user-friendly error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
}
```

### Form Validation

- Validate input before submission
- Show clear error messages inline with form fields
- Provide visual feedback using design system patterns
- Use consistent validation patterns across the application

```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema with Zod
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});

// Type inference
type FormValues = z.infer<typeof formSchema>;

// Form component
function UserForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
    },
  });
  
  // Submit handler
  const onSubmit = (values: FormValues) => {
    // Submit data
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Additional form fields */}
      
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

### Error Boundaries

- Implement error boundaries to prevent entire app crashes
- Provide user-friendly fallbacks using design system components
- Include reset options when possible
- Log errors to monitoring services

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <div className="rounded-full bg-danger/10 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-danger" />
      </div>
      <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-4">
        {getErrorMessage(error)}
      </p>
      <Button onClick={resetErrorBoundary}>Try Again</Button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* Application content */}
    </ErrorBoundary>
  );
}
```

### Global Error Handler

- Implement window.onerror and unhandledrejection handlers
- Log errors to monitoring services
- Provide graceful recovery options when possible
- Maintain design system consistency in error presentations

```typescript
// Global error handler setup
useEffect(() => {
  function handleError(event: ErrorEvent) {
    console.error('Global error:', event.error);
    // Log to monitoring service
    logErrorToService({
      message: event.message,
      stack: event.error?.stack,
      type: 'uncaught-exception'
    });
    
    // Show user-friendly message using design system toast
    toast({
      title: 'Something went wrong',
      description: 'The application encountered an unexpected error.',
      variant: 'destructive',
    });
  }
  
  window.addEventListener('error', handleError);
  
  return () => {
    window.removeEventListener('error', handleError);
  };
}, []);
```

## File Storage

Consistent file storage practices ensure data integrity and security. The following patterns align with our design system's file handling components.

### Path Conventions

- Use `project-{projectId}/{filename}` pattern
- Keep filenames predictable and clean
- Avoid special characters
- Create appropriate subfolder structures for organization

```typescript
// Good path patterns
const storagePath = `project-${projectId}/${file.name}`;

// With subfolder for different file types
const storagePath = `project-${projectId}/audio/${file.name}`;

// With timestamp to prevent collisions
const timestamp = Date.now();
const storagePath = `project-${projectId}/${timestamp}-${file.name}`;
```

### File Upload Components

Our file upload components follow these principles:

- Provide clear drag-and-drop interfaces
- Show upload progress
- Handle errors gracefully
- Support file type restrictions
- Manage file size limitations
- Provide accessible alternatives

```typescript
function FileUploader({ projectId, allowedTypes, maxSize }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    // Validate file types and sizes
    const validFiles = acceptedFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds the maximum file size of ${formatBytes(maxSize)}`);
        return false;
      }
      return true;
    });
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  }, [allowedTypes, maxSize]);
  
  const uploadFiles = async () => {
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `project-${projectId}/${Date.now()}-${file.name}`;
        
        // Add delay between uploads to avoid rate limiting
        if (i > 0) await delay(API_CALL_DELAY);
        
        await uploadFile(file, path);
        setProgress(((i + 1) / files.length) * 100);
      }
      
      toast.success('All files uploaded successfully');
      setFiles([]);
    } catch (error) {
      setError(getErrorMessage(error));
      toast.error(`Upload failed: ${getErrorMessage(error)}`);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <DropZone onDrop={handleDrop} accept={allowedTypes} />
      
      {files.length > 0 && (
        <div className="space-y-2">
          <FileList files={files} onRemove={(index) => {
            setFiles(files.filter((_, i) => i !== index));
          }} />
          
          <Button 
            onClick={uploadFiles} 
            disabled={uploading || files.length === 0}
          >
            {uploading ? (
              <>
                <Spinner className="mr-2" />
                Uploading ({Math.round(progress)}%)
              </>
            ) : (
              `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

### API Delays

- Add delays between storage API calls to avoid rate limiting
- Use the centralized delay function
- Show appropriate loading indicators

```typescript
const API_CALL_DELAY = 500; // milliseconds

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
await delay(API_CALL_DELAY);
const { data, error } = await supabaseClient.storage
  .from(bucketName)
  .upload(path, file);
```

### Security Considerations

- Validate file types and sizes on both client and server
- Use signed URLs for sensitive files
- Implement proper access control
- Scan for malicious content when appropriate

```typescript
// Security validations
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const maxSize = 10 * 1024 * 1024; // 10MB

if (!allowedTypes.includes(file.type)) {
  throw new Error('File type not supported');
}

if (file.size > maxSize) {
  throw new Error(`File exceeds maximum size of ${maxSize / (1024 * 1024)}MB`);
}

// Generate a signed URL for private content
const { data } = await supabaseClient.storage
  .from('private')
  .createSignedUrl(filePath, 60); // Expires in 60 seconds
```

## Documentation

Clear documentation is essential for maintaining and scaling the application. These guidelines ensure our documentation remains useful, accurate, and accessible.

### Code Comments

- Use JSDoc for functions and components
- Comment complex logic, not obvious code
- Keep comments current with code changes
- Focus on why, not what (the code shows what, comments explain why)

```typescript
/**
 * Uploads a file to the specified project's storage
 * @param file - The file to upload
 * @param projectId - The project ID
 * @returns The URL of the uploaded file
 * @throws Will throw an error if the file type is not supported or exceeds size limits
 */
async function uploadFile(file: File, projectId: string): Promise<string> {
  // Security validation
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  
  // Implementation details...
  
  return url;
}
```

### Component Documentation

Document design system components using a consistent format:

```typescript
/**
 * Button component that follows the design system specifications.
 *
 * @component
 * @example
 * // Primary button
 * <Button>Click me</Button>
 * 
 * // Destructive button with loading state
 * <Button variant="destructive" isLoading>Delete</Button>
 *
 * @designSpec https://figma.com/file/123/component?node-id=456
 */
export function Button({
  variant = 'default',
  size = 'md',
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  // Implementation
}
```

### Documentation Files

- Store documentation in `/docs/` directory
- Use Markdown format for consistency
- Include instructions, examples, and troubleshooting
- Create specific documentation types:

#### Component Documentation

```markdown
# Button Component

The Button component is used to trigger actions or events.

## Usage

```jsx
import { Button } from '@/components/ui/button';

// Default button
<Button>Click me</Button>

// Destructive button
<Button variant="destructive">Delete</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'link' \| 'destructive' | 'default' | Visual style of the button |
| size | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'icon' | 'md' | Size of the button |
| isLoading | boolean | false | Whether to show loading state |

## Design Specifications

- [Figma Link](https://figma.com/file/123/component?node-id=456)
- [Usage Guidelines](https://designsystem.company.com/button)

## Accessibility

- Uses native `button` element with appropriate ARIA attributes
- Loading state is announced to screen readers
- Focus states follow WCAG 2.1 AA guidelines
```

#### Architecture Documentation

```markdown
# Authentication Flow

This document describes the authentication flow in the Live Production Manager application.

## Overview

Authentication is handled through Supabase Auth with email/password and social login options.

## Implementation Details

1. User initiates login from `/login` page
2. Authentication request is sent to Supabase
3. On success, user is redirected to dashboard
4. Session is maintained through Supabase's session handling

## Code References

- `lib/auth.ts` - Core authentication logic
- `app/login/page.tsx` - Login UI
- `components/auth/LoginForm.tsx` - Login form component

## Security Considerations

- CSRF protection is implemented through...
- Session timeouts are configured to...
```

### Storybook Integration

- Document all design system components in Storybook
- Include all variants and states
- Provide usage examples and documentation
- Ensure accessibility information is included

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Standard button component following the design system specifications.',
      },
    },
  },
  argTypes: {
    variant: {
      options: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      control: { type: 'select' },
      description: 'Visual style of the button',
    },
    // Other props
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// Additional stories for other variants and states
```

## Database Schema Management

Maintaining a well-structured database schema is essential for application stability and performance. These guidelines ensure our schema remains consistent and well-documented.

### Schema Definition

- Maintain schema in `src/schema/supabase-schema.ts`
- Document tables, columns, relationships, and JSON fields
- Include comments explaining the purpose of each table and complex fields

```typescript
export const SCHEMA = {
  tables: {
    projects: {
      name: 'projects',
      description: 'Stores project information',
      fields: [
        { 
          name: 'id', 
          type: 'uuid', 
          primaryKey: true, 
          defaultValue: 'uuid_generate_v4()',
          description: 'Unique identifier for the project'
        },
        { 
          name: 'name', 
          type: 'text', 
          nullable: false,
          description: 'Display name of the project'
        },
        { 
          name: 'user_id', 
          type: 'uuid', 
          nullable: false,
          description: 'Reference to the owning user',
          references: 'users.id'
        },
        { 
          name: 'created_at', 
          type: 'timestamp with time zone', 
          defaultValue: 'now()',
          description: 'When the project was created'
        },
        { 
          name: 'updated_at', 
          type: 'timestamp with time zone', 
          defaultValue: 'now()',
          description: 'When the project was last updated'
        },
      ],
      jsonFields: {
        metadata: {
          description: 'Additional project metadata',
          schema: {
            setlist: { 
              type: 'array',
              description: 'Ordered list of songs in the project'
            },
            settings: {
              type: 'object',
              description: 'Project-specific settings'
            },
          },
        },
      },
      indices: [
        { name: 'projects_user_id_idx', fields: ['user_id'] },
        { name: 'projects_created_at_idx', fields: ['created_at'] },
      ],
    },
    // Additional tables...
  },
};
```

### Schema Validation

- Validate schema before changes
- Follow `DATABASE_WORKFLOW.md` for making changes
- Update types after schema changes
- Add database migrations for all changes

```bash
# Validate schema
npm run validate-schema

# Update types
npm run generate-types
```

### Database Schema Documentation

Keep a database schema documentation file in the `/docs` directory:

```markdown
# Database Schema

This document outlines the database schema for the Live Production Manager application.

## Tables

### projects

Stores information about production projects.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| name | text | false | - | Project name |
| user_id | uuid | false | - | Reference to owner |
| created_at | timestamptz | false | now() | Creation timestamp |
| updated_at | timestamptz | false | now() | Update timestamp |
| metadata | jsonb | true | null | Additional project data |

#### Indices
- `projects_user_id_idx` - Index on user_id
- `projects_created_at_idx` - Index on created_at

#### JSON Fields

The `metadata` column is a JSONB field with the following structure:

```json
{
  "setlist": [
    { "id": "song-1", "title": "Song 1", "duration": 180 },
    { "id": "song-2", "title": "Song 2", "duration": 240 }
  ],
  "settings": {
    "visibility": "public",
    "allowComments": true
  }
}
```

### Row-Level Security (RLS)

Projects table has the following RLS policies:

1. `projects_select_policy`: Users can view their own projects
   ```sql
   (auth.uid() = user_id)
   ```

2. `projects_insert_policy`: Users can create their own projects
   ```sql
   (auth.uid() = user_id)
   ```
```

### Type Generation

- Use generated TypeScript types for type-safe database access
- Update types after schema changes
- Store generated types in `/types/database.types.ts`
- Enforce usage of generated types in queries

```typescript
// Example of using generated types
import type { Database } from '@/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

// Type-safe query
const { data, error } = await supabaseClient
  .from<Project>('projects')
  .select('*')
  .eq('user_id', userId);
```

## Performance Considerations

Performance is a key component of our design system and engineering practices. These guidelines ensure the application remains fast and responsive.

### Performance Budget

We adhere to the following performance budgets:

- **First Contentful Paint (FCP)**: < 1.8s
- **Time to Interactive (TTI)**: < 3.5s
- **Total Bundle Size**: < 300KB (gzipped)
- **Image Size**: < 200KB per image
- **API Response Time**: < 300ms for most operations

### Data Fetching

- Fetch only needed data using select statements
- Use pagination for large datasets
- Implement appropriate caching strategies
- Show loading states during data fetching

```typescript
// Fetch specific fields only
const { data } = await supabaseClient
  .from('projects')
  .select('id, name, created_at')
  .eq('user_id', userId);

// Pagination
const { data } = await supabaseClient
  .from('assets')
  .select('*')
  .eq('project_id', projectId)
  .range(0, 9);
  
// Efficient filtering
const { data } = await supabaseClient
  .from('projects')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

### Resource Management

- Clean up resources in useEffect returns
- Debounce expensive operations
- Throttle API calls
- Use intersection observer for lazy loading

```typescript
// Debounced function
const debouncedSave = useCallback(
  debounce((text) => saveChanges(text), 500),
  []
);

// Resource cleanup
useEffect(() => {
  const subscription = subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);

// Intersection observer for lazy loading
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMoreData();
      }
    });
  });
  
  if (loadMoreRef.current) {
    observer.observe(loadMoreRef.current);
  }
  
  return () => {
    observer.disconnect();
  };
}, [loadMoreData]);
```

### Component Performance

- Memoize expensive calculations and components
- Use virtualization for long lists
- Implement incremental loading for large data sets
- Avoid unnecessary re-renders

```typescript
// Memoized component
const MemoizedComponent = React.memo(MyComponent);

// Memoized calculation
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// Virtualized list for performance
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ListItem data={items[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}
```

### Image Optimization

- Use responsive images with srcset
- Compress images appropriately
- Use modern formats (WebP, AVIF)
- Lazy load images below the fold
- Provide appropriate dimensions

```jsx
// Optimized image example
<img
  src="/images/small.jpg"
  srcSet="/images/small.jpg 400w, /images/medium.jpg 800w, /images/large.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Description of image"
  width={800}
  height={600}
  loading="lazy"
/>

// Next.js Image component (preferred)
import Image from 'next/image';

<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle Optimization

- Implement code splitting for routes and large components
- Use dynamic imports for features not needed immediately
- Analyze bundle size regularly
- Remove unused dependencies
- Tree-shake where possible

```typescript
// Dynamic import for code splitting
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // If not needed for SSR
});
```

## Security Best Practices

Security is a fundamental aspect of our application. These guidelines ensure we maintain a secure codebase and protect user data.

### Data Validation

- Validate all user inputs on both client and server
- Use Row Level Security (RLS) in Supabase
- Never trust client-side data
- Implement proper data sanitization

```typescript
// Client-side validation
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
});

// Server-side validation (e.g., in an API route)
export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const data = userSchema.parse(body);
    // Proceed with validated data
  } catch (error) {
    // Return validation error
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

### Authentication & Authorization

- Check auth state before sensitive operations
- Follow project access control model
- Use secure session management
- Implement proper role-based access control

```typescript
// Check authentication
const user = supabaseClient.auth.getUser();
if (!user) {
  throw new Error('Authentication required');
}

// Check authorization
const { data: project } = await supabaseClient
  .from('projects')
  .select('*')
  .eq('id', projectId)
  .single();

// Verify user has access to this project
if (!project || project.user_id !== user.id) {
  throw new Error('Access denied');
}
```

### Storage Security

- Use approved path patterns for RLS
- Validate file types and sizes before upload
- Use signed URLs for sensitive files
- Implement virus scanning for uploaded files when possible

```typescript
// File validation before upload
if (file.size > MAX_FILE_SIZE) {
  throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
}

if (!ALLOWED_FILE_TYPES.includes(file.type)) {
  throw new Error(`File type '${file.type}' is not supported`);
}

// Secure storage path that works with RLS policies
const storagePath = `project-${projectId}/${sanitizeFilename(file.name)}`;

// Generate a signed URL for sensitive content
const { data: signedUrl } = await supabaseClient.storage
  .from('private')
  .createSignedUrl(filePath, 60); // Expires in 60 seconds
```

### Security Headers

- Implement appropriate security headers
- Use Content Security Policy (CSP)
- Enable CORS appropriately
- Set proper cache controls

```typescript
// Example Next.js middleware to add security headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Set security headers
  const headers = response.headers;
  
  // Content Security Policy
  headers.set('Content-Security-Policy', `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
    style-src 'self' 'unsafe-inline' https://trusted-cdn.com;
    img-src 'self' https://storage.googleapis.com https://trusted-cdn.com data:;
    connect-src 'self' https://api.company.com;
    font-src 'self' https://trusted-cdn.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim());
  
  // Other security headers
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}
```

### Secure Coding Practices

- Avoid dangerous functions (eval, innerHTML)
- Sanitize HTML when needed with a trusted library
- Use parameterized queries for database operations
- Keep dependencies updated
- Run security scans regularly

```typescript
// Avoid this
element.innerHTML = userInput; // XSS vulnerability

// Use this instead
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Or better yet, avoid HTML insertion entirely
element.textContent = userInput;
```

### Sensitive Data Handling

- Never log sensitive data
- Use environment variables for secrets
- Don't store sensitive data in local storage
- Implement proper encryption for sensitive data
- Follow data minimization principles

```typescript
// Bad: Exposing API key in client-side code
const apiKey = 'sk_live_123456789';

// Good: Using environment variables and server-side operations
// In .env.local
// STRIPE_SECRET_KEY=sk_live_123456789

// In server-side code only
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
```

## User Testing & Validation

A crucial element of our design system is ongoing validation with real users.

### Testing Methodology

* **Usability Testing**: Regular sessions to validate component usability
* **Accessibility Testing**: Expert reviews and tests with assistive technology users
* **Performance Testing**: Measuring load times and interaction responsiveness
* **A/B Testing**: Comparing design variations with metrics-based evaluation

### Testing Checklist

Each component should be tested against these criteria:

* Does it fulfill its intended purpose efficiently?
* Is it accessible to users of all abilities?
* Does it perform well on all target devices?
* Is it consistent with the overall design language?
* Does it address known user pain points?
* Does it work well in combination with other components?

### Feedback Loops

* **User Feedback Collection**: In-app mechanisms to gather user experience data
* **Analytics Integration**: Usage tracking to identify potential issues
* **Continuous Iteration**: Regular updates based on collected insights

## Governance & Contribution

A successful design system requires clear governance and contribution processes.

### Governance Model

* **Design System Team**: Core team responsible for maintaining and evolving the design system
* **Stakeholder Committee**: Representatives from product, design, engineering, and accessibility
* **Decision Framework**: Clear process for evaluating and prioritizing changes

### Contribution Process

1. **Identify Need**: Document the use case or requirement
2. **Research**: Investigate existing solutions and best practices
3. **Propose**: Submit a proposal with rationale and examples
4. **Review**: Peer review by the design system team
5. **Prototype**: Create a functional prototype for testing
6. **Test**: Validate with users and against guidelines
7. **Implement**: Add to the design system with documentation
8. **Communicate**: Announce changes to all stakeholders

### Component Maturity Model

Components progress through these stages:

* **Experimental**: In development, use with caution
* **Beta**: Tested but may evolve significantly
* **Stable**: Ready for production use
* **Deprecated**: Slated for removal, use alternatives

## Roadmap & Future Enhancements

The design system is continuously evolving. Here are the planned improvements:

### Immediate Priorities

* **Component Library Documentation**: Complete Storybook implementation
* **Dark Mode Refinement**: Enhance dark mode visual consistency
* **Accessibility Audit & Improvements**: Ensure WCAG 2.1 AA compliance across all components
* **User Research Integration**: Conduct focused research on key pain points

### Short-term Goals (3-6 months)

* **Advanced Animation System**: Implement a more robust animation library
* **Form Validation Framework**: Standardize form validation patterns and error handling
* **Data Visualization Components**: Add chart and graph components
* **Component Analytics**: Add usage tracking to understand component adoption
* **Mobile Optimization**: Enhance touch-friendly patterns and interactions

### Long-term Vision (6-12 months)

* **Design Token Management**: Implement a token management system
* **Theme Builder**: Create a visual tool for customizing the design system
* **Pattern Library Expansion**: Add more complex interaction patterns
* **Cross-platform Consistency**: Ensure design consistency across web and native platforms
* **AI-enhanced Components**: Integrate AI capabilities for smarter components (predictive inputs, content generation)
* **Internationalization Framework**: Support for multiple languages and localization

## Related Resources

Additional resources that support the design system:

* **Component Library** (Storybook): [URL]
* **Design Files** (Figma): [URL]
* **Code Repository**: [URL]
* **Accessibility Guidelines**: [URL]
* **User Research Insights**: [URL]
* **Brand Guidelines**: [URL]

## Glossary

* **Atomic Design**: Methodology composed of atoms, molecules, organisms, templates, and pages
* **Component**: Reusable UI element with defined properties and behaviors
* **Design Token**: Named entity that stores visual design attributes
* **Pattern**: Reusable solution to a common design problem
* **Prototype**: Interactive simulation of a user interface
* **Responsive Design**: Design approach that adapts to different screen sizes and devices
* **WCAG**: Web Content Accessibility Guidelines that define how to make web content accessible
* **Affordance**: Quality of an object that indicates how it can be used
* **Information Architecture**: Structure and organization of content and functionality
* **Interaction Design**: Practice of designing interactive digital products and systems
* **Microcopy**: Small pieces of text in the interface that help users complete tasks
* **Design Debt**: Accumulation of suboptimal design decisions that need to be addressed
* **Cognitive Load**: Mental effort required to use an interface
* **Visual Hierarchy**: Arrangement of elements to show their order of importance

## Voice & Tone Guidelines

Consistent communication is an extension of our visual design system. Our content follows these principles:

### Content Principles

* **Clear**: Use simple language and avoid jargon
* **Concise**: Be brief and direct
* **Helpful**: Provide guidance that addresses user needs
* **Human**: Sound like a knowledgeable colleague, not a machine
* **Consistent**: Use consistent terminology throughout

### UI Copy Guidelines

* **Buttons**: Use action verbs, 1-3 words ("Save", "Create Project")
* **Form Labels**: Be descriptive and concise ("Email address", not just "Email")
* **Error Messages**: State what went wrong and how to fix it
* **Empty States**: Provide clear next steps
* **Confirmation Messages**: Confirm what happened, with next steps if needed
* **Tooltips & Help Text**: Provide context without being patronizing
* **Menu Items**: Use nouns or verbs + nouns, be consistent

### Writing For Accessibility

* **Alt Text**: Describe image content and function
* **Link Text**: Make links descriptive and avoid "click here"
* **Screen Reader Considerations**: Provide context for unconventional interactions
* **Reading Level**: Aim for 8th-grade reading level or lower
* **Avoid Directional Language**: Don't rely solely on visual position ("below", "right")

## Appendix: Implementation Checklist

Use this checklist when implementing new features to ensure they align with our design system and engineering standards:

### Design Compliance
- [ ] Uses design tokens for colors, typography, spacing
- [ ] Follows component patterns and variants
- [ ] Maintains appropriate visual hierarchy
- [ ] Respects spacing system
- [ ] Implements responsive behavior per guidelines
- [ ] Meets accessibility standards

### Technical Implementation
- [ ] Follows project structure conventions
- [ ] Uses TypeScript with proper typing
- [ ] Components follow established patterns
- [ ] State management follows guidelines
- [ ] Implements proper error handling
- [ ] Includes appropriate tests
- [ ] Documentation is complete and accurate

### Functional Requirements
- [ ] Addresses user needs and pain points
- [ ] Provides appropriate feedback for all actions
- [ ] Handles errors gracefully with recovery paths
- [ ] Performs efficiently (meets performance budget)
- [ ] Data is validated properly
- [ ] Security best practices are followed

### Accessibility
- [ ] Meets WCAG 2.1 AA standards
- [ ] Works with keyboard navigation
- [ ] Compatible with screen readers
- [ ] Respects user preferences (motion, contrast)
- [ ] Includes appropriate ARIA attributes
- [ ] Color combinations meet contrast requirements

### Responsiveness
- [ ] Functions appropriately across all breakpoints
- [ ] Optimized for touch on mobile devices
- [ ] Appropriate component adaptation for different screens
- [ ] Maintains usability at all sizes
- [ ] Handles text resizing gracefully

### Content
- [ ] Follows voice and tone guidelines
- [ ] Uses consistent terminology
- [ ] Provides clear guidance and feedback
- [ ] Content is scannable and digestible
- [ ] Error messages are helpful and actionable

### Performance
- [ ] Meets bundle size budgets
- [ ] Optimizes data fetching
- [ ] Implements appropriate loading states
- [ ] Images are optimized
- [ ] Avoids unnecessary re-renders

### Security
- [ ] Validates user input
- [ ] Implements proper authentication checks
- [ ] Follows secure coding practices
- [ ] Handles sensitive data appropriately
- [ ] URL parameters are validated