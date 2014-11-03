/*
    Test Require Config
    -------------------
    Configures Require.js.
*/

(function () {
    var root = this;

    require.config({
        baseUrl: "",
        paths: {
            domReady: "lib/domReady",
            jquery: "node_modules/jquery/dist/jquery",
            underscore: "node_modules/backbone/node_modules/underscore/underscore",
            backbone: "node_modules/backbone/backbone",
            ribs: "../BackboneRibs/backbone-ribs",
            extendedribs: "extended-ribs-require",
            jasmine: 'node_modules/jasmine/node_modules/jasmine-core/lib/jasmine-core/jasmine',
            'jasmine-html': 'node_modules/jasmine/node_modules/jasmine-core/lib/jasmine-core/jasmine-html',
            boot: 'node_modules/jasmine/node_modules/jasmine-core/lib/jasmine-core/boot'
        },
        shim: {
            jquery: { exports: '$' },
            underscore: { exports: '_' },
            backbone: { deps: ['underscore', 'jquery'], exports: 'Backbone' },
            jasmine: { exports: 'window.jasmineRequire' },
            'jasmine-html': { deps: ['jasmine'], exports: 'window.jasmineRequire' },
            boot: { deps: ['jasmine', 'jasmine-html'], exports: 'window.jasmineRequire' }
        }
    });
    
    // Load Jasmine - This will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use the
    // AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
    // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
    // initialize the HTML Reporter and execute the environment.
    require(['boot'], function () {
        // Load the specs
        require(window.Specs, function () {
            // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
            window.onload();
        });
    });

})();