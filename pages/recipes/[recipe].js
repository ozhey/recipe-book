import styles from './[recipe].module.css';
import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';

const dummy = {
    title: 'קציצות ברוטב עגבניות',
    description: ' מתכון לבורקס בשר מעולה וממש פשוט להכנה שמפיץ ריח מתכון לבורקס בשר מעולה וממש פשוט להכנה שמפיץ ריח נהדר בכל הבית',
    image: `https://post.healthline.com/wp-content/uploads/2020/07/pizza-beer-1200x628-facebook-1200x628.jpg`,
    rating: '4.5',
    reviews: '12',
    cook: 'עוז',
    difficulty: '1',
    workTime: '30',
    time: '45',
    servings: '16-20 עוגיות',
    ingredients: [
        {
            name: 'בצק',
            list: ['סוכר', 'שמן זית', 'כוס קמח שמרים']
        },
        {
            name: 'מילוי',
            list: ['עגבנייה קצוצה', 'בצל', '200 גרם בשר בקר טחון', 'מלח', 'פפריקה']
        }
    ],
    steps: [
        'פורסים את השומר לרצועות דקיקות (2 מ״מ)',
        'מפלטים פלחי מנדרינה או קלמנטינה (אפשר לקנות משומר)',
        'מוציאים גרעיני רימון מרימון טרי.',
        'מעבירים לקערה אחת את 3 המרכיבים.',
        'מערבבים את כל חומרי הרוטב.',
    ],
    comments: [
        {
            author: 'עוז',
            date: dateToString(new Date("October 13, 2014 11:13:00")),
            text: 'טעים מאד',
        },
        {
            author: 'שירי',
            date: dateToString(new Date("October 13, 2014 11:13:00")),
            text: 'מגעיל',
        },
        {
            author: 'דור',
            date: dateToString(new Date("October 13, 2014 11:13:00")),
            text: 'אחת שתיים לוש',
        }
    ]

}

const diffMap = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה'
}

const RecipePage = ({ recipe = dummy }) => {
    const [rated, setRated] = useState(false);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');

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

    const comments =
        <ul>
            {recipe.comments.map((comment, i) =>
                <li key={i} className={styles['comment']}>
                    <div className={styles['comment-avatar']}>
                        <Image src={(`/assets/imgs/icons/avatar.webp`)} layout='fill' objectFit='cover' />
                    </div>
                    <div className={styles['comment-body']}>
                        <span className={styles['author']}>{comment.author}</span>
                        <span className={styles['date']}>{comment.date}</span>
                        <div className={styles['text']}>{comment.text}</div>
                    </div>
                </li>
            )}
        </ul>

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit');
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
                    <span style={{ marginLeft: 'auto' }}>{recipe.reviews} ביקורות</span>
                    {recipe.rating}
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
                <div className={styles['comments']}>
                    <h2>תגובות</h2>
                    {comments}
                </div>
                <div className={styles['rate']}>
                    <h3>דרג את המתכון:</h3>
                    <div className={styles['stars']}>
                        <span className="material-icons">star</span>
                        <span className="material-icons">star</span>
                        <span className="material-icons">star</span>
                        <span className="material-icons">star</span>
                        <span className="material-icons">star</span>
                    </div>
                </div>
                <h3>הוסף תגובה</h3>
                <form onSubmit={handleSubmit} className={styles['comment-form']}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="שם מלא" />
                    <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="התגובה שלך" />
                    <input type="submit" value="שלח" />
                </form>
            </section>
        </div>
    )
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
