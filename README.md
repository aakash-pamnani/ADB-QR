# ADB-QR README

Connect Your Android device with your PC wirelessly for debugging with the help of this extension.
<br>
[![Buy Me A Coffee](https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png "Buy Me A Coffee")](https://www.buymeacoffee.com/aakashpp)

## Requirements

- Android Version : 11+.
- Adb Should be installed and ENV Path should be set.
- Phone and Pc Should be on same wifi network.
- TurnOff Mobile Data if enabled.

## Features

### 1. Connect With Qr Code.

Connect Your android phone by directly scanning QR Code.

    - Go to Settings>Developer Options>Wireless Debugging>Connect With Qr Code.
    - In vscode press ctrl+shift+p and run ADB Qr: Connect With Qr
    - Scan the qr code with phone and done.
    - Enjoy debugging wirelessly.

### 2. Connect With pairing Code.

Connect Your android phone by entering pairing Code.

    - Go to Settings>Developer Options>Wireless Debugging>Connect With Pairing Code.
    - In vscode press ctrl+shift+p and run ADB Qr: Connect With Pairing Code
    - Wait for device Scanning.
    - Select your device from the list.
    - Enter the pairing code shown on your phone.
    - Enjoy debugging wirelessly.


### 3. Connect With already paired devices.

Connect Your android phone With already paired PC.

    - Go to Settings>Developer Options>Wireless Debugging.
    - In vscode press ctrl+shift+p and run ADB Qr: Connect With Paired Devices.
    - If your pc is already paired with phone it will automatically connect in few seconds.
    - Enjoy debugging wirelessly.

## Known Issues

No known isssues until now.<br>
If you find any issues report [here](https://github.com/aakashpsindhi/ADB-QR/issues)

## Release Notes
### 0.0.1

Initial release of ADB-QR

### 0.0.2

Bug Fixes

## 0.0.3

Minor Changes

## 0.1.0

Added Progress Indicator in place of static notifications

## 0.1.1

Fixed connect with paired device running in background
