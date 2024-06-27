import { makeAutoObservable, toJS, action, runInAction } from 'mobx';
import { firebaseService } from './firebaseService';

class MembersStore {
    lastMemberId = 0;
    members=[];
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
    
    isCompanyInputFilled = false;
    isDirectionInputFilled = false;
    isHobbyInputFilled = false;

    constructor() {
        makeAutoObservable(this, {
            editingMember: false,
        });
    };
    
    //УЧАСТНИКИ
    // Функция для получения последнего ID участника
    fetchLastMemberId = async () => {
        const membersData = await firebaseService.fetchData('members');
        const lastId = membersData.length > 0 ? Math.max(...membersData.map(member => Number(member.id))) : 0;
        this.setLastMemberId(lastId);
    };
    // Действие для установки последнего ID пользователя
    setLastMemberId = (newId) => {
        this.lastMemberId = newId;
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
        };
        console.log(member);
        
        if (this.editingMember) {
            this.updateMember(member);
        } else {
            this.addMember(member);
        }
        // Сброс состояния после отправки
        this.resetMemberState();
    };
    setMember = (name, value) => {
        this.member = { ...this.member, [name]: value };
    };
    addMember = async (memberData) => {
        try {
            await this.fetchLastMemberId();
            const newMemberId = this.lastMemberId + 1;
            const newMember = { ...memberData, id: newMemberId };
            const path = `members/${newMemberId}`;
            await firebaseService.addData(path, newMember);
            runInAction(() => {
                this.members.push(newMember);
                this.resetMemberState();
            });
            console.log(`Участник добавлен с ID: ${newMemberId}`);
        } catch (error) {
            console.error("Ошибка при добавлении участника: ", error);
        }
    };
    setMemberData(member) {
        const getNameById = (id, type) => {
            let items;
            if (type === 'companies') {
                items = toJS(this.companies);
            } else if (type === 'directions') {
                items = toJS(this.directions);
            };
            // Используйте метод find для поиска элемента по id
            const item = items.find(item => item.id === id.id);
            if (!item) {
                console.error(`Элемент с идентификатором ${id.id} не найден в ${type}.`);
                // Удаление элемента из списка участника
                if (type === 'companies') {
                    this.removeCompanyFromMember(id.id);
                } else if (type === 'directions') {
                    this.removeDirectionFromMember(id.id);
                }
                return type === 'companies' ? 'Неизвестная компания' : 'Неизвестное направление';
            };
            return item.name;
        };
        this.member = { ...member };
        this.addedCompanies = member.companies ? member.companies.map(companyId => ({ id: companyId.id, name: getNameById(companyId, 'companies') })) : [];
        this.addedDirections = member.directions ? member.directions.map(directionId => ({ id: directionId.id, name: getNameById(directionId, 'directions') })) : [];
        this.addedSkills = member.skills ? member.skills.map(skill => ({ ...skill })) : [];
        this.addedSocials = member.social ? member.social.map(social => ({ ...social })) : [];
        this.memberHobbies = member.hobbies ? [...member.hobbies] : [];
    };
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
    };
    cancelEditing() {
        this.editingMember = false;
    };
    // Метод для обновления участника
    updateMember = async (updatedMember) => {
        const memberPath = `members/${this.editingMember.id}`;
        await firebaseService.updateData(memberPath, {
            ...updatedMember,
            id: this.editingMember.id
        });
    };
    // Метод для удаления участника
    removeMember = async (memberId) => {
        const memberPath = `members/${memberId}`;
        await firebaseService.removeData(memberPath);
    };
    resetMemberState = () => {
        this.member = {
            firstName: '',
            lastName: '',
            photo: '',
            quote: '',
            companies: [],
            directions: [],
            hobbies: [],
            skills: [],
            social: [],
        };
        this.addedCompanies = [];
        this.addedDirections = [];
        this.addedSkills = [];
        this.memberHobbies = [];
        this.addedSocials = [];
    };
    
    //КОМПАНИИ
    setCompanies = (companies) => {
        this.companies = companies;
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
    removeCompany = (index) => {
        
        this.addedCompanies.splice(index, 1);
    };
    removeCompanyFromMember(companyId) {
        this.member.companies = this.member.companies.filter(comp => comp.id !== companyId);
    };
    addCompanyToDatabase = async (companyData) => {
        const newCompanyId = this.companies.length > 0 ? Math.max(...this.companies.map(c => Number(c.id))) + 1 : 1;
        const newCompany = {
            id: newCompanyId,
            name: companyData.name
        };
        const path = `companies/${newCompanyId}`;
        await firebaseService.addData(path, newCompany);
        runInAction(() => {
            this.companies.push(newCompany);
            this.company = { id: '', name: '', status: '' }; // Сброс текущего состояния компании
        });
        console.log(`Компания добавлена с ID: ${newCompanyId}`);
    };
    setCompanyInputFilled = (isFilled) => {
        this.isCompanyInputFilled = isFilled;
    };
    // Метод для редактирования и сохранения данных компании в базе данных
    editCompanyFromList = async (company) => {
        const companyPath = `companies/${company.id}`;
        await firebaseService.updateData(companyPath, company);
    };
    // Метод для удаления компании из списка
    removeCompanyFromList = async (companyId) => {
        const companyPath = `companies/${companyId}`;
        await firebaseService.removeData(companyPath);
    };

    //НАПРАВЛЕНИЯ
    setDirections = (directions) => {
        this.directions = directions;
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
    removeDirection = (index) => {
        this.addedDirections.splice(index, 1);
    };
    removeDirectionFromMember(directionId) {
        this.member.directions = this.member.directions.filter(dir => dir.id !== directionId);
    };
    addDirectionToDatabase = async (directionData) => {
        const newDirectionId = this.directions.length > 0 ? Math.max(...this.directions.map(d => Number(d.id))) + 1 : 1;
        const newDirection = {
            id: newDirectionId,
            name: directionData.name
        };
        const path = `directions/${newDirectionId}`;
        await firebaseService.addData(path, newDirection);
        runInAction(() => {
        this.directions.push(newDirection);
        this.direction = { id: '', name: '', status: '' };
    });
        console.log(`Направление добавлено с ID: ${newDirectionId}`);
    };
    setDirectionInputFilled = (isFilled) => {
        this.isDirectionInputFilled = isFilled;
    };
    // Метод для редактирования и сохранения данных направления в базе данных
    editDirectionFromList = async (direction) => {
        const directionPath = `directions/${direction.id}`;
        await firebaseService.updateData(directionPath, direction);
    };
    // Метод для удаления направления
    removeDirectionFromList = async (directionId) => {
        const directionPath = `directions/${directionId}`;
        await firebaseService.removeData(directionPath);
    };
    
    //НАВЫКИ
    setSkill = (name, value) => {
        this.skill = { ...this.skill, [name]: value };
    };
    addSkill = () => {
        if (this.skill.name && this.skill.status) {
            this.addedSkills.push({ ...this.skill });
            this.skill = { name: '', status: '' };
        }
    };
    removeSkill = (index) => {
        this.addedSkills.splice(index, 1);
    };

    //ХОББИ
    setHobbies = (hobbies) => {
        this.hobbies = hobbies;
    }
    setHobby = (name, value) => {
        this.hobby = { ...this.hobby, [name]: value };
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
    loadHobbies = async () => {
        const hobbiesData = await firebaseService.fetchData('hobbies');
        runInAction(() => {
            this.hobbies = hobbiesData.map(hobby => hobby.val());
        });
    };
    addHobbyToDatabase = async (hobbyData) => {
        const newHobbyId = this.hobbies.length > 0 ? Math.max(...this.hobbies.map(h => Number(h.id))) + 1 : 1;
        const newHobby = {
            id: newHobbyId,
            name: hobbyData.name
        };
        const path = `hobbies/${newHobbyId}`;
        await firebaseService.addData(path, newHobby);
        runInAction(() => {
            this.hobbies.push(newHobby);
            this.hobby = { id: '', name: '' };
        });
        
        console.log(`Хобби добавлено с ID: ${newHobbyId}`);
    };
    setHobbyInputFilled = (isFilled) => {
        this.isHobbyInputFilled = isFilled;
    };
    // Метод для редактирования и сохранения данных хобби в базе данных
    editHobbyFromList = async (hobby) => {
        const hobbyPath = `hobbies/${hobby.id}`;
        await firebaseService.updateData(hobbyPath, hobby);
    };
    // Метод для удаления хобби
    removeHobbyFromList = async (hobbyId) => {
        const hobbyPath = `hobbies/${hobbyId}`;
        await firebaseService.removeData(hobbyPath);
    };

    //СОЦ.СЕТИ
    setSocial = (name, value) => {
        this.social = { ...this.social, [name]: value };
    };
    addSocial = () => {
        if (this.social.link && this.social.type) {
            this.addedSocials.push({ ...this.social });
            this.social = { link: '', type: '' };
        }
    };
    removeSocial = (index) => {
        this.addedSocials.splice(index, 1);
    };

    //ФОТО
    setPhoto = (photoUrl) => {
        this.member = { ...this.member, photo: photoUrl };
    };
}

export const membersStore = new MembersStore();