import { type NextRequest } from "next/server";

import IpService, { GeoInfo } from "@/lib/services/IpService";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic"; // Ensure NextJS does not cache this route.

const NO_STORE_HEADERS = {
  "cache-control": "no-store",
};

interface IpInfo {
  ipaddress: string;
}

// Utility Functions
// ----------------------------------------------

function isParamTrue(value: string | null): boolean {
  const TRUE_PARAM_VALS = new Set(["true", "1", "t"]);
  if (!value) {
    return false;
  }
  return TRUE_PARAM_VALS.has(value.trim().toLowerCase());
}

// Route Handlers
// ----------------------------------------------

export async function GET(request: NextRequest) {
  logger.info("GET /ip");
  const ipService = await IpService.getInstance();
  const url = new URL(request.url);

  const geoRequested = isParamTrue(url.searchParams.get("geo"));

  // Fetch data: full geo info if requested, otherwise just IP address.
  const payload: GeoInfo | IpInfo = geoRequested
    ? ipService.getGeoInfo(request.headers)
    : { ipaddress: ipService.getRemoteIp(request.headers) };

  return Response.json(payload, {
    headers: NO_STORE_HEADERS,
  });
}
