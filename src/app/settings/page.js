'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Basic settings placeholders
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    compactMode: false
  });
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="your.email@example.com" disabled />
              <p className="text-xs text-muted-foreground">
                To change your email address, please contact support.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            
            <Button onClick={handleSave} className="mt-4">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings({...settings, emailNotifications: checked})
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle dark mode for the interface
                </p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={settings.darkMode}
                onCheckedChange={(checked) => 
                  setSettings({...settings, darkMode: checked})
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use a more compact interface with less spacing
                </p>
              </div>
              <Switch 
                id="compact-mode" 
                checked={settings.compactMode}
                onCheckedChange={(checked) => 
                  setSettings({...settings, compactMode: checked})
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 