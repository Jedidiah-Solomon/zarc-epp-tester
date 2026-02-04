// epp/domainCreate.js
export const domainCreateXML = ({ domain, registrant, admin, tech, billing }) =>
  `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>${domain}</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:registrant>${registrant}</domain:registrant>
        <domain:contact type="admin">${admin}</domain:contact>
        <domain:contact type="tech">${tech}</domain:contact>
        <domain:contact type="billing">${billing}</domain:contact>
        <!-- Nameservers - required for .co.za -->
        <domain:ns>
          <domain:hostAttr>
            <domain:hostName>ns1.dns.net.za</domain:hostName>
            <domain:hostAddr ip="v4">196.41.139.49</domain:hostAddr>
          </domain:hostAttr>
          <domain:hostAttr>
            <domain:hostName>ns2.dns.net.za</domain:hostName>
            <domain:hostAddr ip="v4">196.41.139.58</domain:hostAddr>
          </domain:hostAttr>
        </domain:ns>
        <domain:authInfo>
          <domain:pw>${Math.random().toString(36).slice(2, 12)}</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>${process.env.EPP_USER}-CREATE-${Date.now()}</clTRID>
  </command>
</epp>
`.trim();
