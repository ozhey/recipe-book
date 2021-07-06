import styles from '../styles/Category.module.css';
import Image from 'next/image';

const Category = ({ category, setCategory }) => {

    return (
        <div className={styles['container']} onClick={() => setCategory(category)}>
            <div className={styles['image-container']}>
                <Image src={(`/assets/imgs/categories/${category}.png`)} alt={category} layout='fill' objectFit='cover' quality="10"/>
            </div>
            <div className={styles['title']}>{category}</div>
        </div>
    )
}

export default Category;
