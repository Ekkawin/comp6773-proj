import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { IonApp, IonReactRouter, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { phonePortraitOutline, cogOutline } from "ionicons/icons";
import { Footer } from "./components/Footer";
import { Body } from "./components/Body";
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

function App() {

  setupIonicReact();
  const [page, setPage] = useState("DeviceListPage");

  // setPage('device')
  // console.log("page", page);

  return (
    <IonApp>
      {/* <IonReactRouter> */}
        <IonRouterOutlet>
          <Body page={page} setPage={setPage} />
          <Footer page={page} setPage={setPage} />
        </IonRouterOutlet>
      {/* </IonReactRouter> */}
    </IonApp>
  );
}

export default App;
