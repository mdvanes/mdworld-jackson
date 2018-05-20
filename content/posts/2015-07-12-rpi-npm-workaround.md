---
title: "npm workaround"
cover: "https://picsum.photos/800/600?image=3"
date: "12-07-2015"
category: "webdevelopment"
tags:
    - webdevelopment
---

**EDIT** The issue concerning the compilation of npm for ARM seems to have been fixed, which would outdate this post. The latest builds should be available at [https://nodejs.org/dist/](https://nodejs.org/dist/). For RPi 1 look for the builds with "armv6l", for RPi2B "armv7l", and for RPi3 I assume you would need "arm64".

---

Although it's relatively easy to install [Node.js](http://nodejs.org) on a Raspberry Pi, getting npm to work is a bit more challenging. 

It seems there is [an issue with compiling npm](http://redandwhite.herokuapp.com/#/post/5516eba439156a0e00cad4f6), at least for ARM. As long as this remains unfixed, there is no npm with the node 0.12.x ARM installation.

A very simple workaround is to copy the node\_modules from another system and to run the packages (e.g. [bunyan](https://github.com/trentm/node-bunyan), which is supposed to be installed globally) with node. Since installing (globally or not) is not possible, but node is installed, I will call it directly from the node\_modules that I copied from another machine.

So instead of using ```npm start``` configured in package.json as ```node app.js | bunyan``` I would do ```node app.js | node node_modules/bunyan/bin/bunyan```

Or if I would like to read the log file afterwards:

```node node_modules/bunyan/bin/bunyan -o short error.log```


This would also work for other systems where npm can't be installed or if npm can't be used to install packages. I've used this on a system behind a corporate proxy, although I've found [a better way](../npm-without-internet) by now.


# Node on RPi

Keep in mind that this still requires Node.js to be installed. For a Raspberry Pi running Raspbmc it's possible to use *apt-get* to install Node, but it won't be a recent version. Instead, I use the ARM build *node\_latest\_armhf.deb* from [node-arm](http://node-arm.herokuapp.com).


# Compiling Node on RPi

I've also tried compiling Node from source on the Raspberry Pi (model B). It should not be very difficult, but it failed in my case, probably because of the issue with npm, mentioned before. To be complete, I will list my steps.

* I had already installed gcc earlier with ```sudo apt-get install build-essential```
* I looked up the latest version in http://nodejs.org/dist/
* At 11-7-2015 this was http://nodejs.org/dist/v0.12.7/node-v0.12.7.tar.gz

```
# adapted from http://elinux.org/Node.js_on_RPi
wget http://nodejs.org/dist/v0.12.7/node-v0.12.7.tar.gz
tar -xzf node-v0.12.7.tar.gz # duration ca. 1 min
cd node-v0.12.7
./configure # duration ca. 1 min
```

Here I would really recommend to start a screen session, because compiling takes ca. 2 hours.

* ```sudo apt-get install screen```
* ```screen``` start a session
* ```ctrl + a, d``` detach session
* ```screen -dRR``` reattach to any session running

My first attempt to run make ended with this error:

```
/usr/include/linux/sysinfo.h:8:2: error: unknown type name '__kernel_long_t'`
```

From [this thread](http://raspberrypi.stackexchange.com/questions/8566/peerguardian-moblock-installation-on-raspbmc) I found the solution to add these lines:

```
#ifndef __kernel_long_t
typedef long     __kernel_long_t;
typedef unsigned long   __kernel_ulong_t;
#endif

```

to the file /usr/include/linux/sysinfo.h, before the lines:

```
    #define SI_LOAD_SHIFT   16struct sysinfo {...
```

The second attempt to run make failed with this error:

```
/bin/sh: 1: cannot create /home/pi/node-v0.12.7/out/Release/.deps//home/pi/node-v0.12.7/out/Release/obj.target/libuv/deps/uv/src/unix/linux-core.o.d: Permission denied
```

So in the end I ran clean and make as root:


* ```sudo make clean```
* ```sudo make```

after some hours it fails with:

```
/out/Release/obj.target/v8_snapshot/geni/snapshot.cc"
Illegal instruction
make[1]: *** [/home/pi/node-v0.12.7/out/Release/obj.target/v8_snapshot/geni/snapshot.cc] Error 132
make[1]: Leaving directory `/home/pi/node-v0.12.7/out'
make: *** [node] Error 2
```

This is either the compile issue as described in the beginning of this article, or yet again another issue. Since I found out about the compile issue at this point I've stopped experimenting and resorted to the quick workaround.