import { EthernetPort } from "lucide-react";
import StackedBadge from "@/lib/components/StackedBadge";
import { AsnInfo } from "@/lib/services/IpService";
import UserAgentInfo from "@/lib/components/UserAgentInfo";

interface Props {
  asnInfo?: AsnInfo;
}

export default function ConnectionInfo(props: Props) {
  return (
    <div className="m-auto max-w-[600px]">
      <h1 className="mb-4 text-xl font-black text-gray-500">
        <EthernetPort className="relative bottom-0.5 align-middle" /> Connection
        Info
      </h1>

      <section className="m-auto mb-7 flex max-w-90 flex-wrap justify-center gap-4 text-[14px] text-gray-600">
        <StackedBadge
          label="Service Provider"
          title={"ASN#: " + props.asnInfo?.asn_number || "n/a"}
          value={props.asnInfo?.asn_org || "..."}
        />
      </section>

      <UserAgentInfo />
    </div>
  );
}
