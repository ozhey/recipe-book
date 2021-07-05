import { useState } from 'react';
import styles from '../styles/TopBar.module.css';
import Link from 'next/link';
import BackDrop from './BackDrop';
import LoginRegister from './LoginRegister';

const TopBar = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const login = isLoginOpen ? <>
        <BackDrop close={setIsLoginOpen} />
        <LoginRegister close={setIsLoginOpen} />
    </> : null;

    return (
        <>
            {login}
            <nav id={styles['navbar']}>
                <Link href="/">
                    <h2 className={styles['logo']}>ספר מתכונים</h2>
                </Link>
                <div className={styles['navbar-end']}>
                    <div className={styles['button']} onClick={() => setIsLoginOpen((prev) => !prev)}>
                        <span className="material-icons" style={{ marginLeft: '3px', fontSize: '1.2rem' }}>login</span>
                        <span>כניסה</span>
                    </div>
                    <Link href="/new-recipe">
                        <a className={styles['button']}>
                            <span className="material-icons" style={{ margin: '0px -7px 0px 1px', fontSize: '1.3rem' }}>add</span>
                            <span>מתכון חדש</span>
                        </a>
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default TopBar;
