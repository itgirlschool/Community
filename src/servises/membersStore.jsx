import { makeAutoObservable, toJS, action, runInAction } from 'mobx';
import { getDatabase, ref, set, get } from 'firebase/database';

class MembersStore {
    lastMemberId = 0;
    companies = [];
    directions = [];
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
}

export const membersStore = new MembersStore();