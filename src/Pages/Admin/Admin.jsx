import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, child, get } from 'firebase/database';
import useFirebaseData from '../../firebase/useFirebaseData.js';

import "./Admin.scss";

const Admin = () => {
    const data = useFirebaseData();
    const [user, setUser] = useState({
        companies: [],
        directions: [],
        firstName: '',
        hobbies: [],
        id: '',
        lastName: '',
        photo: '',
        quote: '',
        skills: [],
        social: [],
    });

    const [company, setCompany] = useState({
        id: '',
        name: '',
        status: ''
    });
    const [direction, setDirection] = useState({
        id: '',
        name: '',
        status: ''
    });
    const [skill, setSkill] = useState({
        name: '',
        status: ''
    });

    const [social, setSocial] = useState({
        link: '',
        type: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleCompanyStatusChange = (event) => {
        const { value } = event.target;
        setCompany(prevState => ({
            ...prevState,
            status: value
        }));
    };

    const [addedCompanies, setAddedCompanies] = useState([]);
    // Функция для добавления компании
    const handleAddCompany = () => {
        if (company.id && company.status) {
            setAddedCompanies(prev => [...prev, { id: company.id, name: company.name, status: company.status }]);
            // Сбросить текущее состояние компании
            setCompany({ id: '', status: '' });
        }
    };
    const handleDirectionStatusChange = (event) => {
        const { value } = event.target;
        setDirection(prevState => ({
            ...prevState,
            status: value
        }));
    };

    const [addedDirections, setAddedDirections] = useState([]);
    // Функция для добавления направления
    const handleAddDirections = () => {
        if (direction.id && direction.status) {
            setAddedDirections(prev => [...prev, { id: direction.id, name: direction.name, status: direction.status }]);
            // Сбросить текущее состояние направления
            setDirection({ id: '', name: '', status: '' });
        }
    };

    const handleSkillChange = (event) => {
        const { name, value } = event.target;
        setSkill({ ...skill, [name]: value });
    };
    const handleSkillStatusChange = (event) => {
        const { value } = event.target;
        setSkill(prevState => ({
            ...prevState,
            status: value
        }));
    };

    const [addedSkills, setAddedSkills] = useState([]);
    // Функция для добавления навыка
    const handleAddSkill = () => {
        if (skill.name && skill.status) {
            setAddedSkills(prevSkills => [...prevSkills, skill]);
            // Сбросить текущее состояние навыка
            setSkill({ name: '', status: '' });
        }
    };

    // Обработчик изменения для чекбоксов хобби
const handleHobbyCheckboxChange = (hobbyId) => {
    setUser(prevUser => {
        // Проверяем, содержит ли массив hobbies уже этот hobbyId
        const isAlreadySelected = prevUser.hobbies.includes(hobbyId);
        let newHobbies;
        if (isAlreadySelected) {
            // Если да, удаляем его из массива
            newHobbies = prevUser.hobbies.filter(id => id !== hobbyId);
        } else {
            // Если нет, добавляем его в массив
            newHobbies = [...prevUser.hobbies, hobbyId];
        }
        return {
            ...prevUser,
            hobbies: newHobbies
        };
    });
};

const [addedSocials, setAddedSocials] = useState([]);

const handleSocialChange = (event) => {
    const { name, value } = event.target;
    setSocial({ ...social, [name]: value });
};

const handleAddSocial = () => {
    if (social.link && social.type) {
        setAddedSocials(prevSocials => [...prevSocials, { ...social }]);
        // Сбросить текущее состояние социальной сети
        setSocial({ link: '', type: '' });
    }
};

    // Функция для получения последнего id в списке пользователей
    const getLastMemberId = async () => {
        const database = getDatabase();
        const databaseRef = ref(database, 'members');
        const snapshot = await get(databaseRef);
        const membersArray = snapshot.val() ? Object.values(snapshot.val()) : [];
        const lastId = membersArray.length > 0 ? Math.max(...membersArray.map(member => Number(member.id))) : 0;
        return lastId;
    };

    useEffect(() => {
        // Запрос к базе данных для получения последних ID при монтировании компонента
        const fetchLastIds = async () => {
            const lastMemberId = await getLastMemberId();
            setLastMemberId(lastMemberId);
        };

        fetchLastIds();
    }, []);

    const [lastMemberId, setLastMemberId] = useState(0);
    // Функция для добавления данных пользователя с уникальным id
    const addMember = async (memberData) => {
        const newId = lastMemberId + 1;
        setLastMemberId(newId);
        const database = getDatabase();
        const databaseRef = ref(database, `members/${newId}`);
        try {
            await set(databaseRef, {
                ...memberData,
                id: newId
            });
            console.log(`Пользователь добавлен с ID: ${newId}`);
        } catch (error) {
            console.error("Ошибка при добавлении пользователя: ", error);
        }
    };


const handleSubmit = (event) => {
    event.preventDefault();
    // Создаем новый массив, содержащий только id и status каждой компании
    const companiesWithOnlyIdAndStatus = addedCompanies.map(company => ({
        id: company.id,
        status: company.status
    }));
        // Создаем новый массив, содержащий только id и status каждого направления
    const directionsWithOnlyIdAndStatus = addedDirections.map(direction => ({
        id: direction.id,
        status: direction.status
    }));
    // Обновляем объект user перед выводом в консоль
    setUser(prevUser => ({
        ...prevUser,
        companies: companiesWithOnlyIdAndStatus,
        directions: directionsWithOnlyIdAndStatus,
        skills: addedSkills,
        social: addedSocials,
    }));
};

useEffect(() => {
    console.log(user);
    if (user.companies.length > 0 && user.directions.length > 0 && user.skills.length > 0 && user.social.length > 0) {
        addMember(user);
                // Сброс состояний всех полей
                setUser({
                    firstName: '',
                    lastName: '',
                    id: '',
                    photo: '',
                    quote: '',
                    companies: [],
                    hobbies: [],
                    directions: [],
                    social: [],
                    skills: [],
                });
                setAddedCompanies([]);
                setAddedDirections([]);
                setAddedSkills([]);
                setAddedSocials([]);
    }
  }, [user]); // Зависимость от user гарантирует, что код выполнится при его изменении

    return (
        <main className="admin__container">
            <h2>Добавить участника можно здесь</h2>
            <form
                className="admin__form"
                onSubmit={handleSubmit}
            >
                <label>
                    Имя:
                </label>
                <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
                />
                <label>
                    Фамилия:
                </label>
                <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                />
                <label>
                    Компания:
                </label>
                {addedCompanies.map((comp, index) => (
                    <div key={index}>
                        <span>{comp.name}</span> : <span>{comp.status}</span>
                    </div>
                ))}
                <select
                    name="companies"
                    onChange={(event) => {
                        const selectedCompany = data.companies.find(company => company.id === +event.target.value);
                        if (selectedCompany) {
                            setCompany(prev => ({ ...prev, id: selectedCompany.id, name: selectedCompany.name }));
                        } else {
                            // Обработка случая, когда компания не найдена
                            console.error('Выбранная компания не найдена');
                        }
                    }}
                >
                    {data.companies.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>
                <label>
                    <input
                        type="radio"
                        name="companyStatus"
                        value="Работает"
                        checked={company.status === 'Работает'}
                        onChange={handleCompanyStatusChange}
                    />
                    Работает
                </label>
                <label>
                    <input
                        type="radio"
                        name="companyStatus"
                        value="Работала"
                        checked={company.status === 'Работала'}
                        onChange={handleCompanyStatusChange}
                    />
                    Работала
                </label>
                <button type="button" onClick={handleAddCompany}>Добавить</button>
                <label>
                    Направление:
                </label>
                {addedDirections.map((direction, index) => (
                    <div key={index}>
                        <span>{direction.name}</span> : <span>{direction.status}</span>
                    </div>
                ))}
                <select 
                    name="directions"
                    onChange={(event) => {
                        const selectedDirection = data.directions.find(direction => direction.id === +event.target.value);
                        if (selectedDirection) {
                            setDirection(prev => ({ ...prev, id: selectedDirection.id, name: selectedDirection.name }));
                        } else {
                            // Обработка случая, когда направление не найдено
                            console.error('Выбранное направление не найдено');
                        }
                    }}
                >
                {data.directions.map((direction) => (
                    <option key={direction.id} value={direction.id}>
                    {direction.name}
                    </option>
                ))}
                </select>
                <label>
                    <input
                        type="radio"
                        name="directionStatus"
                        value="Уже знает"
                        checked={direction.status === 'Уже знает'}
                        onChange={handleDirectionStatusChange}
                    />
                    Уже знает
                </label>
                <label>
                    <input
                        type="radio"
                        name="directionStatus"
                        value="Хочет изучить"
                        checked={direction.status === 'Хочет изучить'}
                        onChange={handleDirectionStatusChange}
                    />
                    Хочет изучить
                </label>
                <button type="button" onClick={handleAddDirections}>Добавить направление</button>
                <label>
                    Навыки:
                </label>
                {addedSkills.map((skill, index) => (
                    <div key={index}>
                        <span>{skill.name}</span> : <span>{skill.status}</span>
                    </div>
                ))}
                <label>
                    <input
                        type="text"
                        name="name"
                        value={skill.name}
                        onChange={handleSkillChange}
                    />
                </label>
                <label>
                    <input
                        type="radio"
                        name="skillStatus"
                        value="Уже знает"
                        checked={skill.status === 'Уже знает'}
                        onChange={handleSkillStatusChange}
                    />
                    Уже знает
                </label>
                <label>
                    <input
                        type="radio"
                        name="skillStatus"
                        value="Хочет изучить"
                        checked={skill.status === 'Хочет изучить'}
                        onChange={handleSkillStatusChange}
                    />
                    Хочет изучить
                </label>
                <button type="button" onClick={handleAddSkill}>Добавить навык</button>
                <label>
                    Хобби:
                </label>
                {data.hobbies.map((hobby) => (
                    <label key={hobby.id}>
                        <input
                            type="checkbox"
                            checked={user.hobbies.includes(hobby.id)}
                            onChange={() => handleHobbyCheckboxChange(hobby.id)}
                        />
                        {hobby.name}
                    </label>
                ))}
                <label>
                    Цитата:
                </label>
                <input
                    type="text"
                    name="quote"
                    value={user.quote}
                    onChange={handleInputChange}
                />
                <label>
                    Социальная сеть:
                </label>
                {addedSocials.map((social, index) => (
                    <div key={index}>
                        <span>{social.type}</span> : <span>{social.link}</span>
                    </div>
                ))}
                <select
                    name="type"
                    value={social.type}
                    onChange={handleSocialChange}
                >
                    <option value="telegram">telegram</option>
                    <option value="instagram">instagram</option>
                    <option value="vk">vk</option>
                    <option value="linkedIn">linkedIn</option>
                    <option value="whatsapp">whatsapp</option>
                    <option value="email">email</option>
                    <option value="phone">phone</option>
                </select>
                <label>
                Введите ссылку здесь
                <input
                    type="text"
                    name="link"
                    value={social.link}
                    onChange={handleSocialChange}
                />
                </label>
                <button type="button" onClick={handleAddSocial}>Добавить соц.сеть</button>
                <label>
                    Фото:
                    <input
                        type="text"
                        placeholder="Введите URL фотографии"
                        name="photo"
                        onChange={handleInputChange}
                    />
                </label>
                <button
                    type="submit"
                    disabled=
                        {!user.firstName 
                        || !user.lastName 
                        || addedCompanies.length === 0 
                        || addedDirections.length === 0 
                        || addedSkills.length === 0 
                        || addedSocials.length === 0}
                >
                    Сохранить
                </button>
            </form>
        </main>
    );
};
export default Admin;