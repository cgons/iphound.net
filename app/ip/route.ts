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
 * Flattens a nested object into a flat object with dot-delimited keys.
 * Example: { a: { b: 1 } } becomes { "a.b": 1 }
 */
function flattenObject(
  value: Record<string, any>,
  prefix = "",
  out: Record<string, unknown> = {},
): Record<string, unknown> {
  for (const [key, nested] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      flattenObject(nested, path, out);
    } else {
      out[path] = nested;
    }
  }
  return out;
}

/**
 * Formats a GeoInfo object into a plain-text representation.
 * Each key-value pair is represented on its own line in the format `key: value`.
 */
function formatPlainTextResponse(payload: GeoInfo): string {
  const flattenedPayload = flattenObject(payload);
  return Object.entries(flattenedPayload)
    .map(([key, value]) => {
      if (value === null || value === undefined) {
        return `${key}:`;
      }
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        return `${key}: ${value}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    })
    .join("\n");
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

function replaceUndefinedValues<T>(value: T): T {
  if (value === undefined) {
    return null as any;
  }
  if (Array.isArray(value)) {
    return value.map(replaceUndefinedValues) as any;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, replaceUndefinedValues(val)]),
    ) as any;
  }
  return value as any;
}

function plainTextResponse(body: string): Response {
  return new Response(body, {
    headers: {
      ...NO_STORE_HEADERS,
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

function jsonResponse(payload: any): Response {
  return Response.json(payload, {
    headers: NO_STORE_HEADERS,
  });
}

// Route Handlers
// ----------------------------------------------

export async function GET(request: NextRequest) {   
  logger.info("GET /ip");
  const ipService = await IpService.getInstance();
  const url = new URL(request.url);

  const geoRequested = isParamTrue(url.searchParams.get("geo"));
  const jsonRequested = isParamTrue(url.searchParams.get("json"));

  // Fetch data: full geo info if requested, otherwise just IP address.
  const payload: GeoInfo = geoRequested
    ? ipService.getGeoInfo(request.headers)
    : { ipaddress: ipService.getRemoteIp(request.headers) };

  // Output response in requested format.
  if (jsonRequested) {
    return jsonResponse(replaceUndefinedValues(payload));
  } else {
    // If no geo info requested, just return the IP address alone.
    const body = geoRequested ? formatPlainTextResponse(payload) : payload.ipaddress;
    return plainTextResponse(body);
  }
}
