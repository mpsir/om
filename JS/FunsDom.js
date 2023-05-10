globalThis.FunsDom = {
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
        if (a == '') { return '404' }
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
    Create_Default_App: function () {
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
        g.App = g.App_Wrapper.mount('#app-div')
    },
    CreatePage: async function (page_name) {
        document.title = page_name
        var get_page_data = await g.f.get_page_data(page_name)
        // console.log('get_page_data', get_page_data);
        if (get_page_data) {
            console.log('creating page ...', page_name);
            g.App_Wrapper = Vue.createApp(get_page_data.VApp)
            g.f.Create_Default_App()
        } else {
            console.log('no');
        }
    },
    GetSocketAddress: function () {
        if (g.f.IsLocalHost()) { return 'http://localhost:8080/' }
        else { return 'http://super1mpsir-57484.portmap.host:57484/' }
    },
    a5: async function () {
        var IsFresh = await g.Dexie.exists("ShreeRam")
        IsFresh = !IsFresh

        g.db = await new Dexie("ShreeRam")

        await g.db.version(1).stores({ settings: "++id, &name" });

        if (IsFresh) { await g.f.DB.Init() }

        const settings_observer = await Dexie.liveQuery(() => db.settings.toArray());
        settings_observer.subscribe({
            next: result => g.r.settings = result,
            error: error => console.log(error)
        });

        setTimeout(() => { VAppStart() }, 50);
    },
    VAppStart: async function () {
        const settings = await db.settings.filter(friend => /a/i.test('App')).first();
        if (settings.default_lang == 'not-set') { g.f.CreatePage('select_lang') }
        else { g.f.CreatePage(g.f.GetPageName()) }
    },
    got_msg(socket, data, c_back) {
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
        socket.on('msg', function (data, c_back) { g.f.got_msg(socket, data, c_back) });
    },
    DeleteDB: async function (loc_reload=true) {
        await g.db.delete();
        Dexie.delete('ShreeRam');
        loc_reload ? location.reload() : null
    }
}


// var a = [
//     {
//         name: "App",
//         app_version: "1.0",
//         log_status: false,
//         default_lang: 'not-set'
//     },
//     { name: "Pages", data: [] },
//     { name: "Comps", data: [] },
//     { name: "Temps", data: [] }
// ]
// await g.db.settings.bulkAdd(a);