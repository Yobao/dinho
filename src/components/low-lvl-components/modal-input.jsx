import React, { useState, useReducer } from "react";

function ModalInputComponent(props) {
  const [showEyeIcon] = useState(props.showEyeIcon && props.icon === "fas fa-lock");
  const [inputType, setInputType] = useState(props.icon === "fas fa-lock" ? "password" : "text");

  const toggleShowPwd = (props) => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const EyeIcon = (
    <React.Fragment>
      {inputType === "password" && (
        <span className='icon is-clickable' style={{ position: "absolute", right: "10px" }} onClick={toggleShowPwd}>
          <i className='fas fa-eye'></i>
        </span>
      )}

      {inputType === "text" && (
        <span className='icon is-clickable' style={{ position: "absolute", right: "10px" }} onClick={toggleShowPwd}>
          <i className='fas fa-eye-slash'></i>
        </span>
      )}
    </React.Fragment>
  );

  return (
    <div className='field'>
      <label className='label has-text-left'>{props.title}</label>
      <div className='control has-icons-left'>
        <input
          className={`input ${props.handleInput.color}`}
          type={inputType}
          placeholder={props.placeHolder}
          onChange={props.handleInput.setValue}
        />
        <span className='icon is-small is-left'>
          <i className={`${props.icon}`}></i>
        </span>
        {showEyeIcon && EyeIcon}
      </div>
    </div>
  );
}

export default ModalInputComponent;
