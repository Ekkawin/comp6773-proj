import React, { useState } from "react";
import {  DeviceListPage } from "./DeviceListPage";
import { AddDevicePage } from "./AddDevicePage";
import { DevicePage } from "./DevicePage";

export const Body = ({ page, setPage }) => {
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  console.log("connected Devives", connectedDevices);

  switch (page) {
    case "DeviceListPage":
      return <DeviceListPage devices={connectedDevices} setPage={setPage} setSelectedDevice={setSelectedDevice} />;
    case "AddPage":
      return (
        <AddDevicePage
          connectedDevices={connectedDevices}
          setPage={setPage}
          setConnectedDevices={setConnectedDevices}
        />
      );
    case "DevicePage":
      return (
        <DevicePage
          device={selectedDevice}
        />
      );
    default:
      return <div>hellp</div>;
  }
};
