// ============================================================================
// define.js
// ============================================================================
// 
// Prototypal inheritance in Javascript.
// 
// @authors
//      10/23/14    Stelios Anagnostopoulos     stelios@outlook.com
//      
// Copyright 2014, the @authors. All rights reserved.
// ============================================================================

typeof window === 'undefined' ? module.exports : window.define = (function () {

    'use strict';

    // ========================================================================
    // Definition
    // ========================================================================

    /**
     * Generates class definition given a collection of prototype
     * contracts.
     * 
     * @param  {Function} constr    
     * @param  {Array}    contracts (can also be single object)
     * @return {Function}          
     */
    function define (constr, contracts) {

        if (!(contracts instanceof Array))
            contracts = [contracts];
        for (var i = 0, len = contracts.length; i < len; i++)
            bind(constr.prototype, contracts[i]);

        var init = function () {
            if (constr.prototype._preInit)
                for (var i = 0, len = constr.prototype._preInit.length; i < len; i++)
                    constr.prototype._preInit[i].apply(this, arguments);

            constr.apply(this, arguments);

            if (constr.prototype._postInit)
                for (var i = 0, len = constr.prototype._postInit.length; i < len; i++)
                    constr.prototype._postInit[i].apply(this, arguments);
        };

        init.prototype = new constr;
        init.prototype.constructor = init;

        return init;
    };

    // ========================================================================
    // Internal
    // ========================================================================
    
    // cache
    var defineProperties = Object.defineProperties;

    /**
     * Binds members to class definition.
     * 
     * @param  {Object} proto
     * @param  {Object} attr 
     * @return {Object}      
     */
    function bind (proto, attr) {
        var properties = {},
            methods    = [],
            tkey;
        for (var key in attr) {
            if ( typeof attr[key] === 'string' ) {
                properties[key] = ( function (proparr) {
                    return {
                        configurable: true,
                        get: function() {
                            var ctx = this[proparr[0] ];
                            for (var i = 1, len = proparr.length; i < len; i++)
                                ctx = ctx[proparr[i] ];
                            return ctx;
                        },
                        set: function(v) {
                            var ctx = this[ proparr[0] ];
                            for (var i = 1, len = proparr.length - 1; i < len; i++)
                                ctx = ctx[ proparr[i] ];
                            ctx[ proparr[ proparr.length - 1 ] ] = v;
                        },
                    }
                })( attr[key].split('.') );
            } else if ( typeof attr[key] === 'object' ) {
                properties[key] = attr[key];
            } else if ( typeof attr[key] === 'function' ) {
                if ( key === 'preInit' || key === 'postInit' ) {
                    tkey = '_' + key;
                    if ( !proto[tkey] )
                        proto[tkey] = [];
                    proto[ tkey ][ proto[tkey].length ] = attr[key];   
                } else {
                    methods[ methods.length ] = [ key, attr[key] ];
                }
            }
        }

        defineProperties(proto, properties);

        var key, fun, sup;
        for (var i = 0, len = methods.length; i < len; i++) {
            key = methods[i][0];
            fun = methods[i][1];
            if (proto[key])
                sup = proto[key];
            proto[key]       = fun;
            proto[key].super = sup;
        }
    };

    // ========================================================================
    // Exports
    // ========================================================================

    return define;
})();
