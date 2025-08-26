import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Breakpoints personalizados para móviles
      screens: {
        'mobile': '320px',
        'mobile-lg': '375px',
        'mobile-xl': '425px',
        'tablet': '768px',
        'tablet-lg': '1024px',
        'desktop': '1280px',
        'desktop-lg': '1536px',
      },
      
      // Espaciado optimizado para móviles
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Tamaños de fuente optimizados para móviles
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Colores personalizados para móviles
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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
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
        error: {
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
      },
      
      // Sombras optimizadas para móviles
      boxShadow: {
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'mobile-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mobile-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mobile-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'mobile-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      
      // Bordes redondeados optimizados para móviles
      borderRadius: {
        'mobile': '0.375rem',
        'mobile-lg': '0.5rem',
        'mobile-xl': '0.75rem',
        'mobile-2xl': '1rem',
        'mobile-3xl': '1.5rem',
      },
      
      // Transiciones optimizadas para móviles
      transitionDuration: {
        'mobile': '150ms',
        'mobile-slow': '300ms',
        'mobile-fast': '100ms',
      },
      
      // Z-index optimizado para móviles
      zIndex: {
        'mobile': '10',
        'mobile-dropdown': '20',
        'mobile-sticky': '30',
        'mobile-overlay': '40',
        'mobile-modal': '50',
        'mobile-popover': '60',
        'mobile-tooltip': '70',
      },
      
      // Grid optimizado para móviles
      gridTemplateColumns: {
        'mobile': 'repeat(1, minmax(0, 1fr))',
        'mobile-2': 'repeat(2, minmax(0, 1fr))',
        'mobile-3': 'repeat(3, minmax(0, 1fr))',
        'mobile-4': 'repeat(4, minmax(0, 1fr))',
        'mobile-5': 'repeat(5, minmax(0, 1fr))',
        'mobile-6': 'repeat(6, minmax(0, 1fr))',
        'mobile-12': 'repeat(12, minmax(0, 1fr))',
      },
      
      // Flexbox optimizado para móviles
      flex: {
        'mobile': '1 1 0%',
        'mobile-auto': '1 1 auto',
        'mobile-initial': '0 1 auto',
        'mobile-none': 'none',
        'mobile-1': '1 1 0%',
        'mobile-2': '2 2 0%',
        'mobile-3': '3 3 0%',
      },
      
      // Animaciones optimizadas para móviles
      keyframes: {
        'mobile-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'mobile-fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        'mobile-slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'mobile-slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'mobile-scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'mobile-bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      animation: {
        'mobile-fade-in': 'mobile-fade-in 0.3s ease-out',
        'mobile-fade-out': 'mobile-fade-out 0.3s ease-in',
        'mobile-slide-in': 'mobile-slide-in 0.3s ease-out',
        'mobile-slide-out': 'mobile-slide-out 0.3s ease-in',
        'mobile-scale-in': 'mobile-scale-in 0.3s ease-out',
        'mobile-bounce-in': 'mobile-bounce-in 0.6s ease-out',
      },
      
      // Backdrop blur optimizado para móviles
      backdropBlur: {
        'mobile': '4px',
        'mobile-md': '8px',
        'mobile-lg': '12px',
        'mobile-xl': '16px',
        'mobile-2xl': '24px',
        'mobile-3xl': '40px',
      },
      
      // Gradientes optimizados para móviles
      backgroundImage: {
        'mobile-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'mobile-gradient-2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'mobile-gradient-3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'mobile-gradient-4': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'mobile-gradient-5': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      },
    },
  },
  
  // Plugins personalizados para móviles
  plugins: [
    // Plugin para utilidades móviles personalizadas
    function({ addUtilities, theme }: { addUtilities: any; theme: any }) {
      const mobileUtilities = {
        '.mobile-safe-area-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.mobile-safe-area-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.mobile-safe-area-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.mobile-safe-area-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.mobile-touch-manipulation': {
          touchAction: 'manipulation',
        },
        '.mobile-touch-pan-x': {
          touchAction: 'pan-x',
        },
        '.mobile-touch-pan-y': {
          touchAction: 'pan-y',
        },
        '.mobile-touch-pinch-zoom': {
          touchAction: 'pinch-zoom',
        },
        '.mobile-touch-none': {
          touchAction: 'none',
        },
        '.mobile-select-none': {
          WebkitUserSelect: 'none',
          userSelect: 'none',
        },
        '.mobile-select-text': {
          WebkitUserSelect: 'text',
          userSelect: 'text',
        },
        '.mobile-select-all': {
          WebkitUserSelect: 'all',
          userSelect: 'all',
        },
        '.mobile-appearance-none': {
          WebkitAppearance: 'none',
          appearance: 'none',
        },
        '.mobile-backface-hidden': {
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        },
        '.mobile-transform-gpu': {
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        },
        '.mobile-will-change-transform': {
          willChange: 'transform',
        },
        '.mobile-will-change-opacity': {
          willChange: 'opacity',
        },
        '.mobile-will-change-scroll': {
          willChange: 'scroll-position',
        },
        '.mobile-overflow-scroll': {
          WebkitOverflowScrolling: 'touch',
        },
        '.mobile-scrollbar-hide': {
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      
      addUtilities(mobileUtilities);
    },
    
    // Plugin para componentes móviles
    function({ addComponents, theme }: { addComponents: any; theme: any }) {
      const mobileComponents = {
        '.mobile-button': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme('spacing.3') + ' ' + theme('spacing.4'),
          fontSize: theme('fontSize.base'),
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.mobile-lg'),
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          userSelect: 'none',
          touchAction: 'manipulation',
          '&:active': {
            transform: 'scale(0.98)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
          },
        },
        '.mobile-card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.mobile-xl'),
          boxShadow: theme('boxShadow.mobile'),
          border: '1px solid ' + theme('colors.gray.200'),
          padding: theme('spacing.4'),
          transition: 'all 0.2s ease-in-out',
        },
        '.mobile-input': {
          width: '100%',
          padding: theme('spacing.3') + ' ' + theme('spacing.4'),
          fontSize: theme('fontSize.base'),
          border: '1px solid ' + theme('colors.gray.300'),
          borderRadius: theme('borderRadius.mobile-lg'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: '0 0 0 3px ' + theme('colors.primary.100'),
          },
          '&:disabled': {
            backgroundColor: theme('colors.gray.50'),
            color: theme('colors.gray.500'),
            cursor: 'not-allowed',
          },
        },
      };
      
      addComponents(mobileComponents);
    },
  ],
};

export default config;
