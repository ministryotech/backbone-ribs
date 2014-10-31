/*
    Spec Helper
    -----------
    Commonly used spec helper methods.
*/

var helperFunc = function() {

    var fakeEventArguments = {
        preventDefault: function() {
        },
        target: undefined
    };

    var fakeDomElement = function(options) {

        this.options = options || {};

        this.val = function(value) {
            if (value) {
                this.options.val = value;
                return value;
            } else {
                if (this.options.val) {
                    return this.options.val;
                }
                return null;
            }
        };
    };

    var falseFunction = function() {
        return false;
    };

    var clearGlobal = function() {
        window.TestApp = undefined;
    };

    var preventEventFunction = function(e) {
        e.preventDefault();
    };

    var nothingFunction = function() {
    };

    var testRouteDefinition = function(router, routeName, routePath) {
        expect(router.routes[routePath]).toEqual(routeName);
    };

    return {
        //TestHarnessRouter: Router,
        //TestHarnessAppRegion: AppRegion,
        EmptyEventArguments: fakeEventArguments,
        FakeDomElement: fakeDomElement,
        FalseFunction: falseFunction,
        PreventedEvent: preventEventFunction,
        DoNothing: nothingFunction,
        ClearGlobal: clearGlobal,
        Routing: {
            TestDefinition: testRouteDefinition,
            //TestRoute: testRoute,
        }
    };
};

if (typeof define === 'function' && define.amd) {
    define([], helperFunc);
} else {
    window.TestHarness = window.TestHarness || {};
    window.TestHarness.SpecHelper = helperFunc();
}