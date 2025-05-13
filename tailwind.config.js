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
                primary: {
                    DEFAULT: '#3b82f6', // blue-500
                    light: '#60a5fa', // blue-400
                    dark: '#2563eb', // blue-600
                },
                secondary: {
                    DEFAULT: '#64748b', // slate-500
                    light: '#94a3b8', // slate-400
                    dark: '#475569', // slate-600
                },
            },
        },
    },
    plugins: [],
}
