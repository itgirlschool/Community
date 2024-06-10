import data from "./data.json";

function getCompanyName(companyId) {
    const company = data.companies.find(company => company.id === companyId);
    return company ? company.name : 'Unknown Company';
}

function getDirectionName(directionId) {
    const direction = data.directions.find(direction => direction.id === directionId);
    return direction ? direction.name : 'Unknown Direction';
}

function getRandomIndexArray(length) {
    const indexes = Array.from({ length }, (_, index) => index);
    for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    return indexes.slice(0, 10);
}

function getRandomData() {
    const randomMembers = [];
    const uniqueMemberIds = new Set();
    const companies = new Map();
    const directions = new Map();
    const randomIndexes = getRandomIndexArray(data.members.length);

    randomIndexes.forEach(randomIndex => {
        const member = data.members[randomIndex];

        if (!uniqueMemberIds.has(member.id)) {
            randomMembers.push(member);
            uniqueMemberIds.add(member.id);

            member.companies.forEach(company => companies.set(company.id, getCompanyName(company.id)));
            member.directions.forEach(direction => directions.set(direction.id, getDirectionName(direction.id)));
        }
    });

    const companiesArray = Array.from(companies, ([id, name]) => ({ id, name }));
    const directionsArray = Array.from(directions, ([id, name]) => ({ id, name }));

    return {
        randomMembers,
        companies: companiesArray,
        directions: directionsArray
    };
}

export default getRandomData;