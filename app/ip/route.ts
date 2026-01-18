import { type NextRequest } from "next/server";

import IpService from "@/lib/services/IpService";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  logger.info("GET /ip");
  const ipService = await IpService.getInstance();
  const geoInfo = ipService.getGeoInfo(request.headers);
  return Response.json(geoInfo);
}
