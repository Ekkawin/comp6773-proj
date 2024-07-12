import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import {
    IonApp,
    IonReactRouter,
    IonRouterOutlet,
    setupIonicReact,
} from "@ionic/react";
import { phonePortraitOutline, cogOutline } from "ionicons/icons";
import { Footer } from "./components/Footer";
import { Body } from "./components/Body";
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

Amplify.configure(amplifyconfig);

function App() {
    setupIonicReact();
    const [page, setPage] = useState("DeviceListPage");

    return (
        <IonApp>
            <IonRouterOutlet>
                <Authenticator className="mt-10">
                    {({ signOut }) => {
                        return (
                            <>
                                <Body
                                    page={page}
                                    setPage={setPage}
                                    signOut={signOut}
                                />
                            </>
                        );
                    }}
                </Authenticator>
                <Footer page={page} setPage={setPage} />
            </IonRouterOutlet>
        </IonApp>
    );
}

export default App;
