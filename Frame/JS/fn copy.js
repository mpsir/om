(function (exports) {
    "use strict";
    
      exports.stringify = function (obj) {
    
        return JSON.stringify(obj, function (key, value) {
          var fnBody;
          if (value instanceof Function || typeof value == 'function') {
    
    
            fnBody = value.toString();
    
            if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { //this is ES6 Arrow Function
              return '_NuFrRa_' + fnBody;
            }
            return fnBody;
          }
          if (value instanceof RegExp) {
            return '_PxEgEr_' + value;
          }
          return value;
        });
      };
    
      exports.parse = function (str, date2obj) {
    
        return JSON.parse(str, function (key, value) {
          var prefix;
    
          if (typeof value != 'string') {
            return value;
          }
          if (value.length < 8) {
            return value;
          }
    
          prefix = value.substring(0, 8);
    
          if (prefix === 'function') { return eval('(' + value + ')'); }
          if (prefix === '_NuFrRa_') { 
            
            console.log(value.slice(8));
            return eval(value.slice(8));
            // return eval(value);
          }
    
          return value;
        });
      };
    
      exports.clone = function (obj, date2obj) {
        return exports.parse(exports.stringify(obj), date2obj);
      };
    
    }(typeof exports === 'undefined' ? (window.JSONF = {}) : exports));
    
    
    