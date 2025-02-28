# Storybook Guide for Live Production Manager

This guide explains how to use Storybook to document and test components in the Live Production Manager application.

## Getting Started

### Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build static Storybook site
npm run build-storybook
```

Storybook will run at http://localhost:6006 by default.

## Creating Stories

### Basic Story Structure

Create a file with the naming pattern `[component-name].stories.tsx` in the same directory as your component:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "./your-component";

const meta = {
  title: "Design System/YourComponent",
  component: YourComponent,
  parameters: {
    layout: "centered",  // or "padded" for non-centered components
  },
  tags: ["autodocs"],    // enables automatic documentation
  argTypes: {
    // Define controls for your component props
    variant: {
      control: "select",
      options: ["default", "primary", "secondary"],
    },
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story with args
export const Default: Story = {
  args: {
    children: "Example Content",
    variant: "default",
  },
};

// Story with custom rendering
export const CustomRender: Story = {
  render: (args) => (
    <div style={{ padding: "20px", background: "#f0f0f0" }}>
      <YourComponent {...args} />
    </div>
  ),
  args: {
    children: "Custom Rendered Component",
  },
};
```

### Using Args

Args are the primary way to define the state of your component examples:

```tsx
export const Primary: Story = {
  args: {
    variant: "primary",
    disabled: false,
    children: "Primary Button",
  },
};
```

### Controls

Controls allow interactive modification of component props. Define them in `argTypes`:

```tsx
argTypes: {
  size: {
    control: "select",
    options: ["sm", "md", "lg"],
    description: "Size of the component",
  },
  disabled: {
    control: "boolean",
    description: "Whether the component is disabled",
  },
  onClick: {
    action: "clicked",
    description: "Called when the component is clicked",
  },
}
```

## Organization

### Naming Conventions

- **File naming**: `[component-name].stories.tsx`
- **Title structure**: `"Design System/[Component Category]/[Component]"`
  - Example: `"Design System/Inputs/Checkbox"`

### Component Documentation

Use JSDoc comments in your component files to enhance auto-generated documentation:

```tsx
/**
 * Button component for user interactions.
 * @param variant - The visual style of the button
 * @param size - The size of the button
 */
export function Button({ 
  variant = "default", 
  size = "md",
  ...props 
}: ButtonProps) {
  // Component implementation
}
```

## Best Practices

1. **Create stories for all variants**: Document each meaningful variation of your components
2. **Group related components**: Keep similar components in the same category
3. **Test edge cases**: Include stories for loading states, errors, long content, etc.
4. **Include accessibility info**: Document a11y considerations for each component
5. **Show composition examples**: Demonstrate how components work together

## Adding Addons

To add new functionality to Storybook, install and register addons in `.storybook/main.ts`:

```ts
const config: StorybookConfig = {
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",  // Add accessibility testing
    "@storybook/addon-interactions",  // Add interaction testing
  ],
  // ... other configuration
};
```

## Troubleshooting

- **CSS not loading**: Ensure global styles are imported in `.storybook/preview.ts`
- **Component not rendering**: Check for dependencies on context providers
- **Controls not working**: Verify argTypes configuration matches component props

## Resources

- [Storybook Docs](https://storybook.js.org/docs/react/get-started/introduction)
- [Component Story Format](https://storybook.js.org/docs/react/api/csf)
- [Controls](https://storybook.js.org/docs/react/essentials/controls) 