/*
    Application Bootloader
    ----------------------
    Configures Require.js and boots the app state.
*/

(function () {

    require.config({
        baseUrl: "/",
        paths: {
            //text: "../lib/text",
            //domReady: "../lib/domReady",
            jquery: "../lib/jquery/jquery",
            underscore: "../lib/underscore",
            backbone: "../lib/backbone",
            //'jquery.custom': "plugins/jquery.custom-plugins",
            //'jquery.fancybox': "../lib/jquery/jquery.fancybox",
            //'jquery.fancybox-buttons': "../lib/jquery/jquery.fancybox-buttons",
            //'jquery.fancybox-media': "../lib/jquery/jquery.fancybox-media",
            //'jquery.fancybox-thumbs': "../lib/jquery/jquery.fancybox-thumbs",
            //moment: "../lib/moment",
            cookie: "../lib/cookie",
            //ministry: "ministry-ribs",
            //siansplan: "siansplan-ribs"
        },
        shim: {
            jquery: { exports: '$' },
            //'jquery.custom': { deps: ['jquery'] },
            //'jquery.fancybox': { deps: ['jquery'] },
            //'jquery.fancybox-buttons': { deps: ['jquery.fancybox'] },
            //'jquery.fancybox-media': { deps: ['jquery.fancybox'] },
            //'jquery.fancybox-thumbs': { deps: ['jquery.fancybox'] },
            underscore: { exports: '_' },
            backbone: { deps: ['underscore', 'jquery'], exports: 'Backbone' },
            cookie: { exports: 'Cookie' }
        }
    });

})();