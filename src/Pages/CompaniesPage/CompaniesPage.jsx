import "./CompaniesPage.scss";
import "../SearchingPage/SearchingPage.scss";
import data from "../../../data.json";
import Departments from "../../Components/Departments/Departments";
import { randomIntFromInterval } from "../../helpers/commonFunctions";
import { useState, useMemo } from "react";

const CompaniesPage = () => {
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
      member.companies.map((company) => company.id)
    )
  );
  const uniqueCompanies = data.companies
    .filter((company) => uniqueCompaniesID.has(company.id))
    .map((company) => ({ id: company.id, name: company.name }));

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

  const filteredCompanies = useMemo(() =>
    uniqueCompaniesPositions.filter((company) => {
      if (typeof company === "object") {
        return company.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
  );
  console.log(filteredCompanies);
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
        {filteredCompanies.some((company) => company.id) ? null : (
          <p>Не найдено</p>
        )}
      </div>
      <Departments arrayOfCompanies={filteredCompanies} />
    </main>
  );
};
export default CompaniesPage;
