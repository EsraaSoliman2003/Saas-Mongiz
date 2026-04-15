import { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <GoogleOAuthProvider clientId="330318666546-k0psclgibv67m0op7o2f5b1m2jrfcmsj.apps.googleusercontent.com">
            <Component {...pageProps} />
        </GoogleOAuthProvider>
    );
}