import { type NextRequest } from "next/server";

import IpService from "@/lib/services/IpService";
import logger from "@/lib/logger";

const TRUE_PARAM_VALS = new Set(["true", "1", "t"]);

function isParamTrue(value: string | null): boolean {
  if (!value) {
    return false;
  }
  return TRUE_PARAM_VALS.has(value.trim().toLowerCase());
}

export async function GET(request: NextRequest) {
  logger.info("GET /ip");
  const ipService = await IpService.getInstance();
  const url = new URL(request.url);
  const geoParam = url.searchParams.get("geo");

  let respPayload = {};
  if (isParamTrue(geoParam)) {
    respPayload = ipService.getGeoInfo(request.headers);
  } else {
    const remoteIp = ipService.getRemoteIp(request.headers);
    respPayload = { ip: remoteIp };
  }
  return Response.json(respPayload);
}
