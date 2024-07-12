import React from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { IonItem, IonSearchbar } from "@ionic/react";
import { SubTitle } from "./Subtitle";

export const PublishLogPage = ({ logs, setPage }) => {
  console.log("log--->", logs);
  return (
    <PageWrapper>
      <div className="text-blue-600 pb-4" onClick={()=>{
        setPage("DevicePage")
      }}>{"< Device List"}</div>
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
