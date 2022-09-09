import React, { useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";

import NavbarButton from "../../components/low-lvl-components/navbar-button";
import LoginModalComponent from "../../modals/login/login";
import RegistrationModalComponent from "../../modals/registration/registration";
import ChangePwdModalComponent from "../../modals/changepwd/changepwd";
import ForgotPasswordComponent from "../../modals/forgotpwd/forgotpwd";
import { UserContext, LanguageContext } from "../../store/user-context";
import { SLOVAK, CZECH, ENGLISH } from "./../../objects/objects";

import { url } from "../../local";

function NavbarComponent() {
  const context = useContext(UserContext);
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const text = appLanguage.navbar;
  const [showLogin, setShowLogin] = useState(false);
  const [showReg, setShowReg] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileLanguages, setShowMobileLanguages] = useState(false);
  const [showForgotPwd, setShowForgotPwd] = useState(false);
  const [errorGet, setErrorGet] = useState(null);
  const dinhoLanguage = localStorage.getItem("dinholanguage");
  const flags = [
    {
      text: "Česky",
      flag: "https://cdn0.iconfinder.com/data/icons/all-national-flags-of-the-world-very-high-quality-/283/czech_republic-512.png",
      code: "cs",
    },
    {
      text: "Slovensky",
      flag: "https://cdn0.iconfinder.com/data/icons/all-national-flags-of-the-world-very-high-quality-/283/slovakia-512.png",
      code: "sk",
    },
    {
      text: "English",
      flag: "https://cdn0.iconfinder.com/data/icons/all-national-flags-of-the-world-very-high-quality-/283/united_kingdom-1024.png",
      code: "english",
    },
  ];
  const [defaultLanguage, setDefaultLanguage] = useState(
    dinhoLanguage === "cs" ? flags[0] : dinhoLanguage === "sk" ? flags[1] : flags[2]
  );

  const handleShowLogin = () => {
    setShowLogin(!showLogin);
  };

  const handleShowReg = () => {
    setShowReg(!showReg);
  };

  const handleShowChangePwd = () => {
    setShowChangePwd(!showChangePwd);
  };

  const handleShowMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu ? "is-active" : false);
  };

  const handleShowMobileLanguages = () => {
    setShowMobileLanguages(!showMobileLanguages ? true : false);
  };

  const handleShowForgotPwd = () => {
    setShowForgotPwd(!showForgotPwd);
  };

  const logOut = () => {
    const requestOptions = {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("dinhotoken")}` },
    };

    (async () => {
      try {
        const res = await fetch(`${url}/logout`, requestOptions);
        const resData = await res.json();

        localStorage.removeItem("dinhotoken");
        context[1](null);
      } catch (error) {
        setErrorGet(error);
      }
    })();
  };

  const changeLanguage = (e) => {
    let value =
      e.target.tagName === "A" ? e.target.getAttribute("value") : e.target.parentElement.getAttribute("value");
    setDefaultLanguage(value === "cs" ? flags[0] : value === "sk" ? flags[1] : flags[2]);
    localStorage.setItem("dinholanguage", value);
    languageContext.setAppLanguage(value === "cs" ? CZECH : value === "sk" ? SLOVAK : ENGLISH);
    setShowMobileLanguages(!showMobileLanguages);
  };

  return (
    <React.Fragment>
      <nav className='navbar is-6 is-centered is-size-5'>
        <div className='navbar-brand '>
          <NavbarButton path='/' class='navbar-item' type='image' />
          <NavbarButton path='/table' text={text.table} class='navbar-item' />
          {!context[0] && (
            <NavbarButton text={text.login} class='navbar-item has-text-left' showModal={handleShowLogin} />
          )}
          {!context[0] && <NavbarButton text={text.registration} class='navbar-item' showModal={handleShowReg} />}
          {context[0] && <NavbarButton path='/bet' text={text.bet} class='navbar-item' />}
          {context[0] && <NavbarButton path={`/profil`} text={`${context[0]}`} class='navbar-item' />}
          {context[0] && (
            <a
              role='button'
              className={`navbar-burger my-auto mx-4 ${showMobileMenu}`}
              aria-label='menu'
              aria-expanded='false'
              data-target='navbarBasicExample'
              onClick={handleShowMobileMenu}
            >
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
            </a>
          )}
        </div>

        {context[0] && (
          <div className={`navbar-menu ${showMobileMenu}`}>
            <div className='navbar-start'>
              <div className='account-dropdown navbar-item has-dropdown is-hoverable '>
                <NavbarButton text={text.account} class='navbar-link' click={handleShowMobileMenu} />
                <div className='account-dropdown-list navbar-dropdown'>
                  <NavbarButton text={text.pwdchange} class='navbar-item' showModal={handleShowChangePwd} />
                  <NavbarButton path={`/`} text={text.logout} class='navbar-item' click={logOut} />
                </div>
              </div>
            </div>
          </div>
        )}

        {useLocation().pathname === "/" && defaultLanguage && (
          <div className={`navbar-end`}>
            <div className='navbar-item has-dropdown is-hoverable lang-dropdown'>
              <a className='navbar-link is-arrowless' onClick={handleShowMobileLanguages}>
                <img src={defaultLanguage.flag} alt=''></img>
              </a>

              {showMobileLanguages && (
                <div className={`navbar-dropdown is-boxed is-right`}>
                  {flags.map((country) => {
                    return (
                      <a className='navbar-item' key={country.text} onClick={changeLanguage} value={country.code}>
                        <img src={country.flag} alt=''></img>
                        <span>{country.text}</span>
                      </a>
                    );
                  })}
                  <hr className='navbar-divider'></hr>
                </div>
              )}
            </div>
          </div>
        )}

        <Outlet />
      </nav>

      {showLogin && (
        <LoginModalComponent
          handleShowModal={handleShowLogin}
          showModal={showLogin}
          handleForgot={{ handleShowForgotPwd: handleShowForgotPwd, showForgotPwd: showForgotPwd }}
        />
      )}
      {showReg && <RegistrationModalComponent handleShowModal={handleShowReg} showModal={showReg} />}
      {showChangePwd && <ChangePwdModalComponent handleShowModal={handleShowChangePwd} showModal={showChangePwd} />}
      {showForgotPwd && <ForgotPasswordComponent handleShowModal={handleShowForgotPwd} showModal={showForgotPwd} />}
    </React.Fragment>
  );
}

export default NavbarComponent;
