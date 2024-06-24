import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { membersStore } from '../../servises/membersStore.jsx';
import useFirebaseData from '../../firebase/useFirebaseData.js';

import "./Admin.scss";

const Admin = observer(() => {
    useEffect(() => {
        membersStore.fetchLastMemberId();
    }, []); 
    
    const data = useFirebaseData();

    // Обработчики изменений для полей ввода
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        membersStore.setMember(name, value);
    };

    // Обработчики изменений для статуса компании
    const handleCompanyStatusChange = (event) => {
        const { value } = event.target;
        membersStore.setCompany('status', value);
    };

    // Функция для добавления компании
    const handleAddCompany = () => {
        membersStore.addCompany();
    };

    // Обработчики изменений для статуса направления
    const handleDirectionStatusChange = (event) => {
        const { value } = event.target;
        membersStore.setDirection('status', value);
    };

    // Функция для добавления направления
    const handleAddDirections = () => {
        membersStore.addDirection();
    };

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

    // Обработчик отправки формы
    const handleSubmit = (event) => {
        event.preventDefault();
        membersStore.submitMember();
    };

    const handlePhotoChange = (event) => {
        const { value } = event.target;
        membersStore.setPhoto(value);
    };

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
                value={membersStore.member.firstName}
                onChange={handleInputChange}
                />
                <label>
                    Фамилия:
                </label>
                <input
                    type="text"
                    name="lastName"
                    value={membersStore.member.lastName}
                    onChange={handleInputChange}
                />
                <label>
                    Компания:
                </label>
                {membersStore.addedCompanies.map((comp, index) => (
                    <div key={index}>
                        <span>{comp.name}</span> : <span>{comp.status}</span>
                    </div>
                ))}
                <select
                    name="companies"
                    onChange={(event) => {
                        const selectedCompany = data.companies.find(company => company.id === +event.target.value);
                        if (selectedCompany) {
                            membersStore.setCompany('id', selectedCompany.id);
                            membersStore.setCompany('name', selectedCompany.name);
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
                        checked={membersStore.company.status === 'Работает'}
                        onChange={handleCompanyStatusChange}
                    />
                    Работает
                </label>
                <label>
                    <input
                        type="radio"
                        name="companyStatus"
                        value="Работала"
                        checked={membersStore.company.status === 'Работала'}
                        onChange={handleCompanyStatusChange}
                    />
                    Работала
                </label>
                <button type="button" onClick={handleAddCompany}>Добавить</button>
                <label>
                    Направление:
                </label>
                {membersStore.addedDirections.map((direction, index) => (
                    <div key={index}>
                        <span>{direction.name}</span> : <span>{direction.status}</span>
                    </div>
                ))}
                <select 
                    name="directions"
                    onChange={(event) => {
                        const selectedDirection = data.directions.find(direction => direction.id === +event.target.value);
                        if (selectedDirection) {
                            membersStore.setDirection('id', selectedDirection.id);
                            membersStore.setDirection('name', selectedDirection.name);
                        } else {
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
                        checked={membersStore.direction.status === 'Уже знает'}
                        onChange={handleDirectionStatusChange}
                    />
                    Уже знает
                </label>
                <label>
                    <input
                        type="radio"
                        name="directionStatus"
                        value="Хочет изучить"
                        checked={membersStore.direction.status === 'Хочет изучить'}
                        onChange={handleDirectionStatusChange}
                    />
                    Хочет изучить
                </label>
                <button type="button" onClick={handleAddDirections}>Добавить направление</button>
                <label>
                    Навыки:
                </label>
                {membersStore.addedSkills.map((skill, index) => (
                    <div key={index}>
                        <span>{skill.name}</span> : <span>{skill.status}</span>
                    </div>
                ))}
                <label>
                    <input
                        type="text"
                        name="name"
                        value={membersStore.skill.name}
                        onChange={handleSkillChange}
                    />
                </label>
                <label>
                    <input
                        type="radio"
                        name="skillStatus"
                        value="Уже знает"
                        checked={membersStore.skill.status === 'Уже знает'}
                        onChange={handleSkillStatusChange}
                    />
                    Уже знает
                </label>
                <label>
                    <input
                        type="radio"
                        name="skillStatus"
                        value="Хочет изучить"
                        checked={membersStore.skill.status === 'Хочет изучить'}
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
                            checked={membersStore.memberHobbies.includes(hobby.id)}
                            onChange={() => membersStore.toggleHobby(hobby.id)}
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
                    value={membersStore.member.quote}
                    onChange={handleInputChange}
                />
                <label>
                    Социальная сеть:
                </label>
                {membersStore.addedSocials.map((social, index) => (
                    <div key={index}>
                        <span>{social.type}</span> : <span>{social.link}</span>
                    </div>
                ))}
                <select
                    name="type"
                    value={membersStore.social.type}
                    onChange={(event) => {
                        membersStore.setSocial('type', event.target.value);
                    }}
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
                    value={membersStore.social.link}
                    onChange={(event) => {
                        membersStore.setSocial('link', event.target.value);
                    }}
                />
                </label>
                <button type="button" onClick={handleAddSocial}>Добавить соц.сеть</button>
                <label>
                    Фото:
                    <input
                        type="text"
                        placeholder="Введите URL фотографии"
                        name="photo"
                        value={membersStore.member.photo}
                        onChange={handlePhotoChange}
                    />
                </label>
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
                    Сохранить
                </button>
            </form>
        </main>
    );
});
export default Admin;