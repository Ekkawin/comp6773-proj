/** @jsxImportSource @emotion/react */

import {
    IonSearchbar,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonPage,
} from "@ionic/react";

import { SubTitle } from "./Subtitle";
import { BluetoothItem } from "./BluetoothItem";
import { useHistory } from "react-router";

export const DeviceListPage = ({ devices, setSelectedDevice }) => {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>Connected devices</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true}>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Connected devices</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonSearchbar></IonSearchbar>

                <SubTitle>DEVICES CONNECTED TO GATEWAY</SubTitle>
                {devices.map((device) => (
                    <BluetoothItem
                        name={device.name}
                        icon={
                            <div
                                onClick={() => {
                                    setSelectedDevice(device);
                                    history.push("/device");
                                }}
                            >
                                View
                            </div>
                        }
                    />
                ))}
                <div
                    className="pt-10 text-base text-center text-blue-700"
                    onClick={() => {
                        history.push("/device-list/add-device");
                    }}
                >
                    Add New IoT
                </div>
            </IonContent>
        </IonPage>
    );
};
