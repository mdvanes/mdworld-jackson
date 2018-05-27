---
title: "Site updated"
cover: "https://picsum.photos/800/600?image=0"
date: "10-05-2018"
category: "webdevelopment"
tags:
    - webdevelopment
---

It's always a hard decision to move to a new platform for my personal site, and this time it was sped up by the growing
need for https (for SEO) and the release of GatsbyJS v1. 

Up until now I was using a monolitical Apache + PHP webserver, but since the 2013 version of the site, a dynamic webserver
was no longer needed for the blog, because it was generated statically with Jekyll. Only the "send mail" component was 
in PHP and I was running some other PHP apps, and hosting some binaries, that have nothing to do with the blog. I've 
done away with the PHP apps: communication by mail was already almost zero and the other apps were outdated. 

Now the blog has been properly containerized, this means future upgrades will be easier too: the blog is its own app
with its own scope. When I will need anything dynamic in the future, I will use [Serverless](https://serverless.com/) functions.

Another good reason to migrate from [Jekyll](https://jekyllrb.com/) to [Gatsby](https://www.gatsbyjs.org/) is letting go 
of Ruby dependencies and migrating to a NodeJS
based platform. With Jekyll I started to run into problems with recreating the Jekyll stack with the 
correct dependencies to build the blog, in case of restoring after an emergency. This might be caused by my lack of knowledge
of Ruby, but it meant it was really time to upgrade to a newer version of Jekyll or start with a new theme. And in the mean
time, Gatsby 1.0 was released and I really subscribe to the [JAMstack](https://jamstack.org/) architecture.  

With the new setup, I can work with a modern and familiar stack e.g. Babel, React, TravisCI. I still believe in static site 
generation for blogs, and just like in Jekyll, adding a post in Gatsby is just a matter of adding a Markdown file with 
some frontmatter. But an improvement is that you can also drop React components in the pages dir that will be automatically
picked up as pages. And it is even possible to add a React component inside a Markdown post. Try clicking the screenshots
below for a simple lightbox feature and 
see the source for [this post](https://raw.githubusercontent.com/mdvanes/mdworld-jackson/master/content/posts/2018-05-10-site-updated.md). 

For more information about the current stack, see the [about page](../about).

# Cover images

The cover images for each post, e.g. the image you see on top of this post, are procedurally generated 
with my project [procgen-cover](https://github.com/mdvanes/procgen-cover). This was inspired by the talk 
by [Kate Compton](http://www.galaxykate.com/) on [JSConf.is](https://2018.jsconf.is/) 2018. 

# Old themes

Static versions of the 2 last themes still run [here (2013-2018)](https://mdvanes.github.io/mdworld-ingram) 
and [here (2010-2013)](https://mdvanes.github.io/mdworld-simon).

**Theme 2013-2018**
 
<simple-light-box img-path="/lightbox/theme-ingram.jpg" img-title="Theme 2013-2018"></simple-light-box>

**Theme 2010-2013**
 
<simple-light-box img-path="/lightbox/theme-simon.jpg" img-title="Theme 2010-2013"></simple-light-box>


**Theme until 2010**
 
![Theme until 2010](https://mdvanes.github.io/mdworld-simon/sites/default/files/images/vorig_design.jpg)
