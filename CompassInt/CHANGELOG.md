# Changelog

All notable changes to **CompassInt** are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-04-30

### Added
- **IP Geolocation** via ip-api.com with full field set (country, region, city, ISP, ASN, mobile/proxy/hosting flags)
- **Interactive dark-tile map** using Leaflet + CARTO Dark Matter tiles
- **Traceroute simulation** with Haversine-based hop generation and latency estimates
- **Threat scoring engine** (0–100) factoring country risk, ISP keywords, proxy/VPN/hosting flags
- **Shodan InternetDB** integration — open ports, CVEs, hostnames (no API key required)
- **WHOIS / RDAP** lookups for both IP ranges and domain registrations
- **DNS Forensic Analyser** — A, AAAA, MX, NS, TXT records via Cloudflare DoH
- **AI Investigator panel** — contextual natural-language summaries of each investigation
- **Investigation Timeline** — chronological event log for every session
- **Export to JSON** — full structured report including all OSINT and forensic data
- **Export to TXT** — human-readable report with timeline
- **Electron packaging** — runs as a native cross-platform desktop app
- Keyboard shortcut `Ctrl+K` / `⌘+K` to focus the search bar
- Animated pulse markers for origin and target locations
- Animated route arc with glow effect and mid-hop circle markers
- Toast notification system
- Loading overlay with progress messages
- Project renamed from **SentinelRoute** to **CompassInt**

---

## [0.3.0] — 2026-04-27

### Added
- Shodan InternetDB and WHOIS/RDAP OSINT modules
- DNS record forensic module
- AI Investigator panel with chat interface

### Removed
- AbuseIPDB integration (API access unavailable)

---

## [0.2.0] — 2026-04-21

### Added
- Initial OSINT module framework
- urlscan.io and Shodan stubs

---

## [0.1.0] — 2026-04-15

### Added
- Initial release as **SentinelRoute**
- Core IP geolocation and map visualisation
- Basic risk assessment engine
