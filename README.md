# README #

Backbone Ribs is an extension project which adds an additional layer of functionality to Backbone that simplifies creation of basic types of views, adds more granular JSON handling and separates concerns further by separating Views from Regions (see Views and regions below for details) which enables propper garbage handling without having to roll it all yourself.

### What is it for? ###
Making Backbone development easier.

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
You can download the javascript file from the source here and add it to your website manually or you can use any of the following pacakge managers...

- **NPM** - TBC
- **NUGET** - TBC

### Contribution guidelines ###
If you would like to contribute to the project, please contact me.

### Who do I talk to? ###
* Keith Jackson - keith@ministryotech.co.uk