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
        <div>
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
                    <button onClick={handleSave}>✔</button>
                    <button onClick={handleBack}>↩</button>
                </>
            ) : (
                <>
                    <button onClick={handleEdit}>✎</button>
                    <button onClick={() => removeAction(item.id)}>✖</button>
                </>
            )}
        </div>
    );
};

export default ListItem;