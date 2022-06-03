window.onload = function() { 

var VP = (async function () {
    var Dev = true
    var f = {
        addStyle: function (styles) {
            var css = document.createElement('style');
            css.type = 'text/css';
            if (css.styleSheet){css.styleSheet.cssText = styles}
            else {css.appendChild(document.createTextNode(styles))}
            document.getElementsByTagName("head")[0].appendChild(css);
        },
        AddLib: async function () {

        },
        CheckLocalHost: function () {
            if (location.hostname.search('localhost') !== -1) { return true }
            if (location.hostname.search('127.0.0.1') !== -1) { return true }
            return false
        },
        getFile: function (obj) {
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
        addScript: function (text, in_head = true) {
            var s = document.createElement('script')
            s.text = text
            s.async = false
            if (in_head) { document.getElementsByTagName('head')[0].appendChild(s) }
            else { document.body.appendChild(s) }
        },
        FirstSetUP: async function () {
            if (IsFirstSetUP === true) {
                localStorage.setItem('IsFreshSetUP', 'false')
                localStorage.setItem('UserStatus',   'false')
                localStorage.setItem('CoreJS',      await f.getFile({ url: '/Lib/Core.js' }))
                localStorage.setItem('LocalForage', await f.getFile({ url: '/Lib/LocalForage.js' }))
            }
        },
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

            if (IsLocalHost && address.hasOwnProperty('Local')) {
                var data = await f.getFile({ url: address.Local })
                TextDB.setItem(key, data)
            }

            if (address.hasOwnProperty('Remote')) {
                var data = await f.getFile({ url: address.Remote })
                TextDB.setItem(key, data)
            }
            return null
        }
    }

    var IsFirstSetUP = localStorage.getItem('IsFreshSetUP') ? false : true
    var IsLocalHost = f.CheckLocalHost()

    if (Dev) { console.log('IsFirstSetUP', IsFirstSetUP) }
    await f.FirstSetUP()

    eval(localStorage.getItem('CoreJS'))
    eval(localStorage.getItem('LocalForage'))

    var TextDB = await localforage.createInstance({ name: "DB", storeName: 'Text' })
    
    return { 
        TextDB      : TextDB, 
        GetSetText  : f.GetSetText,
        AddLib      : f.AddLib 
    }

})()

.then(async function (vp) {
    VP = vp
    console.log('VP:', VP)

    await VP.AddLib([
        {
            Local       : '/Lib/EVENT.js',
            Remote      : '',
            Tag         : 'Script',
            AddToDom    : false
        },
        {
            Local       : '/Lib/jqUI.js',
            Remote      : '',
            Tag         : 'Script',
            AddToDom    : false
        },
        {
            Local       : '/Init/JSON.js',
            Remote      : '',
            Tag         : 'Script',
            AddToDom    : false
        }
    ])
    
})

}
