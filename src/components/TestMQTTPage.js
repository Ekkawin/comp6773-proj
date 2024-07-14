import { PubSub } from "@aws-amplify/pubsub";
import {
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonTitle,
    IonToolbar,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    useIonToast,
    IonPage,
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

    function log(message, topic) {
        setMessages((prev) => {
            const next = structuredClone(prev);
            next.push({
                message,
                received: new Date(),
                topic,
            });
            return next;
        });
    }

    function onMsgRcvd(data) {
        const symbols = Object.getOwnPropertySymbols(data);

        if (symbols.length === 0) {
            throw new Error("Received message has no topic.");
        }

        log(`Received ${data.msg}`, data[symbols[0]]);
    }

    async function handlePublish() {
        if (publish.topic === "" || publish.message === "") {
            present("Publish topic or message cannot be empty");
            return;
        }
        await mqttClient.publish({
            topics: publish.topic,
            message: { msg: publish.message },
        });
        log(`Published ${publish.message}`, publish.topic);
        present("Published message.", 3000);
    }

    function handleSubscribe() {
        if (subscribe.topic === "") {
            present("Cannot subscribe to empty topic", 3000);
            return;
        }

        if (
            subscribedTopics.find((item) => item.topic === subscribe.topic) !==
            undefined
        ) {
            present("Already subscribed to topic", 3000);
            return;
        }

        const sub = mqttClient
            .subscribe({
                topics: [subscribe.topic],
            })
            .subscribe({
                next: onMsgRcvd,
            });

        setSubscribedTopics((prev) => {
            const next = [...prev];
            next.push({ topic: subscribe.topic, sub });
            return next;
        });

        log("Subscribed to topic", subscribe.topic);
        present("Topic subscribed", 3000);
    }

    function handleUnsubscribe(topic, sub) {
        sub.unsubscribe();
        setSubscribedTopics((prev) => {
            return prev.filter((item) => topic !== item.topic);
        });
        log("Unsubscribed from topic", topic);
        present("Topic unsubscribed", 3000);
    }

    return (
        <IonPage>
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>MQTT Test Client</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">MQTT Test Client</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonList inset>
                    <IonListHeader>
                        <IonLabel>
                            <h1>Publishing</h1>
                        </IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonInput
                            label={"Topic"}
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
                            label={"Message"}
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

                    <IonItem button detail onClick={handlePublish}>
                        <IonLabel>Publish message</IonLabel>
                    </IonItem>
                </IonList>

                <IonList inset>
                    <IonListHeader>
                        <IonLabel>
                            <h1>Subscribing</h1>
                        </IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonInput
                            label={"Topic"}
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

                    <IonItem button detail onClick={handleSubscribe}>
                        <IonLabel>Subscribe to topic</IonLabel>
                    </IonItem>
                </IonList>

                <IonList inset>
                    <IonListHeader>
                        <IonLabel>
                            <h1>Subscribed topics</h1>
                        </IonLabel>
                    </IonListHeader>
                    {subscribedTopics.map(({ topic, sub }, index) => {
                        return (
                            <IonItemSliding>
                                <IonItem key={index}>
                                    <IonLabel>{topic}</IonLabel>
                                </IonItem>

                                <IonItemOptions>
                                    <IonItemOption
                                        color="danger"
                                        onClick={() => {
                                            handleUnsubscribe(topic, sub);
                                        }}
                                    >
                                        Unsubscribe
                                    </IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        );
                    })}
                    {subscribedTopics.length === 0 && (
                        <IonItem>
                            <IonLabel>No topics yet.</IonLabel>
                        </IonItem>
                    )}
                </IonList>

                <IonList inset>
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
                                    {message.message}
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
            </IonContent>
        </IonPage>
    );
}

export default TestMQTTPage;
