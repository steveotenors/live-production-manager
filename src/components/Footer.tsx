import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Github, Twitter, Crown, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-premium-gradient border-t border-primary/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Company column */}
          <div className="space-y-4">
            <h3 className="text-xl font-playfair gradient-text">Live Production Manager</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional toolkit for managing and organizing live production workflows with premium features.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5 metallic-icon" />
              </a>
              <a href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5 metallic-icon" />
              </a>
            </div>
          </div>
          
          {/* Resources column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/documentation" 
                  className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex items-center group"
                >
                  Documentation
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/tutorials" 
                  className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex items-center group"
                >
                  Tutorials
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/api" 
                  className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex items-center group"
                >
                  API Reference
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex items-center group"
                >
                  Support Center
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* CTA column */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-xl relative overflow-hidden obsidian-reflection">
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Crown className="h-6 w-6 text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-3">Upgrade to Premium</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Get access to all premium features and themes, including the Obsidian experience.
              </p>
              <button className="footer-cta w-full group">
                <span>Upgrade Now</span>
                <Award className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="pt-8 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Live Production Manager. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center">
            <span className="text-xs text-muted-foreground mr-2">Made with</span>
            <Heart className="h-3 w-3 text-primary" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 