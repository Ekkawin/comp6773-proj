import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonPage,
  IonToggle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonButtons,
} from "@ionic/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { PublishLogContext } from "../context";
import { useLocation } from "react-router";
import qs from "query-string";

export const PublishPage = () => {
  const location = useLocation();

  const { deviceId: selectedDeviceId, serviceId } = qs.parse(location.search);
  const [publishTopic, setPublishTopic] = useState(null);

  const { connectedDevices, setConnectedDevices, data } =
    useContext(PublishLogContext);

  const logs = useMemo(() => {
    const charId = connectedDevices
    .find(({ id }) => selectedDeviceId === id)
    ?.services?.find((service) => service?.id === serviceId)?.readId

    const l = data.find(({ charId:id }) => id === charId);

    if (l) {
      return l.logs;
    }

    return [];
  }, [selectedDeviceId, data, connectedDevices, serviceId]);

  // const isPublished = useMemo(() => {
  //   const device = connectedDevices?.find(({ id }) => id === selectedDeviceId);
  //   return device?.topics;
  // }, [connectedDevices, selectedDeviceId]);

  useEffect(() => {
    const device = connectedDevices
      .find(({ id }) => selectedDeviceId === id)
      ?.services?.find((service) => service?.id === serviceId);

    console.log("device", device);
    if (device) {
      setPublishTopic(device?.topic);
    }
  }, [connectedDevices, selectedDeviceId, serviceId]);

  console.log("publishTopics?.length", publishTopic);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Publish logs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Publish logs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList inset={true}>
      
              <IonItem>
                <IonInput
                  label={"Topic"}
                  value={publishTopic || ""}
                  placeholder={"Enter topic to publish to"}
                  onIonInput={(e) => {
                    setPublishTopic([e.target.value]);
                  }}
                />
              </IonItem>
              <IonItem>
                <IonToggle
                  checked={connectedDevices
                    ?.find(({ id }) => id === selectedDeviceId)
                    ?.services?.find((service) => service?.id === serviceId)?.topic}
                  onIonChange={(e) => {
                    console.log("selectedDeviceId", selectedDeviceId);
                    // console.log("device", device);
                    const device = connectedDevices?.find(
                      ({ id }) => selectedDeviceId === id
                    );
                    const service = device?.services?.find(
                      ({ id }) => id === serviceId
                    );
                    const _service = device?.services?.filter(
                      ({ id }) => id !== serviceId
                    );
                    
                    if (e.detail.checked) {
                      service.topic = publishTopic;
                      const services = [service, ..._service];
                      setConnectedDevices((prev) => [
                        ...prev.filter(({ id }) => id !== selectedDeviceId),
                        { ...device, services },
                      ]);
                    } else {
                      service.topic = null;
                      const services = [service, _service];
                      setConnectedDevices((prev) => [
                        ...prev.filter(({ id }) => id !== selectedDeviceId),
                        { ...device, services },
                      ]);
                    }
                  }}
                >
                  <IonLabel>Publish</IonLabel>
                </IonToggle>
              </IonItem>
          
        </IonList>

        <IonCard color="light">
          <IonCardHeader>
            <IonCardTitle>Logs</IonCardTitle>
          </IonCardHeader>
          <IonCardContent color="light">
            <IonList color="light" inset lines="none">
              {logs.map((d) => (
                <IonItem color="light">
                  <IonLabel>{d}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
