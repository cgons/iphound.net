import { type NextRequest } from "next/server";

import IpService, { GeoInfo } from "@/lib/services/IpService";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic"; // Ensure NextJS does not cache this route.

const NO_STORE_HEADERS = {
  "cache-control": "no-store",
};

interface LookoutRequestBody {
  ip?: string;
}

export async function POST(request: NextRequest) {
  logger.info("POST /api/lookout");
  const ipService = await IpService.getInstance();

  let body: LookoutRequestBody = {};
  try {
    body = (await request.json()) as LookoutRequestBody;
  } catch (error) {
    logger.warn("Invalid JSON body for /api/lookout");
    logger.error(error);
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const ipRaw = typeof body.ip === "string" ? body.ip.trim() : "";
  if (!ipRaw) {
    return Response.json(
      { error: "Missing ip" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const parsed = ipService.parseIPAddress(ipRaw);
  const lookupIp = parsed.IPV4 || parsed.IPV6;
  if (!lookupIp) {
    return Response.json(
      { error: "Invalid ip" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const payload: GeoInfo = ipService.getGeoInfoFromDb(lookupIp);
  return Response.json(payload, { headers: NO_STORE_HEADERS });
}
