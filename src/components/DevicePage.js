/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { IonItem, IonSearchbar, IonToggle } from "@ionic/react";
import { css } from "@emotion/react";
import { SubTitle } from "./Subtitle";
import { BluetoothItem } from "./BluetoothItem";
import {
  BleClient,
  dataViewToText,
  textToDataView,
} from "@capacitor-community/bluetooth-le";

export const DevicePage = ({ device, publish, clearInterval, setPage }) => {
  const [intervalId, setIntervalId] = useState(null);

  return (
    <PageWrapper>
      <Title text={device?.name || "Device 1"} />
      <IonItem>
        <IonSearchbar></IonSearchbar>
      </IonItem>

      <SubTitle>DEVICE MQTT PUBLISHING</SubTitle>
      <IonItem>
        <div className="flex justify-between items-center w-full">
          <div>Enable Publishing</div>
          <IonToggle
            justify="end"
            onIonChange={async (e) => {
              if (e.detail.checked) {
                const serviceId = device.service.uuid;
                const readCharId = device.service.characteristics.find(
                  ({ properties }) => properties.read && properties.notify
                ).uuid;
                const writeCharId = device.service.characteristics.find(
                  ({ properties }) => properties.write
                ).uuid;

                publish(device.id, serviceId, readCharId, writeCharId);
              } else {
                clearInterval();
              }
            }}
          />
        </div>
      </IonItem>
      <div className="px-4 pt-2 flex justify-between items-center w-full">
        <div>Publish Log</div>
        <div
          onClick={() => {
            setPage("PublishLogPage");
          }}
        >
          View
        </div>
      </div>

      <div className="pt-10">
        <SubTitle>DEVICE MQTT SUBSCRIBING</SubTitle>
        <IonItem>
          <div className="flex justify-between items-center w-full">
            <div className="w-full">Enable Subscribing</div>
            <IonToggle />
          </div>
        </IonItem>
        <div className="px-4 pt-2 flex justify-between items-center w-full">
          <div>Subscription Log</div>
          <div>View</div>
        </div>
      </div>
    </PageWrapper>
  );
};
