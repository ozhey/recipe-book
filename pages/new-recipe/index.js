import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import styles from './index.js.module.css';
import Head from 'next/head';
import ImageUploader from '../../components/ImageUploader';
import { categories } from '../../info.js';


const NewRecipe = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ingredientsNumber, setIngredientsNumber] = useState([1]);    //each array element is an ingredient group, the value itself defines the number of ingredients in each group
    const [stepsNumber, setStepsNumber] = useState(1);
    let ingredientInputs = {}, steps = [];
    const image = watch("image");
    
    const onSubmit = (data) => {
        const { image } = data;
        delete data.image;
        fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((result) => console.log('result'))
            .catch((err) => console.log('error'))
        console.log('submit!');
    }

    for (let i = 0; i <= ingredientsNumber.length; i++) {
        ingredientInputs[i] = [];
        for (let j = 1; j <= ingredientsNumber[i]; j++) {
            ingredientInputs[i].push(<input key={j} type="text" placeholder="מרכיב" {...register(`ingredients.i${i}.${j}`)} />)
        }
    }

    const ingredientsElements = ingredientsNumber.map((__, i) =>
        <div key={i} className={styles['ingredient-group']}>
            <label>כותרת</label>
            <input type="text" placeholder="כותרת" {...register(`ingredients.i${i}.name`, { required: true })} />
            {errors.ingredients && errors.ingredients[`i${i}`] && errors.ingredients[`i${i}`].name &&
                <div className={styles['error']}>שדה זה הינו חובה</div>}
            <div className={styles['label-with-buttons']}>
                <label>מרכיבים</label>
                <button className={styles['button-reset']} type="button" onClick={() => addIngredient(i)}>
                    <span className={`material-icons ${styles['icon']} ${styles['green']}`}>add</span>
                </button>
                {(ingredientsNumber[i] <= 1) ? null :
                    <button className={styles['button-reset']} type="button" onClick={() => deleteIngredient(i)}>
                        <span className={`material-icons ${styles['icon']} ${styles['red']}`}>remove</span>
                    </button>}
            </div>
            <ul className={styles['ingredient-list']}>
                {ingredientInputs[i]}
            </ul>
        </div>
    );

    const categoriesInput = categories.map((category) =>
        <div key={category} className={styles['category']}>
            <input type="checkbox" id={category} {...register(`category.${category}`)} />
            <label htmlFor={category}> {category}</label>
        </div>
    );



    for (let i = 0; i < stepsNumber; i++) {
        const options = i === 0 ? { shouldUnregister: true, required: true } : { shouldUnregister: true };
        steps.push(
            <React.Fragment key={i} >
                <li key={i} >
                    <textarea rows="1" {...register(`steps.${i}`, options)} />
                </li>
                {errors.steps && i === 0 && <div className={styles['error']} style={{ marginTop: '-5px' }}>שדה זה הינו חובה</div>}
            </ React.Fragment>
        );
    }

    const addIngredientsGroup = () => {
        setIngredientsNumber((prev) => [...prev, 1])
    }

    const deleteIngredientsGroup = () => {
        setIngredientsNumber((prev) => {
            const newState = [...prev];
            newState.pop();
            return newState;
        })
    }

    const addIngredient = (groupNum) => {
        setIngredientsNumber((prev) => {
            const newState = [...prev];
            newState[groupNum]++;
            return newState;
        })
    }

    const deleteIngredient = (groupNum) => {
        setIngredientsNumber((prev) => {
            const newState = [...prev];
            newState[groupNum]--;
            return newState;
        })
    }

    const addStep = () => {
        setStepsNumber((prevStepsNum) => (prevStepsNum + 1));
    }

    const deleteStep = () => {
        if (stepsNumber <= 1) return;
        setStepsNumber((prevStepsNum) => (prevStepsNum - 1))
    }

    return (
        <div className={styles['layout']}>
            <Head>
                <title>{`ספר מתכונים - מתכון חדש`}</title>
            </Head>
            <h1>מתכון חדש</h1>
            <section>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles['input-section']}>
                        <label>כותרת</label>
                        <input type="text" placeholder="כותרת" {...register("title", { required: true })} />
                        {errors.title && <div className={styles['error']}>שדה זה הינו חובה</div>}
                    </div>
                    <ImageUploader register={register} file={image} />
                    <div className={styles['input-section']}>
                        <label>תיאור</label>
                        <textarea rows="3" placeholder="תיאור" {...register("description", { required: true })} />
                        {errors.description && <div className={styles['error']}>שדה זה הינו חובה</div>}
                    </div>
                    <div className={styles['input-section']}>
                        <label>זמן הכנה</label>
                        <input type="number" min="0" {...register("workTime", { required: true })} />
                        {errors.workTime && <div className={styles['error']}>שדה זה הינו חובה</div>}
                    </div>
                    <div className={styles['input-section']}>
                        <label>זמן כולל</label>
                        <input type="number" min="0" {...register("time", { required: true })} />
                        {errors.time && <div className={styles['error']}>שדה זה הינו חובה</div>}
                    </div>
                    <div className={styles['input-section']}>
                        <label>מספר מנות</label>
                        <input type="text" {...register("servings")} />
                    </div>
                    <div className={styles['input-section']}>
                        <label>קושי</label>
                        <select {...register("difficulty", { required: true })}>
                            <option value="1">קל</option>
                            <option value="2">בינוני</option>
                            <option value="3">קשה</option>
                        </select>
                        {errors.difficulty && <div className={styles['error']}>שדה זה הינו חובה</div>}
                    </div>
                    <label className={styles['label']}>קטגוריה / קטגוריות</label>
                    <div className={styles['categories']}>
                        {categoriesInput}
                    </div>
                    <div className={styles['input-section']}>
                        <div className={styles['label-with-buttons']}>
                            <label>המרכיבים</label>
                            <button className={styles['button-reset']} type="button" onClick={addIngredientsGroup}>
                                <span className={`material-icons ${styles['icon']} ${styles['green']}`}>add</span>
                            </button>
                            {(ingredientsNumber.length <= 1) ? null :
                                <button className={styles['button-reset']} type="button" onClick={deleteIngredientsGroup}>
                                    <span className={`material-icons ${styles['icon']} ${styles['red']}`}>remove</span>
                                </button>}
                        </div>
                        {ingredientsElements}
                    </div>
                    <div className={styles['input-section']}>
                        <div className={styles['label-with-buttons']}>
                            <label>הוראות הכנה</label>
                            <button className={styles['button-reset']} type="button" onClick={addStep}>
                                <span className={`material-icons ${styles['icon']} ${styles['green']}`}>add</span>
                            </button>
                            {(stepsNumber <= 1) ? null :
                                <button className={styles['button-reset']} type="button" onClick={deleteStep}>
                                    <span className={`material-icons ${styles['icon']} ${styles['red']}`}>remove</span>
                                </button>}
                        </div>

                        <ol className={styles['steps']}>
                            {steps}
                        </ol>
                    </div>
                    <div className={styles['input-section']}>
                        <label>טיפים והערות</label>
                        <textarea rows="3" {...register("tips")} />
                    </div>
                    <input type="submit" className={styles['submit']} value="שלח" />
                </form>
            </section>
        </div>
    )
}


export default NewRecipe;
