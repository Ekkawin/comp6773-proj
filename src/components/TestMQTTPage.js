import { PubSub } from "@aws-amplify/pubsub";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    useIonToast,
} from "@ionic/react";
import { useState } from "react";

function TestMQTTPage() {
    const [present] = useIonToast();
    const [publish, setPublish] = useState({
        topic: "",
        message: "",
    });
    const [subscribe, setSubscribe] = useState({
        topic: "",
    });

    const mqttClient = new PubSub({
        region: "ap-southeast-2",
        endpoint:
            "wss://aibmybrjyb7gc-ats.iot.ap-southeast-2.amazonaws.com/mqtt",
    });

    return (
        <PageWrapper>
            <Title text={"MQTT Testing"} />

            <IonList>
                <IonItem>
                    <IonLabel>
                        <h1>Publishing</h1>
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonInput
                        label={"Publish topic"}
                        placeholder={"Enter topic to publish to"}
                        value={publish.topic}
                        onChange={(e) => {
                            setPublish((prev) => {
                                return {
                                    ...prev,
                                    topic: e.target.value,
                                };
                            });
                        }}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        label={"Publish message"}
                        placeholder={"Enter message to publish"}
                        value={publish.message}
                        onChange={(e) => {
                            setPublish((prev) => {
                                return {
                                    ...prev,
                                    message: e.target.value,
                                };
                            });
                        }}
                    />
                </IonItem>

                <IonItem>
                    <IonButton
                        onClick={() => {
                            mqttClient
                                .publish({
                                    topics: [publish.topic],
                                    message: publish.message,
                                })
                                .then(() => {
                                    present("Message published.", 5000);
                                });
                        }}
                    >
                        Publish message
                    </IonButton>
                </IonItem>
            </IonList>

            <IonList>
                <IonItem>
                    <IonLabel>
                        <h1>Subscribing</h1>
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonInput
                        label={"Subscribe topic"}
                        placeholder={"Enter topic to subscribe to"}
                        value={subscribe.topic}
                        onChange={(e) => {
                            setSubscribe((prev) => {
                                return {
                                    ...prev,
                                    topic: e.target.value,
                                };
                            });
                        }}
                    />
                </IonItem>

                <IonItem>
                    <IonButton
                        onClick={() => {
                            mqttClient
                                .subscribe({
                                    topics: ["test"],
                                })
                                .subscribe({
                                    next: (data) => {
                                        console.log(data);
                                        present(data.message, 5000);
                                    },
                                    error: (error) => {
                                        console.log(error);
                                        present(error.message, 5000);
                                    },
                                    complete: () => {
                                        console.log("Complete");
                                    },
                                });

                            present("Topic subscribed.", 5000);
                        }}
                    >
                        Subscribe
                    </IonButton>
                </IonItem>
            </IonList>
        </PageWrapper>
    );
}

export default TestMQTTPage;
