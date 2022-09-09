import React, { useState, useEffect, useContext } from "react";
import Modal from "../../components/modal/modal";
import * as qs from "qs";
import { url } from "./../../local";
import { LanguageContext } from "../../store/user-context";
import toastik from "../../toast";
import { useLocation } from "react-router-dom";

function MailChangePwd(props) {
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const alerts = appLanguage.mailPwd[2];
  const location = useLocation();
  const [submitSent, setSubmitSent] = useState(false);
  const [password1, setPassword1] = useState(null);
  const [password2, setPassword2] = useState(null);
  const [password1Color, setPassword1Color] = useState(null);
  const [password2Color, setPassword2Color] = useState(null);
  const [urlToken, setUrlToken] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    let tempToken = location.pathname.split("/").pop();
    setUrlToken(tempToken);

    (async () => {
      try {
        const res = await fetch(`${url}/reset/${tempToken}`);
        const resData = await res.json();
        if (res.status === 200) {
          setAuthToken(resData.token);
        }
      } catch (err) {
        toastik(`${alerts.somethingWrong}`);
      }
    })();
  }, []);

  const handlePassword1 = (e) => {
    setPassword1(e.target.value);
    if (submitSent) {
      handleInputs.password1.condition(e.target.value);
      handleInputs.password2.condition(e.target.value);
    }
  };
  const handlePassword2 = (e) => {
    setPassword2(e.target.value);
    if (submitSent) {
      handleInputs.password1.condition(e.target.value);
      handleInputs.password2.condition(e.target.value);
    }
  };
  const handleInputs = {
    password1: {
      setValue: handlePassword1,
      color: password1Color,
      setColor: (val) => {
        setPassword1Color(val);
      },
      condition: (val) => {
        if (val.length < 6) return setPassword1Color("is-danger");
        return setPassword1Color(null);
      },
    },
    password2: {
      setValue: handlePassword2,
      color: password2Color,
      setColor: (val) => {
        setPassword2Color(val);
      },
      condition: (val) => {
        if (val.length < 6) return setPassword2Color("is-danger");
        return setPassword2Color(null);
      },
    },
  };

  const changePassword = () => {
    setSubmitSent(true);

    if (!password1 || !password2) {
      if (!password1) setPassword1Color("is-danger");
      if (!password2) setPassword2Color("is-danger");
      return toastik(`${alerts.fillEverything}`);
    }
    if (password1.length < 6 || password2 < 6) {
      if (password1.length < 6) setPassword1Color("is-danger");
      if (password2.length < 6) setPassword2Color("is-danger");
      return toastik(`${alerts.pwdMin}`);
    }
    if (password1 !== password2) {
      setPassword1Color("is-danger");
      setPassword2Color("is-danger");
      return toastik(`${alerts.pwdNotMatch}`);
    }

    const data = {
      grant_type: "password",
      username: urlToken,
      password: password2,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(data),
    };

    (async () => {
      try {
        const res = await fetch(`${url}/change_password`, requestOptions);
        const resData = await res.json();
        if (res.status === 200) {
          localStorage.setItem("dinhotoken", authToken);
          window.location.href = "/";
        }
      } catch (err) {
        toastik(`${alerts.somethingWrong}`);
      }
    })();
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 13) changePassword();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [password1, password2]);

  return (
    <Modal
      data={appLanguage.mailPwd}
      mainButton={changePassword}
      handleInputs={handleInputs}
      showModal={props.handleShowModal}
    />
  );
}

export default MailChangePwd;
