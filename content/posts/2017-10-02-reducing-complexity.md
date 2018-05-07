---
title: "Reducing cyclomatic complexity with functional operators"
cover: "https://picsum.photos/800/600?image=1"
date: "02-10-2017"
category: "webdevelopment"
tags:
    - webdevelopment
---
Reducing the cyclomatic complexity in a JavaScript application is a good, [quantifiable](https://eslint.org/docs/rules/complexity) 
way to make code more readable and maintainable.

Cyclomatic complexity increases as more control statements are used. For a summary of the factors that influence complexity,
see ["Complexity for JavaScript"](https://craftsmanshipforsoftware.com/2015/05/25/complexity-for-javascript/). Because
it is quantifiable, it can be automatically validated in build setups with [eslint](https://eslint.org/docs/rules/complexity).
Bear in mind that a single `switch` statement with a large amount of options will have a high cyclomatic complexity but 
probably is still perfectly readable. As always, rely on common sense when refactoring. 

Control statements that concern one parameter often use `switch`, for example:

```javascript
const foo = 'banana';
switch (foo) {
    case 'apple':
        console.log('First');
        break;
    case 'banana':
        console.log('Second');
        break;
    case 'coconut':
        console.log('Third');
        break;
    default:
        console.log('Last');
}
// Logs "Second"
```
 
A very common way to reduce the cyclomatic complexity with `switch` is to use a JavaScript object as a map. Instead of
traversing the switch statement, do a lookup in the map where the key is the condition and the value is the action. For the
example above this could look like this:

```javascript
const actions = {
    apple: _ => console.log('First'),
    banana: _ => console.log('Second'),
    coconut: _ => console.log('Third')
}
const foo = 'banana';
if(actions.hasOwnProperty(foo)) {
    actions[foo]();
} else {
    console.log('Last');
}
// Logs "Second"
```

This does not work directly with more complex conditions. e.g. a composite condition that checks against multiple parameters
within one statement or between statements.

```javascript
function example(error, stdout, stderr, mapping) {
    if(stderr && stderr.length > 0 && stderr.indexOf('A problem occurred') > -1) {
        console.log('Not found');
    } else if(error || (stderr && stderr.length > 0)) {
        console.log(`Execution error ${[error, stdout, stderr].join('|')}`);
    } else if(!Array.isArray(mapping)) {
        console.log(`Invalid configuration ${[error, stdout, stderr, mapping].join('|')}`);
    } else if(!stdout || stdout.length <= 0) {
        console.log('No output');
    } else {
        console.log('Result from some process with mapping and stdout');
    }
}
example(null,null,'A problem occurred'); // Logs "Not found"
example(new Error()); // Logs "Execution error Error||"
example(null,null,null,null); // Logs "Invalid configuration |||"
example(null,'',null,[]); // Logs "No output"
example(null,'Foo',null,[]); // Logs "Result from some process with mapping and stdout"
```

In this case a JavaScript Array of objects can be used here, with one property holding the condition and another holding the desired action.

```javascript
// First part
  const actions = [{
    condition: _ => !stdout || stdout.length <= 0,
    action: _ => console.log('No result')
  }, {
    condition: _ => !Array.isArray(mapping),
    action: _ => console.log('Config invalid')
  }, {
    condition: _ => error || (stderr && stderr.length > 0),
    action: _ => console.log('Error executing')
  }, {
    condition: _ => stderr && stderr.length > 0 && stderr.indexOf('A problem occurred') > -1,
    action: _ => console.log('Not found')
  }]
```

It would be possible to loop over each entry with a `for` loop or an [iterator (see an example)](http://webuniverse.io/cyclomatic-complexity-refactoring-tips/), but this is where the expressiveness of 
the functional operators `Array.prototype.filter` and `Array.prototype.reduce` shines.

```javascript
// Second part
function example(error, stdout, stderr, mapping) {
  const actions = ... // See above

  const selectedAction = actions
    .filter(action => action.condition())
    .reduce((accumulated, currentAction) => {
      // By design, reduce will only keep the last match when the accumulator 
      // is ignored, so the order inside the actions array has significance.
      return currentAction.action;
    }, function() {
      // Else clause
      console.log('Result from some process with mapping and stdout');
    });
  selectedAction();
}

example(null, null, 'A problem occurred'); // Logs "Not found"
example(new Error()); // Logs "Error executing"
example(null, null, null, null); // Logs "Config invalid"
example(null, '', null, []); // Logs "No result"
example(null, 'Foo', null, []); // Logs "Result from some process with mapping and stdout"
``` 

A working example can be found in [this fiddle](https://jsfiddle.net/mdvanes/367q8p35/).

This shows how to use functional operators to reduce cyclomatic complexity for an `if else` condition. Do keep in mind
 it may not be beneficial for performance. For instance, do not declare the action array inside of the function as in 
 the example, as it would redeclare the array each time the function is executed. Another improvement would be to stop
  iteration in filter/reduce
 as soon as a matching action was found. 

Also note that the example with the `if else` condition itself is quite readable, so it will not be worth the trade off of 
refactoring to resolution through an array of objects in this case. 