/* ╔══════════════════════════════════════════════════════════════╗
   ║  COMPASSINT — AI Investigator Module                     ║
   ╚══════════════════════════════════════════════════════════════╝ */



// ─────────── AI Investigation Assistant ───────────
const AIInvestigator = (() => {
    const chatBody = () => document.getElementById('ai-chat-body');
    let investigationContext = null;

    // Known cloud/hosting providers for classification
    const CLOUD_PROVIDERS = [
        { pattern: /amazon|aws|ec2/i, name: 'Amazon AWS' },
        { pattern: /google|gcp|goog/i, name: 'Google Cloud' },
        { pattern: /microsoft|azure/i, name: 'Microsoft Azure' },
        { pattern: /digitalocean/i, name: 'DigitalOcean' },
        { pattern: /linode|akamai/i, name: 'Linode/Akamai' },
        { pattern: /cloudflare/i, name: 'Cloudflare' },
        { pattern: /ovh/i, name: 'OVH' },
        { pattern: /hetzner/i, name: 'Hetzner' },
        { pattern: /vultr/i, name: 'Vultr' },
        { pattern: /contabo/i, name: 'Contabo' },
        { pattern: /hostinger/i, name: 'Hostinger' },
        { pattern: /godaddy/i, name: 'GoDaddy' },
        { pattern: /alibaba|aliyun/i, name: 'Alibaba Cloud' },
        { pattern: /oracle/i, name: 'Oracle Cloud' },
        { pattern: /rackspace/i, name: 'Rackspace' },
    ];

    const ISP_RESIDENTIAL = [
        /comcast|xfinity/i, /at&t|att\b/i, /verizon/i, /spectrum|charter/i,
        /cox\b/i, /frontier/i, /centurylink/i, /vodafone/i, /orange\b/i,
        /telefonica|movistar/i, /bt\b|british telecom/i, /airtel/i, /jio/i,
        /bsnl/i, /tata\b/i, /t-mobile|tmobile/i, /sprint/i,
    ];

    function classifyInfrastructure(isp, org, hosting, mobile) {
        const combined = `${isp} ${org}`.toLowerCase();
        for (const cp of CLOUD_PROVIDERS) {
            if (cp.pattern.test(combined)) return { type: 'cloud', provider: cp.name };
        }
        if (hosting) return { type: 'datacenter', provider: org || isp };
        if (mobile) return { type: 'mobile', provider: isp };
        for (const re of ISP_RESIDENTIAL) {
            if (re.test(combined)) return { type: 'residential', provider: isp };
        }
        if (/hosting|server|data.?center|colocation|colo\b/i.test(combined)) {
            return { type: 'datacenter', provider: org || isp };
        }
        return { type: 'isp', provider: isp };
    }

    function generateAnalysis(data, risk, tlsCert, osint, forensic) {
        const infra = classifyInfrastructure(data.isp, data.org, data.hosting, data.mobile);
        const parts = [];

        // Infrastructure ownership
        parts.push(`📡 **Infrastructure Analysis:**`);
        if (infra.type === 'cloud') {
            parts.push(`This IP (${data.query}) belongs to **${infra.provider}** cloud infrastructure located in **${data.city}, ${data.country}**. As a cloud data center network, this address likely hosts websites, APIs, VPN endpoints, or containerized services.`);
        } else if (infra.type === 'datacenter') {
            parts.push(`This IP (${data.query}) is registered to **${infra.provider}** — a data center/hosting provider in **${data.city}, ${data.country}**. The server likely hosts web services, mail servers, or application backends.`);
        } else if (infra.type === 'mobile') {
            parts.push(`This IP (${data.query}) belongs to mobile carrier **${infra.provider}** in **${data.city}, ${data.country}**. This is a cellular network address, typically assigned to mobile devices dynamically.`);
        } else if (infra.type === 'residential') {
            parts.push(`This IP (${data.query}) is a residential connection from **${infra.provider}** in **${data.city}, ${data.country}**. This suggests a home user or small office environment.`);
        } else {
            parts.push(`This IP (${data.query}) is operated by **${infra.provider}** in **${data.city}, ${data.country}** (ASN: ${data.as || 'N/A'}).`);
        }

        // Proxy/VPN detection
        if (data.proxy) {
            parts.push(`\n🛡️ **Anonymization Detected:** This IP is flagged as a proxy or VPN exit node. The true origin of traffic through this IP may be obfuscated.`);
        }

        // Risk assessment
        parts.push(`\n⚡ **Threat Assessment:** Risk score is **${risk.score}/100 (${risk.level})**.`);
        if (risk.reasons.length > 0) {
            parts.push(`Flags: ${risk.reasons.join('; ')}.`);
        } else {
            parts.push(`No significant threat indicators were detected.`);
        }

        // TLS analysis (if available)
        if (tlsCert) {
            parts.push(`\n🔒 **TLS Security:**`);
            if (tlsCert.status === 'secure') {
                parts.push(`The TLS certificate is **valid** (Grade: ${tlsCert.grade}), issued by **${tlsCert.issuer}**, expiring ${tlsCert.expiration}. Protocol: ${tlsCert.protocol}.`);
            } else if (tlsCert.status === 'warning') {
                if (tlsCert.daysLeft !== null && tlsCert.daysLeft < 30) {
                    parts.push(`⚠️ The TLS certificate expires in **${tlsCert.daysLeft} days**! Immediate renewal is recommended. Issuer: ${tlsCert.issuer}. Grade: ${tlsCert.grade}.`);
                } else {
                    parts.push(`The certificate has a grade of **${tlsCert.grade}**, which indicates room for improvement. Issuer: ${tlsCert.issuer}.`);
                }
            } else {
                parts.push(`🚨 The TLS certificate is **invalid or expired**. Grade: ${tlsCert.grade}. This is a significant security concern.`);
            }
        }

        // ── Shodan InternetDB insights ──
        if (osint && osint.shodan) {
            const s = osint.shodan;
            parts.push(`\n🔍 **Shodan InternetDB:**`);
            const ports = s.ports || [];
            const vulns = s.vulns || [];
            if (ports.length > 0) {
                parts.push(`Open ports detected: **${ports.join(', ')}** (${ports.length} total).`);
            } else {
                parts.push(`No open ports found — the host may be well-firewalled.`);
            }
            if (vulns.length > 0) {
                parts.push(`🚨 **${vulns.length} known vulnerability(ies)** found: ${vulns.slice(0, 5).join(', ')}${vulns.length > 5 ? '…' : ''}.`);
            }
        }

        // ── DNS Record insights ──
        if (forensic && forensic.dns && forensic.dns.records) {
            const recs = forensic.dns.records;
            const typeCount = Object.keys(recs).length;
            const totalRecs = Object.values(recs).reduce((s, a) => s + a.length, 0);
            parts.push(`\n🧬 **DNS Analysis:**`);
            parts.push(`Found **${totalRecs}** DNS record(s) across **${typeCount}** type(s).`);
            if (recs.MX) {
                parts.push(`Mail servers: ${recs.MX.map(r => r.data).join(', ')}.`);
            }
            if (recs.NS) {
                parts.push(`Nameservers: ${recs.NS.map(r => r.data).join(', ')}.`);
            }
            if (recs.TXT) {
                const spf = recs.TXT.find(r => r.data.includes('spf'));
                const dmarc = recs.TXT.find(r => r.data.includes('dmarc'));
                if (spf) parts.push(`✓ SPF record detected (email spoofing protection).`);
                if (dmarc) parts.push(`✓ DMARC record detected (email authentication).`);
                if (!spf && !dmarc) parts.push(`⚠️ No SPF/DMARC records — email spoofing risk.`);
            }
        }

        return parts.join('\n');
    }

    function addMessage(role, text) {
        const body = chatBody();
        const welcome = body.querySelector('.ai-welcome-msg');
        if (welcome && role === 'assistant') welcome.remove();

        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${role}`;

        const avatar = role === 'assistant' ? 'AI' : 'YOU';
        // Convert **bold** markdown to <strong> tags
        const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

        msgDiv.innerHTML = `
            <div class="ai-msg-avatar">${avatar}</div>
            <div class="ai-msg-content">
                <p>${formatted}</p>
                <span class="ai-msg-time">${time}</span>
            </div>`;
        body.appendChild(msgDiv);
        body.scrollTop = body.scrollHeight;
    }

    function showTyping() {
        const body = chatBody();
        const typing = document.createElement('div');
        typing.className = 'ai-msg assistant';
        typing.id = 'ai-typing';
        typing.innerHTML = `
            <div class="ai-msg-avatar">AI</div>
            <div class="ai-msg-content">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
            </div>`;
        body.appendChild(typing);
        body.scrollTop = body.scrollHeight;
    }

    function hideTyping() {
        const t = document.getElementById('ai-typing');
        if (t) t.remove();
    }

    async function onInvestigationComplete(data, risk, tlsCert, osintResults, forensicResults) {
        investigationContext = { data, risk, tlsCert, osintResults, forensicResults };
        
        // Expand AI panel if collapsed
        const panel = document.getElementById('ai-panel');
        if (panel.classList.contains('collapsed')) {
            panel.classList.remove('collapsed');
        }
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            document.getElementById('ai-toggle-btn').classList.add('active');
        }

        showTyping();
        await new Promise(r => setTimeout(r, 1200));
        hideTyping();

        const analysis = generateAnalysis(data, risk, tlsCert, osintResults, forensicResults);
        addMessage('assistant', analysis);
    }

    function handleUserQuery(query) {
        if (!query.trim()) return;
        addMessage('user', query);

        showTyping();
        setTimeout(() => {
            hideTyping();
            const response = processQuery(query);
            addMessage('assistant', response);
        }, 800);
    }

    function processQuery(query) {
        const q = query.toLowerCase();
        const ctx = investigationContext;

        if (!ctx) {
            return 'No investigation data available yet. Please run an investigation first by entering an IP or domain in the search bar.';
        }

        const { data, risk, tlsCert, osintResults, forensicResults } = ctx;

        if (q.includes('ip') || q.includes('address')) {
            return `The target IP is **${data.query}**, located in **${data.city}, ${data.country}** (${data.regionName}). Coordinates: ${data.lat}, ${data.lon}.`;
        }
        if (q.includes('isp') || q.includes('provider') || q.includes('who owns')) {
            return `The ISP is **${data.isp}**. The registered organization is **${data.org}**. ASN: **${data.as || 'N/A'}**.`;
        }
        if (q.includes('risk') || q.includes('threat') || q.includes('danger') || q.includes('suspicious')) {
            if (risk.score > 50) {
                return `⚠️ This target has a **${risk.level}** threat level (${risk.score}/100). Flags: ${risk.reasons.join(', ')}.`;
            }
            return `The threat level is **${risk.level}** (${risk.score}/100). ${risk.reasons.length ? 'Flags: ' + risk.reasons.join(', ') + '.' : 'No significant threats detected.'}`;
        }
        if (q.includes('vpn') || q.includes('proxy') || q.includes('tor')) {
            return data.proxy ? '🛡️ Yes, this IP is flagged as a **proxy/VPN** exit node. Traffic origin may be masked.' : 'No proxy or VPN indicators were detected for this IP.';
        }
        if (q.includes('tls') || q.includes('ssl') || q.includes('cert') || q.includes('https')) {
            return 'TLS certificate inspection is not available in this version. It requires a backend proxy service to work.';
        }
        if (q.includes('location') || q.includes('where') || q.includes('country') || q.includes('city')) {
            return `📍 The target is geolocated to **${data.city}, ${data.regionName}, ${data.country}**. Timezone: ${data.timezone}.`;
        }
        if (q.includes('cloud') || q.includes('hosting') || q.includes('datacenter') || q.includes('data center')) {
            const infra = classifyInfrastructure(data.isp, data.org, data.hosting, data.mobile);
            return `Infrastructure type: **${infra.type}** (Provider: **${infra.provider}**). ${data.hosting ? 'This is confirmed as a hosting/data center IP.' : 'This does not appear to be a hosting IP.'}`;
        }

        // ── NEW: OSINT-related queries ──
        if (q.includes('port') || q.includes('shodan') || q.includes('open port')) {
            const s = osintResults?.shodan;
            if (!s) return 'No Shodan data available for this target.';
            const ports = s.ports || [];
            const vulns = s.vulns || [];
            return `🔍 **Shodan InternetDB:** ${ports.length} open port(s): **${ports.join(', ') || 'None'}**. ${vulns.length > 0 ? `🚨 ${vulns.length} CVE(s) found: ${vulns.slice(0, 5).join(', ')}.` : 'No known vulnerabilities.'}`;
        }
        if (q.includes('vuln') || q.includes('cve')) {
            const s = osintResults?.shodan;
            if (!s) return 'No vulnerability data available. Shodan InternetDB data was not fetched.';
            const vulns = s.vulns || [];
            return vulns.length > 0 
                ? `🚨 **${vulns.length} vulnerability(ies)** found: ${vulns.join(', ')}.`
                : '✓ No known vulnerabilities detected by Shodan InternetDB.';
        }
        if (q.includes('whois') || q.includes('registr') || q.includes('rdap') || q.includes('owner')) {
            const w = osintResults?.whois;
            if (!w) return 'No WHOIS/RDAP data available for this target.';
            if (w.type === 'domain') {
                return `📋 **WHOIS:** Domain **${w.name}** | Registrar: **${w.registrar}** | Created: ${w.created} | Expires: ${w.expires}.`;
            }
            return `📋 **WHOIS:** Network **${w.name}** | Org: **${w.organization}** | Range: ${w.netRange}.`;
        }


        // ── Forensic module queries ──
        if (q.includes('dns') || q.includes('record') || q.includes('mx') || q.includes('nameserver')) {
            const d = forensicResults?.dns;
            if (!d || !d.records) return 'No DNS data available. DNS analysis only runs for domain lookups.';
            const types = Object.keys(d.records);
            const total = Object.values(d.records).reduce((s, a) => s + a.length, 0);
            let resp = `🧬 **DNS Records:** ${total} record(s) across ${types.length} type(s): **${types.join(', ')}**.`;
            if (d.records.MX) resp += `\nMail: ${d.records.MX.map(r => r.data).join(', ')}.`;
            if (d.records.NS) resp += `\nNameservers: ${d.records.NS.map(r => r.data).join(', ')}.`;
            return resp;
        }
        if (q.includes('header') || q.includes('security header') || q.includes('hsts') || q.includes('csp')) {
            return 'HTTP header inspection is not available in this version. It requires a backend proxy service to work.';
        }
        if (q.includes('timeline') || q.includes('event') || q.includes('log')) {
            const events = InvestigationTimeline.getEvents();
            if (events.length === 0) return 'No timeline events recorded yet.';
            return `📊 **Timeline:** ${events.length} event(s) recorded. Latest: **[${events[events.length-1].source}]** ${events[events.length-1].description}`;
        }

        if (q.includes('summary') || q.includes('analyze') || q.includes('full')) {
            return generateAnalysis(data, risk, tlsCert, osintResults, forensicResults);
        }
        if (q.includes('help')) {
            return 'You can ask me about: **IP address**, **ISP/owner**, **risk/threat level**, **VPN/proxy**, **location**, **cloud/hosting**, **ports/Shodan**, **vulnerabilities/CVEs**, **WHOIS/registrar**, **DNS records**, **timeline**, or request a full **summary**.';
        }

        return `I can help with investigation queries. Try asking about the **IP**, **ISP**, **risk level**, **location**, **ports**, **vulnerabilities**, **WHOIS**, or **DNS records**. Type "help" for a full list.`;
    }

    function clear() {
        investigationContext = null;
        const body = chatBody();
        if (body) {
            body.innerHTML = `
                <div class="ai-welcome-msg">
                    <div class="ai-msg assistant">
                        <div class="ai-msg-avatar">AI</div>
                        <div class="ai-msg-content">
                            <p>Hello, I'm your AI Investigation Assistant. I'll analyze targets and provide intelligence insights when you run an investigation.</p>
                            <span class="ai-msg-time">System</span>
                        </div>
                    </div>
                </div>`;
        }
    }

    return { onInvestigationComplete, handleUserQuery, addMessage, clear };
})();
