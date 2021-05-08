import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import SearchIngredients from '../components/SearchIngredients';
import FreeSearch from '../components/FreeSearch';
import Category from '../components/Category';
import RecipeCard from '../components/RecipeCard';
import { categories } from '../info.js';


export default function Home() {
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const categoriesList = categories.map((category) => <Category key={category} category={category} setCategory={setCategory} />)

    return (
        <div>
            <Head>
                <title>ספר מתכונים</title>
            </Head>
            <h1 className={styles.h1}>מתכונים שלכם ושל משתמשים מכל רחבי הרשת</h1>
            <section className={styles['navigation']}>
                <section className={styles['container']}>
                    <h2 className={styles['h2']}> חיפוש מתכונים</h2>
                    <FreeSearch setSearch={setSearch} />
                    <SearchIngredients ingredients={ingredients} setIngredients={setIngredients} />
                </section>
                <section className={styles['categories']}>
                    {categoriesList}
                </section>
            </section>
            <ul className={styles['recipes']}>
                <RecipeCard /><RecipeCard /><RecipeCard /><RecipeCard /><RecipeCard /><RecipeCard /><RecipeCard /><RecipeCard /><RecipeCard />
            </ul>
        </div>
    )
}
