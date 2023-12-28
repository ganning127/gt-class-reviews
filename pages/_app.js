// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react';
import { ClerkProvider } from "@clerk/nextjs";

function MyApp({ Component, pageProps })
{
    return (
        <ClerkProvider {...pageProps}>

            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </ClerkProvider>
    );
}

export default MyApp;;