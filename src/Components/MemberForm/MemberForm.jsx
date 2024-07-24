import { observer } from 'mobx-react';
import FormInput from '../FormInput/FormInput.jsx';
import AddedItem from '../AddedItem/AddedItem.jsx';
import Photo from '../Photo/Photo.jsx';

const MemberForm = observer(({ membersStore, data }) => {
    // Обработчики и логика формы
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

    const handlePhotoChange = (photoUrl) => {
        membersStore.setPhoto(photoUrl);
    };

    // Функция для отмены редактирования
    const handleCancelEdit = () => {
        membersStore.cancelEditing();
        membersStore.resetMemberState();
    };
    
    // Обработчик отправки формы
    const handleSubmit = (event) => {
        event.preventDefault();
        membersStore.submitMember();
        event.target.reset();
    };
    return (
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
        {membersStore.addedCompanies.map((comp, index) => (
            <AddedItem
            key={index}
            name={comp.name}
            status={comp.status}
            onRemove={() => membersStore.removeCompany(index)}
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
        {membersStore.addedDirections.map((direction, index) => (
            <AddedItem
                key={index}
                name={direction.name}
                status={direction.status}
                onRemove={() => membersStore.removeDirection(index)}
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
            {membersStore.addedSkills.map((skill, index) => (
                <AddedItem
                    key={index}
                    name={skill.name}
                    status={skill.status}
                    onRemove={() => membersStore.removeSkill(index)}
                />
            ))}
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
        <Photo
            handlePhotoChange={(event) => handlePhotoChange(event.target.value)}
            currentPhotoUrl={membersStore.member.photo}
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
        {membersStore.editingMember && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                    >
                        Отменить
                    </button>
                )}
    </form>
    );
});

export default MemberForm;