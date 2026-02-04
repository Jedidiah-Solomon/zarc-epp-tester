export const domainCreateXML = ({ domain, registrant, admin, tech, billing }) =>
  `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>${domain}</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:ns>
          <domain:hostAttr>
            <domain:hostName>ns1.${domain}</domain:hostName>
            <domain:hostAddr ip="v4">192.168.0.1</domain:hostAddr>
          </domain:hostAttr>
          <domain:hostAttr>
            <domain:hostName>ns2.${domain}</domain:hostName>
            <domain:hostAddr ip="v4">192.168.0.2</domain:hostAddr>
          </domain:hostAttr>
        </domain:ns>
        <domain:registrant>${registrant}</domain:registrant>
        <domain:contact type="admin">${admin}</domain:contact>
        <domain:contact type="tech">${tech}</domain:contact>
        <domain:contact type="billing">${billing}</domain:contact>
        <domain:authInfo>
          <domain:pw>${Math.random().toString(36).slice(2, 12)}</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>${process.env.EPP_USER}-CREATE-${Date.now()}</clTRID>
  </command>
</epp>
`.trim();
