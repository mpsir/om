var g = globalThis
g.JSONF = {
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
    }
}
g.Funs = {
    random_id: function () { return "id-" + Date.now() },
    GetType(Value) {
        if (typeof Value == 'string') { return "string" }
            if (typeof Value == 'number') { return "number" }
            if (typeof Value == 'boolean') { return "boolean" }
            if (typeof Value == 'object' && (Array.isArray(Value) == true)) {
                return g.Funs.GetArrayType(Value)
            }
            if (typeof Value == 'object' && (Array.isArray(Value) == false)) { return "object" }
            if (typeof Value == 'function') {
                if (g.Funs.GetFunType(Value) == 'function-basic') { return "function-basic" }
                if (g.Funs.GetFunType(Value) == 'function-arrow') { return "function-arrow" }
                if (g.Funs.GetFunType(Value) == 'function-async') { return "function-async" }
            }
            return "unknown"
    },
    GetFunType(Value) {
        var a = JSON.parse(JSONF.stringify(Value))
        var prefix = a.substring(0, 8);
        if (prefix === 'function') { return "function-basic" }
        if (prefix === '_ArrowF_') { return "function-arrow" }
        if (prefix === '_AsyncF_') { return "function-async" }
        return "function-basic"
    },
    ArrayMove(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) { arr.push(undefined) }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    },
    ObjToArray(obj) { return Object.entries(obj); },
    ArrayToObj(arr) { return Object.fromEntries(arr) },
    GetArrayType: function (arr) {
        if (arr.length) {
            var r = true
            arr.forEach(element => {
                if (!Array.isArray(element)) { r = false }
                if (element.length) { if (typeof element[0] != 'string') { r = false } }
            });
            if (r) { return "array-obj" }
            else { return "array-basic" }
        }
        return "array-basic"
    }
}