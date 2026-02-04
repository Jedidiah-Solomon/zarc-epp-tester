/**
 * Complete Domain Registration Test with Nameservers
 *
 * 1. Creates domain (without nameservers)
 * 2. Updates domain to add nameservers
 */

import dotenv from "dotenv";
import { connectEpp, sendEpp } from "../epp/connect.js";
import { loginXML } from "../epp/login.js";
import { domainCheckXML } from "../epp/domainCheck.js";
import { domainCreateXML } from "../epp/domainCreate.js";
import { domainUpdateAddNameserversXML } from "../epp/domainUpdate.js";

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
    console.log("=== Complete Domain Registration Test ===");

    try {
      await waitFor(3000);
    } catch (error) {}

    console.log("1. Logging in");
    sendEpp(socket, loginXML());
    const loginResponse = await waitFor();
    const loginCode = loginResponse.match(/code="(\d+)"/)?.[1];
    console.log(`Login code: ${loginCode}`);

    if (!loginCode && !loginResponse.includes("Access granted")) {
      throw new Error("Login failed");
    }

    console.log("✅ Login successful");

    const contactId = "TESTCONTACT003";
    const testDomain = `test${Date.now()}.co.za`;

    console.log(`\n2. Checking domain: ${testDomain}`);
    sendEpp(socket, domainCheckXML(testDomain));
    const checkResponse = await waitFor();

    const availabilityMatch = checkResponse.match(/avail="(\d)"/);
    if (!availabilityMatch || availabilityMatch[1] !== "1") {
      throw new Error(`Domain ${testDomain} is not available`);
    }

    console.log(`✅ Domain ${testDomain} is available`);

    console.log("\n3. Creating domain (without nameservers)");
    const createXml = domainCreateXML({
      domain: testDomain,
      registrant: contactId,
      admin: contactId,
      tech: contactId,
      billing: contactId,
    });

    console.log("Create XML:", createXml);
    sendEpp(socket, createXml);

    const createResponse = await waitFor(10000);
    const createCode = createResponse.match(/code="(\d+)"/)?.[1];
    console.log(`Domain create code: ${createCode}`);

    if (createCode !== "1000") {
      console.log("Create response:", createResponse);
      throw new Error("Domain creation failed");
    }

    console.log(`✅ Domain ${testDomain} created successfully!`);

    console.log("\n4. Adding nameservers to domain");
    const updateXml = domainUpdateAddNameserversXML({
      domain: testDomain,
      nameservers: ["ns1.dns.net.za", "ns2.dns.net.za"],
    });

    console.log("Update XML:", updateXml);
    sendEpp(socket, updateXml);

    const updateResponse = await waitFor(10000);
    const updateCode = updateResponse.match(/code="(\d+)"/)?.[1];
    console.log(`Domain update code: ${updateCode}`);

    if (updateCode === "1000") {
      console.log("✅ Nameservers added successfully!");
      console.log(
        `\n🎉 COMPLETE SUCCESS! Domain ${testDomain} registered with nameservers!`,
      );
    } else {
      console.log("Update response:", updateResponse);
      console.log("⚠️ Domain created but nameserver addition failed");
    }

    socket.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    socket.destroy();
  }
})();
