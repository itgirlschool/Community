import React, { useState } from 'react';
import userData from '../../../data.json';
import './UserComponent.scss';
import UserModal from '../UserModal/UserModal';
import lineHover from '../../assets/images/vectors/lineHover.svg';

export default function UserComponent({ user, onUserHoverEnter, onUserHoverLeave, isActive }) {
  const { firstName, lastName, photo, hobbies } = user;
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onUserHoverEnter) {
      onUserHoverEnter(`${firstName} ${lastName}`);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onUserHoverLeave) {
      onUserHoverLeave();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsHovered(false);
  };

  const getHobbyNames = (hobbies) => {
    const hobbyNames = hobbies.map((hobbyId) => {
      const foundHobby = userData.hobbies.find((h) => h.id === hobbyId);
      return foundHobby ? foundHobby.name : '';
    });
    return hobbyNames.join(', ');
  };

  return (
    <div className="user-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="user-photo-container"
        style={{ zIndex: isActive ? 3 : 1 }}
        onClick={openModal}
      >
        <img
          src={photo}
          alt={`${firstName} ${lastName}`}
          className={`user-photo ${isHovered ? 'hovered' : ''}`}
        />
      </div>
      {isHovered && (
        <div className="user-info">
          <div className='user-info__text'>
            <p className='text-name'>{`${firstName} ${lastName}`}</p>
            <p className='text-hobbies'>{getHobbyNames(hobbies)}</p>
          </div>
          <div className="user-info-bgpic">
            <img src={lineHover} alt="lineHover" />
          </div>
        </div>
      )}
      {isModalOpen && (
        <UserModal
          user={user}
          userData={userData}
          onClose={() => setIsModalOpen(false)}
          getHobbyNames={getHobbyNames}
          hobbies={hobbies}
        />
      )}
    </div>
  )
}