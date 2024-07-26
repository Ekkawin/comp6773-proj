import {
  IonItem,
  IonSearchbar,
  IonToggle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonLabel,
  IonNote,
} from "@ionic/react";
import { SubTitle } from "./Subtitle";
import React, { useHistory, useLocation } from "react-router";
import { useMemo, useState, useContext } from "react";
import { BleClient, textToDataView } from "@capacitor-community/bluetooth-le";
import { DataLogPage } from "./DataLogPage";
import { PublishLogContext } from "../context";
import qs from "query-string";

export const DevicePage = () => {
  const [page, setPage] = useState("DevicePage");

  const { connectedDevices, setConnectedDevices } =
    useContext(PublishLogContext);

  const history = useHistory();
  const location = useLocation();

  const { readId, writeId, intervalId, serviceId, deviceId } = qs.parse(
    location.search
  );

  const isChecked = useMemo(() => intervalId != 0, [intervalId]);

  const device = useMemo(
    () => connectedDevices?.find(({ id }) => id === deviceId),
    [connectedDevices, deviceId]
  );

  const publish = async (deviceId, serviceId, readId, writeId) => {
    const interval = setInterval(async () => {
      await BleClient.write(deviceId, serviceId, writeId, textToDataView("p"));
    }, 5000);
    setConnectedDevices((prev) => {
      const device = prev.find((device) => device.id === deviceId);
      return [
        ...prev.filter(({ id }) => id !== deviceId),
        { ...device, interval },
      ];
    });

    history.replace({
      search: `serviceId=${serviceId}&readId=${readId}&writeId=${writeId}&intervalId=${interval}&deviceId=${deviceId}`,
    });
  };

  const clearPublish = () => {
    setConnectedDevices((prev) => {
      const device = prev.find((device) => device.id === deviceId);
      return [
        ...prev.filter(({ id }) => id !== deviceId),
        { ...device, interval: 0 },
      ];
    });
    clearInterval(intervalId);
    history.replace({
      search: `serviceId=${serviceId}&readId=${readId}&writeId=${writeId}&intervalId=0&deviceId=${deviceId}`,
    });
  };

  switch (page) {
    case "DataLogPage":
      return <DataLogPage setPage={setPage} />;
    default:
      return (
        <IonPage>
          <IonHeader translucent={true}>
            <IonToolbar>
              <IonTitle>{device?.name || "Device 1"}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen={true}>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">{device?.name || "Device 1"}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonSearchbar></IonSearchbar>

            <SubTitle>DEVICE Data</SubTitle>
            <IonItem>
              <IonLabel>Enable Data</IonLabel>
              <IonToggle
                justify="end"
                checked={isChecked}
                onIonChange={async (e) => {
                  if (e.detail.checked) {
                    publish(deviceId, serviceId, readId, writeId);
                  } else {
                    clearPublish();
                  }
                }}
              ></IonToggle>
            </IonItem>
            <IonItem
              button={true}
              onClick={() => {
                setPage("DataLogPage");
              }}
            >
              <IonLabel>Data Log</IonLabel>
              <IonNote slot="end">View</IonNote>
            </IonItem>
          </IonContent>
        </IonPage>
      );
  }
};
