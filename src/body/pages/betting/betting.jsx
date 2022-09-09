import React, { useState, useEffect, useContext, useCallback } from "react";

import Moment from "react-moment";
import moment from "moment";
import { url, ws } from "./../../../local";
import CardComponent from "../../../components/card/card";
import ButtonInfoComponent from "../../../components/low-lvl-components/button-info";
import LoadingButton from "../../../components/low-lvl-components/button-loading";

import { toast } from "bulma-toast";

import OtherUserPageComponent from "../table-player-others/table-player-others";
import { OtherUserContext, DropdownTitleContext, LanguageContext, UserContext } from "../../../store/user-context";
import Pusher from "pusher-js";

function BettingPageComponent() {
  const [data, setData] = useState({
    message: { current: null, fixtures: [], match: null, players: [], pool: null, side: null, start: null },
    match: null,
    distance: null,
  });
  const currentUserContext = useContext(UserContext);
  const otherUserContext = useContext(OtherUserContext);
  const dropdownTitleContext = useContext(DropdownTitleContext);
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const betTitles = appLanguage.betTitle;
  const betTime = appLanguage.betTime;
  const betButtons = appLanguage.betButtons;
  const betAlert = appLanguage.betAlerts;

  const [distance, setDistance] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoButtons, setShowInfoButtons] = useState(false);

  const [errorGet, setErrorGet] = useState(null);
  const [errorPost, setErrorPost] = useState(null);
  const [toolTip, setToolTip] = useState();
  const [betID, setBetID] = useState();

  useEffect(() => {
    let pusher = new Pusher(ws, {
      channelAuthorization: {
        headers: { Authorization: `Bearer ${localStorage.getItem("dinhotoken")}` },
        endpoint: `${url}/auth`,
      },
      cluster: "eu",
    });

    if (currentUserContext[0]) {
      requestData();

      let channel = pusher.subscribe(`private-${currentUserContext[0]}`);
      channel.bind("new-message", function (data) {
        setShowInfoButtons(data.players[0].status === "unknown" ? false : true);
        setData({
          message: data,
          match: convertMatchName(data.side, data.match),
        });
        if (!data.start) setDistance(handleTime(data.start));
        handleToolTip(data.fixtures);
      });

      otherUserContext[1]({ otherUserName: null, otherUserId: null });
      dropdownTitleContext[1](null);
    }

    return () => {
      pusher.disconnect();
    };
  }, [currentUserContext[0]]);

  useEffect(() => {
    let timer = setInterval(() => {
      if (data.message.start) setDistance(handleTime(data.message.start));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [distance]);

  const requestData = async () => {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("dinhotoken")}` },
    };
    try {
      const res = await fetch(`${url}/players?t=1`, requestOptions);
      const resData = await res.json();

      if (res.status === 200) {
        setShowInfoButtons(resData.players[0].status === "unknown" ? false : true);
        setData({
          message: resData,
          match: convertMatchName(resData.side, resData.match),
        });
        if (!data.start) setDistance(handleTime(resData.start));
        handleToolTip(resData.fixtures);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorGet(error);
    }
  };

  //           >>>>>>>>>>>>>>>>>>    BACKUP CODE   <<<<<<<<<<<<<<<<<<
  ///////////////////////////////////////////////////////////////////////////////////////////
  /*   useEffect(() => {
    requestData();
  }, []); */

  /*   useEffect(() => {
    let timer = setInterval(() => {
      if (data.start) handleTime(data.start);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [distance]);

  const requestData = async () => {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("dinhotoken")}` },
    };
    try {
      const res = await fetch(`${url}/players?t=1`, requestOptions);
      const resData = await res.json();
      setData(resData);
      setMatch(convertMatchName(resData.side, resData.match));
      if (!data.start) handleTime(resData.start);
      handleToolTip(resData.fixtures);
      setIsLoading(false);
    } catch (error) {
      setErrorGet(error);
    }
  }; */
  ///////////////////////////////////////////////////////////////////////////////////////////

  const handleTime = (matchStart) => {
    let m = moment.utc(matchStart);
    //let m = moment.utc(matchStart).subtract("day", 19).subtract("hour", 11).subtract("minute", 7);
    let m2 = moment.utc().format();
    let diff = m.diff(m2);
    let diffHours = m.clone().diff(m2, "hours");
    let diffMinutes = m.clone().diff(m2, "minutes");
    let diffSeconds = m.clone().diff(m2, "seconds");

    let showDays = m.clone().diff(m2, "days");
    let showHours = m.clone().subtract(showDays, "day").diff(m2, "hours");
    let showMinutes = m.clone().subtract(showDays, "day").subtract(showHours, "hour").diff(m2, "minutes");
    let showSeconds = m
      .clone()
      .subtract(showDays, "day")
      .subtract(showHours, "hour")
      .subtract(showMinutes, "minutes")
      .diff(m2, "seconds");
    let finalTime = moment.utc(diff).subtract(1, "day");

    const days = () => {
      const interpunction =
        diffMinutes > 10 && !showHours && !showMinutes
          ? ""
          : diffMinutes > 10 && (!showMinutes || !showHours)
          ? ` ${betTime.interpunction}`
          : ",";
      if (!showDays) return "";
      if (showDays === 1) return `${showDays} ${betTime.day.one}${interpunction}`;
      if (showDays < 5) return `${showDays} ${betTime.day.multiple1}${interpunction}`;
      return `${showDays} ${betTime.day.multiple2}${interpunction}`;
    };
    const hours = () => {
      const interpunction =
        !showMinutes && diffMinutes > 10 ? "" : !showMinutes || diffMinutes > 10 ? ` ${betTime.interpunction}` : ",";
      if (!showHours) return "";
      if (showHours === 1) return `${showHours} ${betTime.hour.one}${interpunction}`;
      if (showHours < 5) return `${showHours} ${betTime.hour.multiple1}${interpunction}`;
      return `${showHours} ${betTime.hour.multiple2} ${interpunction}`;
    };
    const minutes = () => {
      const interpunction = diffMinutes > 10 ? "" : ` ${betTime.interpunction}`;
      if (!showMinutes) return "";
      if (showMinutes === 1) return `${showMinutes} ${betTime.minute.one}${interpunction}`;
      if (showMinutes < 5) return `${showMinutes} ${betTime.minute.multiple1}${interpunction}`;
      return `${showMinutes} ${betTime.minute.multiple2}${interpunction}`;
    };
    const seconds = () => {
      if (diffMinutes > 10) return "";
      if (!showSeconds) return `${showSeconds} ${betTime.second.one}`;
      if (showSeconds === 1) return `${showSeconds} ${betTime.second.multiple1}`;
      if (showSeconds < 5) return `${showSeconds} ${betTime.second.multiple2}`;
      return `${showSeconds} ${betTime.second.multiple2}`;
    };
    let timeString = `[${days()}] [${hours()}] [${minutes()}] [${seconds()}]`;

    if (!showDays && !showHours && !showMinutes && !showSeconds) requestData();
    // // timeDiff <= 3hours && timeDiff > 1hour = refresh every 30min...
    // if (diffHours <= 3 && diffHours > 1 && diffSeconds % 1800 === 0) requestData();
    // // timeDiff <= 1hour && timeDiff > 10min = refresh every 5 min...
    // if (diffHours <= 1 && diffMinutes > 10 && diffSeconds % 300 === 0) requestData();
    // // timeDiff <= 10min && timeDiff > 1min = refresh every 1min...
    // if (diffMinutes <= 10 && diffMinutes > 1 && diffSeconds % 60 === 0) requestData();
    // // timeDiff <= 1min = refresh every 15sec...
    // if (diffMinutes <= 1 && diffSeconds % 15 === 0) requestData();
    // // timeDiff === 0, get new Data for new match...
    // if (!diffSeconds) requestData();

    //setDistance(finalTime.format(timeString));
    // setData((prevState) => ({ ...prevState, distance: finalTime.format(timeString) }));
    return finalTime.format(timeString);
  };

  const handleChangeBet = (e) => {
    //create function for that ??? - repeating code.
    let betIDtemp = e.target.getAttribute("value");
    if (!betIDtemp) betIDtemp = e.target.parentElement.getAttribute("value");
    if (!betIDtemp) betIDtemp = e.target.parentElement.parentElement.getAttribute("value");
    setBetID(betIDtemp);
    //socket.send(betIDtemp);

    //If clicked on the "blue" card, disable event.
    if (betIDtemp == data.current) return e.preventDefault();

    let betName = e.target.getAttribute("name");
    if (!betName) betName = e.target.parentElement.getAttribute("name");
    if (!betName) betName = e.target.parentElement.parentElement.getAttribute("name");

    const requestOptions = {
      method: "POST",
      body: `tip=${betIDtemp}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${localStorage.getItem("dinhotoken")}`,
      },
    };
    (async () => {
      try {
        const res = await fetch(`${url}/tip`, requestOptions);
        const resData = await res.json();
        //if (res.status === 200) requestData();

        if (res.status === 200) {
          toast({
            message: `${betAlert.bet} ${betName}. \r\n${betAlert.info}`,
            position: "center",
            duration: 2500,
            type: "is-info",
          });
        }
      } catch (error) {
        setErrorPost(error);
      }
    })();
  };

  const handleToolTip = (fixturesData) => {
    let tooltip = "";
    fixturesData.map((match, i) => {
      let interpuc = fixturesData.length === 1 || fixturesData.length === i - 1 ? "" : ",";
      tooltip = tooltip.concat(
        convertDate(match.start),
        " ",
        match.match,
        match.side == 1 ? " (H)" : match.side == 0 ? " (N)" : " (A)",
        `${interpuc}\n`
      );
    });
    setToolTip(tooltip);
  };

  const convertMatchName = (side, match) => {
    return side === 0 ? `Chelsea - ${match} (N)` : side === 1 ? `Chelsea - ${match}` : `${match} - Chelsea`;
  };

  const convertDate = (date) => {
    let newDate = new Date(date);
    return `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}`;
  };

  const cards = data.message.players.map((player, index) => (
    <CardComponent
      key={`card-player-${player.id}`}
      cardData={player}
      index={index}
      currentBet={data.message.current}
      pool={data.message.pool}
      click={handleChangeBet}
    />
  ));

  const infoButtons = betButtons.map((button, i) =>
    !showInfoButtons && button === betButtons[0] ? (
      <ButtonInfoComponent key={Math.random()} keys={`${button}`} text={button} />
    ) : showInfoButtons ? (
      <ButtonInfoComponent key={Math.random()} keys={`${button}`} text={button} />
    ) : null
  );

  return (
    <React.Fragment>
      {isLoading && <LoadingButton />}

      {!isLoading && data && (
        <div className='is-centered is-7 is-fullwidth'>
          <div className='has-text-centered column'>
            {
              <h1 className={`title is-2`}>
                {data.match}{" "}
                <span
                  className='icon has-text-info tooltip has-tooltip-left has-tooltip-multiline'
                  data-tooltip={toolTip}
                >
                  <i className='fas fa-calendar icon is-small' aria-hidden='true'></i>
                </span>
              </h1>
            }

            <h2 className='title is-3'>
              {betTitles.points1} <strong className='has-text-weight-bold'>{data.message.pool}</strong>{" "}
              {betTitles.points2}
            </h2>

            {<h2 className='title is-3'>{`${betTitles.time} ${distance}`}</h2>}
          </div>

          <div className='buttons is-centered column mb-4 mt-2'>{infoButtons}</div>

          <div className='columns is-centered is-multiline'>{cards}</div>
        </div>
      )}
    </React.Fragment>
  );
}

export default BettingPageComponent;
