import data from "../../../data.json";
import MainDepartments from "../../Components/Main/MainDepartments/MainDepartments";
import MainProfessions from "../../Components/Main/MainProfessions/MainProfessions";
import MainUsers from "../../Components/Main/MainUsers/MainUsers";
import { randomIntFromInterval } from "../../helpers/commonFunctions";
import "./MainScreen.scss";

const MainScreen = () => {
  const members = data.members;

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const shuffledMembers = shuffleArray(members);
  const selectedMembers = shuffledMembers.slice(0, 10);
  const selectedMembersID = selectedMembers.map((item) => item.id);
  const uniqueCompaniesID = new Set(
    selectedMembers.flatMap((member) =>
      member.companies.map((company) => company.id)
    )
  );
  const uniqueCompanies = data.companies.map((company) => {
    {
      if (data.companies.id === uniqueCompaniesID.value) return company.name;
    }
  });

  let uniqueCompaniesPositions = [];
  for (let i = 0; i < uniqueCompanies.length; i++) {
    if (
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20)
    ) {
      uniqueCompaniesPositions = [...uniqueCompaniesPositions, ""];
    }
    uniqueCompaniesPositions = [
      ...uniqueCompaniesPositions,
      uniqueCompanies[i],
    ];
  }

  const uniqueDirectionsID = new Set(
    selectedMembers.flatMap((member) =>
      member.directions.map((direction) => direction.id)
    )
  );
  const uniqueDirections = data.directions.map((direction) => {
    {
      if (data.directions.id === uniqueDirectionsID.value)
        return direction.name;
    }
  });

  let uniqueDirectionsPositions = [];
  for (let i = 0; i < uniqueDirections.length; i++) {
    if (
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20) ||
      i === randomIntFromInterval(0, 20)
    ) {
      uniqueDirectionsPositions = [...uniqueDirectionsPositions, ""];
    }
    uniqueDirectionsPositions = [
      ...uniqueDirectionsPositions,
      uniqueDirections[i],
    ];
  }

  return (
    <main className="mainscreen__main">
      <MainDepartments arrayOfCompaniesPositions={uniqueCompaniesPositions} />
      <MainUsers arrayOfMembers={selectedMembersID} />
      <MainProfessions arrayOfProfessions={uniqueDirectionsPositions} />
    </main>
  );
};
export default MainScreen;
