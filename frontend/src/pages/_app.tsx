import '@/styles/globals.css'
import { Montserrat } from 'next/font/google'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from '@/store/store'

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-mont"
})

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    
    return (
        <>
            <Head>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main className={`${montserrat.variable} font-mont bg-light dark:bg-dark w-full min-h-screen`}>
                <Provider store={store}>
                        <Component key={router.asPath} {...pageProps} />
                </Provider>
                
            </main>
        </>

    )
}
