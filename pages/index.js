import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { connectToDatabase } from '../util/mongodb.js';
import styles from '../styles/Home.module.css';
import SearchIngredients from '../components/SearchIngredients';
import FreeSearch from '../components/FreeSearch';
import Category from '../components/Category';
import RecipeCard from '../components/RecipeCard';
import { categories } from '../info.js';


export default function Home({ recipes }) {
    const router = useRouter();
    const [ingredients, setIngredients] = useState(router.query.i || []);
    const [search, setSearch] = useState(router.query.s);
    const [category, setCategory] = useState(router.query.c);
    const categoriesList = categories.map((category) => <Category key={category} category={category} setCategory={setCategory} />)
    let recipesItems = [];

    useEffect(() => {
        const newParams = new URLSearchParams();
        if (search) newParams.append("s", search);
        if (category) newParams.append("c", category);
        if (ingredients) {
            ingredients.forEach((ingredient) => newParams.append(`i`, ingredient))
        }
        router.push("/?" + newParams);
    }, [search, category, ingredients])

    if (recipes) {
        const parsedRecipes = JSON.parse(recipes);
        recipesItems = parsedRecipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
    }

    return (
        <div>
            <Head>
                <title>ספר מתכונים</title>
            </Head>
            <h1 className={styles.h1}>מתכונים שלכם ושל משתמשים מכל רחבי הרשת</h1>
            <section className={styles['navigation']}>
                <section className={styles['container']}>
                    <h2 className={styles['h2']}> חיפוש מתכונים</h2>
                    <FreeSearch search={search} setSearch={setSearch} />
                    <SearchIngredients ingredients={ingredients} setIngredients={setIngredients} />
                </section>
                <section className={styles['categories']}>
                    {categoriesList}
                </section>
            </section>
            <ul className={styles['recipes']}>
                {recipesItems}
            </ul>
        </div>
    )
}

export async function getServerSideProps({ query }) {
    const { db } = await connectToDatabase();
    const collection = db.collection('recipes');
    const projection = { title: 1, description: 1, rating: 1, reviews: 1, cook: 1, difficulty: 1, workTime: 1 }
    let recipes = await collection.find({}).project(projection).toArray();
    recipes = JSON.stringify(recipes);
    return {
        props: { recipes }
    }
}

function setIngredients(query) {

}