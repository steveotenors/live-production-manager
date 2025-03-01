import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Award, ArrowRight, Users, Code, Star, Zap, Shield, Heart, Crown } from 'lucide-react';

export const metadata = {
  title: 'About Live Production Manager | Premium',
  description: 'Learn about the professional suite for managing live productions with the Premium Obsidian theme',
};

export default function AboutPage() {
  const team = [
    {
      name: 'Alexandra Reynolds',
      role: 'Founder & CEO',
      image: '/avatars/alexandra.jpg',
      bio: 'Former production director with 15+ years of experience, Alexandra founded Live Production Manager to solve the challenges she faced in the industry.',
    },
    {
      name: 'Marcus Chen',
      role: 'Lead Developer',
      image: '/avatars/marcus.jpg',
      bio: 'Full-stack developer specializing in performance optimization and real-time collaboration tools for creative professionals.',
    },
    {
      name: 'Sophia Williams',
      role: 'UX Design Lead',
      image: '/avatars/sophia.jpg',
      bio: 'User experience expert with a background in digital product design for film and broadcast production applications.',
    },
    {
      name: 'James Thompson',
      role: 'Customer Success',
      image: '/avatars/james.jpg',
      bio: 'Former stage manager who now helps production teams implement and get the most out of Live Production Manager.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-premium-gradient">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none"></div>
      
      {/* Hero section */}
      <section className="relative pt-20 pb-28 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair tracking-tight gradient-text mb-6">
              About Live Production Manager
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Crafted for professionals who demand excellence in every production
            </p>
            <div className="inline-flex items-center justify-center bg-primary/10 px-3 py-1 rounded-full mb-10">
              <Award className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm text-primary font-medium">Premium Obsidian Experience</span>
            </div>
            
            <div className="mt-10 glass rounded-xl max-w-4xl mx-auto p-6 md:p-10 obsidian-reflection">
              <blockquote className="text-xl md:text-2xl font-medium italic mb-6">
                "Our mission is to empower creative professionals with tools that are as refined and exceptional as the productions they create."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/30 mr-3">
                  <Image 
                    src="/avatars/alexandra.jpg" 
                    alt="Alexandra Reynolds" 
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium">Alexandra Reynolds</div>
                  <div className="text-sm text-muted-foreground">Founder & CEO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our story section */}
      <section className="py-20 px-4 relative bg-premium-gradient">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-playfair tracking-tight gradient-text mb-6">
              Our Story
            </h2>
            <p className="text-muted-foreground mb-6">
              Founded in 2020, Live Production Manager began as a solution to the challenges faced by production teams working in increasingly complex and digital environments.
            </p>
            <p className="text-muted-foreground mb-6">
              What started as an internal tool for a production company quickly evolved into a comprehensive suite designed to streamline workflows, enhance collaboration, and elevate the entire production experience.
            </p>
            <p className="text-muted-foreground mb-6">
              Today, Live Production Manager serves thousands of creative professionals across film, theater, broadcast, and event production, continually refined based on real-world feedback.
            </p>
            <Link 
              href="/about/history" 
              className="inline-flex items-center group text-primary hover:underline mt-4"
            >
              Read our full journey
              <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="glass p-6 rounded-xl obsidian-reflection relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-primary/5 rounded-lg border border-primary/10 text-center">
                <div className="text-4xl font-semibold gradient-text mb-1">250+</div>
                <div className="text-sm text-muted-foreground">Productions</div>
              </div>
              <div className="p-5 bg-primary/5 rounded-lg border border-primary/10 text-center">
                <div className="text-4xl font-semibold gradient-text mb-1">15k</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="p-5 bg-primary/5 rounded-lg border border-primary/10 text-center">
                <div className="text-4xl font-semibold gradient-text mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div className="p-5 bg-primary/5 rounded-lg border border-primary/10 text-center">
                <div className="text-4xl font-semibold gradient-text mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values section */}
      <section className="py-20 px-4 bg-premium-gradient">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-playfair tracking-tight gradient-text mb-6 text-center">
            Our Values
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-12">
            These core principles guide everything we do, from product development to customer relationships.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-premium obsidian-reflection hover-lift">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Collaboration First</h3>
                <p className="text-muted-foreground">
                  We believe that great productions come from seamless collaboration, and our tools are designed to enhance teamwork at every step.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-premium obsidian-reflection hover-lift">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Technical Excellence</h3>
                <p className="text-muted-foreground">
                  Our commitment to technical excellence ensures that our platform is reliable, performant, and secure—qualities that production professionals depend on.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-premium obsidian-reflection hover-lift">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Quality Above All</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality, whether in the code we write, the interfaces we design, or the support we provide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Team section */}
      <section className="py-20 px-4 bg-premium-gradient">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-playfair tracking-tight gradient-text mb-6 text-center">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-12">
            The passionate professionals behind Live Production Manager
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={member.name}
                className="glass p-6 rounded-xl obsidian-reflection hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4 border border-primary/20">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <h3 className="text-lg font-medium mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Premium features */}
      <section className="py-20 px-4 bg-premium-gradient relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-primary/10 px-3 py-1 rounded-full mb-6">
              <Crown className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm text-primary font-medium">Premium Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-playfair tracking-tight gradient-text mb-6">
              The Premium Obsidian Experience
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              A suite of exclusive features designed for professionals who demand the absolute best
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-xl obsidian-reflection hover-lift relative">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Advanced Security</h3>
              <p className="text-muted-foreground mb-4">
                Enhanced protection for your sensitive production data with end-to-end encryption and advanced access controls.
              </p>
              <Link 
                href="/features/security" 
                className="inline-flex items-center group text-primary hover:underline mt-2"
              >
                Learn more
                <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="glass p-6 rounded-xl obsidian-reflection hover-lift relative">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Priority Processing</h3>
              <p className="text-muted-foreground mb-4">
                Faster rendering, processing, and file operations with dedicated server resources for premium customers.
              </p>
              <Link 
                href="/features/performance" 
                className="inline-flex items-center group text-primary hover:underline mt-2"
              >
                Learn more
                <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="glass p-6 rounded-xl obsidian-reflection hover-lift relative">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Concierge Support</h3>
              <p className="text-muted-foreground mb-4">
                Direct access to our senior support team with guaranteed response times and personalized assistance.
              </p>
              <Link 
                href="/features/support" 
                className="inline-flex items-center group text-primary hover:underline mt-2"
              >
                Learn more
                <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/pricing" 
              className="button-premium inline-flex items-center"
            >
              Explore Premium Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass p-10 rounded-xl obsidian-reflection relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-playfair tracking-tight gradient-text mb-6 text-center">
              Ready to Transform Your Production Workflow?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Get in touch with our team to learn how Live Production Manager can elevate your projects
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact" 
                className="button-premium"
              >
                Contact Us
              </Link>
              <Link 
                href="/demo" 
                className="px-6 py-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 transition-colors duration-300"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 