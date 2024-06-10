import { NavLink } from "react-router-dom";
import "../../../Pages/Main/MainScreen.scss";
import "./MainProfessions.scss";
import randomProperties from "../../../helpers/RandomPosition";
import { randomIntFromInterval } from "../../../helpers/commonFunctions";
import data from "../../../../data.json";

const arrayOfPosition = [
  "position-left-start",
  "position-left-end",
  "position-center",
  "position-right-end",
  "position-right-start",
];

const arrayOfColors = ["pink100", "pink200", "pink400", "pink500"];
const findId = (directionName) => {
  for (let i = 0; i < data.directions.length; i++) {
    if (data.directions[i].name === directionName) {
      return data.directions[i].id;
    }
  }
};
const MainProfessions = ({ arrayOfProfessions, handleDirectionClick }) => {
  return (
    <div className="mainscreen-main__items">
      {arrayOfProfessions.map((direction, index) => {
        let position = randomProperties(arrayOfPosition);
        let color = randomProperties(arrayOfColors);
        let display = "";
        let size;
        let marginTop = `${randomIntFromInterval(0, 20)}px`;
        let marginBottom = `${randomIntFromInterval(0, 20)}px`;
        let marginLeft = `${randomIntFromInterval(0, 10)}px`;
        let marginRight = `${randomIntFromInterval(0, 10)}px`;
        const id = findId(direction);

        if (direction.length === 0) {
          display = "display";
          size = "sizeNone";
        }
        if (direction.length > 2) {
          size = "sizeXXS";
        }
        if (direction.length > 7) {
          size = "sizeXS";
        }
        if (direction.length > 9) {
          size = "sizeS";
        }
        if (direction.length > 11) {
          size = "sizeM";
        }
        if (direction.length > 12) {
          size = "sizeL";
        }
        if (direction.length > 18) {
          size = "sizeXL";
        }

        return (
          <NavLink
            className={`mainscreen__profession ${position} ${color} ${size}`}
            style={{ marginTop, marginBottom, marginLeft, marginRight }}
            to={`/professions/${id}`}
            key={index}
          >
            {direction.split("/")[0]}
          </NavLink>
        );
      })}
    </div>
  );
};

export default MainProfessions;
