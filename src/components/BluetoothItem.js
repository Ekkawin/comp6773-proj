import { IonIcon, IonItem } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import React from "react";

export const BluetoothItem = ({ name }) => {
  return (
    <IonItem>
    <div className="flex justify-between items-center w-full">
      <div>{name}</div>
      <IonIcon icon={addOutline} />
    </div>
    </IonItem>
  );
};
