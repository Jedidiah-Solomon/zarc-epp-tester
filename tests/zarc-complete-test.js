/**
 * Complete ZARC OTE Test following their exact documentation
 * Tests: Host Create → Domain Create with those hosts
 */

import dotenv from "dotenv";
import { connectEpp, sendEpp } from "../epp/connect.js";
import { loginXML } from "../epp/login.js";

dotenv.config({ path: "./config/zarc.env" });

const socket = connectEpp();

const waitFor = (timeout = 5000) =>
  new Promise((resolve, reject) => {
    let chunks = [];
    let total = 0;

    const onData = (data) => {
      chunks.push(data);
      total += data.length;
      const buffer = Buffer.concat(chunks, total);

      if (buffer.length >= 4) {
        const messageLength = buffer.readUInt32BE(0);

        if (buffer.length >= messageLength) {
          socket.removeListener("data", onData);
          clearTimeout(timer);
          const payload = buffer.slice(4, messageLength).toString();
          resolve(payload);
        }
      }
    };

    const timer = setTimeout(() => {
      socket.removeListener("data", onData);
      reject(new Error(`Timeout after ${timeout}ms`));
    }, timeout);

    socket.on("data", onData);
  });

(async () => {
  try {
    console.log("=== ZARC Complete Test (Following Documentation) ===");

    try {
      await waitFor(3000);
    } catch (error) {}

    console.log("1. Logging in");
    sendEpp(socket, loginXML());
    const loginResponse = await waitFor();

    if (!loginResponse.includes("Access granted")) {
      throw new Error("Login failed");
    }

    console.log("✅ Login successful");

    const timestamp = Date.now();

    // Create host first (exactly like ZARC documentation)
    console.log("\n2. Creating host (nameserver)");
    const hostname = `ns1.hordanso${timestamp}.test.dnservices.co.za`;
    const hostXml = `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <host:create xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>${hostname}</host:name>
        <host:addr ip="v4">192.168.0.1</host:addr>
        <host:addr ip="v6">fc00::1</host:addr>
      </host:create>
    </create>
    <clTRID>${process.env.EPP_USER}-HOST-${timestamp}</clTRID>
  </command>
</epp>`;

    console.log(`Hostname: ${hostname}`);
    console.log("Host XML:", hostXml);

    sendEpp(socket, hostXml);
    const hostResponse = await waitFor();
    const hostCode = hostResponse.match(/code="(\d+)"/)?.[1];

    console.log(`Host create code: ${hostCode}`);

    if (hostCode === "1000") {
      console.log("✅ Host created successfully");

      // Now create domain using that host
      console.log("\n3. Creating domain with hostObj");
      const domain = `hordanso${timestamp}.test.dnservices.co.za`;
      const ns2 = `ns2.hordanso${timestamp}.test.dnservices.co.za`;

      const domainXml = `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>${domain}</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:ns>
          <domain:hostObj>${hostname}</domain:hostObj>
          <domain:hostObj>${ns2}</domain:hostObj>
        </domain:ns>
        <domain:registrant>TESTCONTACT003</domain:registrant>
        <domain:contact type="admin">TESTCONTACT003</domain:contact>
        <domain:contact type="tech">TESTCONTACT003</domain:contact>
        <domain:contact type="billing">TESTCONTACT003</domain:contact>
        <domain:authInfo>
          <domain:pw>MySecret123</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>${process.env.EPP_USER}-DOMAIN-${timestamp}</clTRID>
  </command>
</epp>`;

      console.log(`Domain: ${domain}`);
      console.log("Domain XML:", domainXml);

      sendEpp(socket, domainXml);
      const domainResponse = await waitFor();
      const domainCode = domainResponse.match(/code="(\d+)"/)?.[1];

      console.log(`\nDomain create code: ${domainCode}`);

      if (domainCode === "1000") {
        console.log("🎉 SUCCESS! Complete workflow works!");
      } else {
        console.log("Domain response:", domainResponse);
        console.log("❌ Domain creation failed");

        // Try alternative: use hostAttr with IPs (glue records)
        console.log("\n4. Trying with hostAttr (glue records)...");
        const domainXml2 = `
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
        <domain:registrant>TESTCONTACT003</domain:registrant>
        <domain:contact type="admin">TESTCONTACT003</domain:contact>
        <domain:contact type="tech">TESTCONTACT003</domain:contact>
        <domain:contact type="billing">TESTCONTACT003</domain:contact>
        <domain:authInfo>
          <domain:pw>MySecret123</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>${process.env.EPP_USER}-DOMAIN2-${Date.now()}</clTRID>
  </command>
</epp>`;

        console.log("Trying hostAttr XML:", domainXml2);
        sendEpp(socket, domainXml2);

        const domainResponse2 = await waitFor();
        const domainCode2 = domainResponse2.match(/code="(\d+)"/)?.[1];
        console.log(`Domain create (hostAttr) code: ${domainCode2}`);
      }
    } else {
      console.log("Host response:", hostResponse);

      // Host create failed, try using existing test infrastructure
      console.log(
        "\n⚠️ Host creation failed, trying with ZARC's example nameservers...",
      );

      const domain = `hordanso${timestamp}.test.dnservices.co.za`;
      const domainXml = `
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>${domain}</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:ns>
          <domain:hostObj>ns1.example.test.dnservices.co.za</domain:hostObj>
          <domain:hostObj>ns2.example.test.dnservices.co.za</domain:hostObj>
        </domain:ns>
        <domain:registrant>TESTCONTACT003</domain:registrant>
        <domain:contact type="admin">TESTCONTACT003</domain:contact>
        <domain:contact type="tech">TESTCONTACT003</domain:contact>
        <domain:contact type="billing">TESTCONTACT003</domain:contact>
        <domain:authInfo>
          <domain:pw>MySecret123</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>${process.env.EPP_USER}-EXDOMAIN-${timestamp}</clTRID>
  </command>
</epp>`;

      console.log(`Domain: ${domain}`);
      console.log(
        "Using ZARC's example nameservers: ns1.example.test.dnservices.co.za, ns2.example.test.dnservices.co.za",
      );
      console.log("Domain XML:", domainXml);

      sendEpp(socket, domainXml);
      const domainResponse = await waitFor();
      const domainCode = domainResponse.match(/code="(\d+)"/)?.[1];

      console.log(`Domain create code: ${domainCode}`);
      console.log("Domain response:", domainResponse);
    }

    console.log("\n✅ Test completed");
    socket.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    socket.destroy();
  }
})();
