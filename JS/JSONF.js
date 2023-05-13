var g = globalThis;

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
    RandomId: function () { return "id-" + Date.now() },
    GetType: function (Value) {
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
    GetFunType: function (Value) {
        var a = JSON.parse(JSONF.stringify(Value))
        var prefix = a.substring(0, 8);
        if (prefix === 'function') { return "function-basic" }
        if (prefix === '_ArrowF_') { return "function-arrow" }
        if (prefix === '_AsyncF_') { return "function-async" }
        return "function-basic"
    },
    ArrayMove: function (arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) { arr.push(undefined) }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    },
    ObjToArray: function (obj) { return Object.entries(obj); },
    ArrayToObj: function (arr) { return Object.fromEntries(arr) },
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
    },
    GetTimeStamp: function () {
        var currentdate = new Date();
        return currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    }
}

g.FunsDom = {
    MakeContextMenu: function (e, menu_array, prevent_default = true) {
        prevent_default ? e.preventDefault() : null

        var x = $(e.target).position()

        var a = $("<div>OK</div>")
        $("body").append(a)

        $(a).css({
            top: x.top, // + $(toggleHandle).outerHeight(),
            left: x.left,
            position: 'fixed',
            zIndex: g.Funs.GetMaxZ()
        });

    },
    GetMaxZ: function () {
        return Math.max.apply(null,
            $.map($('body *'), function (e, n) {
                if ($(e).css('position') != 'static')
                    return parseInt($(e).css('z-index')) || 1;
            }));
    },
    GetLiveData: function (my_fun) {
        return VueUse.useObservable(Dexie.liveQuery(my_fun))
    },
    IsLocalHost: function () {
        if (location.port == '8080' || location.port == '3000') { return true }
        else { return false }
    },
    GetPageName() {
        var a = location.search
        if (a == '') {
            return 'Home'
        }
        const params = new URLSearchParams(a).get('page')
        if (params) { return params }
        else { return '404' }
    },
    RemoveApp: function () {
        if (g.App) {
            g.App_Wrapper.unmount()
            $('#app-div').removeAttr('data-v-app')
        }
    },
    Create_Default_App: async function (get_page_data) {
        g.App_Wrapper = Vue.createApp(get_page_data)
        g.App_Wrapper.use(Quasar)
        // g.App_Wrapper.component("monaco-editor", g.comps.monaco_editor)
        // g.App_Wrapper.component("toggle-content", g.comps.toggle_content)
        // g.App_Wrapper.component("json-editor", g.comps.json_editor)
        // g.App_Wrapper.component("j-string", g.comps.j_string)
        // g.App_Wrapper.component("j-number", g.comps.j_number)
        // g.App_Wrapper.component("j-boolean", g.comps.j_boolean)
        // g.App_Wrapper.component("j-object", g.comps.j_object)
        // g.App_Wrapper.component("j-array", g.comps.j_array)
        // g.App_Wrapper.component("j-function-basic", g.comps.j_function_basic)
        // g.App_Wrapper.component("j-function-arrow", g.comps.j_function_arrow)
        // g.App_Wrapper.component("j-function-async", g.comps.j_function_async)
        g.App_Wrapper.component("v-select", window["vue-select"])
        g.App_Wrapper.component("i-frame", {
            template:`<iframe ref="i1" v-bind="$attrs" style="width: 1px; min-width: 100%; border:none"></iframe>`,
            mounted:function(){ g.iFrameResize({ log: false }, this.$refs.i1) },
            computed:{ g:function(){ return g } }
        })
        g.App = g.App_Wrapper.mount('#app-div')
    },
    CreatePage: async function (page_name, CustomApp = false) {
        if (CustomApp != false) {
            g.f.Create_Default_App(CustomApp)
        } else {
            var get_page_data = await db.pages.where("name").equalsIgnoreCase(page_name).first()
            if (get_page_data) {
                console.log('creating page ...', page_name, get_page_data);
                get_page_data.hasOwnProperty('page_title') ? document.title = get_page_data.page_title : null
                g.f.Create_Default_App(get_page_data)
            } else { g.f.CreatePage('Error_Not_Found') }
        }
    },
    GetSocketAddress: function () {
        // console.log('g.f.IsLocalHost()', g.f.IsLocalHost());
        if (g.f.IsLocalHost()) { return 'http://localhost:8080/' }
        else { return 'http://super1mpsir-57484.portmap.host:57484/' }
    },
    DatabaseConnection: async function () {
        var IsExists = await g.Dexie.exists("ShreeRam")
        g.db = await new Dexie("ShreeRam")
        await g.db.version(1).stores({
            settings: "++id, &name",
            pages: "++id, &name",
            comps: "++id, &name",
            directives: "++id, &name",
            temps: "++id, &name",
            mixins: "++id, &name",
            composables: "++id, &name",
            css: "++id, &name",
            js: "++id, &name",
            images: "++id, &name",
            audios: "++id, &name",
            videos: "++id, &name",
            svg: "++id, &name",
            blobs: "++id, &name",
        });
        window.addEventListener('unhandledrejection', function (a) {
            if (a.hasOwnProperty('reason') && a.reason.hasOwnProperty('name')) {
                if (a.reason.name == 'DatabaseClosedError') { location.reload() }
            }
        })
        if (!IsExists) { await g.f.Install_Database() }
        await f.WatchDatabase()
        await f.AppStartNext()
    },
    AppStartNext: async function () {
        console.log('App > AppStartNext');
        // const settings = await db.settings.filter(friend => /a/i.test('App')).first();

        if (g.hasOwnProperty('CustomApp')) {
            g.f.CreatePage(g.f.GetPageName(), g.CustomApp)
        }
        else {
            g.f.CreatePage(g.f.GetPageName())
            g.f.AddSocket()
        }
        // if (settings.default_lang == 'not-set') { g.f.CreatePage('SelectLang') }
        // else { g.f.CreatePage(g.f.GetPageName()) }

    },
    GotMsg(socket, data, c_back) {
        switch (data.type) {
            case 'runEV': eval(data.data); break;
            default: break;
        }
    },
    AddSocket: function () {
        g.socket = io(g.f.GetSocketAddress())
        socket.on('connect', function () { });
        socket.on('disconnect', function (socket) { console.log('socket dis-connected to server'); });
        socket.on('reconnect', function (socket) { console.log('socket re-connect to server'); });
        socket.on('msg', function (data, c_back) { g.f.GotMsg(socket, data, c_back) });
    },
    DeleteDB: async function (loc_reload = true) {
        await g.db.delete();
        Dexie.delete('ShreeRam');
        loc_reload ? location.reload() : null
    },
    Install_Database: async function () {
        console.log('installing database ... ');
        await g.db.settings.bulkAdd([
            {
                name: "App",
                app_version: "1.0",
                log_status: false,
                default_lang: 'not-set'
            }
        ]);

        await g.db.pages.bulkAdd([
            {
                name: "Home",
                template: "Home",
                page_title: "home-page"
            },
            {
                name: "SelectLang",
                template: "SelectLang",
                page_title: "SelectLang"
            },
            {
                name: "Error_Not_Found",
                template: "Error_Not_Found",
                page_title: "Error_Not_Found"
            },
            {
                name: "Admin",
                template: "Admin",
                page_title: "Admin"
            }
        ]);

    },
    WatchDatabase: async function () {
        const settings_observer = await Dexie.liveQuery(() => db.settings.toArray());
        settings_observer.subscribe({
            next: result => {
                g.r.settings = result
                // console.log(result); 
            },
            error: error => {
                // console.log(error)
            }
        });
    }
}

g.Start = async function (IsDev = true) {
    IsDev ? console.log("\nApp has started ...\n") : null
    g.IsDev = IsDev
    g.d = {}
    g.r = Vue.reactive({
        IsLive: true,
        IsEditor: true,
        // settings 
    })
    g.f = { ...g.Funs, ...g.FunsDom }
    delete g.Funs
    delete g.FunsDom
    delete g.StartServer
    await f.DatabaseConnection()
}

g.StartServer = function (f1) {
    g.f = { ...g.Funs, ...f1 }

    delete g.FunsDom
    delete g.Funs
    delete g.Start

    console.clear()
    console.log("\n\nServer Started ", g.f.GetTimeStamp());
}