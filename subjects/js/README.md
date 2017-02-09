# JavaScript

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [JavaScript defines **6 types**](#javascript-defines-6-types)
- [JavaScript is a **dynamic** language](#javascript-is-a-dynamic-language)
- [There are **2 scopes** for variables: the (evil) global scope and the function scope](#there-are-2-scopes-for-variables-the-evil-global-scope-and-the-function-scope)
- [JavaScript supports **first-class functions**](#javascript-supports-first-class-functions)
- [Objects are **dynamic bags** of properties](#objects-are-dynamic-bags-of-properties)
- [Array are **objects**](#array-are-objects)
- [The language has no support for **classes**](#the-language-has-no-support-for-classes)
- [Every object **inherits** from a **prototype** object](#every-object-inherits-from-a-prototype-object)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## What is JavaScript?

<!-- slide-front-matter class: center, middle -->

> JavaScript is a high-level, **dynamic**, **untyped**, and interpreted programming language.
> Alongside HTML and CSS, JavaScript is one of the three core technologies of World Wide Web.

> JavaScript is **prototype**-based with **first-class functions**, making it a multi-paradigm language, supporting **object-oriented**, **imperative**, and **functional** programming styles.



### JavaScript is still evolving

It has been standardized in the [ECMAScript][es] language specification.

<img src='images/timeline.png' width='100%' />

**ECMAScript 2015** (also known as ECMAScript 6 or ES6) added iterators and for/of loops, Python-style [generators][js-generators] and generator expressions, [arrow functions][js-arrow-functions], binary data, typed arrays, collections (maps, sets and weak maps), [promises][js-promise], number and math enhancements, reflection, and [proxies][js-proxy].

**ECMAScript 2017** (ES8) will add [async/await functions][js-async] and [shared memory and atomics][js-shared-memory].



### JavaScript ES6 support

There are features from ES6 that are **not yet fully supported** on all browsers.

In client-side code running in the **browser**, you should stick with **ES5** or use a JavaScript compiler like [Babel][babel] to turn your ES6+ code into compatible ES5 code before releasing it.

In server-side code running with the latest **Node.js** versions, all **ES6** features are supported except for [imports][js-imports].



## JavaScript types

<!-- slide-front-matter class: center, middle -->



### JavaScript has 6 primitive data types

<!-- slide-column 70 -->

```js
var aString = "HEIG-VD";
var aNumber = 3.12;
var aBoolean = true;
var nullValue = null;
var undefinedValue;
var aSymbol = Symbol('foo');

console.log(typeof aString); // "string"
console.log(typeof aNumber); // "number"
console.log(typeof aBoolean); // "boolean"
console.log(typeof nullValue); // "object"
console.log(typeof undefinedValue); // "undefined"
console.log(typeof aSymbol); // "symbol"
```

<!-- slide-column 30 -->

The types are:

* String
* Number
* Boolean
* Null
* Undefined
* Symbol (**ES6**)

<!-- slide-container -->

* We'll talk about symbols later.
* Note that `null` is a type, but `typeof null === object`.
  This is a [remnant][js-typeof-null] from the first version of JavaScript.



### JavaScript has **dynamic** objects

<!-- slide-column 60 -->

```js
// Let's create an object
var person = {
  firstName: 'John',
  lastName: 'Doe'
};

// We can dynamically add properties
person.gender = 'male';

var property = 'zip';
person[property] = 1446;

// And delete them
delete person.firstName;

// And list them
for (var key in person) {
  console.log(key + ': ' + person[key]);
}
```

```txt
lastName: John
gender: male
zip: 1446
```

<!-- slide-column 40 -->

Objects have **no class**, they are **dynamic bags** of properties.

Every object has a **different list of properties**.



### Array are **objects**

They are list-like objects with numeric keys.

```js
// Let's create an array
var fruits = [ 'apple', 'pear' ];

console.log(typeof fruits); // "object"

// Iterate over it
for (var i = 0; i < fruits.length; i++) {
  console.log('fruit ' + i + ' is ' + fruits[i]);
}

// fruit 0 is apple
// fruit 1 is banana
```

We'll learn more about arrays later.



### JavaScript is **untyped**

Values have a type, but **variables don't**.
When you declare a variable, you don't specify a type.

```js
var aVariable = "aString";
console.log(typeof aVariable); // "string"

aVariable = 3.12;
console.log(typeof aVariable); // "number"

aVariable = true;
console.log(typeof aVariable); // "boolean"

aVariable = [ 1, 2, 3 ];
console.log(typeof aVariable); // "array"

aVariable = {
  aProperty: "aValue"
};
console.log(typeof aVariable); // "object"
```

The type can **change** over time.



## JavaScript supports [first-class functions][first-class-functions]

<!-- slide-front-matter class: center, middle -->

> "A programming language is said to have first-class functions if it treats functions as first-class citizens.

> Specifically, this means the language supports **passing functions as arguments** to other functions, **returning them** as the values from other functions, and **assigning them to variables** or **storing them in data structures**."



### Storing functions in variables or data structures

A JavaScript function isn't a special construct linked to a class like in Java.
It can be stored in variables like any other value.

```js
// Store a function in a variable
var hello = function(name) {
  console.log('Hello ' + name + '!');
};

// The hello variable now holds a function
console.log(typeof(hello)); // "function"

// You can call it
hello('World'); // "Hello World!"

// Store a function as an object's property
var anObject = {
  aProperty: function() {
    return 42;
  }
};

// That property now holds a function as its value
console.log(typeof(anObject.aProperty)); // "function"

var value = anObject.aProperty();
console.log(value); // 42
```



### Returning functions from a function

```js
// Let's define a function that returns a function
function makeSquareFunction() {
  return function(n) {
    return n * n;
  };
}

// By calling it, we get a function
var square = makeSquareFunction();
console.log(typeof(square)); // "function"

var result = square(5);
console.log(result); // 25
```

Note that functions can be **anonymous** (i.e. they have no name),
like the function returned from `makeSquareFunction`:

```js
return function(n) {
  return n * n;
};
```



### Passing functions as arguments

A function can take another function as an argument.

```js
// Let's define a couple of arithmetic function
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Define a function that takes two numbers and a 
// and a function to apply to those numbers
function compute(a, b, operation) {
  // Call the operation function with the two numbers
  var result = operation(a, b);
  // Return the result
  return result;
}

// We can pass "add" to the "compute" function
var value = compute(2, 4, add);
console.log(value); // 6

value = compute(2, 4, multiply);
console.log(value); // 8
```



### Functional programming

These properties of functions enable powerful functional programming patterns:

```js
// Define an array of people objects
var people = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'John', lastName: 'Smith' },
  { firstName: 'Deborah', lastName: 'Smith' }
];

// Define a function that takes a person and returns their last name
function getName(person) {
  return person.name;
}

// The "map" function of arrays returns an array of the same size,
// but with each element "mapped" or "transformed" using the provided
// function
var lastNames = people.map(getName);

// We transformed an array of people into an array of last names
console.log(lastNames); // [ "Doe", "Smith", "Smith" ]
```



## Variables

<!-- slide-front-matter class: center, middle -->



### Defining variables

There are three ways to define a variable in JavaScript:

```js
// ES5
var aString = 'foo';

// ES6
let aNumber = 42;
const aBoolean = true;
```

Note that `var` always works, but `let` and `const` are only available in **ES6** and later versions.



### Dynamic or constant variables

Variables declared with `var` or `let` are dynamic.
Their value can **change** over time.

```js
var aString = 'foo';
let aNumber = 24;

console.log(aString); // "foo"
console.log(aNumber); // 24

aString = 'bar';
aNumber = 25;

console.log(aString); // "bar"
console.log(aNumber); // 25
```

Variables declared with `const` cannot change.
They are **constants**:

```js
const theMeaningOfLife = 42;

theMeaningOfLife = 43; // TypeError: Assignment to constant variable.
```



### The function scope

Variables declared with `var` in a function are visible **everywhere in that function**.
Note that they are **NOT block-scoped** like in most languages.

```js
function logThings(things) {

  var numberOfThings = things.length;

  for (var i = 0; i < numberOfThings; i++) {
    var thing = things[i];
    console.log(thing);
  }

  console.log('Number of things: ' + numberOfThings);
  console.log('Last thing: ' + thing);
  console.log('Iterator: ' + i);
}

logThings([ 'apple', 'banana', 'pear' ]);

// "apple"
// "banana"
// "pear"
// "Number of things: 3"
// "Last thing: pear"
// "Iterator: 3"
```



### The block scope

The `let` and `const` keywords introduced in **ES6** create **block-scoped** variables,
only visible in the block, statement or expression on which they is used.

```js
function logThings(things) {

  const numberOfThings = things.length;

  for (let i = 0; i < numberOfThings; i++) {
    let thing = things[i];
    console.log(thing);
  }

  console.log('Number of things: ' + numberOfThings);
  console.log('Last thing: ' + thing);
}

// "apple"
// "banana"
// "pear"
// "Number of things: 3"
// ReferenceError: thing is not defined
```

It is recommended to use them instead of `var` in **ES6-compatible** environments.



### The (evil) global scope

Variables declared with `var` outside of any function are **global variables**, accessible anywhere.

```js
// A global variable
var name = 'World';

function hello() {

  // We can use "name" even though it's not an argument
  // of the function, because it's global
  console.log('Hello ' + name + '!');

  // It's a bad idea to use them because anyone can
  // change their value and mess up your program
  name = 'Bob';
}

hello(); // "Hello World!"
hello(); // "Hello Bob!"
```

You should **almost never use them**.



#### When it's okay to use the global scope

In an **HTML page**, all loaded scripts share the same global scope.

In that context, ES5 libraries expose global variables so that your code can use them.
For example, jQuery provides the **$** global variable for easy access.

In a **Node.js script**, the global scope is limited to the file you're in, so it's okay to use it.

If you're not writing either one of those, just **don't use global variables**.



#### Oops, global scope

If you forget the `var`, `let` or `const` keyword, JavaScript will not complain.
It will simply consider the variable global.

```js
// Let's declare a global variable
var i = 42;

// And a function that logs each thing in the passed array
function logThings(things) {
  // Oops, we forgot the "var" or "let"
  for (`i = 0`; i < things.length; i++) {
    console.log(things[i]);
  }
}

var fruits = [ 'apple', 'banana', 'pear' ];
logThings();

// Oops, we've modified something outside of the function
console.log(i); // 2
```

Just **don't do it**.



## JavaScript has **prototypal inheritance**

<!-- slide-front-matter class: center, middle -->



### ES5 has no support for **classes**

TODO: ES6 classes

There are 3 ways to create objects.

```js
// Create an object with a literal
var person = {
  firstName: "olivier",
  lastName: "liechti"
};

// Create an object with a prototype
var child = Object.create(person);

// Create an object with a constructor
var child = new Person("olivier", "liechti");
```

* **class** is a reserved word in JavaScript, but it is not used in the current version of the language (reserved for the future).
* A **constructor** is a function like any other (uppercase is a coding convention).
* It is the use of the **new** keyword that triggers the object creation process.



### Every object **inherits** from a **prototype** object

TODO: add graph

```js
// Prints "Skywalker" on the console
console.log(child.lastName);
```

* Every object inherits from a prototype object. It **inherits and can override** its properties, including its methods.
* Objects created with object literals inherit from **Object.prototype**.
* When you access the property of an object, JavaScript **looks up the prototype chain** until it finds an ancestor that has a value for this property.



## TODO

* Strings: single quotes, double quotes, template literals
* [Symbols][js-symbol]

  The data type "symbol" is a primitive data type having the quality that values of this type can be used to make object properties that are anonymous.
  Every symbol value returned from Symbol() is unique.  A symbol value may be used as an identifier for object properties; this is the data type's only purpose.



## Resources

* A re-introduction to JavaScript
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
* Inheritance and the prototype chain
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
* Introduction to Object-Oriented JavaScript
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
* JavaScript objects in detail
  http://javascriptissexy.com/javascript-objects-in-detail



[babel]: http://babeljs.io
[es]: https://en.wikipedia.org/wiki/ECMAScript
[first-class-functions]: https://en.wikipedia.org/wiki/First-class_function
[js-arrow-functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[js-async]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[js-generators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
[js-imports]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[js-promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[js-proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[js-shared-memory]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
[js-typeof-null]: http://www.2ality.com/2013/10/typeof-null.html
[js-symbol]: https://developer.mozilla.org/en-US/docs/Glossary/Symbol