import React from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { IonItem, IonSearchbar } from "@ionic/react";
import { SubTitle } from "./Subtitle";

export const SubscriptionLogPage = ({ setPage }) => {
  return (
    <PageWrapper>
      <div
        className="text-blue-600 pb-4"
        onClick={() => {
          setPage("DevicePage");
        }}
      >
        {"< Device List"}
      </div>
      <Title text={"Subscription Logs"} />
      <IonItem>
        <IonSearchbar></IonSearchbar>
      </IonItem>

      <SubTitle>Logs</SubTitle>

      <div className="pt-10 text-base text-center text-blue-700">
        Press to Refresh
      </div>
    </PageWrapper>
  );
};
