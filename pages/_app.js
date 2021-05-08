import '../styles/globals.css'
import { AppStateWrapper } from '../context/state';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
    return (
        <AppStateWrapper>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AppStateWrapper>
    )
}

export default MyApp
