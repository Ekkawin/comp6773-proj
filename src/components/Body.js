
import React from "react";
import { ConnectedDevice } from "./ConnectedDevice";
import { AddNewDevice } from "./AddNewDevice";

export const Body = ({page, setPage}) => {
    
        switch (page) {
          case "DevicePage":
            return <ConnectedDevice setPage={setPage} />
          case "AddPage":
            return <AddNewDevice setPage={setPage} />
          default:
            return <div>hellp</div>;
        }
      
}