import { useState, useEffect } from 'react';
import { getDatabase, ref, child, get } from 'firebase/database';
import { app } from './firebaseConfig';

const useFirebaseData = () => {
    const [data, setData] = useState({
        members: [],
        companies: [],
        directions: [],
        hobbies: []
    });

    useEffect(() => {
        async function fetchData() {
        const db = getDatabase(app);
        const dbRef = ref(db);
        try {
            const membersSnapshot = await get(child(dbRef, 'members'));
            const companiesSnapshot = await get(child(dbRef, 'companies'));
            const directionsSnapshot = await get(child(dbRef, 'directions'));
            const hobbiesSnapshot = await get(child(dbRef, 'hobbies'));

            const object = {
            members: membersSnapshot.exists() ? membersSnapshot.val() : [],
            companies: companiesSnapshot.exists() ? companiesSnapshot.val() : [],
            directions: directionsSnapshot.exists() ? directionsSnapshot.val() : [],
            hobbies: hobbiesSnapshot.exists() ? hobbiesSnapshot.val() : []
            };

            setData(object);
        } catch (error) {
            console.error(error);
        }
        }

        fetchData();
    }, []);

    return data;
};

export default useFirebaseData;