/* ╔══════════════════════════════════════════════════════════════╗
   ║  COMPASSINT — Application Engine                           ║
   ║  IP Geolocation · Traceroute Sim · Risk Analysis · Export   ║
   ║  OSINT: Shodan · WHOIS · DNS · Investigation Timeline       ║
   ╚══════════════════════════════════════════════════════════════╝ */

(() => {
    'use strict';

    // ─────────── DOM References ───────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const searchInput  = $('#search-input');
    const searchBtn    = $('#search-btn');
    const statusDot    = $('#status-dot');
    const statusText   = $('#status-text');
    const intelBody    = $('#intel-body');
    const routeBody    = $('#route-body');
    const riskFill     = $('#risk-fill');
    const riskTag      = $('#risk-tag');
    const valDistance   = $('#val-distance');
    const valLatency   = $('#val-latency');
    const valHops      = $('#val-hops');
    const btnExportJSON = $('#btn-export-json');
    const btnExportTXT  = $('#btn-export-txt');
    const btnClear      = $('#btn-clear');
    const loadingOverlay = $('#loading-overlay');

    // AI DOM refs
    const aiPanel      = $('#ai-panel');
    const aiToggleBtn  = $('#ai-toggle-btn');
    const aiCollapseBtn= $('#ai-collapse-btn');
    const aiPanelHeader= $('#ai-panel-header');
    const aiChatInput  = $('#ai-chat-input');
    const aiSendBtn    = $('#ai-send-btn');

    // ─────────── State ───────────
    let map, tileLayer;
    let currentData = null;
    let originCoords = null;
    let mapLayers = [];  // track all added layers for cleanup
    let osintResults = null;  // stores results from OSINT modules
    let forensicResults = null;  // stores results from forensic modules

    // High-risk country codes (known for bulletproof hosting, cybercrime origins)
    const HIGH_RISK_COUNTRIES = [
        'RU', 'CN', 'KP', 'IR', 'NG', 'RO', 'UA', 'BY', 'VN', 'PK', 'BD'
    ];

    // Known bulletproof / suspicious ISPs (partial match)
    const SUSPICIOUS_ISPS = [
        'bulletproof', 'privacy', 'anonymous', 'vpn', 'proxy', 'tor',
        'hosting', 'cloud', 'server', 'data center', 'colocation',
        'ovh', 'hetzner', 'digitalocean', 'linode', 'vultr', 'contabo'
    ];

    // ─────────── Initialize Map ───────────
    function initMap() {
        map = L.map('map', {
            center: [20, 0],
            zoom: 3,
            zoomControl: false,
            attributionControl: true,
            minZoom: 2,
            maxZoom: 18,
            worldCopyJump: true
        });

        // Dark Matter tile layer (CARTO)
        tileLayer = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }
        ).addTo(map);
    }

    // ─────────── Get User's Origin Location ───────────
    async function getOriginLocation() {
        try {
            // Try browser geolocation first
            if (navigator.geolocation) {
                return new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            originCoords = {
                                lat: pos.coords.latitude,
                                lon: pos.coords.longitude,
                                city: 'Your Location',
                                country: ''
                            };
                            resolve(originCoords);
                        },
                        async () => {
                            // Fallback to IP-based
                            originCoords = await getOriginViaIP();
                            resolve(originCoords);
                        },
                        { timeout: 5000 }
                    );
                });
            }
            originCoords = await getOriginViaIP();
        } catch {
            originCoords = { lat: 0, lon: 0, city: 'Unknown', country: '' };
        }
    }

    async function getOriginViaIP() {
        try {
            const res = await fetch('http://ip-api.com/json/?fields=lat,lon,city,country');
            const data = await res.json();
            return { lat: data.lat, lon: data.lon, city: data.city || 'Unknown', country: data.country || '' };
        } catch {
            return { lat: 0, lon: 0, city: 'Unknown', country: '' };
        }
    }

    // ─────────── Haversine Distance ───────────
    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const toRad = (d) => (d * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.asin(Math.sqrt(a));
    }

    // ─────────── Country Code → Flag Emoji ───────────
    function countryFlag(code) {
        if (!code || code.length !== 2) return '';
        const codePoints = [...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65);
        return String.fromCodePoint(...codePoints);
    }

    // ─────────── Risk Assessment ───────────
    function assessRisk(data) {
        let score = 0;
        let reasons = [];

        // Country risk
        if (HIGH_RISK_COUNTRIES.includes(data.countryCode)) {
            score += 35;
            reasons.push(`High-risk country: ${data.country}`);
        }

        // ISP analysis
        const ispLower = (data.isp || '').toLowerCase();
        const orgLower = (data.org || '').toLowerCase();
        const combined = ispLower + ' ' + orgLower;

        for (const keyword of SUSPICIOUS_ISPS) {
            if (combined.includes(keyword)) {
                score += 20;
                reasons.push(`Suspicious ISP/Hosting: ${keyword}`);
                break;
            }
        }

        // Proxy / VPN detection from API
        if (data.proxy) {
            score += 30;
            reasons.push('Proxy/VPN detected');
        }
        if (data.hosting) {
            score += 15;
            reasons.push('Hosting/Data center IP');
        }

        // Mobile network (slightly less risky for investigations)
        if (data.mobile) {
            score -= 5;
        }

        score = Math.max(0, Math.min(100, score));

        let level, cls;
        if (score <= 20)      { level = 'LOW';      cls = 'low'; }
        else if (score <= 45) { level = 'MEDIUM';   cls = 'medium'; }
        else if (score <= 70) { level = 'HIGH';     cls = 'high'; }
        else                  { level = 'CRITICAL'; cls = 'critical'; }

        return { score, level, cls, reasons };
    }

    // ─────────── Generate Simulated Traceroute Hops ───────────
    function generateHops(origin, target, distance) {
        const hopCount = Math.max(4, Math.min(14, Math.floor(distance / 1500) + 4));
        const hops = [];

        // Hop 0: Origin
        hops.push({
            num: 0,
            lat: origin.lat,
            lon: origin.lon,
            label: origin.city || 'Origin',
            ip: '192.168.1.1',
            latency: 1,
            type: 'origin'
        });

        // Intermediate hops (interpolated with jitter)
        for (let i = 1; i < hopCount - 1; i++) {
            const t = i / (hopCount - 1);
            const jitter = (Math.random() - 0.5) * 8;
            const lat = origin.lat + (target.lat - origin.lat) * t + jitter;
            const lon = origin.lon + (target.lon - origin.lon) * t + jitter * 1.2;
            const baseLatency = (distance / hopCount) * i * 0.03 + Math.random() * 15;

            hops.push({
                num: i,
                lat,
                lon,
                label: `Node ${i}`,
                ip: `${10 + Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
                latency: Math.round(baseLatency),
                type: 'mid'
            });
        }

        // Last hop: Target
        const totalLatency = Math.round(distance * 0.035 + Math.random() * 30 + 10);
        hops.push({
            num: hopCount - 1,
            lat: target.lat,
            lon: target.lon,
            label: target.city || 'Target',
            ip: target.query || target.ip || '?.?.?.?',
            latency: totalLatency,
            type: 'target'
        });

        return hops;
    }

    // ─────────── Create Pulsing Marker ───────────
    function createPulseMarker(lat, lon, type = '', popupContent = '') {
        const div = L.divIcon({
            className: '',
            html: `<div class="pulse-marker pulse-marker-${type}">
                       <div class="ring"></div>
                       <div class="core"></div>
                   </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        const marker = L.marker([lat, lon], { icon: div });
        if (popupContent) marker.bindPopup(popupContent);
        marker.addTo(map);
        mapLayers.push(marker);
        return marker;
    }

    // ─────────── Draw Route Arc ───────────
    function drawRouteArc(hops) {
        const coords = hops.map(h => [h.lat, h.lon]);

        // Main route polyline
        const routeLine = L.polyline(coords, {
            color: '#00ffaa',
            weight: 2.5,
            opacity: 0.6,
            dashArray: '12 8',
            className: 'route-path'
        }).addTo(map);
        mapLayers.push(routeLine);

        // Glow line
        const glowLine = L.polyline(coords, {
            color: '#00ffaa',
            weight: 6,
            opacity: 0.1
        }).addTo(map);
        mapLayers.push(glowLine);

        // Mid-hop small circles
        hops.forEach((hop, idx) => {
            if (idx === 0 || idx === hops.length - 1) return;
            const circle = L.circleMarker([hop.lat, hop.lon], {
                radius: 3,
                color: '#00aaff',
                fillColor: '#00aaff',
                fillOpacity: 0.7,
                weight: 1
            }).bindPopup(`<b>Hop ${hop.num}</b><br>${hop.ip}<br>Latency: ${hop.latency}ms`);
            circle.addTo(map);
            mapLayers.push(circle);
        });
    }

    // ─────────── Clear Map Layers ───────────
    function clearMapLayers() {
        mapLayers.forEach(layer => map.removeLayer(layer));
        mapLayers = [];
    }

    // ─────────── Render Intel Panel ───────────
    function renderIntel(data, risk) {
        const flag = countryFlag(data.countryCode);
        const typeGuess = data.hosting ? '🏢 Data Center' : data.mobile ? '📱 Mobile' : '🏠 Residential';

        intelBody.innerHTML = `
            <div class="intel-group" style="animation-delay: 0s">
                <div class="intel-group-title">Location Data</div>
                <div class="intel-row"><span class="intel-key">IP Address</span><span class="intel-val highlight">${data.query || '—'}</span></div>
                <div class="intel-row"><span class="intel-key">Country</span><span class="intel-val"><span class="country-flag">${flag}</span> ${data.country || '—'}</span></div>
                <div class="intel-row"><span class="intel-key">Region</span><span class="intel-val">${data.regionName || '—'}</span></div>
                <div class="intel-row"><span class="intel-key">City</span><span class="intel-val">${data.city || '—'}</span></div>
                <div class="intel-row"><span class="intel-key">Timezone</span><span class="intel-val">${data.timezone || '—'}</span></div>
                <div class="intel-row"><span class="intel-key">Coordinates</span><span class="intel-val">${data.lat?.toFixed(4)}, ${data.lon?.toFixed(4)}</span></div>
                <div class="intel-row"><span class="intel-key">ZIP</span><span class="intel-val">${data.zip || '—'}</span></div>
            </div>
            <div class="intel-group" style="animation-delay: 0.1s">
                <div class="intel-group-title">Infrastructure</div>
                <div class="intel-row"><span class="intel-key">ISP</span><span class="intel-val">${data.isp || '—'}</span></div>
                <div class="intel-row"><span class="intel-key">Organization</span><span class="intel-val">${data.org || '—'}</span></div>
                <div class="intel-row"><span class="intel-key">ASN</span><span class="intel-val highlight">${data.as || '—'}</span></div>
                <div class="intel-row"><span class="intel-key">Type</span><span class="intel-val">${typeGuess}</span></div>
            </div>
            <div class="intel-group" style="animation-delay: 0.2s">
                <div class="intel-group-title">Risk Analysis</div>
                <div class="intel-row"><span class="intel-key">Threat Score</span><span class="intel-val ${risk.cls}">${risk.score}/100</span></div>
                <div class="intel-row"><span class="intel-key">Level</span><span class="intel-val ${risk.cls}">${risk.level}</span></div>
                ${risk.reasons.map(r => `<div class="intel-row"><span class="intel-key">⚠</span><span class="intel-val danger">${r}</span></div>`).join('')}
                ${risk.reasons.length === 0 ? '<div class="intel-row"><span class="intel-key">✓</span><span class="intel-val highlight">No threats detected</span></div>' : ''}
            </div>
        `;
    }

    // ─────────── Render Route Panel ───────────
    function renderRoute(hops) {
        routeBody.innerHTML = hops.map(hop => {
            const latCls = hop.latency < 30 ? 'fast' : hop.latency < 80 ? 'med' : 'slow';
            return `
                <div class="hop-item" style="animation-delay: ${hop.num * 0.06}s">
                    <div class="hop-node ${hop.type}">${hop.num}</div>
                    <div class="hop-details">
                        <div class="hop-label">${hop.label}</div>
                        <div class="hop-meta">${hop.ip}</div>
                        <div class="hop-latency ${latCls}">${hop.latency}ms</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ─────────── Update Bottom Bar Metrics ───────────
    function updateMetrics(distance, hops) {
        const totalLatency = hops[hops.length - 1].latency;

        if (distance >= 1000) {
            valDistance.textContent = `${(distance / 1000).toFixed(1)}k km`;
        } else {
            valDistance.textContent = `${Math.round(distance)} km`;
        }

        valLatency.textContent = `${totalLatency}ms`;
        valLatency.style.color = totalLatency < 50 ? 'var(--accent)' : totalLatency < 150 ? 'var(--accent-yellow)' : 'var(--accent-red)';

        valHops.textContent = hops.length.toString();
    }

    // ─────────── Update Risk Meter ───────────
    function updateRiskMeter(risk) {
        riskFill.style.width = `${risk.score}%`;
        riskFill.className = `risk-fill ${risk.cls}`;
        riskTag.textContent = risk.level;
        riskTag.className = `risk-tag ${risk.cls}`;
    }

    // ─────────── Set Status ───────────
    function setStatus(text, type = 'idle') {
        statusText.textContent = text;
        statusDot.className = 'status-dot';
        if (type === 'active')  statusDot.classList.add('active');
        if (type === 'error')   statusDot.classList.add('error');
    }

    // ─────────── Toast ───────────
    function toast(message, type = 'info') {
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.textContent = message;
        const container = $('#toast-container');
        container.appendChild(el);

        const duration = 2800;
        el.style.animationDuration = `0.4s, 0.4s`;
        el.style.animationDelay = `0s, ${duration / 1000}s`;

        setTimeout(() => el.remove(), duration + 500);
    }

    // ─────────── Resolve Domain → IP ───────────
    async function resolveInput(input) {
        const trimmed = input.trim();
        if (!trimmed) throw new Error('Empty input');

        // Check if it's already an IP
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipRegex.test(trimmed)) return trimmed;

        // Treat as domain — the API can resolve it
        return trimmed;
    }

    // ─────────── Main Investigation ───────────
    async function investigate(query) {
        setStatus('RESOLVING…', 'active');
        toast('Initiating investigation…', 'info');
        InvestigationTimeline.addEvent('system', `Investigation started for: ${query}`, 'info');

        try {
            const target = await resolveInput(query);

            setStatus('FETCHING INTEL…', 'active');
            InvestigationTimeline.addEvent('geoip', `Fetching geolocation data for ${target}…`, 'info');

            const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(target)}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,query,mobile,proxy,hosting`);
            if (!res.ok) throw new Error(`API Error: ${res.status}`);

            const data = await res.json();
            if (data.status === 'fail') throw new Error(data.message || 'Lookup failed');

            currentData = data;

            // Risk assessment
            const risk = assessRisk(data);
            InvestigationTimeline.addEvent('geoip', 
                `Target located: ${data.city}, ${data.country} (${data.query}) — Threat: ${risk.level}`,
                risk.score > 50 ? 'warning' : 'success');

            // Ensure we have origin
            if (!originCoords) await getOriginLocation();

            // Distance (Haversine)
            const distance = haversineDistance(originCoords.lat, originCoords.lon, data.lat, data.lon);

            // Generate traceroute hops
            const hops = generateHops(originCoords, data, distance);

            setStatus('RENDERING…', 'active');

            // Clear previous layers
            clearMapLayers();

            // Draw route
            drawRouteArc(hops);

            // Origin marker
            createPulseMarker(originCoords.lat, originCoords.lon, 'origin',
                `<b>ORIGIN</b><br>${originCoords.city}${originCoords.country ? ', ' + originCoords.country : ''}`
            );

            // Target marker
            createPulseMarker(data.lat, data.lon, 'target',
                `<b>TARGET</b><br>${data.query}<br>${data.city}, ${data.country}<br>ISP: ${data.isp}`
            ).openPopup();

            // Fly to target
            map.flyTo([data.lat, data.lon], 6, { duration: 2 });

            // Update panels
            renderIntel(data, risk);
            renderRoute(hops);
            updateMetrics(distance, hops);
            updateRiskMeter(risk);

            // Enable export buttons
            btnExportJSON.disabled = false;
            btnExportTXT.disabled = false;

            setStatus('LIVE', 'active');
            toast('Investigation complete', 'success');

            // ══════════════════════════════════════════════
            //  OSINT MODULE LOOKUPS
            //  We run modules in parallel using Promise.allSettled.
            //  This means if one fails, the others still complete.
            // ══════════════════════════════════════════════
            setStatus('OSINT SCAN…', 'active');
            const isDomain = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(query.trim()) && !/^(\d{1,3}\.){3}\d{1,3}$/.test(query.trim());

            const osintPromises = await Promise.allSettled([
                // 1. Shodan InternetDB — always runs (IP only, free)
                ShodanLookup.lookup(data.query),

                // 2. WHOIS/RDAP — works for both IPs and domains (free)
                WhoisLookup.lookup(isDomain ? query : data.query, isDomain)
            ]);

            // Collect results into a single object for AI & exports
            osintResults = {
                shodan:    osintPromises[0].status === 'fulfilled' ? osintPromises[0].value : null,
                whois:     osintPromises[1].status === 'fulfilled' ? osintPromises[1].value : null
            };

            setStatus('LIVE', 'active');

            // ══════════════════════════════════════════════
            //  FORENSIC MODULE LOOKUPS (DNS records)
            //  DNS records for domain targets.
            // ══════════════════════════════════════════════
            if (isDomain) {
                setStatus('FORENSICS…', 'active');
                InvestigationTimeline.addEvent('system', 'Running forensic analysis modules…', 'info');

                const forensicPromises = await Promise.allSettled([
                    DNSAnalyzer.analyze(query)
                ]);

                forensicResults = {
                    dns: forensicPromises[0].status === 'fulfilled' ? forensicPromises[0].value : null
                };
            } else {
                forensicResults = { dns: null };
            }

            setStatus('LIVE', 'active');
            InvestigationTimeline.addEvent('system', 'Investigation complete — all modules finished.', 'success');

            // ── AI Investigator auto-analysis (now includes OSINT + forensic data) ──
            await AIInvestigator.onInvestigationComplete(data, risk, null, osintResults, forensicResults);

        } catch (err) {
            setStatus('ERROR', 'error');
            toast(err.message || 'Investigation failed', 'error');
            InvestigationTimeline.addEvent('system', `Investigation failed: ${err.message}`, 'error');
            console.error('[CompassInt]', err);
        }
    }

    // ─────────── Export Functions ───────────
    function exportJSON() {
        if (!currentData) return;
        const risk = assessRisk(currentData);
        const report = {
            tool: 'CompassInt',
            timestamp: new Date().toISOString(),
            target: {
                ip: currentData.query,
                country: currentData.country,
                countryCode: currentData.countryCode,
                region: currentData.regionName,
                city: currentData.city,
                coordinates: { lat: currentData.lat, lon: currentData.lon },
                timezone: currentData.timezone,
                zip: currentData.zip
            },
            infrastructure: {
                isp: currentData.isp,
                org: currentData.org,
                asn: currentData.as,
                mobile: currentData.mobile || false,
                proxy: currentData.proxy || false,
                hosting: currentData.hosting || false
            },
            risk: {
                score: risk.score,
                level: risk.level,
                reasons: risk.reasons
            },
            origin: originCoords ? {
                lat: originCoords.lat,
                lon: originCoords.lon,
                city: originCoords.city
            } : null,
            distance_km: originCoords ? Math.round(haversineDistance(originCoords.lat, originCoords.lon, currentData.lat, currentData.lon)) : null,
            // ── OSINT Data ──
            osint: {
                shodan: ShodanLookup.getCachedData(),
                whois: WhoisLookup.getCachedData()
            },
            // ── Forensic Data ──
            forensics: {
                dns: DNSAnalyzer.getCachedData()
            },
            // ── Investigation Timeline ──
            timeline: InvestigationTimeline.getEvents()
        };

        downloadBlob(JSON.stringify(report, null, 2), `compass_report_${currentData.query}.json`, 'application/json');
        toast('JSON report exported', 'success');
    }

    function exportTXT() {
        if (!currentData) return;
        const risk = assessRisk(currentData);
        const dist = originCoords ? Math.round(haversineDistance(originCoords.lat, originCoords.lon, currentData.lat, currentData.lon)) : '—';
        const lines = [
            '═══════════════════════════════════════════════════',
            '  COMPASSINT — FORENSIC REPORT',
            '═══════════════════════════════════════════════════',
            `  Generated: ${new Date().toISOString()}`,
            '',
            '── TARGET INFORMATION ──',
            `  IP Address    : ${currentData.query}`,
            `  Country       : ${currentData.country} (${currentData.countryCode})`,
            `  Region        : ${currentData.regionName}`,
            `  City          : ${currentData.city}`,
            `  Coordinates   : ${currentData.lat}, ${currentData.lon}`,
            `  Timezone      : ${currentData.timezone}`,
            `  ZIP           : ${currentData.zip || '—'}`,
            '',
            '── INFRASTRUCTURE ──',
            `  ISP           : ${currentData.isp}`,
            `  Organization  : ${currentData.org}`,
            `  ASN           : ${currentData.as}`,
            `  Mobile        : ${currentData.mobile ? 'Yes' : 'No'}`,
            `  Proxy/VPN     : ${currentData.proxy ? 'Yes' : 'No'}`,
            `  Hosting/DC    : ${currentData.hosting ? 'Yes' : 'No'}`,
            '',
            '── RISK ASSESSMENT ──',
            `  Threat Score  : ${risk.score}/100`,
            `  Threat Level  : ${risk.level}`,
            ...risk.reasons.map(r => `  ⚠ ${r}`),
            risk.reasons.length === 0 ? '  ✓ No threats detected' : '',
            '',
            '── DISTANCE ──',
            `  Distance      : ${dist} km`,
        ];

        // ── Append OSINT data to the TXT report ──
        const shodan = ShodanLookup.getCachedData();
        if (shodan) {
            lines.push('', '── SHODAN INTERNETDB ──');
            lines.push(`  Open Ports    : ${(shodan.ports || []).join(', ') || 'None'}`);
            lines.push(`  Vulns (CVEs)  : ${(shodan.vulns || []).join(', ') || 'None'}`);
            lines.push(`  Hostnames     : ${(shodan.hostnames || []).join(', ') || '—'}`);
        }
        const whois = WhoisLookup.getCachedData();
        if (whois) {
            lines.push('', '── WHOIS / RDAP ──');
            if (whois.type === 'domain') {
                lines.push(`  Domain        : ${whois.name}`);
                lines.push(`  Registrar     : ${whois.registrar}`);
                lines.push(`  Created       : ${whois.created}`);
                lines.push(`  Expires       : ${whois.expires}`);
            } else {
                lines.push(`  Network       : ${whois.name}`);
                lines.push(`  Organization  : ${whois.organization}`);
                lines.push(`  Range         : ${whois.netRange}`);
            }
        }

        // ── Append DNS data ──
        const dns = DNSAnalyzer.getCachedData();
        if (dns && dns.records) {
            lines.push('', '── DNS RECORDS ──');
            Object.keys(dns.records).forEach(type => {
                const recs = dns.records[type];
                if (recs && recs.length > 0) {
                    lines.push(`  ${type}:`);
                    recs.forEach(r => lines.push(`    → ${r.data} (TTL: ${r.ttl}s)`));
                }
            });
        }

        // ── Append Timeline ──
        const timeline = InvestigationTimeline.getEvents();
        if (timeline.length > 0) {
            lines.push('', '── INVESTIGATION TIMELINE ──');
            timeline.forEach(e => {
                lines.push(`  [${e.timestamp}] [${e.source}] ${e.description}`);
            });
        }

        lines.push(
            '',
            '═══════════════════════════════════════════════════',
            '  END OF REPORT',
            '═══════════════════════════════════════════════════'
        );

        downloadBlob(lines.join('\n'), `compass_report_${currentData.query}.txt`, 'text/plain');
        toast('TXT report exported', 'success');
    }

    function downloadBlob(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ─────────── Clear / Reset ───────────
    function clearInvestigation() {
        currentData = null;
        osintResults = null;
        clearMapLayers();
        map.flyTo([20, 0], 3, { duration: 1.5 });

        intelBody.innerHTML = `
            <div class="intel-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                <p>Awaiting target input…</p>
            </div>`;
        routeBody.innerHTML = `
            <div class="intel-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <p>No route data yet</p>
            </div>`;

        riskFill.style.width = '0%';
        riskFill.className = 'risk-fill';
        riskTag.textContent = '—';
        riskTag.className = 'risk-tag';
        valDistance.textContent = '—';
        valLatency.textContent = '—';
        valLatency.style.color = '';
        valHops.textContent = '—';

        btnExportJSON.disabled = true;
        btnExportTXT.disabled = true;

        searchInput.value = '';
        setStatus('STANDBY', 'idle');
        toast('Investigation cleared', 'info');

        // Clear AI and OSINT modules
        AIInvestigator.clear();
        ShodanLookup.clear();
        WhoisLookup.clear();

        // Clear forensic modules
        DNSAnalyzer.clear();
        InvestigationTimeline.clear();
        forensicResults = null;
    }

    // ─────────── Event Bindings ───────────
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) investigate(query);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) investigate(query);
        }
    });

    btnExportJSON.addEventListener('click', exportJSON);
    btnExportTXT.addEventListener('click', exportTXT);

    btnClear.addEventListener('click', clearInvestigation);

    // ── AI Panel Events ──
    aiToggleBtn.addEventListener('click', () => {
        const isHidden = aiPanel.classList.toggle('hidden');
        aiToggleBtn.classList.toggle('active', !isHidden);
        if (!isHidden) aiPanel.classList.remove('collapsed');
    });

    aiCollapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        aiPanel.classList.toggle('collapsed');
    });

    aiPanelHeader.addEventListener('click', () => {
        aiPanel.classList.toggle('collapsed');
    });

    aiSendBtn.addEventListener('click', () => {
        const msg = aiChatInput.value.trim();
        if (msg) { AIInvestigator.handleUserQuery(msg); aiChatInput.value = ''; }
    });

    aiChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const msg = aiChatInput.value.trim();
            if (msg) { AIInvestigator.handleUserQuery(msg); aiChatInput.value = ''; }
        }
    });

    // Keyboard shortcut: Ctrl+K to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });

    // ─────────── Boot Sequence ───────────
    async function boot() {
        initMap();
        await getOriginLocation();

        // Hide loading overlay after a brief display
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 1800);

        setStatus('STANDBY', 'idle');
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
