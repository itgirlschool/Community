import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { membersStore } from '../../servises/membersStore.jsx';
import useFirebaseData from '../../firebase/useFirebaseData.js';
import FormInput from '../../Components/FormInput/FormInput.jsx';
import AddedItem from '../../Components/AddedItem/AddedItem.jsx';
import ListItem from '../../Components/ListItem/ListItem.jsx';
import "./Admin.scss";

const Admin = observer(() => {
    const data = useFirebaseData(); 

    useEffect(() => {
        membersStore.fetchLastMemberId();
        membersStore.setCompanies(data.companies);
        membersStore.setDirections(data.directions);
        membersStore.setDirections(data.hobbies);
    }, [data]); 

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        membersStore.setMember(name, value);
    };

    const handleCompanyStatusChange = (event) => {
        const { value } = event.target;
        membersStore.setCompany('status', value);
    };

    // Функция для добавления компании
    const handleAddCompany = () => {
        membersStore.addCompany();
    };

    const handleCompanyChange = (event) => {
        // Преобразование значения из event.target.value в число
        const companyId = Number(event.target.value);
        // Поиск компании по id
        const selectedCompany = data.companies.find(company => company.id === companyId);
    
        if (selectedCompany) {
            // Если компания найдена, обновляем информацию о компании в состоянии
            membersStore.setCompany('id', selectedCompany.id);
            membersStore.setCompany('name', selectedCompany.name);
        } else {
            // Если компания не найдена, выводим сообщение об ошибке в консоль
            console.error('Выбранная компания не найдена');
        }
    }

    // Обработчики изменений для статуса направления
    const handleDirectionStatusChange = (event) => {
        const { value } = event.target;
        membersStore.setDirection('status', value);
    };

    // Функция для добавления направления
    const handleAddDirections = () => {
        membersStore.addDirection();
    };

    const handleDirectionChange = (event) => {
        const selectedDirection = data.directions.find(direction => direction.id === +event.target.value);
        if (selectedDirection) {
        membersStore.setDirection('id', selectedDirection.id);
        membersStore.setDirection('name', selectedDirection.name);
        } else {
        console.error('Выбранное направление не найдено');
        }
    }

    // Обработчики изменений для навыков
    const handleSkillChange = (event) => {
        const { name, value } = event.target;
        membersStore.setSkill(name, value);
    };

    const handleSkillStatusChange = (event) => {
        const { value } = event.target;
        membersStore.setSkill('status', value);
    };

    // Функция для добавления навыка
    const handleAddSkill = () => {
        membersStore.addSkill();
    };

    // Функция для добавления социальной сети
    const handleAddSocial = () => {
        membersStore.addSocial();
    };

    const handlePhotoChange = (event) => {
        const { value } = event.target;
        membersStore.setPhoto(value);
    };


    // Обработчик отправки формы
    const handleSubmit = (event) => {
        event.preventDefault();
        membersStore.submitMember();
    };

    return (
        <main className="admin__container">
            <h2>Добавить участника можно здесь</h2>
            <form
                className="admin__form"
                onSubmit={handleSubmit}
            >
                <FormInput
                    label="Имя:"
                    type="text"
                    name="firstName"
                    value={membersStore.member.firstName}
                    onChange={handleInputChange}
                />
                <FormInput
                    label="Фамилия:"
                    type="text"
                    name="lastName"
                    value={membersStore.member.lastName}
                    onChange={handleInputChange}
                />
                {membersStore.addedCompanies.map((comp, index) => (
                    <AddedItem
                    key={index}
                    name={comp.name}
                    status={comp.status}
                    onRemove={() => membersStore.removeCompany(index)}
                />
                ))}
                <FormInput
                    label="Компания:"
                    type="select"
                    name="companies"
                    value={membersStore.company.id}
                    onChange={handleCompanyChange}
                    options={data.companies.map(company => ({
                        label: company.name,
                        value: company.id
                    }))}
                />
                <FormInput
                    label="Работает"
                    type="radio"
                    name="companyStatus"
                    value="Работает"
                    checked={membersStore.company.status === 'Работает'}
                    onChange={handleCompanyStatusChange}
                />
                <FormInput
                    label="Работала"
                    type="radio"
                    name="companyStatus"
                    value="Работала"
                    checked={membersStore.company.status === 'Работала'}
                    onChange={handleCompanyStatusChange}
                />
                <button type="button" onClick={handleAddCompany}>Добавить</button>
                {membersStore.addedDirections.map((direction, index) => (
                    <AddedItem
                        key={index}
                        name={direction.name}
                        status={direction.status}
                        onRemove={() => membersStore.removeDirection(index)}
                    />
                ))}
                <FormInput
                    label="Направление:"
                    type="select"
                    name="directions"
                    value={membersStore.direction.id}
                    onChange={handleDirectionChange}
                    options={data.directions.map(direction => ({
                        label: direction.name,
                        value: direction.id
                    }))}
                />
                <FormInput
                    label="Уже знает"
                    type="radio"
                    name="directionStatus"
                    value="Уже знает"
                    checked={membersStore.direction.status === 'Уже знает'}
                    onChange={handleDirectionStatusChange}
                />
                <FormInput
                    label="Хочет изучить"
                    type="radio"
                    name="directionStatus"
                    value="Хочет изучить"
                    checked={membersStore.direction.status === 'Хочет изучить'}
                    onChange={handleDirectionStatusChange}
                />
                <button type="button" onClick={handleAddDirections}>Добавить направление</button>
                {membersStore.addedSkills.map((skill, index) => (
                    <AddedItem
                        key={index}
                        name={skill.name}
                        status={skill.status}
                        onRemove={() => membersStore.removeSkill(index)}
                    />
                ))}
                <FormInput
                    label="Название навыка:"
                    type="text"
                    name="name"
                    value={membersStore.skill.name}
                    onChange={handleSkillChange}
                />
                <FormInput
                    label="Уже знает"
                    type="radio"
                    name="skillStatus"
                    value="Уже знает"
                    checked={membersStore.skill.status === 'Уже знает'}
                    onChange={handleSkillStatusChange}
                />
                <FormInput
                    label="Хочет изучить"
                    type="radio"
                    name="skillStatus"
                    value="Хочет изучить"
                    checked={membersStore.skill.status === 'Хочет изучить'}
                    onChange={handleSkillStatusChange}
                />
                <button type="button" onClick={handleAddSkill}>Добавить навык</button>
                <label>Хобби:</label>
                {data.hobbies.map((hobby) => (
                    <FormInput
                        key={hobby.id}
                        label={hobby.name}
                        type="checkbox"
                        name="hobbies"
                        checked={membersStore.memberHobbies.includes(hobby.id)}
                        onChange={() => membersStore.toggleHobby(hobby.id)}
                    />
                ))}
                <FormInput
                    label="Цитата:"
                    type="text"
                    name="quote"
                    value={membersStore.member.quote}
                    onChange={handleInputChange}
                />
                <FormInput
                    label="Социальная сеть:"
                    type="select"
                    name="type"
                    value={membersStore.social.type}
                    onChange={(event) => membersStore.setSocial('type', event.target.value)}
                    options={[
                        { value: 'telegram', label: 'telegram' },
                        { value: 'instagram', label: 'instagram' },
                        { value: 'vk', label: 'vk' },
                        { value: 'linkedIn', label: 'linkedIn' },
                        { value: 'whatsapp', label: 'whatsapp' },
                        { value: 'phone', label: 'phone' },
                    ]}
                />
                <FormInput
                    label="Введите ссылку здесь:"
                    type="text"
                    name="link"
                    value={membersStore.social.link}
                    onChange={(event) => membersStore.setSocial('link', event.target.value)}
                />
                <button type="button" onClick={handleAddSocial}>Добавить соц.сеть</button>
                {membersStore.addedSocials.map((social, index) => (
                    <AddedItem
                        key={index}
                        name={social.type}
                        status={social.link}
                        onRemove={() => membersStore.removeSocial(index)}
                    />
                ))}
                <FormInput
                    label="Фото:"
                    type="text"
                    name="photo"
                    placeholder="Введите URL фотографии"
                    value={membersStore.member.photo}
                    onChange={handlePhotoChange}
                />
                <button
                    type="submit"
                    disabled=
                        {!membersStore.member.firstName 
                        || !membersStore.member.lastName 
                        || membersStore.addedCompanies.length === 0 
                        || membersStore.addedDirections.length === 0 
                        || membersStore.addedSkills.length === 0 
                        || membersStore.addedSocials.length === 0}
                >
                    {membersStore.editingMember ? 'Обновить' : 'Сохранить'}
                </button>
            </form>

            <div className="member-container">
            <h2>Все участники</h2>
            {data.members.map((member) => (
                <div key={member.id} className="member">
                    {member.photo && <img src={member.photo} alt={`${member.firstName} ${member.lastName}`} />}
                    <span className="firstName">{member.firstName}</span>
                    <span className="lastName">{member.lastName}</span>
                    <span className="info">
                        Работает: {
                            member.companies
                            .filter(company => company.status === "Работает")
                            .map(company => data.companies.find(c => c.id === company.id)?.name)
                            .join(', ')
                        }
                    </span>
                    <span className="info">
                        Работала: {
                            member.companies
                            .filter(company => company.status === "Работала")
                            .map(company => data.companies.find(c => c.id === company.id)?.name)
                            .join(', ')
                        }
                    </span>
                    <span className="info">
                        Направления, которые уже знает: {
                            member.directions
                            .filter(direction => direction.status === "Уже знает")
                            .map(direction => data.directions.find(d => d.id === direction.id)?.name)
                            .join(', ')
                        }
                        </span>
                        <span className="info">
                        Направления, которые хочет изучить: {
                            member.directions
                            .filter(direction => direction.status === "Хочет изучить")
                            .map(direction => data.directions.find(d => d.id === direction.id)?.name)
                            .join(', ')
                        }
                    </span>
                    <span className="info">
                        Хобби: {
                            member.hobbies.map(hobbyId => 
                            data.hobbies.find(h => h.id === hobbyId)?.name).join(', ')
                        }
                    </span>
                    <span className="info">
                        Навыки, которые уже знает: {
                            member.skills
                            .filter(skill => skill.status === "Уже знает")
                            .map(skill => skill.name)
                            .join(', ')
                        }
                    </span>
                    <span className="info">
                        Навыки, которые хочет изучить: {
                            member.skills
                            .filter(skill => skill.status === "Хочет изучить")
                            .map(skill => skill.name)
                            .join(', ')
                        }
                    </span>
                    <span className="info">Цитата: {member.quote}</span>
                    <span className="info">
                    Соц.сети:
                        <br />
                        {member.social.map(s => (
                            <React.Fragment key={s.type || index}>
                            {s.type}: {s.link}
                            <br />
                            </React.Fragment>
                        ))}
                    </span>
                    <button onClick={() => membersStore.startEditing(member)}>Редактировать информацию</button>
                    <button onClick={() => membersStore.removeMember(member.id)}>Удалить участника</button>
                </div>
            ))}
            </div>

            <div className="companies-container">
                <h2>Все компании</h2>
                {data.companies.map((company) => (
                    <ListItem
                        key={company.id}
                        item={company}
                        editAction={membersStore.editCompanyFromList}
                        removeAction={membersStore.removeCompanyFromList}
                    />
                ))}
                
                <FormInput
                    label="Название компании:"
                    type="text"
                    name="companyName"
                    value={membersStore.company.name}
                    onChange={(event) => membersStore.setCompany('name', event.target.value)}
                />
                <button type="button" onClick={() => membersStore.addCompanyToDatabase(membersStore.company)}>
                    Добавить компанию
                </button>
            </div>

            <div className="directions-container">
                <h2>Все направления</h2>
                {data.directions.map((direction) => (
                    <ListItem
                        key={direction.id}
                        item={direction}
                        editAction={membersStore.editDirectionFromList}
                        removeAction={membersStore.removeDirectionFromList}
                    />
                ))}
                <FormInput
                    label="Название направления:"
                    type="text"
                    name="directionName"
                    value={membersStore.direction.name}
                    onChange={(event) => membersStore.setDirection('name', event.target.value)}
                />
                <button type="button" onClick={() => membersStore.addDirectionToDatabase(membersStore.direction)}>
                    Добавить направление
                </button>
            </div>

            <div className="hobbies-container">
                <h2>Все хобби</h2>
                {data.hobbies.map((hobby) => (
                    <ListItem
                        key={hobby.id}
                        item={hobby}
                        editAction={membersStore.editHobbyFromList}
                        removeAction={membersStore.removeHobbyFromList}
                    />
                ))}
                <FormInput
                    label="Название хобби:"
                    type="text"
                    name="hobbyName"
                    value={membersStore.hobby.name}
                    onChange={(event) => membersStore.setHobby('name', event.target.value)}
                />
                <button type="button" onClick={() => membersStore.addHobbyToDatabase(membersStore.hobby)}>
                    Добавить хобби
                </button>
            </div>
        </main>
    );
});
export default Admin;