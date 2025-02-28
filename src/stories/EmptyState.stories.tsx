import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '../components/ui/empty-state';
import { Button } from '../components/ui/button';
import { FolderOpen, Users, FileSearch, Bell, Inbox, PlusCircle } from 'lucide-react';

/**
 * Empty states provide user guidance when there's no content to display.
 * They help avoid dead-ends and guide users to appropriate next steps.
 */
const meta = {
  title: 'Design System/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title text',
    },
    description: {
      control: 'text',
      description: 'Supporting description text',
    },
    icon: {
      control: false,
      description: 'Icon element to display above the title',
    },
    action: {
      control: false,
      description: 'Call to action element (typically a button)',
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default empty state with all elements.
 */
export const Default: Story = {
  args: {
    icon: <FolderOpen />,
    title: 'No files found',
    description: 'Get started by creating your first file.',
    action: <Button>Create File</Button>,
  },
};

/**
 * Empty state without an icon.
 */
export const WithoutIcon: Story = {
  args: {
    title: 'No results matched your search',
    description: "Try adjusting your search or filter to find what you're looking for.",
    action: <Button variant="outline">Clear filters</Button>,
  },
};

/**
 * Empty state without an action.
 */
export const WithoutAction: Story = {
  args: {
    icon: <Bell />,
    title: 'No notifications',
    description: "When you have notifications, they'll appear here.",
  },
};

/**
 * Empty state with minimal content.
 */
export const Minimal: Story = {
  args: {
    title: 'No data available',
  },
};

/**
 * Empty state variations for different contexts.
 */
export const Variations: Story = {
  args: { 
    title: 'Default title',
  }, // Required to avoid type error
  render: (args) => (
    <div className="space-y-8 w-[600px]">
      {/* Search results empty state */}
      <EmptyState
        icon={<FileSearch />}
        title="No search results"
        description="We couldn't find any results for your search. Try using different keywords or filters."
        action={<Button variant="outline">Clear search</Button>}
      />
      
      {/* Team members empty state */}
      <EmptyState
        icon={<Users />}
        title="No team members"
        description="Your team doesn't have any members yet. Invite team members to collaborate."
        action={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite Team Members
          </Button>
        }
      />
      
      {/* Inbox empty state */}
      <EmptyState
        icon={<Inbox />}
        title="Your inbox is empty"
        description="When you receive messages, they'll appear here."
        className="border rounded-md p-6"
      />
    </div>
  ),
}; 