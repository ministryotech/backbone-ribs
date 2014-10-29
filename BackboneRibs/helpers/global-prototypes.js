/*
    Global Prototypes
    -----------------
    Helper for setting up global prototypes.
*/

define([],
    function () {
    
    // Set up interrogation functions
    Object.hasValue = function (obj) {
        return obj !== undefined && obj !== null && obj !== '';
    };
    Object.exists = function (obj) {
        return obj !== undefined && obj !== null;
    };
    Object.isTruthy = function (obj) {
        return obj !== undefined && obj !== null && obj == true;
    };
    Object.isFunction = function (functionToCheck) {
        if (!Object.exists(functionToCheck)) return false;
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };
    
    // Set up basic model extensions where needed for older browsers
    if (!String.prototype.trim) {
        String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
        String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
        String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
        String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
    }
    
    // Set up string replace functions
    if (!String.prototype.escapeRegExp) {
        String.prototype.escapeRegExp = function () { return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"); };
    }
    
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function (find, replace) { return this.replace(new RegExp(find.escapeRegExp(), 'g'), replace); };
    }
});