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
                    <Image src={recipe.image} alt={recipe.title} layout='fill' objectFit='cover' quality="10" />
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
                    <div style = {{marginTop: 'auto'}}>
                        <div className={styles['cook']}>על ידי <span className={styles['cook-name']}>{recipe.name}</span></div>
                        <div className={styles['bar']}>
                            <span style={{ marginLeft: 'auto' }}>{recipe.reviews || 0} ביקורות</span>
                            {recipe.rating ? recipe.rating.toFixed(1) : null}
                            <span className="material-icons" style={{ color: 'gold' }}>star</span>
                        </div>
                    </div>
                </div>
            </li>
        </Link>
    )
}

export default RecipeCard;
