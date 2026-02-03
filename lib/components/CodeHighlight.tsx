"use client";

import ShikiHighlighter, {
  createHighlighterCore,
  createJavaScriptRegexEngine,
} from "react-shiki/core";

// Create custom highlighter with dynamic imports to optimize client-side bundle size
const highlighter = await createHighlighterCore({
  themes: [import("@shikijs/themes/min-light")],
  langs: [import("@shikijs/langs/shellscript")],
  engine: createJavaScriptRegexEngine({ target: "ES2024" }),
});

const code = `
curl -s 'https://iphound.net/api/ip'
{
  "ipaddress": "162.159.134.22"
}

# -----------------------------------

curl -s 'https://iphound.net/api/ip?geo=true'
{
  "ipaddress": "162.159.134.22",
  "country_name": "United States",
  "country_iso_code": "CA",
  "subdivision": "California",
  "city_name": "San Francisco",
  "postal_code": "94107",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "asn": {
    "asn_number": 13335,
    "asn_org": "Cloudflare, Inc."
  }
}
`;

export default function CodeHighlight() {
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
