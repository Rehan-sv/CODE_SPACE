# CompassInt 🧭

> **An open-source OSINT & IP Intelligence desktop application built with Electron.**

CompassInt is a forensic investigation dashboard that lets you analyse any IP address or domain in seconds. It visualises geolocation on an interactive map, simulates a traceroute, scores threat level, and runs OSINT lookups — all from a sleek dark-mode desktop app.

---

## ✨ Features

| Module | Description |
|---|---|
| 🌍 **IP Geolocation** | Country, region, city, coordinates, timezone, ZIP via ip-api.com |
| 🗺️ **Interactive Map** | Dark-tile Leaflet map with animated route arcs and pulse markers |
| 📡 **Traceroute Simulation** | Haversine-based hop generation with realistic latency estimates |
| ⚠️ **Risk Assessment** | Threat scoring (0–100) based on country, ISP, proxy/VPN, hosting flags |
| 🔍 **Shodan InternetDB** | Free port/CVE/hostname lookups — no API key needed |
| 📋 **WHOIS / RDAP** | Registrar, creation date, expiry for domains; org/netRange for IPs |
| 🧬 **DNS Forensics** | A, AAAA, MX, NS, TXT record analysis for domain targets |
| 🕵️ **AI Investigator** | Contextual AI assistant that summarises each investigation |
| 📜 **Investigation Timeline** | Chronological log of every action taken during a session |
| 📤 **Export** | Download full reports as `.json` or `.txt` |

---

## 🖥️ Screenshots

> *Run the app to see it in action — `npm start`*

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/CompassInt.git
cd CompassInt

# Install dependencies
npm install
```

### Running the App

```bash
npm start
```

This launches CompassInt as a native desktop window via Electron.

---

## 🔍 Usage

1. Enter an **IP address** (e.g. `8.8.8.8`) or a **domain** (e.g. `example.com`) in the search bar.
2. Press **Enter** or click **Investigate**.
3. CompassInt will:
   - Resolve and geolocate the target
   - Draw a traceroute arc from your location to the target
   - Score the threat level
   - Run Shodan InternetDB, WHOIS/RDAP, and (for domains) DNS lookups
   - Feed all data to the AI Investigator for a natural-language summary
4. Use the **Export JSON** or **Export TXT** buttons to save the full report.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` / `⌘ + K` | Focus the search bar |
| `Enter` | Run investigation |

---

## 📁 Project Structure

```
CompassInt/
├── index.html          # App shell & UI layout
├── style.css           # Dark-mode design system
├── main.js             # Electron main process
├── app.js              # Core application engine (map, routing, risk, exports)
├── modules.js          # OSINT modules (Shodan, WHOIS, AI Investigator, Timeline)
├── osint-modules.js    # Additional OSINT helpers
├── forensic-modules.js # DNS forensic analysis module
├── package.json
└── README.md
```

---

## 🌐 External APIs Used

| API | Purpose | Key Required? |
|---|---|---|
| [ip-api.com](http://ip-api.com) | IP geolocation (free tier) | ❌ No |
| [Shodan InternetDB](https://internetdb.shodan.io) | Port & CVE data | ❌ No |
| [RDAP (ARIN/IANA)](https://rdap.arin.net) | WHOIS for IPs & domains | ❌ No |
| [Cloudflare DNS-over-HTTPS](https://1.1.1.1/dns-query) | DNS record lookups | ❌ No |
| [CARTO Basemaps](https://carto.com/) | Dark map tiles | ❌ No |

> ℹ️ All APIs used are **free and require no registration** for standard use.

---

## ⚠️ Disclaimer

CompassInt is intended **strictly for educational and ethical research purposes**. Always ensure you have proper authorisation before investigating any IP address or domain that you do not own. The authors are not responsible for misuse of this tool.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 📬 Contact

Have a question or suggestion? Open an [issue](https://github.com/your-username/CompassInt/issues) on GitHub.
