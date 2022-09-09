import React, { useState, useEffect } from "react";
import ModalInputComponent from "../low-lvl-components/modal-input";
import ButtonComponent from "../low-lvl-components/button";
import { useLocation } from "react-router-dom";
import DropdownComponent from "../low-lvl-components/dropdown";

function Modal(props) {
  const location = useLocation();
  const locName = location.pathname.split("/").slice(1, -1)[0];

  const regDropdownButton = document.getElementById("regDropdownButton");
  const [showDropdownMenu, setShowDropdownMenu] = useState(null);
  const [dropdownValue, setDropdownValue] = useState(null);

  const handleShowDropdownMenu = (e) => {
    if (showDropdownMenu) {
      setTimeout(() => {
        regDropdownButton.blur();
        setShowDropdownMenu(null);
      }, 200);
    } else {
      setShowDropdownMenu("is-active");
    }
  };

  const handleCommunityChange = (e) => {
    setDropdownValue(e.target.innerText);
    props.community.setColor("");
    props.community.setCommunity(e.target.getAttribute("value"));
  };

  const inputFields = props.data[0].map((input, i) => {
    return (
      <ModalInputComponent
        key={`${input.title}-${i}`}
        title={input.title}
        placeHolder={input.placeHolder}
        icon={input.icon}
        showEyeIcon={props.showEyeIcon}
        handleInput={Object.values(props.handleInputs)[i]}
      />
    );
  });

  const buttons = props.data[1].map((button, i) => {
    return (
      <ButtonComponent
        key={`${button.text}-${i}`}
        click={!i ? props.mainButton : props.secondaryButton}
        text={button.text}
        style={button.style}
      />
    );
  });

  return (
    <div className='modal is-active'>
      <div className='modal-background' onClick={props.showModal}></div>

      <div className='modal-content has-background-white py-5 px-5' style={{ borderRadius: "1rem" }}>
        {inputFields}

        {props.data[3] !== undefined && (
          <React.Fragment>
            <label className='label has-text-left'>{props.data[3][0]}</label>
            <div className={`dropdown dropdown-button ${showDropdownMenu}`} onBlur={handleShowDropdownMenu}>
              <div className='dropdown-trigger' onClick={handleShowDropdownMenu}>
                <button
                  id={`regDropdownButton`}
                  className='button title is-6'
                  aria-haspopup='true'
                  style={{
                    borderColor: `${props.community.color}`,
                  }}
                >
                  <span>{dropdownValue}</span>
                  <span className='icon is-small'>
                    <i className='fas fa-angle-down' aria-hidden='true'></i>
                  </span>
                </button>
              </div>

              <div
                className='dropdown-menu'
                role='menu'
                style={{
                  minWidth: "60px",
                  overflowY: "auto",
                }}
              >
                <div
                  className='dropdown-content'
                  style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "grey" }}
                >
                  {props.data[3][1].map((community, i) => {
                    return (
                      <a
                        key={community.name}
                        value={community.value}
                        className={`dropdown-item is-size-6 `}
                        onClick={handleCommunityChange}
                      >
                        {community.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </React.Fragment>
        )}

        <div className={`has-content-left ${props.data[3] !== undefined ? "mt-5" : ""}`}>{buttons}</div>
      </div>

      {locName !== "changepassword" && (
        <button className='modal-close is-large button-close' aria-label='close' onClick={props.showModal}></button>
      )}
    </div>
  );
}

export default Modal;
