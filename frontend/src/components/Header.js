import { useState } from 'react';
import { Link } from 'react-router-dom';
import vectorLogo from '../images/vector-title-logo.svg';

const Header = ({ loggedIn, onSignOut, userAccountEmail, isRegisterRendered }) => {
  const [isAccountInfoMobileOpen, setIsAccountInfoMobileOpen] = useState(false);
  
  function handleAccountIconClick() {
    setIsAccountInfoMobileOpen(!isAccountInfoMobileOpen);
  }

  return (
    <header className="header">
      {loggedIn &&
        <div className={`header__account-info header__account-info_mobile ${isAccountInfoMobileOpen?'header__account-info_opened':''}`}>
          <p className={`header__account-email ${isAccountInfoMobileOpen?'header__account-email_opened':''}`}>{userAccountEmail}</p>
            <Link 
              to={"/signin"} 
              className={`header__account-state header__account-state_mobile hover-effect ${isAccountInfoMobileOpen?'header__account-state_opened':''}`} 
              onClick={onSignOut}
            >
            Log out
            </Link>
        </div>
      }
      <div className="header__main">
        <img className="header__vector-logo" src={vectorLogo} alt="logo titled 'Around the U.S.'"/>
        {!loggedIn ?
        <Link 
          to={isRegisterRendered?'/signin':'/signup'} 
          className="header__account-state hover-effect" 
        >
          {isRegisterRendered?'Log in':'Sign up'}
        </Link>
        :
        <>
        <div className="header__account-info">
          <p className="header__account-email">{userAccountEmail}</p>
          <Link 
            to={"/signin"} 
            className="header__account-state header__account-state_desktop hover-effect" 
            onClick={onSignOut}
          >
          Log out
          </Link>
        </div>
        <button type="button" aria-label="" className={`header__account-icon-mobile hover-effect 
          ${isAccountInfoMobileOpen?'header__account-icon-mobile_opened':''}`} onClick={handleAccountIconClick}></button>
        </>
        }
      </div>
    </header>
  );
}

export default Header;