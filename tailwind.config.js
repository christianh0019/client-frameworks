/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // We typically want light mode, but keeping class strategy gives control
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Funnel Sans"', 'sans-serif'], // Keeping the brand font but ensuring it works in light mode
                serif: ['"Cormorant Garamond"', 'serif'],
            },
            colors: {
                // SaaS specific colors derived from screenshot
                saas: {
                    bg: '#f3f4f6',      // Light gray background
                    card: '#ffffff',    // White card background
                    border: '#e5e7eb',  // Subtle border
                    text: {
                        primary: '#111827', // Dark gray/black
                        secondary: '#6b7280', // Muted gray
                    },
                    blue: '#3b82f6',    // Standard SaaS blue (close to screenshot's "Add Opportunity")
                    blueDark: '#2563eb',
                },
                brand: {
                    purple: '#7e22ce',
                    magenta: '#d946ef',
                    dark: '#0f172a',
                },
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}
