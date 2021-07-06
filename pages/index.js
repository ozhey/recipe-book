import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { connectToDatabase } from '../util/mongodb.js';
import styles from '../styles/Home.module.css';
import SearchIngredients from '../components/SearchIngredients';
import SearchBox from '../components/SearchBox';
import Category from '../components/Category';
import RecipeCard from '../components/RecipeCard';
import { categories } from '../info.js';


export default function Home({ recipes }) {
    const router = useRouter();
    const [ingredients, setIngredients] = useState(setInitialIngredients(router.query.i));
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
                    <SearchBox defaultValue={search} setSearch={setSearch} icon="search" placeholder='חיפוש חופשי לפי שם מתכון או משתמש' />
                    <SearchIngredients ingredients={ingredients} setIngredients={setIngredients} icon="add" />
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
    let { i, s = '', c } = query;
    const { db } = await connectToDatabase();
    const collection = db.collection('recipes');
    const projection = { title: 1, description: 1, rating: 1, reviews: 1, name: 1, difficulty: 1, workTime: 1, image: 1 }
    const mongoQuery = {};
    if (s) {
        mongoQuery.$text = { $search: s }
    }
    if (c) {
        mongoQuery[`category.${c}`] = true;
    }
    console.log(mongoQuery);
    let recipes = await collection.find(mongoQuery).project(projection).toArray();
    recipes = JSON.stringify(recipes);
    return {
        props: { recipes }
    }
}

function setInitialIngredients(query) {
    if (Array.isArray(query)) return query;
    if (typeof query === 'string') return [query];
    return [];
}