import { IonButton } from "@ionic/react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";

function SettingsPage({ signOut, setPage }) {
    return (
        <PageWrapper>
            <Title text={"Settings"} />
            <IonButton
                onClick={() => {
                    signOut();
                    setPage("DeviceListPage");
                }}
            >
                Sign out
            </IonButton>
            <IonButton
                onClick={() => {
                    setPage("TestMQTTPage");
                }}
            >
                Go to MQTT testing
            </IonButton>
        </PageWrapper>
    );
}

export default SettingsPage;
