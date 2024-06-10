import { useState } from "react";
import data from "../../../data.json";

const DataProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);

  const handleCompanyClick = (companyId) => {
    setSelectedCompany(companyId);
  };

  const handleDirectionClick = (directionId) => {
    setSelectedDirection(directionId);
  };

  const getMembersData = () => {
    if (selectedCompany) {
      const companyMembers = data.members.filter((member) => {
        return member.companies.some(
          (company) => company.id === selectedCompany.id
        );
      });

      return {
        companyName: selectedCompany,
        membersData: companyMembers,
      };
    }

    if (selectedDirection) {
      const directionMembers = data.members.filter((member) => {
        return member.directions.some(
          (direction) => direction.id === selectedDirection
        );
      });

      return {
        directionName: selectedDirection,
        membersData: directionMembers,
      };
    }

    return null;
  };

  return (
    <>
      {children({
        handleCompanyClick,
        handleDirectionClick,
        selectedCompany,
        selectedDirection,
        getMembersData,
      })}
    </>
  );
};

export default DataProvider;
