var JSONF = {
    stringify(obj){
        return JSON.stringify(obj, function(key, value){
            // if (typeof value == 'function') { return { dType: true, val: value + "" } }
            if (typeof value == 'function') { 
                return  "dType" + value  
            }
            return value
        })
    },
    parse(str){
        return JSON.parse(str, function (key, value) {
            if (typeof value == 'string') {
                var r = value.search("dType")
                if (r != -1) { 
                    value = value.replace("dType", "");
                    console.log('after', value);
                    eval(`value = ${value}`)
                    return value
                } 
            }
            // if (typeof value == 'object' && value.hasOwnProperty('dType')) {
            //     console.log('key', key);
            //     console.log('value', value);
            //     //eval(`key = ${value.val}`)
            //     return value
            //     //return eval(`${key} =  ${value.val}`);
            // }
            return value
        })
    }
}


    
//       exports.parse = function (str, date2obj) {
    
//         return JSON.parse(str, function (key, value) {
//           var prefix;
    
//           if (typeof value != 'string') {
//             return value;
//           }
//           if (value.length < 8) {
//             return value;
//           }
    
//           prefix = value.substring(0, 8);
    
//           if (prefix === 'function') { return eval('(' + value + ')'); }
//           if (prefix === '_NuFrRa_') { 

//             console.log(value.slice(8));
//             return eval(value.slice(8));
//             // return eval(value);
//           }
    
//           return value;
//         });
//       };
    
//       exports.clone = function (obj, date2obj) {
//         return exports.parse(exports.stringify(obj), date2obj);
//       };
    
//     }(typeof exports === 'undefined' ? (window.JSONF = {}) : exports));
    
    
    