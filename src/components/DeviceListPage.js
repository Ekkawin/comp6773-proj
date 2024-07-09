/** @jsxImportSource @emotion/react */
import React from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { IonItem, IonSearchbar } from "@ionic/react";

import { SubTitle } from "./Subtitle";
import { BluetoothItem } from "./BluetoothItem";

export const DeviceListPage = ({ devices, setPage,setSelectedDevice }) => {
  console.log("<><><>Device<><><>", devices);
  return (
    <PageWrapper>
      <Title text={"Connected devices"} />
      <IonItem>
        <IonSearchbar></IonSearchbar>
      </IonItem>
      
      <SubTitle>DEVICES CONNECTED TO GATEWAY</SubTitle>
      {devices.map((device)=> <BluetoothItem name={device.name} icon={<div onClick={() => {
        setSelectedDevice(device)
        setPage("DevicePage")
      }}>View</div>}/>)}
      <div
        className="pt-10 text-base text-center text-blue-700"
        onClick={() => {
          setPage("AddPage");
        }}
      >
        Add New IoT
      </div>
    </PageWrapper>
  );
};
