import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import Modal from "../../components/modal/modal";
import { url } from "../../local";
import { UserContext, LanguageContext } from "../../store/user-context";
import * as qs from "qs";
import toastik from "../../toast";

function RegistrationModalComponent(props) {
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const context = useContext(UserContext);
  const alerts = appLanguage.regModal[2];
  const [regName, setRegName] = useState(null);
  const [regPwd, setRegPwd] = useState(null);
  const [regPwd2, setRegPwd2] = useState(null);
  const [regEmail, setRegEmail] = useState(null);
  const [regNameColor, setRegNameColor] = useState();
  const [regPwdColor, setRegPwdColor] = useState();
  const [regPwdColor2, setRegPwdColor2] = useState();
  const [regEmailColor, setRegEmailColor] = useState();
  const [community, setCommunity] = useState();
  const [communityColor, setCommunityColor] = useState();
  const [submitSent, setSubmitSent] = useState(false);

  const handleRegName = (e) => {
    setRegName(e.target.value);
    if (submitSent) handleInputs.regName.condition(e.target.value);
  };
  const handleRegPwd = (e) => {
    setRegPwd(e.target.value);
    if (submitSent) handleInputs.regPwd.condition(e.target.value);
  };
  const handleRegPwd2 = (e) => {
    setRegPwd2(e.target.value);
    if (submitSent) handleInputs.regPwd2.condition(e.target.value);
  };
  const handleRegEmail = (e) => {
    setRegEmail(e.target.value);
    if (submitSent) handleInputs.regEmail.condition(e.target.value);
  };

  /*   const handleInputs = {
    regName: {
      value: regName,
      setValue: handleRegName,
      color: regNameColor,
      setColor: (val) => {
        setRegNameColor(val);
      },
      condition: (val) => {
        if (val.length < 4) return setRegNameColor("is-danger");
        return setRegNameColor();
      },
      message: `${alerts.nameMin}`,
    },
    regPwd: {
      value: regPwd,
      setValue: handleRegPwd,
      color: regPwdColor,
      setColor: (val) => {
        setRegPwdColor(val);
      },
      condition: (val) => {
        if (val === null || val.length < 6) {
          setRegPwdColor("is-danger");
          return true;
        } else {
          setRegPwdColor(null);
          return false;
        }
      },
      message: `${alerts.pwdMin}`,
    },
    regPwd2: {
      value: regPwd2,
      setValue: handleRegPwd2,
      color: regPwdColor2,
      setColor: (val) => {
        setRegPwdColor2(val);
      },
      condition: (val) => {
        if (val === null || val.length < 6) {
          setRegPwdColor2("is-danger");
          return true;
        } else {
          setRegPwdColor2(null);
          return false;
        }
      },
      message: `${alerts.pwdMin}`,
    },
    regEmail: {
      value: regEmail,
      setValue: handleRegEmail,
      color: regEmailColor,
      setColor: (val) => {
        setRegEmailColor(val);
      },
      condition: (val) => {
        if (val === null || !val.includes("@")) {
          setRegEmailColor("is-danger");
          return true;
        } else {
          setRegEmailColor();
          return false;
        }
      },
      message: `${alerts.mailFormat}`,
    },
  }; */

  const handleInputs = {
    regName: {
      value: regName,
      setValue: handleRegName,
      color: regNameColor,
      setColor: (val) => {
        setRegNameColor(val);
      },
      condition: (val) => {
        if (val.length < 3 || val.length > 15 || !val.match("^[a-zA-Z0-9@\\-_.]*$") || !isNaN(val)) {
          handleInputs.regName.setColor("is-danger");
          return true;
        } else {
          handleInputs.regName.setColor();
          return false;
        }
      },
      message: `${alerts.nameMin}`,
    },
    regPwd: {
      value: regPwd,
      setValue: handleRegPwd,
      color: regPwdColor,
      setColor: (val) => {
        setRegPwdColor(val);
      },
      condition: (val) => {
        if (val.length < 6) {
          setRegPwdColor("is-danger");
          return true;
        } else {
          setRegPwdColor(null);
          return false;
        }
      },
      message: `${alerts.pwdMin}`,
    },
    regPwd2: {
      value: regPwd2,
      setValue: handleRegPwd2,
      color: regPwdColor2,
      setColor: (val) => {
        setRegPwdColor2(val);
      },
      condition: (val) => {
        if (val.length < 6) {
          setRegPwdColor2("is-danger");
          return true;
        } else {
          setRegPwdColor2(null);
          return false;
        }
      },
      message: `${alerts.pwdMin}`,
    },
    regEmail: {
      value: regEmail,
      setValue: handleRegEmail,
      color: regEmailColor,
      setColor: (val) => {
        setRegEmailColor(val);
      },
      condition: (val) => {
        if (!val.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/)) {
          setRegEmailColor("is-danger");
          return true;
        } else {
          setRegEmailColor(null);
          return false;
        }
      },
      message: `${alerts.mailFormat}`,
    },
  };

  const registration = (e) => {
    if (e !== 13) e.preventDefault();
    setSubmitSent(true);
    let message = null;

    // Fill all fields condition.
    Object.values(handleInputs).forEach((inputField) => {
      if (!inputField.value) {
        inputField.setColor("is-danger");
        if (message === null) message = alerts.fillEverything;
      }
    });
    if (community === undefined) {
      setCommunityColor("hsl(348, 100%, 61%)");
      message = alerts.fillEverything;
    }
    if (message !== null) return toastik(`${message}`);
    // Inputfield specific.
    Object.values(handleInputs).forEach((inputField) => {
      if (inputField.condition(inputField.value) && !message) {
        inputField.setColor("is-danger");
        return (message = inputField.message);
      }
    });
    if (message !== null) return toastik(`${message}`);
    // Not matching passwords condition.
    if (regPwd !== regPwd2) {
      setRegPwdColor("is-danger");
      setRegPwdColor2("is-danger");
      return toastik(`${alerts.pwdNotMatch}`);
    }

    const data = {
      displayname: regName,
      email: regEmail,
      team_id: 1,
      password: regPwd,
      community_id: community,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    (async () => {
      try {
        const res = await fetch(`${url}/register`, requestOptions);
        const resData = await res.json();

        if (res.status === 201) {
          context[1](regName);
          localStorage.setItem(`dinhotoken`, resData.token);
          props.handleShowModal();
        } else if (res.status === 409) {
          setRegNameColor("is-danger");
          setRegEmailColor("is-danger");
          return toastik(`${alerts.exists}`);
        } else {
          return toastik(`${alerts.somethingWrong}`);
        }
      } catch (err) {
        return toastik(`${alerts.somethingWrong}`);
      }
    })();
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) return props.handleShowModal();
      if (e.keyCode === 13) return registration(e.keyCode);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [regName, regPwd, regPwd2, regEmail]);

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Modal
          data={appLanguage.regModal}
          mainButton={registration}
          showModal={props.handleShowModal}
          handleInputs={handleInputs}
          showEyeIcon={false}
          community={{
            community: community,
            setCommunity: setCommunity,
            color: communityColor,
            setColor: setCommunityColor,
          }}
        />,
        document.getElementById("modal-root")
      )}
    </React.Fragment>
  );
}

export default RegistrationModalComponent;
