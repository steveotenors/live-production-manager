import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/ui/progress';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';

/**
 * Progress bars are used to show the progress of an operation or to visualize data.
 */
const meta = {
  title: 'Design System/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Current progress value (0-100)',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value (defaults to 100)',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the percentage value',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'info', 'warning', 'danger'],
      description: 'Visual style of the progress bar',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default progress bar with a value of 40%.
 */
export const Default: Story = {
  args: {
    value: 40,
    max: 100,
  },
};

/**
 * Progress bar that displays the percentage value.
 */
export const WithValue: Story = {
  args: {
    value: 65,
    max: 100,
    showValue: true,
  },
};

/**
 * Different visual styles for the progress bar.
 */
export const Variants: Story = {
  args: { value: 0 },
  render: (args) => (
    <div className="space-y-4 w-[300px]">
      <div className="space-y-1">
        <div className="text-sm font-medium">Default</div>
        <Progress value={80} />
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium">Success</div>
        <Progress value={100} variant="success" />
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium">Info</div>
        <Progress value={60} variant="info" />
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium">Warning</div>
        <Progress value={40} variant="warning" />
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium">Danger</div>
        <Progress value={20} variant="danger" />
      </div>
    </div>
  )
};

/**
 * Progress bar that animates to simulate a loading process.
 */
export const Animated: Story = {
  args: { value: 0 },
  render: (args) => {
    const ProgressExample = () => {
      const [progress, setProgress] = useState(0);
      const [isRunning, setIsRunning] = useState(false);
      
      useEffect(() => {
        if (!isRunning) return;
        
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsRunning(false);
              return 100;
            }
            return prev + 5;
          });
        }, 300);
        
        return () => clearInterval(interval);
      }, [isRunning]);
      
      const startProgress = () => {
        setProgress(0);
        setIsRunning(true);
      };
      
      return (
        <div className="space-y-4 w-[300px]">
          <Progress value={progress} showValue />
          <div className="flex justify-between">
            <Button 
              onClick={startProgress} 
              disabled={isRunning}
              size="sm"
            >
              {isRunning ? 'Loading...' : 'Start Progress'}
            </Button>
            <Button 
              onClick={() => setProgress(0)} 
              variant="outline" 
              size="sm"
              disabled={isRunning || progress === 0}
            >
              Reset
            </Button>
          </div>
        </div>
      );
    };
    
    return <ProgressExample />;
  }
};

/**
 * Example showing different sizes of progress bars.
 */
export const Sizes: Story = {
  args: { value: 0 },
  render: (args) => (
    <div className="space-y-6 w-[300px]">
      <div className="space-y-1">
        <div className="text-sm font-medium">Small (h-1)</div>
        <Progress value={60} className="h-1" />
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium">Default (h-2)</div>
        <Progress value={60} />
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium">Medium (h-3)</div>
        <Progress value={60} className="h-3" />
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium">Large (h-4)</div>
        <Progress value={60} className="h-4" />
      </div>
    </div>
  )
}; 