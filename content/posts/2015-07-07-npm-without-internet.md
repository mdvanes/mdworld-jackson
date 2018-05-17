---
title: "npm without internet"
cover: "https://picsum.photos/800/600?image=3"
date: "07-07-2015"
category: "webdevelopment"
tags:
    - webdevelopment
---

It's easy to run npm to install packages even on a system without internet access, or behind a corporate firewall. First note that [npm has proxy settings](http://jjasonclark.com/how-to-setup-node-behind-web-proxy/), so if you have access to the correct credentials, try that first.

Let's assume you're developing a web application and you use [Grunt](http://gruntjs.com/) for managing jshint and uglify tasks. This requires the npm package grunt-cli to be installed globally. All the other packages (i.e. jshint and uglify) can be run locally, so it's sufficient to copy node_modules with these packages from another installation.

Assuming you have another system with internet access/no proxy, and you have a working project with all the packages there:

1. Zip the node\_modules in the project dir to e.g. node\_modules.zip.
2. Go to %userprofile%\AppData\Roaming\npm\node_modules\grunt-cli\
3. Run ```npm pack``` this should result in a grunt-cli-x.y.z.tgz
4. Collect the node_modules.zip, grunt-cli-x.y.z.tgz and [Node.js](http://nodejs.org) installer and place them on the target system (e.g. by local network or usb drive).
4. Prepare the project dir on the target system, e.g. from a Git repo on the network or from scratch. The Gruntfile.js and package.json should already be in the root of the project.
5. Install [Node.js](http://nodejs.org) on the target system. This should also install npm. Check this with ```node -v``` and ```npm -v```.
6. Unpack the node\_modules.zip into the project dir, such that \<project\>/node\_modules contains e.g. grunt-contrib-jshint.
7. Place grunt-cli-x.y.z.tgz in some temporary dir, e.g. \tmp and run ```npm i -g grunt-cli-x.y.z.tgz```.
8. Grunt should now be installed globally, try ```grunt --version```.
9. Now it should be possible to run ```grunt``` in the project dir.

If you want to do a lot of offline installations, you might want to +1 [this issue](https://github.com/npm/npm/issues/4210). It explains the process of doing several pack and install steps and how this could be simplified by extending the pack feature to also zip all the depencies of a package.