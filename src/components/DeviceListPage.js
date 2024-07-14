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

export const DeviceListPage = ({
  devices,
  setSelectedDevice,
  publishedDevices,
}) => {
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
                    console.log("CLICK");
                  const interval = (() => {
                    console.log('publishedDevices', publishedDevices)
                    const publishedDevice = publishedDevices?.find(
                      ({ id }) => id === device.id
                    );
                    console.log('device---->', publishedDevice)
                    if (publishedDevice){
                        console.log('device---->', publishedDevice)
                        return publishedDevice.interval
                    }else{
                        return 0
                    }
                  })();
                  setSelectedDevice(device);
                  console.log('device.id', device.id)
                  console.log('interval', interval)
                  history.push(
                    `/device/${device.id}?serviceId=${device.service.id}&readId=${device.service.readId}&writeId=${device.service.writeId}&intervalId=${interval}&deviceId=${device.id}`
                  );
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
