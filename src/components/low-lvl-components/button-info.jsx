import React, { useContext } from "react";
import { LanguageContext } from "../../store/user-context";

function ButtonInfoComponent(props) {
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const buttons = appLanguage.betButtons;

  const key = props.keys;
  const buttonColor =
    props.text === buttons[0]
      ? "has-background-info"
      : props.text === buttons[1]
      ? "has-background-success"
      : "has-background-warning";

  return (
    <button className={`button has-text-weight-bold is-hovered m-2 is-active ${buttonColor}`}>{props.text}</button>
  );
}

export default ButtonInfoComponent;
