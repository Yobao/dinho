import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Routes,
  Route,
} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import MailChangePwd from "./modals/mailpwd/mailpwd";
import { LanguageContext } from './store/user-context';
import { SLOVAK, CZECH, ENGLISH } from "./objects/objects";

function ContextComponent() {
  const language = localStorage.getItem("dinholanguage");
  const dinhoLanguage = language === "cs" ? CZECH : language === "sk" ? SLOVAK : ENGLISH;
  if (!dinhoLanguage) localStorage.setItem("dinholanguage", window.navigator.language.toLowerCase());
  const [appLanguage, setAppLanguage] = useState(
    dinhoLanguage
      ? dinhoLanguage
      : window.navigator.language.toLowerCase() === "cs" || window.navigator.language.toLowerCase() === "cs-cz"
        ? CZECH
        : window.navigator.language.toLowerCase() === "sk" || window.navigator.language.toLowerCase() === "sk-sk"
          ? SLOVAK
          : ENGLISH
  );

  return (
    <LanguageContext.Provider value={{ appLanguage: appLanguage, setAppLanguage: setAppLanguage }}>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={< App />} />
          <Route path={`/changepassword/*`} element={<MailChangePwd />} />
        </Routes>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextComponent />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
