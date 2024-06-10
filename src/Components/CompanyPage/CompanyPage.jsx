import "./CompanyPage.scss";
import "../../style/vars.scss";
import { generatePosition } from "../../helpers/commonFunctions";
import UserComponent from "../UserComponent/UserComponent";
import { useState, useMemo } from "react";

export default function CompanyPage({ members }) {
  const [activeUser, setActiveUser] = useState(null);
  const handleUserHoverEnter = (userName) => {
    setActiveUser(userName);
  };

  const handleUserHoverLeave = () => {
    setActiveUser(null);
  };

  const positions = [];
  return (
    <div className="companiesAndDirections__users">
      {members.map((member, index) => {
        let position = generatePosition(positions, 40);
        const newposition = useMemo(() => position, []);
        return (
          <div
            key={index}
            className="sp__container-result-users-user-wrapper"
            style={{
              position: "absolute",
              top: `${newposition[1]}vh`,
              left: `${newposition[0]}vw`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <UserComponent
              className="sp__container-result-users-user"
              onUserHoverEnter={handleUserHoverEnter}
              onUserHoverLeave={handleUserHoverLeave}
              isActive={activeUser === `${member.firstName} ${member.lastName}`}
              user={member}
            />
          </div>
        );
      })}
    </div>
  );
}
