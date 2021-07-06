import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Image from 'next/image';
import { firebase } from '../util/firebase.js';
import styles from '../styles/LoginRegister.module.css'


const LoginRegister = ({ close }) => {
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const [formMode, setFormMode] = useState('login');
    const [isloading, setIsLoading] = useState(false);
    const [warning, setWarning] = useState('');

    const onSubmit = (data) => {
        console.log(data);
        const { name, email, password } = data;
        setWarning('');
        setIsLoading(true);
        if (formMode === 'login') {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    close();
                })
                .catch((error) => {
                    setWarning('שם משתמש או סיסמה שגויים');
                    setIsLoading(false);
                })
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const { uid, email } = userCredential.user;
                    fetch('/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ uid, email, name }),
                    })
                        .then((res) => res.json())
                        .then((result) => console.log(result))
                        .catch((err) => console.log(err))
                        .finally(() => close());
                })
                .catch((error) => {
                    if (error.code.includes('password')) {
                        setWarning('על הסיסמה לכלול לפחות 6 תווים');
                    } else if (error.code.includes('email')) {
                        setWarning('האימייל שהוזן לא תקין או בשימוש');
                    }
                    setIsLoading(false);
                })
        }
    }

    const form = formMode === 'login' ?
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
                <h1 className={styles['title']}>התחברות</h1>
                <div className={styles['input-section']}>
                    <label>אימייל</label>
                    <input type="text" placeholder="אימייל" {...register("email")} />
                </div>
                <div className={styles['input-section']}>
                    <label>סיסמה</label>
                    <input type="password" placeholder="סיסמה" {...register("password")} />
                </div>
                <input type="submit" className={styles['submit']} value={isloading ? 'מתחבר...' : 'התחבר'} />
                {warning && <div className={styles['error']}>{warning}</div>}
            </form>
            <div>
                <span>עדיין לא רשום? </span>
                <span className={styles['link']} onClick={() => setFormMode('register')}>להרשמה</span>
            </div>
        </>
        :
        <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
            <h1 className={styles['title']}>משתמש חדש</h1>
            <div style={{ textAlign: 'center' }}>
                <span> כבר רשום למערכת? </span>
                <span className={styles['link']} onClick={() => setFormMode('login')}>לכניסה</span>
            </div>
            <div className={styles['input-section']}>
                <label>שם</label>
                <input type="text" placeholder="שם" {...register("name", { required: true })} />
            </div>
            <div className={styles['input-section']}>
                <label>אימייל</label>
                <input type="text" placeholder="אימייל" {...register("email", { required: true })} />
            </div>
            <div className={styles['input-section']}>
                <label>סיסמה</label>
                <input type="password" placeholder="סיסמה" {...register("password", { required: true })} />
            </div>
            <input type="submit" className={styles['submit']} value={isloading ? 'טוען...' : 'הרשמה'} />
            {(errors.name || errors.email || errors.password) && <div className={styles['error']}>יש למלא את כל השדות</div>}
            {warning && <div className={styles['error']}>{warning}</div>}
        </form>

    return (
        <article className={styles['container']}>
            <button className={styles['close-button']} onClick={() => close()}>
                <span className='material-icons'>close</span>
            </button>
            <div className={styles['image-container']}>
                <Image src={(`/assets/logo.webp`)} layout='fill' objectFit='cover' quality="10" />
            </div>
            {form}
        </article>
    );
}

export default LoginRegister;
