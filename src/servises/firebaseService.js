import { getDatabase, ref, set, remove, get } from 'firebase/database';

class FirebaseService {
    constructor() {
        this.database = getDatabase();
    }

    // Метод для получения данных из базы
    fetchData = async (path) => {
        const databaseRef = ref(this.database, path);
        const snapshot = await get(databaseRef);
        return snapshot.val() ? Object.values(snapshot.val()) : [];
    }

    // Метод для добавления данных в базу
    addData = async (path, data) => {
        const databaseRef = ref(this.database, path);
        try {
            await set(databaseRef, data);
            alert(`Данные добавлены по пути ${path}`);
        } catch (error) {
            console.error(`Ошибка при добавлении данных по пути ${path}: `, error);
        }
    };

    // Метод для обновления данных в базе
    updateData = async (path, data) => {
        const databaseRef = ref(this.database, path);
        try {
            await set(databaseRef, data);
            alert(`Данные по пути ${path} обновлены`);
        } catch (error) {
            console.error(`Ошибка при обновлении данных по пути ${path}: `, error);
        }
    };

    // Метод для удаления данных из базы
    removeData = async (path) => {
        const databaseRef = ref(this.database, path);
        try {
            await remove(databaseRef);
            alert(`Данные по пути ${path} удалены`);
        } catch (error) {
            console.error(`Ошибка при удалении данных по пути ${path}: `, error);
        }
    };
}

export const firebaseService = new FirebaseService();