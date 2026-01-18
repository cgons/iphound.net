import ConnectionInfo from "@/lib/components/ConnectionInfo";
import GeoIPInfo from "@/lib/components/GeoIPInfo";
import { GeoInfo } from "@/lib/services/IpService";

interface Props {
  geoInfo: GeoInfo;
}

export default function GeoAndConnectionInfo(props: Props) {
  return (
    <>
      <GeoIPInfo geoInfo={props.geoInfo} />
      <div className="h-8">&nbsp;</div>
      <ConnectionInfo asnInfo={props.geoInfo?.asn} />
    </>
  );
}
