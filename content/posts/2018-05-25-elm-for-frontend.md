---
title: "Elm for front-end developers"
cover: ""
date: "25-05-2018"
category: "webdevelopment"
tags:
    - webdevelopment
---

Elm for front-end developers - how we dove into Elm to rebuild part of our site.

# Why Elm?
The benefits of [Elm](http://elm-lang.org/) (no runtime errors, typing) is what makes it accessible to our back-end developers. They are used to the functional style of Scala and in general to a workflow with a compiler. 

On the other hand, this workflow is also what makes the learning curve enormously steep to front-end developers; if you are used to the front-end workflow, working with a compiler is very different. Back-end (e.g. Scala) developers iterate by writing code and seeing if it compiles. Because of (unpredictable) runtime errors and intransparent state in conventional front-end projects, front-end developers have another kind of iterative workflow: write a small bit of code, see what the result is in the browser. And this means leaving the IDE, navigating your app and opening your browser devtools.

The popularisation of live reloaders and the emphasis on a fast build chain (linters, precompilers) originates from this workflow. Although ultimately developing in a strongly typed and compiled language will have less errors, it does require a different programming style.

Besides adapting to this workflow, the functionally pure coding style is infamously difficult to grasp for the uninitiated (See [Functional Programming Is Hard,
That's Why It's Good](http://dave.fayr.am/posts/2011-08-19-lets-go-shopping.html), also just Google “functional programming is difficult”). You think you are comfortable with functional concepts (e.g. immutable state, pure functions, higher order functions, currying) and operators (e.g. map, filter, reduce) in JavaScript? This will be of very little help in Elm, because it is not possible to combine functional style with an OO style (or to fall back to OO when you are completely lost).

Objects have no meaning in Elm, Elm is a true functional language, like Haskell and Scheme. JavaScript on the other hand is flexible, multi-paradigm ([imperative, functional, prototype-based](https://developer.mozilla.org/en-US/docs/Web/JavaScript)) and scales from development by absolute beginners to enterprise.

## Immutability

Take for instance immutability. In JavaScript (without libraries) the meaning of immutability is limited to the const keyword, which prevents you from reassigning to declared variables.

```javascript
const x = {val: 'foo'};
x = {}; // prevented
```

It is still possible to change the contents of a constant however, with property reassignment.

```javascript
x.val = 'bar' // value of x is now {val: 'bar'}
```

[Immutability in Elm](http://elmprogramming.com/immutability.html) is much more invasive: there are no variables, only constants. Assignment can be written inline or take a chained style for clarity:

```elm
-- inline
myVar : String
myVar = "Hello, " ++ toString(add 5 ((\x -> x + 1) 4))
```

```elm
-- chained
myVar : String
myVar = 4
    |> (\x -> x + 1)
    |> add 5
    |> toString
    |> String.append "Hello, " 
```

Note that the order is reversed to what you may expect in this chained notation, it reads from bottom to top.

This is similar to chaining (functional) operators without storing intermediate state in JavaScript, e.g.:

```javascript
const retweetAuthors = listOfTweets
    .filter(tweet => tweet.isRetweet)
    .map(tweet => tweet.author)
```

Although the order here is from top to bottom.

If a value can be changed (e.g. by user input or server updates) you need to use “update” functions in Elm. These will update the entire or partial application state by creating a new state and updating the part of the model that is relevant for this event.
Example:

```javascript
updateModel : Msg -> Model -> Model
updateModel msg model =
   case msg of
       Name name ->
           { model | name = name }
```

Which means that in the case the message is “Name”, create a new “model” where model.name is set to the supplied name.

An advantage is that over the course of use of the application a list of states is recorded, which enables time travel debugging (like in [this GIF](https://github.com/reduxjs/redux-devtools)).

This might look familiar if you have used [Redux](https://redux.js.org/). Redux is partially [inspired by Elm](https://redux.js.org/introduction/prior-art#elm) and you might recognize the [dispatch, action] cycle in the way Elm updates the model. In that respect, it is is also similar to [state stores in RxJS](http://reactivex.io/rxjs/manual/tutorial.html#state-stores):

```javascript
const increase = Rx.Observable.fromEvent(increaseButton, 'click')
    // We map to a function that will increase the count
    .map(() => state => Object.assign({}, state, {count: state.count + 1}));
```

Here you can see that a new state object is created, and only the count property is updated.

Another familiar aspect of Elm is the use of [Virtual DOM](http://elmprogramming.com/virtual-dom.html). Instead of manipulating the DOM directly, an in-memory representation of the UI (the virtual DOM) is modified, and that is synchronized to the real DOM. This improves performance dramatically and is one of [the selling points of React](https://reactjs.org/docs/faq-internals.html).

With all of this in mind, we set out to rewrite [our company site](https://www.codestar.nl) in Elm. The current implementation of the site is outdated and has all content stored locally. We want to migrate to a [JAMstack](https://jamstack.org/) approach, with the content stored in cloud services (Youtube, Twitter, and photos in [Cloudinary](https://cloudinary.com/)) and to pull the data in through the respective APIs with Elm. The idea is that Elm should be more accessible to our Scala devs, while still providing a mature environment for our front-end devs so maintenance can be done by either.

Of course, all devs try to dive right in and soon are discouraged when this approach does not seem to work here. So maybe let's read the Elm docs. There actually are quite a bit of docs. Maybe first finish the tutorials. Actually now I am even more confused…. 

# Toolchain/workflow
No matter if it is Elm, [Polymer](https://mdworld.nl/polymer-2-and-type-script), or any other New Solution that does not use ES6 modules, it means you can’t use the tools you are probably used to as a front-end developer, like ESLint. You are now at the mercy of the maturity of the ecosystem of the New Solution. Fortunately, it looks like Elm has a very active community and covers [Webpack integration](https://www.elm-tutorial.org/en/04-starting/03-webpack-1.html), for instance, right in the documentation.

## Elm-reactor and external CSS
When starting out with Elm, you usually use elm-reactor to compile and serve Elm files. This offers a web interface that lets you navigate Elm files and when opening them serves them as HTML. Quite soon, you will find out that this presents a problem when you want to add external global resources, like CSS. 
The Elm app served by elm-reactor is compiled to JavaScript and wrapped in an HTML. But you can’t specify what that HTML should look like, so you can’t add e.g.
```html
<link rel="stylesheet" href="style.css" />
```

You can (and eventually will) create your own HTML and build with e.g. webpack, but there is an intermediate solution if you want to get to know Elm better first, while keeping the benefits of elm-reactor, such as live reloading and the time travel debugger. It is [not very well documented](https://github.com/elm-lang/elm-reactor/issues/199#issuecomment-279250207), but you can create an HTML file that directly loads an Elm file. Elm-reactor will automatically compile and live update it. The HTML would contain:

```javascript
<script type="text/javascript" 
    src="/_compile/app/src/Main.elm"></script>
<script type="text/javascript">
    runElmProgram();
</script>
```

We did notice that local custom fonts that were added while serving this way were not loaded. Custom fonts from a CDN will probably work.

## Webpack
First I set up a Webpack config conforming to [this guide](https://www.elm-tutorial.org/en/04-starting/04-webpack-2.html). Before, I loaded an image in my Elm code, but now this image gives a 404 when I use the webpack-dev-server. It is also not copied to /dist when building. Webpack does not seem to resolve the image as an asset, which is a [known issue](https://github.com/elm-community/elm-webpack-loader/issues/54).
There are workarounds, like setting the image as a CSS background and have the image dependency resolved by the css-loader, but that does [not conform to a11y guidelines](https://mdworld.nl/polymer-2-and-type-script) for informative images.

The suggested solution is to use [elm-assets-loader](https://github.com/NoRedInk/elm-assets-loader). Additional to the instructions:
* I had to add ../ as a prefix to the image path
* It was helpful to run webpack instead of webpack-dev-server, it gave more informative errors
* I had to remove this line from the webpack config: `noParse: /\.elm$/,` because it failed on an SVG import without a compile error, but with a runtime error: "Uncaught ReferenceError: require is not defined"

This last issue arose because it [is suggested in elm-webpack-loader](https://github.com/elm-community/elm-webpack-loader#noparse) to set `noParse: /\.elm$/,` conflicting with elm-css-webpack-loader, which I added later.

The cause of the error and the workaround to set `noParse: /^((?!Stylesheet).)*\.elm.*$/,` instead, is explained in [elm-css-webpack-loader](https://github.com/tcoopman/elm-css-webpack-loader).


# Getting the debugger back
When using Webpack, you don't use elm-reactor so you don’t have the time travel debugger. This seems obvious: there is no Elm code anymore, it has been compiled to JS. It is very difficult to find documentation that mentions this. However, when using [elm-webpack-starter](https://github.com/elm-community/elm-webpack-starter) it actually runs with the debugger!

It seems this is actually an option for the elm-webpack-loader in the webpack.config.js. First we used this:

```
'elm-webpack-loader?verbose=true&warn=true'
```

Which is equivalent to:
```json
{
   loader: 'elm-webpack-loader',
   options: {
       verbose: true,
       warn: true
   }
}
```

And here the option "debug" can be added:

```json
{
   loader: 'elm-webpack-loader',
   options: {
       verbose: true,
       warn: true,
       debug: true
   }
}
```

I had trouble finding this option, because I had looked at the [elm-webpack-loader readme]( https://github.com/elm-community/elm-webpack-loader), but I searched for “debug” in the readme, and there is actually only a reference to all the options [in the source]( https://github.com/rtfeldman/node-elm-compiler/blob/3fde73d/index.js#L12-L23).


# Unit tests
We set up unit tests (see test/Assets.elm) and modified the npm tasks such that:
* Postinstall runs elm package install for / and also for /tests/
* The new task `npm format-validate` validates /app/src and /tests/*.elm (as a quick way of excluding /tests/elm-stuff)
* `npm test` runs `format-validate` and `elm-test`
* `npm run build` first runs `npm test` and then starts webpack-dev-server

# Speeding up the build on Travis
After adding a unit test (i.e. elm-test) the build speed is taking over 45 minutes on Travis CI.
One suggestion is to [cache the elm artifacts](https://8thlight.com/blog/rob-looby/2016/04/07/caching-elm-builds-on-travis-ci.html).

Add this to travis.yml:

```yml
cache:
  directories:
    - elm-stuff/build-artifacts
    - tests/elm-stuff/build-artifacts
```

The first build after adding this should be still slow, because the build-artifacts will have to be cached, but the second build should be faster:

* build #23 (first build with cache on): 46 minutes 48 seconds
* build #24: 5 minutes 53 seconds

So it is worth the trouble!

It would be possible to cache `elm-stuff` (where Elm dependencies are installed) instead of `elm-stuff/build-artifacts`, but this would require manually clearing the cache when new Elm dependencies are added.

# Combining several components in one Elm app
We started out with several proofs of concept, so we have a separate TwitterFeed app and DiceRoller app that need to be integrated into the site app.
I’ve followed my refactoring attempt (for splitting up one huge Elm file) that I did in [my first Elm experiment](https://github.com/mdvanes/elmsta/tree/refactoring), which helped integrating the models and update functions.

The TwitterFeed has an initial Cmd. This must somehow be called by the initial Cmd of the main page app.

This is the init of the Model and Cmd of the main page app. The TwitterFeed model has been added, but the initial Cmd is still "none":

```elm
init : ( Model, Cmd Msg )
init =
   ( Model "Elm" Material.model initialDiceRoller TwitterFeed.State.initialModel, Cmd.none )
```

I want a custom init cmd to be called:

```elm
init : ( Model, Cmd Msg )
init =
   ( Model "Elm" Material.model initialDiceRoller TwitterFeed.State.initialModel, initCmd )
```

On init, I want to call a service to get Twitter messages. In the standalone TwitterFeed app this looks like this:

```elm
initTwitterFeedCmd : Cmd TwitterFeedMsg
initTwitterFeedCmd =
   Task.attempt NewTweets fetchTweets
```

It is not possible to create an initCmd in the main page app that calls initTwitterFeedCmd directly:

```elm
initCmd : Cmd Msg
initCmd =
   initTwitterFeedCmd
```

Because initTwitterFeedCmd is of the type Cmd TwitterFeedMsg. However, after adding TwitterFeedMsg to the union type for Msg, i.e.:

```elm
type Msg
   = Name String
   | Mdl (Material.Msg Msg)
   | MsgForDiceRoller DiceRollerMsg
   | MsgForTwitterFeed TwitterFeedMsg
```

Then it is possible to map from Cmd TwitterFeedMsg to Cmd Msg:

```elm
initCmd : Cmd Msg
initCmd =
   initTwitterFeedCmd
       |> Cmd.map MsgForTwitterFeed
```

# Conclusion
In the end we simply do not have a strong enough use case for Elm. There is too little state to manage and interaction between components. The TwitterFeed component does have state for instance, but it is so straight forward that Elm offers no advantage over JavaScript alternatives like RxJS state stores 
or Redux. In this sense Elm would be a good fit for an advanced web app or component with UI controls or complex logic. 

Also the steep learning curve for most developers remains, and although this was anticipated for front-end developers it proves more challenging to Scala devs than we first thought.
