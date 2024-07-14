import React from "react";

import {
  IonItem,
  IonSearchbar,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonButtons,
  IonButton,
} from "@ionic/react";
import { SubTitle } from "./Subtitle";

export const PublishLogPage = ({ logs,setPage }) => {
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
              <IonButton onClick={()=>{
                setPage("DevicePage")
              }}>{"< Device"}</IonButton>
            </IonButtons>
          <IonToolbar>
            
            <IonTitle size="large">Publish logs</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSearchbar></IonSearchbar>

        <SubTitle>Logs</SubTitle>
        {logs.map((data) => (
          <div>{data}</div>
        ))}
        <div className="pt-10 text-base text-center text-blue-700">
          Press to Refresh
        </div>
      </IonContent>
    </IonPage>
  );
};
