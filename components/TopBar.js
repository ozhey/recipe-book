import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import { useAppContext } from '../context/state';
import { firebase } from '../util/firebase.js';
import Image from 'next/image';
import Link from 'next/link';
import BackDrop from './BackDrop';
import LoginRegister from './LoginRegister';
import styles from '../styles/TopBar.module.css';

const TopBar = () => {
    const { user, theme, setTheme } = useAppContext();
    const router = useRouter()
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    let login = null, dropdownMenu = null;

    useEffect(() => {
        const checkIsClickOutside = (e) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", checkIsClickOutside)
        return () => {
            document.removeEventListener("mousedown", checkIsClickOutside)
        }
    }, [isDropdownOpen]);

    const onSignout = () => {
        firebase.auth().signOut()
            .then(() => {
                setIsDropdownOpen(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const goToPage = (path) => {
        router.push(path);
        setIsDropdownOpen(false);
    }

    if (isLoginOpen) {
        login = <>
            <BackDrop close={setIsLoginOpen} />
            <LoginRegister close={setIsLoginOpen} />
        </>
    }

    if (isDropdownOpen) {
        dropdownMenu = <div className={styles['dropdown-wrapper']} >
            <div className={styles['dropdown']} >
                <div className={styles['dropdown-item']} onClick={() => goToPage(`/users/${user.uid}`)} >
                    <span className="material-icons" >menu_book</span>
                    <span> ספר המתכונים שלי </span>
                </div>
                <div className={styles['dropdown-item']} onClick={() => alert('בקרוב!')}>
                    <span className="material-icons">settings</span>
                    <span> הגדרות משתמש</span>
                </div>
                {theme === 'dark' ?
                    <div className={styles['dropdown-item']} onClick={() => setTheme('light')}>
                        <span className="material-icons">light_mode</span>
                        <span>  תצוגת יום</span>
                    </div>
                    :
                    <div className={styles['dropdown-item']} onClick={() => setTheme('dark')}>
                        <span className="material-icons">dark_mode</span>
                        <span> תצוגת לילה</span>
                    </div>
                }
                <div className={styles['dropdown-item']} onClick={() => onSignout()}>
                    <span className="material-icons">logout</span>
                    <span > התנתק</span>
                </div>
            </div>
        </div >
    }


    const userArea = user ? <>
        <Link href="/new-recipe">
            <div className={styles['button']}>
                <span className="material-icons" style={{ margin: '0px -7px 0px 1px', fontSize: '1.3rem' }}>add</span>
                <span>מתכון חדש</span>
            </div>
        </Link>
        <div className={`${styles['button']} ${styles['account']}`} ref={dropdownRef}>
            <div className={styles['account-wrapper']} onClick={() => setIsDropdownOpen((prev) => !prev)}>
                <span className="material-icons" style={{ fontSize: '1.15rem' }}>expand_more</span>
                <span className="material-icons" style={{ marginLeft: '3px', fontSize: '1.7em', opacity: '0.9' }}>account_circle</span>
            </div>
            {dropdownMenu}
        </div>
    </>
        :
        <div className={styles['button']} onClick={() => setIsLoginOpen((prev) => !prev)}>
            <span className="material-icons" style={{ marginLeft: '3px', fontSize: '1.2rem' }}>login</span>
            <span>כניסה</span>
        </div>;

    return (
        <>
            {login}
            <nav id={styles['navbar']}>
                <Link href="/">
                    <div className={styles['image-container']}>
                        <Image src={(`/assets/logo.webp`)} layout='fill' alt='logo' objectFit='cover' quality="10" />
                    </div>
                </Link>
                <div className={styles['navbar-end']}>
                    {userArea}
                </div>
            </nav>
        </>
    )
}

export default TopBar;
