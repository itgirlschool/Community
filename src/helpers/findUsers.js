const findCompany = (array, idOfComp) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === +idOfComp) return array[i];
  }
};
const findMembersInCompany = (array, idOfComp) => {
  const members = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].companies.length; j++) {
      if (array[i].companies[j].id === +idOfComp) {
        members.push(array[i]);
      }
    }
  }
  return members;
};
const findMembersInDirection = (array, idOfComp) => {
  const members = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].directions.length; j++) {
      if (array[i].directions[j].id === +idOfComp) {
        members.push(array[i]);
      }
    }
  }
  return members;
};
export { findMembersInCompany, findCompany, findMembersInDirection };
