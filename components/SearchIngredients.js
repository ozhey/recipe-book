import { useState, useEffect } from 'react';
import styles from '../styles/SearchIngredients.module.css'

const SearchIngredients = ({ ingredients, setIngredients }) => {
    const [input, setInput] = useState('');
    const [ingItems, setIngItems] = useState([]);

    const deleteIngredient = (ingredient) => {
        let index = ingredients.indexOf(ingredient);
        if (index !== -1) {
            setIngredients(prev => {
                let tempIng = [...prev];
                tempIng.splice(index, 1);
                return tempIng;
            })
        }
    }

    useEffect(() => {
        setIngItems(ingredients.map((ingredient, index) =>
            <li key={index} className={styles['list-item']} onClick={() => deleteIngredient(ingredient)}>
                <span className="material-icons" style={{ fontSize: '20px' }} >
                    delete_outline
                </span>
                {ingredient}
            </li>))
    }, [ingredients])

    const addItem = () => {
        if (input.length) {
            setIngredients((prev) => [...prev, input])
            setInput('');
        }
    }

    return (
        <div>
            <div className={styles['search-container']}>
                <input
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' ? addItem() : null}
                    value={input}
                    type='text' className={styles['search']}
                    placeholder='חיפוש לפי מרכיבים'
                />
                <button className={styles['submit']} onClick={addItem} >
                    <span className="material-icons">add</span>
                </button>
            </div>
            <ul>
                {ingItems}
            </ul>
        </div>
    )
}

export default SearchIngredients;
