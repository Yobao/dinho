import React, { useState, useEffect } from "react";

function useButton(stateCheck, action) {
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        if (stateCheck) return action();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [stateCheck]);
}

export default useButton;
