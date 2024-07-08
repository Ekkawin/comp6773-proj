import React, { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { BleClient } from "@capacitor-community/bluetooth-le";

export const AddNewDevice = ({ setPage }) => {
  const [bleDevices, setBleDevice] = useState([]);

  useEffect(() => {
    try {
      const getBle = async () => {
        await BleClient.initialize();

        await BleClient.requestLEScan({}, (result) => {
          if (result.device?.name) {
            const isExist = bleDevices.some(({ name }) => {
              return name === result.device?.name;
            });

            if (!isExist) {
              setBleDevice([
                ...bleDevices,
                { name: result.device.name, rssi: result.rssi },
              ]);
              console.log(bleDevices);
            }
          }
        });

        setTimeout(async () => {
          await BleClient.stopLEScan();
          console.log("stopped scanning");
        }, 5000);
      };

      getBle();
    } catch (error) {
      console.warn(error);
      return [];
    }
  }, [bleDevices]);

  console.log("<----- devices ------>", bleDevices);

  return (
    <PageWrapper>
      <Title text={"Add new devices"} />
      {bleDevices.map(({ name, rssi }) => {
        console.log("THIS IS THE CONSOLE", name);
        return <div>{name}   {rssi}</div>;
      })}

      {/* <div className="text-base text-center text-blue-700" onClick={() => {setPage("AddPage")}}>Add New IoT</div> */}
    </PageWrapper>
  );
};
