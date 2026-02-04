/**
 * Domain Creation Test Script
 *
 * Tests complete domain registration workflow in ZARC registry.
 * Performs domain availability check before attempting registration.
 */

import dotenv from "dotenv";
import { connectEpp, sendEpp } from "../epp/connect.js";
import { loginXML } from "../epp/login.js";
import { domainCheckXML } from "../epp/domainCheck.js";
import { domainCreateXML } from "../epp/domainCreate.js";

dotenv.config({ path: "./config/zarc.env" });

const socket = connectEpp();

/**
 * Waits for EPP response from server
 *
 * @param {number} timeout - Maximum wait time in milliseconds
 * @returns {Promise<string>} XML response
 */
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

/**
 * Main test execution function
 */
(async () => {
  try {
    console.log("Connecting to EPP server");

    try {
      await waitFor(3000);
    } catch (error) {}

    console.log("Logging in");
    sendEpp(socket, loginXML());
    const loginResponse = await waitFor();
    const loginCode = loginResponse.match(/code="(\d+)"/)?.[1];
    console.log(`Login code: ${loginCode}`);

    if (loginCode !== "1000" && loginCode !== "1001") {
      throw new Error(`Login failed with code: ${loginCode}`);
    }

    const testDomain = `test${Date.now()}${Math.floor(Math.random() * 1000)}.co.za`;
    console.log(`Testing domain: ${testDomain}`);

    console.log("Step 1: Checking domain availability");
    sendEpp(socket, domainCheckXML(testDomain));

    const checkResponse = await waitFor();
    const checkCode = checkResponse.match(/<epp:result code="(\d+)">/)?.[1];
    console.log(`Check result code: ${checkCode}`);

    const availabilityMatch = checkResponse.match(/avail="(\d)"/);
    if (!availabilityMatch) {
      throw new Error("Could not parse availability from response");
    }

    const isAvailable = availabilityMatch[1] === "1";

    if (!isAvailable) {
      console.log(`Domain ${testDomain} is not available`);
      console.log("Skipping domain creation");
      socket.end();
      return;
    }

    console.log(`Domain ${testDomain} is available`);

    const priceMatch = checkResponse.match(
      /command="create">([\d.]+)<\/charge:amount>/,
    );
    if (priceMatch) {
      console.log(`Registration price: ZAR ${priceMatch[1]}`);
    }

    console.log("Step 2: Creating domain");
    const domainXml = domainCreateXML({
      domain: testDomain,
      registrant: "TESTCONTACT001",
      admin: "TESTCONTACT001",
      tech: "TESTCONTACT001",
      billing: "TESTCONTACT001",
    });

    console.log("Domain create XML being sent");
    sendEpp(socket, domainXml);

    const createResponse = await waitFor(10000);
    const createCode = createResponse.match(/<epp:result code="(\d+)">/)?.[1];
    console.log(`Create result code: ${createCode}`);

    if (createCode === "1000") {
      console.log(`Domain ${testDomain} created successfully`);

      const nameMatch = createResponse.match(
        /<domain:name>([^<]+)<\/domain:name>/,
      );
      const dateMatch = createResponse.match(
        /<domain:crDate>([^<]+)<\/domain:crDate>/,
      );

      if (nameMatch) console.log(`Domain: ${nameMatch[1]}`);
      if (dateMatch) console.log(`Creation date: ${dateMatch[1]}`);

      const authMatch = createResponse.match(/<domain:pw>([^<]+)<\/domain:pw>/);
      if (authMatch) console.log(`Auth code: ${authMatch[1]}`);
    } else {
      console.log("Domain creation failed");
      const messageMatch = createResponse.match(/<epp:msg>([^<]+)<\/epp:msg>/);
      if (messageMatch) console.log(`Error: ${messageMatch[1]}`);

      console.log("Full error response:");
      console.log(createResponse);
    }

    console.log("Test completed");
    socket.end();
  } catch (error) {
    console.error("Error:", error.message);
    console.error(error.stack);
    socket.destroy();
  }
})();
