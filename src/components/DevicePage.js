/** @jsxImportSource @emotion/react */
import {
  IonItem,
  IonSearchbar,
  IonToggle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
} from "@ionic/react";
import { SubTitle } from "./Subtitle";
import { useHistory } from "react-router";
import { useEffect, useMemo, useState } from "react";

export const DevicePage = ({
  device,
  publishingDevices,
  setPublishingDevices,
  publish,
  clearPublish,
}) => {

  const [isPublish, setIsPublish] = useState(false)
  const history = useHistory();

  useEffect(()=>{
    setIsPublish(publishingDevices.includes(device.id))
  },[publishingDevices, device])

  console.log("isPublish", isPublish);
  console.log("publishingDevices", publishingDevices);
  console.log("device", device);

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

        <SubTitle>DEVICE MQTT PUBLISHING</SubTitle>
        <IonItem>
          <div className="flex justify-between items-center w-full">
            <div>Enable Publishing</div>
            <IonToggle
              justify="end"
              checked={isPublish}
              onIonChange={async (e) => {
                if (e.detail.checked) {
                  const serviceId = device.service.uuid;
                  const readCharId = device.service.characteristics.find(
                    ({ properties }) => properties.read && properties.notify
                  ).uuid;
                  const writeCharId = device.service.characteristics.find(
                    ({ properties }) => properties.write
                  ).uuid;

                  setIsPublish(!isPublish);
                  setPublishingDevices((d) => [...d,device.id ])
                  publish(device.id, serviceId, readCharId, writeCharId);
                } else {
                  setIsPublish(!isPublish);
                  setPublishingDevices((d) => d.filter(_d => _d !== device.id))
                  clearPublish();
                }
              }}
            />
          </div>
        </IonItem>
        <div className="px-4 pt-2 flex justify-between items-center w-full">
          <div>Publish Log</div>
          <div
            onClick={() => {
              history.push("/device/publish-logs");
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
      </IonContent>
    </IonPage>
  );
};
