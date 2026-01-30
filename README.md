<div align="center">

# iphound.net

Repository for the open source IP lookup and geolocation service at https://iphound.net

</div>

<br/>
<br/>

### Setup Development Environment

This service is built with NextJS as a fullstack app. on Node v24.

```bash
git clone git@github.com:cgons/iphound.net.git
---
npm install
npm run dev
```

Note:

- This service is hosted behind Cloudflare.
- During develpment/testing, IVP4 addresses can be specified in [`.env.development`](https://github.com/cgons/iphound.net/blob/master/.env.development)
  - Set `DEV_MODE_IP=true` and `DEV_IPV4=1.1.1.1`.
- In production, the real IP address is read from a Cloudflare set header: [`CF-Connecting-IP`](https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-connecting-ip)

#### Webserver Configuration (Caddyfile)

In order for the project specific ([iphound.Caddyfile](https://github.com/cgons/iphound.net/blob/master/iphound.Caddyfile)) Caddyfile to work as expected, it needs to be included into a parent or global Caddyfile that properly defines trusted proxies as shown below.

```caddyfile
{
	servers {
		# Trusted Proxy Configuration
		# ---
		# Using https://github.com/WeidiDeng/caddy-cloudflare-ips to keep Cloudflare IPs updated automatically
		trusted_proxies cloudflare {
			interval 12h
			timeout 15s
		}
		trusted_proxies_strict

		# Since we're behind Cloudflare, use the CF header first and then the standard X-Forwarded-For
		client_ip_headers CF-Connecting-IP X-Forwarded-For
	}
}
```

### Usage

#### CLI Usage

You can quickly get your public IP by making a call to iphound.net:
```bash
curl iphound.net
1.1.1.1
```
This public IP is pulled directly from the incoming http request by the webserver (Caddy) so it's very fast and efficient.

#### API Usage

If you're looking for geographic information (via [MaxMind Geo DB](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data/)) about your ip address, a simple JSON endpoint is avaiable.

API URL: `https://iphound.net/ip`

Params:
- geo = `true`, `t`, `1`

#### API Responses
```bash
curl 'https://iphound.net/ip'
{
  "ipaddress": "173.206.100.156"
}

# -----------------------------------

curl 'https://iphound.net/ip?geo=true'
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
```

Tip: For quick testing in the terminal, pipe the output to [jq](https://github.com/jqlang/jq) - `curl -s 'iphound.net/ip?geo=true' | jq`

_Note: As this is a free service, API requests are throttled to a couple requests per second (per IP)._
