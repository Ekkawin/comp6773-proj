import React, { useCallback, useEffect, useState } from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { BleClient } from "@capacitor-community/bluetooth-le";
import { Device } from "@capacitor/device";
import { IonIcon, IonItem, IonSearchbar, IonSpinner } from "@ionic/react";
import { SubTitle } from "./Subtitle";
import { BluetoothItem } from "./BluetoothItem";
import { addOutline } from "ionicons/icons";

export const AddDevicePage = ({
    connectedDevices,
    setPage,
    setConnectedDevices,
}) => {
    const [bleDevices, setBleDevice] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
            setPage("DeviceListPage");
        },
        [connectedDevices, setConnectedDevices, setPage]
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
        <PageWrapper>
            <Title text={"Add new devices"} />
            <IonItem>
                <IonSearchbar></IonSearchbar>
            </IonItem>

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
        </PageWrapper>
    );
};
