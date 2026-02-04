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

````bash
# Clone the repository
git clone https://github.com/yourusername/zarc-epp-tester.git
cd zarc-epp-tester

# Install dependencies
npm install
Configuration
Copy the example environment file:

bash
cp config/zarc-example.env config/zarc.env
Edit config/zarc.env with your ZARC OTE credentials:

env
EPP_HOST=ote.zarc.net.za
EPP_PORT=700
EPP_USER=your_ote_username
EPP_PASS=your_ote_password
TEST_DOMAIN=your-test-domain.co.za
Available Tests
The project includes the following test scripts:

Test File	Description	Command
login.js	Tests EPP authentication	npm run test:login
contact.js	Tests contact creation	npm run test:contact
domain-check.js	Tests domain availability check	npm run test:domain-check
domain-create-check.js	Tests complete domain registration workflow	npm run test:domain-create
Usage
Run Individual Tests
bash
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
bash
node tests/login.js
node tests/contact.js
node tests/domain-check.js
node tests/domain-create-check.js
Project Structure
text
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

API Reference
Core Modules
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

Testing Workflow
Login Test: Verify credentials and connection

Contact Creation: Create a test contact

Domain Check: Verify domain availability

Domain Creation: Complete registration workflow

ZARC Specific Requirements
Required Service URIs
urn:ietf:params:xml:ns:domain-1.0

urn:ietf:params:xml:ns:contact-1.0

urn:ietf:params:xml:ns:host-1.0

urn:ietf:params:xml:ns:secDNS-1.1 (extension)

Nameservers
Default ZARC nameservers are included in domain creation:

ns1.dns.net.za (196.41.139.49)

ns2.dns.net.za (196.41.139.58)

Response Codes
1000: Command completed successfully

1001: Command completed successfully; action pending

2xxx: Command syntax errors

3xxx: Required parameter missing

4xxx: Business logic errors

5xxx: Server errors

Troubleshooting
Connection Issues
Verify EPP_HOST and EPP_PORT in config/zarc.env

Check firewall allows outgoing connections on port 700

Ensure SSL/TLS is supported on the port

Authentication Failures
Double-check EPP_USER and EPP_PASS

Verify credentials are for OTE environment (not live)

Check if account is properly activated by ZARC

XML Format Errors
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

License
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

text

## **3. Update package.json with better scripts:**

Update `package.json`:
```json
{
  "name": "zarc-epp-tester",
  "version": "1.0.0",
  "description": "EPP Client for testing ZARC (.co.za) registry connections",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test:login": "node tests/login.js",
    "test:contact": "node tests/contact.js",
    "test:domain-check": "node tests/domain-check.js",
    "test:domain-create": "node tests/domain-create-check.js",
    "test:all": "node tests/login.js && node tests/contact.js && node tests/domain-check.js && node tests/domain-create-check.js",
    "start": "node tests/login.js",
    "lint": "echo 'No linter configured'",
    "clean": "rm -rf node_modules package-lock.json"
  },
  "keywords": [
    "zarc",
    "epp",
    "co.za",
    "registry",
    "domain",
    "south-africa",
    "registrar",
    "accreditation"
  ],
  "author": "Hordanso",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/hordanso/zarc-epp-tester.git"
  },
  "bugs": {
    "url": "https://github.com/hordanso/zarc-epp-tester/issues"
  },
  "homepage": "https://github.com/hordanso/zarc-epp-tester#readme",
  "dependencies": {
    "dotenv": "^16.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
4. Create .gitignore file:
Update .gitignore:

gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
config/zarc.env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Certificates
certs/
*.pem
*.key
*.crt

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
logs/
*.log

# Test outputs
test-results/
coverage/
5. Initialize Git and commit:
Run these commands in your terminal:

bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ZARC EPP Tester with comprehensive test suite"

# Create main branch
git branch -M main

# Add remote origin (update with your GitHub repository URL)
git remote add origin https://github.com/hordanso/zarc-epp-tester.git

# Push to GitHub
git push -u origin main
6. Optional: Create index.js for programmatic usage:
Create index.js:

javascript
/**
 * ZARC EPP Tester - Main Entry Point
 *
 * Programmatic interface for ZARC EPP testing operations.
 * Provides a clean API for integration into other applications.
 */

export { connectEpp, sendEpp } from './epp/connect.js';
export { loginXML, logoutXML } from './epp/login.js';
export { contactCreateXML } from './epp/contactCreate.js';
export { domainCheckXML } from './epp/domainCheck.js';
export { domainCreateXML } from './epp/domainCreate.js';

/**
 * Example usage:
 *
 * import { connectEpp, loginXML, sendEpp } from './index.js';
 *
 * const socket = connectEpp();
 * socket.on('connect', () => {
 *   sendEpp(socket, loginXML());
 * });
 */
7. Quick Start Guide for Users:
Create QUICKSTART.md:

markdown
# Quick Start Guide

## 1-Minute Setup

1. **Clone and install:**
```bash
git clone https://github.com/hordanso/zarc-epp-tester.git
cd zarc-epp-tester
npm install
Configure credentials:

bash
cp config/zarc-example.env config/zarc.env
# Edit config/zarc.env with your ZARC OTE credentials
Test your connection:

bash
npm run test:login
Common Test Scenarios
Scenario 1: Complete Accreditation Testing
bash
# Run all tests in sequence
npm run test:all
Scenario 2: Debug Authentication Issues
bash
# Check login only
npm run test:login
Scenario 3: Test Domain Registration
bash
# Check if domain is available
npm run test:domain-check

# If available, register it
npm run test:domain-create
Need Help?
Check the README.md for detailed documentation

Review the test output for error messages

Open an issue on GitHub if you find a bug
````
