import React, { useState, useEffect } from 'react';
import data from '../../../data.json';

const UserRandomMain = () => {
  const members = data.members;
  const companies = data.companies;
  const directions = data.directions;

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedDirections, setSelectedDirections] = useState([]);

  useEffect(() => {
    const shuffledMembers = shuffleArray(members);
    const selectedMembersArray = shuffledMembers.slice(0, 10);

    setSelectedMembers(selectedMembersArray);

    const uniqueCompanies = new Set(selectedMembersArray.flatMap(member => member.companies.map(company => company.id)));
    setSelectedCompanies(companies.filter(company => uniqueCompanies.has(company.id)));

    const uniqueDirections = new Set(selectedMembersArray.flatMap(member => member.directions.map(direction => direction.id)));
    setSelectedDirections(directions.filter(direction => uniqueDirections.has(direction.id)));
  }, []);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  return (
    <div>
      <div>
        <h2>Выбранные участники:</h2>
        {selectedMembers.map(member => (
          <div key={member.id}>
            <p>{member.firstName} {member.lastName}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Уникальные компании:</h2>
        {selectedCompanies.map(company => (
          <div key={company.id}>{company.name}</div>
        ))}
      </div>

      <div>
        <h2>Уникальные направления:</h2>
        {selectedDirections.map(direction => (
          <div key={direction.id}>{direction.name}</div>
        ))}
      </div>
    </div>
  );
};

export default UserRandomMain;