import React, { useState } from 'react';
import { firebase } from '../../util/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../context/state.js';
import { useForm } from "react-hook-form";
import styles from './index.js.module.css';
import Head from 'next/head';
import ImageUploader from '../../components/ImageUploader';
import { categories } from '../../info.js';


const NewRecipe = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { user } = useAppContext();
    const [ingredientsNumber, setIngredientsNumber] = useState([1]);    //each array element is an ingredient group, the value itself defines the number of ingredients in each group
    const [stepsNumber, setStepsNumber] = useState(1);
    let ingredientInputs = {}, steps = [];
    const image = watch("image");

    const onSubmit = async (data) => {
        let { image, ...recipe } = data;
        if (!image.length) {
            image = `/assets/food placeholder.png`;
        }
        let downloadUrl = await uploadImageToFirebase(image[0]);
        recipe.uid = user.uid;
        recipe.name = user.name;
        recipe.comments = [];
        recipe.image = downloadUrl;
        fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        })
            .then((res) => res.json())
            .then((result) => console.log('result'))
            .catch((err) => console.log('error'))
    }

    for (let i = 0; i < ingredientsNumber.length; i++) {
        ingredientInputs[i] = [];
        for (let j = 0; j < ingredientsNumber[i]; j++) {
            ingredientInputs[i].push(<input key={j} type="text" placeholder="מרכיב" {...register(`ingredients.${i}.list.${j}`)} />)
        }
    }

    const ingredientsElements = ingredientsNumber.map((__, i) =>
        <div key={i} className={styles['ingredient-group']}>
            <label>כותרת</label>
            <input type="text" placeholder="כותרת" {...register(`ingredients.${i}.name`, { required: true })} />
            {errors.ingredients && errors.ingredients[`${i}`] && errors.ingredients[`${i}`].name &&
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
                    <div className={styles['checkbox']}>
                        <input type="checkbox" placeholder="private" {...register("private")} />
                        <label>מתכון פרטי (רק את/ה תוכל/י לראות את המתכון בעמוד האישי)</label>
                    </div>
                    <input type="submit" className={styles['submit']} value="שלח" />
                </form>
            </section>
        </div>
    )
}

// This function uploads an image to firebase and returns the download url
async function uploadImageToFirebase(file) {
    return new Promise(function (resolve, reject) {
        let uploadTask = firebase.storage().ref().child(`recipes/${uuidv4()}.png`).put(file); // upload 
        uploadTask.on('state_changed', (snapshot) => {
            // let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }, (error) => {
            console.log(error)
            reject();
        }, () => { //Success
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                resolve(downloadURL)
            });
        })
    });
}


export default NewRecipe;
