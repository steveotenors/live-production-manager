'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { validateClassNames, designPatterns, componentChecklist, designTokenUsage } from '@/lib/design-system-validator';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export default function DesignSystemValidator() {
  const [classNames, setClassNames] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  } | null>(null);

  const handleValidate = () => {
    if (!classNames.trim()) {
      setValidationResult(null);
      return;
    }
    
    const result = validateClassNames(classNames);
    setValidationResult(result);
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Design System Validator</h1>
        <p className="text-muted-foreground">
          Validate your components against the design system guidelines
        </p>
      </div>
      
      <Tabs defaultValue="validator">
        <TabsList>
          <TabsTrigger value="validator">Validator</TabsTrigger>
          <TabsTrigger value="patterns">Component Patterns</TabsTrigger>
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
          <TabsTrigger value="checklist">Component Checklist</TabsTrigger>
        </TabsList>
        
        {/* Validator Tab */}
        <TabsContent value="validator" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Validator</CardTitle>
              <CardDescription>
                Paste Tailwind class names to check if they follow design system guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="class-input">Tailwind Classes</Label>
                <Textarea 
                  id="class-input"
                  placeholder="e.g. bg-blue-500 p-[15px] text-[12px]"
                  value={classNames}
                  onChange={(e) => setClassNames(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleValidate}>Validate</Button>
            </CardFooter>
          </Card>
          
          {validationResult && (
            <div className="space-y-4">
              {validationResult.isValid ? (
                <Alert>
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertTitle>Valid Classes</AlertTitle>
                  <AlertDescription>
                    These classes follow the design system guidelines.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Design System Violations</AlertTitle>
                  <AlertDescription>
                    <div className="pt-2 space-y-4">
                      <div>
                        <h4 className="font-medium">Warnings:</h4>
                        <ul className="list-disc pl-5 pt-1 space-y-1">
                          {validationResult.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Suggestions:</h4>
                        <ul className="list-disc pl-5 pt-1 space-y-1">
                          {validationResult.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Component Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Patterns</CardTitle>
              <CardDescription>
                Standard patterns for component implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(designPatterns).map(([component, details]) => (
                <div key={component} className="space-y-2">
                  <h3 className="text-lg font-medium capitalize">{component}</h3>
                  <div className="space-y-3 pl-2 border-l-2 border-muted">
                    {Object.entries(details).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="text-sm font-medium capitalize">{key}:</h4>
                        {Array.isArray(value) ? (
                          <div className="pl-4">
                            {value.map((item, i) => (
                              <div key={i} className="text-sm">• {item}</div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm pl-4">{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Design Tokens Tab */}
        <TabsContent value="tokens" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Design Tokens</CardTitle>
              <CardDescription>
                Guidelines for using design tokens consistently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="colors">
                <TabsList className="w-full">
                  {Object.keys(designTokenUsage).map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(designTokenUsage).map(([category, tokens]) => (
                  <TabsContent key={category} value={category} className="pt-4 space-y-4">
                    <div className="grid gap-4">
                      {Object.entries(tokens).map(([token, details]) => (
                        <Card key={token}>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base capitalize">{token}</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0 space-y-2">
                            <div>
                              <span className="text-xs text-muted-foreground">Usage:</span>
                              <p className="text-sm">{details.usage}</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Example:</span>
                              <p className="text-sm p-2 bg-muted rounded font-mono text-xs">
                                {details.example}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Component Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Checklist</CardTitle>
              <CardDescription>
                Ensure your components meet these criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(componentChecklist).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-lg font-medium capitalize">{category}</h3>
                  <div className="grid gap-2">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 rounded border bg-background">
                        <div className="mt-0.5">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 