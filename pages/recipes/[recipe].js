import { useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppContext } from '../../context/state.js';
import { useState } from 'react';
import { connectToDatabase } from '../../util/mongodb.js';
import { ObjectID } from 'mongodb'
import styles from './[recipe].module.css';


const diffMap = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה'
}

const RecipePage = ({ recipe }) => {
    if (!recipe) return null;
    recipe = JSON.parse(recipe);
    const { user } = useAppContext();
    const router = useRouter();
    const [rated, setRated] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        setRated(window.localStorage.getItem(`${recipe._id}`))
    }, []);

    const ingredients =
        <div className={styles['ingredients']}>
            {recipe.ingredients.map((segment, i) =>
                <div key={i}>
                    <h3>{segment.name}</h3>
                    <ul>
                        {segment.list.map((ingredient, i) =>
                            <li key={i}><input type="checkbox" />{ingredient}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>

    const steps =
        <ul className={styles['steps']}>
            {recipe.steps.map((step, i) =>
                <li key={i}>{step}</li>
            )}
        </ul>

    const onSubmitComment = (e) => {
        e.preventDefault();
        const payload = { type: 'comment', comment };
        payload.name = user.name;
        fetch(`/api/recipes/${recipe._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(router.replace(router.asPath))
            .catch((err) => console.log('error'))
    }

    const onRate = (rating) => {
        fetch(`/api/recipes/${recipe._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'rating', rating }),
        })
            .then(() => {
                window.localStorage.setItem(`${recipe._id}`, rating);
                router.replace(router.asPath)
            })
            .catch((err) => console.log('error'))
    }

    return (
        <div className={styles['layout']}>
            <Head>
                <title>{`ספר מתכונים - ${recipe.title}`}</title>
            </Head>
            <section className={styles['recipe']}>
                <h1>{recipe.title}</h1>
                <div className={styles['image-container']}>
                    <Image src={recipe.image} layout='fill' objectFit='cover' />
                </div>
                <div className={styles['rating']}>
                    <span style={{ marginLeft: 'auto' }}>{recipe.reviews || 0} ביקורות</span>
                    {recipe.rating ? recipe.rating.toFixed(1) : null}
                    <span className="material-icons" style={{ color: 'gold' }}>star</span>
                </div>
                <ul className={styles['info']}>
                    <li>
                        <span>רמת קושי</span>
                        <span><span className="material-icons">signal_cellular_alt</span>{diffMap[recipe.difficulty]}</span>
                    </li>
                    <li>
                        <span>זמן הכנה</span>
                        <span><span className="material-icons"> schedule </span>{recipe.workTime}</span>
                    </li>
                    <li>
                        <span>זמן כולל</span>
                        <span><span className="material-icons"> schedule </span>{recipe.time}</span>
                    </li>
                </ul>
                <p className={styles['description']}>{recipe.description}</p>
                {recipe.servings && <p className={styles['description']}><strong>מספר מנות: </strong>{recipe.servings}</p>}
                <h2>מצרכים</h2>
                {ingredients}
                <h2>אופן ההכנה</h2>
                {steps}
            </section>
            <section className={styles['extra']}>
                {recipe.comments.length ?
                    <div className={styles['comments']}>
                        <h2>תגובות</h2>
                        <ul>
                            {recipe.comments.map((comment, i) =>
                                <li key={i} className={styles['comment']}>
                                    <div className={styles['comment-avatar']}>
                                        <Image src={(`/assets/imgs/icons/avatar.webp`)} layout='fill' objectFit='cover' />
                                    </div>
                                    <div className={styles['comment-body']}>
                                        <div className={styles['author']}>{comment.name}</div>
                                        <div className={styles['date']}>{dateToString(new Date(comment.date))}</div>
                                        <div className={styles['text']}>{comment.comment}</div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                    :
                    <div className={styles['notice']}>
                        <span className="material-icons" style={{ fontSize: '1.2rem', marginLeft: '5px' }}> comment </span>
                        <span>עדיין אין תגובות למתכון זה.</span>
                    </div>
                }
                {user ? <>
                    {
                        rated ?
                            null
                            :
                            <div className={styles['rate']}>
                                <h3>דרג את המתכון:</h3>
                                <div className={styles['stars']}>
                                    <span className="material-icons" onClick={() => onRate(1)}>star</span>
                                    <span className="material-icons" onClick={() => onRate(2)}>star</span>
                                    <span className="material-icons" onClick={() => onRate(3)}>star</span>
                                    <span className="material-icons" onClick={() => onRate(4)}>star</span>
                                    <span className="material-icons" onClick={() => onRate(5)}>star</span>
                                </div>
                            </div>
                    }
                    <h3>הוסף תגובה</h3>
                    <form onSubmit={onSubmitComment} className={styles['comment-form']}>
                        <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="התגובה שלך" />
                        <input type="submit" value="שלח" />
                    </form>
                </>
                    :
                    <div className={styles['notice']}>
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}> priority_high </span>
                        <span>יש להתחבר כדי לדרג את המתכון או להוסיף תגובות.</span>
                    </div>
                }
            </section>
        </div>
    )
}

// This function gets called at build time
export async function getStaticPaths() {
    const { db } = await connectToDatabase();
    const recipes = db.collection('recipes');
    const findResult = await recipes.find({}).project({ _id: 1 }).toArray();
    const paths = findResult.map((element) => {
        return { params: { recipe: element._id.toString() } }
    })
    return {
        paths,
        fallback: true,
    }
}

export async function getStaticProps({ params }) {
    const { db } = await connectToDatabase();
    const recipes = db.collection('recipes');
    const id = params.recipe;
    let recipe = await recipes.findOne({ "_id": ObjectID(id) })
    recipe = JSON.stringify(recipe);
    return {
        props: { recipe },
        revalidate: 60
    }
}

function dateToString(date) {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const dateLocal = new Date(date.getTime() - offsetMs);
    return ("0" + dateLocal.getUTCDate()).slice(-2) + "/" +
        ("0" + (dateLocal.getUTCMonth() + 1)).slice(-2) + "/" +
        dateLocal.getUTCFullYear() + " " +
        ("0" + dateLocal.getUTCHours()).slice(-2) + ":" +
        ("0" + dateLocal.getUTCMinutes()).slice(-2) + ":" +
        ("0" + dateLocal.getUTCSeconds()).slice(-2);
}

export default RecipePage;

