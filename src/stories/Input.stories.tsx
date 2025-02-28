import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Search, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Input components are used to collect user data through form fields.
 */
const meta = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input with a placeholder.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
};

/**
 * Input with a label for better accessibility.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
};

/**
 * Input in a disabled state.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

/**
 * Input with helper text for additional context.
 */
export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-with-help">Email</Label>
      <Input type="email" id="email-with-help" placeholder="Enter your email" />
      <p className="text-sm text-muted-foreground">We'll never share your email with anyone else.</p>
    </div>
  ),
};

/**
 * Input with validation error state.
 */
export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error" className="text-destructive">Email</Label>
      <Input 
        type="email" 
        id="email-error" 
        placeholder="Enter your email" 
        className="border-destructive focus-visible:ring-destructive"
      />
      <p className="text-sm text-destructive">Please enter a valid email address.</p>
    </div>
  ),
};

/**
 * Input with icon for enhanced visual context.
 */
export const WithIcon: Story = {
  render: () => (
    <div className="grid gap-4 w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="pl-8" />
      </div>
      
      <div className="relative">
        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="email" placeholder="Email address" className="pl-8" />
      </div>
    </div>
  ),
};

/**
 * Input with toggle for password visibility.
 */
export const PasswordWithToggle: Story = {
  render: () => {
    const PasswordInput = () => {
      const [showPassword, setShowPassword] = useState(false);
      return (
        <div className="relative w-full max-w-sm">
          <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Enter password" 
            className="pl-8 pr-10"
          />
          <button 
            type="button"
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      );
    };
    return <PasswordInput />;
  }
};

/**
 * Input as part of a form with submit button.
 */
export const InForm: Story = {
  render: () => (
    <form className="w-full max-w-sm space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
      <Button type="submit" className="w-full">Sign In</Button>
    </form>
  ),
}; 