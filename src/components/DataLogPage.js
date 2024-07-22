import React, { useContext, useMemo } from "react";
import {
  IonSearchbar,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonButtons,
  IonButton,
  IonBackButton,
} from "@ionic/react";
import { SubTitle } from "./Subtitle";
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
          <IonButtons
            slot="start"
           
          >
            <IonBackButton defaultHref="#"  onClick={() => {
              setPage("DevicePage");
            }}></IonBackButton>
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

        <IonSearchbar></IonSearchbar>

        <SubTitle>Logs</SubTitle>
        {logs.map((d) => (
          <div>{d}</div>
        ))}
        <div className="pt-10 text-base text-center text-blue-700">
          Press to Refresh
        </div>
      </IonContent>
    </IonPage>
  );
};
