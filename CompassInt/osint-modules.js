/* ╔══════════════════════════════════════════════════════════════╗
   ║  COMPASSINT — OSINT Integration Modules                 ║
   ║  WHOIS/RDAP · Shodan InternetDB                             ║
   ║                                                              ║
   ║  Each module below is an IIFE (Immediately Invoked Function  ║
   ║  Expression). Think of each one as a mini-class that keeps   ║
   ║  its internal variables private and only exposes the methods  ║
   ║  we need via the "return" statement at the bottom.           ║
   ╚══════════════════════════════════════════════════════════════╝ */


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



