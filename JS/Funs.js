globalThis.Funs = {
    RandomId: function () { return "id-" + Date.now() },
    GetType(Value) {
        if (typeof Value == 'string') { return "string" }
            if (typeof Value == 'number') { return "number" }
            if (typeof Value == 'boolean') { return "boolean" }
            if (typeof Value == 'object' && (Array.isArray(Value) == true)) {
                return globalThis.Funs.GetArrayType(Value)
            }
            if (typeof Value == 'object' && (Array.isArray(Value) == false)) { return "object" }
            if (typeof Value == 'function') {
                if (globalThis.Funs.GetFunType(Value) == 'function-basic') { return "function-basic" }
                if (globalThis.Funs.GetFunType(Value) == 'function-arrow') { return "function-arrow" }
                if (globalThis.Funs.GetFunType(Value) == 'function-async') { return "function-async" }
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