/**
 * Login Test Script
 *
 * Tests EPP authentication with ZARC registry.
 * Validates connection, greeting reception, and login functionality.
 */

import dotenv from "dotenv";
import { connectEpp, sendEpp } from "../epp/connect.js";
import { loginXML } from "../epp/login.js";

dotenv.config({ path: "./config/zarc.env" });

const socket = connectEpp();

socket.on("connect", () => {
  console.log("TCP connection established");
  console.log(`Host: ${process.env.EPP_HOST}:${process.env.EPP_PORT}`);
  console.log(`User: ${process.env.EPP_USER}`);
});

socket.on("error", (error) => {
  console.error("Socket error:", error.message);
  if (error.code) console.error("Error code:", error.code);
});

socket.on("close", () => {
  console.log("Socket closed");
});

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
      reject(new Error(`Timeout waiting for EPP response after ${timeout}ms`));
    }, timeout);

    socket.on("data", onData);
  });

/**
 * Main test execution function
 */
(async () => {
  try {
    console.log("Attempting to connect to EPP server");

    try {
      const greeting = await waitFor(3000);
      console.log("Server greeting received");
      console.log("Greeting XML preview:", greeting.substring(0, 200) + "...");
    } catch (error) {
      console.log("No greeting received, continuing");
    }

    console.log("Sending login request");
    const loginXml = loginXML();
    console.log("Login XML being sent:");
    console.log(loginXml);

    sendEpp(socket, loginXml);

    const response = await waitFor(10000);
    console.log("Login response received");
    console.log("Full response:");
    console.log(response);

    const resultMatch = response.match(/<epp:result code="(\d+)">/);
    if (resultMatch) {
      const code = parseInt(resultMatch[1]);
      console.log(`Result code: ${code}`);

      if (code >= 2000 && code < 3000) {
        console.error("Authentication failed");

        const messageMatch = response.match(/<epp:msg>([^<]+)<\/epp:msg>/);
        if (messageMatch) {
          console.error(`Error message: ${messageMatch[1]}`);
        }
      } else if (code === 1000 || code === 1001) {
        console.log("Login successful");
      } else {
        console.log(`Unexpected response code: ${code}`);
      }
    } else {
      console.log("Could not parse result code from response");
    }

    socket.end();
  } catch (error) {
    console.error("Error during login test:");
    console.error(error.message);

    if (error.message.includes("ECONNREFUSED")) {
      console.error("Troubleshooting:");
      console.error(
        `1. Check if host/port is correct: ${process.env.EPP_HOST}:${process.env.EPP_PORT}`,
      );
      console.error(
        "2. Verify firewall allows outgoing connections on port 700",
      );
      console.error("3. Ensure SSL/TLS is supported on this port");
    }

    socket.destroy();
  }
})();
