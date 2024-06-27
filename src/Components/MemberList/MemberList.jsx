import React from 'react';
import { observer } from 'mobx-react';

const MemberList = observer(({ data, membersStore }) => {
    // Функция для прокрутки страницы вверх
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Для плавной прокрутки
        });
    };
    return (
        <div className="member-container">
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
                    <div className='buttons-container'>
                        <button onClick={() => {
                                membersStore.startEditing(member);
                                scrollToTop();
                        }}>
                            Редактировать информацию
                        </button>
                        <button onClick={() => membersStore.removeMember(member.id)}>Удалить участника</button>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default MemberList;