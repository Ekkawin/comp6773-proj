/** @jsxImportSource @emotion/react */
import {
  IonItem,
  IonSearchbar,
  IonToggle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
} from "@ionic/react";
import { SubTitle } from "./Subtitle";
import { useHistory, useLocation } from "react-router";
import { useCallback, useMemo, useState } from "react";
import {
  BleClient,
  dataViewToText,
  textToDataView,
} from "@capacitor-community/bluetooth-le";
import { PublishLogPage } from "./PublishLogPage";
import qs from "query-string";

export const DevicePage = ({ device, setPublishedDevices }) => {
  const [page, setPage] = useState("DevicePage");
  const [logs, setLogs] = useState([]);
  const history = useHistory();
  // const params = useParams();
  const location = useLocation();

  

  // const { deviceId } = params;
  const { readId, writeId, intervalId, serviceId,deviceId } = qs.parse(location.search);
  console.log('intervalId', intervalId)

  // console.log('params', params)
  console.log('location', location)

  const isChecked = useMemo(()=> intervalId != 0,[intervalId])
  console.log('isChecked', isChecked)

  const publish = useCallback(
    async (deviceId, serviceId, readId, writeId) => {

      console.log("deviceId", deviceId);
      await BleClient.startNotifications(deviceId, serviceId, readId, (res) => {
        setLogs((prev) => [...prev, dataViewToText(res)]);
      });

      const intervalId = setInterval(async () => {
        console.log("write");

        await BleClient.write(deviceId, serviceId, writeId, textToDataView("p"));
      }, 5000);
      setPublishedDevices((prev) => [
        ...prev,
        { id: deviceId, interval: intervalId },
      ]);
      // console.log("deviceId", deviceId);
      history.replace({
        search: `serviceId=${serviceId}&readId=${readId}&writeId=${writeId}&intervalId=${intervalId}&deviceId=${deviceId}`
      });
    },
    [history, setPublishedDevices]
  );

  const clearPublish = useCallback(() => {
    setPublishedDevices((prev) =>
      prev.filter((prev) => prev.id !== deviceId)
    );
    clearInterval(intervalId);
    history.replace({
      search: `serviceId=${serviceId}&readId=${readId}&writeId=${writeId}&intervalId=0&deviceId=${deviceId}`
    });
  }, [intervalId, history, readId,writeId,setPublishedDevices,serviceId,deviceId]);

  switch (page) {
    case "PublishLogPage":
      return <PublishLogPage logs={logs} setPage={setPage} />;
    default:
      return (
        <IonPage>
          <IonHeader translucent={true}>
            <IonToolbar>
              <IonTitle>{device?.name || "Device 1"}</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent fullscreen={true}>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">{device?.name || "Device 1"}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonSearchbar></IonSearchbar>

            <SubTitle>DEVICE MQTT PUBLISHING</SubTitle>
            <IonItem>
              <div className="flex justify-between items-center w-full">
                <div>Enable Publishing</div>
                <IonToggle
                  justify="end"
                  checked={isChecked}
                  onIonChange={async (e) => {
                    if (e.detail.checked) {
                      
                      publish(deviceId, serviceId, readId, writeId);
                    } else {
                      clearPublish()
                    }
                  }}
                />
              </div>
            </IonItem>
            <div className="px-4 pt-2 flex justify-between items-center w-full">
              <div>Publish Log</div>
              <div
                onClick={() => {
                  setPage("PublishLogPage")
                }}
              >
                View
              </div>
            </div>

            <div className="pt-10">
              <SubTitle>DEVICE MQTT SUBSCRIBING</SubTitle>
              <IonItem>
                <div className="flex justify-between items-center w-full">
                  <div className="w-full">Enable Subscribing</div>
                  <IonToggle />
                </div>
              </IonItem>
              <div className="px-4 pt-2 flex justify-between items-center w-full">
                <div>Subscription Log</div>
                <div>View</div>
              </div>
            </div>
          </IonContent>
        </IonPage>
      );
  }
};

