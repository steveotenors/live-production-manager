import React from 'react';
import { Award, Code, Clock, Zap, Check, Star } from 'lucide-react';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section className="py-20 overflow-hidden relative bg-premium-gradient slide-in-bottom">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main heading with premium gradient */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair tracking-tight gradient-text mb-4">
            About Live Production Manager
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A professional suite of tools designed for production teams that demand excellence
          </p>
        </div>
        
        {/* Feature grid with premium card styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="card-premium p-6 obsidian-reflection">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-3">Real-time Collaboration</h3>
            <p className="text-muted-foreground">
              Seamlessly work with your team in real-time with shared workspaces and instant updates.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="card-premium p-6 obsidian-reflection">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-3">Powerful Integrations</h3>
            <p className="text-muted-foreground">
              Connect with your favorite tools and services to streamline your production workflow.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="card-premium p-6 obsidian-reflection">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-3">Advanced Analytics</h3>
            <p className="text-muted-foreground">
              Gain insights into your production process with detailed analytics and reporting.
            </p>
          </div>
        </div>
        
        {/* Premium features section with glass effect */}
        <div className="glass p-8 rounded-xl mx-auto max-w-4xl mb-16 obsidian-reflection relative">
          <div className="absolute top-0 right-0 -mt-3 -mr-3">
            <div className="bg-primary/20 p-2 rounded-full shadow-gold-glow">
              <Award className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <h3 className="text-2xl font-playfair gradient-text mb-6">Premium Obsidian Experience</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-base font-medium">Luxury Design System</h4>
                <p className="text-sm text-muted-foreground">
                  Crafted with attention to every detail for an elegant user experience
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-base font-medium">Enhanced Animations</h4>
                <p className="text-sm text-muted-foreground">
                  Subtle, elegant animations that enhance the premium feel
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-base font-medium">Advanced Features</h4>
                <p className="text-sm text-muted-foreground">
                  Exclusive tools available only in the premium experience
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-base font-medium">Priority Support</h4>
                <p className="text-sm text-muted-foreground">
                  Dedicated support team with faster response times
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonial with premium styling */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-primary mx-0.5" fill="#D4AF37" />
            ))}
          </div>
          
          <blockquote className="text-xl md:text-2xl font-medium italic mb-6">
            "Live Production Manager has transformed how we handle our production workflow. The premium experience is truly exceptional."
          </blockquote>
          
          <div className="flex items-center justify-center">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-primary/30">
              <Image 
                src="/avatars/testimonial-author.jpg" 
                alt="Testimonial author" 
                layout="fill"
                objectFit="cover"
                unoptimized
              />
            </div>
            <div className="text-left">
              <div className="font-medium">Sarah Johnson</div>
              <div className="text-sm text-muted-foreground">Production Director, Stellar Studios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 