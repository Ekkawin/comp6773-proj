import React, { useCallback, useEffect, useMemo, useState } from "react";
import { css } from "@emotion/react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { BleClient } from "@capacitor-community/bluetooth-le";
import { Device } from "@capacitor/device";
import { IonItem, IonSearchbar, IonSpinner } from "@ionic/react";
import { SubTitle } from "./Subtitle";
import { BluetoothItem } from "./BluetoothItem";

export const AddNewDevice = ({ setPage }) => {
  const [bleDevices, setBleDevice] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getBle = useCallback(async () => {
    let devices = [];
    await BleClient.initialize();

    await BleClient.requestLEScan({}, (result) => {
      if (result.device?.name) {
        const isExist = devices.some(({ name }) => {
          return name === result.device?.name;
        });

        if (!isExist) {
          devices.push({ name: result.device.name, rssi: result.rssi });
          console.log("<--FOUND-->", devices);
        }
      }
    });

    setTimeout(async () => {
      await BleClient.stopLEScan();
      setBleDevice(devices);
      setIsLoading(false);
      console.log("stopped scanning");
    }, 5000);
  }, []);

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
  }, []);

  useEffect(() => {
    try {
      setIsLoading(true);
      logDeviceInfo();
    } catch (error) {
      console.warn(error);
      return [];
    }
  }, []);

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
        bleDevices.map(({ name }) => <BluetoothItem name={name} />)
      )}
      <div
        className="pt-10 text-base text-center text-blue-700"
        onClick={() => {
          setPage("AddPage");
        }}
      >
        Press to Refresh
      </div>
    </PageWrapper>
  );
};
