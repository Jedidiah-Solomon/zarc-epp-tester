/**
 * EPP Logout Module
 *
 * Provides XML template for terminating EPP sessions.
 * Proper session termination is required by ZARC registry.
 */

/**
 * Generates EPP logout XML command
 *
 * Properly terminates the EPP session with ZARC registry.
 *
 * @returns {string} EPP logout XML
 */
export const logoutXML = () =>
  `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <logout/>
    <clTRID>${process.env.EPP_USER}-LOGOUT-${Date.now()}</clTRID>
  </command>
</epp>
`.trim();
