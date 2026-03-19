/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  
  // Dark mode configuration
  darkMode: 'class', // or 'media'
  
  theme: {
    extend: {
      // Custom font family for Arabic support
      fontFamily: {
        sans: ['Tajawal', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        arabic: ['Tajawal', 'Arial', 'sans-serif'],
      },
      
      // Custom colors matching the project theme
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Auction-specific colors
        auction: {
          active: '#10b981',
          pending: '#f59e0b',
          ended: '#6b7280',
          winner: '#8b5cf6',
        },
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      
      // Custom border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Custom box shadows
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      
      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'auction-gradient': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      },
      
      // Animation and transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      
      // Custom transitions
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      
      // Custom z-index values
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Custom screen sizes
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      
      // Custom aspect ratios
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      
      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      
      // Custom typography
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xs': ['0.5rem', { lineHeight: '0.625rem' }],
      },
      
      // Custom line heights
      lineHeight: {
        '12': '3rem',
        '16': '4rem',
      },
      
      // Custom max widths
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      // Custom min heights
      minHeight: {
        '16': '4rem',
        '32': '8rem',
        '48': '12rem',
      },
    },
  },
  
  plugins: [
    // Add plugins as needed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    
    // Custom plugin for RTL support
    function({ addUtilities, addBase, theme }) {
      // RTL utilities
      const rtlUtilities = {
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
        '.text-start': {
          'text-align': 'start',
        },
        '.text-end': {
          'text-align': 'end',
        },
        // RTL margin utilities
        '.mr-auto-rtl': {
          'margin-inline-end': 'auto',
        },
        '.ml-auto-rtl': {
          'margin-inline-start': 'auto',
        },
        // RTL padding utilities
        '.pr-4-rtl': {
          'padding-inline-end': '1rem',
        },
        '.pl-4-rtl': {
          'padding-inline-start': '1rem',
        },
        // RTL border utilities
        '.border-r-rtl': {
          'border-inline-end-width': '1px',
        },
        '.border-l-rtl': {
          'border-inline-start-width': '1px',
        },
      };
      
      addUtilities(rtlUtilities);
      
      // Base styles for Arabic fonts
      addBase({
        'html': {
          'font-feature-settings': '"kern" 1',
          'text-rendering': 'optimizeLegibility',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        'body': {
          'font-family': theme('fontFamily.sans'),
          'line-height': '1.6',
        },
        '[dir="rtl"]': {
          'direction': 'rtl',
          'text-align': 'right',
        },
        '[dir="ltr"]': {
          'direction': 'ltr',
          'text-align': 'left',
        },
      });
    },
    
    // Custom plugin for auction-specific utilities
    function({ addComponents, theme }) {
      const components = {
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          fontWeight: '500',
          borderRadius: '0.5rem',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.600'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.primary.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.medium'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: '0.75rem',
          boxShadow: theme('boxShadow.soft'),
          transition: 'all 0.3s ease',
          border: `1px solid ${theme('colors.gray.200')}`,
          '&:hover': {
            boxShadow: theme('boxShadow.medium'),
            transform: 'translateY(-2px)',
          },
        },
        '.auction-status': {
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '500',
          '&.active': {
            backgroundColor: theme('colors.success.100'),
            color: theme('colors.success.800'),
          },
          '&.pending': {
            backgroundColor: theme('colors.warning.100'),
            color: theme('colors.warning.800'),
          },
          '&.ended': {
            backgroundColor: theme('colors.gray.100'),
            color: theme('colors.gray.600'),
          },
        },
      };
      
      addComponents(components);
    },
  ],
};