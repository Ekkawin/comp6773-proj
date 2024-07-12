import { IonContent } from "@ionic/react";
import React from "react";

export const PageWrapper = ({ children }) => {
    return (
        <IonContent className="h-full">
            <div className="px-4 pt-20 overflow-auto">{children}</div>
        </IonContent>
    );
};
