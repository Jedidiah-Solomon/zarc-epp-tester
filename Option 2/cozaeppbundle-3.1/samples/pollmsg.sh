#!/bin/bash
#Quick script to poll and ack a message waiting for an epp client.
#Usage: ./pollall.sh login.xml
#Call until all messages have been retrieved

f=/tmp/poll.$$
f1=/tmp/poll.$$

./epp.py --host=regdev.dnservices.co.za $1 poll.xml > $f 
cat $f
eid=`cat $f | grep 'id=' | sed -e 's/^.*id="//' -e 's/".*$//'`
cat pack.xml | sed -e "s/__ID__/$eid/g" > $f
./epp.py --host=regdev.dnservices.co.za $1 $f 2> /dev/null > /dev/null

rm $f
