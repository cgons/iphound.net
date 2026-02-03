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
    // Parse the incoming JSON body
    body = (await request.json()) as LookoutRequestBody;
  } catch (error) {
    // Log any JSON parsing errors
    logger.warn("Error: Invalid JSON body for /api/lookout");
    logger.error(error);
    return Response.json(
      { error: "Error: Invalid JSON body" },
      { status: 400 },
    );
  }

  const ipRaw = typeof body.ip === "string" ? body.ip.trim() : "";
  if (!ipRaw) {
    return Response.json(
      { error: "Error: 'ip' was missing and is a required field." },
      { status: 400 },
    );
  }

  const parsed = ipService.parseIPAddress(ipRaw);
  const lookupIp = parsed.IPV4 || parsed.IPV6;
  if (!lookupIp) {
    return Response.json(
      { error: "Error: 'ip' is not a valid IPV4 or IPV6 address." },
      { status: 400 },
    );
  }

  const payload: GeoInfo = ipService.getGeoInfoFromDb(lookupIp);
  return Response.json(payload, { headers: NO_STORE_HEADERS });
}
