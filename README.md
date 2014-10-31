# README #

Backbone Ribs is an extension project which adds an additional layer of functionality to Backbone that simplifies creation of basic types of views, adds more granular JSON handling and separates concerns further by separating Views from Regions (see Views and regions below for details) which enables proper garbage handling without having to roll it all yourself.

### Common Extensions ###
Many of the Ribs versions of the core Backbone objects listed below are extended by implementing one or more of the following extensions.

#### Attribute Checker ####
The Attribute Checker extension is used to simplify attribute value checking. It offers methods to extend models and collections that allow for less verbose validation code to be written either for validation methods or when attributes are required to be passed in on instantiation.
     
For example, when checking attribute values in your model rather than writing this in traditional Backbone...
```
#!javascript
if (attributes === undefined || attributes === null || attributes.myAttr === undefined || attributes.myAttr === null) {
	throw new Error('The myAttr attribute is required.')
};
```
... you can now write this instead...
```
#!javascript
if (this.isNullAttribute(attributes, 'myAttr')) {
	throw new Error('The myAttr attribute is required.')
};
```
The attribute checker exposes the following methods within any of the Objects that are extended by it...

* isNullAttribute()
* isNullOrEmptyAttribute()
* isNullOrFalseAttribute()

#### JSON Formatter ####
The traditional toJSON() method is limited to transforming the current object. Overriding the toJSON() method itself is generally not a good idea as some Backbone structures can become infinitely nested, although in some cases you want to convert nested Backbone objects to pure JSON for template rendering, for example. The JSON Formatter exposes a single 'toJSONRecursive()' function to recursively convert models and collections to raw JSON.
     
The function takes an optional 'level' parameter which indicates how far down the object hierarchy to look for data to transform. This can be as high as you like without falling over, but it's recommended to keep this level value right for the expected data structure, as checking for the presence of additional levels requires additional processing loops.
     
If no level parameter is provided then the first level of children are processed by default. The level relates to the initial Model structure, so the collection itself constitutes a level.

### Core Ribs Objects ###
Ribs currently exposes the following primary objects from Backbone object in an extended form...

#### Ribs.Model ####
Any class extending Ribs.Model should ensure to call the replaced methods as follows...
```
#!javascript
Ribs.Model.prototype.initialize.call(this, attributes, options);
```
Every Ribs based model has a name to help identify it. The name can be passed in as an option to the constructor and will be stored within the model object or can be specified when defining the child class. A Ribs model applies a default validity check that will log any validation errors to the console and throw them up the tree for handling as needed.
     
EVENTS:

* 'fetching': Triggered whenever any model's fetch method has started.
        
IMPLEMENTS:

* Attribute Checker: Adds the functionality of the extension to allow quick method calls to check the null / undefined state of attributes - allows far more concise validation code.
* JSON Formatter: Adds functionality to support recursive JSON transformations of model / collection hierarchies.

#### Ribs.Collection ####
Any class extending Ribs.Collection should ensure to call the replaced methods as follows...
```
#!javascript
Ribs.Collection.prototype.initialize.call(this, attributes, options);
```
Every Ribs based collection has a name to help identify it. The name can be passed in as an option to the constructor and will be stored within the collection object or can be specified when defining the child class. A Ribs model applies a default validity check that will log any validation errors to the console and throw them up the tree for handling as needed.
     
EVENTS:

* 'fetching': Triggered whenever any collection's fetch method has started.
        
IMPLEMENTS:

* Attribute Checker: Adds the functionality of the extension to allow quick method calls to check the null / undefined state of attributes - allows far more concise validation code.
* JSON Formatter: Adds functionality to support recursive JSON transformations of model / collection hierarchies.

#### Ribs.Region ####
Any class extending Ribs.Region should ensure to call the replaced methods as follows...
```
#!javascript
Ribs.Region.prototype.initialize.call(this, attributes, options);
```
Region implementations generally tend to be extremely lightweight, as the Backbone Ribs code here does most of what is required.

Although Backbone allows much variation; best practice when using Ribs is to look at a 'View' as being responsible for itself in that it's a piece of contained markup that is NOT attached to anything on a page. In a Ribs based App containers on a page are wrapped by Regions instead and the regions are responsible for then rendering a view into the container that they represent. SO the basic rule is...

* Is it new markup? = View
* Is the markup a container that's already present in a page or generated by another view? = Region

Every Ribs based region has a name to help identify it. The name can be passed in as an option to the constructor and will be stored within the region object or can be specified when defining the child class.
          
Every Ribs based view has an optional sectionName to add to navigation if needed. The sectionName can be passed in as an option to the constructor and will be stored within the view object or can be specified when defining the child class.
          
The 'spinner' property is expected to be replaced by an extending child class.
     
EVENTS: A Ribs region binds to the 'rendered' and 'rendering' events of it's currentView object. This allows the region to seperate it's two key functions, firstly cleaning up any old views that may be contained within the region (see 'View Lifecycle' below) and then placing the rendered view into it's container once the 'rendered' event has  been triggered. While 'rendering' the view will show a spinner.
     
VIEW LIFECYCLE: One of the biggest issues in Backbone revolves around the View lifecycle. Ribs views maintain their bindings and have specific methods to dispose all of the resources they use. A Ribs region will clear up any views it contains before allowing a new one to be attached, calling the 'trash' method on the view to clean up any used resources. It also has it's own trash method that will clear it's currentView and optionally dispose of itself.

#### Ribs.View ####
Any class extending Ribs.View should ensure to call the replaced methods as follows...
```
#!javascript
Ribs.View.prototype.initialize.call(this, attributes, options);
```
The exception to this is the 'render' method. Instead, any extending classes should ensure to trigger the 'rendered' and 'rendering' events during the render lifecycle to ensure thet region integration works as expected (see 'Ribs.Region', above).
          
Every Ribs based view has a name to help identify it. The name can be passed in as an option to the constructor and will be stored within the view object or can be specified when defining the child class.
          
Every Ribs based view has an optional sectionName to add to navigation if needed. The sectionName can be passed in as an option to the constructor and will be stored within the view object or can be specified when defining the child class.
          
Every Ribs based view has a template to use for rendering. The template can be passed in as an option to the constructor and will be stored within the view object or can be specified when defining the child class.

STATE MANAGEMENT: The 'stateRequired' flag allows the view to indicate whether it's rendering requires any state variables to be set before rendering can commence. The containing region can then utilise this information to asynchronously hold rendering until the state variables are loaded.
     
RESPONSIVE DESIGN: The 'resetStyleState' method is a no-op that is designed to be wired in across the app to support any view level changes that need to be applied as a result of user change generating a responsive design change (such as a screen resize).
     
EVENTS:

* 'rendering': Although not specified on the base BackboneRibs.View class, this event should always be fired by any child class at the point that the render method is called IF the rendering process involves any async operations. If all operations are quick, and synchronous, the event is unnecessary.
* 'rendered': This event should be triggered after all view rendering has completed. This is important, as it allows contaning master views (or 'regions' as they are called in Ribs parlance) to respond. This trigger may be attached to a success or error callback where data retrieval is required as part of the rendering process.
     
VIEW LIFECYCLE: One of the biggest issues in Backbone revolves around the View lifecycle. Ribs views maintain their bindings and have specific methods to dispose all of the resources they use. When used in conjunction with a Ribs Region, to represent the holding area for the view, these methods ensure that 'orphan views' within a region are always removed when not used anymore preventing 'Zombies' and memory leaks. If you choose to use the views without the wrapping regions, then managing the Zombies falls to the consuming code, but the dispose and trash methods are still invaluable.
     
BEST PRACTICE: Although Backbone allows much variation; best practice when using Ribs is to look at a 'View' as being responsible for itself in that it's a piece of contained markup that is NOT attached to anything on a page. In a Ribs based App containers on a page are wrapped by Regions instead and the regions are responsible for then rendering a view into the container that they represent. SO the basic rule is...

* Is it new markup? = View
* Is the markup a container that's already present in a page or generated by another view? = Region

#### Ribs.SimpleView ####
Any class extending Ribs.SimpleView should ensure to call the replaced methods as follows...
```
#!javascript
Ribs.SimpleView.prototype.initialize.call(this, attributes, options);
```
The exception to this is the 'render' method. Instead, any extending classes should ensure to trigger the 'rendered' and 'rendering' events during the render lifecycle to ensure thet region integration works as expected (see 'Ribs.Region', above).
   
USAGE: Some views are very basic - They have a template and it's rendered. There's no data to worry about. The Ribs Simple view is for just those cases, where a simple extension or instantiation with a template is all that is needed.

#### Ribs.SecureView ####
Any class extending Ribs.SecureView should ensure to call the replaced methods as follows...
```
#!javascript
Ribs.SecureView.prototype.initialize.call(this, attributes, options);
```
The exception to this is the 'render' method. Instead, any extending classes should ensure to trigger the 'rendered' and 'rendering' events during the render lifecycle to ensure thet region integration works as expected (see 'Ribs.Region', above).
   
It is recommended that the app developer creates an app specific version of this class and replaces the following default methods with app specific implementations...

* getLoggedInUserData() (Until this is done 'isSecured' will always fail).
* applySecureLoginPrompt()
* applyTimedOutSecureLoginPrompt()

This could look something like this...
```
#!javascript
MyAppRibs.SecureView = window.Ribs.SecureView.extend({
    initialize: function(options) {
        window.Ribs.SecureView.prototype.initialize.call(this, options);
    },

    applySecureLoginPrompt: function() {
        MyAppView.LoginScreen.render();
    },

    applyTimedOutSecureLoginPrompt: function() {
        MyAppView.LoginScreen.render('Your session has timed out');
    },

    getLoggedInUserData: function() {
        // Load data from a stored session cookie.
    }
});
```
          
Every SecureView has an optional flag to set that will bypass the secure elements. This is extremely useful when testing the general components of the view when you don't want to hit security walls. The flag can be passed in as an option to the constructor and will be stored within the view object.
     
STATE MANAGEMENT: The default value of state requirement on a secured view is 'true'
          
USAGE: The purpose of the SecureView is to secure the render method, redirecting to rendering the appropriate login elements when authentication is required. It requires that the 'applySecureLoginPrompt' method is replaced in any child classes (or through an extension).

### Javascript Functional Extensions ###
As well as the core part of Ribs itself, the Ribs library also adds the following global Javascript helpers to aid in creating more terse, readable code...

* Object.hasValue - Returns true if the object is not undefined, null or empty
* Object.exists - Returns true if the object is not undefined or null
* Object.isTruthy - Returns true if the object is not undefined or null and is true
* Object.isFunction - Returns true if the object is not undefined or null and is a function
* String.trim() - Set up if not supported by the target browser
* String.ltrim() - Set up if not supported by the target browser
* String.rtrim() - Set up if not supported by the target browser
* String.fulltrim() - Set up if not supported by the target browser
* String.escapeRegExp() - Escape regular expressions
* String.replaceAll(find, replace) - Find and replace one value with another

### How do I get set up? ###
Like Backbone itself, Ribs is designed to be used either traditionallly, exposing itself as a global scope object, or through an AMD pattern implemented by a product like RequireJS.

#### To set up as a Global scope object ####
Add a reference to Backbone and it's dependencies to your page as follows. Paths may vary, but the paths given here assume that the Backbone-Ribs reference was obtained from NPM...
```
#!html
    <script src="node_modules/backbone-ribs/node_modules/backbone/node_modules/underscore/underscore.js"></script>
    <script src="node_modules/backbone-ribs/node_modules/backbone/backbone.js"></script>
    <script src="node_modules/backbone-ribs/backbone-ribs.js"></script>
```

#### To set up with RequireJS ####
With RequireJS in use you I use the following as a base RequireJS config (again assuming NPM paths)...
```
#!javascript
require.config({
    baseUrl: "{insert your app base url here - commonly empty, app/ or scripts/}",
    paths: {
        jquery: "node_modules/jquery/dist/jquery",
        underscore: "node_modules/backbone-ribs/node_modules/backbone/node_modules/underscore/underscore",
        backbone: "node_modules/backbone-ribs/node_modules/backbone/backbone",
        ribs: "node_modules/backbone-ribs/backbone-ribs"
    },
    shim: {
        jquery: { exports: '$' },
        underscore: { exports: '_' },
        backbone: { deps: ['underscore', 'jquery'], exports: 'Backbone' },
        ribs: { deps: ['backbone', 'underscore', 'jquery'], exports: 'Ribs' }
    }
});
```

### How do I use it? ###
My recommended usage pattern is to follow the same principle that Ribs itself follows and to create your own variation of ribs that extends the Ribs object elements themselves. This allows for integration of Ribs or Backbone updates while minimising the potential for breaking your code but allows you to slip in your own variations into the model for your own app.

In a global scope object style a sample extended version of Ribs may look something like this...
```
#!javascript
(function() {

    if (window.Ribs === undefined)
        throw 'Ribs has not been set up on the page.';

    window.MyAppRibs = window.MyAppRibs || {};

    window.MyAppRibs.Collection = window.Ribs.Collection;
    window.MyAppRibs.Model = window.Ribs.Model;
    window.MyAppRibs.View = window.Ribs.View;
    window.MyAppRibs.SimpleView = window.Ribs.SimpleView;

    window.MyAppRibs.SecureView = window.Ribs.SecureView.extend({
        initialize: function(options) {
            window.Ribs.SecureView.prototype.initialize.call(this, options);
        },

        applySecureLoginPrompt: function() {
            // Show your app's login screen.
        },

        applyTimedOutSecureLoginPrompt: function() {
            // Show your app's login screen with a timed out message.
        }
    });

    window.MyAppRibs.Region = window.Ribs.Region.extend({
        spinner: function() { return '<b>Your apps spinner here...</b>'; }
    });
})();
```

Using RequireJS (which I wholeheartedly recommend if using Backbone and Ribs) it would look like this...
```
#!javascript
define(['ribs'],
    function(Ribs) {

        var exSecureView = Ribs.SecureView.extend({
            initialize: function(options) {
                Ribs.SecureView.prototype.initialize.call(this, options);
            },

            applySecureLoginPrompt: function() {
                // Show your app's login screen.
            },

            applyTimedOutSecureLoginPrompt: function() {
                // Show your app's login screen with a timed out message.
            }
        });

        var exRegion = Ribs.Region.extend({
            spinner: function() { return '<b>Your apps spinner here...</b>'; }
        });

        return {
            Collection: Ribs.Collection,
            Model: Ribs.Model,
            View: Ribs.View,
            SimpleView: Ribs.SimpleView,
            SecureView: exSecureView,
            Region: exRegion
        };
    });
```

### Where can I get it? ###
You can download the javascript file (dev or minified version) from the downloads page here and add it to your website manually or you can use any of the following package managers...

- **NPM** - [https://www.npmjs.org/package/backbone-ribs](https://www.npmjs.org/package/backbone-ribs)
- **NUGET** - [https://www.nuget.org/packages/backbone-ribs](https://www.nuget.org/packages/backbone-ribs)

### Contribution guidelines ###
If you would like to contribute to the project, please contact me.

The source code can be used in a simple text editor or within Visual Studio using NodeJS Tools for Visual Studio.

### Who do I talk to? ###
* Keith Jackson - keith@ministryotech.co.uk