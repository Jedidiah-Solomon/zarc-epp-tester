/**
 * Domain Check Test Script
 *
 * Tests domain availability checking in ZARC registry.
 * Validates domain check functionality and parses pricing information.
 */

import dotenv from "dotenv";
import { connectEpp, sendEpp } from "../epp/connect.js";
import { loginXML } from "../epp/login.js";
import { domainCheckXML } from "../epp/domainCheck.js";

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

    console.log("Checking domain availability");

    const domainsToCheck = [
      `test-domain-${Date.now()}.co.za`,
      "hordanso.co.za",
      "google.org.za",
      "facebook.net.za",
      "apple.web.za",
      "zarc.web.za",
    ];

    for (const domain of domainsToCheck) {
      console.log(`Checking: ${domain}`);
      sendEpp(socket, domainCheckXML(domain));

      const checkResponse = await waitFor();
      const resultCode = checkResponse.match(/<epp:result code="(\d+)">/)?.[1];
      console.log(`Result code: ${resultCode}`);

      const availabilityMatch = checkResponse.match(/avail="(\d)"/);
      if (availabilityMatch) {
        const isAvailable = availabilityMatch[1] === "1";
        console.log(`Status: ${isAvailable ? "AVAILABLE" : "TAKEN"}`);

        if (isAvailable) {
          const priceMatch = checkResponse.match(
            /command="create">([\d.]+)<\/charge:amount>/,
          );
          if (priceMatch) {
            console.log(`Price: ZAR ${priceMatch[1]}`);
          }
        }
      } else {
        console.log("Could not parse availability");
      }
    }

    console.log("Domain check test completed");
    socket.end();
  } catch (error) {
    console.error("Error:", error.message);
    socket.destroy();
  }
})();
