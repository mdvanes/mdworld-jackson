---
title: "Site updated"
cover: "https://picsum.photos/800/600?image=0"
date: "10-05-2018"
category: "webdevelopment"
tags:
    - webdevelopment
---


Up until now I was using a monolitical Apache + PHP webserver, but since the last update
of the site, this was no longer needed for the blog, because it was static.

Only the "send mail" component was in PHP and I was running some other PHP apps
that were separate from the blog.

So now it has been split into "microservices" with distinct concerns that are much easier to maintain and upgrade.

Another good reason to migrate from [Jekyll] to [Gatsby] is letting go of Ruby dependencies and migrating to a NodeJS
based platform. I ran into problems that it was not possible anymore to recreate the Jekyll stack with the 
correct dependencies for the blog, in case of restoring after an emergency. This might be caused by my lack of knowledge
with Ruby, but it was really time to upgrade to a newer version of Jekyll or start with a new theme. And in the mean
time, Gatsby 1.0 was released and I really subscribe to their implementation of [JAMstack].  



[slideshow from the old themes over the years]

Static versions of the 2 last themes still run here (simon theme) and here (ingram theme).