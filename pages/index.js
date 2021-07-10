import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { connectToDatabase } from '../util/mongodb.js';
import styles from '../styles/Home.module.css';
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
    let recipesItems = recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />);

    useEffect(() => {
        const newParams = new URLSearchParams();
        if (search) newParams.append("s", search);
        if (category) newParams.append("c", category);
        if (ingredients) {
            ingredients.forEach((ingredient) => newParams.append(`i`, ingredient))
        }
        router.push("/?" + newParams);
    }, [search, category, ingredients])


    return (
        <div>
            <Head>
                <title>ספר מתכונים</title>
            </Head>
            <h1 className={styles.h1}>מתכונים שלכם ושל משתמשים מכל רחבי הרשת</h1>
            <section className={styles['navigation']}>
                <section className={styles['container']}>
                    <h2 className={styles['h2']}> חיפוש מתכונים</h2>
                    <SearchBox defaultValue={search} setSearch={setSearch} icon="search" placeholder='חיפוש חופשי' />
                </section>
                <section className={styles['categories']}>
                    {categoriesList}
                </section>
                <Link href='/'>
                    <div className={styles['clear']}>
                        <span className="material-icons">clear</span>
                        <span>נקה את כל המסננים</span>
                    </div>
                </Link>
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
    const mongoQuery = { private: false };
    if (s) {
        mongoQuery['$text'] = { $search: s }
    }
    if (c) {
        mongoQuery[`category.${c}`] = true;
    }
    let recipes = await collection.find(mongoQuery).project(projection).toArray();
    recipes = JSON.parse(JSON.stringify(recipes));
    return {
        props: { recipes }
    }
}

function setInitialIngredients(query) {
    if (Array.isArray(query)) return query;
    if (typeof query === 'string') return [query];
    return [];
}