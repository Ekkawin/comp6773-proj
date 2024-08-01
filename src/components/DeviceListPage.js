import {
  IonSearchbar,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonItem,
  IonLabel,
  IonNote,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/react";

import { SubTitle } from "./Subtitle";
import React, { useHistory } from "react-router";
import { useContext } from "react";
import { PublishLogContext } from "../context";
import { BleClient } from "@capacitor-community/bluetooth-le";

export const DeviceListPage = () => {
  const history = useHistory();

  const {connectedDevices: devices, setConnectedDevices} = useContext(PublishLogContext)

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Connected devices</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Connected devices</IonTitle>
          </IonToolbar>
        </IonHeader>

        <SubTitle>DEVICES CONNECTED TO GATEWAY</SubTitle>
        <IonList>
          {devices?.map((device) => (
              <IonItemSliding>
             
            <IonItem
              button={true}
              onClick={() => {
                history.push(
                  // `/device-list/device/${device.id}?serviceId=${device.service.id}&readId=${device.service.readId}&writeId=${device.service.writeId}&intervalId=${device.interval}&deviceId=${device.id}`
                  `/device-list/device/${device.id}?deviceId=${device.id}`
                );
              }}
            >
              <IonLabel>{device?.name}</IonLabel>
              <IonNote slot="end">View</IonNote>
            </IonItem>

            <IonItemOptions>
                <IonItemOption
                  color="danger"
                  onClick={() => {
                    BleClient.disconnect(device.id);
                    setConnectedDevices((prev)=> prev.filter(({id}) => id !== device.id))
                  }}
                >
                  Disconnect
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>

          ))}
        </IonList>
        <div
          className="pt-10 text-base text-center text-blue-700"
          onClick={() => {
            history.push("/device-list/add-device");
          }}
        >
          Add New IoT
        </div>
      </IonContent>
    </IonPage>
  );
};
