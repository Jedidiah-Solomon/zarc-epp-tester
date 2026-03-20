#!/usr/bin/python3
# -*- coding: utf-8 -*-
#Sample Python EPP client - Python 3 compatible version
"""
© Domain Name Services (Pty) Ltd. 2010. All rights reserved.
$Id$
"""
__version__ = "$Id$"
__author__  = "Ed Pascoe <ed@dnservices.co.za>"

import socket
import ssl
import struct
import sys
import time
import random
import re
import optparse
import gettext
import os.path

# Enable translation
t = gettext.translation('rye', os.path.join(os.path.dirname(__file__), 'locale'), fallback=True)
_ = t.gettext if hasattr(t, 'gettext') else lambda x: x

packfmt = "!I"

class EPPTCPTransport:
    """An epp client transport class. This is just the raw TCP IP protocol. The XML data needs to be handled separately.
       The EPP transport protocol is defined at http://tools.ietf.org/html/rfc5734 it looks complicated but is 
       actually very simple and elegant. 
       the actual data should be XML data formatted according to RFC5730-RFC5733
       No validation of any data takes place in this Class
    """
    sock = None
    _greeting = ""
    _isssl = None

    def __init__(self, host="127.0.0.1", port=3121, usessl=True, cert=None, nogreeting=False, sslversion='TLSv1'):
        """Connect to the EPP server. Server header in self.header"""
        if usessl:
            self._isssl = True
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Create SSL context (modern Python 3 way)
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            # Load certificate if provided
            if cert:
                context.load_cert_chain(cert)
            
            # Set SSL version if specified
            if sslversion == 'TLSv1':
                context.minimum_version = ssl.TLSVersion.TLSv1
            elif sslversion == 'SSLv23':
                context.minimum_version = ssl.TLSVersion.MINIMUM_SUPPORTED
            
            self.sock = context.wrap_socket(s, server_hostname=host)
            self.sock.connect((host, port))
        else:
            self._isssl = False
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.connect((host, port))
        
        if not nogreeting:
            self._greeting = self.get()

    def get(self):
        """Get an EPP response"""
        header = b""
        rest = b""  # If we get more bytes than we expected.

        while len(header) < 4:
            if self._isssl:
                data = self.sock.recv(4)
            else:
                data = self.sock.recv(4, socket.MSG_WAITALL)
            
            if len(data) == 0:
                print("<!-- " + _("Did not receive anything from the server or socket timeout. Was the initial login invalid?") + " -->")
                sys.exit(1)
            
            header = header + data
            if len(header) > 4:
                rest = header[4:]
                header = header[:4]

        bytes1 = struct.unpack(packfmt, header)[0]

        if self._isssl:
            total = rest  # Initialize with anything extra read while we were getting the header.
            while len(total) < (bytes1 - 4):
                chunk = self.sock.recv(16384)
                if len(chunk) == 0:
                    print("<!-- " + _("Could not receive the rest of the expected message header. Only have {0} bytes out of expected {1}.").format(len(total), (bytes1 - 4)) + " -->")
                    sys.exit(1)
                total += chunk

            return total.decode('utf-8')
        else:
            data = self.sock.recv((bytes1 - 4), socket.MSG_WAITALL)
            return data.decode('utf-8')

    def send(self, data):
        """Send an EPP command"""
        if isinstance(data, str):
            data = data.encode('utf-8')
        # Write the header
        self.sock.send(struct.pack(packfmt, int(len(data) + 4)))
        # Send the data
        self.sock.send(data)

    def request(self, data):
        """Convenience function. Does a send and then returns the result of a get. Also converts the string __CLTRID__ to a suitable unique clTRID"""
        cltrid = "EPPTEST-%s.%s" % (time.time(), random.randint(0, 1000000))
        data = data.replace('__CLTRID__', cltrid)
        self.send(data)
        return self.get()

    def getGreeting(self):
        """Returns the EPP servers greeting"""
        return self._greeting

    def close(self):
        """Close the socket"""
        self.sock.close()


def eppLogin(username, password, services=['urn:ietf:params:xml:ns:domain-1.0', 'urn:ietf:params:xml:ns:contact-1.0']):
    """Performs an epp login command. Ignore the services parameter for the co.za namespace."""
    template = """<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
   <command>
      <login>
         <clID>%(username)s</clID>
         <pw>%(password)s</pw>
         <options>
            <version>1.0</version>
            <lang>en</lang>
         </options>
         <svcs>"""
    for svc in services:
        template = template + "            <objURI>%s</objURI>\n" % (svc)
    template = template + """
         </svcs>
      </login>
      <clTRID>__CLTRID__</clTRID>
   </command>
</epp>"""
    data = {'username': username, 'password': password}
    result = epp.request(template % data)
    if re.search('epp.*result code.*1000', result):
        return True  # Good login.
    if re.search('epp.*result code.*2002', result):
        return True  # Already logged in.
    else:
        print(result)
        sys.exit(1)


if __name__ == "__main__":
    usage = (_("Usage:") + " %prog [<options>] <files...>\n" +
             _("Example EPP client. The individual EPP commands should be in files specified on the command line.\n")
             + _("Eg: ./epp.py --host=reg-test.dnservices.co.za login.xml create_host.xml create_domain.xml\n")
             + _("Will replace all occurrences of __CLTRID__ with a suitable clTRID value\n"))

    parser = optparse.OptionParser(usage)
    parser.add_option("--host", "--ip", dest="host", default="127.0.0.1", help=_("Host to connect to [%default] "))
    parser.add_option("--port", "-p", dest="port", default="3121", help=_("Port to connect to") + " [%default]")
    parser.add_option("--cert", "-c", dest="cert", help=_("SSL certificate to use for authenticated connections"))
    parser.add_option("--nossl", dest="nossl", action="store_true", default=False, help=_("Do not use SSL"))
    parser.add_option("--verbose", "-v", dest="verbose", action="store_true", default=False,
                      help=_("Show the EPP server greeting and other debug info"))
    parser.add_option("--user", "-u", dest="user", help=_("Username to login with. If not specified will assume one of the provided files will do the login."))
    parser.add_option("--password", dest="password", help=_("Password to login with"))
    parser.add_option("--ng", dest="nogreeting", action="store_true", default=False,
                      help=_("Do not wait for an EPP server greeting"))
    (options, args) = parser.parse_args()

    if not args:
        parser.print_help()
        sys.exit(2)

    try:
        if options.cert:
            try:
                open(options.cert).close()
            except IOError as e:
                print("Could not read the SSL certificate %s\n%s" % (options.cert, e))
                sys.exit(1)
            epp = EPPTCPTransport(options.host, int(options.port), usessl=not options.nossl, cert=options.cert,
                                  nogreeting=options.nogreeting)
        else:
            epp = EPPTCPTransport(options.host, int(options.port), not options.nossl, nogreeting=options.nogreeting)
    except ssl.SSLError as e:
        print("Could not connect due to an SSL error")
        print(e)
        sys.exit(1)
    except Exception as e:
        print("Connection error: %s" % e)
        sys.exit(1)

    if options.verbose:
        print("Greeting:", epp.getGreeting())

    if options.user is not None:
        eppLogin(options.user, options.password)

    for fname in args:
        try:
            with open(fname, 'r', encoding='utf-8') as f:
                response = epp.request(f.read())
                print(response)
                print("\n<!-- ---------------- -->\n")
        except IOError:
            if not os.path.exists(fname):
                print(_("The file %s does not exist.") % fname)
            else:
                print(_("Unable to read %s.") % fname)
            sys.exit(1)

    epp.close()