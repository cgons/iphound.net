import { type NextRequest } from "next/server";

import IpService, { GeoInfo } from "@/lib/services/IpService";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic"; // Ensure NextJS does not cache this route.

// Constants and Type Definitions
// ----------------------------------------------

const NO_STORE_HEADERS = {
  "cache-control": "no-store",
};

// Utility Functions
// ----------------------------------------------

function isParamTrue(value: string | null): boolean {
  const TRUE_PARAM_VALS = new Set(["true", "1", "t"]);
  if (!value) {
    return false;
  }
  return TRUE_PARAM_VALS.has(value.trim().toLowerCase());
}

/**
 * Recursively replaces `undefined` values with `null`.
 * This ensures that fields with `undefined` values are included in JSON output
 * rather than being omitted by `JSON.stringify` (which `Response.json` uses).
 */
type WithNulls<T> = T extends undefined // If the value is `undefined`, replace it with `null`.
  ? null
  : T extends (infer U)[] // If it's an array, transform its element type recursively.
    ? WithNulls<U>[]
    : T extends object // If it's a non-array object, transform each property recursively.
      ? { [K in keyof T]: WithNulls<T[K]> }
      : T; // Otherwise, keep the original type.

function replaceUndefinedValues<T>(value: WithNulls<T>): WithNulls<T> {
  if (value === undefined) {
    return null as WithNulls<T>;
  }
  if (Array.isArray(value)) {
    return value.map(replaceUndefinedValues) as WithNulls<T>;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        replaceUndefinedValues(val),
      ]),
    ) as WithNulls<T>;
  }
  return value as WithNulls<T>;
}

// Route Handlers
// ----------------------------------------------

export async function GET(request: NextRequest) {
  logger.info("GET /ip");
  const ipService = await IpService.getInstance();
  const url = new URL(request.url);

  const geoRequested = isParamTrue(url.searchParams.get("geo"));

  // Fetch data: full geo info if requested, otherwise just IP address.
  const payload: GeoInfo = geoRequested
    ? ipService.getGeoInfo(request.headers)
    : { ipaddress: ipService.getRemoteIp(request.headers) };

  return Response.json(replaceUndefinedValues(payload), {
    headers: NO_STORE_HEADERS,
  });
}
