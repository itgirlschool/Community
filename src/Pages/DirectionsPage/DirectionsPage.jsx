import "./DirectionsPage.scss";
import "../SearchingPage/SearchingPage.scss";
import data from "../../../data.json";
import DirectionsComponent from "../../Components/DirectionsComponent/DirectionsComponent";
import { randomIntFromInterval } from "../../helpers/commonFunctions";
import { useState, useMemo } from "react";

const DirectionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
  const uniqueCompaniesID = new Set(
    selectedMembers.flatMap((member) =>
      member.companies.map((direction) => direction.id)
    )
  );
  const uniqueDirections = data.directions
    .filter((direction) => uniqueCompaniesID.has(direction.id))
    .map((direction) => ({ id: direction.id, name: direction.name }));

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

  const filteredDirections = useMemo(() =>
    uniqueDirectionsPositions.filter((direction) => {
      if (typeof direction === "object") {
        return direction.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
  );
  const handleSearchInputChange = (event) => {
    const inputText = event.target.value;
    setSearchTerm(inputText);
  };

  return (
    <main className="company__main">
      <div className="sp__container">
        <div className="sp__container-input">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder="Введите имя"
          />
          <span></span>
        </div>
      </div>
      <div className="sp__container-result">
        {filteredDirections.some((company) => company.id) ? null : (
          <p>Не найдено</p>
        )}
      </div>
      <DirectionsComponent arrayOfCompanies={filteredDirections} />
    </main>
  );
};
export default DirectionsPage;
