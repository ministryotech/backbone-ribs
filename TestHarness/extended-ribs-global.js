/*
    Extending Ribs Scaffold
    -----------------------
    Base classes and app level element for a sample site extending ribs for testing.
*/

(function() {

    if (window.Ribs === undefined)
        throw 'Ribs has not been set up on the page.';

    window.ExtendedRibs = window.ExtendedRibs || {};

    window.ExtendedRibs.Collection = window.Ribs.Collection;
    window.ExtendedRibs.Model = window.Ribs.Model;
    window.ExtendedRibs.View = window.Ribs.View;
    window.ExtendedRibs.SimpleView = window.Ribs.SimpleView;

    window.ExtendedRibs.SecureView = window.Ribs.SecureView.extend({
        initialize: function(options) {
            window.Ribs.SecureView.prototype.initialize.call(this, options);
        },

        applySecureLoginPrompt: function() {
            // Do nothing.
        },

        applyTimedOutSecureLoginPrompt: function() {
            // Do nothing.
        }
    });

    window.ExtendedRibs.Region = window.Ribs.Region.extend({
        spinner: function() { return '<b>Spinning</b>'; }
    });
})();