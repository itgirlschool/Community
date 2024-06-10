import plane from "../../assets/images/vectors/plane.svg";
import line from "../../assets/images/vectors/line.svg";
import "./Header.scss";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <NavLink to="/">
        <div className="header__logo">
          <span className="header-logo__text">GoNetwork</span>
          <div className="header-logo__image">
            <img className="header-logo__line" src={line} alt="logo-image" />
            <img className="header-logo__plane" src={plane} alt="logo-image" />
          </div>
        </div>
      </NavLink>
      <nav className="header__nav">
        <NavLink to="/companies">
          <div className="header-nav__item >">
            <span className="header-nav__text">Компании</span>
            <div className="header-nav__background"> </div>
          </div>
        </NavLink>
        <NavLink to="/directions">
          <div className="header-nav__item >">
            <span className="header-nav__text">Темы</span>
            <div className="header-nav__background"> </div>
          </div>
        </NavLink>
        <NavLink to="/search">
          <div className="header-nav__item >">
            <span className="header-nav__text">Поиск</span>
            <div className="header-nav__background"> </div>
          </div>
        </NavLink>
      </nav>
    </header>
  );
};
export default Header;
