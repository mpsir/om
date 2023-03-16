var JSONF = {
    stringify(obj) {
        return JSON.stringify(obj, function (key, value) {
            if (typeof value == 'function') {
                var v = value + "";
                var no = v.indexOf("()")
                var r1 = v.slice(0, no)
                var r2 = key
                var r3 = v.slice(no)
                var isOldType = r1.search("function")
                if (isOldType != -1) {
                    var all = r1 + " " + r2 + r3
                    return {
                        type: "AsyncFunction",
                        value: all,
                        name: key
                    }
                } else {
                    // console.log('r1', r1);
                    // console.log('r2', r2);
                    // console.log('r3', r3);
                    return {
                        type: "AsyncFunction",
                        value: 'function ' + r1+r3,
                        name: key
                    }
                }
            }
            return value
        })
    },
    parse(str) {
        return JSON.parse(str, function (key, value) {
            if (typeof value == 'object') {
                if (value.hasOwnProperty('type') && value.type == "AsyncFunction") {
                    //console.log('value', value);
                    if (value.hasOwnProperty('value')) {
                        var s = value.value
                        eval(`value = ${s}`)
                        return value
                    }
                }
            }
            return value
        })
    }
}