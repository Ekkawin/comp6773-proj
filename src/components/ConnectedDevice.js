import React from "react";
import { PageWrapper } from "./PageWrapper";
import { Title } from "./Title";
import { IonSearchbar } from '@ionic/react';
import { searchCircle } from "ionicons/icons";

export const ConnectedDevice = ({setPage}) => {
  return (
    <PageWrapper>
      <Title text={"Connected devices"}/>
      <IonSearchbar searchIcon={searchCircle}  placeholder="Filter"/>
      <div className="text-base text-center text-blue-700" onClick={() => {setPage("AddPage")}}>Add New IoT</div>
    </PageWrapper>
  );
};
