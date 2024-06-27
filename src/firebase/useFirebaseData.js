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
                const snapshotToArray = (snapshot) => {
                    return snapshot.exists() ? Object.values(snapshot.val()) : [];
                };

                const membersSnapshot = await get(child(dbRef, 'members'));
                const companiesSnapshot = await get(child(dbRef, 'companies'));
                const directionsSnapshot = await get(child(dbRef, 'directions'));
                const hobbiesSnapshot = await get(child(dbRef, 'hobbies'));

                if (!membersSnapshot.exists() || !companiesSnapshot.exists() || !directionsSnapshot.exists() || !hobbiesSnapshot.exists()) {
                    throw new Error('Данные отсутствуют');
                }

                setData({
                    members: snapshotToArray(membersSnapshot),
                    companies: snapshotToArray(companiesSnapshot),
                    directions: snapshotToArray(directionsSnapshot),
                    hobbies: snapshotToArray(hobbiesSnapshot)
                });
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return data;
};

export default useFirebaseData;