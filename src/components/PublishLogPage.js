import React, { useCallback, useEffect, useState } from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { BleClient } from "@capacitor-community/bluetooth-le";

import { IonIcon, IonItem, IonSearchbar, IonSpinner } from "@ionic/react";
import { SubTitle } from "./Subtitle";

export const PublishLogPage = ({logs}) => {
  console.log("log--->", logs);
  return (
    <PageWrapper>
      <Title text={"Publish Logs"} />
      <IonItem>
        <IonSearchbar></IonSearchbar>
      </IonItem>

      <SubTitle>Logs</SubTitle>
      {logs.map((data) => (
        <div>{data}</div>
      ))}
      <div className="pt-10 text-base text-center text-blue-700">
        Press to Refresh
      </div>
    </PageWrapper>
  );
};
