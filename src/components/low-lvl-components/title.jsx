import React, { useState, useEffect } from "react";

function TitleComponent(props) {
  const titleType = props.titleType;
  const text = props.text;
  

  const h1Title = <p className='title is-2'>{text}</p>;
  const h2Title = <h2 className='title is-3'>{text}</h2>;
  const h2TitleModified = (
    <h2 className='title is-3'>
      {`${text} ${props.text1} `} <strong className='has-text-weight-bold'>{`${props.textBold}`}</strong>{" "}
      {`${props.text2}`}
    </h2>
  );

  return (
    <React.Fragment>
      {(() => {
        switch (titleType) {
          case "h1":
            return h1Title;
          case "h2":
            return h2Title;
          case "h2Modified":
            return h2TitleModified;
          default:
            return null;
        }
      })()}
    </React.Fragment>
  );
}

export default TitleComponent;
