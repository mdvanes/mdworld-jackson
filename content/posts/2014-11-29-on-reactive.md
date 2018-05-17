---
title:  "On Reactive"
cover: "https://picsum.photos/800/600?image=3"
date: "29-11-2014"
category: "webdevelopment"
tags:
    - webdevelopment
---

<style>
.paradigm {
    background-color: #ffb525;
    color: black;
}
.language {
    background-color: #25ff7c;
    color: black;
}
.library {
    background-color: #2581ff;
    color: black;
}
</style>

There are a lot of terms in webdevelopment that have some connection to the word "reactive". I found myself mixing them up, so I want to clarify it here. 

For the sake of simplicity I will classify libraries & frameworks as a "library" and anything conceptual as a "paradigm".

## Reactive Programming

type: <span class="paradigm">paradigm</span> | url: [http://www.reactivemanifesto.org](http://www.reactivemanifesto.org) 

A modern software architecture that fits the current demand for real-time updates. Quote from the Reactive Manifesto: "We want systems that are Responsive, Resilient, Elastic and Message Driven. ... Systems built as Reactive Systems are more flexible, loosely-coupled and scalable." This is all explained in great detail in the manifesto.


## Functional Reactive Programming

type: <span class="paradigm">paradigm</span> | [Read more](http://engineering.silk.co/post/80056130804/reactive-programming-in-javascript) 

Functional Reactive Programming (FRP) is a way to do reactive programming using concepts from functional programming, such as map, reduce and filter. [Silk](http://silk.co) explains FRP as "[something that] allows us to declaratively set up bindings between data in different parts of our product that keep in sync automatically", making it a way to handle maintainability issues. In short, updating "reactive" variables will also update their values where used in the DOM. Silk has a reactive jQuery plugin which illustrates this quite elegantly. Taken from their site:

```
var header = new Reactive("initial string");
$("h1").first().rText(header);

// Setting the reactive value now automatically updates
// the text contents of our header element:
header.set("New Header Text!");
```

I feel this can be compared with two-way binding in JavaScript MVCs.

Also Jafar Husain from Netflix, with 6 years of FRP experience, has an [interesting presentation](https://www.youtube.com/watch?v=XRYN2xt11Ek) bringing many of the concepts in this article together.

## React

type: <span class="library">library</span> | url: [http://facebook.github.io/react/](http://facebook.github.io/react/)

Short version: Facebook's MVC implementation like Angular is Google's MVC implementation.

Focused on the UI (the "View" in MVC). Used on Facebook.com and Instagram.com. Fast because of the use of a virtual DOM and it can be run server-side too.

The use of JSX is optional. JSX is a syntax for using pseudo HTML in JavaScript, more or less like HTML templating. React offers the JSXTransformer library to enable JSX support in JavaScript.

 
## Ractive.js

type: <span class="library">library</span> | url: [http://www.ractivejs.org](http://www.ractivejs.org)

Short version: A simpeler MVC than Angular.

The learning curve of Angular is quite high. In contrast Ractive.js is designed to be as simple as possible. It was created at theguardian.com and it uses [Mustache templates](https://github.com/janl/mustache.js).

These blog posts really goes in depth about Ractive.js [vs React](http://blog.ractivejs.org/posts/whats-the-difference-between-react-and-ractive/) and [vs Angular](http://blog.ractivejs.org/posts/whats-the-difference-between-angular-and-ractive/)

## Reactive Extensions (a.k.a. RxJS)

type: <span class="library">library</span> | url: [http://reactive-extensions.github.io/RxJS/](http://reactive-extensions.github.io/RxJS/)

Short version: Observables + LINQ + Schedulers, Library for reactive programming in JS.

Reactive extensions exist for several platforms and RxJs is the implementation for JavaScript. The RxJs is incredibly abstract:

"Using RxJs, developers represent asynchronous data streams with Observables, query asynchronous data streams using LINQ operators, and parameterize the concurrency in the asynchronous data streams using Schedulers."

It is modeled after LINQ, which is part of Microsoft .NET and is used for native data querying.

My understanding is that RxJs goes beyond Promises, because it combines Promises, callbacks, DOM input, web workers (threads in JS), and web sockets.

For clarification I tried to find a compelling use case. In theory, this would be anything with events, no matter if it is drag & drop or AJAX calls. An example from their site is an autocomplete that doesn't flood the backend with request because of the reactive programming paradigm. See the [autocomplete example](http://jsfiddle.net/mattpodwysocki/AL8Mj/) on the [RxJS examples pages](https://github.com/Reactive-Extensions/RxJS/tree/master/examples).

## Flapjax

type: <span class="language">language</span> | url: [http://www.flapjax-lang.org](http://www.flapjax-lang.org)

Short version: Functional Reactive Programming implementation in JavaScript

It has been around since 2006, and the site looks really outdated. Fortunally, there are many such initiatives at the moment, in different stages of implementation:

* [Bacon.js](http://baconjs.github.io/) The site shows this simple example of a counter implemented with Bacon.js. It interprets the data as a stream of clicks on the up or down button:

```
var up   = $('#up').asEventStream('click');
var down = $('#down').asEventStream('click');

var counter =
  // map up to 1, down to -1
  up.map(1).merge(down.map(-1))
  // accumulate sum
    .scan(0, function(x,y) { return x + y });

// assign observable value to jQuery property text
counter.assign($('#counter'), 'text');
```

* [ProAct.js](http://proactjs.github.io/)
* [Kefir.js](http://pozadi.github.io/kefir/)

## Functional JavaScript

type: <span class="paradigm">paradigm</span>

Short version: implementation of functional programming in JavaScript

The idea is that functional programming should make larger projects easier to understand. Books have been written on why you should want this. [Literally](http://eloquentjavascript.net/1st_edition/chapter6.html), [books](http://www.functionaljavascript.com/). There is also a really neat node based [workshop, by timoxley](https://github.com/timoxley/functional-javascript-workshop). This workshop uses no external libraries.

## LoDash

type: <span class="library">library</span> | url: [https://lodash.com](https://lodash.com)

According to the site, it is a drop-in replacement for [Underscore](http://underscorejs.org/). Both are libraries with helpers for functional programming. They add functions for typical FP concepts like e.g. map, reduce, and filter. According to the long list of features "not in Underscore" on the LoDash site, it might be considered the better alternative.

Alternative libraries:

* [Lazy.js](http://danieltao.com/lazy.js/), adding lazy evaluation. Actively under development.
* [Functional Javascript](http://osteele.com/sources/javascript/functional/), last updated in 2007.

## Real-time web

type: <span class="paradigm">paradigm</span>

Short version: pushing information from the server to the client

Any combination of libraries, technologies or practices that allow server-side push of information to the browser instead of relying on client-side polling. It's basically the new name for the [Comet](http://en.wikipedia.org/wiki/Comet_%28programming%29) model of programming. By far the most obvious example is [web sockets](http://www.html5rocks.com/en/tutorials/websockets/basics/), which is [widely supported (e.g. IE 10+)](http://caniuse.com/#feat=websockets). I made a [demo for web sockets](https://github.com/mdvanes/mdworld-stox) implemented in Node recently, but it is based on a earlier implementation in PHP that I did somewhere in March 2013. There are plenty of frameworks that make real-time web easier to develop with:

* [Firebase](https://www.firebase.com/), web app framework that allows three-way binding when [combined with e.g. Angular](https://www.firebase.com/docs/web/libraries/angular/index.html). This means it syncs database updates straight to the browser.
* [Pusher](https://pusher.com), multi platform server side and client side library providing plenty of documentation for implementing common real-time applications, like push notification or a chat client. Provides standardized fallbacks for web sockets.


## Responsive/Adaptive design

type: <span class="paradigm">paradigm</span> | [Read more](http://www.liquidapsive.com/)

Short version: has nothing to do with reactive, but it sounds like it...

I feel that I should mention this because the first time I heard about reactive, I assumed it classified as a design method, like responsive or adaptive design. It obviously has nothing to do with design, but to clarify:

* responsive design is a set of liquid designs, one for each breakpoint.
* adaptive design is a set of static designs, one for each breakpoint. E.g. the current design of mdworld.nl is adaptive. Try changing the window width from 700px to 900px, 1000px, 1300px, and 1700px.
