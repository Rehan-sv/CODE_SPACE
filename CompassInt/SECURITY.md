# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.0.x | ✅ Yes |
| < 1.0 | ❌ No |

---

## Reporting a Vulnerability

If you discover a security vulnerability in CompassInt, please **do not open a public issue**.

Instead, report it privately by emailing the maintainer or opening a [GitHub Security Advisory](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability).

Please include:
- A description of the vulnerability
- Steps to reproduce it
- Potential impact
- Any suggested fixes (optional)

You can expect a response within **7 days**.

---

## Security Considerations

CompassInt is a client-side Electron application. Please be aware of the following:

- **No data is stored remotely** — all investigation results stay on your machine.
- **API calls are made to third-party services** (ip-api.com, Shodan InternetDB, RDAP, Cloudflare DoH). Review their respective privacy policies.
- **No API keys are hardcoded** in this repository. All APIs used are public and free.
- **Electron security**: The app uses `contextIsolation: true` and `nodeIntegration: false` for renderer processes to reduce attack surface.

---

## Responsible Use

CompassInt is designed for **ethical research and educational purposes only**. Do not use it to investigate targets without proper authorisation. Misuse of this tool may violate local laws.
