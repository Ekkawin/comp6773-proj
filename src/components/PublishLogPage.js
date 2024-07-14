import React, { useEffect, useState } from "react";
import {
  IonSearchbar,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
} from "@ionic/react";
import { SubTitle } from "./Subtitle";
import {
  BleClient,
  dataViewToText,
  textToDataView,
} from "@capacitor-community/bluetooth-le";

export const PublishLogPage = ({
  logs,
  publishService,
  publishingDevices,
  selectedDevice,
  publish,
  clearPublish,
  setGlobalData,
}) => {
  const [data, setData] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    setData(logs);

    if (publishingDevices.includes(selectedDevice.id)) {
      clearPublish();
      (async () => {
        await BleClient.startNotifications(
          publishService.deviceId,
          publishService.serviceId,
          publishService.readId,
          (res) => {
            setData((d) => {
              console.log("---->data<----", d);
              console.log("---->res<----", dataViewToText(res));
              return [...d, dataViewToText(res)];
            });
          }
        );

        const id = setInterval(async () => {
          console.log("write");

          await BleClient.write(
            publishService.deviceId,
            publishService.serviceId,
            publishService.writeId,
            textToDataView("p")
          );
        }, 5000);
        setIntervalId(id);
      })();
    }

    return () => {
      if (publishingDevices.includes(selectedDevice.id)) {
        publish(
          selectedDevice.id,
          publishService.serviceId,
          publishService.readId,
          selectedDevice.writeId
        );
      }
    };
  }, []);

  useEffect(() => {
    return () => {
        console.log("CLEAR DATA", intervalId);
      clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    return () => {
        console.log("CLEAR DATA");
      setGlobalData(data);
    };
  }, [data, setGlobalData]);

  console.log("log--->", logs);
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Publish logs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Publish logs</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSearchbar></IonSearchbar>

        <SubTitle>Logs</SubTitle>
        {data.map((d) => (
          <div>{d}</div>
        ))}
        <div className="pt-10 text-base text-center text-blue-700">
          Press to Refresh
        </div>
      </IonContent>
    </IonPage>
  );
};
