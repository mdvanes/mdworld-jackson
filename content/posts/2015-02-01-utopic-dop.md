---
title: "Utopic Dop"
cover: "https://picsum.photos/g/800/600?image=0"
date: "01-02-2015"
category: "mypc"
tags:
    - mypc
---

Upgrade started

* Replaced /etc/gnome/defaults.list
* During installation the "report problem" pop-up appears, but the upgrade continues. I press report problem and it's about i915-3.15-3.13-dkms. Seems to be [Intel graphics related](https://bugs.launchpad.net/ubuntu/+source/xorg/+bug/1386721).
* Changes to php.ini, kept my version
* PhpMyAdmin is updated. Had to give root db password which was difficult to find... Noted it now.
* After reboot the system seems to run fine.

Third party repos that were disabled on upgrade to utopic:

Installed new repo:

* http://download.opensuse.org/repositories/isv:/ownCloud:/desktop/xUbuntu_14.04/

Re-added:

* ubuntu-wine/ppa/ubuntu
* http://ppa.launchpad.net/rabbitvcs/ppa/ubuntu
* https://get.docker.com/ubuntu
* http://linux.dropbox.com/ubuntu
* http://ppa.launchpad.net/graysky/utils/ubuntu
* http://dl.google.com/linux/chrome/deb/

Not re-added:

* http://ppa.launchpad.net/webupd8team/atom/ubuntu
* http://ppa.launchpad.net/webupd8team/nemo/ubuntu
* https://download.01.org/gfx/ubuntu/14.04/main


### Update 7-2-2015

When trying to update owncloud, this message appears:

```
The following packages have unmet dependencies:
 owncloud-client : Depends: libowncloudsync0 (= 1.7.1) but it is not going to be installed
                   Depends: owncloud-client-l10n but it is not going to be installed
E: Unable to correct problems, you have held broken packages.
```

Install from .deb should work, but it complains about a conflict with the installed package 'libqtkeychain0'.

Running:

```
sudo apt-get update
apt-get autoremove
```

* removed owncloud repos from Other Software
* removed libqtkeychain0 0.20140128 with Ubuntu Software Center
* now libqtkeychain0 0.3.0-2 is available -> installed it
* re-added owncloud repo and run installation -> works!

Now there still is a problem with lxc-docker, it can't be updated.

```
apt-get remove lxc-docker
apt-get install lxc-docker
```

This works!