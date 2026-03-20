### Step 1: Create 4 New Domains (with Sedo nameservers)

Domain 1: testhdsdomain230.co.za

``python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_domain_7.xml`

Replace the domain name in `create_domain_7.xml` for the four times

Domain 2: testhdsdomain231.co.za

``python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_domain_7.xml`

Domain 3: testhdsdomain232.co.za

``python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_domain_7.xml`

Domain 4: testhdsdomain233.co.za

``python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_domain_7.xml`

### Step 2 Contact Create

Create Contact 1 e.g : Solomon1, Solomon2, Solomon3 and many more as you like.

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_contact_fixed.xml`

### Step 3 Contact Delete

Lets delete contact: Solomon1
`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml delete_contact_1.xml`

### Step 3 Contact Update

Let us update contact: Solomon2. This takes 5 days
`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml update_contact_1.xml`

### Step 4 Domain Update Registrant

Lets use Solomon2 as contact for testhdsdomain231.co.za domain
`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml update_domain_registrant_130.xml`

### Step 5 Domain Update Add Status

Lets update status for testhdsdomain232.co.za

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml update_domain_add_status_130.xml`

### Step 6 Domain Update Remove Status

Lets remove status for testhdsdomain233.co.za

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml update_domain_remove_status_131.xml`

### This wont work as it s a server level action.

### Step 7 Domain Delete

So lets delete this testhdsdomain233.co.za

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml delete_domain_131_final.xml`

### Step 8 Domain Renew

Lets renew testhdsdomain232.co.za

``python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml renew_domain_130_fixed.xml`

### Step 9: COZA Domain AutoRenew

For testhdsdomain230.co.za

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml coza_domain_autorenew_130.xml`

### Step 10 EPP Transfer Request (secondary account)

For testhdsdomain231.co.za

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login_secondary.xml transfer_request_131_final.xml`

### Step 11 Approve the transfer (primary account)

For testhdsdomain231.co.za

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml transfer_approve_130.xml`

### Step 12 Transfer query

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml transfer_query_191.xml`

### Step 13

Transfer domain
`python epp.py --host=ote.zarc.net.za --port=700 --verbose login_secondary.xml transfer_domain.xml`

### Step 14: Poll Operations

Poll Request (check for messages)

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml poll_request_1.xml`

Poll Ack (acknowledge messages)
Update poll_ack_1.xml with the msgID from poll response

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml poll_ack_1.xml`

Clear All Poll Messages (PowerShell Script)

Create `clear_poll.ps1`

Then run `.\clear_poll.ps1`

Final Poll Check

`python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml poll_request_1.xml`

### Expected response:

```
<epp:result code="1300">
  <epp:msg>Command completed successfully; no messages</epp:msg>
</epp:result>
```
