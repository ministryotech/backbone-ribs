/*
    Cookie Manager
    --------------
    Helper for providing cookie interraction using the underlying CookieJS library (which has had bugs fixed).
 
    Makes use of a slightly tweaked version of the CookieJS library by Maxime Haineault (max@centdessin.com) (Included)
*/

define(['cookie'],
    function (Cookie) {
    
    var createCookie = function (name, cookieData, ttl) {
        if (cookieData === undefined || cookieData === null || cookieData === '') {
            throw (new Error('No session data provided to create a cookie.'));
        }
        
        var newCookie = Cookie.set(name, cookieData, ttl);
        return newCookie;
    };
    
    var clearCookie = function (name) {
        Cookie.unset(name);
    };
    
    var getCookie = function (name) {
        return Cookie.get(name);
    };
    
    return {
        createCookie: createCookie,
        clearCookie: clearCookie,
        getCookie: getCookie
    };
});