import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { phonePortraitOutline, cogOutline } from "ionicons/icons";
import { Footer } from "./components/Footer";
import { Body } from "./components/Body";

function App() {
  const [page, setPage] = useState("DevicePage");

  // setPage('device')
  // console.log("page", page);

  return (
    <>
      <Body page={page} setPage={setPage}/>
      <Footer page={page} setPage={setPage} />
    </>
  );
}

export default App;
