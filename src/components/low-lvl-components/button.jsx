import React, { useState, useEffect } from "react";

function ButtonComponent(props) {
  return (
    <button type='button' className={`button mt-3 mr-3 mb-3 ${props.style}`} onClick={props.click}>
      {props.text}
    </button>
  );
}

export default ButtonComponent;
