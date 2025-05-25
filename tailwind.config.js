/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Medical-themed color palette
                medical: {
                    primary: '#0ea5e9', // Medical blue
                    'primary-dark': '#0284c7',
                    'primary-light': '#38bdf8',
                    secondary: '#059669', // Medical green
                    'secondary-dark': '#047857',
                    'secondary-light': '#10b981',
                    accent: '#dc2626', // Medical red for emergencies
                    'accent-light': '#ef4444',
                    warning: '#f59e0b', // Warning amber
                    'warning-light': '#fbbf24',
                    navy: '#1e3a8a', // Deep navy for headers
                    'navy-light': '#3730a3',
                    'gray-light': '#f8fafc',
                    'gray-medium': '#64748b',
                    'gray-dark': '#334155',
                    success: '#10b981',
                    info: '#06b6d4',
                },
                // Keep existing colors for backward compatibility
                primary: {
                    DEFAULT: '#0ea5e9',
                    light: '#38bdf8',
                    dark: '#0284c7',
                },
                secondary: {
                    DEFAULT: '#059669',
                    light: '#10b981',
                    dark: '#047857',
                },
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'medical': ['Poppins', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },
            boxShadow: {
                'medical': '0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)',
                'medical-lg': '0 10px 15px -3px rgba(14, 165, 233, 0.1), 0 4px 6px -2px rgba(14, 165, 233, 0.05)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            borderRadius: {
                'medical': '0.75rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-medical': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
