/**
 * EPP Connection Module
 *
 * Provides TLS connection to ZARC EPP server and XML sending utilities.
 * Handles the low-level socket communication for EPP protocol.
 */

import tls from "tls";
import fs from "fs";

/**
 * Establishes a TLS connection to the ZARC EPP server
 *
 * @returns {tls.TLSSocket} Connected TLS socket
 * @throws {Error} If connection fails or certificates are missing
 */
export const connectEpp = () => {
  const host = process.env.EPP_HOST;
  const port = Number(process.env.EPP_PORT);

  if (!host || !port) {
    throw new Error(
      "EPP_HOST and EPP_PORT must be set in environment variables",
    );
  }

  const tlsOptions = {
    host,
    port,
    family: 4,
    rejectUnauthorized: false,
  };

  if (process.env.EPP_KEY && process.env.EPP_CERT) {
    try {
      tlsOptions.key = fs.readFileSync(process.env.EPP_KEY);
      tlsOptions.cert = fs.readFileSync(process.env.EPP_CERT);

      if (process.env.EPP_CA) {
        tlsOptions.ca = fs.readFileSync(process.env.EPP_CA);
      }
    } catch (error) {
      console.warn(
        "Certificate files not found, proceeding without client certificates",
      );
    }
  }

  const socket = tls.connect(tlsOptions);

  socket.on("connect", () => {
    console.log(`Connected to EPP server at ${host}:${port}`);
  });

  socket.on("error", (error) => {
    console.error(`Connection error: ${error.message}`);
  });

  socket.on("close", () => {
    console.log("Connection closed");
  });

  return socket;
};

/**
 * Sends XML command to EPP server with proper framing
 *
 * EPP protocol requires a 4-byte length prefix before each XML message
 *
 * @param {tls.TLSSocket} socket - Connected TLS socket
 * @param {string} xml - XML command to send
 * @returns {void}
 */
export const sendEpp = (socket, xml) => {
  if (!socket || socket.destroyed) {
    throw new Error("Socket is not connected or has been destroyed");
  }

  const xmlBuffer = Buffer.from(xml, "utf8");
  const lengthBuffer = Buffer.alloc(4);

  lengthBuffer.writeUInt32BE(xmlBuffer.length + 4, 0);

  const message = Buffer.concat([lengthBuffer, xmlBuffer]);

  socket.write(message);
};
