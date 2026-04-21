/* ╔══════════════════════════════════════════════════════════════╗
   ║  SENTINEL ROUTE — AI Investigator & TLS Inspector Modules   ║
   ╚══════════════════════════════════════════════════════════════╝ */

// ─────────── TLS / SSL Certificate Inspector ───────────
const TLSInspector = (() => {
    let cachedCert = null;

    function isDomain(input) {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        return domainRegex.test(input.trim()) && !ipRegex.test(input.trim());
    }

    async function fetchCertificate(domain) {
        const tlsSection = document.getElementById('tls-section');
        const tlsBody = document.getElementById('tls-body');
        
        tlsSection.style.display = 'block';
        tlsBody.innerHTML = `
            <div class="intel-placeholder">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                <p>Analyzing TLS certificate…</p>
            </div>`;

        try {
            const res = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(domain)}&fromCache=on&maxAge=24`);
            if (!res.ok) throw new Error(`SSL Labs API error: ${res.status}`);
            const data = await res.json();

            // SSL Labs may still be processing
            if (data.status === 'IN_PROGRESS' || data.status === 'DNS') {
                tlsBody.innerHTML = `
                    <div class="intel-placeholder">
                        <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                        <p>SSL Labs is scanning… retrying in 15s</p>
                    </div>`;
                await new Promise(r => setTimeout(r, 15000));
                return await fetchCertificate(domain);
            }

            if (data.status === 'ERROR') {
                throw new Error(data.statusMessage || 'Certificate lookup failed');
            }

            const cert = parseCertData(data, domain);
            cachedCert = cert;
            renderTLS(cert);
            return cert;

        } catch (err) {
            console.error('[TLS Inspector]', err);
            cachedCert = null;
            tlsBody.innerHTML = `
                <div class="intel-group">
                    <div class="intel-row">
                        <span class="intel-key">Status</span>
                        <span class="intel-val danger">⚠ ${err.message}</span>
                    </div>
                    <div class="intel-row" style="margin-top:8px;">
                        <span class="intel-key" style="font-size:0.66rem;color:var(--text-dim)">Note: SSL Labs may be rate-limited or the domain may not support HTTPS.</span>
                    </div>
                </div>`;
            return null;
        }
    }

    function parseCertData(data, domain) {
        const endpoint = data.endpoints?.[0] || {};
        const grade = endpoint.grade || 'N/A';
        const details = endpoint.details || {};
        const certData = details.cert || {};
        const protocol = details.protocols?.[details.protocols.length - 1] || {};

        const notBefore = certData.notBefore ? new Date(certData.notBefore) : null;
        const notAfter = certData.notAfter ? new Date(certData.notAfter) : null;
        const now = new Date();
        const daysLeft = notAfter ? Math.ceil((notAfter - now) / (1000 * 60 * 60 * 24)) : null;

        let status = 'secure';
        if (daysLeft !== null && daysLeft < 0) status = 'error';
        else if (daysLeft !== null && daysLeft < 30) status = 'warning';
        else if (grade && !['A', 'A+', 'B'].includes(grade)) status = 'warning';
        if (grade && ['F', 'T', 'M'].includes(grade)) status = 'error';

        return {
            domain,
            issuer: certData.issuerSubject || certData.issuerLabel || 'Unknown',
            validFrom: notBefore ? notBefore.toLocaleDateString() : 'Unknown',
            expiration: notAfter ? notAfter.toLocaleDateString() : 'Unknown',
            daysLeft,
            protocol: protocol.name ? `${protocol.name} ${protocol.version}` : 'Unknown',
            grade,
            status,
            sans: certData.altNames || [],
            subject: certData.commonNames?.[0] || domain
        };
    }

    function renderTLS(cert) {
        const tlsBody = document.getElementById('tls-body');
        const gradeClass = ['A', 'A+'].includes(cert.grade) ? 'grade-a' :
                           cert.grade === 'B' ? 'grade-b' :
                           cert.grade === 'C' ? 'grade-c' : 'grade-low';

        const statusLabel = cert.status === 'secure' ? '✓ SECURE' :
                            cert.status === 'warning' ? '⚠ WARNING' : '✕ INSECURE';

        const expiryNote = cert.daysLeft !== null && cert.daysLeft < 30 && cert.daysLeft >= 0
            ? `<div class="intel-row"><span class="intel-key">⚠ Expiry Warning</span><span class="intel-val danger">Expires in ${cert.daysLeft} days</span></div>`
            : cert.daysLeft !== null && cert.daysLeft < 0
            ? `<div class="intel-row"><span class="intel-key">✕ EXPIRED</span><span class="intel-val danger">Expired ${Math.abs(cert.daysLeft)} days ago</span></div>`
            : '';

        const sansHTML = cert.sans.length > 0
            ? `<div class="intel-row" style="flex-direction:column;align-items:flex-start;gap:4px;">
                <span class="intel-key">SANs (${cert.sans.length})</span>
                <div class="tls-san-list">${cert.sans.slice(0, 10).map(s => `<div class="tls-san-item">› ${s}</div>`).join('')}${cert.sans.length > 10 ? `<div class="tls-san-item" style="color:var(--text-dim)">…and ${cert.sans.length - 10} more</div>` : ''}</div>
               </div>` : '';

        tlsBody.innerHTML = `
            <div class="intel-group" style="animation-delay:0s">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                    <span class="tls-badge ${cert.status}">${statusLabel}</span>
                    <span class="tls-grade ${gradeClass}">${cert.grade}</span>
                </div>
                <div class="intel-row"><span class="intel-key">Subject</span><span class="intel-val highlight">${cert.subject}</span></div>
                <div class="intel-row"><span class="intel-key">Issuer</span><span class="intel-val">${cert.issuer}</span></div>
                <div class="intel-row"><span class="intel-key">Valid From</span><span class="intel-val">${cert.validFrom}</span></div>
                <div class="intel-row"><span class="intel-key">Expires</span><span class="intel-val">${cert.expiration}</span></div>
                ${expiryNote}
                <div class="intel-row"><span class="intel-key">Protocol</span><span class="intel-val">${cert.protocol}</span></div>
                ${sansHTML}
            </div>`;
    }

    function getCachedCert() { return cachedCert; }
    function clear() {
        cachedCert = null;
        const s = document.getElementById('tls-section');
        if (s) s.style.display = 'none';
    }

    return { isDomain, fetchCertificate, getCachedCert, clear };
})();


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

    function generateAnalysis(data, risk, tlsCert) {
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

        // TLS analysis
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

    async function onInvestigationComplete(data, risk, tlsCert) {
        investigationContext = { data, risk, tlsCert };
        
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

        const analysis = generateAnalysis(data, risk, tlsCert);
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

        const { data, risk, tlsCert } = ctx;

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
            if (!tlsCert) return 'No TLS certificate data available. TLS inspection is only performed for domain lookups.';
            return `🔒 TLS Grade: **${tlsCert.grade}** | Issuer: **${tlsCert.issuer}** | Expires: **${tlsCert.expiration}** | Protocol: **${tlsCert.protocol}** | Status: **${tlsCert.status}**.`;
        }
        if (q.includes('location') || q.includes('where') || q.includes('country') || q.includes('city')) {
            return `📍 The target is geolocated to **${data.city}, ${data.regionName}, ${data.country}**. Timezone: ${data.timezone}.`;
        }
        if (q.includes('cloud') || q.includes('hosting') || q.includes('datacenter') || q.includes('data center')) {
            const infra = classifyInfrastructure(data.isp, data.org, data.hosting, data.mobile);
            return `Infrastructure type: **${infra.type}** (Provider: **${infra.provider}**). ${data.hosting ? 'This is confirmed as a hosting/data center IP.' : 'This does not appear to be a hosting IP.'}`;
        }
        if (q.includes('summary') || q.includes('report') || q.includes('analyze') || q.includes('full')) {
            return generateAnalysis(data, risk, tlsCert);
        }
        if (q.includes('help')) {
            return 'You can ask me about: **IP address**, **ISP/owner**, **risk/threat level**, **VPN/proxy**, **TLS/SSL certificate**, **location**, **cloud/hosting**, or request a full **summary**.';
        }

        return `I can help with investigation queries. Try asking about the **IP**, **ISP**, **risk level**, **TLS certificate**, **location**, or **infrastructure type**. Type "help" for a list of topics.`;
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
