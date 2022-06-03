globalThis.JStringify = function (obj) {
    function p(key, val) {
        if (typeof val === 'function') {
            return { _type: "function", value: val + '' }
        }
        if (typeof val === 'undefined') {
            return { _type: "undefined" }
        }
        if (typeof val === 'symbol') {
            return {
                _type: "symbol",
                value: val.description
            }
        }
        return val;
        //Date  && Promise will be resolved by prototype 
    }
    return JSON.stringify(obj, p)
}
globalThis.JParse = function (str) {
    function p(key, value) {
        if (value == null) { return null }
        if (typeof value === 'object' && value.hasOwnProperty('_type')) {
            if (value._type == "undefined") { return null }
            if (value.hasOwnProperty('value')) {
                if (value._type == "function") { value = eval('(' + value.value + ')') }
                if (value._type == "dynType") {
                    //value = eval('(' + value.value + ')')
                    try { eval(value.value) }
                    catch (err) { value = { _Result: false } }
                }
                if (value._type == "symbol") { value = Symbol(value.value) }
                if (value._type == "date") { value = new Date(value.value) }
                if (value._type == "promise") {
                    if (value.value === "[object Promise]") {
                        console.log('JParse Error:Promise', 'value not defined')
                        console.log('JParse Error:value', value)
                    }
                    else {
                        var v = value.value
                        value = eval('(' + v + ')')
                        value.value = v
                    }
                }
            }
            return value
        }
        return value;
    }
    return JSON.parse(str, p)
}
Date.prototype.toJSON = function () {
    return {
        _type: "date",
        value: this.toUTCString()
    }
}
Promise.prototype.toJSON = function () {
    if (this.hasOwnProperty('value')) {
        return {
            _type: "promise",
            value: this.value
        }
    }
    return {
        _type: "promise",
        value: this.toString()
    }
}
function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }
    return text;
}