import type { Config } from 'tailwindcss'
import { createThemes } from 'tw-colors';

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
                liliac: '#be97C6',
                fairyTail: '#efbcd5',
                amethyst: '#8661c1',
                charcoal: '#4b5267',
                spaceCadet: '#2e294e',
                oxfordBlue: '#233656',
                pennBlue: '#a0c2f9',
                blue: '#0094c6',
                lapisLazuli: '#005e7c',
                aliceBlue:'#e5ece9'
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
    plugins: [
        require("tw-elements/dist/plugin.cjs"),
        createThemes({
            sunset: {
                'bgMain': '#404040',
                'bgPrimary': '#262626',
                'gradientOne': '#ee7724',
                'gradientTwo': '#dd3675',
                'gradientThree': '#b44593',
            },
            midnight: {
                'bgMain': '#3C4152',
                'bgPrimary': '#201C37',
                'gradientOne': '#be97C6',
                'gradientTwo': '#efbcd5',
                'gradientThree': '#8661c1',
            },
            azure: {
                'bgMain': '#35445E',
                'bgPrimary': '#181D25',
                'gradientOne': '#6B7697',
                'gradientTwo': '#D6D9DE',
                'gradientThree': '#99A9D8',
            },
        })
    ]
}
export default config
