import { useEffect } from 'react'
import { useAppContext } from '../context/state';
import Footer from './Footer';
import TopBar from './TopBar';

const Layout = ({ children }) => {
    const { theme } = useAppContext();

    return (
        <div className={theme}>
            <TopBar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;
