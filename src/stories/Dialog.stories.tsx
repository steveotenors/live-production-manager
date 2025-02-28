import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

/**
 * Dialogs are overlay components that present content and enable user interaction.
 * They appear above the page and require user action, providing a focused interaction experience.
 */
const meta = {
  title: 'Design System/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard dialog with title, description, and footer actions.
 */
export const Standard: Story = {
  render: () => {
    // Using a wrapper component to manage state since Story doesn't support hooks directly
    const StandardDialogExample = () => {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue="John Doe" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" defaultValue="johndoe" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };
    return <StandardDialogExample />;
  }
};

/**
 * Dialog with a destructive action that requires confirmation.
 */
export const Destructive: Story = {
  render: () => {
    const DestructiveDialogExample = () => {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the item and remove it from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };
    return <DestructiveDialogExample />;
  }
};

/**
 * Panel dialog variant that slides in from the side of the screen.
 */
export const Panel: Story = {
  render: () => {
    const PanelDialogExample = () => {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Open Panel</Button>
          </DialogTrigger>
          <DialogContent variant="panel" side="right" className="sm:max-w-[350px]">
            <DialogHeader>
              <DialogTitle>Side Panel</DialogTitle>
              <DialogDescription>
                This panel slides in from the side of the screen, making it ideal for persistent filters or detail views.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Panel content goes here. This has more vertical space for complex content.</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };
    return <PanelDialogExample />;
  }
};

/**
 * Mini dialog for simple confirmations or alerts.
 */
export const Mini: Story = {
  render: () => {
    const MiniDialogExample = () => {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Show Alert</Button>
          </DialogTrigger>
          <DialogContent variant="mini">
            <DialogHeader>
              <DialogTitle>Action Completed</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <p>Your action has been completed successfully.</p>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setOpen(false)}>Okay</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };
    return <MiniDialogExample />;
  }
}; 