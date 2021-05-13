import React, { useState, useEffect } from 'react';
import styles from '../styles/ImageUploader.module.css'
import Image from 'next/image';

const ImageUploader = ({ image, file, register }) => {
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {
        if (file && file.length && file[0] instanceof Blob) {
            convertImageToBase64(file[0])
                .then(url => setImageUrl(url))
                .catch(err => console.log(err))
        } else if (image) {
            setImageUrl(image);
        } else {
            setImageUrl('');
        }
    }, [image, file]);

    return (
        <div className={styles['container']} >
            <div className={styles['preview']}>
                <div className={styles['img-placeholder']}>
                    <span className="material-icons" style={{ fontSize: '6rem', opacity: '0.2' }}>image</span>
                </div>
                {imageUrl ? <Image src={imageUrl} layout='fill' objectFit='cover' /> : null}
            </div>
            <input type="file" id="file" {...register("image")} className={styles['input-file']} accept="image/*" />
            <label htmlFor="file" className={styles['button']}>
                <span className="material-icons" style={{fontSize: '1rem', marginLeft:'2px'}}>file_upload</span>
                {imageUrl ? 'החלף תמונה' : 'העלאת תמונה'}
            </label>
        </div>
    );
}

export default ImageUploader;

// This function gets an image and converts it to a url attachable to src attribute in img tags
function convertImageToBase64(image) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                resolve(reader.result);
            }
        }
        if (image instanceof Blob) {
            reader.readAsDataURL(image)
        } else {
            reject("error - the function requires a Blob in order to convert to base64");
        }
    });
}