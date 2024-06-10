import "./MainUsers.scss";
import "../../../Pages/Main/MainScreen.scss";
import { useState, useEffect } from "react";
import UserComponent from "../../UserComponent/UserComponent";
import data from "../../../../data.json";

const arrayOfUsers = data.members;

const MainUsers = ({ arrayOfMembers }) => {
  const [activeUser, setActiveUser] = useState(null);
  const handleUserHoverEnter = (userName) => {
    setActiveUser(userName);
  };

  const handleUserHoverLeave = () => {
    setActiveUser(null);
  };
  const [positions, setPositions] = useState([]);
  const [isIntersectingThreshold, setIsIntersectingThreshold] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const updateIntersectingThreshold = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsIntersectingThreshold({ top: 18, left: 21 });
      } else if (window.innerWidth >= 1024 && window.innerWidth <= 1366) {
        setIsIntersectingThreshold({ top: 15, left: 18 });
      } else if (window.innerWidth >= 1366 && window.innerWidth <= 1920) {
        setIsIntersectingThreshold({ top: 19, left: 20 });
      }
    };

    updateIntersectingThreshold();

    const handleResize = () => {
      updateIntersectingThreshold();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const maxAttemptsPerElement = 35;
    const maxElements = 10;
    const maxAttempts = maxAttemptsPerElement * maxElements;

    const generateUniquePositions = (maxAttempts) => {
      const newPositions = [];
      for (let i = 0; i < maxElements; i++) {
        let attempts = 0;
        let newPosition;
        let isIntersecting;
        do {
          newPosition = {
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 70}%`,
          };
          isIntersecting = newPositions.some(
            ({ top, left }) =>
              Math.abs(parseFloat(top) - parseFloat(newPosition.top)) <
                isIntersectingThreshold.top &&
              Math.abs(parseFloat(left) - parseFloat(newPosition.left)) <
                isIntersectingThreshold.left
          );
          attempts++;
        } while (isIntersecting && attempts < maxAttempts);
        if (!isIntersecting) {
          newPositions.push(newPosition);
        }
      }
      return newPositions;
    };

    const initialPositions = generateUniquePositions(maxAttempts);
    setPositions(initialPositions);
  }, [isIntersectingThreshold]);

  return (
    <div className="mainscreen-main__workers">
      {arrayOfUsers.map((user, index) => (
        <div
          key={user.id}
          className="sp__container-result-users-user"
          style={{
            top: positions[index] ? positions[index].top : "0%",
            left: positions[index] ? positions[index].left : "0%",
          }}
        >
          <UserComponent
            user={user}
            className="sp__container-result-users-user"
            onUserHoverEnter={handleUserHoverEnter}
            onUserHoverLeave={handleUserHoverLeave}
            isActive={activeUser === `${user.firstName} ${user.lastName}`}
          />
        </div>
      ))}
    </div>
  );
};
export default MainUsers;
