/** @jsxImportSource @emotion/react */
import React from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { IonItem, IonSearchbar } from "@ionic/react";
import { css } from "@emotion/react";
import { searchCircle } from "ionicons/icons";
import { SubTitle } from "./Subtitle";

export const ConnectedDevice = ({ setPage }) => {
  return (
    <PageWrapper>
      <Title text={"Connected devices"} />
      <IonItem>
        <IonSearchbar></IonSearchbar>
      </IonItem>
      {/* <SubTitle>AVAILABLE DEVICES (BLUETOOTH)</SubTitle> */}
      <SubTitle>DEVICES CONNECTED TO GATEWAY</SubTitle>
      <div
        className="pt-10 text-base text-center text-blue-700"
        onClick={() => {
          setPage("AddPage");
        }}
      >
        Add New IoT
      </div>
    </PageWrapper>
  );
};
