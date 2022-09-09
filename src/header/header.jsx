import React from "react";
import NavbarComponent from "./navbar/navbar";

function HeaderComponent(props) {
  return (
    <div className='columns is-centered is-6 px-4 mt-4'>
      <NavbarComponent />
    </div>
  );
}

export default HeaderComponent;
