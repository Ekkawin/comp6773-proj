import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonPage,
  IonButtons,
  IonButton,
  IonToggle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import React, { useContext, useMemo, useState } from "react";
import { PublishLogContext } from "../context";

export const PublishPage = ({ setPage, selectedDeviceId }) => {
  const [publishTopic, setPublishTopic] = useState("");

  const { connectedDevices, setConnectedDevices, data } =
    useContext(PublishLogContext);

  const logs = useMemo(() => {
    const l = data?.find(({ id }) => id === selectedDeviceId);

    if (l) {
      return l.logs;
    }

    return [];
  }, [selectedDeviceId, data]);

  const isPublished = useMemo(() => {
    const device = connectedDevices?.find(({ id }) => id === selectedDeviceId);
    return device?.topic;
  }, [connectedDevices, selectedDeviceId]);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Publish logs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonButtons collapse={true} slot="start">
            <IonButton
              onClick={() => {
                setPage("DevicePage");
              }}
            >
              {"< Device"}
            </IonButton>
          </IonButtons>
          <IonToolbar>
            <IonTitle size="large">Publish logs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList inset={true}>
          <IonItem>
            <IonInput
              label={"Topic"}
              placeholder={"Enter topic to publish to"}
              onIonInput={(e) => {
                setPublishTopic(e.target.value);
              }}
            />
          </IonItem>
          <IonItem>
            <IonToggle
              checked={isPublished}
              onIonChange={(e) => {
                const device = connectedDevices.find(
                  ({ id }) => selectedDeviceId === id
                );
                console.log("selectedDeviceId", selectedDeviceId);
                console.log("device", device);
                if (e.detail.checked) {
                  setConnectedDevices((prev) => [
                    ...prev.filter(({ id }) => id !== selectedDeviceId),
                    { ...device, topic: publishTopic },
                  ]);
                } else {
                  setConnectedDevices((prev) => [
                    ...prev.filter(({ id }) => id !== selectedDeviceId),
                    { ...device, topic: null },
                  ]);
                }
              }}
            >
              <IonLabel>Publish</IonLabel>
            </IonToggle>
          </IonItem>
        </IonList>

        <IonCard color="light">
          <IonCardHeader>
            <IonCardTitle>Logs</IonCardTitle>
          </IonCardHeader>
          <IonCardContent color="light">
            <IonList color="light" inset lines="none">
              {logs.map((d) => (
                <IonItem color="light">
                  <IonLabel>{d}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
