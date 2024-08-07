import React, { useState } from 'react';
import './ListItem.scss'

const ListItem = ({ item, editAction, removeAction }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(item.name);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        editAction({ ...item, name: editedName });
        setIsEditing(false);
    };

    const handleBack = () => {
        setIsEditing(false);
    };

    return (
        <div className='list-item-container'>
            {isEditing ? (
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                />
            ) : (
                <span>{item.name}</span>
            )}
            {isEditing ? (
                <>
                    <button title="Сохранить" onClick={handleSave}>✔</button>
                    <button title="Отменить" onClick={handleBack}>↩</button>
                </>
            ) : (
                <>
                    <button title="Редактировать" onClick={handleEdit}>✎</button>
                    <button title="Удалить" onClick={() => removeAction(item.id)}>✖</button>
                </>
            )}
        </div>
    );
};

export default ListItem;