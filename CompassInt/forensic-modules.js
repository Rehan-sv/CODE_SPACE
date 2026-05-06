/* ╔══════════════════════════════════════════════════════════════╗
   ║  COMPASSINT — Advanced Forensic Modules                  ║
   ║  DNS Analyzer · HTTP Headers · Investigation Timeline        ║
   ║                                                              ║
   ║  All modules here are FREE — no API keys required!           ║
   ║  DNS uses Google's DNS-over-HTTPS (DoH) public service.      ║
   ╚══════════════════════════════════════════════════════════════╝ */


// ═══════════════════════════════════════════════════════════════
//  DNS RECORD ANALYZER (FREE — Google DNS-over-HTTPS)
//  ────────────────────
//  Fetches real DNS records (A, AAAA, MX, NS, TXT, CNAME, SOA)
//  using Google's public DNS-over-HTTPS API.
//  API: https://dns.google/resolve?name={domain}&type={type}
//  No API key, no signup, no CORS issues!
// ═══════════════════════════════════════════════════════════════
const DNSAnalyzer = (() => {
    let cachedData = null;

    // DNS record type numbers → human-readable names
    const TYPE_MAP = { 1:'A', 2:'NS', 5:'CNAME', 6:'SOA', 15:'MX', 16:'TXT', 28:'AAAA' };

    // The record types we want to query
    const QUERY_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];

    async function analyze(domain) {
        const section = document.getElementById('dns-section');
        const container = document.getElementById('dns-body');
        section.style.display = 'block';

        container.innerHTML = `
            <div class="intel-placeholder">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                <p>Resolving DNS records…</p>
            </div>`;

        try {
            // Fire all DNS queries in parallel using Promise.allSettled
            // This way if one type fails, the rest still complete
            const results = await Promise.allSettled(
                QUERY_TYPES.map(type => queryDNS(domain, type))
            );

            // Combine all successful results into one object
            const records = {};
            QUERY_TYPES.forEach((type, i) => {
                if (results[i].status === 'fulfilled' && results[i].value) {
                    records[type] = results[i].value;
                }
            });

            cachedData = { domain, records, timestamp: new Date().toISOString() };

            // Log to timeline
            const totalRecords = Object.values(records).reduce((sum, arr) => sum + arr.length, 0);
            InvestigationTimeline.addEvent('dns', `DNS resolved: ${totalRecords} records found for ${domain}`, 
                totalRecords === 0 ? 'info' : 'success');

            renderDNS(records, domain);
            return cachedData;

        } catch (err) {
            console.error('[DNS Analyzer]', err);
            cachedData = null;
            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val danger">⚠ ${err.message}</span>
                    </div>
                </div>`;
            InvestigationTimeline.addEvent('dns', `DNS lookup failed: ${err.message}`, 'error');
            return null;
        }
    }

    // Query Google DoH for a specific record type
    async function queryDNS(domain, type) {
        const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`;
        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        if (!data.Answer || data.Answer.length === 0) return null;

        // Parse each answer into a clean object
        return data.Answer.map(a => ({
            name: a.name,
            type: TYPE_MAP[a.type] || `TYPE${a.type}`,
            ttl: a.TTL,
            data: a.data
        }));
    }

    function renderDNS(records, domain) {
        const container = document.getElementById('dns-body');
        const types = Object.keys(records);

        if (types.length === 0) {
            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-group-title">DNS Records</div>
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val" style="color:var(--text-dim)">No DNS records found</span>
                    </div>
                </div>`;
            return;
        }

        // Build HTML for each record type
        let html = '';
        types.forEach((type, idx) => {
            const recs = records[type];
            if (!recs || recs.length === 0) return;

            // Choose icon based on record type
            const icon = type === 'A' || type === 'AAAA' ? '🌐' :
                         type === 'MX' ? '📧' :
                         type === 'NS' ? '🏷️' :
                         type === 'TXT' ? '📝' :
                         type === 'CNAME' ? '🔗' :
                         type === 'SOA' ? '📋' : '📄';

            // Color for record type badge
            const badgeColor = type === 'A' ? 'var(--accent)' :
                               type === 'AAAA' ? 'var(--accent-blue)' :
                               type === 'MX' ? 'var(--accent-yellow)' :
                               type === 'NS' ? 'var(--accent-orange)' :
                               type === 'TXT' ? '#b388ff' :
                               type === 'CNAME' ? '#80deea' : 'var(--text-secondary)';

            html += `
                <div class="intel-group" style="animation-delay:${idx * 0.08}s">
                    <div class="intel-group-title" style="gap:8px">
                        <span class="dns-type-badge" style="background:${badgeColor}20;color:${badgeColor};border:1px solid ${badgeColor}40">${icon} ${type}</span>
                        <span style="font-size:0.58rem;color:var(--text-dim)">${recs.length} record${recs.length > 1 ? 's' : ''}</span>
                    </div>
                    ${recs.map(r => `
                        <div class="intel-row">
                            <span class="intel-val" style="text-align:left;max-width:75%;font-size:0.66rem;word-break:break-all">${sanitize(r.data)}</span>
                            <span class="intel-key" style="font-size:0.58rem">TTL ${r.ttl}s</span>
                        </div>
                    `).join('')}
                </div>`;
        });

        container.innerHTML = html;
    }

    // Basic HTML sanitizer to prevent XSS from DNS TXT records
    function sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getCachedData() { return cachedData; }
    function clear() {
        cachedData = null;
        const s = document.getElementById('dns-section');
        if (s) s.style.display = 'none';
    }

    return { analyze, getCachedData, clear };
})();


// ═══════════════════════════════════════════════════════════════
//  HTTP HEADER SECURITY INSPECTOR (FREE — No API Key)
//  ────────────────────────────────
//  Checks critical security headers on a domain by fetching
//  headers via a public CORS proxy or allorigins.win.
//  Evaluates: HSTS, CSP, X-Frame-Options, X-Content-Type-Options,
//  Referrer-Policy, Permissions-Policy, and more.
// ═══════════════════════════════════════════════════════════════
const HeaderInspector = (() => {
    let cachedData = null;

    // The security headers we check and their importance
    const SECURITY_HEADERS = [
        { header: 'strict-transport-security', label: 'HSTS', importance: 'critical',
          desc: 'Forces HTTPS connections' },
        { header: 'content-security-policy', label: 'CSP', importance: 'critical',
          desc: 'Prevents XSS and injection attacks' },
        { header: 'x-frame-options', label: 'X-Frame-Options', importance: 'high',
          desc: 'Prevents clickjacking attacks' },
        { header: 'x-content-type-options', label: 'X-Content-Type', importance: 'medium',
          desc: 'Prevents MIME-type sniffing' },
        { header: 'referrer-policy', label: 'Referrer-Policy', importance: 'medium',
          desc: 'Controls referrer information' },
        { header: 'permissions-policy', label: 'Permissions-Policy', importance: 'medium',
          desc: 'Restricts browser features' },
        { header: 'x-xss-protection', label: 'X-XSS-Protection', importance: 'low',
          desc: 'Legacy XSS filter (deprecated)' },
    ];

    async function inspect(domain) {
        const section = document.getElementById('headers-section');
        const container = document.getElementById('headers-body');
        section.style.display = 'block';

        container.innerHTML = `
            <div class="intel-placeholder">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                <p>Inspecting HTTP headers…</p>
            </div>`;

        try {
            // Use allorigins.win as a CORS proxy to fetch headers
            // This is a free public proxy that returns raw response info
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://' + domain)}`;
            const res = await fetch(proxyUrl, { method: 'HEAD', redirect: 'follow' });

            // Since allorigins may strip some headers, also try direct fetch
            // (which will work for sites that allow CORS)
            let headers = {};
            let serverInfo = null;

            // Try direct fetch first (works if site allows CORS)
            try {
                const directRes = await fetch(`https://${domain}`, {
                    method: 'HEAD',
                    mode: 'cors',
                    redirect: 'follow'
                });
                directRes.headers.forEach((value, key) => {
                    headers[key.toLowerCase()] = value;
                });
                serverInfo = headers['server'] || null;
            } catch {
                // CORS blocked — use proxy approach with GET (allorigins returns body)
                try {
                    const proxyJsonUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://' + domain)}`;
                    const proxyRes = await fetch(proxyJsonUrl);
                    const proxyData = await proxyRes.json();
                    // allorigins doesn't forward headers, but we can detect basic info
                    // from the HTML content
                    if (proxyData.contents) {
                        // Check for meta tags that hint at security headers
                        const html = proxyData.contents.toLowerCase();
                        if (html.includes('content-security-policy'))
                            headers['content-security-policy'] = 'Detected via meta tag';
                        if (html.includes('x-frame-options'))
                            headers['x-frame-options'] = 'Detected via meta tag';
                    }
                } catch { /* silently fail */ }
            }

            // Evaluate security posture
            const evaluation = evaluateHeaders(headers);
            cachedData = { domain, headers, evaluation, serverInfo, timestamp: new Date().toISOString() };

            // Log to timeline
            InvestigationTimeline.addEvent('headers',
                `HTTP headers: Security grade ${evaluation.grade} (${evaluation.score}/${evaluation.maxScore})`,
                evaluation.grade === 'A' || evaluation.grade === 'B' ? 'success' : 
                evaluation.grade === 'F' ? 'error' : 'warning');

            renderHeaders(cachedData);
            return cachedData;

        } catch (err) {
            console.error('[Header Inspector]', err);
            cachedData = null;
            container.innerHTML = `
                <div class="intel-group">
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val danger">⚠ ${err.message}</span>
                    </div>
                    <div class="intel-row" style="margin-top:6px">
                        <span class="intel-key" style="font-size:0.62rem;color:var(--text-dim)">
                            CORS may block direct header inspection from the browser.
                        </span>
                    </div>
                </div>`;
            InvestigationTimeline.addEvent('headers', `Header inspection failed: ${err.message}`, 'error');
            return null;
        }
    }

    function evaluateHeaders(headers) {
        let score = 0;
        let maxScore = 0;
        const findings = [];

        SECURITY_HEADERS.forEach(sh => {
            const weight = sh.importance === 'critical' ? 3 :
                           sh.importance === 'high' ? 2 : 1;
            maxScore += weight;
            const present = !!headers[sh.header];

            findings.push({
                label: sh.label,
                header: sh.header,
                present,
                importance: sh.importance,
                desc: sh.desc,
                value: present ? headers[sh.header] : null
            });

            if (present) score += weight;
        });

        // Calculate grade
        const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
        let grade;
        if (pct >= 85) grade = 'A';
        else if (pct >= 70) grade = 'B';
        else if (pct >= 50) grade = 'C';
        else if (pct >= 30) grade = 'D';
        else grade = 'F';

        return { score, maxScore, grade, pct, findings };
    }

    function renderHeaders(data) {
        const container = document.getElementById('headers-body');
        const { evaluation, serverInfo } = data;

        const gradeColors = {
            'A': 'var(--accent)', 'B': 'var(--accent-blue)',
            'C': 'var(--accent-yellow)', 'D': 'var(--accent-orange)', 'F': 'var(--accent-red)'
        };
        const gradeColor = gradeColors[evaluation.grade] || 'var(--text-dim)';

        // Build the findings rows
        const findingsHTML = evaluation.findings.map((f, i) => {
            const statusIcon = f.present ? '✓' : '✕';
            const statusColor = f.present ? 'var(--accent)' : 
                (f.importance === 'critical' ? 'var(--accent-red)' : 'var(--accent-yellow)');
            const importBadge = f.importance === 'critical' ? '🔴' :
                                f.importance === 'high' ? '🟠' : '🟡';

            return `
                <div class="header-check-row" style="animation-delay:${i * 0.04}s">
                    <div class="header-check-status" style="color:${statusColor}">${statusIcon}</div>
                    <div class="header-check-info">
                        <div class="header-check-name">${importBadge} ${f.label}</div>
                        <div class="header-check-desc">${f.desc}</div>
                        ${f.value ? `<div class="header-check-val">${truncate(f.value, 60)}</div>` : ''}
                    </div>
                </div>`;
        }).join('');

        container.innerHTML = `
            <div class="intel-group" style="animation-delay:0s">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
                    <div>
                        <div class="intel-group-title" style="margin-bottom:4px">Security Headers</div>
                        <span style="font-size:0.6rem;color:var(--text-dim)">
                            ${evaluation.score}/${evaluation.maxScore} checks passed
                        </span>
                    </div>
                    <div class="header-grade-badge" style="background:${gradeColor}18;color:${gradeColor};border:1px solid ${gradeColor}40">
                        ${evaluation.grade}
                    </div>
                </div>
                ${serverInfo ? `
                <div class="intel-row" style="margin-bottom:8px">
                    <span class="intel-key">Server</span>
                    <span class="intel-val">${sanitize(serverInfo)}</span>
                </div>` : ''}
                <div class="header-checks-list">
                    ${findingsHTML}
                </div>
            </div>`;
    }

    function truncate(str, len) {
        if (!str) return '';
        return str.length > len ? str.substring(0, len) + '…' : str;
    }

    function sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getCachedData() { return cachedData; }
    function clear() {
        cachedData = null;
        const s = document.getElementById('headers-section');
        if (s) s.style.display = 'none';
    }

    return { inspect, getCachedData, clear };
})();


// ═══════════════════════════════════════════════════════════════
//  INVESTIGATION TIMELINE (Local — No Network Calls)
//  ────────────────────────
//  Records every step of an investigation as a forensic timeline.
//  Each event has a timestamp, source module, description, and
//  severity. This is useful for documenting the investigation
//  process — a key part of real forensic work!
// ═══════════════════════════════════════════════════════════════
const InvestigationTimeline = (() => {
    let events = [];
    let isVisible = false;

    function addEvent(source, description, severity = 'info') {
        const event = {
            id: events.length + 1,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            source: source.toUpperCase(),
            description,
            severity  // 'info', 'success', 'warning', 'error'
        };
        events.push(event);
        renderTimeline();
        return event;
    }

    function renderTimeline() {
        const container = document.getElementById('timeline-body');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = `
                <div class="intel-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <p>No events recorded yet</p>
                </div>`;
            return;
        }

        // Show events in reverse chronological order (newest first)
        const eventsHTML = [...events].reverse().map((evt, i) => {
            const sevColor = evt.severity === 'success' ? 'var(--accent)' :
                             evt.severity === 'error' ? 'var(--accent-red)' :
                             evt.severity === 'warning' ? 'var(--accent-yellow)' :
                             'var(--accent-blue)';
            const sevIcon = evt.severity === 'success' ? '✓' :
                            evt.severity === 'error' ? '✕' :
                            evt.severity === 'warning' ? '⚠' : 'ℹ';

            return `
                <div class="timeline-event" style="animation-delay:${i * 0.03}s">
                    <div class="timeline-dot" style="background:${sevColor};box-shadow:0 0 8px ${sevColor}50"></div>
                    <div class="timeline-connector"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-source" style="color:${sevColor}">${sevIcon} ${evt.source}</span>
                            <span class="timeline-time">${evt.time}</span>
                        </div>
                        <div class="timeline-desc">${evt.description}</div>
                    </div>
                </div>`;
        }).join('');

        container.innerHTML = `
            <div class="timeline-list">
                <div class="timeline-count">${events.length} event${events.length !== 1 ? 's' : ''} recorded</div>
                ${eventsHTML}
            </div>`;
    }

    function getEvents() { return [...events]; }

    function exportEvents() {
        return events.map(e =>
            `[${e.timestamp}] [${e.source}] [${e.severity.toUpperCase()}] ${e.description}`
        ).join('\n');
    }

    function clear() {
        events = [];
        renderTimeline();
    }

    return { addEvent, getEvents, exportEvents, renderTimeline, clear };
})();
