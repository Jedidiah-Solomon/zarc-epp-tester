/**
 * Domain Update Module
 *
 * Provides XML templates for updating domain registrations.
 * Used to add nameservers to domains after creation.
 */

/**
 * Generates EPP domain update XML command for adding nameservers
 *
 * Adds nameservers to an existing domain registration.
 * ZARC requires 2-5 nameservers to be added after domain creation.
 *
 * @param {Object} params - Domain update parameters
 * @param {string} params.domain - Domain name to update
 * @param {Array} params.nameservers - Array of nameserver hostnames
 * @returns {string} EPP domain update XML
 */
export const domainUpdateAddNameserversXML = ({ domain, nameservers }) =>
  `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>${domain}</domain:name>
        <domain:add>
          <domain:ns>
            ${nameservers.map((ns) => `<domain:hostObj>${ns}</domain:hostObj>`).join("\n            ")}
          </domain:ns>
        </domain:add>
      </domain:update>
    </update>
    <clTRID>${process.env.EPP_USER}-UPDATE-${Date.now()}</clTRID>
  </command>
</epp>
`.trim();
