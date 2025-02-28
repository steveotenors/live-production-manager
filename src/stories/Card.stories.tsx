import type { Meta, StoryObj } from '@storybook/react';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../components/ui/card';
import { Button } from '../components/ui/button';

/**
 * Cards are used to group related content, providing a clear visual distinction for sections of content.
 */
const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { 
      control: 'text',
      description: 'Additional CSS classes to apply to the card'
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with minimal content.
 */
export const Basic: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>This is a basic card with simple content.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Full card with header, content, and footer.
 */
export const Complete: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text that explains what this card is about.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card where important information is displayed.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card as a clickable element, often used for navigation or selection.
 */
export const Clickable: Story = {
  render: () => (
    <Card className="w-[350px] hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle>Clickable Card</CardTitle>
        <CardDescription>Click this card to perform an action</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Cards can be made clickable by adding appropriate styles and event handlers.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with different visual emphasis using borders and shadows.
 */
export const Emphasis: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <Card className="w-[350px] border-2 border-primary">
        <CardHeader>
          <CardTitle>Primary Border</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with emphasized primary border.</p>
        </CardContent>
      </Card>
      
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with stronger shadow for higher visual prominence.</p>
        </CardContent>
      </Card>
      
      <Card className="w-[350px] bg-muted">
        <CardHeader>
          <CardTitle>Muted Background</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with muted background for less visual emphasis.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Card without padding for custom layouts or media content.
 */
export const NoPadding: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="aspect-video bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">Media Content</span>
      </div>
      <CardHeader>
        <CardTitle>Media Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card with flush media content at the top.</p>
      </CardContent>
    </Card>
  ),
}; 