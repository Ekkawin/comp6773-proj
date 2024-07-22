/** @jsxImportSource @emotion/react */

import {
  IonSearchbar,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonItem,
  IonIcon,
  IonLabel,
  IonNote,
  IonList,
} from "@ionic/react";

import { SubTitle } from "./Subtitle";
import { BluetoothItem } from "./BluetoothItem";
import { useHistory } from "react-router";

export const DeviceListPage = ({
  devices,
}) => {
  const history = useHistory();

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

        <IonSearchbar></IonSearchbar>

        <SubTitle>DEVICES CONNECTED TO GATEWAY</SubTitle>
        <IonList>
          {devices?.map((device) => (
            <IonItem
              button={true}
              onClick={() => {
                history.push(
                  `/device/${device.id}?serviceId=${device.service.id}&readId=${device.service.readId}&writeId=${device.service.writeId}&intervalId=${device.interval}&deviceId=${device.id}`
                );
              }}
            >
              <IonLabel>{device.name}</IonLabel>
              <IonNote slot="end">View</IonNote>
            </IonItem>

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
