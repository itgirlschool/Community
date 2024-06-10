import { Link } from "react-router-dom";
import "./Departments.scss";
import randomProperties from "../../helpers/RandomPosition";
import { randomIntFromInterval } from "../../helpers/commonFunctions";

const arrayOfPosition = [
  "position-left-start",
  "position-left-end",
  "position-center",
  "position-right-end",
  "position-right-start",
];
const arrayOfColors = ["violet300", "violet400", "violet500"];

const Departments = ({ arrayOfCompanies }) => {
  return (
    <div className="departments__items">
      {arrayOfCompanies.map((company, index) => {
        let position = randomProperties(arrayOfPosition);
        let color = randomProperties(arrayOfColors);
        let display = "";
        let size;
        let marginTop = `${randomIntFromInterval(0, 20)}px`;
        let marginBottom = `${randomIntFromInterval(0, 20)}px`;
        let marginLeft = `${randomIntFromInterval(0, 10)}px`;
        let marginRight = `${randomIntFromInterval(0, 10)}px`;

        if (company && company.name) {
          const companyName = company.name;

          if (companyName.length > 2) {
            size = "sizeXXS";
          }
          if (companyName.length > 5) {
            size = "sizeXS";
          }
          if (companyName.length > 7) {
            size = "sizeS";
          }
          if (companyName.length > 10) {
            size = "sizeM";
          }
          if (companyName.length > 14) {
            size = "sizeL";
          }
          if (companyName.length > 18) {
            size = "sizeXL";
          }

          return (
            <div className={`mainscreen__item ${position}`} key={index}>
              <Link
                to={`/companies/${company.id}`}
                className="mainscreen__company"
              >
                <div
                  className={`mainscreen__department  ${position} ${color} ${size} ${display}`}
                  style={{
                    marginTop: `${marginTop}`,
                    marginBottom: `${marginBottom}`,
                    marginLeft: `${marginLeft}`,
                    marginRight: `${marginRight}`,
                  }}
                >
                  {companyName}
                </div>
              </Link>
            </div>
          );
        } else {
          return (
            <div className={`mainscreen__item ${position}`} key={index}>
              <div className={`mainscreen__department ${position} empty`} />
            </div>
          );
        }
      })}
    </div>
  );
};
export default Departments;
