import { useState, useEffect, useMemo } from 'react';
import userData from '../../../data.json';
import './SearchingPage.scss';
import UserComponent from '../../Components/UserComponent/UserComponent';
import generateUniquePositions from "../../helpers/generateUniquePositions.js";

export default function SearchingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchMessage, setSearchMessage] = useState('');
    const [positions, setPositions] = useState([]);
    const [isIntersectingThreshold, setIsIntersectingThreshold] = useState({ top: 0, left: 0 });
    const [activeUser, setActiveUser] = useState(null);

    const users = useMemo(() => userData.members, []);
    const allPositions = useMemo(() => generateUniquePositions(isIntersectingThreshold, users), [isIntersectingThreshold, users]);

    useEffect(() => {
        if (searchTerm.length >= 3 && searchTerm.length <= 5) {
            const filteredUsers = users.filter((user) =>
                (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setSearchResults(filteredUsers);
            setSearchMessage('');
        } else {
            const filteredUsers = users.filter((user) =>
                (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setSearchResults(filteredUsers);
            if (searchTerm.length > 5 && filteredUsers.length === 0) {
                setSearchMessage('Пользователь не найден');
            } else {
                setSearchMessage('');
            }
        }
    }, [searchTerm, users]);

    useEffect(() => {
        const updateIntersectingThreshold = () => {
            const windowWidth = window.innerWidth;
            let newThreshold;
            if (windowWidth >= 768 && windowWidth < 1024) {
                newThreshold = { top: 4, left: 8.9 };
            } else if (windowWidth >= 1024 && windowWidth <= 1366) {
                newThreshold = { top: 3.9, left: 8.8 };
            } else if (windowWidth >= 1366 && windowWidth <= 1920) {
                newThreshold = { top: 4, left: 8.8 };
            } else if (windowWidth > 1920) {
                newThreshold = { top: 5, left: 9 };
            }
            setIsIntersectingThreshold(newThreshold);
        };

        updateIntersectingThreshold();

        const handleResize = () => {
            updateIntersectingThreshold();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setPositions(generateUniquePositions(isIntersectingThreshold, searchResults));
    }, [searchResults]);

    const handleSearchInputChange = (event) => {
        const inputText = event.target.value;
        setSearchTerm(inputText);
    }

    const calculateContainerHeight = () => {
        const windowWidth = window.innerWidth;
        let baseHeight;
        let perUserHeight;
        if (windowWidth >= 768 && windowWidth < 1024) {
            baseHeight = 47;
            perUserHeight = 0.7;
        } else if (windowWidth >= 1024 && windowWidth <= 1366) {
            baseHeight = 58;
            perUserHeight = 1;
        } else if (windowWidth >= 1366 && windowWidth <= 1920) {
            baseHeight = 68;
            perUserHeight = 1.2;
        } else if (windowWidth > 1920) {
            baseHeight = 75;
            perUserHeight = 1.2;
        }
        return `${baseHeight + searchResults.length * perUserHeight}em`;
    };

    const handleUserHoverEnter = (userName) => {
        setActiveUser(userName);
    };

    const handleUserHoverLeave = () => {
        setActiveUser(null);
    };

    return (
        <div className='sp__container'>
            <div className='sp__container-input'>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder='Введите имя'
                /><span></span>
            </div>
            <div className='sp__container-result'>
                {searchMessage && (<p>{searchMessage}</p>)}
                {searchResults.length > 0 && (
                    <div className='sp__container-result-users' style={{ height: calculateContainerHeight(searchResults.length) }}>
                        {searchResults.map((user, index) => (
                            <div
                                key={user.id}
                                className="sp__container-result-users-user-wrapper"
                                style={{
                                    top: allPositions[users.indexOf(user)] ? allPositions[users.indexOf(user)].top : '0%',
                                    left: allPositions[users.indexOf(user)] ? allPositions[users.indexOf(user)].left : '0%',
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
                )}
            </div>
        </div>
    )
}