import React from "react";
import Header from "./common/header";
import Tablelist from "./common/table";
import TableData from "./common/dailyupdate";
import WorldMap from "./common/map";

export default function Manage(props) {
  return (
    <React.Fragment>
      <Header />

      {props.location.pathname.split("/")[1] === "daily-update" ? (
        <TableData {...props} />
      ) : props.location.pathname.split("/")[1] === "coronavirus-pandemic" ? (
        <WorldMap />
      ) : (
        <Tablelist {...props} />
      )}
    </React.Fragment>
  );
}
