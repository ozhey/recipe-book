import { useEffect } from 'react';
import { firebase } from '../../util/firebase.js';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useAppContext } from '../../context/state.js';
import { useState } from 'react';
import { connectToDatabase } from '../../util/mongodb.js';
import styles from './[user].module.css';
import { useRouter } from 'next/router';


const UserPage = ({ userData }) => {
    if (!userData) return null;
    const { user } = useAppContext();
    const router = useRouter();
    if (userData?.uid !== user?.uid) {
        return <div>אינך מורשה לצפות בדף זה</div>
    }
    const onEdit = () => {
        alert('בקרוב!')
    }

    const onDelete = (recipeId, imageUrl) => {
        fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                const image = firebase.storage().refFromURL(imageUrl);
                image.delete().then(() => {
                    router.replace(router.asPath);
                }).catch((error) => {
                    console.log('recipe deleted but failed to delete image');
                    router.replace(router.asPath);
                });
            })
            .catch((err) => console.log('error'));

    }

    const myRecipes = userData.recipes.map((recipe) =>
        <div className={styles['recipe']} key={recipe._id}>
            <div className={styles['image-container']}>
                <Image src={recipe.image} layout='fill' alt={recipe.title} objectFit='cover' quality="10" />
            </div>
            <div className={styles['product-title']}>{recipe.title}</div>
            <Link href={`/recipes/${recipe._id}`}>
                <button className={styles['button']}>
                    <span className="material-icons" style={{ marginLeft: '5px', fontSize: '1.3rem' }}>visibility</span>
                    <span>צפייה</span>
                </button>
            </Link>
            <button className={styles['button']} onClick={() => onDelete(recipe._id, recipe.image)}>
                <span className="material-icons" style={{ marginLeft: '5px', fontSize: '1.3rem' }}>delete</span>
                <span>מחיקה</span>
            </button>
            <button className={styles['button']} onClick={onEdit}>
                <span className="material-icons" style={{ marginLeft: '5px', fontSize: '1.3rem' }}>edit</span>
                <span>עריכה</span>
            </button>
        </div>)

    return (
        <div className={styles['layout']}>
            <Head>
                <title>{`ספר מתכונים - ${userData.name}`}</title>
            </Head>
            <h1 className={styles['h1']}>{userData.name}</h1>
            <h2 className={styles['h2']}>המתכונים שלי</h2>
            {myRecipes}
            <h2 className={styles['h2']}>המועדפים שלי</h2>
        </div>
    )
}


export async function getServerSideProps({ params }) {
    const { db } = await connectToDatabase();
    const users = db.collection('users');
    const recipes = db.collection('recipes');
    const uid = params.user;
    let userData = await users.findOne({ "uid": uid })
    if (userData) {
        userData['recipes'] = await recipes.find({ uid: uid }).project({ title: 1, image: 1 }).toArray()
    }
    userData = JSON.parse(JSON.stringify(userData));
    return {
        props: { userData },
    }
}

export default UserPage;

