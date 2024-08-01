# COMP6773 Project
By Io-Tea (T2 August 2024), for UNSW's COMP6733 major project.

## Overview
An iOS app that serves as an MQTT gateway for Bluetooth Low Energy (BLE) connected devices. See the full project report [here](https://docs.google.com/document/d/1q-OY4pcbmSYITKIX6146AHS_C1iR-LbfJMAFP771rkE/edit?usp=sharing). 

## Building

### Pre-requisites
As this is an app built for iOS, building the code requires XCode which is only available on MacOS supported machines, and an iPhone to build the app to (you can also build to an XCode iOS simulator, but this does not allow you to connect to Bluetooth devices). You will need to have installed npm (Node Package Manager), and XCode.

### Build process
In the root of the repository, run the following in a terminal to install the project dependencies:

```bash
npm install
```

If building to an iOS device, plug the device into your computer. You may need to enable [developer mode](https://docs.expo.dev/guides/ios-developer-mode/) on your iOS device, and allow your computer to connect to your iOS device. Then to build the source code, run:

```bash
npx run cap
```

You should see some dialog options to select which device you would like to build to (simulator/real iPhone). The app should now be installed.
