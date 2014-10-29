/*
    Spec Helper
    -----------
    Commonly used spec helper methods.
*/

//define(['router', 'regions/r-app'],
//    function (TestRouter, TestHarnessAppRegion) {
define([], function () {

        var fakeEventArguments = {
                    preventDefault: function() {
                    },
                    target: undefined
        };

        var fakeDomElement = function(options) {

            this.options = options || {};

            this.val = function (value) {
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
            window.SiansPlanApp = undefined;
        };

        var preventEventFunction = function (e) {
            e.preventDefault();
        };

        var nothingFunction = function() {
        };

        var testRouteDefinition = function (router, routeName, routePath) {
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
    });

