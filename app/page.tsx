import { headers } from "next/headers";
import IpAddressDisplay from "@/lib/components/IpAddressDisplay";
import Logo from "@/lib/components/Logo";
import Image from "next/image";
import heroImage from "@/public/hero-image.jpg";
import GithubIconSVG from "@/lib/components/GithubIconSVG";
import IpService from "@/lib/services/IpService";
import GeoAndConnectionInfo from "@/lib/components/GeoAndConnectionInfo";

export default async function Page() {
  const headersList = await headers();
  const ipService = await IpService.getInstance();
  const geoInfo = ipService.getGeoInfo(headersList);

  return (
    <div className="pt-12 text-center">
      <Logo />
      <p className="font-semibold text-gray-500">
        <span className="italic">
          Our hounds sniffed your IP. <span className="font-black">Woof!</span>
        </span>
      </p>

      <div className="h-8">&nbsp;</div>

      <IpAddressDisplay ipAddress={geoInfo.ipaddress} />

      <div className="h-8">&nbsp;</div>

      <GeoAndConnectionInfo geoInfo={geoInfo} />

      <div className="my-12">
        <p>
          <Image
            src={heroImage}
            className="relative -z-10 inline-block max-w-11/12 md:max-w-2xl"
            alt=""
          />
        </p>
        <p className="text-xs font-medium text-gray-400 italic">
          Artwork from{" "}
          <a
            className="hover:border-b hover:border-gray-500/90 hover:text-gray-500/90"
            href="https://freepik.com"
          >
            freepik.com
          </a>
        </p>
      </div>

      <footer className="mb-10 text-center text-sm font-medium text-gray-500 underline-offset-3">
        <div className="mb-5">
          <p>What is my public IP address?</p>
          <p className="font-semibold">{geoInfo.ipaddress}</p>
        </div>

        <p className="mb-8">
          Geo location data powered by{" "}
          <a
            href="https://dev.maxmind.com/geoip/geolite2-free-geolocation-data/"
            className="italic secondary-link"
          >
            MaxMind GeoLite DB
          </a>
        </p>

        <p className="mx-auto mb-2 max-w-44 border-b border-dotted border-gray-300 pb-1">
          <a
            href="https://github.com/cgons/iphound.net"
          className="inline-block secondary-link"
          >
            <GithubIconSVG />
            &nbsp;<span>cgons/iphound.net</span>
          </a>
        </p>
        <p>
          &copy;{" "}
          <em>
            <span className="text-[13px]">2025</span> iphound.net
          </em>
        </p>
      </footer>
    </div>
  );
}
