import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Info as InfoIcon, AlertCircle, CheckCircle, XCircle, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';

/**
 * Alert components are used to communicate status information to users.
 * They provide contextual feedback about user actions or system status.
 */
const meta = {
  title: 'Design System/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'info', 'warning', 'destructive'],
      description: 'The visual style of the alert',
    },
    icon: {
      control: false,
      description: 'Custom icon to display (overrides the default icon)',
    },
    onClose: {
      control: false,
      description: 'Function called when the close button is clicked',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default alert with title and description.
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <AlertTitle>Alert</AlertTitle>
        <AlertDescription>This is a default alert with some important information.</AlertDescription>
      </>
    ),
  },
};

/**
 * Success alert for positive confirmations.
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: (
      <>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved successfully.</AlertDescription>
      </>
    ),
  },
};

/**
 * Info alert for general information and updates.
 */
export const InfoAlert: Story = {
  args: {
    variant: 'info',
    children: (
      <>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>A new version of the application is available.</AlertDescription>
      </>
    ),
  },
};

/**
 * Warning alert for potential issues.
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: (
      <>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Your account subscription will expire in 3 days.</AlertDescription>
      </>
    ),
  },
};

/**
 * Destructive alert for errors or critical issues.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to save changes. Please try again later.</AlertDescription>
      </>
    ),
  },
};

/**
 * Alert with a custom icon.
 */
export const CustomIcon: Story = {
  args: {
    variant: 'info',
    icon: <Bell />,
    children: (
      <>
        <AlertTitle>Notification</AlertTitle>
        <AlertDescription>You have 5 unread messages in your inbox.</AlertDescription>
      </>
    ),
  },
};

/**
 * Alert with a close button.
 */
export const Dismissible: Story = {
  render: () => {
    const DismissibleAlert = () => {
      const [visible, setVisible] = useState(true);
      
      if (!visible) {
        return (
          <div className="w-[450px] p-4 flex justify-center">
            <Button onClick={() => setVisible(true)}>Show Alert Again</Button>
          </div>
        );
      }
      
      return (
        <Alert 
          variant="info"
          onClose={() => setVisible(false)}
          className="w-[450px]"
        >
          <AlertTitle>Dismissible Alert</AlertTitle>
          <AlertDescription>
            This alert can be dismissed by clicking the close button.
          </AlertDescription>
        </Alert>
      );
    };
    
    return <DismissibleAlert />;
  },
};

/**
 * Alert with an action button.
 */
export const WithAction: Story = {
  args: {
    variant: 'warning',
    children: (
      <>
        <AlertTitle>Upgrade Required</AlertTitle>
        <AlertDescription className="flex flex-col space-y-4">
          <p>Your current plan has reached its storage limit.</p>
          <Button size="sm" className="w-fit">Upgrade Plan</Button>
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Multiple alerts showing different statuses.
 */
export const AlertGroup: Story = {
  render: () => (
    <div className="space-y-4 w-[450px]">
      <Alert variant="success">
        <CheckCircle />
        <AlertTitle>Profile Updated</AlertTitle>
        <AlertDescription>Your profile information has been updated successfully.</AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>New Feature</AlertTitle>
        <AlertDescription>We've added a new dashboard feature to help you track progress.</AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertCircle />
        <AlertTitle>Session Expiring</AlertTitle>
        <AlertDescription>Your session will expire in 5 minutes. Please save your work.</AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>Connection Lost</AlertTitle>
        <AlertDescription>Unable to connect to the server. Please check your internet connection.</AlertDescription>
      </Alert>
    </div>
  ),
}; 