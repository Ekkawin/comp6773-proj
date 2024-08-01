import "./App.css";
import React, { useEffect, useState } from "react";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router";
import { phonePortraitOutline, cogOutline, cloudOutline } from "ionicons/icons";

import { DeviceListPage } from "./components/DeviceListPage";
import { AddDevicePage } from "./components/AddDevicePage";
import { DevicePage } from "./components/DevicePage";
import SettingsPage from "./components/SettingsPage";
import { MQTTPage } from "./components/MQTTPage";
import { PublishLogContext } from "./context";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Amplify */
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import amplifyconfig from "./amplifyconfiguration.json";

import { BleClient, dataViewToText, textToDataView } from "@capacitor-community/bluetooth-le";
import TestMQTTPage from "./components/TestMQTTPage";
import { PublishPage } from "./components/PublishPage";
import { DataLogPage } from "./components/DataLogPage";

Amplify.configure(amplifyconfig);

function App() {
  setupIonicReact();

  const [connectedDevices, setConnectedDevices] = useState([
    // {
    //   name: "1",
    //   id: "1231231283912",
    //   isReceivingData: false,
    //   topics: [],
    //   services: [{ id: "123sadf", readId: "sdfg234", writeId: "123sdf234" }],
    // },
    // {
    //   name: "21",
    //   id: "123221231283912",
    //   isReceivingData: false,
    //   topics: [],
    //   services: [
    //     {
    //       id: "123sasdadf",
    //       readId: "sdfsdfgg2asd34",
    //       writeId: "123asdasdsdf234",
    //     },
    //   ],
    // },
  ]);

  const [data, setData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [publishData, setPublishData] = useState({});
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  useEffect(() => {
    BleClient.initialize();
  }, []);

  // console.log("connectedDevices", connectedDevices);

  useEffect(() => {
    connectedDevices?.forEach((device) => {
      console.log("device?.services", device);
      if (device?.services?.length) {
        device?.services?.forEach((service) => {
          if (service?.readId) {
            BleClient.startNotifications(
              device.id,
              service.id,
              service.readId,
              (res) => {
                setData((prev) => {
                  const deviceData = prev.find(
                    ({ charId }) => charId === service.readId
                  );
                  if (deviceData) {
                    deviceData.logs.push(dataViewToText(res));
                    const _prev = prev.filter(
                      ({ charId }) => charId !== service.readId
                    );
                    return [..._prev, deviceData];
                  }
                  return [
                    ...prev,
                    { charId: service.readId, logs: [dataViewToText(res)] },
                  ];
                });
                if (service?.topic) {
                  setPublishData({
                    topic: service.topic,
                    message: dataViewToText(res),
                  });
                }
              }
            );
          }
        });
      }
    });
    return () => {
      connectedDevices?.forEach((device) => {
        // console.log("device112", device);
        if (device?.services) {
          device?.services?.forEach((service) => {
            // BleClient.write(
            //   device.id,
            //   service.id,
            //   service?.writeId,
            //   textToDataView("stop")
            // );
            console.log("service.readId", service.readId);
            BleClient.stopNotifications(device.id, service.id, service.readId);
          });
        } 
      });
    };
  }, [connectedDevices]);

  return (
    <Authenticator className="mt-10">
      {({ signOut }) => {
        return (
          <IonApp>
            <PublishLogContext.Provider
              value={{
                data,
                connectedDevices,
                setConnectedDevices,
                messages,
                setMessages,
                publishData,
                subscribedTopics,
                setSubscribedTopics,
              }}
            >
              <IonReactRouter>
                <IonTabs>
                  <IonRouterOutlet>
                    <Redirect to="/device-list" />
                    <Route
                      path="/device-list"
                      component={DeviceListPage}
                      exact={true}
                    />
                    <Route
                      path="/device-list/add-device"
                      component={AddDevicePage}
                      exact={true}
                    />
                    <Route
                      path="/device-list/device/:deviceId"
                      component={DevicePage}
                      exact={true}
                    />
                    <Route
                      path="/device-list/service/:serviceId"
                      component={DataLogPage}
                      exact={true}
                    />
                    <Route
                      path="/settings"
                      render={() => <SettingsPage signOut={signOut} />}
                      exact={true}
                    />
                    <Route
                      path="/mqtt-test-client1"
                      render={() => (
                        <TestMQTTPage
                          setConnectedDevices={setConnectedDevices}
                        />
                      )}
                      exact={true}
                    />
                    <Route
                      path="/mqtt-test-client"
                      component={MQTTPage}
                      exact={true}
                    />
                    <Route
                      path="/mqtt-test-client/:deviceId"
                      component={PublishPage}
                      exact={true}
                    />
                    <Route exact path="/">
                      <Redirect to={"/device-list"} />
                    </Route>
                    <Route>
                      <Redirect to={"/device-list"} />
                    </Route>
                  </IonRouterOutlet>
                  <IonTabBar slot="bottom">
                    <IonTabButton tab="device-list" href="/device-list">
                      <IonIcon icon={phonePortraitOutline} />
                      <IonLabel>Devices</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="aws-cloud" href="/mqtt-test-client">
                      <IonIcon icon={cloudOutline} />
                      <IonLabel>Cloud</IonLabel>
                    </IonTabButton>

                    {/* <IonTabButton tab="aws-cloud1" href="/mqtt-test-client1">
                      <IonIcon icon={cloudOutline} />
                      <IonLabel>Cloud</IonLabel>
                    </IonTabButton> */}

                    <IonTabButton tab="settings" href="/settings">
                      <IonIcon icon={cogOutline} />
                      <IonLabel>Settings</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              </IonReactRouter>
            </PublishLogContext.Provider>
          </IonApp>
        );
      }}
    </Authenticator>
  );
}

export default App;
