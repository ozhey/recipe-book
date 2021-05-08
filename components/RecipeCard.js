import styles from '../styles/RecipeCard.module.css';
import Image from 'next/image';

const dummy = {
    title: 'מתכון',
    description: ' מתכון לבורקס בשר מעולה וממש פשוט להכנה שמפיץ ריח מתכון לבורקס בשר מעולה וממש פשוט להכנה שמפיץ ריח נהדר בכל הבית',
    rating: '4.5',
    reviews: '12',
    cook: 'עוז',
    difficulty: '1',
    time: '30'
}

const diffMap = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה'
}

const RecipeCard = ({ recipe = dummy }) => {

    return (
        <li className={styles['recipe']}>
            <div className={styles['image-container']}>
                <Image src={(`https://post.healthline.com/wp-content/uploads/2020/07/pizza-beer-1200x628-facebook-1200x628.jpg`)} layout='fill' objectFit='cover' />
            </div>
            <div className={styles['information']}>
                <div className={styles['bar']}>
                    <span style={{ fontSize: '16px' }} className="material-icons">signal_cellular_alt</span>
                    <span style={{ marginLeft: 'auto' }}>{diffMap[recipe.difficulty]}</span>
                    <span style={{ fontSize: '18px', marginLeft: '3px' }} className="material-icons"> schedule </span>
                    <span> {recipe.time} דקות </span>
                </div>
                <h3 className={styles['h3']}>{recipe.title}</h3>
                <p className={styles['description']}>{recipe.description}</p>
                <div className={styles['cook']}>על ידי <span className={styles['cook-name']}>{recipe.cook}</span></div>
                <div className={styles['bar']}>
                    <span style={{ marginLeft: 'auto' }}>{recipe.reviews} ביקורות</span>
                    {recipe.rating}
                    <span className="material-icons" style={{ color: 'gold' }}>star</span>
                </div>
            </div>
        </li>
    )
}

export default RecipeCard;
