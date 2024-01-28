import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/tw-elements/dist/js/**/*.js"
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
                textLeftBubble: '#00000',
                liliac: '#BE97C6',
                fairyTail: '#EFBCD5',
                amethyst: '#8661C1',
                charcoal: '#4B5267',
                spaceCadet: '#2E294E',
                oxfordBlue: '#000022',
                pennBlue: '#001242',
                blue: '#0094C6',
                lapisLazuli: '#005E7C',
                aliceBlue:'#E5ECE9'
            },
        },
        screens: {
            'desktop': { max: '1780px' },
            // => @media (max-width: 1560px) { ... }
            'sm-desktop': { max: '1270px' },
            // => @media (max-width: 1280px) { ... }
            'laptop': { max: '1024px' },
            // => @media (max-width: 1024px) { ... }
            'tablet': { max: '860px' },
            // => @media (max-width: 640px) { ... }
            'phone': { max: '640px' },
            // => @media (max-width: 640px) { ... }
        },
    },
    plugins: [require("tw-elements/dist/plugin.cjs")]
}
export default config
