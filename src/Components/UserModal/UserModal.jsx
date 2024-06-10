import './UserModal.scss';
import { Dialog } from '@headlessui/react';
import userData from '../../../data.json';

import facebookActive from '../../assets/images/vectors/facebookActive.svg';
import facebookNull from '../../assets/images/vectors/facebookNull.svg';
import instagramActive from '../../assets/images/vectors/instagramActive.svg';
import instagramNull from '../../assets/images/vectors/instagramNull.svg';
import whatsappActive from '../../assets/images/vectors/whatsappActive.svg';
import whatsappNull from '../../assets/images/vectors/whatsappNull.svg';
import phoneActive from '../../assets/images/vectors/phoneActive.svg';
import phoneNull from '../../assets/images/vectors/phoneNull.svg';
import emailActive from '../../assets/images/vectors/emailActive.svg';
import emailNull from '../../assets/images/vectors/emailNull.svg';
import telegramActive from '../../assets/images/vectors/telegramActive.svg';
import telegramNull from '../../assets/images/vectors/telegramNull.svg';
import vkActive from '../../assets/images/vectors/vkActive.svg';
import vkNull from '../../assets/images/vectors/vkNull.svg';
import linkedInActive from '../../assets/images/vectors/linkedInActive.svg';
import linkedInNull from '../../assets/images/vectors/linkedInNull.svg';
import flyingPlane from '../../assets/images/vectors/flyingPlane.svg'

const socialTypes = [
  'instagram',
  'telegram',
  'facebook',
  'vk',
  'linkedIn',
  'whatsapp',
  'email',
  'phone'
];

const getSocialIcon = (userSocial, type) => {
  const foundSocial = userSocial.find(social => social.type === type);

  if (foundSocial) {
    return {
      icon: `${type}Active`,
      link: foundSocial.link
    };
  } else {
    return {
      icon: `${type}Null`,
      link: null
    };
  }
};

export default function UserModal({ user, userData, onClose, getHobbyNames }) {
  const { firstName, lastName, photo, directions, companies, skills, hobbies, social } = user;

  const getUserCompanies = (companies) => {
    const companyNames = companies.map((company) => {
      const foundCompany = userData.companies.find((c) => c.id === company.id);
      return foundCompany ? foundCompany.name : '';
    });
    const companyElements = companyNames.map((companyName, index) => (
      <p className='p-style__companies' key={index}>{companyName}</p>
    ));

    return companyElements;
  };

  const getDirectionNames = (directions) => {
    const directionNames = directions.map((dir) => {
      const foundDirection = userData.directions.find((d) => d.id === dir.id);
      return foundDirection ? foundDirection.name : '';
    });
    const directionElements = directionNames.map((directionName, index) => (
      <p className='p-style__directions' key={index}>{directionName}</p>
    ));

    return directionElements;
  };

  const getUserSkills = (skills) => {
    const knownSkills = skills.filter((skill) => skill.status === 'Уже знает');
    const skillNames = knownSkills.map((skill) => skill.name);
    const skillElements = skillNames.map((skillName, index) => (
      <p className='p-style__skills' key={index}>{skillName}</p>
    ));

    return skillElements;
  };

  const renderSocialIcons = () => {
    return socialTypes.map(type => {
      const { icon, link } = getSocialIcon(social, type);
      const socialIcon = icon === `${type}Active` ? eval(`${type}Active`) : eval(`${type}Null`);

      return (
        <a
          key={type}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img src={socialIcon} alt={type} />
        </a>
      );
    });
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <div className='user-modal'>
        <Dialog.Panel className='popup__user-container'>
          <div className='user-container__info'>
            <div className='user-container__info-photo'>
              <img src={photo} alt={`${firstName} ${lastName}`} />
            </div>
            <div className='user-container__info-background'>
              <img src={flyingPlane} alt="flyingPlane" />
            </div>
            <div className='user-container__info-text'>
              <h3>{`${firstName} ${lastName}`}</h3>
              <p>{getHobbyNames(hobbies)}</p>
            </div>
            <div className='user-container__info-socials'>
              {renderSocialIcons()}
            </div>
          </div>
          <div className='user-container__category'>
            <div className='user-container__category-companies'>
              <h3>Компании</h3>
              <div className='companies'>{getUserCompanies(companies)}</div>
            </div>
            <div className='user-container__category-directions'>
              <h3>Темы</h3>
              <div className='directions'>{getDirectionNames(directions)}</div>
            </div>
            <div className='user-container__category-skills'>
              <h3>Skills</h3>
              <div className='skills'>{getUserSkills(skills)}</div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}