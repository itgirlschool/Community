import { useState, useEffect } from "react";
import { storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from './Photo.module.scss';

const Photo = ({ handlePhotoChange, currentPhotoUrl }) => {
    useEffect(() => {
        if (currentPhotoUrl) {
            setImage(currentPhotoUrl);
        }
    }, [currentPhotoUrl]);

    const [image, setImage] = useState(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            await handleSubmit(file);
        }
    };

    const handleSubmit = async (file) => {
        const imageRef = ref(storage, `images/${file.name}`);
        try {
            await uploadBytes(imageRef, file);
            const url = await getDownloadURL(imageRef);
            handlePhotoChange({ target: { value: url } });
        } catch (error) {
            console.log(error.message, "ошибка получения пути фотографии");
        }
    };

    return (
        <div className={styles.container}>
            <label>Фотография:</label>
                <img 
                    className={styles.image} 
                    src={currentPhotoUrl ? currentPhotoUrl : 'https://firebasestorage.googleapis.com/v0/b/gonetwork-community-1add4.appspot.com/o/member.png?alt=media&token=c37df151-abbd-4bbf-9880-accd49790801'}
                    alt="фото"
                ></img>
            <input type="file" onChange={handleImageChange} />
        </div>
    );
}

export default Photo;