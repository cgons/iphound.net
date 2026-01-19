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
