/*
    Extended Ribs Spec
    ------------------
    Jasmine spec.
*/

// ReSharper disable UnusedLocals

define(['spec-helper', 'ribs', 'extended-ribs'],
    // ReSharper disable InconsistentNaming
    function (Helper, Ribs, ExtendedRibs) {
    // ReSharper restore InconsistentNaming
        describe("Extended Ribs", function () {

            describe("Extended.Model", function () {

                it("passes through to a Ribs.Model", function () {
                    spyOn(Ribs.Model.prototype, 'initialize');
                    var objUt = new ExtendedRibs.Model();
                    expect(Ribs.Model.prototype.initialize).toHaveBeenCalled();
                });
            });
            

            describe("Extended.Collection", function () {

                it("passes through to a Ribs.Collection", function () {
                    spyOn(Ribs.Collection.prototype, 'initialize');
                    var objUt = new ExtendedRibs.Collection();
                    expect(Ribs.Collection.prototype.initialize).toHaveBeenCalled();
                });
            });
            

            describe("Extended.View", function () {

                it("passes through to a Ribs.View", function () {
                    spyOn(Ribs.View.prototype, 'initialize');
                    var objUt = new ExtendedRibs.View();
                    expect(Ribs.View.prototype.initialize).toHaveBeenCalled();
                });
            });


            describe("Extended.SimpleView", function () {

                it("passes through to a Ribs.SimpleView", function () {
                    spyOn(Ribs.SimpleView.prototype, 'initialize');
                    var objUt = new ExtendedRibs.SimpleView();
                    expect(Ribs.SimpleView.prototype.initialize).toHaveBeenCalled();
                });
            });


            describe("Extended.SecureView", function () {

                beforeEach(function () {
                });

                it("passes through to a Ribs.SecureView", function () {
                    spyOn(Ribs.SecureView.prototype, 'initialize');
                    var objUt = new ExtendedRibs.SecureView();
                    expect(Ribs.SecureView.prototype.initialize).toHaveBeenCalled();
                });

                it("implements an 'applySecureLoginPrompt' method to authenticate with", function () {
                    var objUt = new ExtendedRibs.SecureView();
                    expect(function () { objUt.applySecureLoginPrompt(); }).not.toThrow(new Error('A login prompt was requested but has not been implemented in the child class - this function must be replaced!'));
                });

                it("implements an 'applyTimedOutSecureLoginPrompt' method to authenticate with", function () {
                    var objUt = new ExtendedRibs.SecureView();
                    expect(function () { objUt.applySecureLoginPrompt(); }).not.toThrow(new Error('A login prompt was requested but has not been implemented in the child class - this function must be replaced!'));
                });
            });
            

            describe("Extended.Region", function () {

                it("loads the underlying Ribs.Region on instantiation", function () {
                    spyOn(Ribs.Region.prototype, 'initialize');
                    var objUt = new ExtendedRibs.Region();
                    expect(Ribs.Region.prototype.initialize).toHaveBeenCalled();
                });

                it("replaces the default spinner", function () {
                    var objUt = new ExtendedRibs.Region();
                    expect(objUt.spinner()).not.toBe('<p>Loading...</p>');
                });

                it("renders views in it's sphere safely responding to the rendering event of the current view by showing a spinner within the region", function () {
                    $('body').append('<div id="jasmineSpecTestArea"></div>');
                    var testViewObj = ExtendedRibs.SimpleView.extend({
                        render: function () {
                            this.trigger('rendering');
                        }
                    });
                    var testView = new testViewObj({ template: function () { return "Bob"; } });
                    var objUt = new ExtendedRibs.Region({ el: '#jasmineSpecTestArea', currentView: testView });
                    spyOn(objUt, 'showRendering').andCallThrough();
                    objUt.renderView();
                    expect(objUt.showRendering).toHaveBeenCalled();
                    expect(objUt.$el.html().toLowerCase()).toContain('<b>spinning</b>');
                    $('#jasmineSpecTestArea').remove();
                });
            });
        });
    });

// ReSharper restore UnusedLocals