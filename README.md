# ZARC EPP Tester

https://whois.registry.net.za/

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


Add /certs if you have the SSL files. Also note that /others are just for more functions to perform.

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
This tool is for testing purposes only. Use in production environments at your own risk. Always test thoroughly in OTE before moving to live environment


---

## For Fast and Fully thoroughout development and testing with SSL certificate
Please use the Option 2

## For Development with SSL Certificate
Use Option 3
```

---

# 📚 Complete COZA EPP WHMCS Module Installation Guide

## Production Deployment Documentation

---

## 📋 Table of Contents

- Prerequisites
- File Upload
- Permission Settings
- SSL Certificate Setup
- Cron Jobs Configuration
- WHMCS Activation
- Verification
- Troubleshooting

---

## 1. Prerequisites

### Required Files

| File/Folder         | Source                     |
| ------------------- | -------------------------- |
| cozaepp/            | Module registrar directory |
| awit_cozaepp/       | Module addon directory     |
| cozaepp_balance.php | Module widget file         |
| epp.pem             | SSL certificate from ZARC  |

### Server Access

- cPanel login credentials
- SSH access (or cPanel File Manager)
- WHMCS admin login

---

## 2. File Upload

### Locate WHMCS Installation Path

```bash
ls -la /home/[username]/public_html/ | grep "init.php"

Upload via cPanel File Manager
Component	Source	Destination
Registrar Module	cozaepp/	/modules/registrars/
Addon Module	awit_cozaepp/	/modules/addons/
Widget	cozaepp_balance.php	/modules/widgets/
Upload via SCP (Alternative)

Upload via SCP (Alternative)
scp -r cozaepp/ [username]@[server]:/home/[username]/public_html/modules/registrars/
scp -r awit_cozaepp/ [username]@[server]:/home/[username]/public_html/modules/addons/
scp cozaepp_balance.php [username]@[server]:/home/[username]/public_html/modules/widgets/
3. Permission Settings
Set Directory Permissions (755)
chmod -R 755 /modules/registrars/cozaepp/
chmod -R 755 /modules/addons/awit_cozaepp/
Set File Permissions (644)
find /modules/registrars/cozaepp/ -type f -exec chmod 644 {} \;
find /modules/addons/awit_cozaepp/ -type f -exec chmod 644 {} \;
chmod 644 /modules/widgets/cozaepp_balance.php
Set Ownership
chown -R [username]:[username] /modules/registrars/cozaepp/
chown -R [username]:[username] /modules/addons/awit_cozaepp/
chown [username]:[username] /modules/widgets/cozaepp_balance.php
Clear WHMCS Cache
rm -rf /templates_c/*
4. SSL Certificate Setup
Create SSL Directory
mkdir -p /ssl/
Upload SSL Certificate
scp epp.pem [username]@[server]:/home/[username]/public_html/ssl/
Set Permissions
chmod 755 /ssl/
chmod 640 /ssl/epp.pem
chown [username]:[username] /ssl/epp.pem
5. Cron Jobs Configuration
Add via Crontab
crontab -e
Add Jobs
0 * * * * php -q /modules/registrars/cozaepp/cozaepppoll.php > /dev/null 2>&1
*/4 * * * * php -q /crons/domainsync.php > /dev/null 2>&1
Verify
crontab -l
6. WHMCS Activation
Activate Registrar Module
Setup → Products/Services → Domain Registrars
Activate Cozaepp
Configure Settings
Setting	Value
OT&E Mode	OFF
Username	ZARC username
Password	ZARC password
EPPHost	epp.zarc.net.za
EPPPort	700
SSL	Enabled
Certificate	/ssl/epp.pem
Activate Addon Module
Setup → Addon Modules
Activate AWIT COZAEPP
Assign Full Administrator access
7. Verification
Check Files
ls -la /modules/registrars/cozaepp/
ls -la /modules/addons/awit_cozaepp/
WHMCS Logs
Utilities → Logs → Module Log
Test Domain
Register test domain
Ensure status = OK
8. Troubleshooting
Module Not Showing
rm -rf /templates_c/*
chmod 644 cozaepp.php
SSL Issues
php -r "echo file_exists('/ssl/epp.pem');"
Cron Test
php -q /cozaepppoll.php
📝 Summary
Component	Value
Registrar	Cozaepp
Host	epp.zarc.net.za
Port	700
SSL	Enabled
Poll Cron	Hourly
Sync Cron	Every 4 hours
```
