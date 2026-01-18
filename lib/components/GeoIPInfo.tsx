import { Earth, LocateFixed } from "lucide-react";

import StackedBadge from "@/lib/components/StackedBadge";
import { GeoInfo } from "@/lib/services/IpService";

interface Props {
  geoInfo?: GeoInfo | null;
}

export default function GeoIPInfo(props: Props) {
  return (
    <div>
      <div className="m-auto max-w-96">
        <h1 className="mb-4 text-xl font-black text-gray-500">
          <Earth className="relative bottom-0.5 align-middle" /> Geographic Info
        </h1>

        <section className="mb-6 text-[14px] text-gray-600">
          <div className="flex flex-wrap justify-center gap-2">
            <LatLongDisplay
              label="latitude"
              value={props.geoInfo?.latitude?.toString() || "..."}
            />
            <LatLongDisplay
              label="longitude"
              value={props.geoInfo?.longitude?.toString() || "..."}
            />
          </div>
        </section>

        <section className="m-auto mb-4 flex max-w-90 flex-wrap justify-center gap-4 text-[14px] text-gray-600">
          <StackedBadge
            label="Zip"
            value={props.geoInfo?.postal_code || "..."}
          />
          <StackedBadge
            label="City"
            value={props.geoInfo?.city_name || "..."}
          />
          <StackedBadge
            label="Region"
            value={props.geoInfo?.subdivision || "..."}
          />
          <StackedBadge
            label="Country"
            value={props.geoInfo?.country_name || "..."}
          />
        </section>
      </div>
    </div>
  );
}

function LatLongDisplay(props: {
  label: "latitude" | "longitude";
  value: string;
}) {
  return (
    <StackedBadge
      label={props.label}
      value={props.value}
      icon={<LocateFixed />}
    />
  );
}
