import { useState } from 'react';
import styles from '../styles/FreeSearch.module.css'

const FreeSearch = ({ setSearch }) => {
    const [input, setInput] = useState('');

    return (
        <div className={styles['search-container']}>
            <input
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.code === 'Enter' ? setSearch() : null}
                value={input}
                type='text' className={styles['search']}
                placeholder='חיפוש חופשי לפי שם מתכון או משתמש'
            />
            <button className={styles['submit']} onClick={setSearch} >
                <span className="material-icons">search</span>
            </button>
        </div>
    )
}

export default FreeSearch;
