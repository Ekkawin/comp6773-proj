import React, { useCallback, useEffect, useState } from "react";
import { BleClient } from "@capacitor-community/bluetooth-le";
import { Device } from "@capacitor/device";
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonSearchbar,
    IonSpinner,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { SubTitle } from "./Subtitle";
import { BluetoothItem } from "./BluetoothItem";
import { addOutline } from "ionicons/icons";
import { useHistory } from "react-router";

export const AddDevicePage = ({ connectedDevices, setConnectedDevices }) => {
    const [bleDevices, setBleDevice] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const getBle = useCallback(async () => {
        let devices = [];
        const connectedNames = connectedDevices.map(({ name }) => name);
        await BleClient.initialize();

        await BleClient.requestLEScan({}, (result) => {
            if (result.device?.name) {
                const isExist = devices.some(({ name }) => {
                    return (
                        name === result.device?.name &&
                        !connectedNames.include(name)
                    );
                    // return name === result.device?.name;
                });

                if (!isExist) {
                    devices.push({
                        id: result.device.deviceId,
                        name: result.device.name,
                        rssi: result.rssi,
                    });
                    console.log("<--FOUND-->", result);
                    console.log("<--Service Data-->", result.serviceData);
                }
            }
        });

        setTimeout(async () => {
            await BleClient.stopLEScan();
            setBleDevice(devices);
            setIsLoading(false);
            console.log("stopped scanning");
        }, 5000);
    }, [connectedDevices]);

    const logDeviceInfo = useCallback(async () => {
        const info = await Device.getInfo();

        if (info.platform !== "web") {
            await getBle();
        } else {
            setBleDevice([
                { name: "1 - Bluetooth", rssi: "-84" },
                { name: "2 - Bluetooth", rssi: "-85" },
                { name: "3 - Bluetooth", rssi: "-86" },
                { name: "4 - Bluetooth", rssi: "-87" },
                { name: "5 - Bluetooth", rssi: "-88" },
            ]);
            setIsLoading(false);
        }
    }, [getBle]);

    const connectDevice = useCallback(
        async (id, name) => {
            await BleClient.connect(id);
            console.log("connected to device", id);
            const services = await BleClient.getServices(id);

            setConnectedDevices([
                ...connectedDevices,
                { id, name, service: services[0] },
            ]);
            history.push("/device-list");
        },
        [connectedDevices, setConnectedDevices]
    );

    useEffect(() => {
        try {
            setIsLoading(true);
            logDeviceInfo();
        } catch (error) {
            console.warn(error);
            return [];
        }
    }, [logDeviceInfo]);

    console.log("Device ---->", bleDevices);

    return (
        <IonPage>
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>Add new device</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonSearchbar></IonSearchbar>
            <IonContent fullscreen={true}>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Add new device</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <SubTitle>DEVICES CONNECTED TO GATEWAY</SubTitle>
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <IonSpinner />
                    </div>
                ) : (
                    bleDevices.map(({ id, name }) => (
                        <BluetoothItem
                            name={name}
                            icon={
                                <IonIcon
                                    icon={addOutline}
                                    onClick={() => {
                                        setIsLoading(true);
                                        connectDevice(id, name);
                                    }}
                                />
                            }
                        />
                    ))
                )}
                <div
                    className="pt-10 text-base text-center text-blue-700"
                    onClick={() => {
                        setIsLoading(true);
                        logDeviceInfo();
                    }}
                >
                    Press to Refresh
                </div>
            </IonContent>
        </IonPage>
    );
};
