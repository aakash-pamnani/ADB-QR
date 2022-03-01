class MdnsDeviceData {
  name: string;
  ipAddress: string;
  port: number;
  constructor(name: string, address: string, port: number) {
    this.name = name;
    this.ipAddress = address;
    this.port = port;
  }
}

export { MdnsDeviceData };
