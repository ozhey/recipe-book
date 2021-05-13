import styles from '../styles/TopBar.module.css'
import Link from 'next/link'

const TopBar = () => {

    return (
        <nav id={styles['navbar']}>
            <Link href="/">
                <h2 className={styles['logo']}>ספר מתכונים</h2>
            </Link>
            <div className={styles['navbar-end']}>
                <Link href="/#">
                    <a className={styles['button']}>
                        <span className="material-icons" style={{ marginLeft: '3px', fontSize: '1.2rem' }}>login</span>
                        <span>כניסה</span>
                    </a>
                </Link>
                <Link href="/new-recipe">
                    <a className={styles['button']}>
                        <span className="material-icons" style={{ margin: '0px -7px 0px 1px', fontSize: '1.3rem' }}>add</span>
                        <span>מתכון חדש</span>
                    </a>
                </Link>
            </div>
        </nav>
    )
}

export default TopBar;
