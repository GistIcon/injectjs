#injectjs

a lightweight, small, high level dependency injector with support for object lifetime management

> This software is still not fully baked, at version 0.2, and missing a wealth of functionalities for what constitutes a fully fledged dependency injector

With that said, I expect to have a fully functional, fully tested, fully decoupled and fully documented version in the next couple of Months. I will greatly appreciate help from early adopters and will gladly embrace feature requests and bug reports uploaded to the issue tracker.

### Table of contents

1. [Why InjectJS](#intro)
2. [Installation](#install)
3. [Usage](#use)
	1. [The Old Way](#use-old)
	2. [InjectJS Hello World](#use-hello-world)
	3. [Foo and Bar at a Party](https://github.com/nstraub/injectjs/tree/master/Samples/FooBarParty/README.md)
4. [Roadmap](#road)
5. [API reference](#api)
	1. [Registration Methods](#registration)
		- [injector.registerType](#registration-type)
		- [injector.registerProvider](#registration-provider)
		- [injector.registerMain](#registration-main)
	2. [Injection Methods](#injection)
		- [injector.get](#injection-get)
		- [injector.inject](#injection-inject)
		- [injector.run](#injection-run)
	3. [Utility Methods](#utility)
		- [injector.getType](#utility-gettype)
		- [injector.extend](#utility-extend)
		- [injector.noConflict](#utility-noConflict)
		- [injector.hide](#utility-hide)
		- [injector.clearState](#utility-clearState)
	4. [Test Helpers](#testing)
		- [injector.registerFake](#testing-fakes)
		- [injector.removeFake](#testing-fakes-remove)
		- [injector.flushFakes](#testing-fakes-flush)
		- [injector.harness](#testing-harness)

## <a name="intro"></a> Why InjectJS?

Until now, the only way to inject dependencies into JavaScript objects has been by manually instantiating them and passing them into the object's constructor, property or method. This creates a load of overhead and boilerplate "new keyword" code. Add to that the fact JavaScript is dynamically typed and you have no real way of knowing whether changing the signature of an object's constructor, property or method will cause an error in the rest of your code (unless, of course, you keep track of every place your recently changed object is used and how). You (usually) won't even get a runtime error since JavaScript doesn't complain at all when you pass a function more (or less) arguments than it has parameters. InjectJS aims to get rid of all this. It allows you to wire up your dependencies beforehand and handle instantiation of all your JS objects.

### What about RequireJS?

RequireJS is a wonderful modularization framework, but it is not a dependency injection framework. From my (admittedly limited) experience with RequireJS, what I understand it does is load javascript files as modules which can then be required from other modules. It does a wonderful job at solving the "everything must be global" problem that haunts JavaScript from it's beginnings. What RequireJS doesn't (and shouldn't!) do, is provide high level dependency injection and object lifetime management, and that's where InjectJS comes in


> Note: InjectJS includes a shim to integrate into RequireJS, and in the near future I expect to use requireJS (along with Grunt) to modularize InjectJS's code into smaller, less complex packages (as opposed to the one large file it is now).

# <a name="install"></a>Installation

simply download inject.registration.js, inject.providers.js, inject.js from the source tree and include it into your html page(s), in that order.

> **Note:** for version 0.2, the code was separated into these three files, to make it more readable. version 0.3 will include a grunt build process to merge and minify all the code into a single inject.js file (and an inject.min.js file, of course).

> **Note:** InjectJS depends on Lodash ([https://lodash.com/](https://lodash.com/)). You can probably use it with underscore as well, but the framework is developed and test using Lodash, so there are no assurances.

## Tests

InjectJS comes with a test suite that fully unit-tests the code. to run it, do the following:

1. clone the repository (or download and extract the auto-generated zip)
2. run npm install
3. run bower install
4. the karma config file is located in Tests/karma.conf.js

# <a name="use"></a>Usage 

The main idea behind InjectJS is getting rid of the new keyword in your code. This may seem a controversial statement and impossible to achieve, but it's quite possible and will make your code leaner and more maintainable, or at the very least, less frustrating.

<a name="use-old"></a>Let's start with a Hello World app. Normally you would make a new function called mouth, instantiate somewhere it and then call it:
 
    function Mouth() {
        this.say = function (what) {
            alert(what);
        }
    }
    
    var mouth = new Mouth();
    mouth.say('hello world!');
    
There are a few problems with this approach:

1. Mouth is global
2. mouth is global
3. you need to manually instantiate it to use it

###<a name="use-hello-world"></a> The InjectJS Way

Ok, so one global function and one global variable aren't much to worry about, but this is just the hello world example. With InjectJS you start by registering Mouth as a type:


     
    injector.registerType('mouth', function () {
        this.say = function (what) {
            alert(what);
        }
    });
    
Marvellous... (if only markdown had a descriptor for sarcasm). One good thing happened here though. You now have a mouth type that is no longer global! Next step is to use this newly created type somewhere in your code... how about a main method? you know... the one that runs when the app starts, inside `$(function() {})` or somewhere similar:
 
    injector.registerMain(function (mouth) {
        mouth.say('hello world!');
    });
    
    $(function () {
        injector.run(); // runs the function registered with registerMain
    });
    
As of now, we've gotten rid of the globals, which isn't much of a feat in and of itself, but still noteworthy. More importantly, we no longer have to manually instantiate `Mouth` to use it!

So now, what if you want to hide the original `Mouth` so it is no longer global? Easy, right?

    (function () {
        function Mouth() {
	        this.say = function (what) {
	            alert(what);
	        }
        }
        
        var mouth = new Mouth();
        mouth.say('hello world!');
    }());
    
Ok, great, now we've just solved two of the three initial problems there were with this code (remember you're still manually instantiating). No need for InjectJS then.
So let's complicate things a bit...

> To see the rest of this example, please head to [foo-bar-party](https://github.com/nstraub/injectjs/tree/master/Samples/FooBarParty/README.md). to see a more "real world" use case scenario, check out the code at [https://github.com/nstraub/snake](https://github.com/nstraub/snake) (still unpolished, but makes heavy use of the functionalities currently available in this framework)`


# <a name="road"></a>Roadmap

The current version, 0.2, has the following features:

- [registering types](#registration-type)
- [registering providers](#registration-provider)
- [instantiating types](#injection-get)
- [running providers within a context](#injection-get)
- [passive providers](#registration-type-provider)
- [provider parameters (aka ad hoc dependencies)](#injection-get-adhoc) 
- [injecting types into methods](#injection-inject)
- Singleton, Transient and State lifetimes.
- test facilities: [fakes](#testing-fakes) and [harnesses](#testing-harness)

To sum it up, it provides basic dependency injection capabilities and the ability to use these dependencies in a test environment.

So here are the next planned releases:

- 0.3 Code modularization and Grunt build process.
- 0.4 Root and parent lifetimes.
- 0.5 Preprocessor for dealing with minifiers.
- 0.6 abstract types
- 0.7 Property injection.
- 0.8 Method injection (currying).


# <a name="api"></a>API reference

The syntax for this framework takes from and expands the syntax used by AngularJS's injector. you register a function with a name as first argument, and then an array of dependencies with the last element being the actual function you want to register as the dependency. 

## <a name="registration"></a> Registration Methods 

### <a name="registration-type"></a>injector.registerType

>Allows you to register a dependency which can be instantiated by the injector and injected into other registered dependencies and the main function.

**signatures**

*registerType(name, type, [lifetime = 'transient'], [provider]) : void*  
*registerType(name, type: [2-\*], [lifetime = 'transient'], [provider]) : void*

**Parameters**
    
- *name (string): mandatory*. The name of the type being registered.
- *type (function|array): mandatory*.
   - When type is a function, its dependencies are inferred from its parameter names. 
   - When type is an array, all items except the last are dependency names for the type, and the last is the actual type, which will receive all the aforementioned dependencies on instantiation.

> **Note**: type **MUST** be an array if you plan to minify your code 

- *lifetime (string): optional, default transient*. the type's lifetime, currently supported are *singleton* (only one instance of the type will exist throughout the applications lifecycle), *state* (one instance exists until the application's state changes), and *transient* (every time the type is referred, a new instance is created).
- <a name="registration-type-provider"></a>*provider (string): optional.* If present, `type` will be passed through the given provider before being injected. It is called `passive provider` because you don't need to actively inject it anywhere.

> **Note:** for now, if you plan on using the default, `transient` lifetime and want to pass in a passive provider, you either need to explicitly specify `'transient'` or pass in `null` as your third parameter.
  
**example**
  
    injector.registerType('my-test-type', function () { 
        this.hello = 'world' 
    }, 'singleton'); // only one instance will ever be created.

    injector.registerType('message-logger', function (message) { 
        this.print = function () { 
          console.log('hello, ' + message.hello) 
        }
    }); will always create a new instance on injection
    
### <a name="registration-provider"></a>injector.registerProvider

Allows you to register a provider which can be instantiated by the injector and injected into other registered dependencies and the main function. Currently the only difference between this function and registerType is providers are run directly, and aren't newed. in the future, they'll receive info on the context under which they're being executed, as well as any extra parameters passed when they're called.

**signatures**

*registerProvider(name, provider) : void*  
*registerProvider(name, provider: [2-\*]) : void*

**Parameters**
    
- *name (string): mandatory*. The name of the type being registered.
- *provider (function|array): mandatory*. 
   - When provider is a function, its dependencies are inferred from its parameter names.
   - When provider is an array, all items except the last are dependency names for the provider, and the last is the actual provider, which will receive all the aforementioned dependencies on instantiation.
  
> **Note**: type **MUST** be an array if you plan to minify your code 


    
### <a name="registration-main"></a>injector.registerMain

Allows you to register the provider that gets invoked when `injector.run()` is called. shorthand for `injector.registerProvider('main', [dependencies... function () {}]);`

**signatures**

*registerMain(provider) : void*  
*registerMain(provider: [2-\*]) : void*

**Parameters**
    
- *provider (function|array): mandatory*. 
   - When provider is a function, its dependencies are inferred from its parameter names.
   - When provider is an array, all items except the last are dependency names for the provider, and the last is the actual provider, which will receive all the aforementioned dependencies on instantiation.
  
> **Note**: type MUST be an array if you plan to minify your code 


## <a name="injection"></a>Injection Methods

### <a name="injection-get"></a>injector.get

gets a registered type or provider. Not recommended for use other than to replace the new keyword while refactoring legacy code

**signatures**
*get(name, [context], [ad hoc dependencies]) : object*

**parameters**

- *name(string|array|function): mandatory.* 
	- If string, the name of the type you want to get. 
	- If function, the function you wish to get. its dependencies are inferred from its parameter names.
	- If array, an array of dependencies followed by the function you wish to get. If you supply a name or a function, it will be instantiated as a provider, calling it directly, without the new keyword.
- *context (object): optional.* If a context is passed it will be used as the value of `this` on the invoked provider.
- <a name="injection-get-adhoc"></a>*ad hoc dependencies (object): optional.* An array of dependencies to be passed right before a provider is invoked. Useful for providers that require information specific to the environment where/when they are being invoked. Dependencies in the passed object supersede any dependencies defined via the register methods.

> **Note:** `context` is only relevant if you're planning on invoking a provider. when instantiating a type, this parameter has no use (unless the type specifies a passive provider, in which case said provider will run using `context` as `this`).

> **Note:** ad hoc dependencies are available only for providers (for now).
  
> **Note:** type **MUST** be an array if you plan to minify your code 


**example**

    var logger = injector.get('message-logger');
    logger.print(); // logs 'hello, world' to the console
    
### <a name="injection-inject"></a>injector.inject

injects all dependencies into the requested type and returns a provider for said type. Useful when instantiating the same object multiple times, for currying event callbacks, and for testing.

**signatures**
*inject(name) : object*

**parameters**

- name(string|array|function): mandatory. 
	- If string, the name of the type you want to inject. 
	- If function, the function you wish to inject. its dependencies are inferred from its parameter names.
	- If array, an array of dependencies followed by the function you wish to inject. If you supply a name or a function, it will be instantiated as a provider, calling it directly, without the new keyword.
  
> **Note**: name **MUST** be an array if you are passing in an anonymous dependency and plan to minify your code 


**examples**

    var logger_provider = injector.inject('message-logger'),
        first_logger = logger_provider(),
        second_logger = logger_provider(); // much faster to instantiate, since the provider has already been built and is ready to use
        
    first_logger.print(); // logs 'hello, world' to the console
    second_logger.print(); // also logs 'hello, world' to the console
    
    $('#some-element').click(injector.inject(function (logger) {
        // this code will be run when the event is called, and logger will be available to log anything that has something to do with the event
        // for now, the event object won't be available, so its use is limited in this context. This functionality will be introduced in 0.2
    }));
    
Jasmine test:

    injector.registerType('logger', function () {
        this.log = function (message) {
            if (dump) {
                dump(message);
            } else {
                console.log(message);
            }
        }
    }, 'singleton');
    
    describe 'you can inject dependencies here and not worry about setup and teardown', () ->
        beforeEach(injector.inject(function (logger) {
            logger.log('starting test')
        }));
        
        afterEach(injector.inject(function (logger) {
            logger.log('ending test')
        }));
        

### <a name="injection-run"></a>injector.run

runs the main function.

**signatures**

*run([context], [ad hoc dependencies]) : void*

**parameters**

- *context (object): optional.* If a context is passed it will be used as the value of `this` on the `main` provider.
- *ad hoc dependencies (object): optional.* An array of dependencies to be passed right before a provider is invoked. Useful for providers that require information specific to the environment where/when they are being invoked. Dependencies in the passed object supersede any dependencies defined via the register methods.

> **Note:** `context` is only relevant if you're planning on invoking a provider. when instantiating a type, this parameter has no use (unless the type specifies a passive provider, in which case said provider will run using `context` as `this`).

> **Note:** ad hoc dependencies are available only for providers (for now).

**throws error when no main function is registered**

## <a name="utility"></a>utility methods

### <a name="utility-gettype"></a>injector.getType

gets the type of requested dependency. Useful for checking instanceof and testing constructors for singleton lifetime types (other uses should be avoided).

**signature**

*getType(name) : Type|null*

**parameters**

- *name (string): mandatory*. name of the dependency for which you wish to get the type.

**returns**

the type or null if no type is found.

### <a name="utility-extends"></a>injector.extend

Extends a parent object onto a child object. Like calling `Child.prototype = new Parent()` but ensuring parent gets all its dependencies correctly.

**signature**

*injector.extend(parent, child)*

**parameters**

- *parent (string): mandatory.* The name of the type you wish to extend. It must be registered previously on the injector.
- *child (function): mandatory.* The child function you wish to have the parent extend.

> **Note:** This functionality only provides the most basic of object extension. If you wish to override methods from the parent on the child object, you need to call extend before defining the object's overridden methods on the prototype. 

### <a name="utility-noConflict"></a>injector.noConflict

Restores the old value of window.injector

**signature**

injector.noConflict()

### <a name="utility-hide"></a>injector.hide

De-registers `hashchange` event for clearing state lifetime `types`.

> **Note:** by default, InjectJS assumes your application is changing state (i.e. moving to another area of the application) every time the hash portion of the URL is changed. While this may be the default behaviour for most web sites, and is encouraged by most routers (like `Backbone`'s `routes`, `simrou`, `AngularJS ng-route`'s default behaviour), more and more sites are adopting HTML5 pushstate, and there are quite a few SPA's which don't use the hash at all. for those sites, you should call this method and then register a handler for your particular state change that calls `injector.clearState`

**signature**

injector.hide()

### <a name="utility-clearState"></a>injector.clearState

Clears all `state` lifetime instantiated types.

**signature**

injector.clearState()

## <a name="testing"></a>Test Helpers

InjectJS currently provides some features to aid in unit testing (tested with jasmine only)

### <a name="testing-fakes"></a>injector.registerFake

registers a type as a fake. 

**signatures**
signatures are identical to [registerType](#registration-type)

### <a name="testing-fakes-remove"></a>injector.removeFake

removes a fake from the fakes collection.

**signature**

*injector.removeFake(name)*

**parameters**

- *name (string): mandatory*. name of the fake you want to remove.

### <a name="testing-fakes-flush"></a>injector.flushFakes

removes all fakes from the fakes collection. Identical to `injector.fakes = {}`

**signature**

*injector.flushFakes()*

### <a name="testing-harness"></a>injector.harness

identical to [inject](#injection-inject), but injects dependencies lazily (inject is eager)
 
**example**

    injector.registerType('logger', function () {
        this.log = function (message) {
            if (dump) {
                dump(message);
            } else {
                console.log(message);
            }
        }
    }, 'singleton');

    describe('running tests with a harness', function () {
        beforeAll(function () {
            injector.registerFake('logger', function () {
                this.log = sinon.spy();
            });
        });    
        
        afterAll(function () {
            delete injector.fakes.logger;
            
        describe('using inject'), injector.inject(function (logger) {
            it('passes the actual logger type', function () {
                expect(logger instanceof injector.getType('logger')).toBe true //fails because getType returns the fake
            });
        });
        
        describe('using harness'), injector.harness(function (logger) {
            it('passes the fake logger type', function () {
                expect(logger instanceof injector.getType('logger')).toBe true //passes because logger is the fake type
            });
        });
    });
