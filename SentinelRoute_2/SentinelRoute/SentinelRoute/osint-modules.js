/* ╔══════════════════════════════════════════════════════════════╗
   ║  SENTINEL ROUTE — OSINT Integration Modules                 ║
   ║  AbuseIPDB · WHOIS/RDAP · urlscan.io · Shodan InternetDB   ║
   ║                                                              ║
   ║  Each module below is an IIFE (Immediately Invoked Function  ║
   ║  Expression). Think of each one as a mini-class that keeps   ║
   ║  its internal variables private and only exposes the methods  ║
   ║  we need via the "return" statement at the bottom.           ║
   ╚══════════════════════════════════════════════════════════════╝ */


// ═══════════════════════════════════════════════════════════════
//  API KEY MANAGER
//  Saves/loads API keys from localStorage (persists across sessions)
// ═══════════════════════════════════════════════════════════════
const APIKeyManager = (() => {
    const PREFIX = 'sentinel_';

    function saveKey(service, key) {
        localStorage.setItem(PREFIX + service, key);
    }

    function getKey(service) {
        return localStorage.getItem(PREFIX + service);
    }

    function hasKey(service) {
        const k = getKey(service);
        return k !== null && k.trim() !== '';
    }

    function removeKey(service) {
        localStorage.removeItem(PREFIX + service);
    }

    // Open the settings modal (defined in index.html)
    function openSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.classList.add('open');

        // Pre-fill input fields with any saved keys
        const abuseInput = document.getElementById('key-abuseipdb');
        if (abuseInput && hasKey('abuseipdb')) {
            abuseInput.value = getKey('abuseipdb');
        }
    }

    function closeSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.classList.remove('open');
    }

    return { saveKey, getKey, hasKey, removeKey, openSettings, closeSettings };
})();


// ═══════════════════════════════════════════════════════════════
//  SHODAN INTERNETDB MODULE (FREE — No API Key Needed!)
//  ─────────────────────────
//  Shodan's InternetDB is a free, fast lookup that returns:
//    - Open ports (e.g., 80, 443, 22)
//    - Known vulnerabilities (CVEs)
//    - Hostnames pointing to the IP
//    - CPEs (software/hardware identifiers)
//  API: https://internetdb.shodan.io/{ip}
// ═══════════════════════════════════════════════════════════════
const ShodanLookup = (() => {
    let cachedData = null;

    async function lookup(ip) {
        const section = document.getElementById('shodan-section');
        const container = document.getElementById('shodan-body');
        section.style.display = 'block';

        // Show loading spinner
        container.innerHTML = `
            <div class="intel-placeholder">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                <p>Querying Shodan InternetDB…</p>
            </div>`;

        try {
            const res = await fetch(`https://internetdb.shodan.io/${encodeURIComponent(ip)}`);

            if (res.status === 404) {
                // 404 means Shodan has no data for this IP (not an error)
                cachedData = null;
                container.innerHTML = `
                    <div class="intel-group">
                        <div class="intel-row">
                            <span class="intel-key">Status</span>
                            <span class="intel-val" style="color:var(--text-dim)">No data found for this IP</span>
                        </div>
                    </div>`;
                return null;
            }

            if (!res.ok) throw new Error(`Shodan returned ${res.status}`);

            const data = await res.json();
            cachedData = data;
            renderShodan(data);
            return data;

        } catch (err) {
            console.error('[Shodan]', err);
            cachedData = null;
            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val danger">⚠ ${err.message}</span>
                    </div>
                </div>`;
            return null;
        }
    }

    function renderShodan(data) {
        const container = document.getElementById('shodan-body');
        const ports = (data.ports || []);
        const vulns = (data.vulns || []);
        const hostnames = (data.hostnames || []);
        const tags = (data.tags || []);

        // Color-code the port count: more open ports = more risk
        const portColor = ports.length <= 3 ? 'var(--accent)' :
                          ports.length <= 8 ? 'var(--accent-yellow)' : 'var(--accent-red)';

        container.innerHTML = `
            <div class="intel-group" style="animation-delay:0s">
                <div class="intel-group-title">Exposure Summary</div>
                <div class="intel-row">
                    <span class="intel-key">Open Ports</span>
                    <span class="intel-val" style="color:${portColor};font-weight:700">
                        ${ports.length > 0 ? ports.join(', ') : 'None found'}
                    </span>
                </div>
                <div class="intel-row">
                    <span class="intel-key">Vulnerabilities</span>
                    <span class="intel-val ${vulns.length > 0 ? 'danger' : 'highlight'}">
                        ${vulns.length > 0 ? vulns.length + ' CVE(s)' : 'None found'}
                    </span>
                </div>
                ${vulns.length > 0 ? `
                <div class="intel-row" style="flex-direction:column;align-items:flex-start;gap:4px;">
                    <span class="intel-key">CVE List</span>
                    <div class="tls-san-list">${vulns.slice(0, 8).map(v =>
                        `<div class="tls-san-item" style="color:var(--accent-red)">› ${v}</div>`
                    ).join('')}${vulns.length > 8 ? `<div class="tls-san-item" style="color:var(--text-dim)">…and ${vulns.length - 8} more</div>` : ''}</div>
                </div>` : ''}
                <div class="intel-row">
                    <span class="intel-key">Hostnames</span>
                    <span class="intel-val">${hostnames.length > 0 ? hostnames.slice(0, 3).join(', ') : '—'}</span>
                </div>
                ${tags.length > 0 ? `
                <div class="intel-row">
                    <span class="intel-key">Tags</span>
                    <span class="intel-val">${tags.join(', ')}</span>
                </div>` : ''}
            </div>`;
    }

    function getCachedData() { return cachedData; }

    function clear() {
        cachedData = null;
        const s = document.getElementById('shodan-section');
        if (s) s.style.display = 'none';
    }

    return { lookup, getCachedData, clear };
})();


// ═══════════════════════════════════════════════════════════════
//  WHOIS / RDAP MODULE (FREE — No API Key Needed!)
//  ──────────────────────
//  RDAP is the modern replacement for WHOIS. It tells you who
//  registered a domain/IP, when, and with which registrar.
//  API: https://rdap.org/domain/{domain} or /ip/{ip}
// ═══════════════════════════════════════════════════════════════
const WhoisLookup = (() => {
    let cachedData = null;

    async function lookup(query, isDomain) {
        const section = document.getElementById('whois-section');
        const container = document.getElementById('whois-body');
        section.style.display = 'block';

        container.innerHTML = `
            <div class="intel-placeholder">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                <p>Fetching WHOIS data…</p>
            </div>`;

        try {
            const type = isDomain ? 'domain' : 'ip';
            const res = await fetch(`https://rdap.org/${type}/${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error(`RDAP returned ${res.status}`);

            const raw = await res.json();
            const parsed = isDomain ? parseDomainRDAP(raw, query) : parseIPRDAP(raw, query);
            cachedData = parsed;
            renderWhois(parsed, isDomain);
            return parsed;

        } catch (err) {
            console.error('[WHOIS/RDAP]', err);
            cachedData = null;
            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val danger">⚠ ${err.message}</span>
                    </div>
                    <div class="intel-row" style="margin-top:6px">
                        <span class="intel-key" style="font-size:0.62rem;color:var(--text-dim)">
                            Some registries don't support browser RDAP queries.
                        </span>
                    </div>
                </div>`;
            return null;
        }
    }

    // Extract useful fields from a DOMAIN RDAP response
    function parseDomainRDAP(data, query) {
        const events = {};
        (data.events || []).forEach(e => { events[e.eventAction] = e.eventDate; });

        const nameservers = (data.nameservers || []).map(ns => ns.ldhName || 'Unknown');
        const status = (data.status || []).join(', ') || '—';

        // Try to find registrant/registrar info from "entities" array
        let registrar = '—';
        let registrant = '—';
        (data.entities || []).forEach(ent => {
            const roles = (ent.roles || []);
            const name = ent.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3]
                      || ent.handle || '—';
            if (roles.includes('registrar')) registrar = name;
            if (roles.includes('registrant')) registrant = name;
        });

        return {
            query,
            type: 'domain',
            name: data.ldhName || query,
            registrar,
            registrant,
            created: events.registration || '—',
            updated: events['last changed'] || '—',
            expires: events.expiration || '—',
            status,
            nameservers
        };
    }

    // Extract useful fields from an IP RDAP response
    function parseIPRDAP(data, query) {
        const events = {};
        (data.events || []).forEach(e => { events[e.eventAction] = e.eventDate; });

        let orgName = '—';
        (data.entities || []).forEach(ent => {
            const name = ent.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3]
                      || ent.handle || null;
            if (name) orgName = name;
        });

        return {
            query,
            type: 'ip',
            name: data.name || '—',
            netRange: data.startAddress && data.endAddress
                ? `${data.startAddress} – ${data.endAddress}` : '—',
            cidr: (data.cidr0_cidrs || []).map(c => `${c.v4prefix}/${c.length}`).join(', ') || '—',
            organization: orgName,
            country: data.country || '—',
            created: events.registration || '—',
            updated: events['last changed'] || '—',
            status: (data.status || []).join(', ') || '—'
        };
    }

    function renderWhois(data, isDomain) {
        const container = document.getElementById('whois-body');

        if (isDomain) {
            const nsList = data.nameservers.length > 0
                ? data.nameservers.slice(0, 5).map(ns =>
                    `<div class="tls-san-item">› ${ns}</div>`
                  ).join('') : '<div class="tls-san-item">—</div>';

            container.innerHTML = `
                <div class="intel-group" style="animation-delay:0s">
                    <div class="intel-group-title">Domain Registration</div>
                    <div class="intel-row"><span class="intel-key">Domain</span><span class="intel-val highlight">${data.name}</span></div>
                    <div class="intel-row"><span class="intel-key">Registrar</span><span class="intel-val">${data.registrar}</span></div>
                    <div class="intel-row"><span class="intel-key">Registrant</span><span class="intel-val">${data.registrant}</span></div>
                    <div class="intel-row"><span class="intel-key">Created</span><span class="intel-val">${formatDate(data.created)}</span></div>
                    <div class="intel-row"><span class="intel-key">Updated</span><span class="intel-val">${formatDate(data.updated)}</span></div>
                    <div class="intel-row"><span class="intel-key">Expires</span><span class="intel-val">${formatDate(data.expires)}</span></div>
                    <div class="intel-row"><span class="intel-key">Status</span><span class="intel-val" style="font-size:0.62rem">${data.status}</span></div>
                    <div class="intel-row" style="flex-direction:column;align-items:flex-start;gap:4px">
                        <span class="intel-key">Nameservers</span>
                        <div class="tls-san-list">${nsList}</div>
                    </div>
                </div>`;
        } else {
            container.innerHTML = `
                <div class="intel-group" style="animation-delay:0s">
                    <div class="intel-group-title">IP Registration</div>
                    <div class="intel-row"><span class="intel-key">Network Name</span><span class="intel-val highlight">${data.name}</span></div>
                    <div class="intel-row"><span class="intel-key">Range</span><span class="intel-val" style="font-size:0.62rem">${data.netRange}</span></div>
                    <div class="intel-row"><span class="intel-key">CIDR</span><span class="intel-val">${data.cidr}</span></div>
                    <div class="intel-row"><span class="intel-key">Organization</span><span class="intel-val">${data.organization}</span></div>
                    <div class="intel-row"><span class="intel-key">Country</span><span class="intel-val">${data.country}</span></div>
                    <div class="intel-row"><span class="intel-key">Registered</span><span class="intel-val">${formatDate(data.created)}</span></div>
                    <div class="intel-row"><span class="intel-key">Updated</span><span class="intel-val">${formatDate(data.updated)}</span></div>
                </div>`;
        }
    }

    // Helper: format ISO dates into a readable format
    function formatDate(dateStr) {
        if (!dateStr || dateStr === '—') return '—';
        try { return new Date(dateStr).toLocaleDateString(); }
        catch { return dateStr; }
    }

    function getCachedData() { return cachedData; }
    function clear() {
        cachedData = null;
        const s = document.getElementById('whois-section');
        if (s) s.style.display = 'none';
    }

    return { lookup, getCachedData, clear };
})();


// ═══════════════════════════════════════════════════════════════
//  URLSCAN.IO MODULE (FREE Search — No Key for Searching)
//  ──────────────────
//  urlscan.io scans and records what websites do. We search
//  their database for existing scans of our target domain.
//  API: https://urlscan.io/api/v1/search/?q=domain:{domain}
// ═══════════════════════════════════════════════════════════════
const UrlScanIO = (() => {
    let cachedData = null;

    async function search(query, isDomain) {
        const section = document.getElementById('urlscan-section');
        const container = document.getElementById('urlscan-body');
        section.style.display = 'block';

        container.innerHTML = `
            <div class="intel-placeholder">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                <p>Searching urlscan.io…</p>
            </div>`;

        try {
            // Build search query: use "domain:" for domains, "ip:" for IPs
            const searchType = isDomain ? 'domain' : 'ip';
            const url = `https://urlscan.io/api/v1/search/?q=${searchType}:${encodeURIComponent(query)}&size=5`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`urlscan.io returned ${res.status}`);

            const data = await res.json();
            const results = data.results || [];
            cachedData = { query, results };

            renderUrlScan(results, query);
            return cachedData;

        } catch (err) {
            console.error('[urlscan.io]', err);
            cachedData = null;
            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val danger">⚠ ${err.message}</span>
                    </div>
                </div>`;
            return null;
        }
    }

    function renderUrlScan(results, query) {
        const container = document.getElementById('urlscan-body');

        if (results.length === 0) {
            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-group-title">Scan Results</div>
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val" style="color:var(--text-dim)">No scans found for this target</span>
                    </div>
                </div>`;
            return;
        }

        // Build a list of the most recent scans
        const scanItems = results.slice(0, 5).map((r, i) => {
            const page = r.page || {};
            const task = r.task || {};
            const date = task.time ? new Date(task.time).toLocaleDateString() : '—';
            const verdict = r.verdicts?.overall?.malicious;
            const verdictLabel = verdict === true ? '🚨 Malicious'
                               : verdict === false ? '✓ Clean' : '? Unknown';
            const verdictColor = verdict === true ? 'var(--accent-red)'
                               : verdict === false ? 'var(--accent)' : 'var(--text-dim)';

            return `
                <div class="osint-scan-item" style="animation-delay:${i * 0.06}s">
                    <div class="intel-row">
                        <span class="intel-key">${page.domain || query}</span>
                        <span class="intel-val" style="color:${verdictColor};font-size:0.64rem">${verdictLabel}</span>
                    </div>
                    <div class="intel-row">
                        <span class="intel-key" style="font-size:0.6rem;color:var(--text-dim)">Scanned ${date}</span>
                        <span class="intel-val" style="font-size:0.6rem">${page.server || '—'}</span>
                    </div>
                    <div class="intel-row">
                        <span class="intel-key" style="font-size:0.6rem;color:var(--text-dim)">IP: ${page.ip || '—'}</span>
                        <a href="https://urlscan.io/result/${r._id}/" target="_blank" rel="noopener"
                           class="osint-link">View Report ↗</a>
                    </div>
                </div>`;
        }).join('');

        container.innerHTML = `
            <div class="intel-group" style="animation-delay:0s">
                <div class="intel-group-title">Recent Scans (${results.length})</div>
                ${scanItems}
            </div>`;
    }

    function getCachedData() { return cachedData; }
    function clear() {
        cachedData = null;
        const s = document.getElementById('urlscan-section');
        if (s) s.style.display = 'none';
    }

    return { search, getCachedData, clear };
})();


// ═══════════════════════════════════════════════════════════════
//  ABUSEIPDB MODULE (FREE — Needs API Key, 1000 checks/day)
//  ────────────────────
//  AbuseIPDB tracks reported malicious IPs (hackers, spammers).
//  Sign up free at https://www.abuseipdb.com/ to get a key.
//
//  ⚠ CORS NOTE: AbuseIPDB doesn't allow direct browser requests.
//    If CORS blocks the request, we show a helpful explanation.
//  API Docs: https://docs.abuseipdb.com/#check-endpoint
// ═══════════════════════════════════════════════════════════════
const AbuseIPDB = (() => {
    let cachedData = null;

    async function check(ip) {
        const section = document.getElementById('abuseipdb-section');
        const container = document.getElementById('abuseipdb-body');
        section.style.display = 'block';

        const apiKey = APIKeyManager.getKey('abuseipdb');

        // If no key is set, show setup instructions
        if (!apiKey) {
            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val" style="color:var(--accent-yellow)">🔑 API key required</span>
                    </div>
                    <div class="intel-row" style="margin-top:6px">
                        <span class="intel-key" style="font-size:0.62rem;color:var(--text-dim)">
                            Click the ⚙ Settings button to add your free AbuseIPDB API key.
                            Get one at abuseipdb.com (free, 1000 checks/day).
                        </span>
                    </div>
                </div>`;
            return null;
        }

        container.innerHTML = `
            <div class="intel-placeholder">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                <p>Checking AbuseIPDB…</p>
            </div>`;

        try {
            const res = await fetch(
                `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90&verbose`,
                { headers: { 'Key': apiKey, 'Accept': 'application/json' } }
            );
            if (!res.ok) throw new Error(`API returned ${res.status}`);

            const json = await res.json();
            cachedData = json.data;
            renderAbuse(json.data);
            return json.data;

        } catch (err) {
            console.error('[AbuseIPDB]', err);
            cachedData = null;
            const isCORS = err.message.includes('Failed to fetch') || err.name === 'TypeError';

            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val danger">⚠ ${isCORS ? 'CORS Blocked' : err.message}</span>
                    </div>
                    ${isCORS ? `
                    <div class="intel-row" style="margin-top:6px">
                        <span class="intel-key" style="font-size:0.62rem;color:var(--text-dim)">
                            AbuseIPDB blocks direct browser requests (CORS policy).
                            To fix this, you need a backend proxy or a CORS browser extension.
                        </span>
                    </div>` : ''}
                </div>`;
            return null;
        }
    }

    function renderAbuse(data) {
        const container = document.getElementById('abuseipdb-body');
        const score = data.abuseConfidenceScore || 0;
        const scoreColor = score <= 25 ? 'var(--accent)' :
                           score <= 50 ? 'var(--accent-yellow)' :
                           score <= 75 ? 'var(--accent-orange)' : 'var(--accent-red)';
        const lastReport = data.lastReportedAt
            ? new Date(data.lastReportedAt).toLocaleDateString() : 'Never';

        container.innerHTML = `
            <div class="intel-group" style="animation-delay:0s">
                <div class="intel-group-title">Abuse Report</div>
                <div class="intel-row">
                    <span class="intel-key">Abuse Score</span>
                    <span class="intel-val" style="color:${scoreColor};font-weight:700;font-size:0.88rem">${score}/100</span>
                </div>
                <div class="intel-row">
                    <span class="intel-key">Total Reports</span>
                    <span class="intel-val ${data.totalReports > 0 ? 'danger' : 'highlight'}">${data.totalReports || 0}</span>
                </div>
                <div class="intel-row">
                    <span class="intel-key">Reporters</span>
                    <span class="intel-val">${data.numDistinctUsers || 0}</span>
                </div>
                <div class="intel-row">
                    <span class="intel-key">Last Reported</span>
                    <span class="intel-val">${lastReport}</span>
                </div>
                <div class="intel-row">
                    <span class="intel-key">Whitelisted</span>
                    <span class="intel-val">${data.isWhitelisted ? '✓ Yes' : '✕ No'}</span>
                </div>
                <div class="intel-row">
                    <span class="intel-key">Usage Type</span>
                    <span class="intel-val">${data.usageType || '—'}</span>
                </div>
                <div class="intel-row">
                    <span class="intel-key">Domain</span>
                    <span class="intel-val">${data.domain || '—'}</span>
                </div>
            </div>`;
    }

    function getCachedData() { return cachedData; }
    function clear() {
        cachedData = null;
        const s = document.getElementById('abuseipdb-section');
        if (s) s.style.display = 'none';
    }

    return { check, getCachedData, clear };
})();
