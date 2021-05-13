import { useState } from 'react';
import styles from '../styles/FreeSearch.module.css'

const FreeSearch = ({ search, setSearch }) => {
    const [input, setInput] = useState(search);

    return (
        <div className={styles['search-container']}>
            <input
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? setSearch() : null}
                value={search}
                type='text' className={styles['search']}
                placeholder='חיפוש חופשי לפי שם מתכון או משתמש'
            />
            <button className={styles['submit']} onClick={() => setSearch(input)} >
                <span className="material-icons">search</span>
            </button>
        </div>
    )
}

export default FreeSearch;
