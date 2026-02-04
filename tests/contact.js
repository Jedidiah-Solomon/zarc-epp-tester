/**
 * Contact Creation Test Script
 *
 * Tests contact object creation in ZARC registry.
 * Validates contact creation with proper postal information and authentication.
 */

import dotenv from "dotenv";
import { connectEpp, sendEpp } from "../epp/connect.js";
import { loginXML } from "../epp/login.js";
import { contactCreateXML } from "../epp/contactCreate.js";

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
    const loginCode = loginResponse.match(/code="(\d+)"/)?.[1] || "Unknown";
    console.log(`Login response code: ${loginCode}`);

    console.log("Creating contact");

    const contactXml = contactCreateXML({
      id: "TESTCONTACT001",
      name: "Test User",
      org: "Test Company",
      street: "123 Test Street",
      city: "Test City",
      sp: "GP",
      pc: "0001",
      cc: "ZA",
      email: "test@example.com",
      phone: "+27.112345678",
    });

    console.log("Contact XML:", contactXml);
    sendEpp(socket, contactXml);

    const contactResponse = await waitFor();
    console.log("Contact creation response:");
    console.log(contactResponse);

    socket.end();
  } catch (error) {
    console.error("Error:", error.message);
    socket.destroy();
  }
})();
