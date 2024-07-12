import { PubSub } from "@aws-amplify/pubsub";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    useIonToast,
} from "@ionic/react";
import { useMemo, useState } from "react";

function TestMQTTPage() {
    const [present] = useIonToast();
    const [publish, setPublish] = useState({
        topic: "",
        message: "",
    });
    const [subscribe, setSubscribe] = useState({
        topic: "",
    });
    const [subscribedTopics, setSubscribedTopics] = useState([]);
    const [messages, setMessages] = useState([]);
    const mqttClient = useMemo(() => {
        return new PubSub({
            region: "ap-southeast-2",
            endpoint:
                "wss://aibmybrjyb7gc-ats.iot.ap-southeast-2.amazonaws.com/mqtt",
        });
    }, []);

    return (
        <PageWrapper>
            <Title text={"MQTT Testing"} />

            <IonList className="overflow-auto">
                <IonListHeader>
                    <IonLabel>
                        <h1>Publishing</h1>
                    </IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonInput
                        label={"Publish topic"}
                        placeholder={"Enter topic to publish to"}
                        onIonInput={(e) => {
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
                        onIonInput={(e) => {
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
                        onClick={async () => {
                            if (
                                publish.topic === "" ||
                                publish.message === ""
                            ) {
                                present(
                                    "Publish topic or message cannot be empty"
                                );
                                return;
                            }
                            await mqttClient.publish({
                                topics: publish.topic,
                                message: { msg: publish.message },
                            });
                            present("Published message.", 3000);
                        }}
                    >
                        Publish message
                    </IonButton>
                </IonItem>
            </IonList>

            <IonList>
                <IonListHeader>
                    <IonLabel>
                        <h1>Subscribing</h1>
                    </IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonInput
                        label={"Subscribe topic"}
                        placeholder={"Enter topic to subscribe to"}
                        value={subscribe.topic}
                        onIonInput={(e) => {
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
                            if (subscribe.topic === "") {
                                present(
                                    "Cannot subscribe to empty topic",
                                    3000
                                );
                                return;
                            }

                            if (subscribedTopics.includes(subscribe.topic)) {
                                present("Already subscribed to topic", 3000);
                                return;
                            }

                            mqttClient
                                .subscribe({
                                    topics: [subscribe.topic],
                                })
                                .subscribe({
                                    next: (data) => {
                                        setMessages((prev) => {
                                            const next = structuredClone(prev);

                                            const symbols =
                                                Object.getOwnPropertySymbols(
                                                    data
                                                );

                                            if (symbols.length === 0) {
                                                throw new Error(
                                                    "Received message has no topic."
                                                );
                                            }

                                            next.push({
                                                ...data,
                                                received: new Date(),
                                                topic: data[symbols[0]],
                                            });
                                            return next;
                                        });
                                    },
                                });

                            setSubscribedTopics((prev) => {
                                const next = structuredClone(prev);
                                next.push(subscribe.topic);
                                return next;
                            });
                            present("Topic subscribed", 3000);
                        }}
                    >
                        Subscribe
                    </IonButton>
                </IonItem>
            </IonList>

            <IonList inset={true}>
                <IonListHeader>
                    <IonLabel>
                        <h1>Subscribed topics</h1>
                    </IonLabel>
                </IonListHeader>
                {subscribedTopics.map((topic, index) => {
                    return (
                        <IonItem key={index}>
                            <IonLabel>{topic}</IonLabel>
                        </IonItem>
                    );
                })}
                {subscribedTopics.length === 0 && (
                    <IonItem>
                        <IonLabel>No topics yet.</IonLabel>
                    </IonItem>
                )}
            </IonList>

            <IonList inset={true}>
                <IonListHeader>
                    <IonLabel>
                        <h1>Message log</h1>
                    </IonLabel>
                </IonListHeader>
                {messages.map((message, index) => {
                    return (
                        <IonItem key={index}>
                            <IonLabel>
                                <span className="font-semibold">
                                    [{message.topic}]{" "}
                                </span>
                                {message.received.toLocaleString()} :{" "}
                                {message.msg}
                            </IonLabel>
                        </IonItem>
                    );
                })}
                {messages.length === 0 && (
                    <IonItem>
                        <IonLabel>No messages yet.</IonLabel>
                    </IonItem>
                )}
            </IonList>
        </PageWrapper>
    );
}

export default TestMQTTPage;
