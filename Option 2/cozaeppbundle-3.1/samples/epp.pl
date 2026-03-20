#!/usr/bin/perl
#Sample EPP clients. 
# © Domain Name Services (Pty) Ltd. 2010. All rights reserved.
# $Id: epp.py 62 2010-05-06 06:10:47Z elp $
use strict;
use Getopt::Long;
use Net::EPP::Client;

my $verbose = ''; # option variable with default value (false)
my $all = ''; # option variable with default value (false)
my $hostname = 'localhost';
my $port = '3121';
my $help='';

my $optResult = GetOptions ( 'host=s' => \$hostname,
                             'ip=s' => \$hostname,
                             'port=s' => \$port,
                             'p=s' => \$port,
                             'h' => \$help,
                             'help' => \$help,
                             'verbose' => \$verbose,
                             'v' => \$verbose
                           );

if ($help || !$optResult) {
  print <<_EOM;
Usage: epp.pl [<options>] <files...>
© Domain Name Services (Pty) Ltd. 2010. All rights reserved.
Example EPP client. The individual EPP commands should be in files specified on the command line.

Eg: ./epp.pl --host=reg-test.dnservices.co.za login.xml create_host.xml create_domain.xml

Options:
  -h, --help            show this help message and exit
  --host=HOST           Host to connect to [127.0.0.1]
  -p PORT, --port=PORT  Port to connect to [3121]
_EOM
  exit(1);
}

my $epp = Net::EPP::Client->new(
  host    => $hostname,
  port    => $port,
  ssl     => 1,
  frames  => 1,
);


my $greeting = $epp->connect;
if ($verbose){
  print $greeting->toString;
  print "\n";
}

foreach my $fname (@ARGV){
  print "Sending $fname\n" if ($verbose);
  $epp->send_frame($fname);
  my $answer = $epp->get_frame;
  print $answer->toString;
  print "\n";
}
