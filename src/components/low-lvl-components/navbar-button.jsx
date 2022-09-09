import React, { useContext } from "react";
import Brand from "./../../assets/brand.png";
import { Link } from "react-router-dom";
import { LanguageContext } from "../../store/user-context";

function NavbarButton(props) {
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const logout = appLanguage.navbar.logout;
  const account = appLanguage.navbar.account;

  const brandImage = (
    <Link to={`${props.path}`} className={`${props.class}`}>
      <img src={Brand} style={{ maxHeight: "90px" }}></img>
    </Link>
  );

  const button = (
    <React.Fragment>
      {!props.path && props.text !== logout && props.text !== account && (
        <a className={props.class} onClick={props.showModal}>
          {props.text}
        </a>
      )}

      {!props.path && props.text !== logout && props.text === account && (
        <a className={props.class} onClick={props.click}>
          {props.text}
        </a>
      )}

      {props.path && props.text !== logout && (
        <Link to={`${props.path}`} className={props.class}>
          {props.text}
        </Link>
      )}

      {props.text === logout && (
        <Link to={`${props.path}`} className={props.class} onClick={props.click}>
          {props.text}
        </Link>
      )}
    </React.Fragment>
  );

  return <React.Fragment>{props.type === "image" ? brandImage : button}</React.Fragment>;
}

export default NavbarButton;
