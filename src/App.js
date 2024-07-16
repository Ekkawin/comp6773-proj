import "./App.css";
import React, { createContext, useCallback, useEffect, useState } from "react";
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
import { phonePortraitOutline, cogOutline } from "ionicons/icons";

import { DeviceListPage } from "./components/DeviceListPage";
import { AddDevicePage } from "./components/AddDevicePage";
import { DevicePage } from "./components/DevicePage";
import { PublishLogContext } from "./components/PublishLogPage";
import SettingsPage from "./components/SettingsPage";
import TestMQTTPage from "./components/TestMQTTPage";

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
import { BleClient, dataViewToText } from "@capacitor-community/bluetooth-le";

Amplify.configure(amplifyconfig);

function App() {
  setupIonicReact();

  // const [connectedDevices, setConnectedDevices] = useState([
  //   {
  //     name: "1",
  //     id: "1231231283912",
  //     service: { id: "123sadf", readId: "sdfg234", writeId: "123sdf234" },
  //   },
  // ]);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [data, setData] = useState([]);
  const [publishedDevices, setPublishedDevices] = useState([]);

  useEffect(() => {
    BleClient.initialize();
  }, []);

  useEffect(() => {
    publishedDevices?.forEach(({ id, serviceId, readId }) => {
      BleClient.startNotifications(id, serviceId, readId, (res) => {
        setData((prev) => [...prev, dataViewToText(res)]);
      });
    });

    return () => {
      publishedDevices?.forEach(({ id, serviceId, readId }) => {
        BleClient.stopNotifications(id, serviceId, readId);
      });
    };
  }, [publishedDevices]);

  return (
    <Authenticator className="mt-10">
      {({ signOut }) => {
        return (
          <IonApp>
            <PublishLogContext.Provider value={data}>
              <IonReactRouter>
                <IonTabs>
                  <IonRouterOutlet>
                    <Redirect to="/device-list" />
                    <Route
                      path="/device-list"
                      render={() => (
                        <DeviceListPage
                          devices={connectedDevices}
                          setSelectedDevice={setSelectedDevice}
                          publishedDevices={publishedDevices}
                        />
                      )}
                      exact={true}
                    />
                    <Route
                      path="/device-list/add-device"
                      render={() => (
                        <AddDevicePage
                          connectedDevices={connectedDevices}
                          setConnectedDevices={setConnectedDevices}
                        />
                      )}
                      exact={true}
                    />
                    <Route
                      path="/device/:deviceId"
                      render={() => (
                        <DevicePage
                          device={selectedDevice}
                          setPublishedDevices={setPublishedDevices}
                          setGlobalData={setData}
                          data={data}
                        />
                      )}
                      exact={true}
                    />
                    <Route
                      path="/settings"
                      render={() => <SettingsPage signOut={signOut} />}
                      exact={true}
                    />
                    <Route
                      path="/mqtt-test-client"
                      render={() => <TestMQTTPage />}
                      exact={true}
                    />
                  </IonRouterOutlet>

                  <IonTabBar slot="bottom">
                    <IonTabButton tab="device-list" href="/device-list">
                      <IonIcon icon={phonePortraitOutline} />
                      <IonLabel>Devices</IonLabel>
                    </IonTabButton>

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
