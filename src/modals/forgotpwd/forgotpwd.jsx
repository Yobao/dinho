import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import Modal from "../../components/modal/modal";
import { LanguageContext } from "../../store/user-context";
import { url } from "../../local";
import * as qs from "qs";
import toastik from "../../toast";

function ForgotPasswordComponent(props) {
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const alerts = appLanguage.forgotPwdModal[2];
  const [email, setEmail] = useState();
  const [emailColor, setEmailColor] = useState();
  const [submitSent, setSubmitSent] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (submitSent) handleInputs.email.condition(e.target.value);
  };

  const handleInputs = {
    email: {
      setValue: handleEmail,
      color: emailColor,
      condition: (val) => {
        if (val === null || !val.includes("@")) return setEmailColor("is-danger");
        return setEmailColor();
      },
    },
  };

  const sendPassword = () => {
    setSubmitSent(true);

    if (!email) return toastik(`${alerts.fillEverything}`);
    if (!email.includes("@")) return toastik(`${alerts.mailFormat}`);

    const data = {
      mail: email,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    (async () => {
      try {
        const res = await fetch(`${url}/resetpw`, requestOptions);
        const resData = await res.json();

        if (res.status === 200) {
          toastik(`${alerts.passwordSent}`, "is-success");
          props.handleShowModal();
        } else {
          toastik(`${alerts.mailNotExists}`);
        }
      } catch (err) {
        toastik(`${alerts.somethingWrong}`);
      }
    })();
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) return props.handleShowModal();
      if (e.keyCode === 13) return sendPassword();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [email]);

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Modal
          data={appLanguage.forgotPwdModal}
          mainButton={sendPassword}
          handleInputs={handleInputs}
          showModal={props.handleShowModal}
        />,
        document.getElementById("modal-root")
      )}
    </React.Fragment>
  );
}

export default ForgotPasswordComponent;

// fetch("https://dinhoapidev.herokuapp.com/resetpw", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,cs;q=0.7",
//     "cache-control": "no-cache",
//     "content-type": "application/json",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "cross-site"
//   },
//   "referrer": "http://localhost:1711/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "[object Object]",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "omit"
// });

// fetch("https://dinhoapidev.herokuapp.com/resetpw", {
//   headers: {
//     accept: "application/json",
//     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,cs;q=0.7",
//     "cache-control": "no-cache",
//     "content-type": "application/json",
//     pragma: "no-cache",
//     "sec-ch-ua": '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": '"Windows"',
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//   },
//   referrer: "https://dinhoapidev.herokuapp.com/docs",
//   referrerPolicy: "strict-origin-when-cross-origin",
//   body: '{\n  "mail": "jozef.babos11@gmail.com"\n}',
//   method: "POST",
//   mode: "cors",
//   credentials: "omit",
// });
