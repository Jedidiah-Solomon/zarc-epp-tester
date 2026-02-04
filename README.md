# ZARC EPP Tester

A Node.js EPP client for testing connections to ZARC (.co.za) registry in Operational Test Environment (OTE). This tool helps registrars test their integration with ZARC registry before going live.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

## Features

- **EPP Authentication** - Secure login/logout to ZARC registry
- **Contact Management** - Create and manage contact objects
- **Domain Operations** - Check availability and register domains
- **Comprehensive Testing** - Complete test suite for ZARC OTE environment
- **Environment Configuration** - Easy setup with environment variables
- **Production Ready** - Clean code with proper error handling

## Prerequisites

- Node.js 16 or higher
- ZARC OTE credentials (provided by ZARC during accreditation)
- Basic understanding of EPP protocol

## Installation

```bash
# Clone the repository
git clone https://github.com/Jedidiah-Solomon/zarc-epp-tester.git

cd zarc-epp-tester

# Install dependencies
npm install

# Configuration
Copy the example environment file:


cp config/zarc-example.env config/zarc.env

Edit config/zarc.env with your ZARC OTE credentials:

# env
EPP_HOST=ote.zarc.net.za
EPP_PORT=700
EPP_USER=your_ote_username
EPP_PASS=your_ote_password
TEST_DOMAIN=your-test-domain.co.za

# Available Tests
The project includes the following test scripts:

Test File	Description	Command
login.js	Tests EPP authentication	npm run test:login
contact.js	Tests contact creation	npm run test:contact
domain-check.js	Tests domain availability check	npm run test:domain-check
domain-create-check.js	Tests complete domain registration workflow	npm run test:domain-create

# Usage
Run Individual Tests

# Test login functionality
npm run test:login

# Test contact creation
npm run test:contact

# Test domain availability check
npm run test:domain-check

# Test complete domain registration (check + create)
npm run test:domain-create

# Run all tests sequentially
npm run test:all
Run Tests Directly

node tests/login.js
node tests/contact.js
node tests/domain-check.js
node tests/domain-create-check.js

Project Structure

zarc-epp-tester/
├── config/                    # Configuration files
│   ├── zarc.env              # Your credentials (gitignored)
│   └── zarc-example.env      # Example configuration
├── epp/                      # Core EPP modules
│   ├── connect.js           # TLS connection utilities
│   ├── login.js             # Login/logout XML templates
│   ├── contactCreate.js     # Contact creation XML
│   ├── domainCheck.js       # Domain check XML
│   ├── domainCreate.js      # Domain creation XML
│   └── logout.js            # Logout XML template
├── tests/                    # Test scripts
│   ├── login.js            # Login test
│   ├── contact.js          # Contact creation test
│   ├── domain-check.js     # Domain check test
│   └── domain-create-check.js # Complete domain registration test
├── package.json             # Project dependencies and scripts
├── LICENSE                  # MIT License
└── README.md               # This file


Add /certs if you have the SSL files

EPP Operations Supported
1. Login/Logout
Secure authentication with ZARC registry

Proper session management

Includes required service extensions

2. Contact Management
Create contact objects with postal information

Support for international and local formats

Proper authentication info generation

3. Domain Operations
Check domain availability with pricing

Register new domains

Includes required ZARC nameservers

Proper authorization info

# API Reference
## Core Modules
epp/connect.js
connectEpp(): Establishes TLS connection to ZARC EPP server

sendEpp(socket, xml): Sends XML command with proper framing

epp/login.js
loginXML(): Generates EPP login XML

logoutXML(): Generates EPP logout XML

epp/contactCreate.js
contactCreateXML(params): Generates contact creation XML

epp/domainCheck.js
domainCheckXML(domain): Generates domain check XML

epp/domainCreate.js
domainCreateXML(params): Generates domain creation XML

## Testing Workflow
Login Test: Verify credentials and connection

Contact Creation: Create a test contact

Domain Check: Verify domain availability

Domain Creation: Complete registration workflow

## ZARC Specific Requirements
Required Service URIs
urn:ietf:params:xml:ns:domain-1.0

urn:ietf:params:xml:ns:contact-1.0

urn:ietf:params:xml:ns:host-1.0

urn:ietf:params:xml:ns:secDNS-1.1 (extension)

## Nameservers
Default ZARC nameservers are included in domain creation:

ns1.dns.net.za (196.41.139.49)

ns2.dns.net.za (196.41.139.58)

## Response Codes
1000: Command completed successfully

1001: Command completed successfully; action pending

2xxx: Command syntax errors

3xxx: Required parameter missing

4xxx: Business logic errors

5xxx: Server errors

## Troubleshooting
Connection Issues
Verify EPP_HOST and EPP_PORT in config/zarc.env

Check firewall allows outgoing connections on port 700

Ensure SSL/TLS is supported on the port

Authentication Failures
Double-check EPP_USER and EPP_PASS

Verify credentials are for OTE environment (not live)

Check if account is properly activated by ZARC

## XML Format Errors
Ensure all required namespaces are included

Verify contact IDs exist before domain creation

Check transaction ID format matches ZARC requirements

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

Support
For ZARC-specific issues:

Contact ZARC support: support@registry.net.za

Visit: https://registry.net.za

For issues with this tool:

Open an issue on GitHub

Check existing issues for solutions

Acknowledgments
ZARC Registry for providing the OTE environment

The EPP protocol community

All contributors to this project

Disclaimer
This tool is for testing purposes only. Use in production environments at your own risk. Always test thoroughly in OTE before moving to live environment.

```
