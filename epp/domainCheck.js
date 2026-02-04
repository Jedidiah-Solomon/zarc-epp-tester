/**
 * Domain Check Module
 *
 * Provides XML templates for checking domain name availability.
 * Verifies if a domain is available for registration in ZARC registry.
 */

/**
 * Generates EPP domain check XML command
 *
 * Checks availability of one or more domain names.
 * Returns availability status and pricing information.
 *
 * @param {string} domain - Domain name to check (.co.za format)
 * @returns {string} EPP domain check XML
 */
export const domainCheckXML = (domain) =>
  `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <domain:check xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>${domain}</domain:name>
      </domain:check>
    </check>
    <clTRID>${process.env.EPP_USER}-CHECK-${Date.now()}</clTRID>
  </command>
</epp>
`.trim();
