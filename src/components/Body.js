import React, { useCallback, useState } from "react";
import { DeviceListPage } from "./DeviceListPage";
import { AddDevicePage } from "./AddDevicePage";
import { DevicePage } from "./DevicePage";
import {
    BleClient,
    dataViewToText,
    textToDataView,
} from "@capacitor-community/bluetooth-le";
import { PublishLogPage } from "./PublishLogPage";
import SettingsPage from "./SettingsPage";
import TestMQTTPage from "./TestMQTTPage";

export const Body = ({ page, setPage, signOut }) => {
    const [connectedDevices, setConnectedDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [data, setData] = useState([]);

    const setLog = useCallback(
        (d) => {
            setData([...data, dataViewToText(d)]);
        },
        [data]
    );

    const publish = useCallback(
        async (deviceId, serviceId, readId, writeId) => {
            await BleClient.startNotifications(
                deviceId,
                serviceId,
                readId,
                setLog
            );

            const id = setInterval(async () => {
                console.log("write");

                await BleClient.write(
                    deviceId,
                    serviceId,
                    writeId,
                    textToDataView("p")
                );
            }, 5000);
            setIntervalId(id);
        },
        [setLog]
    );

    const clearPublish = useCallback(() => {
        clearInterval(intervalId);
    }, [intervalId]);

    switch (page) {
        case "DeviceListPage":
            return (
                <DeviceListPage
                    devices={connectedDevices}
                    setPage={setPage}
                    setSelectedDevice={setSelectedDevice}
                />
            );
        case "AddPage":
            return (
                <AddDevicePage
                    connectedDevices={connectedDevices}
                    setPage={setPage}
                    setConnectedDevices={setConnectedDevices}
                />
            );
        case "DevicePage":
            return (
                <DevicePage
                    device={selectedDevice}
                    publish={publish}
                    clearInterval={clearPublish}
                    setPage={setPage}
                />
            );
        case "PublishLogPage":
            return <PublishLogPage logs={data} />;
        case "SettingsPage":
            return <SettingsPage signOut={signOut} setPage={setPage} />;
        case "TestMQTTPage":
            return <TestMQTTPage />;
        default:
            return <DevicePage device={selectedDevice} />;
    }
};
