/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Funnel Sans"', 'sans-serif'],
                serif: ['"Cormorant Garamond"', 'serif'],
            },
            colors: {
                brand: {
                    purple: '#7e22ce',
                    magenta: '#d946ef',
                    dark: '#0f172a',
                },
                slate: {
                    850: '#151e32',
                    900: '#0f172a',
                    950: '#020617',
                }
            },
        },
    },
    plugins: [],
}
