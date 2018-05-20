---
title: "Polymer 2 and TypeScript"
cover: "https://picsum.photos/800/600?image=0"
date: "09-12-2017"
category: "webdevelopment"
tags:
    - webdevelopment
---
For [reasons beyond my control](../polymer-2-and-redux/) I'm working with
Polymer 2 at the moment. Although the idea of web components is great, the choice for HTML imports that comes with
Polymer 2 makes integration into a modern development stack cumbersome, as will become clear soon. Also, HTML
imports are not widely supported by browsers and although polyfills exist, only [Chrome (surprise!)](https://caniuse.com/#search=html%20imports) 
will have native support for the foreseeable future.

Using TypeScript seems like a good choice, because static typing helps prevent runtime errors. Additionally it would be a
good opportunity to try out the [Scala-TS-interfaces project](https://github.com/code-star/scala-ts-interfaces) by my
colleagues, that can generate TypeScript from a Scala domain model. Unfortunately, adding TypeScript to a Polymer 2
development stack proves to be difficult, whereas using it with Polymer 3 seems trivial. Polymer 3 is currently in
preview so it is not a viable option for me for the moment, but it will exchange HTML imports for ES6 Modules. This will
make integrating it into a modern development stack much easier. An [example](https://github.com/mdvanes/polymer3-typescript)
already exists, by [Paolo Ferretti](https://github.com/pferretti) and follows normal conventions for a TypeScript project.

If you're adventurous, don't need any [existing Polymer 2 elements](https://www.webcomponents.org/) and don't need to
run production; stop reading here and use Polymer 3. 
If you need Polymer 2 read on, but be warned that it won't be pretty.

**TL;DR to use TypeScript with Polymer 2 use [typescript-batch-compiler](https://github.com/mdvanes/typescript-batch-compiler) or even better [twc](https://github.com/Draccoz/twc).**


## Webpack

For this experiment I will use my existing Polygram project and the result will be available in the [TypeScript branch](https://github.com/mdvanes/polygram/tree/TypeScript). 

The first challenge is to use Webpack with Polymer 2. Although not strictly necessary for TypeScript compilation, it would
make sense for importing HTML as modules. Fortunately, [Rob Dodson himself](https://www.youtube.com/playlist?list=PLOU2XLYxmsII5c3Mgw6fNYCzaWrsM3sMN) wrote an
article [How to use Polymer with Webpack](http://robdodson.me/how-to-use-polymer-with-webpack/). It even mentions TypeScript!
The article introduces the Webpack loader [https://github.com/webpack-contrib/polymer-webpack-loader](https://github.com/webpack-contrib/polymer-webpack-loader) and
explains how it extracts the JavaScript from the HTML of Polymer elements and eventually packages everything into one
JavaScript file. I was basically able to copy the webpack.config.js and index.ejs from his demo project, place it into Polygram and that would compile. I moved my
[custom elements](https://github.com/mdvanes/polygram/tree/TypeScript) from the root of the project to the src dir and I had
to modify the paths to the bower_components and it would basically work. 

The most important exception is Redux, the redux-mixin.html can't resolve the PolymerRedux.html dependency (in bower_components/polymer-redux/polymer-redux.html). 
The polymer-webpack-loader should resolve this, but runtime it logs `Uncaught ReferenceError: PolymerRedux is not defined`. 
E.g. for src/polygram-app.html, the loader seems to import the HTML elements that are used in the `template` element, 
but not the JavaScript variables that are used in the `script` element.

The PolymerRedux code is distributed as JavaScript wrapped in a `script` tag in mainly one file, so it would be easy to
extract it to a JavaScript file. Or even to import `polymer-redux/src/index.js` instead of `polymer-redux/polymer-redux.html` 
(although index.js is uncompiled and misses external dependencies that are not installed in bower_components because they are development dependencies of polymer-redux). 
For now, I just comment out the Redux dependencies.

It is already clear now that the result from Webpack will be one huge bundle.js that inlines all JavaScript and HTML 
dependencies. This means using the [PRPL pattern](https://www.polymer-project.org/2.0/toolbox/prpl) will not be possible 
in this workflow, nor will it be possible to have standalone Polymer components and the accompanying Polymer demo pages.


## Adding ts-loader

Normally, to migrate a Webpack project from JavaScript to TypeScript, it would be enough to add the [ts-loader](https://github.com/TypeStrong/ts-loader) 
to the Webpack config and to rename the JavaScript files to TypeScript files. 

So I started with changing the extension for the bootstrapping index.js and adding .ts as a resolved extension:

```javascript
// webpack.config.js
...
entry: path.resolve(__dirname, 'src/index.ts'),
...
resolve: {
        extensions: ['.ts', '.js'],
...
```

And adding this rule:

```javascript
// webpack.config.js
{
    test: /\.ts?$/,
    use: [
        { loader: 'ts-loader' }
    ]
}
```

And creating a tsconfig.json:
```javascript
{
  "compilerOptions": {
    "sourceMap": true,
  }
}
```

Everything still compiles, but the JavaScript for the Polymer components is embedded in the HTML and therefore ignored 
by the new rule with the ts-loader.

Adding the ts-loader to the rule for the HTML files breaks compilation:

```javascript
// webpack.config.js
{
    test: /\.html$/,
    use: [
        { loader: 'babel-loader' },
        { loader: 'ts-loader' }, // <--
        { loader: 'polymer-webpack-loader' }
    ]
},
```


Even without changing any of the code itself, compilation fails with:

```
ERROR in ./src/polygram-app.html
Module build failed: Error: Could not find file: '/home/me/polygram/src/polygram-app.html'.
```

Well, that just doesn't look healthy. I filed [a bug](https://github.com/webpack-contrib/polymer-webpack-loader/issues/64) 
and almost 2 months after my report the maintainers closed the issue commenting that the root cause is with Webpack, so I 
don't see this will be resolved any time soon.

For now, I will try to work around it by extracting the TypeScript code to a separate file. 

### Workaround for TypeScript compilation in a Polymer element

After removing the `ts-loader` line from the HTML rule in the webpack.config.js I set out to extract the TypeScript to a
separate file so it can be compiled with the rule that matches ts files. 

Roughly, the main entry point for the Polymer elements `polygram-app.html` contains:

```html
// imports
<link rel="import" href="../bower_components/polymer/polymer-element.html">
...
<link rel="import" href="polygram-details.html">
<link rel="import" href="polygram-searchbox.html">

<dom-module id="polygram-app">
    <template>
        <!-- Style -->
        <style include="iron-flex iron-flex-alignment"></style>

        <!-- Markup -->
        <div class="layout vertical">
            ...
        </div>
        ...
    </template>
    <script>
        // Script
        import format from 'date-fns/format';

        class PolygramApp extends Polymer.Element {
            static get is() { return 'polygram-app'; }
            static get properties() {
                return {
                    today: {
                        type: String,
                        value: function() {
                            return format(new Date(), 'MM/DD/YYYY');
                        }
                    }
                }
            }
        }
        window.customElements.define(PolygramApp.is, PolygramApp);
    </script>
</dom-module>
```

Since I know the `import` statement in the script tag works, I can use this to my advantage. Lets create a companion
TypeScript file for polygram-app.html named PolygramApp.ts.

```typescript
// PolygramApp.ts
import format from 'date-fns/format';

export default class PolygramApp extends Polymer.Element {
    static get is() { return 'polygram-app'; }
    static get properties() {
        return {
            today: {
                type: String,
                value: function() {
                    return format(new Date(), 'MM/DD/YYYY');
                }
            }
        }
    }
}
``` 

It would be possible to import PolygramApp.ts with `<script src="PolygramApp.ts"></script`, but I like the standard ES6 module structure
of PolygramApp.ts without the added responsibility of registering itself to customElements, so I import it like this:

```html
<!-- polygram-app.html -->
...

<dom-module id="polygram-app">
    ...
    <script>
        // Script
        import PolygramApp from './polygramApp';
        window.customElements.define(PolygramApp.is, PolygramApp);
    </script>
</dom-module>
```

The result is a failed compilation with 3 types of errors. Let's deal with them one by one.


### 1. Failing accessors

The `is` and `properties` getters require a specifically set target ECMAScript version, the compilation error is:
`error TS1056: Accessors are only available when targeting ECMAScript 5 and higher`. It surprises me that the default
ES target is ES3, but it's not a problem to use ES5 or even ESNext here, because the babel-loader will transpile it back to ES5.

Adding `"target": "ESNext"` to compilerOptions in the tsconfig.json fixes this error.

### 2. Failing Polymer import

`Polymer` can't be found for the `extends`. This is the most difficult of these errors to solve, because it is caused by the preferred module 
architecture of Polymer 2: because HTML imports are used, it is not possible to use `import Polymer from '../bower_components/polymer/polymer-element.html'`
because this polymer-element does not export `Polymer` as an ES6 module. The webpack-polymer-loader can resolve HTML
imports, but using `import '../bower_components/polymer/polymer-element.html'` results in an `error TS2304: Cannot find name 'Polymer'`.
 
For the moment, I'm just removing the `extends Polymer.Element` from PolygramApps.ts and `window.customElements.define(PolygramApp.is, PolygramApp);` from polygram-app.html.


### 3. Failing date-fns import

To be able to continue resolving the compilation errors, I add a log statement to polygram-app.html:

```html
<!-- polygram-app.html -->
...

<dom-module id="polygram-app">
    ...
    <script>
        // Script
        import PolygramApp from './polygramApp';
        console.log(PolygramApp.properties.today.value());
    </script>
</dom-module>
```

The import of date-fns originally failed in the TypeScript compilation with 
`error TS1192: Module ''date-fns/format'' has no default export.` but at this point that has two different behaviors:

* The IDE warns `TS2307 Cannot find module date-fns`
* Compilation succeeds, but this error is logged in the browser: `Uncaught TypeError: format_1.default is not a function(…)`

I first thought that this was caused by missing typings for the date-fns library, so I tried
`npm install @types/date-fns` but this logs that date-fns actually provides typings.

Eventually I was able to fix the Uncaught TypeError by changing the import in PolygramApp.ts from

```javascript
import format from 'date-fns/format';
```

to

```javascript
import { format } from 'date-fns';
```

And the IDE warning by adding `"moduleResolution": "node"` to the compilerOptions in tsconfig.json.

At this point, although nothing is rendered, because of the added log statement the current date is logged to the browser console. 


### Failing Polymer import, continued

Now the import succeeds and it is clear that the TypeScript compiler correctly processes PolygramApp.ts, it is time to 
try to fix the import of the `Polymer` module in PolygramApp.ts.

A possible workaround will be to not try to import HTML imports in the TypeScript file, but instead to supply those dependencies
through the HTML that is importing the TypeScript file. To do this, I change the respective files to:

```html
<!-- polygram-app.html -->
...

<dom-module id="polygram-app">
    ...
    <script>
        // Script
        import PolygramAppFactory from './PolygramApp';
        const PolygramApp = PolygramAppFactory.create(Polymer);
        window.customElements.define(PolygramApp.is, PolygramApp);
    </script>
</dom-module>
```

```typescript
// PolygramApp.ts
import { format } from 'date-fns';
const label: string = 'Current Date: ';

function create(Polymer) {
    return class PolygramApp extends Polymer.Element {
        static get is() { return 'polygram-app'; }
        static get properties() {
            return {
                today: {
                    type: String,
                    value: function() {
                        return label + format(new Date(), 'YYYY-MM-DD');
                    }
                }
            }
        }
    }
}

export default { create }
``` 

Now everything compiles without errors and the custom elements are rendered again!

Note here that I also added a `string` type to `const label` to see if typings work.


### Re-enabling Redux

Earlier, Redux was disabled to test Webpack. It was failing with the runtime error `Uncaught ReferenceError: PolymerRedux 
is not defined` To re-enable it, I convert the `polymer-redux/polymer-redux.html` from 
bower_components to a local PolymerRedux.js, by just removing the `script` tags.

Because redux-mixin.html, action.html, and reducer.html actually are already JavaScript wrapped in `script` tags, I just convert
them to TypeScript files, for example:

```typescript
// ReduxMixin.ts
import {combineReducers, compose, createStore} from 'redux';
const PolymerRedux = require('exports-loader?PolymerRedux!./PolymerRedux');
...
export const ReduxMixin = PolymerRedux(reduxStore);
```

To use it in PolygramApp.ts, it can now be imported like a normal ES6 module:

```typescript
// PolygramApp.ts
import { format } from 'date-fns';
const label: string = 'Current Date: ';
import {ReduxMixin, reduxStore} from './ReduxMixin';

function create(Polymer) {
    return class PolygramApp extends ReduxMixin(Polymer.Element) {
        static get is() { return 'polygram-app'; }

        static get properties() {
            // Added Redux code here
            ...
        }

        ready() {
            // Added Redux code here
            ...
        }

    }
}

export default { create }
```

After making similar modifications for polygram-searchbox, the Redux events work again as before introducing TypeScript. 

## Importing a global variable from HTML

At this point PolymerRedux is loaded from a custom PolymerRedux.js that I made in the previous step by removing the `<script>` 
tags from the file in bower\_components. Although this works, it would be better to use the file in bower\_components 
directly because it will be easier to handle updates to this external package.

Currently I import the custom PolymerRedux.js in state/ReduxMixin.ts with:

```typescript
const PolymerRedux = require('exports-loader?PolymerRedux!./PolymerRedux');
```
 
To load the HTML from the bower_components, I expect to have to use the polymer-webpack-loader to extract the JavaScript
from the `script` tags:

```typescript
const PolymerRedux = require('exports-loader?PolymerRedux!polymer-webpack-loader!../../bower_components/polymer-redux/dist/polymer-redux.html');
``` 

This fails to compile with the message that PolymerRedux is undefined, so I add the [debug-loader](https://github.com/ianwalter/debug-loader) to
investigate what the result of each step looks like:

```typescript
const PolymerRedux = require('exports-loader?PolymerRedux!polymer-webpack-loader!debug-loader?id=raw!../../bower_components/polymer-redux/dist/polymer-redux.html');
``` 

Thanks to debug-loader it is immediately clear that already before going into the polymer-webpack-loader the `script` tags have
been stripped. Just using require without any loaders turns something likes this `<script>foo()</script>` into `foo()`
and webpack-polymer-loader is not needed in this case. I do think this only works when the file is completely self 
contained and does not have dependencies with other Polymer HTML files.

This is the final working import:

```typescript
const PolymerRedux = require('exports-loader?PolymerRedux!../../bower_components/polymer-redux/dist/polymer-redux.html');
``` 


## Linting

Although there is a [polymer-linter](https://github.com/Polymer/polymer-linter), it is [advised](https://github.com/Polymer/polymer-linter#use-with-other-tools) to 
use Polymer Linter combined with other linters, and an obvious choice is TSLint.

The way that TSLint is configured with Webpack means that it will only lint TypeScript that is not embedded in HTML:

```javascript
// webpack.config.js
new TSLintPlugin({
    files: ['./src/**/*.ts'] // So, this requires none of the TS to be inline in HTML?
})
```

Before I started with this experiment I thought this might be a problem. But now almost all script has been extracted to
separate TypeScript files anyway, so this works quite well. 

Of course it is also still possible to run TSLint manually for a file, e.g. `./node_modules/.bin/tslint --config tslint.json polygram-marvel-details.ts`

It is still required to run `polymer lint` manually. As far as I know there is no integration for Webpack yet.


## Decorators

I want to see if I can use [ES decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841), 
because decorators conceptually fit with the Mixin pattern used in Polymer 
for e.g. `class MyElement extends ReduxMixin(Polymer.Element)`. It would be tidy if we could write this as a decorator,
especially if more mixins would need to be combined:

```typescript
@ReduxMixin
class MyElement extends Polymer.Element
...
```

As a test, I just add an [example decorator](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841) 
to the class in polygram-details.ts:

```typescript
    @readonly
    foo() {
        // This works, but prepends a polyfill to the output
        return 'just testing a decorator';
    }
```

And in the same file, but outside the class, the definition of the decorator:

```typescript
function readonly(target, key, descriptor) {
    descriptor.writable = false;
    return descriptor;
}
```

The compiler fails with: 
```
error TS1219: Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option to remove this warning.
```

This flag can be added to the compilerOptions section of the tsconfig.json: `'experimentalDecorators': true`. The 
compilation now succeeds, but prepends a small polyfill for `decorator` to the output. Take this into account when using 
decorator in many files, because it will cause an overhead that might be avoided by using a third party library that is
imported globally.


## App vs Element

It is one thing to compile Typescript for a Polymer app, but another thing to use TypeScript for reusable Polymer components.

The next step will be to compile the Polymer components in this test project separately. As a result, each converted 
component should both be loaded into its own [demo page](https://github.com/PolymerElements/iron-component-page) and to be composed into a Polymer app.

The demo pages should be accessible by running `polymer serve`, conform the normal Polymer workflow.

When just running a Webpack build for the current project with `./node_modules/.bin/webpack --config webpack.config.js`, it will build a 
`dist` dir containing amongst others an index.html and a bundle.js. This is a standalone app, but this would not be a good workflow to 
distribute a Polymer component because:

* the index.html is a complete HTML document, not just a `dom-module`
* the bundle.js is one huge JavaScript blob that contains not only the compiled JavaScript for the component, but also all templates, TypeScript, Webpack and Polymer polyfills and libraries (like lodash in this case)

The polyfills and libraries need to be kept separate, so that they can be loaded once per project instead of once for every component. 
The bundle.js is already 2.8MB in size (unminified) / 347kB (minified).

Would it be possible to make a Polymer component that uses the `<script src="foo.js">` style import and then do a "naive"
compilation from foo.ts to foo.js? Let's first make a minimal example where the JavaScript is extracted from an Polymer
component:

* Using `/polygram-details.html` (this is the original, that the TypeScript+Webpack version in /src/ was based on) and `/demo/polygram-details` (already importing /polygram-details)
* Do not run webpack, but just `polymer serve` and test the demo page
* Replace `<script>... code ...</script>` by `<script src="polygram-details.js"></script>`, extract the JavaScript to 
polygram-details.js and test the demo page again: this works.

Now to TypeScript:

* Rename `polygram-detail.js` but leave the reference in `polygram-details.html` to point to the JavaScript version: `<script src="polygram-details.js"></script>` 
* The package `typescript` was already installed as a dependency, so use `tsc`: `./node_modules/.bin/tsc polygram-details.ts`. 
This gives errors, but does generate code. The resulting code does not run.

The first errors are:

```
polygram-details.ts(8,31): error TS2304: Cannot find name 'Polymer'.
polygram-details.ts(33,14): error TS2339: Property '_searchResult' does not exist on type 'PolygramDetails'.
polygram-details.ts(35,18): error TS2339: Property '_searchIAUrl' does not exist on type 'PolygramDetails'.
polygram-details.ts(42,18): error TS2339: Property '_searchResult' does not exist on type 'PolygramDetails'.
```

Adding `declare const Polymer: any;` fixes these 4 errors. It tells TypeScript a global variable `Polymer` can be expected.  

This leaves the following errors:

```
polygram-details.ts(9,16): error TS1056: Accessors are only available when targeting ECMAScript 5 and higher.
polygram-details.ts(13,16): error TS1056: Accessors are only available when targeting ECMAScript 5 and higher.
```

The current compilation seems to ignore the tsconfig.json, because a similar error was solved earlier by 
adding `"target": "ESNext"` in the config. The target can be specified with a flag: `./node_modules/.bin/tsc --target ES6 polygram-details.ts`.
This runs without errors and works in the browser!

### Simple compilation and Webpack

This much simpler approach without Webpack seems to provide a more realistic workflow. Can we afford to leave Webpack 
out entirely? Let's reiterate its purpose:

#### Webpack transpiles to ES5 with Babel

As mentioned before we don't need Babel for transpilation, the TypeScript compiler can be set to ES6 or ES5. 

#### Webpack provides a development server with hot module reloading

Hot Module Replacement is mainly to ease development, but we can use livereload combined with polyserve instead which would be acceptable for this use case.  

#### Webpack handles module bundling

We can do without ES6 modules or packaging other resources like images as JavaScript modules, because we already have to
deal with Polymer Elements as a component platform. We have to distribute the end result as Polymer Elements to be able to add it to the catalog.

Although Polymer 3 will use ES6 modules, a tool is supposed to become available that can migrate from elements from Polymer 2 to Polymer 3 syntax.

Without Webpack we lose the module polyfill that is injected per file, which potentially saves a significant size overhead, whilst staying closer to the concept of Polymer Element development.

Global JavaScript variables from external modules can be made accessible with the `declare` placeholder, and it is still 
possible to use `import` to import from `node_modules`.
However, when module is set to `none` in the tsconfig.json, the variable will just be put onto the "global" scope. This is
not the *true* global scope, because it is still contained within the Polymer element, so the variable will be on the Polymer 
Element scope, and should not leak to the actual global scope. 

`Import` should still be used with caution: it will lead to code duplication if 2 Polymer+TypeScript elements import the 
same dependency. In that case it would be better to import that dependency via HTML import because the Polymer compiler can deduplicate it.

Webpack can also be used to package CSS as modules, but for encapsulating CSS in Polymer the 
[Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM) can be used. This is actually an 
aspect of web components that is very well executed.


### Automatic compilation

Without Webpack, it is unpractical that for every change to a TypeScript file a manual transformation is needed. Following
the example in the previous section, each time `polygram-details.ts` changes, `./node_modules/.bin/tsc --target ES6 polygram-details.ts`
must be run. Let's try to automate this without using Webpack.


#### With tsc

First I make a new tsconfig named `tsconfig.inline.json` for this use case:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "target": "ES6"
  },
  "include": [
    "*.ts"
  ]
}
```

To compile run `./node_modules/.bin/tsc -w -p tsconfig.inline.json`. The `-w` flag keeps the process running and watches for
changes in the included TypeScript files. 

An interesting side-effect occurs. Naturally, each TypeScript file is going to need the `declare const Polymer: any;`
declaration as a workaround for the fact that the Polymer dependency can't be imported (see previous sections). But 
because we now use `-p`, the project flag, the compiler expects all files share global scope. And the second file
using `declare const Polymer: any;` will get an error: `Cannot redeclare block-scoped variable 'Polymer'`. How can we use
the project flag, without letting the compiler share the global scope between all TypeScript files?

A workaround would be to create a TypeScript file that just imports/declares all the expected global variables once. 
This would make the code less transparent at best and it might even create other scoping issues.


### Custom compilation

As an alternative let's try to run compilation with an isolated scope for each TypeScript file. [This issue](https://github.com/Microsoft/TypeScript/issues/1516) 
explains that this would be possible by supplying a tsconfig.json for each scope. That would be doable for a limited set 
of scopes that is static over time (e.g. a back-end codebase and a front-end codebase in the same project).
However, it makes no sense from a maintenance standpoint for the current project as it would need a tsconfig.json
for each Polymer element.

To be complete, I did try this out. First, set up a base tsconfig that can be inherited:

```json
// base.json
{
  "compilerOptions": {
    "sourceMap": true,
    "target": "ESNext",
    "moduleResolution": "node",
    "experimentalDecorators": true
  }
}
``` 

Now for each Polymer TypeScript file a tsconfig, e.g.:

```json
// polygram-details.tsconfig.json
{
  "extends": "./base.json",
  "files": [
    "./polygram-details.ts"
  ]
}
``` 

It is now possible to compile/watch polygram-details.ts with `tsc -w -p polygram-details.tsconfig.json`, but it is 
still not possible to compile/watch multiple tsconfigs at *the same time*.
 
In this case it would be better to forget about the watch flag `-w` altogether and just use `npm watch` combined with 
`tsc [changedfile]`. You can't use a tsconfig.json combined with an input file path for tsc, so all options must be 
supplied as flags: `tsc --target ES6 --sourceMap [changedFile]`.

I tried combining this compilation one-liner with a watch script, but I could not get this to work with [nodemon](https://www.npmjs.com/package/nodemon), 
[npm-watch](https://www.npmjs.com/package/npm-watch) or [watch](https://www.npmjs.com/package/watch), so I wrote a small script:

```javascript
// ts-poly-watch.js, run with: node ts-poly-watch.js
const watch = require('watch');
const path = require('path');
const chalk = require('chalk');
const tsc = require('node-typescript-compiler');

watch.createMonitor(__dirname, { interval: 1 }, function (monitor) {
    console.log(chalk.gray.bgGreen.bold('TS-POLY-WATCH started'));
    monitor.on('changed', function (f, curr, prev) {
        const ext = path.extname(f);
        if(ext === '.ts') {
            console.log(f + ' changed');
            tsc.compile(
                {
                    'target': 'ES6',
                    'sourceMap': true
                },
                f
            );
        }
    });
});
```

Now it is possible to watch each TypeScript file and compile it with its scope isolated from the other TypeScript files.


## twc 

With `ts-poly-watch.js` it looks like we finally have an acceptable working environment. I have extracted the script to 
its own project [typescript-batch-compiler](https://github.com/mdvanes/typescript-batch-compiler) and [npm package](https://www.npmjs.com/package/typescript-batch-compiler) because
there is much room for improvement and it will be easier to use in other projects if it is an npm package.

So are we now done? In fact there is one more thing I want to explore. During the research I ran into [twc](https://github.com/Draccoz/twc).
This is a compiler for *TypeScript Web Components* and can be used to compile TypeScript classes to Polymer 2 elements.
Although this sounds like it is similar to my `typescript-batch-compiler`, here are some preliminary findings:

1. It assumes a TypeScript file as the entrypoint: in my setup I still stay close to the Polymer setup with a 
Polymer element (so HTML) that includes a script file. With `twc` the entrypoint is a TypeScript file that imports an HTML template.
A great advantage is that this is more like Polymer 3 and also similar to other component driven frameworks
like React, Vue and Angular. The disadvantage is of course that the style will be foreign to other Polymer developers.
2. It's still very experimental. There is no example in the repo or an explanation of how to set up a basic element in the
README, but a general approach is outlined [on the project wiki](https://github.com/Draccoz/twc/wiki/Creating-a-simple-component) 
and examples of twc in a project can be found in [this generator project](https://github.com/mlisook/generator-polymer-init-twc-starter-kit).

With the aforementioned wiki, I take these steps:

* Run `twc` in a new subdir of the project appropriately named "twc"
* Set up a very basic polygram-twc.ts conforming to the style as outlined in the wiki:

```typescript
// polygram-twc.ts
import { CustomElement } from 'twc/polymer';
import 'bower:polymer/polymer-element.html';

/**
 * `online-state`
 * Lets you select an online state (online or offline) and reflect the change on a host attribute.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
@CustomElement()
class OnlineState extends Polymer.Element {
    prop1: string = "online-state";

    template() {
        return `
          <style>
            :host {
              display: block;
            }
          </style>
          <h2>Hello [[prop1]]!</h2>
        `;
    }
}
```
* Run `tsc --init` to create a new tsconfig.json in the twc dir. This turns out to be important. When I re-use my existing 
tsconfig.json the build fails with `Error: Debug Failure.`. This seems to be caused by the line `"moduleResolution": "node"`,
which is not needed for this compilation.
* Add `node_modules/twc/types/polymer.decorators.d.ts` to the include section of the tsconfig.json, to resolve certain types.
* Build in the twc dir by running `../node_modules/.bin/twc polygram-twc.ts`.
* A polygram-twc.html is created.

I also converted the original polygram-details.html (the one with embedded JavaScript) to this format. See the result
in [the repo for this experiment](https://github.com/mdvanes/polygram/tree/TypeScript/twc). When working on this
conversion, some differences with normal web components become apparent:

* twc auto-injects the registration of the component: `customElements.define(PolygramDetails.is, PolygramDetails);`
* `import './polygram-ui-details';` is converted to `<link rel="import" href="./polygram-ui-details.html">`
* the `is` getter, i.e. this: `static get is() { return 'polygram-details'; }`
is auto generated from the class name.
* The JSDoc is converted to an HTML comment.

This syntax uses plain ES modules and is therefore also closer to Polymer 3. Still there are some differences.
Compare the code for polygram-twc.ts but in [Polymer 3 syntax](https://www.polymer-project.org/blog/2017-08-23-hands-on-30-preview):

```typescript
// PolymerElement is its own module now, instead of a property of the Polymer namespace. Also, bower is no longer used.
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';

// Aside from inline templates, this syntax can be used too:
//import * as view from './app.template.html';

export class OnlineState extends PolymerElement {
    constructor() {
        super();
        // Property must be defined in the constructor, but this might be a difference with TypeScript and not Polymer 3.
        this.prop1 = 'online-state';
    }

    static get template() {
        // I don't know where the <style> element should go.
        return `<h2>Hello [[prop1]]!</h2>`;
        // Or when using an import:
        //return view;
    }
}
```

Although I can't find any sources, I heard that Polymer 3 would supply an auto converter from (normal) Polymer 2 syntax. 
You could use that converter on the output of twc, so this should not be a reason to avoid twc.

## Final remarks

Unit testing and coverage support when using TypeScript has not been mentioned, but I hope it is clear that it is 
unchanged from a normal Polymer 2 application when using typescript-batch-compiler. You can just use 
[WCT](https://github.com/Polymer/web-component-tester)), because all components
are compiled to a state that conforms to a non-TypeScript Polymer 2 situation.

For the Webpack approach it would be an improvement to see why `polymer-webpack-loader` is not importing Polymer when 
using `import Polymer from '../bower_components/polymer/polymer-element.html'`
or `import '../bower_components/polymer/polymer-element.html'`.

It could also be an improvement to add the [prettier](https://www.npmjs.com/package/tslint-plugin-prettier) plugin to promote a 
consistent coding style. This could be added to TSLint via Webpack, but could also be integrated in the 
typescript-batch-compiler package.
