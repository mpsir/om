var g = globalThis;
g.d = {}
g.r = Vue.reactive({
})

var JSONF = {
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
    },
    is_valid_stringify: function (obj) {
        var r = false
        try {
            var a = JSONF.stringify(obj)
            r = true
        } catch (error) { }
        if (r) { return true }
        else { return false }
    },
    is_valid_parse: function (str) {
        var r = false
        try {
            var a = JSONF.parse(str)
            r = true
        } catch (error) { }
        if (r) { return true }
        else { return false }
    },
    is_valid_obj: function (obj) {
        var r = false
        try {
            var a = JSONF.parse(JSONF.stringify(obj))
            r = true
        } catch (error) { }
        if (r) { return true }
        else { return false }
    }
}

g.pages = {
    select_lang: {
        VApp: {
            template: `
        <div class="p-3 mt-3 mx-3">
            Please select primary language. 
        </div>
        <div class="p-3 mx-3 my-0">
            <button @click="set_hindi()" class="p-2">Hindi</button>
            <button @click="set_eng()" class="p-2 mx-3">English</button>
        </div>
        `,
            computed: {
                g() { return g }
            },
            methods: {
                async set_hindi() {
                    var a = JSONF.parse(JSONF.stringify(g.r.settings))
                    a = a[0]
                    a.default_lang = "hindi"
                    g.db.settings.put(a)
                    g.f.remove_app()
                    g.f.CreatePage(g.f.get_page_name())
                },
                async set_eng() {
                    var a = JSONF.parse(JSONF.stringify(g.r.settings))
                    a = a[0]
                    a.default_lang = "eng"
                    g.db.settings.put(a)
                    g.f.remove_app()
                    g.f.CreatePage(g.f.get_page_name())
                }
            }
        }
    },
    log_in: {
        VApp: {
            template: `log_in`
        }
    },
    log_out: {
        VApp: {
            template: `log_out`
        }
    },
    home: {
        VApp: {
            template: `
<div class="p-2 m-2">
    <h5 style="color:grey">
        Home
    </h5>
    <div>
        <a v-if="false" href="/?page=admin" style="text-decoration:none">admin</a> <br/>
        <button 
            style="background-color:transparent; border:none" 
            class="p-0" 
            @click="g.f.remove_app(); g.f.CreatePage('admin')">
            admin
        </button>        
    </div>  
    <json-editor :parsed="g.r" @update="" />
    <pre> {{ g.r }} </pre>      
</div>        
        `,
            computed: {
                g() { return g }
            }
        }
    },
    admin: {
        VApp: {
            template: `
<div class="p-2 m-2">
    <h5 style="color:grey">
        Admin
    </h5>
    <div>
        <a v-if="false" href="/?page=home" style="text-decoration:none">home</a>  
        <button 
            style="background-color:transparent; border:none" 
            class="p-1" @click="g.f.remove_app(); g.f.CreatePage('home')">
            home
        </button>         
    </div>        
</div>        
        `,
            computed: {
                g() { return g }
            }
        }
    },
    store: {
        VApp: {
            template: `store`
        }
    }
}

g.comps = {
    "monaco_editor": {
        template: `
      <div style="" v-bind="$attrs">        
        <div v-if="!IsReadOnly">
          <q-btn flat class="p-0 m-0 text-400" @click="update_parent()" color="white" text-color="black"
          :label="update_text" no-caps>
          </q-btn>
        </div>
        <div>
          <div ref="m_editor" style="min-height:28px;"></div>
        </div>
      </div>`,
        data() { return { Value: null, input_type: 'string' } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return {
                editor: {},
                g: Vue.computed(() => g)
            };
        },
        props: {
            parsed: { type: String, required: true, default: "a1666" },
            update_text: { type: String, required: false, default: 'Update' },
            lang: { type: String, required: false, default: 'javascript' },
            format_on_start: { type: Boolean, required: false, default: false },
            IsReadOnly: { type: Boolean, required: false, default: false }
        },
        emits: ['update:parsed', 'update'],
        created() { this.update_parsed() },
        watch: {
            parsed: {
                handler(newValue, oldValue) { this.update_parsed() },
                deep: false
            }
        },
        mounted() {
            var this1 = this
            this.editor = g.monaco.editor.create(this.$refs.m_editor, {
                value: this1.Value,
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                language: this1.lang,
                readOnly: false,
                minimap: { enabled: false },
                showFoldingControls: 'always',
                scrollbar: {
                    vertical: 'hidden',
                    horizontal: "visible"
                },
                overviewRulerBorder: false,
            });

            setTimeout(() => { this.update_editor() }, 100);
            if (this1.format_on_start) {
                setTimeout(() => { this.editor.getAction('editor.action.formatDocument').run() }, 500);
                this.Value = this.editor.getValue()
            }
            this.editor.getModel().onDidChangeContent(
                event => {
                    this1.update_editor();
                    this1.Value = this1.editor.getValue()
                    this1.$emit('update:parsed', this1.Value)
                }
            );
            const registerOnDidChangeFolding = () => {
                const foldingContrib = this.editor.getContribution('editor.contrib.folding');
                foldingContrib.getFoldingModel().then(foldingModel => {
                    foldingModel.onDidChange(() => {
                        this1.Value = this1.editor.getValue()
                        //console.log('editor.getValue()', this1.editor.getValue());
                        //this1.editor.viewModel.lines.getViewLineCount()
                    });
                });
            };
            registerOnDidChangeFolding();
            this.editor.onDidChangeModel(registerOnDidChangeFolding);
        },
        methods: {
            update_editor: function () {
                const contentHeight = this.editor.getModel().getLineCount() * 19;
                $(this.$refs.m_editor).css('height', contentHeight + 'px');
                this.editor.layout();
                this.Value = this.editor.getValue()
            },
            update_parsed() {
                this.Value = this.parsed
                try {
                    this.editor.getModel().setValue(this.parsed)
                    if (this.format_on_start) {
                        this.editor.getAction('editor.action.formatDocument').run()
                    }
                } catch (error) { }
            },
            update_parent() {
                this.$emit('update', this.Value)
            },
        }
    },
    "toggle_content": {
        template: `
  <span ref="controls">
    <slot name="control"></slot>
  </span>
  <slot v-if="show_inner"></slot>
`,
        props: {
            show_inner_p: { type: Boolean, default: true, required: false }
        },
        data() {
            return { show_inner: true }
        },
        created() {
            this.show_inner = this.show_inner_p
        },
        mounted() {
            var this1 = this
            var a = this.$refs.controls
            var b = $(a).find(".toggle-handle")
            if (!b[0]) {
                console.log('no handle found', '\nadd "toggle-handle" class to any ui element.')
            }
            else {
                var b = b[0]
                $(b).click(function () {
                    this1.show_inner = !this1.show_inner
                })
            }
        }
    },
    "json_editor": {
        template: `
<div class="p-0 m-0" v-bind="$attrs">  

<div v-if="typeof Value == 'string'"> 
    <j-string :parsed="Value" @update="Value = $event; update_parent()" /> 
</div>

<div v-if="typeof Value == 'number'"> 
    <j-number :parsed="Value" @update="Value = $event; update_parent()" /> 
</div>

<div v-if="typeof Value == 'boolean'"> 
    <j-boolean :parsed="Value" @update="Value = $event; update_parent()" /> 
</div>

<div v-if="typeof Value == 'object' && (Array.isArray(Value)==true)">
    <j-array :parsed="Value" @update="Value = $event; update_parent()" />
</div>

<div v-if="typeof Value == 'object' && Array.isArray(Value)==false">
    <j-object :parsed="Value" @update="Value = $event; update_parent()" />
</div>

<div v-if="typeof Value == 'function'">
    <div v-if="g.f.get_fun_type(Value) == 'function-basic'">
        <j-function-basic :parsed="Value" @update="Value = $event; update_parent()" />
    </div>  
    <div v-if="g.f.get_fun_type(Value) == 'function-arrow'">
        <j-function-arrow :parsed="Value" @update="Value = $event; update_parent()" />
    </div>  
    <div v-if="g.f.get_fun_type(Value) == 'function-async'">
        <j-function-async :parsed="Value" @update="Value = $event; update_parent()" />
    </div>  
</div>

</div>`,
        data() { return { Value: null } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return { g: Vue.computed(() => g) };
        },
        props: { parsed: { required: true } },
        emits: ['update'],
        created() {
            this.update_parsed()
        },
        watch: {
            parsed: { handler(newValue, oldValue) { this.update_parsed() }, deep: true }
        },
        methods: {
            update_parsed() { this.Value = this.parsed },
            update_parent() { this.$emit('update', this.Value) },
        },
        components: {}
    },
    "j_string": {
        template: `
        <div class="mx-3 mt-2">
        <select style="background-color:transparent; border:none" v-model="show_type">
            <option>color</option>
            <option>normal</option>
            <option>html</option>
            <option>css</option>
            <option>javascript</option>
            <option>php</option>
            <option>xml</option>
        </select>
        </div>

        <div v-if="show_type=='color'">
            <div> 
                <q-input borderless filled class="p-0 m-0" 
                        @update:model-value="$emit('update', $event)" 
                        :model-value="Value"> 
                </q-input> 
            </div>
            <q-color 
                    @update:model-value="$emit('update', $event)" 
                    v-model="Value" style="max-width:250px">
            </q-color>
        </div>

        <div v-if="show_type=='normal'">
            <q-input borderless filled class="p-0 m-0" 
                @update:model-value="$emit('update', $event)" 
                :model-value="Value"> </q-input>
        </div>

        <div v-if="show_type=='html'">
            <monaco-editor class="text-500" :lang="'html'" :update_text="'update-html'"
                @update="Value = $event; $emit('update', $event)" :parsed="Value">
            </monaco-editor>
        </div>

        <div v-if="show_type=='css'">
            <monaco-editor class="text-500" :lang="'css'" :update_text="'update-css'"
                @update="Value = $event; $emit('update', $event)" :parsed="Value">
            </monaco-editor>
        </div>

        <div v-if="show_type=='javascript'">
            <monaco-editor class="text-500" :lang="'javascript'" :update_text="'update-javascript'"
                @update="Value = $event; $emit('update', $event)" :parsed="Value">
            </monaco-editor>
        </div>

        <div v-if="show_type=='php'">
            <monaco-editor class="text-500" :lang="'php'" :update_text="'update-php'"
                @update="Value = $event; $emit('update', $event)" :parsed="Value">
            </monaco-editor>
        </div>

        <div v-if="show_type=='xml'">
            <monaco-editor class="text-500" :lang="'xml'" :update_text="'update-xml'"
                @update="Value = $event; $emit('update', $event)" :parsed="Value">
            </monaco-editor>
        </div>
        
        `,
        data() { return { Value: null, show_type: "normal" } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return {
                g: Vue.computed(() => g)
            };
        },
        props: {
            parsed: { required: true, },
        },
        emits: ['update'],
        created() { this.update_parsed() },
        watch: {
            parsed: {
                handler(newValue, oldValue) { this.update_parsed() },
                deep: false
            }
        },
        methods: {
            update_parsed() {
                this.Value = this.parsed
            },
            update_parent() {
                this.$emit('update', this.Value)
            },
        }
    },
    "j_number": {
        template: `
        <div>


        <q-input type="number"
                filled 
                @update:model-value="update_num($event)" 
                :model-value.number="Value">
            </q-input>
        
        </div>
        `,
        data() { return { Value: null } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return {
                g: Vue.computed(() => g)
            };
        },
        props: {
            parsed: { required: true, },
        },
        emits: ['update'],
        created() { this.update_parsed() },
        watch: {
            parsed: {
                handler(newValue, oldValue) { this.update_parsed() },
                deep: false
            }
        },
        methods: {
            update_num: function ($event) {

                var a = ""
                try {
                    a = JSON.parse($event)
                } catch (error) { }

                if (typeof a == "number") {
                    this.$emit('update', a)
                }
            },
            update_parsed() {
                this.Value = this.parsed
            },
            update_parent() {
                this.$emit('update', this.Value)
            },
        }
    },
    "j_boolean": {
        template: `
        <div style="width:55px">
            <q-toggle 
                :model-value="Value" 
                @update:model-value="Value=$event; update_parent()"></q-toggle>
        </div>
        `,
        data() { return { Value: null } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return {
                g: Vue.computed(() => g)
            };
        },
        props: {
            parsed: { required: true, },
        },
        emits: ['update'],
        created() { this.update_parsed() },
        watch: {
            parsed: {
                handler(newValue, oldValue) { this.update_parsed() },
                deep: false
            }
        },
        methods: {
            update_parsed() {
                this.Value = this.parsed
            },
            update_parent() {
                this.$emit('update', this.Value)
            },
        }
    },
    "j_object": {
        template: `
<div v-bind="$attrs">

    <toggle-content :show_inner_p="false">
        <template v-slot:control>
            <button style="color:blue; border:none; border-radius:4px;" class="toggle-handle p-2 pl-1">{</button>
        </template>
        <div class="my-2">
            ...
        </div>
    </toggle-content>

    
    <div style="color:blue" class="text-md">}</div>
</div>`,
        data() { return { Value: null } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return { g: Vue.computed(() => g) };
        },
        props: { parsed: { required: true, } },
        emits: ['update'],
        created() { this.update_parsed() },
        watch: {
            parsed: { handler(newValue, oldValue) { this.update_parsed() }, deep: true }
        },
        methods: {
            update_parsed() { this.Value = this.parsed },
            update_parent() { this.$emit('update', this.Value) },
        }
    },
    "j_array": {
        template: `
        <div v-bind="$attrs">
        Array
        </div>
        `
    },
    "j_function_basic": {
        name: "j-function-basic",
        template: `
        <div>
            <monaco-editor class="text-500" :lang="'javascript'" :update_text="'update'"
                @update="update_outer($event)" :parsed="g.f.parse( g.JSONF.stringify( Value ) )">
              </monaco-editor>
        </div>`,
        data() { return { Value: null } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return { g: Vue.computed(() => g) };
        },
        props: { parsed: { required: true, } },
        emits: ['update'],
        created() {
            this.update_parsed()
        },
        watch: {
            parsed: { handler(newValue, oldValue) { this.update_parsed() }, deep: false }
        },
        methods: {
            update_parsed() { this.Value = this.parsed },
            update_parent() { this.$emit('update', this.Value) },
            update_outer(data) {
                this.Value = g.JSONF.parse(JSON.stringify(data))
                this.update_parent()
            }
        }
    },
    "j_function_arrow": {
        template: `
        <div>
            <monaco-editor class="text-500" :lang="'javascript'" :update_text="'update'"
                @update="update_outer($event)" 
                :parsed="g.f.parse( g.JSONF.stringify( Value ) )">
              </monaco-editor>
        </div>`,
        data() { return { Value: null } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return { g: Vue.computed(() => g) };
        },
        props: { parsed: { required: true, } },
        emits: ['update'],
        created() { this.update_parsed() },
        watch: {
            parsed: { handler(newValue, oldValue) { this.update_parsed() }, deep: false }
        },
        methods: {
            update_parsed() {
                var b = g.f.parse(g.JSONF.stringify(this.parsed))
                this.Value = b.slice(8)
            },
            update_outer(data) {
                var Value = g.JSONF.parse(JSON.stringify("_ArrowF_" + data))
                this.$emit('update', Value)
            }
        }
    },
    "j_function_async": {
        template: `
        <div>
            <monaco-editor class="text-500" :lang="'javascript'" :update_text="'update'"
                @update="update_outer($event)" 
                :parsed="g.f.parse( g.JSONF.stringify( Value ) )">
              </monaco-editor>
        </div>`,
        data() { return { Value: null } },
        setup: function (props, { attrs, slots, emit, expose }) {
            return { g: Vue.computed(() => g) };
        },
        props: { parsed: { required: true, } },
        emits: ['update'],
        created() { this.update_parsed() },
        watch: {
            parsed: { handler(newValue, oldValue) { this.update_parsed() }, deep: false }
        },
        methods: {
            update_parsed() {
                var b = g.f.parse(g.JSONF.stringify(this.parsed))
                this.Value = b.slice(8)
            },
            update_outer(data) {
                var Value = g.JSONF.parse(JSON.stringify("_AsyncF_" + data))
                Value()
                this.$emit('update', Value)
            }
        }
    }
}

g.f = {
    App: {
        Start: function () {
            console.log('App is starting ...');
        },
        remove_app: function () {
            if (g.App) {
                g.App_Wrapper.unmount()
                $('#app-div').removeAttr('data-v-app')
            }
        },
        Create_Default_App: function () {
            g.App_Wrapper.use(Quasar)
            g.App_Wrapper.component("monaco-editor", g.comps.monaco_editor)
            g.App_Wrapper.component("toggle-content", g.comps.toggle_content)
            g.App_Wrapper.component("json-editor", g.comps.json_editor)
            g.App_Wrapper.component("j-string", g.comps.j_string)
            g.App_Wrapper.component("j-number", g.comps.j_number)
            g.App_Wrapper.component("j-boolean", g.comps.j_boolean)
            g.App_Wrapper.component("j-object", g.comps.j_object)
            g.App_Wrapper.component("j-array", g.comps.j_array)
            g.App_Wrapper.component("j-function-basic", g.comps.j_function_basic)
            g.App_Wrapper.component("j-function-arrow", g.comps.j_function_arrow)
            g.App_Wrapper.component("j-function-async", g.comps.j_function_async)
            g.App_Wrapper.component("v-select", window["vue-select"])
            g.App = g.App_Wrapper.mount('#app-div')
        },
    },
    Types: {
        get_type(Value) {
            if (typeof Value == 'string') { return "string" }
            if (typeof Value == 'number') { return "number" }
            if (typeof Value == 'boolean') { return "boolean" }
            if (typeof Value == 'object' && (Array.isArray(Value) == true)) { return "array" }
            if (typeof Value == 'object' && (Array.isArray(Value) == false)) { return "object" }
            if (typeof Value == 'function') {
                if (g.f.get_fun_type(Value) == 'function-basic') { return "function-basic" }
                if (g.f.get_fun_type(Value) == 'function-arrow') { return "function-arrow" }
                if (g.f.Types.get_fun_type(Value) == 'function-async') { return "function-async" }
            }
            return "unknown"
        },
        get_fun_type(Value) {
            var a = JSON.parse(JSONF.stringify(Value))
            var prefix = a.substring(0, 8);
            if (prefix === 'function') { return "function-basic" }
            if (prefix === '_ArrowF_') { return "function-arrow" }
            if (prefix === '_AsyncF_') { return "function-async" }
            return "function-basic"
        },
    },
    Arrays: {
        array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing
        },
        obj_to_array(obj) { return Object.entries(obj); },
        array_to_obj(arr) { return Object.fromEntries(arr) },

    },
    J: {
        pstring(obj) {
            return JSON.parse(JSON.stringify(obj))
        },
        pstringo(obj) {
            return JSONF.parse(JSONF.stringify(obj))
        },
        string(obj) {
            return JSON.stringify(obj)
        },
        parse(obj) {
            return JSON.parse(obj)
        },
    },
    Socket: {
        get_socket_address() {
            if (g.f.is_local_host()) { return 'http://localhost:8080/' }
            else { return 'http://super1mpsir-57484.portmap.host:57484/' }
        },
    },
    Page: {
        get_live_data(my_fun) {
            return VueUse.useObservable(Dexie.liveQuery(my_fun))
        },
        is_local_host: function () {
            if (location.port == '8080' || location.port == '3000') { return true }
            else { return false }
        },
        get_page_name() {
            var a = location.search
            if (a == '') { return 'home' }
            const params = new URLSearchParams(a).get('page')
            if (params) { return params }
            else { return 'home' }
        },
        get_page_data: async function (page_name) {
            if (g.pages.hasOwnProperty(page_name)) {
                return g.pages[page_name]
            } else {
                console.log('getting page data ...');
            }
            return null
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
    },
    got_msg(socket, data, c_back) {
        switch (data.type) {
            case 'runEV': eval(data.data); break;
            default: break;
        }
    },
    add_socket: function () {
        g.socket = io(g.f.get_socket_address())
        socket.on('connect', function () { });
        socket.on('disconnect', function (socket) { console.log('socket dis-connected to server'); });
        socket.on('reconnect', function (socket) { console.log('socket re-connect to server'); });
        socket.on('msg', function (data, c_back) { g.f.got_msg(socket, data, c_back) });
    },
    DB: {
        Init: async function () {
            var a = [
                {
                    name: "App",
                    app_version: "1.0",
                    log_status: false,
                    default_lang: 'not-set'
                },
                { name: "Pages", data: [] },
                { name: "Comps", data: [] },
                { name: "Temps", data: [] }
            ]
            await g.db.settings.bulkAdd(a);
        },
        Delete: async function () {
            await g.db.delete();
            Dexie.delete('ShreeRam');
            location.reload()
        }
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
        else { g.f.CreatePage(g.f.get_page_name()) }
    }
}

