import React, { useState, useContext } from "react";
import Photo from "./../../assets/a_rudiger.png";
import { LanguageContext } from "../../store/user-context";

function CardComponent(props) {
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const text = appLanguage.betCard;
  const data = props.cardData;
  const index = props.index;
  const pool = props.pool;
  const currentBet = props.currentBet;
  const name = data.name;
  const bettors = data.bettors;
  const id = data.id;
  const status = data.status;

  const cardColor = () => {
    if (id === currentBet) return "has-background-info";
    switch (status) {
      case "out":
        return "is-clickable has-background-grey-lighter";
      case "bench":
        return "is-clickable has-background-warning";
      case "starting":
        return "is-clickable has-background-success";
      default:
        return "is-clickable";
    }
  };

  const calculatePoints = () => {
    if (id === currentBet) return Math.round(pool / bettors);
    if (currentBet && !bettors) return Math.round(pool);
    if (currentBet && bettors) return Math.round(pool / (bettors + 1));
    return Math.round((pool + 100) / (bettors + 1));
  };

  return (
    <div name={name} value={id} className={`columns box is-2 my-3 mx-4 ${cardColor()}`} onClick={props.click}>
      {/*       <figure className='image is-128x128 column'>
        <img src={`${Photo}`} style={{ width: "100px", backgroundColor: "transparent" }} />
      </figure> */}
      <div className='column'>
        <p className={"has-text-weight-bold"}>{name}</p>
        <p>{`${text.bettors} ${bettors}`}</p>
        <p>
          {`${text.prize} `}
          <strong>{`${calculatePoints()}`}</strong>
        </p>
      </div>
    </div>
  );
}

export default CardComponent;
