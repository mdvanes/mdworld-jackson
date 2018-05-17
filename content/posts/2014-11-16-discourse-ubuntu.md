---
title: "Discourse on Ubuntu 14.04"
cover: "https://picsum.photos/g/800/600?image=0"
date: "16-11-2014"
category: "mypc"
tags:
    - mypc
---

I wanted to try and use [Docker](https://www.docker.com/) after hearing such great things about it. Since I might want to roll out a decent forum at some point, I wanted to look into installing [Discourse](http://www.discourse.org/). For the moment, this will be done on my desktop.

I start with the [installation instructions](http://docs.docker.com/installation/ubuntulinux/) for Docker on Ubuntu 14.04.

* For Discourse it's needed to follow the instructions for the newest version of Docker and not to use the default Ubuntu package.

I proceed with [this tutorial](http://www.howtoinstalldiscourse.com/how-to-install-discourse-on-ubuntu/) that specifies to run:

```
wget -qO- https://get.docker.io/ | sh
mkdir /var/docker
git clone https://github.com/discourse/discourse_docker.git /var/docker
cd /var/docker
cp samples/standalone.yml containers/app.yml
```

I modify /var/docker/containers/app.yml (all relevant changes to app.yml are at the bottom)

```
DISCOURSE_HOSTNAME: 'localhost'
```

but on running start ```sudo ./launcher start app``` I get:

```
2014/11/16 10:46:31 Error response from daemon: Cannot start container 270d47cd8401c50f13e0a1e51428f5b9833a9480b53bc98735df55b425a70b6d: Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
```

This could be expected, because Apache runs on port 80.

in /var/docker/containers/app.yml there is an entry:

```
expose:
  - "80:80"   # fwd host port 80   to container port 80 (http)
  - "2222:22" # fwd host port 2222 to container port 22 (ssh)
```

After using ```netstat -antp``` to confirm port 8080 is unused, I change 80:80 to 8080:80 in the app.yml.

Now I rebuild and restart the container:

```
cd /var/docker
sudo ./launcher rebuild app # this applies the changes
sudo ./launcher start app
```

When I use the browser to go to http://localhost:8080/, it immediately gives me Discourse page!

Now I notice, when creating the admin account, that the activation mail is not send. Thinking back I did skip over the mail settings in the app.yml.

Here I had to experiment a bit with my mail settings and this turned out in the end what took most of the time for getting Discourse up and running. One thing I learned is that it's not neccesary to stop the app with ```sudo ./launcher stop app``` before making changes or rebuilding.

Soon I find that running ```sudo ./launcher mailtest app``` gives much more useful information, thanks to [this thread](https://meta.discourse.org/t/discourse-new-install-registration-emails-not-sent-because-from-address-cant-be-changed/16663/11).

I configure the app.yml to use the Google smtp server (settings are below), but ```sudo ./launcher mailtest app``` still gives an error:

```
ERROR: python yaml module not installed - run the following and try again:

sudo apt-get install python3-yaml
```

After installing this package mailtest tells me there is an authentication problem and apparently I need to allow "less secure apps" access to my gmail account. After setting this up at Google accounts, I can send mail with mailtest. 

The activate mail link is now send and I can access the admin panel in Discourse.

I have also tried to set up mail with the SMTP settings of my own ISP, but this gave an error that I could not find any solutions to:

```
Traceback (most recent call last):
  File "/var/docker/scripts/mailtest", line 138, in <module>
    smtp = smtplib.SMTP(smtp_addr, smtp_port, timeout=5)
  File "/usr/lib/python3.4/smtplib.py", line 242, in __init__
    (code, msg) = self.connect(host, port)
  File "/usr/lib/python3.4/smtplib.py", line 321, in connect
    self.sock = self._get_socket(host, port, self.timeout)
  File "/usr/lib/python3.4/smtplib.py", line 292, in _get_socket
    self.source_address)
  File "/usr/lib/python3.4/socket.py", line 509, in create_connection
    raise err
  File "/usr/lib/python3.4/socket.py", line 500, in create_connection
    sock.connect(sa)
OSError: [Errno 113] No route to host
```

Since I never use my ISP's mail server, it might simply be that I use the wrong SMTP address or something.

In the end, I use these setting in my app.yml (these are just the edited fragments):

```
expose:
  - "8080:80"  # fwd host port 80   to container port 80 (http)
  - "2222:22"  # fwd host port 2222 to container port 22 (ssh)

  DISCOURSE_DEVELOPER_EMAILS: 'myemail@example.com'

  DISCOURSE_HOSTNAME: 'localhost'

  DISCOURSE_SMTP_ADDRESS: smtp.gmail.com
  DISCOURSE_SMTP_PORT: 587
  DISCOURSE_SMTP_USER_NAME: mygmail@gmail.com
  DISCOURSE_SMTP_PASSWORD: ******
```

I wonder now, since I'm starting discourse now with ```./launcher start app``` if I should have renamed the containers/app.yml to discourse.yml to be able to start Discourse with ```./launcher start discourse```? I don't know how difficult (or easy?) it will be to change this afterwards, but I will leave it for another time to figure this out.