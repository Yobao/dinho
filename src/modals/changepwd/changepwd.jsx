import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import Modal from "../../components/modal/modal";
import { LanguageContext } from "../../store/user-context";
import { url } from "../../local";
import * as qs from "qs";
import toastik from "../../toast";

function ChangePwdModalComponent(props) {
  const [oldPwd, setOldPwd] = useState();
  const [newPwd, setNewPwd] = useState();
  const [oldPwdColor, setOldPwdColor] = useState();
  const [newPwdColor, setNewPwdColor] = useState();
  const [submitSent, setSubmitSent] = useState(false);

  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const alerts = appLanguage.changePwdModal[2];

  const handleOldPwd = (e) => {
    setOldPwd(e.target.value);
    if (submitSent) handleInputs.oldPwd.condition(e.target.value);
    if (submitSent) handleInputs.newPwd.condition(e.target.value);
  };

  const handleNewPwd = (e) => {
    setNewPwd(e.target.value);
    if (submitSent) handleInputs.oldPwd.condition(e.target.value);
    if (submitSent) handleInputs.newPwd.condition(e.target.value);
  };

  const handleInputs = {
    oldPwd: {
      setValue: handleOldPwd,
      color: oldPwdColor,
      setColor: (val) => {
        setOldPwdColor(val);
      },
      condition: (val) => {
        if (val.length < 6) return setOldPwdColor("is-danger");
        return setOldPwdColor();
      },
    },
    newPwd: {
      setValue: handleNewPwd,
      color: newPwdColor,
      setColor: (val) => {
        setNewPwdColor(val);
      },
      condition: (val) => {
        if (val.length < 6) return setNewPwdColor("is-danger");
        return setNewPwdColor();
      },
    },
  };

  const changePwd = (e) => {
    setSubmitSent(true);

    if (!oldPwd || !newPwd) {
      if (!oldPwd) setOldPwdColor("is-danger");
      if (!newPwd) setNewPwdColor("is-danger");
      return toastik(`${alerts.fillEverything}`);
    }
    if (oldPwd.length < 6 || newPwd < 6) {
      if (oldPwd.length < 6) setOldPwdColor("is-danger");
      if (newPwd.length < 6) setNewPwdColor("is-danger");
      return toastik(`${alerts.pwdMin}`);
    }

    const data = {
      grant_type: "password",
      username: oldPwd,
      password: newPwd,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("dinhotoken")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(data),
    };

    (async () => {
      try {
        const res = await fetch(`${url}/change_password`, requestOptions);
        const resData = await res.json();

        if (res.status === 200) {
          props.handleShowModal();
          window.location.href = `${url}/`;
        }
      } catch (err) {
        toastik(`${alerts.somethingWrong}`);
      }
    })();
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) props.handleShowModal();

      if (e.keyCode === 13) changePwd();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [oldPwd, newPwd]);

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Modal
          data={appLanguage.changePwdModal}
          mainButton={changePwd}
          handleInputs={handleInputs}
          showModal={props.handleShowModal}
        />,
        document.getElementById("modal-root")
      )}
    </React.Fragment>
  );
}

export default ChangePwdModalComponent;
