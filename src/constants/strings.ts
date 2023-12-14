class Constants {
  public static readonly APP_NAME = "My App";
  public static readonly APP_VERSION = "1.0.0";
  public static readonly APP_DESCRIPTION = "This is my app";
  public static readonly APP_AUTHOR = "My Name";
  public static readonly APP_AUTHOR_EMAIL = "";

  public static readonly ADB_VERSION_CMD = "adb --version";
  public static readonly VERSION = "Version";
  public static ADB_PAIR_CMD(
    ip: string,
    port: number,
    password: String
  ): string {
    return "adb pair " + ip + ":" + port + " " + password;
  }

  public static ADB_CONNECT_CMD(ip: string, port: number): string {
    return "adb connect " + ip + ":" + port;
  }

  public static ADB_GET_DEVICE_NAME_CMD(ip: string, port: number): string {
    return "adb -s " + ip + ":" + port + " shell getprop ro.product.model";
  }

  public static readonly MDNS_SCAN_TYPE = "adb-tls-connect";
  public static readonly MDNS_PAIRING_TYPE = "adb-tls-pairing";

  public static WEBVIEW_HTML(code: String): string {
    return (
      '<html><body><div style="background-color:black; text-align:center; padding: 5px; height:100vh; width:100vw;">' +
      '<img margin="auto" height="auto" width="30%" min-width="300px" src=' +
      code +
      ">" +
      "<br>" +
      "Scan QrCode From Android Device in <br> Settings>Developer Options>Wireless Debugging>Connect With QRCode <br> Turn Off MobileData if enabled" +
      "</div></body></html>"
    );
  }
}

export { Constants };