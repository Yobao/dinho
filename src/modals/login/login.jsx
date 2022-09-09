import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import Modal from "../../components/modal/modal";
import * as qs from "qs";
import { url } from "./../../local";
import { UserContext, LanguageContext } from "../../store/user-context";
import toastik from "../../toast";

function LoginModalComponent(props) {
  const context = useContext(UserContext);
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const [loginName, setLoginName] = useState(null);
  const [loginPwd, setLoginPwd] = useState(null);
  const [loginNameColor, setLoginNameColor] = useState();
  const [loginPwdColor, setLoginPwdColor] = useState();
  const [submitSent, setSubmitSent] = useState(false);

  const handleLoginName = (e) => {
    setLoginName(e.target.value);
    if (submitSent) handleInputs.loginName.condition(e.target.value);
  };
  const handleLoginPwd = (e) => {
    setLoginPwd(e.target.value);
    if (submitSent) handleInputs.loginPwd.condition(e.target.value);
  };
  const handleInputs = {
    loginName: {
      setValue: handleLoginName,
      color: loginNameColor,
      setColor: (val) => {
        setLoginNameColor(val);
      },
      condition: (val) => {
        if (val.length < 3) return setLoginNameColor("is-danger");
        return setLoginNameColor();
      },
    },
    loginPwd: {
      setValue: handleLoginPwd,
      color: loginPwdColor,
      setColor: (val) => {
        setLoginPwdColor(val);
      },
      condition: (val) => {
        if (val.length < 6) return setLoginPwdColor("is-danger");
        return setLoginPwdColor();
      },
    },
  };

  const login = (e) => {
    setSubmitSent(true);

    const data = {
      grant_type: "password",
      username: loginName,
      password: loginPwd,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(data),
    };

    (async () => {
      try {
        const res = await fetch(`${url}/token`, requestOptions);
        const resData = await res.json();

        if (res.status === 200) {
          localStorage.setItem("dinhotoken", resData.access_token);
          context[1](loginName);
          props.handleShowModal();
        }

        if (res.status === 401 || res.status === 422) {
          Object.values(handleInputs).forEach((el) => {
            el.setColor("is-danger");
          });
          toastik(`${appLanguage.loginModal[2].warning}`);
        }
      } catch (err) {
        toastik(`${appLanguage.loginModal[2].somethingWrong}`);
      }
    })();
  };

  const lostPwd = (e) => {
    props.handleShowModal();
    props.handleForgot.handleShowForgotPwd();
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) return props.handleShowModal();
      if (e.keyCode === 13) return login(e);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [loginName, loginPwd]);

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Modal
          data={appLanguage.loginModal}
          mainButton={login}
          secondaryButton={lostPwd}
          handleInputs={handleInputs}
          showModal={props.handleShowModal}
          showEyeIcon={true}
        />,
        document.getElementById("modal-root")
      )}
    </React.Fragment>
  );
}

export default LoginModalComponent;
