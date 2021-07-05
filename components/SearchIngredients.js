import { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
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

    const addItem = (input) => {
        if (input.length) {
            setIngredients((prev) => [...prev, input])
            setInput('');
        }
    }

    return (
        <div>
            <SearchBox defaultValue={input} setSearch={addItem} icon='add' placeholder='חיפוש לפי מרכיבים' resetOnSubmit/>
            <ul>
                {ingItems}
            </ul>
        </div>
    )
}

export default SearchIngredients;
