import styles from '../styles/TopBar.module.css'

const TopBar = () => {

    return (
        <nav id={styles['navbar']}>
            <h2 className={styles['logo']}>ספר מתכונים</h2>
            <div className={styles['navbar-end']}>
                <button className={styles['login']}>
                    <span className="material-icons" style={{marginLeft: '3px', fontSize: '1.2rem'}}>login</span>
                    <span>כניסה</span>
                </button>
                <button>
                    <span className="material-icons" style={{margin: '0px -7px 0px 1px', fontSize:'1.3rem'}}>add</span>
                    <span>מתכון חדש</span>
                </button>
            </div>
        </nav>
    )
}

export default TopBar;
