import { AdbConnect, isAdbInstalled, isAdbVersionSupported } from "./adbService";
import { MdnsDeviceData } from "./mdnsDeviceData";
import { showError, showNotification, showProgress } from "./utils";


function connectWithPairedDevice(){

    if (!isAdbInstalled()) {
        showError("ADB is not installed or PATH is not Configured");
      } else if (!isAdbVersionSupported()) {
        showError("ADB is not updated. Please update to version 32 or later");
      } else {
        showNotification("ADB-QR:Connecting...")
          AdbConnect();
      }
}

export{connectWithPairedDevice};