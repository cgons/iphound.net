import ipaddr from "ipaddr.js";
import maxmind, { AsnResponse, CityResponse, Reader } from "maxmind";
import * as geolite2 from "geolite2-redist";

import logger from "@/lib/logger";

export interface AsnInfo {
  asn_number?: number;
  asn_org?: string;
}

export interface GeoInfo {
  ipaddress: string;
  country_name?: string;
  country_iso_code?: string;
  city_name?: string;
  subdivision?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  asn?: AsnInfo;
}

export type IpAddress = {
  IPV4: string;
  IPV6: string;
};

export default class IpService {
  private static instance: IpService;
  public geoLiteIpReader!: Reader<CityResponse>;
  public geoLiteAsnReader!: Reader<AsnResponse>;

  constructor() {}

  public static async getInstance(): Promise<IpService> {
    if (!IpService.instance) {
      this.instance = new IpService();
      await this.instance.initializeGeoLiteDb();
    }
    return this.instance;
  }

  public async initializeGeoLiteDb() {
    this.geoLiteIpReader = await geolite2.open(
      geolite2.GeoIpDbName.City, // Use the enum instead of a string!
      (path) => maxmind.open<CityResponse>(path),
    );
    logger.debug("GeoLiteIpReader Initialized...");

    this.geoLiteAsnReader = await geolite2.open(
      geolite2.GeoIpDbName.ASN, // Use the enum instead of a string!
      (path) => maxmind.open<AsnResponse>(path),
    );
    logger.debug("GeoLiteAsnReader Initialized...");
  }

  public parseIPAddress(rawAddr: string): IpAddress {
    const ipAddress: IpAddress = { IPV4: "", IPV6: "" };
    try {
      const parsedAddr = ipaddr.parse(rawAddr);
      const ipKind = parsedAddr.kind();
      switch (ipKind) {
        case "ipv4":
          // If the parsed ip address comes back in ipv4 only format, use it.
          ipAddress.IPV4 = parsedAddr.toString();
          ipAddress.IPV6 = (parsedAddr as ipaddr.IPv4)
            .toIPv4MappedAddress()
            .toString();
          break;
        case "ipv6":
          // If the parsed ip address comes back in a "mapped" ipv4 to ipv6 address,
          // then extract and ipv4 part...
          if ((parsedAddr as ipaddr.IPv6).isIPv4MappedAddress()) {
            ipAddress.IPV4 = (parsedAddr as ipaddr.IPv6)
              .toIPv4Address()
              .toString();
          }
          ipAddress.IPV6 = parsedAddr.toString();
          break;
        default:
          return ipAddress;
      }
    } catch (error) {
      logger.warn(`Unable to parse IP address -> ${rawAddr}`);
      logger.error(error);
    }

    return ipAddress;
  }

  public getGeoInfoFromDb(ip: string): GeoInfo {
    const rawGeoInfo = this.geoLiteIpReader.get(ip);
    const rawAsnInfo = this.geoLiteAsnReader.get(ip);
    const asnInfo: AsnInfo = {
      asn_number: rawAsnInfo?.autonomous_system_number,
      asn_org: rawAsnInfo?.autonomous_system_organization,
    };
    return {
      ipaddress: ip,
      country_name: rawGeoInfo?.country?.names.en,
      country_iso_code: rawGeoInfo?.country?.iso_code,
      subdivision: rawGeoInfo?.subdivisions?.[0]?.names?.en,
      city_name: rawGeoInfo?.city?.names.en,
      postal_code: rawGeoInfo?.postal?.code,
      latitude: rawGeoInfo?.location?.latitude,
      longitude: rawGeoInfo?.location?.longitude,
      asn: asnInfo,
    };
  }

  public getRemoteIp(headers: Headers): string {
    if (process.env.DEV_MODE_IP === "true") {
      const ip = process.env.DEV_IPV4 || "";
      logger.info(`IP via dev mode -> ${ip}`);
      return ip;
    }

    if (process.env.CLOUDFLARE_PROXY === "true") {
      const ip = headers.get("cf-connecting-ip") || "";
      logger.info(`IP via cf-connecting-ip header -> ${ip}`);
      return ip;
    }

    const ip = headers.get("x-forwarded-for") || "";
    logger.info(`IP via x-forwarded-for header ${ip}`);
    return ip;
  }

  public getGeoInfo(headers: Headers): GeoInfo {
    const ip = this.getRemoteIp(headers);
    return this.getGeoInfoFromDb(ip);
  }
}
