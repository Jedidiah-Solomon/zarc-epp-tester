1. Check network: `python epp.py --host=ote.zarc.net.za --port=700 --nossl --ng --verbose`

2. Check content of te file: ``type login.xml`

3. Login: `python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml`

4. Create Contact: `python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_contact_fixed.xml`

```
# List all our files to confirm
dir create_*.xml

# 1. Create contacts (if not already done)
python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_contact_1.xml

python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_contact_2.xml

# 2. Create hosts
python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_host_1.xml

python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_host_2.xml

# 3. Create domain
python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml create_domain_1.xml
```
