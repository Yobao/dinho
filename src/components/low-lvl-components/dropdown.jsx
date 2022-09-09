import React, { useState, useContext, useEffect } from "react";
import { DropdownTitleContext } from "../../store/user-context";

function DropdownComponent(props) {
  const dropdownButton = document.getElementById("dropdownButton");
  const setTitle = (match, i) => {
    const index = i === undefined ? props.data.length : props.data.length - i;
    const side = match.side;
    const opponent = match.opponent;
    const start = match.start;
    return !side
      ? `${index}. Chelsea - ${opponent} (N) ${start}`
      : side === 1
      ? `${index}. Chelsea - ${opponent} ${start}`
      : `${index}. ${opponent} - Chelsea ${start}`;
  };
  const dropdownTitleContext = useContext(DropdownTitleContext);
  const [previousActiveDropdown, setPreviousActiveDropdown] = useState(null);
  const [showDropdownMenu, setShowDropdownMenu] = useState(null);

  const handleShowDropdownMenu = (e) => {
    if (showDropdownMenu) {
      setTimeout(() => {
        dropdownButton.blur();
        setShowDropdownMenu(null);
      }, 200);
    } else {
      setShowDropdownMenu("is-active");
    }
  };

  const handleMatchChange = (e) => {
    dropdownTitleContext[1](e.target.innerText);
    if (previousActiveDropdown !== null) previousActiveDropdown.classList.remove("is-active");
    e.target.classList.add("is-active");
    props.matchChange.isLoadingRound();
    props.matchChange.setMatch(`m=${e.target.getAttribute("value")}`);
    setShowDropdownMenu(!showDropdownMenu ? "is-active" : null);
    setPreviousActiveDropdown(e.target);
    props.matchChange.resetPage(1);
  };

  return (
    <div className={`dropdown columns is-right dropdown-button ${showDropdownMenu}`} onBlur={handleShowDropdownMenu}>
      <div className='dropdown-trigger' onClick={handleShowDropdownMenu}>
        <button id={`dropdownButton`} className='button title is-4' aria-haspopup='true'>
          <span>{!dropdownTitleContext[0] ? setTitle(props.data[0], 0) : dropdownTitleContext[0]}</span>
          <span className='icon is-small'>
            <i className='fas fa-angle-down' aria-hidden='true'></i>
          </span>
        </button>
      </div>

      <div
        className='dropdown-menu'
        role='menu'
        style={{
          maxHeight: "22em",
          width: "100%",
          overflowY: "auto",
        }}
      >
        <div className='dropdown-content' style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "grey" }}>
          {props.data.map((match, i) => {
            return (
              <a
                key={`dropdown-${i}-${match.id}`}
                value={match.id}
                className={`dropdown-item is-size-5 ${
                  !i && dropdownTitleContext[0] === null
                    ? "is-active"
                    : setTitle(match, i) === dropdownTitleContext[0]
                    ? "is-active"
                    : ""
                }`}
                onClick={handleMatchChange}
              >
                {setTitle(match, i)}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DropdownComponent;
