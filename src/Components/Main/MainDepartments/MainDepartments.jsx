import { NavLink } from "react-router-dom";
import "../../../Pages/Main/MainScreen.scss";
import "./MainDepartments.scss";
import randomProperties from "../../../helpers/RandomPosition";
import data from "../../../../data.json";
import { randomIntFromInterval } from "../../../helpers/commonFunctions";

const arrayOfPosition = [
  "position-left-start",
  "position-left-end",
  "position-center",
  "position-right-end",
  "position-right-start",
];
const arrayOfColors = ["violet300", "violet400", "violet500"];
const findId = (companyName) => {
  for (let i = 0; i < data.companies.length; i++) {
    if (data.companies[i].name === companyName) {
      return data.companies[i].id;
    }
  }
};

const MainDepartments = ({ arrayOfCompaniesPositions, handleCompanyClick }) => {
  return (
    <div className="mainscreen-main__items">
      {arrayOfCompaniesPositions.map((company, index) => {
        let position = randomProperties(arrayOfPosition);
        let color = randomProperties(arrayOfColors);
        let display = "";
        let size;
        let marginTop = `${randomIntFromInterval(0, 20)}px`;
        let marginBottom = `${randomIntFromInterval(0, 20)}px`;
        let marginLeft = `${randomIntFromInterval(0, 10)}px`;
        let marginRight = `${randomIntFromInterval(0, 10)}px`;
        const id = findId(company);

        if (company.length === 0) {
          display = "display";
          size = "sizeNone";
        }
        if (company.length > 2) {
          size = "sizeXXS";
        }
        if (company.length > 5) {
          size = "sizeXS";
        }
        if (company.length > 7) {
          size = "sizeS";
        }
        if (company.length > 10) {
          size = "sizeM";
        }
        if (company.length > 14) {
          size = "sizeL";
        }
        if (company.length > 18) {
          size = "sizeXL";
        }

        return (
          <NavLink
            key={index}
            className={`mainscreen__department  ${position} ${color} ${size} ${display}`}
            style={{ marginTop, marginBottom, marginLeft, marginRight }}
            to={`/companies/${id}`}
          >
            {company.split("/")[0]}
          </NavLink>
        );
      })}
    </div>
  );
};

export default MainDepartments;
