/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect } from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { IonItem, IonSearchbar } from "@ionic/react";

import { SubTitle } from "./Subtitle";
import { BluetoothItem } from "./BluetoothItem";
import {
  BleClient,
  dataViewToText,
  textToDataView,
} from "@capacitor-community/bluetooth-le";

export const DevicePage = ({ device }) => {
  const readData = useCallback(async () => {
    // await BleClient.startEnabledNotifications((val)=>{
    //     console.log("IsALLOW", val);
    // })
    console.log("This Device", device);

    await BleClient.connect(device.id);

    const serviceId = device.service.uuid;
    const readCharId = device.service.characteristics.find(
      ({ properties }) => properties.read && properties.notify
    ).uuid;
    const writeCharId = device.service.characteristics.find(
      ({ properties }) => properties.write
    ).uuid;

    await BleClient.startNotifications(
      device.id,
      serviceId,
      readCharId,
      (value) => {
        console.log("current heart rate", dataViewToText(value));
      }
    );

    await BleClient.write(
      device.id,
      serviceId,
      writeCharId,
      textToDataView("p")
    );
    console.log("written [1, 0] to control point");

    // disconnect after 10 sec
    setTimeout(async () => {
      await BleClient.stopNotifications(device.id, serviceId, readCharId);
      await BleClient.disconnect(device.id);
      console.log("disconnected from device", device);
    }, 10000);
  }, []);

  useEffect(() => {
    readData();
  }, []);

  return (
    <PageWrapper>
      <Title text={device.name} />
      <IonItem>
        <IonSearchbar></IonSearchbar>
      </IonItem>

      <SubTitle>DEVICES CONNECTED TO GATEWAY</SubTitle>

      {/* <div
        className="pt-10 text-base text-center text-blue-700"
        onClick={() => {
          setPage("AddPage");
        }}
      >
        Add New IoT
      </div> */}
    </PageWrapper>
  );
};
