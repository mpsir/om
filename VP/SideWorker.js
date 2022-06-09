(async function () {

    This = self || globalThis

    F = {
        WorkerMsg: async function (data) {
            switch (data.type) {
                case 'Eval': eval(data.data)
                    break;

                case 'Core': eval(data.data)
                AddDB()
                break;

                default: console.log('unknown type received', data.type)
                    break;
            }
        },
        Send_Msg: function (Msg_Type, Msg_Data) {
            This.postMessage({ type: Msg_Type, data: Msg_Data })
        },
        HasProp: function (Obj, prop) {
            var r = true
            if (!(Array.isArray(prop))) { return Obj.hasOwnProperty(prop) ? true : false }
            else {
                prop.forEach(p => { if (!(Obj.hasOwnProperty(p))) { r = false } })
                return r
            }
        },
        CheckLocalHost: function () {
            if (location.hostname.search('localhost') !== -1) { return true }
            if (location.hostname.search('127.0.0.1') !== -1) { return true }
            return false
        },
        GetFile: function (obj) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest()
                xhr.open(obj.method || "GET", obj.url)
                if (obj.headers) {
                    Object.keys(obj.headers).forEach(key => {
                        xhr.setRequestHeader(key, obj.headers[key])
                    })
                }
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) { resolve(xhr.response) }
                    else { reject(xhr.statusText) }
                }
                xhr.onerror = () => reject(xhr.statusText)
                xhr.send(obj.body)
            })
        },
    }

    This.onmessage = function (event) {
        if (F.HasProp(event.data, ['type', 'data'])) { F.WorkerMsg(event.data) }
    }

    async function AddDB() {
        DB = await (async function () {
            // Required :> F.GetFile, F.CheckLocalHost
            var _F = {
                GetSetText: async function (key, address = false, prefix = '') {
                    key = prefix + key
                    var a = await TextDB.getItem(key)
                    if (a !== null) { return a }
                    if (!address || typeof address !== 'object') {
                        console.log('address: ' + address + ' was not a object')
                        return null
                    }
                    if (address.hasOwnProperty('Local') || address.hasOwnProperty('Remote')) { }
                    else { return null }
                    if (F.CheckLocalHost() && address.hasOwnProperty('Local')) {
                        var data = await F.GetFile({ url: address.Local })
                        TextDB.setItem(key, data)
                    }
                    if (address.hasOwnProperty('Remote')) {
                        var data = await F.GetFile({ url: address.Remote })
                        TextDB.setItem(key, data)
                    }
                    return null
                }
            }
            var TextDB = await localforage.createInstance({ name: "DB", storeName: 'Text' })
            F.Send_Msg("Worker DB Added", {})
            return { TextDB: TextDB, GetSetText: _F.GetSetText }
        })()
    }

    F.Send_Msg("WorkerBeforeLoaded", {})

})()
