import {
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonPage,
} from "@ionic/react";
import { useHistory } from "react-router";

function SettingsPage({ signOut }) {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen={true}>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonList inset>
                    <IonItem
                        button
                        detail
                        onClick={() => {
                            history.push("/mqtt-test-client");
                        }}
                    >
                        <IonLabel>Open MQTT test client</IonLabel>
                    </IonItem>
                    <IonItem
                        button
                        detail
                        onClick={() => {
                            signOut();
                            history.push("/device-list");
                        }}
                    >
                        <IonLabel>Sign out</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default SettingsPage;
