---
title: "Polymer 2 and Redux"
cover: "https://picsum.photos/800/600?image=2"
date: "30-07-2017"
category: "webdevelopment"
tags:
    - webdevelopment
---
The coming time I will be spending a lot of time developing in [Polymer 2.0](https://www.polymer-project.org/), so I've done some research and made a small project to test some aspects of setting up a real-world application with it. It is in [this repo](https://github.com/mdvanes/polygram/). It contains two basic elements (*polygram-searchbox* and *polygram-details*) that share state via Redux and also I've separated the UI from the API with a container element (*polygram-ui-details* vs *polygram-details*). This separation of concerns simplifies reuse (I reuse *polygram-ui-details* in *polygram-marvel-details*).

Polymer CLI provides convenient utilities (project scaffolding, building), but the linter and WCT (web component tester) are lacking because they are too limited compared to e.g. ESLint and Karma and in fact it is [encouraged to use an separate linter](https://www.polymer-project.org/2.0/docs/tools/polymer-cli-commands#lint). For that reason, I would have preferred that the Polymer linter would have been provided as an ESLint plugin.

In the examples I use ES6 syntax without a transpiler, but I will soon have to investigate if bundling can be enriched with transpilation because I would at least like to try to use TypeScript. Of course we're losing the module imports (`import x from './x'`) in favor of html imports of elements (`<link rel="import" href="x.html">`). I think it's a loss, we finally have a standard for imports, why not stick to it?

I would also still like to look at the possibility of adding [Redux Thunk](https://github.com/gaearon/redux-thunk) and/or [RxJS](http://reactivex.io/rxjs/) for async event handling. It seems that at least certain features of RxJS are already available in Polymer, e.g. *observers* on properties and the *debounce* attribute on [iron-ajax](https://www.webcomponents.org/element/PolymerElements/iron-ajax).

On a side track I've also done a small comparative case between Polymer and [native web components](https://html.spec.whatwg.org/multipage/custom-elements.html), currently on version 1. This example is in the same repo, in the [HelloWorld demo](https://github.com/mdvanes/polygram/tree/master/demo/HelloWorld). Polymer builds on web components and implements of component driven development

So far the syntax is very similar, but Polymer is opinionated on certain design decisions (the HTML format, for instance) and adds some convience functions, and more importantly polyfills for wider support (see [webcomponents-lite](https://www.webcomponents.org/polyfills/)) and a [catalog](https://www.webcomponents.org/) of reusable web components.