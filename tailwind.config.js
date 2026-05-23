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
                medical: {
                    primary: '#1d4ed8',
                    'primary-dark': '#1e40af',
                    'primary-light': '#bfdbfe',
                    secondary: '#059669',
                    'secondary-dark': '#047857',
                    'secondary-light': '#10b981',
                    accent: '#dc2626',
                    'accent-light': '#fca5a5',
                    warning: '#d97706',
                    'warning-light': '#fde68a',
                    navy: '#0f172a',
                    'navy-light': '#1e293b',
                    'gray-light': '#f1f5f9',
                    'gray-medium': '#64748b',
                    'gray-dark': '#1e293b',
                    success: '#16a34a',
                    info: '#0891b2',
                },
                primary: {
                    DEFAULT: '#1d4ed8',
                    light: '#bfdbfe',
                    dark: '#1e40af',
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
            boxShadow: {
                'medical': '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
                'medical-lg': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 6px 0 rgba(0,0,0,0.04)',
                'card': '0 1px 3px 0 rgba(0,0,0,0.07)',
                'card-hover': '0 4px 10px 0 rgba(0,0,0,0.1)',
            },
            borderRadius: {
                'medical': '0.625rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.2s ease-out',
                'pulse-medical': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(8px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
