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
  IonNote,
} from "@ionic/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { PublishLogContext } from "../context";
import { useHistory } from "react-router";

export const MQTTPage = () => {
  const [present] = useIonToast();
  const [subscribe, setSubscribe] = useState({
    topic: "",
  });
  // const [subscribedTopics, setSubscribedTopics] = useState([]);

  const {
    connectedDevices,
    messages,
    setMessages,
    publishData,
    subscribedTopics,
    setSubscribedTopics,
  } = useContext(PublishLogContext);

  const history = useHistory();

  const mqttClient = useMemo(() => {
    return new PubSub({
      region: "ap-southeast-2",
      endpoint: "wss://aibmybrjyb7gc-ats.iot.ap-southeast-2.amazonaws.com/mqtt",
    });
  }, []);

  function log(message, topic) {
    console.log("message", message);
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
  function handlePublish(publish) {
    if (publish.topic === "" || publish.message === "") {
      present("Publish topic or message cannot be empty");
      return;
    }

    mqttClient.publish({
      topics: publish.topic,
      message: { msg: publish.message },
    });
    log(`Published ${publish.message}`, publish.topic);
    present("Published message.", 3000);
  }

  useEffect(() => {
    if (publishData?.topic) {
      handlePublish(publishData);
    }
  }, [publishData]);

  useEffect(() => {
    const topics = [];
    console.log('subscribedTopics', subscribedTopics)
    subscribedTopics.forEach((element) => {
      element.sub.unsubscribe()
      console.log('element', element)

      const sub = mqttClient
        .subscribe({
          topics: [element.topic],
        })
        .subscribe({
          next: onMsgRcvd,
        });
      topics.push({ topic: element.topic, sub });
    });
    console.log('topics', topics)
    setSubscribedTopics(topics);
  }, []);

  

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>MQTT Client</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">MQTT Client</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList inset>
          <IonListHeader>
            <IonLabel>
              <h1>Connected Devices</h1>
            </IonLabel>
          </IonListHeader>
          {connectedDevices?.map(({ name, id, topic }) => {
            return (
              <IonItem
                button={true}
                onClick={() => {
                  history.push(
                    `/mqtt-test-client/${id}?deviceId=${id}&topic=${topic}`
                  );
                }}
              >
                <IonLabel>{name}</IonLabel>
                <IonNote slot="end">Publish</IonNote>
              </IonItem>
            );
          })}
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

          {/* <IonItem
            button
            detail
            onClick={() => {
              mqttClient.publish({
                topics: "helloworld",
                message: { msg: "Hello" },
              });
            }}
          >
            <IonLabel>Subscribe to topic</IonLabel>
          </IonItem> */}
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
                  <span className="font-semibold">[{message.topic}] </span>
                  {message.received.toLocaleString()} : {message.message}
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
};
