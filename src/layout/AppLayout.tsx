import React from "react";

import Header from "../components/Header";

function AppLayout (props) {
  return (
    <>
      <Header />
      <div id="__app_wrap">
        <div id="__container">
          {props.children}
        </div>
      </div>
    </>
  );
};

export default AppLayout;
