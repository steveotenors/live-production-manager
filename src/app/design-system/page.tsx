'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Container } from '@/components/ui/container';
import { tokens } from '@/styles/tokens';
import { AlertTriangle, Check, Info, PlusCircle, X } from 'lucide-react';

export default function DesignSystemPage() {
  // State for dialog examples
  const [standardOpen, setStandardOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [miniOpen, setMiniOpen] = useState(false);
  
  // Progress example state
  const [progress, setProgress] = useState(45);
  
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Design System</h1>
          <p className="text-muted-foreground">
            A comprehensive guide to our design system components and patterns.
          </p>
        </div>
        
        {/* Typography Section */}
        <section id="typography" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Typography</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Headings</h3>
              <div className="space-y-4 border rounded-lg p-4">
                <h1 className="text-4xl font-bold">Heading 1</h1>
                <h2 className="text-3xl font-bold">Heading 2</h2>
                <h3 className="text-2xl font-bold">Heading 3</h3>
                <h4 className="text-xl font-bold">Heading 4</h4>
                <h5 className="text-lg font-bold">Heading 5</h5>
                <h6 className="text-base font-bold">Heading 6</h6>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Body Text</h3>
              <div className="space-y-4 border rounded-lg p-4">
                <p className="text-base">
                  Default paragraph text. Our design system uses a clean, readable font for all body content.
                </p>
                <p className="text-sm">
                  Small text is used for secondary information and UI elements.
                </p>
                <p className="text-xs">
                  Extra small text is used sparingly for very detailed information.
                </p>
                <p className="text-muted-foreground">
                  Muted text is used for less important content.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Colors Section */}
        <section id="colors" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Colors</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Primary Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-primary"></div>
                  <p className="text-sm font-medium">Primary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-primary-foreground"></div>
                  <p className="text-sm font-medium">Primary Foreground</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-secondary"></div>
                  <p className="text-sm font-medium">Secondary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-secondary-foreground"></div>
                  <p className="text-sm font-medium">Secondary Foreground</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">UI Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-background"></div>
                  <p className="text-sm font-medium">Background</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-foreground"></div>
                  <p className="text-sm font-medium">Foreground</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-muted"></div>
                  <p className="text-sm font-medium">Muted</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-muted-foreground"></div>
                  <p className="text-sm font-medium">Muted Foreground</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Status Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-destructive"></div>
                  <p className="text-sm font-medium">Destructive</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-success"></div>
                  <p className="text-sm font-medium">Success</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-warning"></div>
                  <p className="text-sm font-medium">Warning</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-info"></div>
                  <p className="text-sm font-medium">Info</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Buttons Section */}
        <section id="buttons" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Buttons</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Primary Variants</h3>
              <div className="flex flex-wrap gap-4 border rounded-lg p-4">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Primary buttons are used for main actions and call-to-actions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4 border rounded-lg p-4">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Button sizes can be adjusted based on context and importance.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">States</h3>
              <div className="flex flex-wrap gap-4 border rounded-lg p-4">
                <Button isLoading>Processing...</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Buttons can show loading state or be disabled.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">With Icons</h3>
              <div className="flex flex-wrap gap-4 border rounded-lg p-4">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                <Button variant="destructive">
                  <X className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="success">
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Icons can be added to buttons for better visual context.
              </p>
            </div>
          </div>
        </section>
        
        {/* Badges Section */}
        <section id="badges" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Badges</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Variants</h3>
              <div className="flex flex-wrap gap-4 border rounded-lg p-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Badges are used to highlight status, count, or categorization.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">With Icons</h3>
              <div className="flex flex-wrap gap-4 border rounded-lg p-4">
                <Badge>
                  <Check className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
                <Badge variant="destructive">
                  <X className="mr-1 h-3 w-3" />
                  Failed
                </Badge>
                <Badge variant="warning">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Warning
                </Badge>
                <Badge variant="info">
                  <Info className="mr-1 h-3 w-3" />
                  Info
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Icons can be added to badges for better visual context.
              </p>
            </div>
          </div>
        </section>
        
        {/* Cards Section */}
        <section id="cards" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Cards</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Standard Card</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card Description that provides more context.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content goes here. This can include text, images, or other components.</p>
                </CardContent>
                <CardFooter>
                  <Button>Action Button</Button>
                </CardFooter>
              </Card>
              <p className="text-sm text-muted-foreground mt-2">
                Standard cards are used to group related information.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Card Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                  </CardHeader>
                  <CardContent>Default card style</CardContent>
                </Card>
                
                <Card className="border">
                  <CardHeader>
                    <CardTitle>Outline Card</CardTitle>
                  </CardHeader>
                  <CardContent>Outline card variant</CardContent>
                </Card>
                
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                  </CardHeader>
                  <CardContent>Elevated card with shadow</CardContent>
                </Card>
                
                <Card className="p-2">
                  <CardHeader className="p-2">
                    <CardTitle>Compact Card</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">Compact card with less padding</CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Dialogs Section */}
        <section id="dialogs" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Dialogs</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Dialog Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4">
                <div>
                  <Button onClick={() => setStandardOpen(true)}>Open Standard Dialog</Button>
                  <Dialog open={standardOpen} onOpenChange={setStandardOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Standard Dialog</DialogTitle>
                        <DialogDescription>
                          This is the standard dialog variant, suitable for most use cases.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p>Dialog content goes here. This is the main area of the dialog.</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setStandardOpen(false)}>Cancel</Button>
                        <Button onClick={() => setStandardOpen(false)}>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div>
                  <Button onClick={() => setPanelOpen(true)}>Open Panel Dialog</Button>
                  <Dialog open={panelOpen} onOpenChange={setPanelOpen}>
                    <DialogContent variant="panel" side="right">
                      <DialogHeader>
                        <DialogTitle>Panel Dialog</DialogTitle>
                        <DialogDescription>
                          Panel dialogs slide in from the side and are good for detailed forms.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p>Panel content goes here. This has more vertical space for complex content.</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setPanelOpen(false)}>Cancel</Button>
                        <Button onClick={() => setPanelOpen(false)}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div>
                  <Button onClick={() => setFullscreenOpen(true)}>Open Fullscreen Dialog</Button>
                  <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
                    <DialogContent variant="fullscreen">
                      <DialogHeader>
                        <DialogTitle>Fullscreen Dialog</DialogTitle>
                        <DialogDescription>
                          Fullscreen dialogs take up the entire viewport.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p>This dialog is ideal for immersive experiences or complex workflows.</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setFullscreenOpen(false)}>Cancel</Button>
                        <Button onClick={() => setFullscreenOpen(false)}>Apply</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div>
                  <Button onClick={() => setMiniOpen(true)}>Open Mini Dialog</Button>
                  <Dialog open={miniOpen} onOpenChange={setMiniOpen}>
                    <DialogContent variant="mini">
                      <DialogHeader>
                        <DialogTitle>Mini Dialog</DialogTitle>
                      </DialogHeader>
                      <div className="py-2">
                        <p>A compact dialog for simple confirmations.</p>
                      </div>
                      <DialogFooter>
                        <Button size="sm" onClick={() => setMiniOpen(false)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Different dialog variants serve different UX purposes.
              </p>
            </div>
          </div>
        </section>
        
        {/* Forms Section */}
        <section id="forms" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Forms</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Form Elements</h3>
              <div className="border rounded-lg p-6">
                <div className="grid gap-6 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                    <p className="text-sm text-muted-foreground">
                      We'll never share your email with anyone else.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Create a password" />
                  </div>
                  
                  <Button>Submit</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Basic form elements including labels, inputs, and descriptions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Form with Validation</h3>
              <div className="border rounded-lg p-6">
                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage>
                      Username must be at least 2 characters.
                    </FormMessage>
                  </div>
                  <Button type="submit">Submit</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Form with validation example.
              </p>
            </div>
          </div>
        </section>
        
        {/* Empty States Section */}
        <section id="empty-states" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Empty States</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Default Empty State</h3>
              <div className="border rounded-lg p-4">
                <EmptyState 
                  title="No items found" 
                  description="Get started by creating your first item."
                  icon="inbox"
                >
                  <Button>Add Item</Button>
                </EmptyState>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Empty states provide feedback when there's no content to display.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Empty State Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <EmptyState 
                    title="No results" 
                    description="Try adjusting your search or filters."
                    icon="search"
                  />
                </div>
                <div className="border rounded-lg p-4">
                  <EmptyState 
                    title="No notifications" 
                    description="We'll notify you when something new arrives."
                    icon="bell"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Loading States Section */}
        <section id="loading-states" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Loading States</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Spinners</h3>
              <div className="flex flex-wrap gap-8 items-center border rounded-lg p-6">
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <p className="text-sm">Small</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner />
                  <p className="text-sm">Default</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="lg" />
                  <p className="text-sm">Large</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Loading spinners indicate that content is being loaded.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Page Loading</h3>
              <div className="border rounded-lg p-6 h-40 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Page loading component for full-page loading states.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Button Loading</h3>
              <div className="flex gap-4 border rounded-lg p-6">
                <Button isLoading>Loading</Button>
                <Button variant="outline" isLoading>Loading</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Buttons can display loading states for operations in progress.
              </p>
            </div>
          </div>
        </section>
        
        {/* Progress Section */}
        <section id="progress" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Progress</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Progress Bar</h3>
              <div className="space-y-6 border rounded-lg p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Default</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} max={100} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Variant</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} max={100} variant="success" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>With Value Display</span>
                  </div>
                  <Progress value={progress} max={100} showValue />
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm">Adjust value:</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => setProgress(Math.max(0, progress - 10))}
                    >
                      Decrease
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setProgress(Math.min(100, progress + 10))}
                    >
                      Increase
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setProgress(45)}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Progress bars indicate completion of a task or process.
              </p>
            </div>
          </div>
        </section>
        
        {/* Container Section */}
        <section id="container" className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Container</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Container Variants</h3>
              <div className="space-y-4">
                <Container>
                  <div className="h-20 flex items-center justify-center bg-muted/30 rounded-md">
                    Default Container
                  </div>
                </Container>
                
                <Container size="sm">
                  <div className="h-20 flex items-center justify-center bg-muted/30 rounded-md">
                    Small Container
                  </div>
                </Container>
                
                <Container size="lg">
                  <div className="h-20 flex items-center justify-center bg-muted/30 rounded-md">
                    Large Container
                  </div>
                </Container>
                
                <Container className="flex items-center justify-center">
                  <div className="h-20 flex items-center justify-center bg-muted/30 rounded-md w-full">
                    Centered Container
                  </div>
                </Container>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Containers provide consistent content width and spacing.
              </p>
            </div>
          </div>
        </section>
        
        <div className="h-16"></div>
      </div>
    </div>
  );
} 