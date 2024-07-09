import { IonItem } from "@ionic/react";
import React from "react";

export const BluetoothItem = ({ name, icon }) => {
  return (
    <IonItem>
    <div className="flex justify-between items-center w-full">
      <div>{name}</div>
      {icon}
    </div>
    </IonItem>
  );
};
