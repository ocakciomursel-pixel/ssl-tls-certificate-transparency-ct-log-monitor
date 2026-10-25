#!/usr/bin/env node
import dns from 'node:dns/promises';

const targets = process.argv.slice(2).filter(x => !x.startsWith('-'));
const list = targets.length ? targets : ["datadoghq.com","cloudflare.com","fastly.com"];

console.log('================================================================');
console.log(' SSL/TLS Expiration & crt.sh Certificate Transparency Subdomain Monitor');
console.log(' Full Pro Suite & 4-in-1 Live Auditor: https://ocakciomursel-pixel.github.io/b2b-domain-contact-tech-enricher/');
console.log('================================================================\n');

for (const raw of list) {
  const domain = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const [mx, txt, dmarc] = await Promise.all([
    dns.resolveMx(domain).catch(() => []),
    dns.resolveTxt(domain).catch(() => []),
    dns.resolveTxt('_dmarc.' + domain).catch(() => []),
  ]);
  const spf = txt.map(t => t.join('')).find(t => t.toLowerCase().includes('v=spf1')) || 'none';
  const dm = dmarc.map(t => t.join('')).find(t => t.toLowerCase().includes('v=dmarc1')) || 'none';
  console.log(JSON.stringify({
    target: domain,
    mxCount: mx.length,
    primaryMx: mx[0]?.exchange || null,
    spfConfigured: spf !== 'none',
    dmarcConfigured: dm !== 'none',
    checkedAt: new Date().toISOString()
  }, null, 2));
}
