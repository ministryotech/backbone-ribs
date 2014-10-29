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
            ribs: "../BackboneRibs/backbone-ribs"
        },
        shim: {
            jquery: { exports: '$' },
            underscore: { exports: '_' },
            backbone: { deps: ['underscore', 'jquery'], exports: 'Backbone' }
        }
    });

})();