/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '1.5rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  			serif: ['var(--font-playfair)', 'Georgia', 'serif'],
  			mono: ['var(--font-jetbrains-mono)', 'monospace'],
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				50: '#F9F4E1',
  				100: '#F2E9C4',
  				200: '#E9DDA7',
  				300: '#E0D28A',
  				400: '#D8C66D',
  				500: '#D4AF37',
  				600: '#BF9B30',
  				700: '#A98729',
  				800: '#947322',
  				900: '#7E5F1B',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  				50: '#EAEDEE',
  				100: '#D5DBDD',
  				200: '#ABB8BB',
  				300: '#82949A',
  				400: '#587178',
  				500: '#2E3536',
  				600: '#2A3132',
  				700: '#252C2D',
  				800: '#202728',
  				900: '#1C2526',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			danger: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 0.15rem)',
  			sm: 'calc(var(--radius) - 0.3rem)'
  		},
  		transitionDuration: {
  			fast: 'var(--animation-fast)',
  			DEFAULT: 'var(--animation-default)',
  			medium: 'var(--animation-medium)',
  			slow: 'var(--animation-slow)',
  		},
  		boxShadow: {
  			sm: 'var(--elevation-1)',
  			DEFAULT: 'var(--elevation-2)',
  			lg: 'var(--elevation-3)',
  			'premium-sm': '0 3px 15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.1)',
  			'premium-md': '0 6px 25px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(212, 175, 55, 0.15)',
  			'premium-lg': '0 12px 40px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(212, 175, 55, 0.2)',
  			'premium-inner': 'inset 0 2px 5px rgba(212, 175, 55, 0.05)',
  			'gold-glow': '0 0 15px rgba(212, 175, 55, 0.4)',
  		},
  		backgroundImage: {
  			'premium-gradient': 'linear-gradient(135deg, #1C2526 0%, #2E3536 100%)',
  			'gold-gradient': 'linear-gradient(to right, #D4AF37, #BF9B30, #D4AF37)',
  			'glass-gradient': 'linear-gradient(135deg, rgba(46, 53, 54, 0.7) 0%, rgba(28, 37, 38, 0.8) 100%)',
  			'card-highlight': 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0) 60%)',
  		},
  		keyframes: {
  			"accordion-down": {
  				from: { height: 0 },
  				to: { height: "var(--radix-accordion-content-height)" },
  			},
  			"accordion-up": {
  				from: { height: "var(--radix-accordion-content-height)" },
  				to: { height: 0 },
  			},
  			shimmer: {
  				"0%": { backgroundPosition: "0% 50%" },
  				"50%": { backgroundPosition: "100% 50%" },
  				"100%": { backgroundPosition: "0% 50%" },
  			},
  			fadeIn: {
  				"0%": { opacity: 0 },
  				"100%": { opacity: 1 },
  			},
  			slideUp: {
  				"0%": { transform: "translateY(10px)", opacity: 0 },
  				"100%": { transform: "translateY(0)", opacity: 1 },
  			},
  			pulse: {
  				"0%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.4)" },
  				"70%": { boxShadow: "0 0 0 10px rgba(212, 175, 55, 0)" },
  				"100%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0)" },
  			},
  			goldPulse: {
  				"0%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.7)" },
  				"70%": { boxShadow: "0 0 0 10px rgba(212, 175, 55, 0)" },
  				"100%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0)" },
  			},
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  			shimmer: "shimmer 5s infinite linear",
  			"shimmer-slow": "shimmer 10s infinite linear",
  			"fade-in": "fadeIn 0.5s ease-in-out forwards",
  			"slide-up": "slideUp 0.4s ease-out forwards",
  			pulse: "pulse 10s infinite",
  			"gold-pulse": "goldPulse 0.5s ease-out",
  		},
  		backdropBlur: {
  			xs: '2px',
  			premium: '10px',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}