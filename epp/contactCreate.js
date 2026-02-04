/**
 * Contact Creation Module
 *
 * Provides XML templates for creating contact objects in ZARC registry.
 * Contacts represent domain registrants and associated parties.
 * Simple version that works with ZARC OTE.
 */

/**
 * Generates EPP contact create XML command
 *
 * Creates a new contact with postal information, voice, email, and auth info.
 * Uses type="loc" for localized format as required by ZARC.
 *
 * @param {Object} params - Contact parameters
 * @param {string} params.id - Contact identifier
 * @param {string} params.name - Full name
 * @param {string} [params.org] - Organization name (optional)
 * @param {string} params.street - Street address
 * @param {string} params.city - City
 * @param {string} params.sp - State/Province
 * @param {string} params.pc - Postal code
 * @param {string} params.cc - Country code (2-letter ISO)
 * @param {string} params.email - Email address
 * @param {string} params.phone - Phone number in E.164 format
 * @returns {string} EPP contact create XML
 */
export const contactCreateXML = ({
  id,
  name,
  org,
  street,
  city,
  sp,
  pc,
  cc,
  email,
  phone,
}) =>
  `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <contact:create xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>${id}</contact:id>
        <contact:postalInfo type="loc">
          <contact:name>${name}</contact:name>
          ${org ? `<contact:org>${org}</contact:org>` : ""}
          <contact:addr>
            <contact:street>${street}</contact:street>
            <contact:city>${city}</contact:city>
            <contact:sp>${sp}</contact:sp>
            <contact:pc>${pc}</contact:pc>
            <contact:cc>${cc}</contact:cc>
          </contact:addr>
        </contact:postalInfo>
        <contact:voice>${phone}</contact:voice>
        <contact:email>${email}</contact:email>
        <contact:authInfo>
          <contact:pw>${Math.random().toString(36).slice(2, 12)}</contact:pw>
        </contact:authInfo>
      </contact:create>
    </create>
    <clTRID>${process.env.EPP_USER}-CONTACT-${Date.now()}</clTRID>
  </command>
</epp>
`.trim();
