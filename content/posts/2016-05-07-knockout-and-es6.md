---
title: "KnockoutJS and ES6"
cover: "https://picsum.photos/800/600?image=3"
date: "07-05-2016"
category: "webdevelopment"
tags:
    - webdevelopment
---
In the past year I've made some ES6 projects, for instance [HomeRemote](https://bitbucket.org/mdvanes/homeremote), an ES6 flavored React project. My company mainly uses a KnockoutJS based theme and it would be an improvement to introduce ES6 to this theme. The combination of Knockout and ES6 is not very common, so I've summarized my endeavors.

# Precompiling with Webpack

Because I want to use ES6 classes and native modules, which are respectively _not well_ and _not at all_ supported cross browser, I will use a transpiler. Because I will want to look into component based development, I choose [Webpack](https://webpack.github.io/), also because it is pluggable and has e.g. Typescript support.

Although I am aware of the advantages of TypeScript and it's adoption should increase with the advent of Angular 2, I will stick with plain ES6 for the moment, to stay as close as possible to the native syntax.

It is not very clear how to install all the needed dependencies for ES6 compilation with Webpack. It does give feedback on missing modules when running, so with some trial and error, this should be the installer command:

```bash
npm i --save-dev webpack webpack-dev-server webpack-merge grunt-webpack babel-core babel-loader babel-preset-2015
```

Because [JShint](https://github.com/gruntjs/grunt-contrib-jshint) and [JSCS](https://github.com/jscs-dev/grunt-jscs) do not support ES6 syntax, I replace them with [ESlint](https://github.com/jscs-dev/grunt-jscs):

```bash
npm i --save-dev grunt-eslint
```

I integrate Webpack and ESlint into Grunt, this is very straight-forward:

```javascript
eslint: {
    options: {
        configFile: '.eslintrc'
    },
    dev: [
        '_js/**/*.js'
    ]
},

webpack: {
    options: webpackConfig,
    build: {
        progress: false,
        plugins: []
    }
},
```


Both Webpack and ESlint changed the syntax for their configuration since the last time I used it, my configs look like this now:

* Webpack 1.13.0

```javascript
var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');

var common = {

    entry: './_js/app.js',

    resolve: {
        extensions: ['', '.js']
    },

    output: {
        path: path.join(__dirname, 'js'),
        filename: 'bundle.js'
    },

    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};

module.exports = common;
```


* ESlint (grunt-eslint 18.1.0)

```json
{
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
    }
  },
  "env": {
    "browser": true,
    "es6": true
  },
  "rules": {
    "no-bitwise": 2,
    "curly": 2,
    "eqeqeq": 2,
    "no-use-before-define": 2,
    "new-cap": 2,
    "no-caller": 2,
    "no-undef": 2,
    "no-unused-vars": [2, {"args": "none"}],
    "no-trailing-spaces": 2,
    "strict": [2, "function"],
    "quotes": [2, "single"],
    "complexity": [1, 3]
  }
}
```

# The Entrypoint

The file app.js is the main entrypoint. It imports all the factories and classes as dependencies and registers them to our application API (bqApp). E.g.:

```javascript
import otherCustomModelFactory from './es6/viewmodels/otherCustomModelFactory';
import otherCustomTemplateFactory from './es6/otherCustomTemplateFactory';

if (bqApp && blueriq) {
    bqApp.modelFactory.register(otherCustomModelFactory);
    bqApp.templateFactory.registerModelHandler(otherCustomTemplateFactory);
}
```

The registering used to be done in e.g. the customModelFactory file itself, but when using ES6 modules, I started to notice how this requires a dependency to bqApp in the customModelFactory file, while it's only needed for registering the factory. For the sake of
high cohesion, I decided to export the finished factory and register it in the app.js instead.

In advance, one of my main concerns was handling existing variables that the application API puts on the global scope, because the API is not yet in ES6 style. Fortunately, in contrast to Typescript it is not needed to have typing definitions, making it trivial to mix ES5 and ES6 libraries in one app. Because ES6 modules are used in the app.js, it is no longer needed to use an IIFE for scoping (the ES6 modules are scoped at the file level anyway) or strict mode declaration (implicit, because strict mode indicates ES5 syntax). This does mean I need an alternative way to reference global variables. E.g. the bqApp variable is put on the global scope by the application API, which I can't change at the moment, instead of being exposed as an importable module. Supposedly, it would be possible to wrap it in a file that converts the global to a module. For the short term I see two options, though:

1. ```/* global bqApp:false */``` - this works because the var is on the global scope, it's just ESlint who warns for undefined variables.
2. ```const bqApp = window.bqApp;``` - explicitly reassinging to a local variable, which is basically what I used to do when supplying window.bqApp as a parameter to an IIFE, and then declaring bqApp as an argument in that IIFE.

For the moment I will stick with option 1, although I have included an example of both just to be complete.

# Viewmodels and the viewmodel factory

Most viewmodels that we use extend from some existing viewmodel that is build into the application API, such as blueriq.models.BaseModel. A very simple example:

```javascript
(function(ko, blueriq) {
    var FooModel = function(model, context) {
        var self = this;
        blueriq.models.BaseModel.call(self, model, context);
    }
})(window.ko, window.blueriq);
```

As said, I was concerned about using existing variables from the application API. I had no idea how the ES6 "extend" would convert to ES5, but fortunately it seems to be backwards compatible with the approach above, because this simply works:

```javascript
/* globals blueriq:false */

// I want to extend blueriq.models.dashboard.PageModel (which is an old-fashioned ES5 class). This works!

class PageModel extends blueriq.models.dashboard.PageModel {
    constructor(model, context) {
        super(model, context);
        console.log('new es6 PageModel', model, context);
    }
}

export default PageModel;
```

Now PageModel can be imported into the modelFactory, which decides what viewModel to use based on properties of the provided model.

```javascript
import PageModel from './PageModel';

const otherCustomModelFactory = function otherCustomModelFactory(model, context) {
    if(model.type === 'page') {
        return new PageModel(model, context);
    }
};

export default otherCustomModelFactory;
```

It has already been shown how otherCustomModelFactory is imported and registered in app.js.

# Templates

Creating a templateFactory, which decides what template to use based on properties of the provided model, is nearly identical to the modelFactory:

```javascript
/* globals blueriq */

const otherCustomTemplateFactory = function otherCustomTemplateFactory(viewModel, context) {
    if(viewModel.type === 'field') {
        return 'themes/myTheme/template/field';
    }
};

export default otherCustomTemplateFactory;
```

At this moment, the factory just returns the id of the template. The template itself is requested from the filesystem by the [koExternalTemplateEngine](https://github.com/ifandelse/Knockout.js-External-Template-Engine) (this project has been retired for several years now) or with a custom solution that reads the template from a file that contains all templates. A very important improvement that could be made here is using Webpack to resolve the paths to the templates. It should be possible to write a custom loader that retrieves the contents of a template that is being imported, e.g. like this:

```javascript
/* globals blueriq */
import fieldTemplate from './template/field.html';

const otherCustomTemplateFactory = function otherCustomTemplateFactory(viewModel, context) {
    if(viewModel.type === 'field') {
        return fieldTemplate;
    }
};

export default otherCustomTemplateFactory;
```

# Custom Binding Handlers

Knockout [handlers](http://knockoutjs.com/documentation/custom-bindings.html) need to be registered to ko.bindingHandlers, e.g. like this:

```javascript
ko.bindingHandlers.clickTester = {init: function(elem) {
    $(elem).click(function() {
        alert('you clicked it!');
    });
}};
```

If I would put this in a module, nothing would be exported. I still need to look into how the system would handle this. Probably it will just execute adding the bindinghandler and return nothing, but for the moment I just export the body of the handler and import and register it in our app.js.

In handlers/clickTester.js:

```javascript
/* globals $:false */

export const clickTester = {
    init: function(elem) {
        $(elem).click(function() {
            alert('You clicked the ES6 KO Handler!');
        });
    }
};
```

In app.js:

```javascript
import {clickTester} from './es6/handlers/clickTester';
ko.bindingHandlers.clickTester = clickTester;
```

# Follow up

I still need to improve the registration of handlers, I don't know if I want them all in my app.js or maybe in a separate file. In that case I will need to figure out how to export "nothing" to my app.js, otherwise the import statement might fail.

So far, our product does not use Knockout components. The style of component based development is very similar to React or Angular 2.0 components, although in practice, it might be closer to Angular 1.x directives. It would be interesting to see how it would translate to the ES6 syntax.
