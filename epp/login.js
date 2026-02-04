/**
 * EPP Login Module
 *
 * Provides XML templates for EPP login and logout commands.
 * Handles authentication and session management with ZARC registry.
 */

/**
 * Generates EPP login XML command
 *
 * Includes required service URIs for domain, contact, and host operations
 * as specified by ZARC registry requirements.
 *
 * @returns {string} EPP login XML
 */
export const loginXML = () =>
  `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <login>
      <clID>${process.env.EPP_USER}</clID>
      <pw>${process.env.EPP_PASS}</pw>
      <options>
        <version>1.0</version>
        <lang>en</lang>
      </options>
      <svcs>
        <objURI>urn:ietf:params:xml:ns:domain-1.0</objURI>
        <objURI>urn:ietf:params:xml:ns:contact-1.0</objURI>
        <objURI>urn:ietf:params:xml:ns:host-1.0</objURI>
        <svcExtension>
          <extURI>urn:ietf:params:xml:ns:secDNS-1.1</extURI>
        </svcExtension>
      </svcs>
    </login>
    <clTRID>${process.env.EPP_USER}-LOGIN-${Date.now()}</clTRID>
  </command>
</epp>
`.trim();
