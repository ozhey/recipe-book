import styles from '../styles/RecipeCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

const diffMap = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה'
}

const RecipeCard = ({ recipe }) => {
    return (
        <Link href={`/recipes/${recipe._id}`}>
            <li className={styles['recipe']}>
                <div className={styles['image-container']}>
                    <Image src={(`https://post.healthline.com/wp-content/uploads/2020/07/pizza-beer-1200x628-facebook-1200x628.jpg`)} layout='fill' objectFit='cover' />
                </div>
                <div className={styles['information']}>
                    <div className={styles['bar']}>
                        <span style={{ fontSize: '16px' }} className="material-icons">signal_cellular_alt</span>
                        <span style={{ marginLeft: 'auto' }}>{diffMap[recipe.difficulty]}</span>
                        <span style={{ fontSize: '18px', marginLeft: '3px' }} className="material-icons"> schedule </span>
                        <span> {recipe.workTime} דקות </span>
                    </div>
                    <h3 className={styles['h3']}>{recipe.title}</h3>
                    <p className={styles['description']}>{recipe.description}</p>
                    <div className={styles['cook']}>על ידי <span className={styles['cook-name']}>{recipe.author}</span></div>
                    <div className={styles['bar']}>
                        <span style={{ marginLeft: 'auto' }}>{recipe.reviews || 0} ביקורות</span>
                        {recipe.rating}
                        <span className="material-icons" style={{ color: 'gold' }}>star</span>
                    </div>
                </div>
            </li>
        </Link>
    )
}

export default RecipeCard;
