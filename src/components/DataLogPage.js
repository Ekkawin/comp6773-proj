import React, { useContext, useMemo } from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { useLocation } from "react-router";
import qs from "query-string";
import { PublishLogContext } from "../context";

export const DataLogPage = ({ setPage }) => {
  const { data } = useContext(PublishLogContext);
  console.log("data", data);

  const location = useLocation();
  const { deviceId } = qs.parse(location.search);
  console.log("deviceId", deviceId);

  const logs = useMemo(() => {
    const l = data.find(({ id }) => id === deviceId);

    if (l) {
      return l.logs;
    }

    return [];
  }, [deviceId, data]);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="#"
              onClick={() => {
                setPage("DevicePage");
              }}
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Data logs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Publish logs</IonTitle>
          </IonToolbar>
        </IonHeader>

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
