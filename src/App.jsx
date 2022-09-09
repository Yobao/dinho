import React, { useState, useEffect } from "react";
import "bulma/css/bulma.css";
import "@creativebulma/bulma-tooltip/dist/bulma-tooltip.css";
import "./App.css";
import BodyComponent from "./body/body";
import HeaderComponent from "./header/header";
import { url } from "./local";

import { UserContext, OtherUserContext, DropdownTitleContext, LanguageContext } from "./store/user-context";

function App() {
  const [errorGet, setErrorGet] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState({ otherUserName: null, otherUserId: null });
  const [title, setTitle] = useState(null);

  useEffect(() => {
    autoLogin();
  }, []);

  const autoLogin = () => {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("dinhotoken")}` },
    };

    (async () => {
      try {
        const res = await fetch(`${url}/autologin`, requestOptions);
        const resData = await res.json();
        if (res.status === 200) {
          setCurrentUser(resData.user);
        }
      } catch (error) {
        setErrorGet(error);
      }
    })();
  };

  return (
    <div className='App'>
      <UserContext.Provider value={[currentUser, setCurrentUser]}>
        <OtherUserContext.Provider value={[otherUser, setOtherUser]}>
          <DropdownTitleContext.Provider value={[title, setTitle]}>
            <HeaderComponent />
            <BodyComponent />
          </DropdownTitleContext.Provider>
        </OtherUserContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
