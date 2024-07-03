import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { membersStore } from '../../servises/membersStore.js';
import useFirebaseData from '../../firebase/useFirebaseData.js';
import MemberForm from '../../Components/MemberForm/MemberForm.jsx';
import MemberList from '../../Components/MemberList/MemberList.jsx';
import ListManager from '../../Components/ListManager/ListManager.jsx';
import "./Admin.scss";
import AllPhotos from '../../Components/AllPhotos/AllPhotos.jsx';

const Admin = observer(() => {
    const data = useFirebaseData();

    useEffect(() => {
            membersStore.fetchLastMemberId();
            membersStore.setCompanies(data.companies);
            membersStore.setDirections(data.directions);
            membersStore.setHobbies(data.hobbies);
    }, [membersStore]); 

    const handleCompanyListChange = (event) => {
        membersStore.setCompany('name', event.target.value)
        membersStore.setCompanyInputFilled(event.target.value.trim() !== '');
    };

    const handleDirectionListChange = (event) => {
        membersStore.setDirection('name', event.target.value)
        membersStore.setDirectionInputFilled(event.target.value.trim() !== '');
    };

    const handleHobbyListChange = (event) => {
        membersStore.setHobby('name', event.target.value)
        membersStore.setHobbyInputFilled(event.target.value.trim() !== '');
    };

    return (
        <main className="admin__container">
            <h2>Добавить участника можно здесь</h2>
            <MemberForm 
                membersStore={membersStore}
                data={data} 
            />
            <h2>Все участники</h2>
            <MemberList
                data={data}
                membersStore={membersStore}
            />
            <ListManager
                title="Все компании"
                items={data.companies}
                editAction={membersStore.editCompanyFromList}
                removeAction={membersStore.removeCompanyFromList}
                inputLabel="Название компании: "
                inputValue={membersStore.company.name}
                inputChange={handleCompanyListChange}
                addButtonClick={() => {membersStore.addCompanyToDatabase(membersStore.company)}}
                isInputFilled={membersStore.isCompanyInputFilled}
            />
            <ListManager
                title="Все направления"
                items={data.directions}
                editAction={membersStore.editDirectionFromList}
                removeAction={membersStore.removeDirectionFromList}
                inputLabel="Название направления: "
                inputValue={membersStore.direction.name}
                inputChange={handleDirectionListChange}
                addButtonClick={() => membersStore.addDirectionToDatabase(membersStore.direction)}
                isInputFilled={membersStore.isDirectionInputFilled}
            />
            <ListManager
                title="Все хобби"
                items={data.hobbies}
                editAction={membersStore.editHobbyFromList}
                removeAction={membersStore.removeHobbyFromList}
                inputLabel="Название хобби: "
                inputValue={membersStore.hobby.name}
                inputChange={handleHobbyListChange}
                addButtonClick={() => membersStore.addHobbyToDatabase(membersStore.hobby)}
                isInputFilled={membersStore.isHobbyInputFilled}
            />
            <AllPhotos />
        </main>
    );
});
export default Admin;