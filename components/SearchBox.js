import { useState } from 'react';
import styles from '../styles/FreeSearch.module.css'

const SearchBox = ({ defaultValue = '', setSearch, icon, placeholder, resetOnSubmit}) => {
    const [input, setInput] = useState(defaultValue);

    const onSubmit = () => {
        setSearch(input);
        if (resetOnSubmit) {
            setInput('');
        }
    }

    return (
        <div className={styles['search-container']}>
            <input
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? onSubmit() : null}
                value={input}
                type='text' className={styles['search']}
                placeholder={placeholder}
            />
            <button className={styles['submit']} onClick={() => onSubmit()} >
                <span className="material-icons">{icon}</span>
            </button>
        </div>
    )
}

export default SearchBox;
