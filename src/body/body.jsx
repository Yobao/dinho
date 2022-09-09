import React, { useContext } from "react";
import BettingPageComponent from "./pages/betting/betting";
import HomePageComponent from "./pages/home/home";
import CurrentUserPageComponent from "./pages/table-player-actual/table-player-actual";
import OtherUserPageComponent from "./pages/table-player-others/table-player-others";
import ScoreTablePageComponent from "./pages/table-score/table-score";
import { Routes, Route } from "react-router-dom";

import { UserContext, OtherUserContext } from "../store/user-context";

function BodyComponent() {
  const userContext = useContext(UserContext);
  const otherUserContext = useContext(OtherUserContext);

  return (
    <div className='columns is-centered m-2'>
      <Routes>
        <Route path='/' element={<HomePageComponent />} />
        <Route path='/table' element={<ScoreTablePageComponent />} />
        <Route path={`/profil`} element={<CurrentUserPageComponent />} />
        <Route path='/bet' element={<BettingPageComponent />} />
      </Routes>
      {otherUserContext[0].otherUserName && otherUserContext[0].otherUserId && <OtherUserPageComponent />}
    </div>
  );
}

export default BodyComponent;
