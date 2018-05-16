---
title: "Dop Beeping HDD"
cover: "https://picsum.photos/g/800/600?image=0"
date: "13-12-2015"
category: "mypc"
tags:
    - mypc
---

Recently I replaced the 1,5 TB HDD that is used as an archive in Dop by a 3TB Seagate Barracuda ST3000DM001. Silly choice apparently, because it is known to have some defects. Imagine my horror when it started beeping at certain intervals. 

The time in between is large enough to seem random, but it apparently only happens after awaking from hibernate. After looking up [some forums](http://lime-technology.com/forum/index.php?topic=29076.msg259784) this seems to be a problem with Advanced Power Management with Seagate drives.

By disabling APM with ```sudo hdparm -B 255 /dev/sdb``` the sound indeed disappeared. This setting is not maintained after reboots, but it should be possible to configure it in the ```/etc/hdparm.conf``` e.g. like this:

```
/dev/sdb {
    apm=255
}
```