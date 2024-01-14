import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                orange: "#ee7724",
                venetianRed: "#d8363a",
                magneta: "#dd3675",
                crayola: "#b44593",
                darkBgMain: '#404040',
                darkBgPrimary: '#262626',
                textRightBubble: '#00000',
                textLeftBubble: '#00000'
            },
        },
    },
    plugins: [],
}
export default config
