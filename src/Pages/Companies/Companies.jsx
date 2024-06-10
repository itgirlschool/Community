import { useParams } from "react-router-dom";
import "./Companies.scss";
import "../../style/vars.scss";
import CompanyPage from "../../Components/CompanyPage/CompanyPage";
import DataProvider from "../../Components/DataProvider/DataProvider";
import data from "../../../data.json";
import { findCompany, findMembersInCompany } from "../../helpers/findUsers";

function Companies() {
  const { id } = useParams();

  const selectedCompany = findCompany(data.companies, id);
  if (!selectedCompany) {
    console.log("Company not found for id:", id);
    return <div>Компания не найдена</div>;
  }
  const membersWorkingInCompany = findMembersInCompany(data.members, id);

  return (
    <DataProvider data={data}>
      {({ getMembersData }) => {
        const membersData = getMembersData();

        return (
          <main className="companiesAndDirections__container">
            <div
              className="companiesAndDirections__main"
              key={selectedCompany.id}
            >
              {selectedCompany.name}
            </div>
            <CompanyPage members={membersWorkingInCompany} />
          </main>
        );
      }}
    </DataProvider>
  );
}

export default Companies;
