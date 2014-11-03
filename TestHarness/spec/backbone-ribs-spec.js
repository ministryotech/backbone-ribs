/*
    Backbone Ribs Spec
    ------------------
    Jasmine spec.
*/

// ReSharper disable UnusedLocals

// ReSharper disable InconsistentNaming
var specFunc = function(Helper, Ribs, Backbone) {
    // ReSharper restore InconsistentNaming
    describe("Backbone Ribs", function() {

        describe("Backbone.Model", function() {

            it("initiates the underlying Backbone object", function() {
                spyOn(Backbone.Model.prototype, 'initialize');
                var objUt = new Ribs.Model();
                expect(Backbone.Model.prototype.initialize).toHaveBeenCalled();
            });

            it("has a default name", function() {
                var objUt = new Ribs.Model();
                expect(objUt.name).toEqual("Unnamed Model");
            });

            it("always has defined options", function() {
                var objUt = new Ribs.Model();
                expect(objUt.options).not.toBeUndefined();
                expect(objUt.options).not.toBeNull();
            });

            it("allows for a name to be set on instantiation", function() {
                var objUt = new Ribs.Model({}, { name: "Test Model" });
                expect(objUt.name).toEqual("Test Model");
            });

            it("triggers an event when fetching", function() {
                var objUt = new Ribs.Model();

                spyOn(objUt, 'trigger');
                spyOn(Backbone.Model.prototype, 'fetch');

                objUt.fetch();

                expect(objUt.trigger).toHaveBeenCalledWith('fetching', objUt, undefined);
                expect(Backbone.Model.prototype.fetch).toHaveBeenCalled();
            });

            it("triggers an event when fetching that takes options", function() {
                var objUt = new Ribs.Model();
                var testOptions = {};

                spyOn(objUt, 'trigger');
                spyOn(Backbone.Model.prototype, 'fetch');

                objUt.fetch(testOptions);

                expect(objUt.trigger).toHaveBeenCalledWith('fetching', objUt, testOptions);
                expect(Backbone.Model.prototype.fetch).toHaveBeenCalled();
            });

            it("throws an error when a model is invalid", function() {
                var concreteObj = Ribs.Model.extend({
                    defaults: {
                        bob: undefined
                    },

                    validate: function(attributes) {
                        if (attributes.bob === undefined || attributes.bob == null || attributes.bob == '') {
                            return "The attribute 'bob' is required";
                        }
                        return null;
                    }
                });;

                var objUt = new concreteObj();
                var testOptions = {};

                expect(function() { objUt.save(testOptions); }).toThrow(new Error("The attribute 'bob' is required"));
            });

            describe("isNullAttribute", function() {

                var objUt;

                beforeEach(function() {
                    objUt = new Ribs.Model();
                });

                it("returns true when attributes is undefined", function() {
                    var result = objUt.isNullAttribute(undefined, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when attributes is null", function() {
                    var result = objUt.isNullAttribute(null, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when the passed attribute is undefined", function() {
                    var attributes = {};
                    var result = objUt.isNullAttribute(attributes, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when the passed attribute is null", function() {
                    var attributes = { bob: null };
                    var result = objUt.isNullAttribute(attributes, 'bob');
                    expect(result).toBe(true);
                });

                it("returns false when the passed attribute is present", function() {
                    var attributes = { bob: 'rabbits' };
                    var result = objUt.isNullAttribute(attributes, 'bob');
                    expect(result).toBe(false);
                });

            });

            describe("isNullOrEmptyAttribute", function() {

                var objUt;

                beforeEach(function() {
                    objUt = new Ribs.Model();
                });

                it("delegates to 'isNullAttribute' before performing further checks", function() {
                    // ReSharper disable UnusedParameter
                    spyOn(objUt, 'isNullAttribute').and.callFake(function(attributes, attributeName) {
                        // ReSharper restore UnusedParameter
                        return true;
                    });
                    var result = objUt.isNullOrEmptyAttribute(undefined, 'bob');

                    expect(objUt.isNullAttribute).toHaveBeenCalledWith(undefined, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when the passed attribute is ''", function() {
                    var attributes = { bob: '' };
                    var result = objUt.isNullOrEmptyAttribute(attributes, 'bob');
                    expect(result).toBe(true);
                });

                it("returns false when the passed attribute is 0", function() {
                    var attributes = { bob: 0 };
                    var result = objUt.isNullOrEmptyAttribute(attributes, 'bob');
                    expect(result).toBe(false);
                });

                it("returns false when the passed attribute is present", function() {
                    var attributes = { bob: 'rabbits' };
                    var result = objUt.isNullOrEmptyAttribute(attributes, 'bob');
                    expect(result).toBe(false);
                });

                it("returns false when the passed attribute is false", function() {
                    var attributes = { bob: false };
                    var result = objUt.isNullOrEmptyAttribute(attributes, 'bob');
                    expect(result).toBe(false);
                });

            });

            describe("isNullOrFalseAttribute", function() {

                var objUt;

                beforeEach(function() {
                    objUt = new Ribs.Model();
                });

                it("delegates to 'isNullAttribute' before performing further checks", function() {
                    // ReSharper disable UnusedParameter
                    spyOn(objUt, 'isNullAttribute').and.callFake(function(attributes, attributeName) {
                        // ReSharper restore UnusedParameter
                        return true;
                    });
                    var result = objUt.isNullOrFalseAttribute(undefined, 'bob');

                    expect(objUt.isNullAttribute).toHaveBeenCalledWith(undefined, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when the passed attribute is false", function() {
                    var attributes = { bob: false };
                    var result = objUt.isNullOrFalseAttribute(attributes, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when the passed attribute is 0", function() {
                    var attributes = { bob: 0 };
                    var result = objUt.isNullOrFalseAttribute(attributes, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when the passed attribute is -1", function() {
                    var attributes = { bob: -1 };
                    var result = objUt.isNullOrFalseAttribute(attributes, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when the passed attribute is a false string", function() {
                    var attributes = { bob: 'false' };
                    var result = objUt.isNullOrFalseAttribute(attributes, 'bob');
                    expect(result).toBe(true);
                });

                it("returns true when the passed attribute is a false string regardless of case", function() {
                    var attributes = { bob: 'False' };
                    var result = objUt.isNullOrFalseAttribute(attributes, 'bob');
                    expect(result).toBe(true);
                });

                it("returns false when the passed attribute is true", function() {
                    var attributes = { bob: true };
                    var result = objUt.isNullOrFalseAttribute(attributes, 'bob');
                    expect(result).toBe(false);
                });

                it("returns false when the passed attribute is a string", function() {
                    var attributes = { bob: 'some string' };
                    var result = objUt.isNullOrFalseAttribute(attributes, 'bob');
                    expect(result).toBe(false);
                });

                it("returns false when the passed attribute is an empty string", function() {
                    var attributes = { bob: '' };
                    var result = objUt.isNullOrFalseAttribute(attributes, 'bob');
                    expect(result).toBe(false);
                });

            });

            describe("JSON formatting", function() {

                var concreteObj;
                var objUt;

                beforeEach(function() {
                    concreteObj = Ribs.Model.extend({
                        defaults: {
                            name: undefined
                        }
                    });
                });

                afterEach(function() {
                    concreteObj = null;
                    objUt = null;
                });

                describe("can be executed against a standard model", function() {

                    beforeEach(function() {
                        objUt = new concreteObj({ id: 12, name: 'bob' });
                    });

                    it("with no specified level", function() {
                        var result = objUt.toJSONRecursive();
                        expect(result.id).toBe(12);
                        expect(result.name).toBe("bob");
                    });

                    it("regardless of specified level", function() {
                        var result = objUt.toJSONRecursive(10);
                        expect(result.id).toBe(12);
                        expect(result.name).toBe("bob");
                    });
                });

                describe("can be executed against a model with child models", function() {

                    var subConcreteObj;
                    var subConcreteObjCollection;
                    var subModels;

                    afterEach(function() {
                        subConcreteObj = null;
                        subConcreteObjCollection = null;
                        subModels = null;
                    });

                    beforeEach(function() {
                        subConcreteObj = Ribs.Model.extend({
                            defaults: {
                                name: undefined
                            }
                        });;
                        subConcreteObjCollection = Ribs.Collection.extend({
                            model: subConcreteObj
                        });

                        subModels = new Array();
                        subModels.push(new subConcreteObj({ id: 1, subname: 'sally' }));
                        subModels.push(new subConcreteObj({ id: 2, subname: 'florence' }));
                        subModels.push(new subConcreteObj({ id: 3, subname: 'jenni' }));

                        objUt = new concreteObj({ id: 10, name: 'bob', subs: new subConcreteObjCollection(subModels) });
                    });

                    it("and will also format the child models the first layer down (default level is the first level)", function() {
                        var result = objUt.toJSONRecursive();
                        expect(result.id).toBe(10);
                        expect(result.name).toBe("bob");
                        expect(result.subs.length).toBe(3);
                        expect(result.subs[0].id).toBe(1);
                        expect(result.subs[0].subname).toBe('sally');
                        expect(result.subs[1].id).toBe(2);
                        expect(result.subs[1].subname).toBe('florence');
                        expect(result.subs[2].id).toBe(3);
                        expect(result.subs[2].subname).toBe('jenni');
                    });

                    it("and will also format the child models the first layer down only regardless of greater level", function() {
                        var result = objUt.toJSONRecursive(10);
                        expect(result.id).toBe(10);
                        expect(result.name).toBe("bob");
                        expect(result.subs.length).toBe(3);
                        expect(result.subs[0].id).toBe(1);
                        expect(result.subs[0].subname).toBe('sally');
                        expect(result.subs[1].id).toBe(2);
                        expect(result.subs[1].subname).toBe('florence');
                        expect(result.subs[2].id).toBe(3);
                        expect(result.subs[2].subname).toBe('jenni');
                    });

                    describe("and child child models", function() {

                        var subSubConcreteObj;
                        var subSubConcreteObjCollection;
                        var subSubModels1, subSubModels2;

                        afterEach(function() {
                            subSubConcreteObj = null;
                            subSubConcreteObjCollection = null;
                            subSubModels1 = null;
                            subSubModels2 = null;
                        });

                        beforeEach(function() {
                            subSubConcreteObj = Ribs.Model.extend({
                                defaults: {
                                    name: undefined
                                }
                            });;
                            subSubConcreteObjCollection = Ribs.Collection.extend({
                                model: subConcreteObj
                            });

                            subSubModels1 = new Array();
                            subSubModels1.push(new subConcreteObj({ id: 1, subsubname: 'peter' }));
                            subSubModels1.push(new subConcreteObj({ id: 2, subsubname: 'john' }));
                            subSubModels2 = new Array();
                            subSubModels2.push(new subConcreteObj({ id: 3, subsubname: 'simon' }));

                            subModels = new Array();
                            subModels.push(new subConcreteObj({ id: 1, subname: 'sally', subsubs: new subSubConcreteObjCollection(subSubModels1) }));
                            subModels.push(new subConcreteObj({ id: 2, subname: 'florence' }));
                            subModels.push(new subConcreteObj({ id: 3, subname: 'jenni', subsubs: new subSubConcreteObjCollection(subSubModels2) }));

                            objUt = new concreteObj({ id: 10, name: 'bob', subs: new subConcreteObjCollection(subModels) });
                        });

                        it("and will format the child models the first layer down only by default", function() {
                            var result = objUt.toJSONRecursive();
                            expect(result.id).toBe(10);
                            expect(result.name).toBe("bob");
                            expect(result.subs.length).toBe(3);
                            expect(result.subs[0].id).toBe(1);
                            expect(result.subs[0].subname).toBe('sally');
                            expect(result.subs[0].subsubs.models).not.toBeUndefined();
                            expect(result.subs[0].subsubs.models.length).toBe(2);
                            expect(result.subs[1].id).toBe(2);
                            expect(result.subs[1].subname).toBe('florence');
                            expect(result.subs[1].subsubs).toBeUndefined();
                            expect(result.subs[2].id).toBe(3);
                            expect(result.subs[2].subname).toBe('jenni');
                            expect(result.subs[2].subsubs.models).not.toBeUndefined();
                            expect(result.subs[2].subsubs.models.length).toBe(1);
                        });

                        it("and will format the child models of both layers by increasing the level to '2'", function() {
                            var result = objUt.toJSONRecursive(2);
                            expect(result.id).toBe(10);
                            expect(result.name).toBe("bob");
                            expect(result.subs.length).toBe(3);
                            expect(result.subs[0].id).toBe(1);
                            expect(result.subs[0].subname).toBe('sally');
                            expect(result.subs[0].subsubs.models).toBeUndefined();
                            expect(result.subs[0].subsubs.length).toBe(2);
                            expect(result.subs[0].subsubs[0].subsubname).toBe('peter');
                            expect(result.subs[0].subsubs[1].subsubname).toBe('john');
                            expect(result.subs[1].id).toBe(2);
                            expect(result.subs[1].subname).toBe('florence');
                            expect(result.subs[1].subsubs).toBeUndefined();
                            expect(result.subs[2].id).toBe(3);
                            expect(result.subs[2].subname).toBe('jenni');
                            expect(result.subs[2].subsubs.models).toBeUndefined();
                            expect(result.subs[2].subsubs.length).toBe(1);
                            expect(result.subs[2].subsubs[0].subsubname).toBe('simon');
                        });

                        it("and will also format the child models all the way down regardless of greater level", function() {
                            var result = objUt.toJSONRecursive(10);
                            expect(result.id).toBe(10);
                            expect(result.name).toBe("bob");
                            expect(result.subs.length).toBe(3);
                            expect(result.subs[0].id).toBe(1);
                            expect(result.subs[0].subname).toBe('sally');
                            expect(result.subs[0].subsubs.models).toBeUndefined();
                            expect(result.subs[0].subsubs.length).toBe(2);
                            expect(result.subs[0].subsubs[0].subsubname).toBe('peter');
                            expect(result.subs[0].subsubs[1].subsubname).toBe('john');
                            expect(result.subs[1].id).toBe(2);
                            expect(result.subs[1].subname).toBe('florence');
                            expect(result.subs[1].subsubs).toBeUndefined();
                            expect(result.subs[2].id).toBe(3);
                            expect(result.subs[2].subname).toBe('jenni');
                            expect(result.subs[2].subsubs.models).toBeUndefined();
                            expect(result.subs[2].subsubs.length).toBe(1);
                            expect(result.subs[2].subsubs[0].subsubname).toBe('simon');
                        });
                    });
                });

            });
        });


        describe("Ribs.Collection", function() {

            it("initiates the underlying Backbone object", function() {
                spyOn(Backbone.Collection.prototype, 'initialize');
                var objUt = new Ribs.Collection();
                expect(Backbone.Collection.prototype.initialize).toHaveBeenCalled();
            });

            it("has a default name", function() {
                var objUt = new Ribs.Collection();
                expect(objUt.name).toEqual("Unnamed Collection");
            });

            it("always has defined options", function() {
                var objUt = new Ribs.Collection();
                expect(objUt.options).not.toBeUndefined();
                expect(objUt.options).not.toBeNull();
            });

            it("allows for a name to be set on instantiation", function() {
                var objUt = new Ribs.Collection({}, { name: "Test Collection" });
                expect(objUt.name).toEqual("Test Collection");
            });

            it("triggers an event when fetching", function() {
                var objUt = new Ribs.Collection();

                spyOn(objUt, 'trigger');
                spyOn(Backbone.Collection.prototype, 'fetch');

                objUt.fetch();

                expect(objUt.trigger).toHaveBeenCalledWith('fetching', objUt, undefined);
                expect(Backbone.Collection.prototype.fetch).toHaveBeenCalled();
            });

            it("triggers an event when fetching that takes options", function() {
                var objUt = new Ribs.Collection();
                var testOptions = {};

                spyOn(objUt, 'trigger');
                spyOn(Backbone.Collection.prototype, 'fetch');

                objUt.fetch(testOptions);

                expect(objUt.trigger).toHaveBeenCalledWith('fetching', objUt, testOptions);
                expect(Backbone.Collection.prototype.fetch).toHaveBeenCalled();
            });
        });


        describe("Ribs.View", function() {

            it("initiates the underlying Backbone object", function() {
                spyOn(Backbone.View.prototype, 'initialize');
                var objUt = new Ribs.View();
                expect(Backbone.View.prototype.initialize).toHaveBeenCalled();
            });

            it("has a default name", function() {
                var objUt = new Ribs.View();
                expect(objUt.name).toEqual("Unnamed View");
            });

            it("has a default section name to indicate the active app section", function() {
                var objUt = new Ribs.View();
                expect(objUt.sectionName).toEqual("No section specified");
            });

            it("has a default 'stateRequired' flag, set to false", function() {
                var objUt = new Ribs.View();
                expect(objUt.stateRequired).toEqual(false);
            });

            it("always has defined options", function() {
                var objUt = new Ribs.View();
                expect(objUt.options).not.toBeUndefined();
                expect(objUt.options).not.toBeNull();
            });

            it("allows for a name to be set on instantiation", function() {
                var objUt = new Ribs.View({ name: "Test View" });
                expect(objUt.name).toEqual("Test View");
            });

            it("allows for a section name to be set on instantiation", function() {
                var objUt = new Ribs.View({ sectionName: "Tests" });
                expect(objUt.sectionName).toEqual("Tests");
            });

            it("allows for a template to be set on instantiation", function() {
                var objUt = new Ribs.View({ template: function() { return "Bob"; } });
                expect(objUt.template()).toEqual("Bob");
            });

            it("provides an empty 'resetStyleState' method to be replaced by extending classes which takes an optional condition", function() {
                var objUt = new Ribs.View();
                expect(objUt.resetStyleState).not.toBeUndefined();

                // Call the methods to ensure they don't fall over.
                objUt.resetStyleState();
                objUt.resetStyleState(true);
                objUt.resetStyleState(false);
            });

            describe("supports cleandown", function() {

                it("unbinds events to prevent Zombies with hard disposal", function() {
                    var objUt = new Ribs.View();
                    spyOn(objUt, 'unbindFromAllModels').and.callThrough();
                    spyOn(objUt, 'stopListening').and.callThrough();
                    spyOn(objUt, 'unbind').and.callThrough();
                    spyOn(objUt, 'remove').and.callThrough();
                    spyOn(objUt, 'undelegateEvents').and.callThrough();

                    objUt.dispose();

                    expect(objUt.unbindFromAllModels).toHaveBeenCalled();
                    expect(objUt.stopListening).toHaveBeenCalled();
                    expect(objUt.unbind).toHaveBeenCalled();
                    expect(objUt.remove).toHaveBeenCalled();
                    expect(objUt.undelegateEvents).toHaveBeenCalled();
                });

                it("aliases dispose() with trash() for simple overriding", function() {
                    var objUt = new Ribs.View();
                    spyOn(objUt, 'dispose');

                    objUt.trash();

                    expect(objUt.dispose).toHaveBeenCalled();
                });
            });
        });


        describe("Ribs.SimpleView", function() {

            it("initiates the underlying object", function() {
                spyOn(Ribs.View.prototype, 'initialize');
                var objUt = new Ribs.SimpleView();
                expect(Ribs.View.prototype.initialize).toHaveBeenCalled();
            });

            it("has a default name", function() {
                var objUt = new Ribs.SimpleView();
                expect(objUt.name).toEqual("Unnamed View");
            });

            it("has a default template", function() {
                var objUt = new Ribs.SimpleView();
                expect(objUt.template()).toContain("No template defined");
            });

            it("allows for a name to be set on instantiation", function() {
                var objUt = new Ribs.SimpleView({ name: "Test View" });
                expect(objUt.name).toEqual("Test View");
            });

            it("allows for a template to be set on instantiation", function() {
                var objUt = new Ribs.SimpleView({ template: function() { return "Bob"; } });
                expect(objUt.template()).toEqual("Bob");
            });

            it("implements a default rendering method", function() {
                var objUt = new Ribs.SimpleView({ template: function() { return "Bob"; } });
                expect(objUt.render().el.innerHTML.toLowerCase()).toEqual("bob");
            });

            // This is disabled as I cannot make the test work consistently
            //it("implements a default rendering method that triggers an event when completed", function () {
            //    var objUt = new Ribs.SimpleView({ template: function () { return "Bob"; } });
            //    spyOn(Backbone.View.prototype, 'trigger').and.callThrough();
            //    objUt.render();


            //    waits(750);

            //    runs(function () {
            //        expect(Backbone.View.prototype.trigger).toHaveBeenCalledWith('rendered');
            //    });
            //});

        });


        describe("Ribs.SecureView", function() {

            it("initiates the underlying object", function() {
                spyOn(Ribs.View.prototype, 'initialize');
                var objUt = new Ribs.SecureView();
                expect(Ribs.View.prototype.initialize).toHaveBeenCalled();
            });

            it("has a default name", function() {
                var objUt = new Ribs.SecureView();
                expect(objUt.name).toEqual("Unnamed Secure View");
            });

            it("requires an 'applySecureLoginPrompt' method to be implemented by a child class to authenticate", function() {
                var objUt = new Ribs.SecureView();
                expect(function() { objUt.applySecureLoginPrompt(); }).toThrow(new Error('A login prompt was requested but has not been implemented in the child class - this function must be replaced!'));
            });

            it("has a default 'stateRequired' flag, set to true", function() {
                var objUt = new Ribs.SecureView();
                expect(objUt.stateRequired).toEqual(true);
            });

            it("allows for a name to be set on instantiation", function() {
                var objUt = new Ribs.SecureView({ name: "Test View" });
                expect(objUt.name).toEqual("Test View");
            });

            it("security is implicitly enabled on instantiation", function() {
                var objUt = new Ribs.SecureView();
                expect(objUt.securityBypass).toEqual(false);
            });

            it("allows for security to be explicitly disabled on instantiation", function() {
                var objUt = new Ribs.SecureView({ securityBypass: true });
                expect(objUt.securityBypass).toEqual(true);
            });

            it("allows for a template to be set on instantiation", function() {
                var objUt = new Ribs.SecureView({ template: function() { return "Bob"; } });
                expect(objUt.template()).toEqual("Bob");
            });

            it("implements a default rendering method", function() {
                var objUt = new Ribs.SecureView({ template: function() { return "Bob"; }, securityBypass: true });
                expect(objUt.render().el.innerHTML.toLowerCase()).toEqual("bob");
            });

            it("default rendering method does a secure render by default", function() {
                var objUt = new Ribs.SecureView({ template: function() { return "Bob"; }, securityBypass: true });
                spyOn(objUt, 'secureRender').and.callFake(Helper.DoNothing);
                objUt.render();

                expect(objUt.secureRender).toHaveBeenCalled();
            });

            it("rendering returns the view object", function() {
                var objUt = new Ribs.SecureView({ template: function() { return "Bob"; }, securityBypass: true });
                expect(objUt.render()).toEqual(objUt);
            });

            describe("the isSecured method", function() {

                it("returns true when the security bypass is enabled", function() {
                    var objUt = new Ribs.SecureView({ securityBypass: true });
                    expect(objUt.isSecured()).toEqual(true);
                });

                it("throws an error when the security bypass is not enabled", function() {
                    var objUt = new Ribs.SecureView();
                    expect(function() { objUt.isSecured(); }).toThrow(new Error("The 'getLoggedInUserData' function must be replaced in the child class in order to operate correctly."));
                });
            });

            describe("secure rendering", function() {

                var objUt;

                beforeEach(function() {
                    objUt = new Ribs.SecureView({ template: function() { return "Bob"; } });
                });

                afterEach(function() {
                    objUt.trash();
                    objUt = null;
                });

                it("will occur if the page is regarded as being secure", function() {
                    spyOn(objUt, 'isSecured').and.callFake(function() {
                        return true;
                    });
                    spyOn(objUt, 'applySecureLoginPrompt').and.callFake(Helper.DoNothing);

                    objUt.secureRender();
                    expect(objUt.isSecured).toHaveBeenCalled();
                    expect(objUt.applySecureLoginPrompt).not.toHaveBeenCalled();
                    expect(objUt.render().el.innerHTML.toLowerCase()).toEqual("bob");
                });

                it("will not occur if the page is regarded as being secure and will prompt for login instead", function() {
                    spyOn(objUt, 'isSecured').and.callFake(function() {
                        return false;
                    });
                    spyOn(objUt, 'applySecureLoginPrompt').and.callFake(Helper.DoNothing);

                    objUt.secureRender();
                    expect(objUt.isSecured).toHaveBeenCalled();
                    expect(objUt.applySecureLoginPrompt).toHaveBeenCalled();
                    expect(objUt.render().el.innerHTML).toBe('');
                });

            });
        });


        describe("Ribs.Region", function() {

            it("initiates the underlying object", function() {
                spyOn(Ribs.View.prototype, 'initialize');
                var objUt = new Ribs.Region();
                expect(Ribs.View.prototype.initialize).toHaveBeenCalled();
            });

            it("has a default name", function() {
                var objUt = new Ribs.Region();
                expect(objUt.name).toEqual("Unnamed Region");
            });

            it("allows for a currentView to be set on instantiation", function() {
                var testView = new Ribs.View({ name: "Test View" });
                var objUt = new Ribs.Region({ currentView: testView });
                expect(objUt.currentView).toEqual(testView);
            });

            describe("renders views in it's sphere safely", function() {

                beforeEach(function() {
                    $('body').append('<div id="jasmineSpecTestArea"></div>');
                });

                afterEach(function() {
                    $('#jasmineSpecTestArea').remove();
                });

                it("only having one view at any one time", function() {
                    var testViewStart = new Ribs.View({ name: "Test View" });
                    spyOn(testViewStart, 'trash').and.callThrough();
                    spyOn(testViewStart, 'render').and.callThrough();

                    var testViewNew = new Ribs.View({ template: function() { return "Sally"; } });
                    spyOn(testViewNew, 'trash').and.callThrough();
                    spyOn(testViewNew, 'render').and.callThrough();

                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea', currentView: testViewStart });

                    expect(objUt.currentView).toEqual(testViewStart);

                    objUt.renderView(testViewNew);

                    expect(testViewStart.trash).toHaveBeenCalled();
                    expect(testViewStart.render).not.toHaveBeenCalled();
                    expect(testViewNew.trash).not.toHaveBeenCalled();
                    expect(testViewNew.render).toHaveBeenCalled();
                });

                it("rendering the content of the supplied view within itself", function() {
                    var testView = new Ribs.SimpleView({ template: function() { return "Sally"; } });
                    spyOn(testView, 'render').and.callThrough();

                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea' });

                    objUt.renderView(testView);
                    expect(objUt.currentView).toEqual(testView);

                    expect(testView.render).toHaveBeenCalled();
                    expect(objUt.el.innerHTML).toContain(testView.template());
                });

                it("rendering the current view if no instance supplied", function() {
                    var testView = new Ribs.View({ name: "Test View" });
                    spyOn(testView, 'trash').and.callThrough();
                    spyOn(testView, 'render').and.callThrough();

                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea', currentView: testView });

                    expect(objUt.currentView).toEqual(testView);

                    objUt.renderView();

                    expect(testView.render).toHaveBeenCalled();
                });

                it("manually delegates events for the current view to allow reloading without errors", function() {
                    var testView = new Ribs.View({ name: "Test View" });
                    spyOn(testView, 'render').and.callThrough();
                    spyOn(testView, 'delegateEvents');

                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea', currentView: testView });

                    expect(objUt.currentView).toEqual(testView);

                    objUt.renderView();

                    expect(testView.render).toHaveBeenCalled();
                    expect(testView.delegateEvents).toHaveBeenCalled();
                });

                it("triggering a postRender method if present in the current view", function() {
                    var testView = new Ribs.View({ name: "Test View" });
                    spyOn(testView, 'render').and.callThrough();
                    testView.postRender = jasmine.createSpy('postRender() spy');

                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea', currentView: testView });

                    expect(objUt.currentView).toEqual(testView);

                    objUt.renderView();

                    expect(testView.render).toHaveBeenCalled();
                    expect(testView.postRender).toHaveBeenCalled();
                });

                it("responding to the rendered event of the current view by rendering the view within the region", function() {
                    var testView = new Ribs.SimpleView({ template: function() { return "Bob"; } });
                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea', currentView: testView });
                    spyOn(objUt, 'placeRenderedView').and.callThrough();
                    objUt.renderView();
                    expect(objUt.placeRenderedView).toHaveBeenCalled();
                });

                it("responding to the rendering event of the current view by showing a spinner within the region", function() {
                    var testViewObj = Ribs.SimpleView.extend({
                        render: function() {
                            this.trigger('rendering');
                        }
                    });
                    var testView = new testViewObj({ template: function() { return "Bob"; } });
                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea', currentView: testView });
                    spyOn(objUt, 'showRendering').and.callThrough();
                    objUt.renderView();
                    expect(objUt.showRendering).toHaveBeenCalled();
                    expect(objUt.$el.html().toLowerCase()).toContain('<p>loading...</p>');
                });

                it("by overriding trash() to dispose currentView", function() {
                    var testView = new Ribs.View({ name: "Test View" });
                    spyOn(testView, 'trash').and.callThrough();

                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea', currentView: testView });

                    objUt.trash();

                    expect(testView.trash).toHaveBeenCalled();
                });

                it("by allowing trash() to optionally destroy the region itself", function() {
                    var testView = new Ribs.View({ name: "Test View" });
                    spyOn(testView, 'trash').and.callThrough();

                    var objUt = new Ribs.Region({ el: '#jasmineSpecTestArea', currentView: testView });
                    spyOn(objUt, 'dispose');

                    objUt.trash(true);

                    expect(testView.trash).toHaveBeenCalled();
                    expect(objUt.dispose).toHaveBeenCalled();
                });
            });
        });
    });
};

if (typeof define === 'function' && define.amd) {
    define(['spec-helper', 'ribs', 'backbone'], specFunc);
} else {
    specFunc(TestHarness.SpecHelper, Ribs, Backbone);
}

// ReSharper restore UnusedLocals