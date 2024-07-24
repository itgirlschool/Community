import { makeAutoObservable, toJS, runInAction } from 'mobx';
import { firebaseService } from './firebaseService';

class MembersStore {
    lastMemberId = 0;
    members=[];
    companies = [];
    directions = [];
    hobbies = [];
    lastHobbyId = 0;
    member = {
        companies: [],
        directions: [],
        firstName: '',
        hobbies: [],
        id: '',
        lastName: '',
        photo: 'https://firebasestorage.googleapis.com/v0/b/gonetwork-community-1add4.appspot.com/o/member.png?alt=media&token=c37df151-abbd-4bbf-9880-accd49790801',
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
        this.loadInitialData();
    };

    loadInitialData = async () => {
        await this.loadCompanies();
        await this.loadDirections();
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
    submitMember = async() => {
        // Логика для обработки и отправки данных пользователя
        if (!this.member.photo) {
            this.member.photo = await this.getPhotoUrlById(this.member.id);
        }
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
    
    async getNameById(id, type) {
        let items;
        if (type === 'companies') {
            await this.loadCompanies();
            items = toJS(this.companies);
        } else if (type === 'directions') {
            await this.loadDirections();
            items = toJS(this.directions);
        }
        const item = items.find(item => item.id === id);
        if (!item) {
            console.error(`Элемент с идентификатором ${id} не найден в ${type}.`);
            // Добавлено логирование для отладки
            console.log(`Доступные элементы в ${type}:`, items);
            return type === 'companies' ? 'Неизвестная компания' : 'Неизвестное направление';
        }
        return item.name; // Возвращаем имя найденного элемента
    }
    async setMemberData  (member) {
        this.member = { ...member };
        this.addedCompanies = [];
        this.addedDirections = [];
        this.addedSkills = member.skills ? member.skills.map(skill => ({ ...skill })) : [];
        this.addedSocials = member.social ? member.social.map(social => ({ ...social })) : [];
        this.memberHobbies = member.hobbies ? [...member.hobbies] : [];
        
        if (member.companies && member.companies.length > 0) {
            for (const company of member.companies) {
                const name = await this.getNameById(company.id, 'companies');
                runInAction(() => {
                    const isExisting = this.addedCompanies.some(comp => comp.id === company.id);
                    if (!isExisting && name !== 'Неизвестная компания') {
                        this.addedCompanies.push({ id: company.id, name });
                    }
                });
            }
        }
    
        if (member.directions && member.directions.length > 0) {
            for (const direction of member.directions) {
                const name = await this.getNameById(direction.id, 'directions');
                runInAction(() => {
                    const isExisting = this.addedDirections.some(dir => dir.id === direction.id);
                    if (!isExisting && name !== 'Неизвестное направление') {
                        this.addedDirections.push({ id: direction.id, name });
                    }
                });
            }
        }
        if (member.photo) {
            const photoUrl = await this.getPhotoUrlById(member.id);
            runInAction(() => {
                this.member.photo = photoUrl;
            });
        }
};
    startEditing(member) {
        this.resetMemberState(); // Сброс состояния перед началом редактирования
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
    async loadCompanies() {
        if (this.companies.length === 0) {
            const companiesData = await firebaseService.fetchData('companies');
            runInAction(() => {
                this.companies = companiesData;
            });
        }
    }
    setCompanies = (companies) => {
        this.companies = companies;
    };
    setCompany = (name, value) => {
        this.company = { ...this.company, [name]: value };
    };
    addCompany = () => {
        // Проверяем, существует ли уже компания с таким ID в addedCompanies
        const isExisting = this.addedCompanies.some(comp => comp.id === this.company.id);
        if (!isExisting && this.company.id && this.company.status) {
            this.addedCompanies.push({ ...this.company });
            // Сброс после добавления
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
    async loadDirections() {
        if (this.directions.length === 0) {
            const directionsData = await firebaseService.fetchData('directions');
            runInAction(() => {
                this.directions = directionsData;
            });
        }
    }
    setDirections = (directions) => {
        this.directions = directions;
    };
    setDirection = (name, value) => {
        this.direction = { ...this.direction, [name]: value };
    };
    addDirection = () => {
        // Проверяем, существует ли уже направление с таким ID в addedDirections
        const isExisting = this.addedDirections.some(dir => dir.id === this.direction.id);
        if (!isExisting && this.direction.id && this.direction.status) {
            this.addedDirections.push({ ...this.direction });
            // Сброс после добавления
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
    // Метод для получения последнего ID хобби
    fetchLastHobbyId = async () => {
        const hobbiesData = await firebaseService.fetchData('hobbies');
        const lastId = hobbiesData.length > 0 ? Math.max(...hobbiesData.map(hobby => Number(hobby.id))) : 0;
        this.lastHobbyId = lastId; // Сохраняем последний ID в свойство класса
    };

    // Метод для добавления нового хобби в базу данных
    addHobbyToDatabase = async (hobbyData) => {
        await this.fetchLastHobbyId(); // Обновляем lastHobbyId перед добавлением нового хобби
        const newHobbyId = this.lastHobbyId + 1;
        const newHobby = {
            id: newHobbyId,
            name: hobbyData.name
        };
        const path = `hobbies/${newHobbyId}`;
        await firebaseService.addData(path, newHobby);
        runInAction(() => {
            this.hobbies.push(newHobby);
            this.hobby = { id: '', name: '' }; // Сброс текущего состояния хобби
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
        console.log(photoUrl);
        this.member = { ...this.member, photo: photoUrl };
    };
    async getPhotoUrlById(memberId) {
        try {
            const memberData = await firebaseService.fetchData(`members/${memberId}`);
            if (memberData) {
                return memberData[6];
            } else {
                console.log('Фотография не найдена, возвращается URL изображения по умолчанию.');
                return 'https://firebasestorage.googleapis.com/v0/b/gonetwork-community-1add4.appspot.com/o/member.png?alt=media&token=c37df151-abbd-4bbf-9880-accd49790801';
            }
        } catch (error) {
            console.error('Ошибка при получении URL фотографии:', error);
            }
    }
}

export const membersStore = new MembersStore();