/**
 * Utility functions for enhanced logging and debugging
 */

// Enhanced logger with timestamps and optional debug levels
export function logWithTimestamp(message: string, level: 'info' | 'warn' | 'error' | 'debug' = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  switch (level) {
    case 'error':
      console.error(`${prefix} ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`);
      break;
    case 'debug':
      console.debug(`${prefix} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

// Log client-side navigation events
export function setupNavigationLogger() {
  if (typeof window !== 'undefined') {
    // Log when the page starts to unload
    window.addEventListener('beforeunload', (e) => {
      logWithTimestamp(`Page unloading from ${window.location.href}`, 'debug');
    });
    
    // Track clicks for debugging
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        logWithTimestamp(`Link clicked: ${(link as HTMLAnchorElement).href}`, 'debug');
      }
      
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        logWithTimestamp(`Button clicked: ${target.textContent || 'unnamed button'}`, 'debug');
      }
    }, true);
    
    logWithTimestamp('Navigation logger initialized', 'info');
  }
}

// Log all available buttons on the page for debugging
export function logPageButtons() {
  if (typeof document !== 'undefined') {
    const buttons = document.querySelectorAll('button');
    logWithTimestamp(`Found ${buttons.length} buttons on page:`, 'debug');
    
    buttons.forEach((button, index) => {
      const text = button.textContent?.trim() || 'Empty';
      const classes = button.className;
      const type = button.getAttribute('type') || 'none';
      const hasClick = button.onclick ? 'has onclick' : 'no onclick';
      
      logWithTimestamp(`Button ${index+1}: "${text}" (${type}) ${hasClick} - Classes: ${classes}`, 'debug');
    });
  }
} 