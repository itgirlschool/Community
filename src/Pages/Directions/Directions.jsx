import { useParams } from "react-router-dom";
import "./Directions.scss";
import "../../style/vars.scss";
import CompanyPage from "../../Components/CompanyPage/CompanyPage";
import DataProvider from "../../Components/DataProvider/DataProvider";
import data from "../../../data.json";
import { findCompany, findMembersInDirection } from "../../helpers/findUsers";

function Directions() {
  const { id } = useParams();

  const selectedDirection = findCompany(data.directions, id);

  if (!selectedDirection) {
    console.log("Direction not found for id:", id);
    return <div>Направление не найдено</div>;
  }

  const membersWorkingInCompany = findMembersInDirection(data.members, id);

  return (
    <DataProvider data={data}>
      {({ getMembersData }) => {
        const membersData = getMembersData();

        return (
          <main className="companiesAndDirections__container">
            <div
              className="companiesAndDirections__main"
              key={selectedDirection.id}
            >
              {selectedDirection.name}
            </div>

            <CompanyPage members={membersWorkingInCompany} />
          </main>
        );
      }}
    </DataProvider>
  );
}

export default Directions;
