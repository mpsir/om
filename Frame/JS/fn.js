globalThis.JSONF = {
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
                    console.log(5);
                    return {
                        type: "AsyncFunction",
                        value: all,
                        name: key
                    }
                } else {
                    // console.log(6, r3.replace(/\s/g, ""));

                    // console.log('r1', r1);
                    // console.log('r2', r2);
                    // console.log('r3', r3);
                    var a = {
                        type: "AsyncFunction",
                        value: 'function ' 
                            + r1//.replace(/\s/g, "")
                            + r3,//.replace(/\s/g, ""),
                        name: key
                    }

                    // r3 = r3.replace("()", "")
                    // console.log({
                    //     //r1, r2, 
                    //     r3:JSON.parse(r3)
                    // });
                    return a
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