import {
  IonItem,
  IonToggle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonLabel,
  IonNote,
  IonSpinner,
  IonItemGroup,
  IonItemDivider,
  IonList,
  IonInput,
} from "@ionic/react";
import { SubTitle } from "./Subtitle";
import React, { useHistory, useLocation } from "react-router";
import { useMemo, useState, useContext, useEffect } from "react";
import { BleClient, textToDataView } from "@capacitor-community/bluetooth-le";
import { DataLogPage } from "./DataLogPage";
import { PublishLogContext } from "../context";
import qs from "query-string";

export const DevicePage = () => {
  const [page, setPage] = useState("DevicePage");
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataInput, setDataInput] = useState("");

  const { connectedDevices, setConnectedDevices } =
    useContext(PublishLogContext);

  const history = useHistory();
  const location = useLocation();

  const { deviceId } = qs.parse(
    location.search
  );

  // const isChecked = useMemo(() => intervalId != 0, [intervalId]);

  const device = useMemo(
    () => connectedDevices?.find(({ id }) => id === deviceId),
    [connectedDevices, deviceId]
  );

  // const publish = async (deviceId, serviceId, readId, writeId) => {
  //   const interval = setInterval(async () => {
  //     await BleClient.write(deviceId, serviceId, writeId, textToDataView("p"));
  //   }, 5000);
  //   setConnectedDevices((prev) => {
  //     const device = prev.find((device) => device.id === deviceId);
  //     return [
  //       ...prev.filter(({ id }) => id !== deviceId),
  //       { ...device, interval },
  //     ];
  //   });

  //   history.replace({
  //     search: `serviceId=${serviceId}&readId=${readId}&writeId=${writeId}&intervalId=${interval}&deviceId=${deviceId}`,
  //   });
  // };

  // const clearPublish = () => {
  //   setConnectedDevices((prev) => {
  //     const device = prev.find((device) => device.id === deviceId);
  //     return [
  //       ...prev.filter(({ id }) => id !== deviceId),
  //       { ...device, interval: 0 },
  //     ];
  //   });
  //   clearInterval(intervalId);
  //   history.replace({
  //     search: `serviceId=${serviceId}&readId=${readId}&writeId=${writeId}&intervalId=0&deviceId=${deviceId}`,
  //   });
  // };
  
  useEffect(() => {
    (async () => {
      // setServices([
      //   {
      //     characteristics: [
      //       {
      //         properties: {
      //           write: true,
      //           writeWithoutResponse: false,
      //           authenticatedSignedWrites: false,
      //           indicate: false,
      //           notify: false,
      //           notifyEncryptionRequired: false,
      //           indicateEncryptionRequired: false,
      //           broadcast: false,
      //           read: false,
      //           extendedProperties: false,
      //         },
      //         descriptors: [],
      //         uuid: "4a981235-1cc4-e7c1-c757-f1267dd021e8",
      //       },
      //       {
      //         properties: {
      //           read: true,
      //           notifyEncryptionRequired: false,
      //           authenticatedSignedWrites: false,
      //           write: false,
      //           broadcast: false,
      //           notify: true,
      //           indicate: false,
      //           indicateEncryptionRequired: false,
      //           extendedProperties: false,
      //           writeWithoutResponse: false,
      //         },
      //         uuid: "4a981236-1cc4-e7c1-c757-f1267dd021e8",
      //         descriptors: [
      //           {
      //             uuid: "00002902-0000-1000-8000-00805f9b34fb",
      //           },
      //         ],
      //       },
      //     ],
      //     uuid: "4a981234-1cc4-e7c1-c757-f1267dd021e8",
      //   },
      // ]);
      const services = await BleClient.getServices(deviceId);
      // console.log("services", services);
      // console.log("isLoading", isLoading);
      setServices(services);
      setIsLoading(false);

      // const serviceId = services[0].uuid;
      // const readId = services[0].characteristics.find(
      //   ({ properties }) => properties.read && properties.notify
      // ).uuid;
      // const writeId = services[0].characteristics.find(
      //   ({ properties }) => properties.write
      // ).uuid;
    })();
  }, [deviceId, setServices, setIsLoading]);

  switch (page) {
    case "DataLogPage":
      return <DataLogPage setPage={setPage} />;
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

            <SubTitle>DEVICE Data</SubTitle>
            {
              isLoading ? (
                <div className="flex justify-center items-center">
                  <IonSpinner />
                </div>
              ) : (
                services.map((service) => {
                  console.log("service", service);
                  console.log("service?.uuid", service?.uuid);
                  console.log("service?.uuid", service?.inde);
                  return (
                    <IonItemGroup key={service?.uuid}>
                      <IonItemDivider>
                        <IonLabel>
                          Service{" "}
                          {service?.uuid?.substring(
                            0,
                            service?.uuid?.indexOf("-")
                          )}
                        </IonLabel>
                      </IonItemDivider>

                      {service.characteristics.map((characteristic) => {
                        if (characteristic.properties?.notify) {
                          return (
                            <IonList>
                              <IonItem>
                                <IonLabel>
                                  char:{" "}
                                  {characteristic?.uuid?.substring(
                                    0,
                                    characteristic?.uuid?.indexOf("-")
                                  )}
                                </IonLabel>
                              </IonItem>
                              <IonItem>
                                <IonToggle
                                  // justify="end"
                                  checked={connectedDevices.find((device) =>
                                    device?.services?.find(
                                      (_service) =>
                                        _service?.id === service.uuid &&
                                        _service?.readId === characteristic.uuid
                                    )
                                  )}
                                  onIonChange={async (e) => {
                                    const writeId = service.characteristics?.find(({ properties}) => properties?.write).uuid
                                    if (e.detail.checked) {
                                      setConnectedDevices((devices) => {
                                        const device = devices.find(
                                          ({ id }) => id === deviceId
                                        );
                                        if (device?.services?.length) {
                                          device?.services.push({
                                            id: service.uuid,
                                            readId: characteristic?.uuid,
                                            writeId
                                          });
                                        } else {
                                          device.services = [
                                            {
                                              id: service.uuid,
                                              readId: characteristic?.uuid,
                                              writeId
                                            },
                                          ];
                                        }

                                        return [
                                          ...devices.filter(
                                            ({ id }) => id !== deviceId
                                          ),
                                          { ...device },
                                        ];
                                      });
                                    } else {
                                      console.log('writeId', writeId);
                                      console.log('deviceId', deviceId);
                                      console.log('service.uuid', service.uuid);
                                      console.log('service.uuid', service);
                                      BleClient.write(
                                        deviceId,
                                        service.uuid,
                                        writeId,
                                        textToDataView("stop")
                                      );
                                      setConnectedDevices((devices) => {
                                        const device = devices.find(
                                          ({ id }) => id === deviceId
                                        );
                                        const _services =
                                          device.services.filter(
                                            ({ id }) => id !== service.uuid
                                          );
                                        device.services = _services;

                                        return [
                                          ...devices.filter(
                                            ({ id }) => id !== deviceId
                                          ),
                                          { ...device },
                                        ];
                                      });

                                    }
                                  }}
                                >
                                  <IonLabel>Enable Data</IonLabel>
                                </IonToggle>
                              </IonItem>
                              <IonItem
                                button={true}
                                onClick={() => {
                                  history.push(
                                    `/device-list/service/${characteristic.uuid}?charId=${characteristic.uuid}`
                                  );
                                }}
                              >
                                <IonLabel>View Log</IonLabel>
                                <IonNote slot="end"></IonNote>
                              </IonItem>
                            </IonList>
                          );
                        } else {
                          return (
                            <IonList>
                              <IonItem>
                                <IonLabel>
                                  char:{" "}
                                  {characteristic?.uuid?.substring(
                                    0,
                                    characteristic?.uuid?.indexOf("-")
                                  )}
                                </IonLabel>
                              </IonItem>
                              <IonItem
                                button={true}
                                onClick={() => {
                                  BleClient.write(
                                    deviceId,
                                    service?.uuid,
                                    characteristic?.uuid,
                                    textToDataView(dataInput)
                                  );
                                }}
                              >
                                <IonInput
                                  label="Data: "
                                  onIonInput={(e) => {
                                    setDataInput(e.target.value);
                                  }}
                                ></IonInput>
                                <IonNote slot="end">Send</IonNote>
                              </IonItem>
                            </IonList>
                          );
                        }
                      })}
                    </IonItemGroup>
                  );
                })
              )

              // <>
              //   <IonItem>
              //     <IonLabel>Enable Data</IonLabel>
              //     <IonToggle
              //       justify="end"
              //       // checked={isChecked}
              //       checked={false}
              //       onIonChange={async (e) => {
              //         // if (e.detail.checked) {
              //         //   publish(deviceId, serviceId, readId, writeId);
              //         // } else {
              //         //   clearPublish();
              //         // }
              //       }}
              //     ></IonToggle>
              //   </IonItem>
              //   <IonItem
              //     button={true}
              //     onClick={() => {
              //       setPage("DataLogPage");
              //     }}
              //   >
              //     <IonLabel>Data Log</IonLabel>
              //     <IonNote slot="end">View</IonNote>
              //   </IonItem>
              // </>
            }
          </IonContent>
        </IonPage>
      );
  }
};
