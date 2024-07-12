import React, { useCallback, useMemo, useState } from "react";
import { DeviceListPage } from "./DeviceListPage";
import { AddDevicePage } from "./AddDevicePage";
import { DevicePage } from "./DevicePage";
import {
  BleClient,
  dataViewToText,
  textToDataView,
} from "@capacitor-community/bluetooth-le";
import { PublishLogPage } from "./PublishLogPage";
import { SubscriptionLogPage } from "./SubscriptionLogPage";

export const Body = ({ page, setPage }) => {
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [data, setData] = useState([]);
  const [publishDevices, setPublishDevices] = useState([]);

  const isPublished = useMemo(() => {
    return publishDevices.includes(selectedDevice?.id);
  }, [selectedDevice, publishDevices]);

  let responses = [];
  const publish = useCallback(
    async (deviceId, serviceId, readId, writeId) => {
      await BleClient.startNotifications(deviceId, serviceId, readId, (d) => {
        responses.push(dataViewToText(d));
      });

      const id = setInterval(async () => {
        setData([...responses]);
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
    [data, publishDevices]
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
          isPublished={isPublished}
          setPublishDevices={setPublishDevices}
          publish={publish}
          clearInterval={clearPublish}
          setPage={setPage}
        />
      );
    case "PublishLogPage":
      return <PublishLogPage logs={data} setPage={setPage}/>;
    case "SubscriptionLogPage":
      return <SubscriptionLogPage setPage={setPage}/>;
    default:
      return <PublishLogPage logs={[]} setPage={setPage} />;
  }
};
