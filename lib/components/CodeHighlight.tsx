"use client";

import ShikiHighlighter, {
  createHighlighterCore,
  createJavaScriptRegexEngine,
} from "react-shiki/core";
import { GeoInfo } from "@/lib/services/IpService";

// Create custom highlighter with dynamic imports to optimize client-side bundle size
const highlighter = await createHighlighterCore({
  themes: [import("@shikijs/themes/min-light")],
  langs: [import("@shikijs/langs/shellscript")],
  engine: createJavaScriptRegexEngine({ target: "ES2024" }),
});

type CodeHighlightProps = {
  geoInfo: GeoInfo;
};

export default function CodeHighlight({ geoInfo }: CodeHighlightProps) {
  const code = `# Fetch your public IP address
curl -s 'https://iphound.net/api/ip'
{
  "ipaddress": "${geoInfo.ipaddress}"
}

# -----------------------------------

# Fetch your public IP address with geo. data
curl -s 'https://iphound.net/api/ip?geo=true'
{
  "ipaddress": "${geoInfo.ipaddress}",
  "country_name": "${geoInfo.country_name}",
  "country_iso_code": "${geoInfo.country_iso_code}",
  "subdivision": "${geoInfo.subdivision}",
  "city_name": "${geoInfo.city_name}",
  "postal_code": "${geoInfo.postal_code}",
  "latitude": ${geoInfo.latitude},
  "longitude": ${geoInfo.longitude},
  "asn": {
    "asn_number": ${geoInfo.asn.asn_number ?? 0},
    "asn_org": "${geoInfo.asn.asn_org ?? ""}"
  }
}

# -----------------------------------

# Lookup info. for a specific IP address
curl -X POST https://iphound.net/api/ip/lookup \\
-H 'Content-Type: application/json' \\
-d '{"ip":"${geoInfo.ipaddress}"}'
{
  ... same response as above ...
}
`;
  return (
    <ShikiHighlighter
      highlighter={highlighter}
      language="shellscript"
      theme="min-light"
      showLanguage={false}
      className="border-bprimary rounded-lg border text-sm font-medium"
    >
      {code}
    </ShikiHighlighter>
  );
}
