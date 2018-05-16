---
title: "Functional Javascript Update"
cover: "https://picsum.photos/800/600?image=3"
date: "03-10-2015"
category: "webdevelopment"
tags:
    - webdevelopment
---
With a background in functional programming (Haskell), I'm interested in bringing functional programming to the web. [Frontend Masters](http://frontendmasters.com) offers a course called ["Hardcore Functional Programming in JavaScript"](https://frontendmasters.com/courses/functional-javascript/) by Joe Nelson and Brian Lonsdorf.

For the uninitiated in Functional Programming, you might already be using it without knowing it. If you use jQuery callbacks, e.g. $.get, this uses the functional concept of [Higher Order Functions](http://eloquentjavascript.net/05_higher_order.html), because it's a function that takes or returns a function. Also the JavaScript native utility Array functions [map, filter, reduce etc.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) are higher order functions and are well known features of functional programming. The course ["JavaScript: From Fundamentals to Functional JS"](https://frontendmasters.com/courses/js-fundamentals-to-functional/) by Bianca Gandolfo can be recommended as an introduction to these concepts and in general to get a deeper insight into JavaScript for intermediate developers. Also see [the repo](https://github.com/bgando/functionalJS/).


A simple example of a Higher Order Function (add), binding it to a new function (add5) and applying the new function:

```javascript
var add = function(num1) {
  return function(num2) {
    return num1 + num2;
  }
}
var add5 = add(5);
add5(3); // result is 8
```

"Hardcore Functional Programming in JavaScript" outlines the ["point free" style](https://wiki.haskell.org/Pointfree) of programming, bringing Functional JavaScript closer to a purely functional language like Haskell. This is also what makes the functional "hardcore" in the case of this course, because the style looks quite foreign to imperative/object-oriented programmers.

Advantages of point free, functional JavaScript include:

* It makes functions easier to test. You should need no mocks, because the point free functions are very loosely coupled and highly cohesive (if I understand well).
* It's very convenient for working with streams of data/events. This is [literally](https://baconjs.github.io/) in the description of the Functional Reactive JavaScript lib Bacon.js.
* It offers a very different approach to async tasks. In a sense the functional concept of "Futures" provides the same feature as a Promise does. For example, two asynchronous calls that depend on each others result would be written like this ([source](https://vimeo.com/97575933)):

```javascript
// Future
Future.of(loadPage)
    .ap(Api.get('/products'))
    .ap(Api.get('/reviews'));

// Compare to Promise
request.get({
    url: '/reviews'
}).then(function(response) {
    return request.get({
        url: '/products'
    });
}).then(function(response) {
    loadPage();
});
```

A disadvantage is that this style of programming in JavaScript is still in it's infancy. The [final demo](https://github.com/begriffs/immutube) from the course uses 7 libraries, most with some degree of overlapping functionality. We should feel encouraged to help improve the state of these libraries!

The libraries used in the demo:

* jQuery
* [lodash      ](https://lodash.com/)
* [ramda       ](http://ramdajs.com)
* [pointfree   ](https://github.com/DrBoolean/pointfree-fantasy)
* future, part of [this](https://github.com/folktale/data.task), for as far as I can tell
* [bacon       ](https://baconjs.github.io/)
* [socketio    ](http://socket.io/)

The lack of (static) typing in JavaScript really becomes a large disadvantage when attempting functional programming. I can tell from personal experience that trying to do without typing in Haskell is not worth the headache. The use of a typed transpiler like [TypeScript](http://www.typescriptlang.org/) might be of added value, if it's compatible with the Functional JavaScript libraries.

In conclusion, it is possible to do "hardcore" functional programming (i.e. in a Haskell, point free style) in JavaScript, but it's definitely not as easy to pick up as jQuery or even as Angular. You really need to know why you would want to try (I'm not entirely convinced myself), but it would be possible to mix it in with the existing frameworks in your everyday work. On the other hand, it would be advisable to start using the much more accessible functional Array utils, like map, filter, and reduce right away.


It might be worth to mention that the presenters of the course are different from other presenters in my experience. They clearly care strongly about the abstract, academic aspect of programming. During the presentation, they develop in a terminal in Vim instead of in an IDE like Webstorm and don't lint their code, resulting in missing semicolons and otherwise sloppy code. It can be argued that it's not relevant to the subject, but I try to be consistent in my workflow, especially since people will use it as a start point. Also, I enjoy learning about new techniques/tools as a side effect of following these kind of courses.

As a follow-up to this course I will probably look into Lenses ([video](https://vimeo.com/104807358), [nanoscope library](https://github.com/5outh/nanoscope)), the book ["Mostly Adequate Guide to Functional Programming"](https://drboolean.gitbooks.io/mostly-adequate-guide/) by Brian Lonsdorf (one of the presenters), the [Bacon.js](https://baconjs.github.io/) library and the [Fantasy Land](https://github.com/fantasyland/fantasy-land) spec.
