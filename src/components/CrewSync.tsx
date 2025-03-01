"use client";

import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Bell, Clock, Check, X, Send, UserPlus, ArrowRight, Headphones, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Types for crew members and messages
interface CrewMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  avatar?: string;
  lastActive?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isPriority?: boolean;
  cueReference?: string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  targetRoles?: string[];
}

interface CrewSyncProps {
  projectId?: string | number;
  className?: string;
  onSendMessage?: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  onSendAlert?: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  initialCrewMembers?: CrewMember[];
}

export function CrewSync({ 
  projectId, 
  className, 
  onSendMessage, 
  onSendAlert,
  initialCrewMembers = []
}: CrewSyncProps) {
  // State for crew members, messages, alerts, etc.
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>(initialCrewMembers.length > 0 ? initialCrewMembers : [
    { id: '1', name: 'Jane Smith', role: 'Musical Director', status: 'online', avatar: '/avatars/jane.jpg' },
    { id: '2', name: 'Mark Johnson', role: 'Sound Engineer', status: 'online', avatar: '/avatars/mark.jpg' },
    { id: '3', name: 'Sarah Williams', role: 'Lighting Designer', status: 'busy', avatar: '/avatars/sarah.jpg' },
    { id: '4', name: 'David Lee', role: 'Stage Manager', status: 'away', avatar: '/avatars/david.jpg' },
    { id: '5', name: 'Alicia Chen', role: 'Vocalist', status: 'offline', avatar: '/avatars/alicia.jpg' },
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: '1',
      senderName: 'Jane Smith',
      content: 'Let\'s ensure transitions between scenes 2 and 3 are smoother tonight.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true
    },
    {
      id: 'm2',
      senderId: '3',
      senderName: 'Sarah Williams',
      content: 'I\'ve updated the lighting cues for the finale. Check the shared doc.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: false,
      isPriority: true
    },
    {
      id: 'm3',
      senderId: '2',
      senderName: 'Mark Johnson',
      content: 'Audio levels are set for tonight\'s performance.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      isRead: false
    }
  ]);
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'a1',
      title: 'Show starting in 30 minutes',
      description: 'All crew members should be in position.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: true,
      priority: 'medium'
    },
    {
      id: 'a2',
      title: 'Tempo change for Act 2',
      description: 'The tempo for "Rising Action" has been adjusted to 112 BPM.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: false,
      priority: 'medium',
      targetRoles: ['Musical Director', 'Sound Engineer']
    },
    {
      id: 'a3',
      title: 'Emergency: Audio Equipment Issue',
      description: 'Main mixer showing intermittent failures. Please check before showtime.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      isRead: false,
      priority: 'high',
      targetRoles: ['Sound Engineer']
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [selectedCrewIds, setSelectedCrewIds] = useState<string[]>([]);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertDescription, setNewAlertDescription] = useState('');
  const [newAlertPriority, setNewAlertPriority] = useState<Alert['priority']>('medium');
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `m${Date.now()}`,
      senderId: '1', // Assuming current user is Jane (Musical Director)
      senderName: 'Jane Smith',
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      isPriority: selectedCrewIds.length > 0 // If specific crew members are selected, mark as priority
    };
    
    setMessages([message, ...messages]);
    setNewMessage('');
    
    if (onSendMessage) {
      onSendMessage({
        senderId: message.senderId,
        senderName: message.senderName,
        content: message.content,
        isRead: message.isRead,
        isPriority: message.isPriority
      });
    }
  };
  
  // Handle sending a new alert
  const handleSendAlert = () => {
    if (!newAlertTitle.trim() || !newAlertDescription.trim()) return;
    
    const alert: Alert = {
      id: `a${Date.now()}`,
      title: newAlertTitle,
      description: newAlertDescription,
      timestamp: new Date(),
      isRead: false,
      priority: newAlertPriority,
      targetRoles: selectedCrewIds.length > 0 
        ? crewMembers
            .filter(member => selectedCrewIds.includes(member.id))
            .map(member => member.role)
        : undefined
    };
    
    setAlerts([alert, ...alerts]);
    setNewAlertTitle('');
    setNewAlertDescription('');
    setNewAlertPriority('medium');
    setSelectedCrewIds([]);
    
    if (onSendAlert) {
      onSendAlert({
        title: alert.title,
        description: alert.description,
        isRead: alert.isRead,
        priority: alert.priority,
        targetRoles: alert.targetRoles
      });
    }
  };
  
  // Handle marking a message as read
  const handleMarkMessageRead = (id: string) => {
    setMessages(
      messages.map(message => 
        message.id === id ? { ...message, isRead: true } : message
      )
    );
  };
  
  // Handle marking an alert as read
  const handleMarkAlertRead = (id: string) => {
    setAlerts(
      alerts.map(alert => 
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };
  
  // Toggle crew member selection for targeted messages/alerts
  const toggleCrewSelection = (id: string) => {
    if (selectedCrewIds.includes(id)) {
      setSelectedCrewIds(selectedCrewIds.filter(crewId => crewId !== id));
    } else {
      setSelectedCrewIds([...selectedCrewIds, id]);
    }
  };
  
  // Format timestamps for display
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };
  
  // Helper function to render status badge
  const getStatusBadge = (status: CrewMember['status']) => {
    switch (status) {
      case 'online':
        return <span className="h-2.5 w-2.5 rounded-full bg-success"></span>;
      case 'away':
        return <span className="h-2.5 w-2.5 rounded-full bg-warning"></span>;
      case 'busy':
        return <span className="h-2.5 w-2.5 rounded-full bg-destructive"></span>;
      case 'offline':
        return <span className="h-2.5 w-2.5 rounded-full bg-muted"></span>;
      default:
        return <span className="h-2.5 w-2.5 rounded-full bg-muted"></span>;
    }
  };
  
  // Helper function for priority color
  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'low': return 'bg-primary/20 text-primary';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'high': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <Card className={`glass obsidian-reflection shadow-gold-glow ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="premium-gradient-text flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Crew Sync
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="crew" className="w-full">
        <TabsList className="grid w-full grid-cols-3 px-6">
          <TabsTrigger value="crew">Crew</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        {/* Crew Tab */}
        <TabsContent value="crew" className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium">Crew Members ({crewMembers.filter(m => m.status !== 'offline').length} active)</div>
            <Button variant="outline" size="sm" className="h-8">
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {crewMembers.map(member => (
              <div 
                key={member.id} 
                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 hover:bg-primary/5 ${
                  selectedCrewIds.includes(member.id) ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden border border-primary/10">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10">
                          <span className="text-xs">{member.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-background flex items-center justify-center">
                      {getStatusBadge(member.status)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground"
                    onClick={() => {
                      setNewMessage(`@${member.name}: `);
                      // Switch to chat tab
                      const chatTab = document.querySelector('[data-value="chat"]') as HTMLElement;
                      if (chatTab) chatTab.click();
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      selectedCrewIds.includes(member.id) 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => toggleCrewSelection(member.id)}
                  >
                    {selectedCrewIds.includes(member.id) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {selectedCrewIds.length > 0 && (
            <div className="mt-4 flex justify-between items-center p-2 border border-primary/10 rounded-lg bg-primary/5">
              <div className="text-sm">
                {selectedCrewIds.length} crew member{selectedCrewIds.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    // Switch to alerts tab
                    const alertsTab = document.querySelector('[data-value="alerts"]') as HTMLElement;
                    if (alertsTab) alertsTab.click();
                  }}
                >
                  <Bell className="h-3.5 w-3.5 mr-1" />
                  Alert
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    // Switch to chat tab
                    const chatTab = document.querySelector('[data-value="chat"]') as HTMLElement;
                    if (chatTab) chatTab.click();
                  }}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Chat Tab */}
        <TabsContent value="chat" className="px-6 py-4 space-y-4">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg ${
                    !message.isRead ? 'bg-primary/5 border border-primary/10' : 'bg-muted/10'
                  } ${message.isPriority ? 'ring-1 ring-primary/20' : ''}`}
                  onClick={() => !message.isRead && handleMarkMessageRead(message.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm">{message.senderName}</div>
                      {message.isPriority && (
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary px-1.5 py-0">
                          Priority
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</div>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))
            )}
          </div>
          
          <div className="pt-3 border-t border-primary/10">
            {selectedCrewIds.length > 0 && (
              <div className="mb-2 text-xs flex items-center text-primary">
                <span>Sending to {selectedCrewIds.length} crew member{selectedCrewIds.length !== 1 ? 's' : ''}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 ml-1 text-muted-foreground"
                  onClick={() => setSelectedCrewIds([])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="glass bg-muted/20 border-primary/20"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                variant="outline"
                className={`button-premium ${!newMessage.trim() ? 'opacity-50' : ''}`}
                disabled={!newMessage.trim()}
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Alerts Tab */}
        <TabsContent value="alerts" className="px-6 py-4 space-y-4">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No alerts to display.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg ${
                    !alert.isRead ? 'bg-primary/5 border border-primary/10' : 'bg-muted/10'
                  }`}
                  onClick={() => !alert.isRead && handleMarkAlertRead(alert.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(alert.priority)}`}>
                        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                      </Badge>
                      <div className="font-medium text-sm">{alert.title}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</div>
                  </div>
                  <p className="text-sm mb-2">{alert.description}</p>
                  {alert.targetRoles && alert.targetRoles.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Users className="h-3 w-3" />
                      <span>For: {alert.targetRoles.join(', ')}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="pt-3 border-t border-primary/10 space-y-3">
            {selectedCrewIds.length > 0 && (
              <div className="mb-2 text-xs flex items-center text-primary">
                <span>Alerting {selectedCrewIds.length} crew member{selectedCrewIds.length !== 1 ? 's' : ''}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 ml-1 text-muted-foreground"
                  onClick={() => setSelectedCrewIds([])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <Input
              value={newAlertTitle}
              onChange={(e) => setNewAlertTitle(e.target.value)}
              placeholder="Alert title..."
              className="glass bg-muted/20 border-primary/20"
            />
            
            <div className="flex gap-2">
              <Input
                value={newAlertDescription}
                onChange={(e) => setNewAlertDescription(e.target.value)}
                placeholder="Alert description..."
                className="glass bg-muted/20 border-primary/20 flex-1"
              />
              
              <select
                value={newAlertPriority}
                onChange={(e) => setNewAlertPriority(e.target.value as Alert['priority'])}
                className="w-24 p-2 rounded bg-muted/20 border border-primary/20 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              
              <Button 
                variant="outline"
                className={`button-premium ${!newAlertTitle.trim() || !newAlertDescription.trim() ? 'opacity-50' : ''}`}
                disabled={!newAlertTitle.trim() || !newAlertDescription.trim()}
                onClick={handleSendAlert}
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="border-t border-primary/10 pt-4 flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Last synced 2m ago</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-primary text-xs">
          <Headphones className="h-3.5 w-3.5 mr-1" />
          Quick Call
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CrewSync; 