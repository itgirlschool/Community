import { makeAutoObservable, toJS, action, runInAction } from 'mobx';
import { getDatabase, ref, set, get } from 'firebase/database';

class MembersStore {
    lastMemberId = 0;
    companies = [];
    directions = [];
    hobbies = [];
    member = {
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
    };
    
    company = {
        id: '',
        name: '',
        status: ''
    };
    
    direction = {
        id: '',
        name: '',
        status: ''
    };
    
    skill = {
        name: '',
        status: ''
    };

    hobby = {
        id: '',
        name: ''
    };

    social = {
        link: '',
        type: ''
    };
    
    addedCompanies = [];
    addedDirections = [];
    addedSkills = [];
    addedSocials = [];
    memberHobbies = [];

    constructor() {
        makeAutoObservable(this, {
            // Указываем, что editingMember не должен быть наблюдаемым
            editingMember: false,
            // Указываем, что fetchLastMemberId и addMember являются действиями
            fetchLastMemberId: action.bound,
            addMember: action.bound,
            // Можно также указать другие свойства и методы, если это необходимо
        });
    }

    setCompanies = (companies) => {
        this.companies = companies;
    }

    setDirections = (directions) => {
        this.directions = directions;
    }

    setMember = (name, value) => {
        this.member = { ...this.member, [name]: value };
    };
    
    setCompany = (name, value) => {
        this.company = { ...this.company, [name]: value };
    };

    setHobby = (name, value) => {
        this.hobby = { ...this.hobby, [name]: value };
    };

    addCompany = () => {
        if (this.company.id && this.company.status) {
        this.addedCompanies.push({ ...this.company });
        this.company = { id: '', name: '', status: '' };
        }
    };

    setDirection = (name, value) => {
        this.direction = { ...this.direction, [name]: value };
    };

    addDirection = () => {
        if (this.direction.id && this.direction.status) {
            this.addedDirections.push({ ...this.direction });
            this.direction = { id: '', name: '', status: '' };
        }
    };

    setSkill = (name, value) => {
        this.skill = { ...this.skill, [name]: value };
    };

    addSkill = () => {
        if (this.skill.name && this.skill.status) {
            this.addedSkills.push({ ...this.skill });
            this.skill = { name: '', status: '' };
        }
    };

    setSocial = (name, value) => {
        this.social = { ...this.social, [name]: value };
    };

    addSocial = () => {
        if (this.social.link && this.social.type) {
            this.addedSocials.push({ ...this.social });
            this.social = { link: '', type: '' };
        }
    };

    setPhoto = (photoUrl) => {
        this.member = { ...this.member, photo: photoUrl };
    };

    toggleHobby(hobbyId) {
        const isAlreadySelected = this.memberHobbies.includes(hobbyId);
        if (isAlreadySelected) {
            // Если хобби уже выбрано, удаляем его из массива
            this.memberHobbies = this.memberHobbies.filter(id => id !== hobbyId);
        } else {
            // Если хобби не выбрано, добавляем его в массив
            this.memberHobbies.push(hobbyId);
        }
    }
    
    removeCompany = (index) => {
        
        this.addedCompanies.splice(index, 1);
    };
    
    removeDirection = (index) => {
        this.addedDirections.splice(index, 1);
    };
    
    removeSkill = (index) => {
        this.addedSkills.splice(index, 1);
    };
    
    removeSocial = (index) => {
        this.addedSocials.splice(index, 1);
    };

    submitMember = () => {
        // Логика для обработки и отправки данных пользователя
        const member = {
            firstName: this.member.firstName,
            lastName: this.member.lastName,
            photo: this.member.photo,
            quote: this.member.quote,
            companies: toJS(this.addedCompanies),
            hobbies: toJS(this.memberHobbies),
            directions: toJS(this.addedDirections),
            social: toJS(this.addedSocials),
            skills: toJS(this.addedSkills),
        }
        console.log(member);
        if (this.editingMember) {
            this.updateMember(member);
        } else {
            this.addMember(member);
        }
    };

    // Метод для получения последнего ID пользователя из базы данных
    fetchLastMemberId = async () => {
        const database = getDatabase();
        const databaseRef = ref(database, 'members');
        const snapshot = await get(databaseRef);
        const membersArray = snapshot.val() ? Object.values(snapshot.val()) : [];
        const lastId = membersArray.length > 0 ? Math.max(...membersArray.map(member => Number(member.id))) : 0;
        this.setLastMemberId(lastId);
    };

    // Действие для установки последнего ID пользователя
    setLastMemberId = (newId) => {
        this.lastMemberId = newId;
    };

    addMember = async (memberData) => {
        const newId = this.lastMemberId + 1;
        this.setLastMemberId(newId);
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
    
    addCompanyToDatabase = async (companyData) => {
        const database = getDatabase();
        const newCompanyId = this.companies.length > 0 ? Math.max(...this.companies.map(c => Number(c.id))) + 1 : 1;
        const companyRef = ref(database, `companies/${newCompanyId}`);
        try {
            await set(companyRef, {
                id: newCompanyId,
                name: companyData.name
            });
            runInAction(() => {
                this.companies.push({
                    id: newCompanyId,
                    name: companyData.name
                });
                this.company = { id: '', name: '', status: '' }; // Сброс текущего состояния компании
            });
            console.log(`Компания добавлена с ID: ${newCompanyId}`);
        } catch (error) {
            console.error("Ошибка при добавлении компании: ", error);
        }
    };

    addDirectionToDatabase = async (directionData) => {
        const database = getDatabase();
        const newDirectionId = this.directions.length > 0 ? Math.max(...this.directions.map(d => Number(d.id))) + 1 : 1;
        const directionRef = ref(database, `directions/${newDirectionId}`);
        try {
            await set(directionRef, {
                ...directionData,
                id: newDirectionId
            });
            runInAction(() => {
                this.directions.push({
                    ...directionData,
                    id: newDirectionId
                });
                this.direction = { id: '', name: '', status: '' }; // Сброс текущего состояния направления
            });
            console.log(`Направление добавлено с ID: ${newDirectionId}`);
        } catch (error) {
            console.error("Ошибка при добавлении направления: ", error);
        }
    };
    loadHobbies = async () => {
        const database = getDatabase();
        const hobbiesRef = ref(database, 'hobbies');
        const snapshot = await get(hobbiesRef);
        const hobbiesData = snapshot.val() ? Object.values(snapshot.val()) : [];
        runInAction(() => {
            this.hobbies = hobbiesData;
        });
    };

    addHobbyToDatabase = async (hobbyData) => {
        await this.loadHobbies();
        const database = getDatabase(); 
        const newHobbyId = this.hobbies.length > 0 ? Math.max(...this.hobbies.map(h => Number(h.id))) + 1 : 1;
        const hobbyRef = ref(database, `hobbies/${newHobbyId}`);
        try {
            await set(hobbyRef, {
                ...hobbyData,
                id: newHobbyId
            });
            runInAction(() => {
                this.hobbies.push({
                    ...hobbyData,
                    id: newHobbyId
                });
                // Предполагается, что у хобби нет состояния, которое нужно сбросить после добавления
            });
            console.log(`Хобби добавлено с ID: ${newHobbyId}`);
        } catch (error) {
            console.error("Ошибка при добавлении хобби: ", error);
        }
    };

    setMemberData(member) { 
            const getNameById = (id, type) => {
                if (type === 'companies') {
                    return toJS(this.companies)[id.id].name || 'Неизвестная компания';
                } else if (type === 'directions') {
                    return toJS(this.directions)[id.id].name || 'Неизвестное направление';
                }
            };
    
        this.member = { ...member };
        this.addedCompanies = member.companies ? member.companies.map(companyId => ({ id: companyId.id, name: getNameById(companyId, 'companies') })) : [];
        this.addedDirections = member.directions ? member.directions.map(directionId => ({ id: directionId.id, name: getNameById(directionId, 'directions') })) : [];
        this.addedSkills = member.skills ? member.skills.map(skill => ({ ...skill })) : [];
        this.addedSocials = member.social ? member.social.map(social => ({ ...social })) : [];
        this.memberHobbies = member.hobbies ? [...member.hobbies] : [];
    }
    
    startEditing(member) {
        this.editingMember = member;
        this.setMemberData(member);
        // Также обновляем состояние компаний и направлений
        this.addedCompanies = member.companies.map(company => ({
            id: company.id,
            name: this.companies.find(c => c.id === company.id)?.name || 'Неизвестная компания',
            status: company.status
        }));
        this.addedDirections = member.directions.map(direction => ({
            id: direction.id,
            name: this.directions.find(d => d.id === direction.id)?.name || 'Неизвестное направление',
            status: direction.status
        }));
    }

    // Метод для обновления участника
    updateMember(updatedMember) {
        runInAction(async () => {
            const database = getDatabase();
            const databaseRef = ref(database, `members/${this.editingMember.id}`);
            try {
                await set(databaseRef, {
                    ...updatedMember,
                    id: this.editingMember.id
                });
                console.log(`Участник обновлен с ID: ${this.editingMember.id}`);
                this.editingMember = null;
            } catch (error) {
                console.error("Ошибка при обновлении участника: ", error);
            }
        });
    }

    // Метод для редактирования и сохранения данных компании в базе данных
    editCompanyFromList = async (company) => {
        const database = getDatabase();
        const companyRef = ref(database, `companies/${company.id}`);
        try {
            await set(companyRef, company); // Сохранение измененных данных компании
            console.log(`Данные компании с ID: ${company.id} обновлены`);
        } catch (error) {
            console.error("Ошибка при обновлении данных компании: ", error);
        }
    };

    // Метод для редактирования и сохранения данных направления в базе данных
    editDirectionFromList = async (direction) => {
        const database = getDatabase();
        const directionRef = ref(database, `directions/${direction.id}`);
        try {
            await set(directionRef, direction); // Сохранение измененных данных направления
            console.log(`Данные направления с ID: ${direction.id} обновлены`);
        } catch (error) {
            console.error("Ошибка при обновлении данных направления: ", error);
        }
    };

    // Метод для редактирования и сохранения данных хобби в базе данных
    editHobbyFromList = async (hobby) => {
        const database = getDatabase();
        const hobbyRef = ref(database, `hobbies/${hobby.id}`);
        try {
            await set(hobbyRef, hobby); // Сохранение измененных данных хобби
            console.log(`Данные хобби с ID: ${hobby.id} обновлены`);
        } catch (error) {
            console.error("Ошибка при обновлении данных хобби: ", error);
        }
    };

    // Метод для удаления участника
    removeMember = async (memberId) => {
        const database = getDatabase();
        const memberRef = ref(database, `members/${memberId}`);
        try {
            await set(memberRef, null); // Удаление участника из базы данных
            console.log(`Участник с ID: ${memberId} был удален`);
        } catch (error) {
            console.error("Ошибка при удалении участника: ", error);
        }
    };

    removeCompanyFromList = async (companyId) => {
        const database = getDatabase();
        const companyRef = ref(database, `companies/${companyId}`);
        try {
            await set(companyRef, null); // Удаление компании из базы данных
            console.log(`Компания с ID: ${companyId} была удалена`);
        } catch (error) {
            console.error("Ошибка при удалении компании: ", error);
        }
    };

    // Метод для удаления направления
    removeDirectionFromList = async (directionId) => {
        const database = getDatabase();
        const directionRef = ref(database, `directions/${directionId}`);
        try {
            await set(directionRef, null); // Удаление направления из базы данных
            console.log(`Направление с ID: ${directionId} было удалено`);
        } catch (error) {
            console.error("Ошибка при удалении направления: ", error);
        }
    };

    // Метод для удаления хобби
    removeHobbyFromList = async (hobbyId) => {
        const database = getDatabase();
        const hobbyRef = ref(database, `hobbies/${hobbyId}`);
        try {
            await set(hobbyRef, null); // Удаление хобби из базы данных
            console.log(`Хобби с ID: ${hobbyId} было удалено`);
        } catch (error) {
            console.error("Ошибка при удалении хобби: ", error);
        }
    };



}

export const membersStore = new MembersStore();