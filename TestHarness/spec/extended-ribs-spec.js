/*
    Extended Ribs Spec
    ------------------
    Jasmine spec.
*/

// ReSharper disable UnusedLocals

//define(['spec-helper', 'ribs', 'extensions'],
//    // ReSharper disable InconsistentNaming
//    function (Helper, Ribs, ExtendedRibs) {
//    // ReSharper restore InconsistentNaming
//        describe("Extended RIBS", function () {

//            describe("Extended.Model", function () {

//                it("passes through to a Ministry.Model", function () {
//                    spyOn(Ribs.Model.prototype, 'initialize');
//                    var objUt = new ExtendedRibs.Model();
//                    expect(Ribs.Model.prototype.initialize).toHaveBeenCalled();
//                });
//            });
            

//            describe("Extended.Collection", function () {

//                it("passes through to a Ministry.Collection", function () {
//                    spyOn(Ribs.Collection.prototype, 'initialize');
//                    var objUt = new ExtendedRibs.Collection();
//                    expect(Ribs.Collection.prototype.initialize).toHaveBeenCalled();
//                });
//            });
            

//            describe("Extended.View", function () {

//                it("passes through to a Ministry.View", function () {
//                    spyOn(Ribs.View.prototype, 'initialize');
//                    var objUt = new ExtendedRibs.View();
//                    expect(Ribs.View.prototype.initialize).toHaveBeenCalled();
//                });
//            });


//            describe("Extended.SimpleView", function () {

//                it("passes through to a Ministry.SimpleView", function () {
//                    spyOn(Ribs.SimpleView.prototype, 'initialize');
//                    var objUt = new ExtendedRibs.SimpleView();
//                    expect(Ribs.SimpleView.prototype.initialize).toHaveBeenCalled();
//                });
//            });


//            describe("Extended.SecureView", function () {

//                beforeEach(function () {
//                });

//                it("passes through to a Ministry.SecureView", function () {
//                    spyOn(Ribs.SecureView.prototype, 'initialize');
//                    var objUt = new ExtendedRibs.SecureView();
//                    expect(Ribs.SecureView.prototype.initialize).toHaveBeenCalled();
//                });

//                it("implements an 'applySecureLoginPrompt' method to authenticate with", function () {
//                    spyOn(Helper.LoginManager, 'redirectToOrigin');
//                    spyOn(Helper.LoginManager, 'redirectToHome');
//                    var objUt = new ExtendedRibs.SecureView();
//                    expect(function () { objUt.applySecureLoginPrompt(); }).not.toThrow(new Error('A login prompt was requested but has not been implemented in the child class - this function must be replaced!'));
//                });

//                it("implements an 'applyTimedOutSecureLoginPrompt' method to authenticate with", function () {
//                    spyOn(Helper.LoginManager, 'redirectToOrigin');
//                    spyOn(Helper.LoginManager, 'redirectToHome');
//                    var objUt = new ExtendedRibs.SecureView();
//                    expect(function () { objUt.applySecureLoginPrompt(); }).not.toThrow(new Error('A login prompt was requested but has not been implemented in the child class - this function must be replaced!'));
//                });
                
//                it("redirects to the login page", function () {
//                    var redirectOriginSpy = spyOn(Helper.LoginManager, 'redirectToOrigin');
//                    var redirectHomeSpy = spyOn(Helper.LoginManager, 'redirectToHome');
//                    var objUt = new ExtendedRibs.SecureView();
//                    objUt.applySecureLoginPrompt();
//                    expect(redirectHomeSpy).toHaveBeenCalled();
//                });

//                it("redirects to the login page timeout of server session", function () {
//                    var redirectOriginSpy = spyOn(Helper.LoginManager, 'redirectToOrigin');
//                    var redirectHomeSpy = spyOn(Helper.LoginManager, 'redirectToHome');
//                    var cookieSpy = spyOn(Helper.CookieManager, 'clearSession');

//                    var objUt = new ExtendedRibs.SecureView();
//                    objUt.applyTimedOutSecureLoginPrompt();

//                    expect(cookieSpy).toHaveBeenCalled();
//                    expect(redirectHomeSpy).toHaveBeenCalled();
//                });
//            });
            

//            describe("Extended.Region", function () {

//                it("loads the underlying Ministry.Region on instantiation", function () {
//                    spyOn(Ribs.Region.prototype, 'initialize');
//                    var objUt = new ExtendedRibs.Region();
//                    expect(Ribs.Region.prototype.initialize).toHaveBeenCalled();
//                });

//                it("replaces the default spinner", function () {
//                    var objUt = new ExtendedRibs.Region();
//                    expect(objUt.spinner()).not.toBe('<p>Loading...</p>');
//                });

//                it("renders views in it's sphere safely responding to the rendering event of the current view by showing a spinner within the region", function () {
//                    $('body').append('<div id="jasmineSpecTestArea"></div>');
//                    var testViewObj = ExtendedRibs.SimpleView.extend({
//                        render: function () {
//                            this.trigger('rendering');
//                        }
//                    });
//                    var testView = new testViewObj({ template: function () { return "Bob"; } });
//                    var objUt = new ExtendedRibs.Region({ el: '#jasmineSpecTestArea', currentView: testView });
//                    spyOn(objUt, 'showRendering').andCallThrough();
//                    objUt.renderView();
//                    expect(objUt.showRendering).toHaveBeenCalled();
//                    expect(objUt.$el.html().toLowerCase()).toContain('alt="loading..."');
//                    $('#jasmineSpecTestArea').remove();
//                });
//            });
//        });
//    });

//// ReSharper restore UnusedLocals