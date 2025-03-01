'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  Calendar, 
  Users, 
  Settings,
  PlusCircle,
  BarChart3,
  Zap,
  Clock,
  BellRing,
  TrendingUp,
  Activity,
  Timer,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useDesignSystem } from '@/lib/design-system';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { design } = useDesignSystem();
  
  // Solve hydration issues by only rendering content after mounting
  useEffect(() => {
    setMounted(true);
    
    // Force obsidian theme on dashboard page
    document.documentElement.classList.add('premium-obsidian-theme');
    document.body.style.backgroundColor = '#090909';
    
  }, []);
  
  // Basic stats
  const stats = [
    { 
      name: 'Total Projects', 
      value: 12, 
      change: '+3',
      trend: 'up',
      icon: <Layers className="h-5 w-5" />,
      description: 'Active portfolio'
    },
    { 
      name: 'Production Hours', 
      value: 487, 
      change: '+12%',
      trend: 'up',
      icon: <Timer className="h-5 w-5" />,
      description: 'This month'
    },
    { 
      name: 'Team Utilization', 
      value: '94%', 
      change: '+6%',
      trend: 'up',
      icon: <Users className="h-5 w-5" />,
      description: 'Above target'
    },
    { 
      name: 'Upcoming Deadlines', 
      value: 3, 
      change: '-1', 
      trend: 'neutral',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Next 7 days'
    }
  ];
  
  // Project status data
  const projectStatus = {
    total: 12,
    completed: 4,
    active: 5,
    atRisk: 1,
    onHold: 2
  };
  
  // Priority actions
  const priorityActions = [
    { 
      name: 'Review March Budget', 
      due: 'Today',
      priority: 'high',
      icon: <TrendingUp className="h-4 w-4" /> 
    },
    { 
      name: 'Finalize Event Schedule', 
      due: 'Tomorrow',
      priority: 'medium',
      icon: <Calendar className="h-4 w-4" /> 
    },
    { 
      name: 'Team Sync Meeting',
      due: '9:00 AM',
      priority: 'high',
      icon: <Users className="h-4 w-4" /> 
    }
  ];
  
  // Recent activity
  const activities = [
    {
      id: 1,
      action: 'Project milestone completed',
      project: 'Q2 Marketing Campaign',
      time: '2 hours ago',
      icon: <CheckCircle2 className="h-4 w-4 text-success" />
    },
    {
      id: 2,
      action: 'New team member added',
      project: 'Design Team',
      time: 'Yesterday',
      icon: <Users className="h-4 w-4 text-info" />
    },
    {
      id: 3,
      action: 'Budget updated',
      project: 'Annual Tech Conference',
      time: 'Yesterday',
      icon: <TrendingUp className="h-4 w-4 text-warning" />
    }
  ];
  
  // Don't render UI until after mounting to prevent hydration issues
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="bg-background space-y-8 relative">
      {/* Header with welcome message and stylish greeting */}
      <div className="glass obsidian-reflection rounded-xl overflow-hidden slide-in-bottom" style={{
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(8, 8, 10, 0.98) 100%)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 215, 0, 0.2)',
        borderColor: 'rgba(255, 215, 0, 0.15)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}>
        <div className="absolute inset-0 bg-gold-accent opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="relative p-8">
          <h1 className="text-6xl font-bold tracking-tight gradient-text slide-in-bottom">Welcome back</h1>
          <p className="text-foreground/90 mt-3 text-xl max-w-xl slide-in-bottom" style={{animationDelay: '0.1s'}}>
            Your production pipeline is running smoothly. 
            {projectStatus.atRisk > 0 && <span className="font-medium"> {projectStatus.atRisk} project needs attention.</span>}
          </p>
          <div className="flex gap-4 mt-8 slide-in-bottom" style={{animationDelay: '0.2s'}}>
            <button className="button-premium bg-black/60 backdrop-blur-sm text-primary border border-primary/30 flex items-center gap-2 hover:bg-black/80 obsidian-reflection">
              <PlusCircle className="h-4 w-4" />
              New Project
            </button>
            <button className="button-premium bg-primary/90 text-black font-semibold flex items-center gap-2 hover:bg-primary obsidian-finish">
              <Activity className="h-4 w-4" />
              View Analytics
            </button>
          </div>
        </div>
      </div>
      
      {/* Key Metrics with Premium Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className="glass card-premium hover-lift obsidian-reflection relative rounded-xl overflow-hidden group transition-all duration-300 slide-in-bottom"
            style={{
              animationDelay: `${0.1 + index * 0.05}s`,
              transform: 'translateZ(0)',
              backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)'
            }}
          >
            <div className="absolute inset-0 bg-dot-pattern opacity-40"></div>
            <div className="relative p-6">
              <div className="flex justify-between items-center mb-4">
                <div 
                  className="p-2.5 rounded-lg obsidian-finish"
                  style={{ 
                    background: 'rgba(255, 215, 0, 0.2)', 
                    color: '#FFD700',
                    boxShadow: '0 5px 15px rgba(255, 215, 0, 0.2)'
                  }}
                >
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-success' : 
                  stat.trend === 'down' ? 'text-destructive' : 
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                  {stat.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    stat.trend === 'down' ? 
                    <TrendingUp className="h-3 w-3 transform rotate-180" /> : 
                    null
                  }
                </div>
              </div>
              <h3 className="text-4xl font-bold tracking-tight gradient-text">{stat.value}</h3>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <p className="text-sm font-medium text-primary">{stat.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/metrics/${stat.name.toLowerCase().replace(' ', '-')}`}
                    className="text-primary hover:text-primary/90 text-sm font-medium flex items-center gap-1"
                  >
                    Details
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Status */}
          <div className="glass obsidian-reflection rounded-xl overflow-hidden slide-in-bottom card-premium" 
            style={{
              animationDelay: '0.3s',
              backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)'
            }}>
            <div className="absolute inset-0 bg-grid-pattern opacity-25"></div>
            <div className="relative px-6 py-5 border-b border-primary/20 flex justify-between items-center backdrop-blur-sm">
              <h2 className="text-xl font-semibold gradient-text">Project Status</h2>
              <Link 
                href="/projects"
                className="text-primary hover:text-primary/90 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="relative p-6">
              {/* Project Status Chart */}
              <div className="flex justify-between items-end mb-8">
                <div className="space-y-2 w-full">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm text-muted-foreground">{Math.round((projectStatus.completed / projectStatus.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-black/70 backdrop-blur-sm h-3 rounded-full overflow-hidden obsidian-finish border border-success/10">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(projectStatus.completed / projectStatus.total) * 100}%`,
                        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.7) 0%, rgba(16, 185, 129, 1) 100%)',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end mb-8">
                <div className="space-y-2 w-full">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Active</span>
                    <span className="text-sm text-muted-foreground">{Math.round((projectStatus.active / projectStatus.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-black/70 backdrop-blur-sm h-3 rounded-full overflow-hidden obsidian-finish border border-primary/10">
                    <div 
                      className="h-full rounded-full animate-shimmer"
                      style={{ 
                        width: `${(projectStatus.active / projectStatus.total) * 100}%`,
                        background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.7) 0%, rgba(255, 215, 0, 1) 100%)',
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end mb-8">
                <div className="space-y-2 w-full">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">At Risk</span>
                    <span className="text-sm text-muted-foreground">{Math.round((projectStatus.atRisk / projectStatus.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-black/70 backdrop-blur-sm h-3 rounded-full overflow-hidden obsidian-finish border border-destructive/10">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(projectStatus.atRisk / projectStatus.total) * 100}%`,
                        background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.7) 0%, rgba(220, 38, 38, 1) 100%)',
                        boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-2 w-full">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">On Hold</span>
                    <span className="text-sm text-muted-foreground">{Math.round((projectStatus.onHold / projectStatus.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-black/70 backdrop-blur-sm h-3 rounded-full overflow-hidden obsidian-finish border border-warning/10">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(projectStatus.onHold / projectStatus.total) * 100}%`,
                        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.7) 0%, rgba(245, 158, 11, 1) 100%)',
                        boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="glass obsidian-reflection rounded-xl overflow-hidden slide-in-bottom card-premium" 
            style={{
              animationDelay: '0.35s',
              backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)'
            }}>
            <div className="absolute inset-0 bg-grid-pattern opacity-25"></div>
            <div className="relative px-6 py-5 border-b border-primary/20 flex justify-between items-center backdrop-blur-sm">
              <h2 className="text-xl font-semibold gradient-text">Recent Activity</h2>
              <Link 
                href="/activity"
                className="text-primary hover:text-primary/90 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="relative divide-y divide-border/30">
              {activities.map((activity, idx) => (
                <div key={activity.id} className="p-4 hover:bg-black/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full p-2 bg-black/60 backdrop-blur-sm obsidian-finish border border-primary/10">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.project}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Priority Actions */}
          <div className="glass obsidian-reflection rounded-xl overflow-hidden slide-in-bottom card-premium" 
            style={{
              animationDelay: '0.4s',
              backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)'
            }}>
            <div className="absolute inset-0 bg-dot-pattern opacity-25"></div>
            <div className="relative px-6 py-5 border-b border-primary/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold gradient-text">Priority Actions</h2>
            </div>
            
            <div className="relative divide-y divide-border/30">
              {priorityActions.map((action, i) => (
                <div 
                  key={i} 
                  className="p-4 hover:bg-black/40 transition-colors flex items-center gap-3"
                >
                  <div className={`rounded-full p-2.5 obsidian-finish ${
                    action.priority === 'high' ? 'bg-destructive/20 text-destructive border border-destructive/30' : 
                    action.priority === 'medium' ? 'bg-warning/20 text-warning border border-warning/30' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.name}</p>
                    <p className="text-xs text-muted-foreground">Due: {action.due}</p>
                  </div>
                </div>
              ))}
              <div className="p-4">
                <button className="w-full py-2 rounded-lg border border-dashed border-primary/40 hover:border-primary/70 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 text-sm text-primary/80 hover:text-primary">
                  <PlusCircle className="h-4 w-4" />
                  Add Action Item
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Tools */}
          <div className="glass obsidian-reflection rounded-xl overflow-hidden slide-in-bottom card-premium" 
            style={{
              animationDelay: '0.45s',
              backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)'
            }}>
            <div className="absolute inset-0 bg-gold-accent opacity-25"></div>
            <div className="relative px-6 py-5 border-b border-primary/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold gradient-text">Quick Tools</h2>
            </div>
            
            <div className="relative p-4 grid grid-cols-2 gap-3">
              <Link href="/new-project" className="hover-lift obsidian-reflection col-span-1 p-4 rounded-lg bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center border border-primary/30">
                <PlusCircle className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">New Project</span>
              </Link>
              <Link href="/calendar" className="hover-lift obsidian-reflection col-span-1 p-4 rounded-lg bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center border border-primary/30">
                <Calendar className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">Calendar</span>
              </Link>
              <Link href="/analytics" className="hover-lift obsidian-reflection col-span-1 p-4 rounded-lg bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center border border-primary/30">
                <BarChart3 className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">Analytics</span>
              </Link>
              <Link href="/settings" className="hover-lift obsidian-reflection col-span-1 p-4 rounded-lg bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center border border-primary/30">
                <Settings className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 