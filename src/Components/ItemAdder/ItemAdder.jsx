import React from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import './ItemAdder.scss'

const ItemAdder = ({ lastId, path, onItemAdded }) => {
    const addItem = async (itemName, status) => {
        const newId = lastId + 1;
        const database = getDatabase();
        const databaseRef = ref(database, `${path}/${newId}`);
        try {
            await set(databaseRef, {
                id: newId,
                name: itemName,
                status: status
            });
            onItemAdded(newId); // Обновляем lastId в родительском компоненте
        } catch (error) {
            console.error(`Ошибка добавления элемента в ${path}: `, error);
        }
    };

    return (
        <form 
        className='add-new-item-form'
        onSubmit={addItem}>
            <input
                type="text"
                value={newItemName}
                name={itemName}
                onChange={(e) => setNewItemName(e.target.value)}
            />
            <button type="submit">Добавить</button>
        </form>
    );
};

export default ItemAdder;