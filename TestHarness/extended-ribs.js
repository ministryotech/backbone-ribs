/*
    Extending Ribs Scaffold
    -----------------------
    Base classes and app level element for a sample site extending ribs for testing.
*/

define(['ribs'],
    // ReSharper disable once InconsistentNaming
    function (Ribs) {

        var exSecureView = Ribs.SecureView.extend({
            
            initialize: function (options) {
            Ribs.SecureView.prototype.initialize.call(this, options);
            },
            
            applySecureLoginPrompt: function () {
                // Do nothing.
            },
            
            applyTimedOutSecureLoginPrompt: function() {
                // Do nothing.
            }
        });
        
        var exRegion = Ribs.Region.extend({

            spinner: '<b>Spinning</b>'
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