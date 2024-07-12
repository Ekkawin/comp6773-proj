import React from "react";
import { IonIcon } from "@ionic/react";
import { phonePortraitOutline, cogOutline } from "ionicons/icons";

export const Footer = ({ page, setPage }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full h-16 bg-gray-50 text-white flex justify-around items-center">
            <div
                className={`flex flex-col justify-center items-center text-black w-full h-full ${
                    page === "DeviceListPage" || page === "AddDevicePage"
                        ? "bg-gray-200"
                        : "bg-gray-50"
                }`}
                onClick={() => {
                    setPage("DeviceListPage");
                }}
            >
                {" "}
                <IonIcon icon={phonePortraitOutline} /> Device
            </div>
            <div
                className={`flex flex-col justify-center items-center text-black w-full h-full ${
                    page !== "DeviceListPage" && page !== "AddPage"
                        ? "bg-gray-200"
                        : "bg-gray-50"
                }`}
                onClick={() => {
                    setPage("SettingsPage");
                }}
            >
                {" "}
                <IonIcon icon={cogOutline} /> Settings
            </div>
        </div>
    );
};
