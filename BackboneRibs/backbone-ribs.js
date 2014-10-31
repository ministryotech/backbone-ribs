/*
    Backbone Ribs 1.0.0
    -------------------
    Base classes and app level elements to enhance Backbone.JS.

    Author: Keith Jackson
    Company: The Ministry of Technology
    Date: October 2014
    Last Updated: October 2014
 
    Initialisation code taken from Backbone itself and adapted. 
*/

(function(root, factory) {

    // ReSharper disable InconsistentNaming
    // Set up Backbone Ribs appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        // ReSharper disable once DuplicatingLocalDeclaration
        define(['backbone', 'exports'], function(Backbone, exports) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Ribs (in the same way as Backbone itself does).
            root.Ribs = factory(root, exports, Backbone);
        });

        // Next for Node.js or CommonJS.
    } else if (typeof exports !== 'undefined') {
        var Backbone = require('backbone');
        factory(root, exports, Backbone);

        // Finally, as a browser global.
    } else {
        root.Ribs = factory(root, {}, root.Backbone);
    }

    // ReSharper disable once ThisInGlobalContext

}(this, function(root, Ribs, Backbone) {

    // ReSharper restore InconsistentNaming

    // Set up interrogation function helpers on Object.
    Object.hasValue = function(obj) {
        return obj !== undefined && obj !== null && obj !== '';
    };
    Object.exists = function(obj) {
        return obj !== undefined && obj !== null;
    };
    Object.isTruthy = function(obj) {
        return obj !== undefined && obj !== null && obj == true;
    };
    Object.isFunction = function(functionToCheck) {
        if (!Object.exists(functionToCheck)) return false;
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };

    // Set up basic model extensions where needed for older browsers
    if (!String.prototype.trim) {
        String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); };
        String.prototype.ltrim = function() { return this.replace(/^\s+/, ''); };
        String.prototype.rtrim = function() { return this.replace(/\s+$/, ''); };
        String.prototype.fulltrim = function() { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
    }

    // Set up string replace functions
    if (!String.prototype.escapeRegExp) {
        String.prototype.escapeRegExp = function() { return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"); };
    }
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function(find, replace) { return this.replace(new RegExp(find.escapeRegExp(), 'g'), replace); };
    }

    /* 
     * ATTRIBUTE CHECKER: Extension to simplify attribute value checking. 
     * ------------------------------------------------------------------
     * The attribute checker extension offers methods to extend models and collections that allow for less verbose
     * validation code to be written either for validation methods or when attributes are required to be passed in
     * on instantiation.
     * 
     * USAGE EXAMPLE: replace...
     *      if (attributes === undefined || attributes === null || attributes.myAttr === undefined || attributes.myAttr === null) {
	 *          throw new Error('The myAttr attribute is required.')
     *      };
     *          with...
     *      if (this.isNullAttribute(attributes, 'myAttr')) {
	 *          throw new Error('The myAttr attribute is required.')
     *      };
     */
    var attributeChecker = {
        isNullAttribute: function(attributes, attributeName) {
            return (attributes === undefined || attributes === null || attributes[attributeName] === undefined || attributes[attributeName] === null);
        },

        isNullOrEmptyAttribute: function(attributes, attributeName) {
            return (this.isNullAttribute(attributes, attributeName) || attributes[attributeName] === '');
        },

        isNullOrFalseAttribute: function(attributes, attributeName) {
            return (this.isNullAttribute(attributes, attributeName) || attributes[attributeName] === false || attributes[attributeName] === 0 ||
                attributes[attributeName] === -1 || attributes[attributeName].toString().toLowerCase() === 'false');
        }
    };


    /* 
     * JSON FORMATTER: Extension for formatting models and collections to raw JSON. 
     * ----------------------------------------------------------------------------
     * The traditional toJSON() method is limited to transforming the current object. Overriding the toJSON() method itself
     * is generally not a good idea as some Backbone structures can become infinitely nested, although in some cases you
     * want to convert nested Backbone objects to pure JSON for template rendering, for example. The JSON Formatter
     * exposes a single 'toJSONRecursive()' function to recursively convert models and collections to raw JSON.
     * 
     * The function takes an optional 'level' parameter which indicates how far down the object hierarchy to look for
     * data to transform. This can be as high as you like without falling over, but it's recommended to keep this level
     * value right for the expected data structure, as checking for the presence of additional levels requires additional
     * processing loops.
     * 
     * If no level parameter is provided then the first level of children are processed by default. The level relates to the
     * initial MOdel structure, so the collection itself constitutes a level.
     */
    var modelJsonFormatter = function() {

        var convertNestedJson = function(json, level) {
            _.each(json, function(value, name) {
                if ((value !== undefined && value !== null) && _.isObject(value)) {
                    if (level > 0) {
                        json[name] = convertNestedJson(value, level - 1);
                    } else {
                        json[name] = value;
                    }
                };
                if ((value !== undefined && value !== null) && _.isFunction(value.toJSON)) {
                    if (level > 0) {
                        json[name] = convertNestedJson(value.toJSON(), level - 1);
                    } else {
                        json[name] = value.toJSON();
                    }
                };
            });
            return json;
        };

        this.toJSONRecursive = function(level) {
            level = level || 1;
            var json = _.clone(this.attributes);
            json = convertNestedJson(json, level);
            return json;
        };
    };


    /*
     * MODEL: The Ribs extension of the Backbone Model class.
     * ------------------------------------------------------
     * Any class extending Ribs.Model should ensure to call the replaced methods as follows...
     *     Ribs.Model.prototype.initialize.call(this, attributes, options);
     *      
     * Every Ribs based model has a name to help identify it. The name can be passed in as an option to the
     * constructor and will be stored within the model object or can be specified when defining the child
     * class.
     * 
     * A Ribs model applies a default validity check that will log any validation errors to the console and
     * throw them up the tree for handling as needed.
     * 
     * EVENTS:
     *    'fetching': Triggered whenever any model's fetch method has started.
     *    
     * IMPLEMENTS:
     *    Attribute Checker: Adds the functionality of the extension to allow quick method calls to check the
     * null / undefined state of attributes - allows far more concise validation code.
     *    JSON Formatter: Adds functionality to support recursive JSON transformations of model / collection
     * hierarchies.
     */
    Ribs.Model = Backbone.Model.extend(_.extend({
        name: 'Unnamed Model',

        initialize: function(attributes, options) {
            this.options = options || {};
            Backbone.Model.prototype.initialize.call(this, attributes, options);
            if (this.options.name) {
                this.name = this.options.name;
            }

            this.on('invalid', function(model, error) {
                throw new Error(error);
            });
        },

        fetch: function(options) {
            this.trigger('fetching', this, options);
            return Backbone.Model.prototype.fetch.call(this, options);
        }
    }, attributeChecker, new modelJsonFormatter()));


    /*
     * COLLECTION: The Ribs extension of the Backbone Collection class.
     * ----------------------------------------------------------------
     * Any class extending Ribs.Collection should ensure to call the replaced methods as follows...
     *     Ribs.Collection.prototype.initialize.call(this, attributes, options);
     *      
     * Every Ribs based collection has a name to help identify it. The name can be passed in as an option to the
     * constructor and will be stored within the collection object or can be specified when defining the child
     * class.
     * 
     * EVENTS:
     *    'fetching': Triggered whenever any collection's fetch method has started.
     * 
     * IMPLEMENTS:
     *    Attribute Checker: Adds the functionality of the extension to allow quick method calls to check the
     * null / undefined state of attributes - allows far more concise validation code.
     *    JSON Formatter: Adds functionality to support recursive JSON transformations of model / collection
     * hierarchies.
     */
    Ribs.Collection = Backbone.Collection.extend(_.extend({
        name: 'Unnamed Collection',

        initialize: function(models, options) {
            this.options = options || {};
            Backbone.Collection.prototype.initialize.call(this, models, options);
            if (this.options.name) {
                this.name = this.options.name;
            }
        },

        fetch: function(options) {
            this.trigger('fetching', this, options);
            return Backbone.Collection.prototype.fetch.call(this, options);
        }
    }, attributeChecker, new modelJsonFormatter()));


    /*
     * VIEW: The Ribs extension of the Backbone View class.
     * ----------------------------------------------------
     * Any class extending Ribs.View should ensure to call the replaced methods as follows...
     *     Ribs.View.prototype.initialize.call(this, attributes, options);
     * The exception to this is the 'render' method. Instead, any extending classes should ensure to trigger the
     * 'rendered' and 'rendering' events during the render lifecycle to ensure thet region integration works as
     * expected (see below).
     *      
     * Every Ribs based view has a name to help identify it. The name can be passed in as an option to the
     * constructor and will be stored within the view object or can be specified when defining the child class.
     *      
     * Every Ribs based view has an optional sectionName to add to navigation if needed. The sectionName can be 
     * passed in as an option to the constructor and will be stored within the view object or can be specified when 
     * defining the child class.
     *      
     * Every Ribs based view has a template to use for rendering. The template can be passed in as an option to the
     * constructor and will be stored within the view object or can be specified when defining the child class.
     *
     * STATE MANAGEMENT: The 'stateRequired' flag allows the view to indicate whether it's rendering requires any state
     * variables to be set before rendering can commence. The containing region can then utilise this information to
     * asynchronously hold rendering until the state variables are loaded.
     * 
     * RESPONSIVE DESIGN: The 'resetStyleState' method is a no-op that is designed to be wired in across the app to
     * support any view level changes that need to be applied as a result of user change generating a responsive design
     * change (such as a screen resize).
     * 
     * EVENTS:
     *    'rendering': Although not specified on the base BackboneRibs.View class, this event should always be fired
     * by any child class at the point that the render method is called IF the rendering process involves any async
     * operations. If all operations are quick, and synchronous, the event is unnecessary.
     *    'rendered': This event should be triggered after all view rendering has completed. This is important, as
     * it allows contaning master views (or 'regions' as they are called in Ribs parlance) to respond. This trigger
     * may be attached to a success or error callback where data retrieval is required as part of the rendering process.
     * 
     * VIEW LIFECYCLE: One of the biggest issues in Backbone revolves around the View lifecycle. Ribs views maintain
     * their bindings and have specific methods to dispose all of the resources they use. When used in conjunction with
     * a Ribs Region, to represent the holding area for the view, these methods ensure that 'orphan views' within a
     * region are always removed when not used anymore preventing 'Zombies' and memory leaks. If you choose to use the
     * views without the wrapping regions, then managing the Zombies falls to the consuming code, but the dispose and trash
     * methods are still invaluable.
     * 
     * BEST PRACTICE: Although Backbone allows much variation; best practice when using Ribs is to look at a 'View' as
     * being responsible for itself in that it's a piece of contained markup that is NOT attached to anything on a page.
     * In a Ribs based App containers on a page are wrapped by Regions instead and the regions are responsible for then
     * rendering a view into the container that they represent. SO the basic rule is...
     * - Is it new markup? = View
     * - Is the markup a container that's already present in a page or generated by another view? = Region
     */
    Ribs.View = Backbone.View.extend({
        name: 'Unnamed View',
        sectionName: 'No section specified',

        // Indicates reciance on state variables.
        stateRequired: false,

        template: undefined,

        bindings: [],

        initialize: function(options) {
            this.options = options || {};
            Backbone.View.prototype.initialize.call(this, options);
            if (this.options.name) {
                this.name = this.options.name;
            }
            if (this.options.sectionName) {
                this.sectionName = this.options.sectionName;
            }
            if (this.options.template) {
                this.template = this.options.template;
            }
        },

        bindToModel: function(model, ev, callback, that) {
            if (that === undefined || that === null) {
                throw "The value of 'that' needs the context of the extending class in order to operate correctly.";
            }
            model.bind(ev, callback, that);
            this.bindings.push({ model: model, ev: ev, callback: callback });
        },

        dispose: function() {
            this.unbindFromAllModels(); // Will unbind all events this view has bound to
            this.stopListening();
            this.unbind(); // This will unbind all listeners to events from this view. This is probably not necessary because this view will be garbage collected.
            this.remove(); // Uses the default Backbone.View.remove() method which removes this.el from the DOM and removes DOM events.
            this.undelegateEvents();
        },

        // When replacing, ensure to trigger the 'rendering' and 'rendered' events.
        render: function() {
            this.trigger('rendered');
            return this;
        },

        // Trigger point to call on resize to keep in line with responsive design.
        // ReSharper disable once UnusedParameter
        resetStyleState: function(condition) {
        },

        trash: function() {
            this.dispose();
        },

        unbindFromAllModels: function() {
            _.each(this.bindings, function(binding) {
                binding.model.unbind(binding.ev, binding.callback);
            });
            this.bindings = [];
        }
    });


    /*
     * SIMPLE VIEW: Specialised Ribs View.
     * -----------------------------------
     * Any class extending Ribs.SimpleView should ensure to call the replaced methods as follows...
     *     Ribs.SimpleView.prototype.initialize.call(this, attributes, options);
     * The exception to this is the 'render' method. Instead, any extending classes should ensure to trigger the
     * 'rendered' and 'rendering' events during the render lifecycle to ensure thet region integration works as
     * expected (see below).
     *      
     * USAGE: Some views are very basic - They have a template and it's rendered. There's no data to worry about. The
     * Ribs Simple view is for just those cases, where a simple extension or instatntiation with a template is all
     * that is needed.
     */
    Ribs.SimpleView = Ribs.View.extend({
        template: function() { return '<b>No template defined!</b>'; },

        initialize: function(options) {
            this.options = options || {};
            Ribs.View.prototype.initialize.call(this, options);
            if (this.options.template) {
                this.template = this.options.template;
            }
        },

        render: function() {
            this.$el.html(this.template(this));
            this.trigger('rendered');
            return this;
        }
    });


    /*
     * SECURE VIEW: Specialised Ribs View.
     * -----------------------------------
     * Any class extending Ribs.SecureView should ensure to call the replaced methods as follows...
     *     Ribs.SecureView.prototype.initialize.call(this, attributes, options);
     * The exception to this is the 'render' method. Instead, any extending classes should ensure to trigger the
     * 'rendered' and 'rendering' events during the render lifecycle to ensure thet region integration works as
     * expected (see below).
     * 
     * It is recommended that the app developer creates an app specific version of this class and replaces the
     * getLoggedInUserData() function with a function tied to their system. Until this is done 'isSecured' will always fail.
     * Replacing the default implementations of applySecureLoginPrompt() and applyTimedOutSecureLoginPrompt() is also recommended.
     *      
     * Every SecureView has an optional flag to set that will bypass the secure elements. This is extremely useful when testing the
     * general components of the view when you don't want to hit security walls. The flag can be passed in as an option to the
     * constructor and will be stored within the view object.
     * 
     * STATE MANAGEMENT: The default value of state requirement on a secured view is 'true'
     *      
     * USAGE: The purpose of the SecureView is to secure the render method, redirecting to rendering the appropriate login
     * elements when authentication is required. It requires that the 'applySecureLoginPrompt' method is replaced in any child
     * classes (or through an extension).
     */
    Ribs.SecureView = Ribs.View.extend({
        name: 'Unnamed Secure View',
        stateRequired: true,

        // Flag to pass in when testing child views.
        securityBypass: false,

        initialize: function(options) {
            this.options = options || {};
            Ribs.View.prototype.initialize.call(this, options);

            if (this.options.securityBypass !== undefined && this.options.securityBypass !== null) {
                this.securityBypass = this.options.securityBypass;
            }
        },

        applySecureLoginPrompt: function() {
            if (this.securityBypass) return;
            throw new Error('A login prompt was requested but has not been implemented in the child class - this function must be replaced!');
        },

        applyTimedOutSecureLoginPrompt: function() {
            if (this.securityBypass) return;
            throw new Error('A login prompt was requested but has not been implemented in the child class - this function must be replaced!');
        },

        getLoggedInUserData: function() {
            throw new Error("The 'getLoggedInUserData' function must be replaced in the child class in order to operate correctly.");
        },

        isSecured: function() {
            if (this.securityBypass) return true;
            var loggedInUserData = this.getLoggedInUserData();
            return (loggedInUserData !== undefined && loggedInUserData !== null);
        },

        render: function() {
            return this.secureRender();
        },

        secureRender: function() {
            if (this.isSecured()) {
                this.$el.html(this.template(this));
            } else {
                this.applySecureLoginPrompt();
            }
            this.trigger('rendered');
            return this;
        }
    });


    /*
     * REGION: The Ribs implementation of a View container.
     * ----------------------------------------------------
     * Any class extending Ribs.Region should ensure to call the replaced methods as follows...
     *     Ribs.Region.prototype.initialize.call(this, attributes, options);
     * Region implementations generally tend to be extremely lightweight, as the Backbone Ribs code here does most
     * of what is required.
     * 
     * Although Backbone allows much variation; best practice when using Ribs is to look at a 'View' as
     * being responsible for itself in that it's a piece of contained markup that is NOT attached to anything on a page.
     * In a Ribs based App containers on a page are wrapped by Regions instead and the regions are responsible for then
     * rendering a view into the container that they represent. SO the basic rule is...
     * - Is it new markup? = View
     * - Is the markup a container that's already present in a page or generated by another view? = Region
     *      
     * Every Ribs region has a name to help identify it. The name can be passed in as an option to the
     * constructor and will be stored within the view object or can be specified when defining the child class.
     *      
     * Every Ribs based view has a currentView to render. The currentView can be passed in as an option to the
     * constructor and will be stored within the view object or can be specified when defining the child class.
     * 
     * The 'spinner' property is expected to be replaced by an extending child class.
     * 
     * EVENTS: A Ribs region binds to the 'rendered' and 'rendering' events of it's currentView object. This allows the
     * region to seperate it's two key functions, firstly cleaning up any old views that may be contained within the region
     * (see 'View Lifecycle' below) and then placing the rendered view into it's container once the 'rendered' event has 
     * been triggered. While 'rendering' the view will show a spinner.
     * 
     * VIEW LIFECYCLE: One of the biggest issues in Backbone revolves around the View lifecycle. Backbone Ribs views maintain
     * their bindings and have specific methods to dispose all of the resources they use. A Ribs region will clear up any
     * views it contains before allowing a new one to be attached, calling the 'trash' method on the view to clean up any
     * used resources. It also has it's own trash method that will clear it's currentView and optionally dispose of itself.
     */
    Ribs.Region = Ribs.View.extend({
        name: 'Unnamed Region',

        currentView: undefined,
        spinner: '<p>Loading...</p>',

        initialize: function(options) {
            this.options = options || {};
            Ribs.View.prototype.initialize.call(this, options);
            if (this.options.currentView) {
                this.currentView = this.options.currentView;
            }
            _.bindAll(this, 'placeRenderedView');
            _.bindAll(this, 'showRendering');
        },

        placeRenderedView: function() {
            if (this.currentView !== undefined) {
                this.$el.html(this.currentView.$el);
                this.currentView.delegateEvents();

                if (this.currentView.postRender !== undefined && this.currentView.postRender !== null) {
                    this.currentView.postRender();
                }
            }
        },

        renderView: function(view) {
            if (view) {
                if (this.currentView) {
                    this.currentView.trash();
                }

                this.currentView = view;
            }

            this.currentView.bind('rendering', this.showRendering);
            this.currentView.bind('rendered', this.placeRenderedView);
            this.currentView.render();
        },

        showRendering: function() {
            this.$el.html(this.spinner);
        },

        trash: function(disposeRegion) {
            this.currentView.trash();

            if (disposeRegion !== undefined && disposeRegion !== null && disposeRegion !== false) {
                this.dispose();
            }
        }
    });

    Ribs.VERSION = "1.0.0";

    return Ribs;
}));