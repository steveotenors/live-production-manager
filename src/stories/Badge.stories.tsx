import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/ui/badge';

/**
 * Badges are used to highlight an item's status for quick recognition.
 */
const meta = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'info', 'warning', 'danger'],
      description: 'The visual style variant of the badge',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default badge style.
 */
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

/**
 * Secondary badge for less prominent information.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Destructive badge for error or warning states.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

/**
 * Outline badge for subtle highlighting.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * Success badge for positive status.
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

/**
 * Info badge for informational status.
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

/**
 * Warning badge for cautionary status.
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

/**
 * Danger badge for error status.
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
}; 