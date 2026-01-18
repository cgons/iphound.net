"use client";

import StackedBadge from "@/lib/components/StackedBadge";
import UAParser from "my-ua-parser";
import { useEffect, useState } from "react";

class UserAgentInfoService {
  private uaPparser: UAParser.UAParserInstance;
  constructor() {
    this.uaPparser = new UAParser();
  }

  get browserInfo() {
    return this.uaPparser.getBrowser()?.name;
  }
  get osInfo() {
    return this.uaPparser.getOS()?.name;
  }

  get deviceInfo(): string {
    const device = this.uaPparser.getDevice();
    if (!device || !device.vendor) return "";

    const model = (device.model && `/ ${device.model}`) || "";
    return `${device.vendor} ${model}`;
  }
}

export default function UserAgentInfo() {
  const [browserInfo, setBrowserInfo] = useState("...");
  const [osInfo, setOsInfo] = useState("...");
  const [deviceInfo, setDeviceInfo] = useState("...");

  useEffect(() => {
    const uaInfoService = new UserAgentInfoService();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowserInfo(uaInfoService.browserInfo || "...");
    setOsInfo(uaInfoService.osInfo || "...");
    setDeviceInfo(uaInfoService.deviceInfo || "...");
  }, []);

  return (
    <section className="m-auto mb-4 flex flex-wrap justify-center gap-4 text-[14px] text-gray-600">
      <StackedBadge label="Browser" value={browserInfo} />
      <StackedBadge label="OS / Platform" value={osInfo} />
      <StackedBadge label="Device" value={deviceInfo} />
    </section>
  );
}
