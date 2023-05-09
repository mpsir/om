var fs = require('fs');
const path = require('path');

console.clear()
console.log('App is starting ...')

var JSONF = {
    stringify: function (obj) {
        return JSON.stringify(obj, function (key, value) {
            var fnBody;
            if (value instanceof Function || typeof value == 'function') {
                fnBody = value.toString();
                if (fnBody.substring(0, 5) == 'async') { return '_AsyncF_' + fnBody; }
                else {
                    if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { return '_ArrowF_' + fnBody; }
                }
                return fnBody;
            }
            if (value instanceof RegExp) { return '_RegExp_' + value; }
            return value;
        });
    },
    parse: function (str, date2obj) {
        var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;
        return JSON.parse(str, function (key, value) {
            var prefix;
            if (typeof value != 'string') { return value; }
            if (value.length < 8) { return value; }
            prefix = value.substring(0, 8);
            if (iso8061 && value.match(iso8061)) { return new Date(value); }
            if (prefix === 'function') { return eval('(' + value + ')'); }
            if (prefix === '_RegExp_') { return eval(value.slice(8)); }
            if (prefix === '_ArrowF_') { return eval(value.slice(8)); }
            if (prefix === '_AsyncF_') { return eval(`key = ${value.slice(8)}`); }
            return value;
        });
    },
    is_valid_stringify : function(obj){
        var r = false
        try {
            var a = JSONF.stringify(obj)
            r = true
        } catch (error) { }
        if (r) { return true }
        else { return false }
    },
    is_valid_parse : function(str){
        var r = false
        try {
            var a = JSONF.parse(str)
            r = true
        } catch (error) { }
        if (r) { return true }
        else { return false }
    },
    is_valid_obj : function(obj){
        var r = false
        try {
            var a = JSONF.parse( JSONF.stringify(obj) )
            r = true
        } catch (error) { }
        if (r) { return true }
        else { return false }
    } 
}

var g = globalThis
g.r = {
    sockets: []
}



g.f = JSONF.parse(fs.readFileSync(__dirname + '/App-funs.json').toString())
var App_Index = fs.readFileSync(__dirname + '/App-index.js').toString()
eval(App_Index);
