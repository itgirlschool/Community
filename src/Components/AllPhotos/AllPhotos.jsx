import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/firebaseConfig';
import styles from './AllPhotos.module.scss';

const AllPhotos = () => {
const [images, setImages] = useState([]);

useEffect(() => {
    const imagesRef = ref(storage, 'images');
    listAll(imagesRef)
    .then((res) => {
        const promises = res.items.map((imageRef) =>
        getDownloadURL(imageRef)
        );
        Promise.all(promises).then((urls) => {
        const newImages = urls.map((url, index) => ({
            url,
            ref: res.items[index],
        }));
        setImages(newImages);
        });
    })
    .catch((error) => {
        console.error('Ошибка при загрузке изображений:', error);
    });
}, []);

const handleDelete = (imageRef) => {
    deleteObject(imageRef)
    .then(() => {
        setImages(images.filter((image) => image.ref !== imageRef));
    })
    .catch((error) => {
        console.error('Ошибка при удалении изображения:', error);
    });
};

return (
    <>
        <h2>Все фотографии</h2>
        <div className={styles.photosContainer}>
            {images.map((image) => (
                <div className={styles.container} key={image.url}>
                <img className={styles.image} src={image.url} alt="Uploaded" />
                <button onClick={() => handleDelete(image.ref)}>Удалить</button>
                </div>
            ))}
        </div>
    </>

);
};

export default AllPhotos;