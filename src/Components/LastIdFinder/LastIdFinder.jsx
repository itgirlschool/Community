import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

const LastIdFinder = ({ path, onIdRetrieved }) => {
    useEffect(() => {
        const fetchLastId = async () => {
            const database = getDatabase();
            const databaseRef = ref(database, path);
            const snapshot = await get(databaseRef);
            const itemsArray = snapshot.val() ? Object.values(snapshot.val()) : [];
            const lastId = itemsArray.length > 0 ? Math.max(...itemsArray.map(item => Number(item.id))) : 0;
            onIdRetrieved(lastId);
        };

        fetchLastId();
    }, [path, onIdRetrieved]);

    return null; // Этот компонент не рендерит ничего в DOM
};