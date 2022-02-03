import React from "react";

import SideNavigation from "../components/SideNavigation";
function ManageLayout(props) {
  return (
    <>
      <div id="__manage_warp">
        <SideNavigation />
        <div id="__manage_container">{props.children}</div>
      </div>
    </>
  );
}

export default ManageLayout;
