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
    <j-array-basic v-if="g.f.get_array_type(Value) == 'array-basic'" :parsed="Value" @update="Value = $event; update_parent()" />
    <j-array-obj v-if="g.f.get_array_type(Value) == 'array-obj'" :parsed="Value" @update="Value = $event; update_parent()" />
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
            <div style="color:black" class="text-md text-700">{
                <j-array-obj :show_wrapper="false" :parsed="g.f.obj_to_array(Value)" @update="Value = g.f.array_to_obj($event); update_parent()" />
            </div>
                <div style="color:black" class="text-md text-700">}</div>
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
    "j_array_basic": {
        template: `<div v-bind="$attrs">
        <div style="color:black" class="text-cyan-900">[
            <button 
                style="background-color:transparent; border:none; cursor:pointer; width:50px; text-align:left"
                @click="show_new_block = !show_new_block" 
                class="text-800 m-0 p-0 px-2"> 
                + 
            </button>
            </div>
        <div>
            
            <div v-if="show_new_block" class="border-dashed border-300 p-0 m-0">
                <div class="m-0 p-0">
                    <v-select v-model="new_data_selected" :options="books" label="title"></v-select>
                </div>
                <div>
                    <q-input filled v-model="new_key" label="key-name"></q-input>
                </div>
                <div>
                    <q-btn no-caps @click="add_new_fun()" class="p-0 m-0 text-700" flat>Add Value</q-btn>
                    <q-btn no-caps @click="add_new_fun2()" class="p-0 m-0 text-700" flat>Add Key-Value</q-btn>
                </div>
            </div>
        </div>
        <div v-for="(a, a_no) in Value" class="my-0 px-3">
            <div>
                <toggle-content :show_inner_p="false">
                    <template v-slot:control>
                        <div>
                            <button no-caps class="toggle-handle m-0 text-800 p-0" style="background-color:transparent; border:none; cursor:pointer">
                                <span class="m-0 p-0 text-1000" style="color:black"> {{a_no}} : </span>
                                <span class="m-0 p-0">
                                    <button class="p-0 text-1000 m-0" style="background-color:transparent; border:none; cursor:pointer">
                                    <span class="text-cyan-900"> 
                                    <span v-if="g.f.get_type(Value[a_no]) == 'string'">
                                    <i> {{ JSON.stringify(Value[a_no].toString().slice(0, 25)) }} </i>
                                    </span>
                                    <span v-if="g.f.get_type(Value[a_no]) == 'number'">
                                    <i>    {{ Value[a_no].toString().slice(0, 25) }} </i>
                                    </span>
                                    <span v-if="g.f.get_type(Value[a_no]) == 'boolean'">
                                    <i>    {{ Value[a_no].toString().slice(0, 25) }} </i>
                                    </span>
                                    <span v-if="g.f.get_type(Value[a_no]) == 'array-basic'">
                                    <i>    [ {{Value[a_no].length}} ] </i>
                                    </span>
                                    <span v-if="g.f.get_type(Value[a_no]) == 'array-obj'">
                                    <i>[{{Value[a_no].length}}]* </i>
                                    </span>
                                    <span v-if="g.f.get_type(Value[a_no]) == 'object'">
                                    <i>     {{ "{ " +  Object.keys(Value[a_no]).length + " }" }}  </i>
                                    </span>
                                    <span v-if="g.f.get_type(Value[a_no]) == 'function-basic'">
                                       <i> f </i>
                                    </span>
                                    <span v-if="g.f.get_type(Value[a_no]) == 'function-arrow'">
                                    <i>    f => </i>
                                    </span>
                                    <span v-if="g.f.get_type(Value[a_no]) == 'function-async'">
                                    <i>    f async </i>
                                    </span>
                                        <span v-if="false"> {{ Value[a_no].toString().length > 25 ? Value[a_no].toString().slice(0, 25) + " ..." : Value[a_no] }} </span>
                                    </span>
                                    <q-popup-proxy class="z-5" context-menu>
                                    <div>
                                    <q-btn no-caps flat @click="Value.splice(a_no, 1); update_parent()">X</q-btn>
                                    <q-btn no-caps flat @click="dup_item(a_no)">Dup</q-btn>
                                    <q-btn no-caps flat @click="g.f.array_move(Value, a_no, (a_no-1)); update_parent()">UP</q-btn>
                                    <q-btn no-caps flat @click="g.f.array_move(Value, a_no, (a_no+1)); update_parent()">DN</q-btn>
                                    </div>  
                                    <div class="p-0 m-0">
                                        <select style="background-color:transparent; border:none" v-model="new_data_selected" class="p-1 mx-2">
                                        <template v-for="a in books">
                                        <option>
                                            {{a}}
                                        </option>
                                        </template>
                                        </select>
                                        <button @click="Value[a_no] = change_type(); update_parent()" class="mx-2" style="background-color:transparent; border:none">Change</button>
                                    </div>
                                    </q-popup-proxy>
                                </button>
                                </span>
                            </button>
                        </div>
                    </template>
    
                    <div v-if="typeof Value[a_no] == 'string'">
                        <j-string :parsed="Value[a_no]" @update="Value[a_no] = $event; update_parent();" />
                    </div>
    
                    <div v-if="typeof Value[a_no] == 'number'">
                        <j-number :parsed="Value[a_no]" @update="Value[a_no] = $event; update_parent();" />
                    </div>
    
                    <div v-if="typeof Value[a_no] == 'boolean'">
                        <j-boolean :parsed="Value[a_no]" @update="Value[a_no] = $event; update_parent();" />
                    </div>
    
                    <div v-if="typeof Value[a_no] == 'object' && (Array.isArray(Value[a_no])==true)">
                        <j-array-basic v-if="g.f.get_array_type(Value[a_no]) == 'array-basic'" :parsed="Value[a_no]"
                            @update="Value[a_no] = $event; update_parent();" />
                        <j-array-obj v-if="g.f.get_array_type(Value[a_no]) == 'array-obj'" :parsed="Value[a_no]"
                            @update="Value[a_no] = $event; update_parent();" />
                    </div>
    
                    <div v-if="typeof Value[a_no] == 'object' && Array.isArray(Value[a_no])==false">
                        <j-object :parsed="Value[a_no]" @update="Value[a_no] = $event; update_parent();" />
                    </div>
    
                    <div v-if="typeof Value[a_no] == 'function'">
                        <div v-if="g.f.get_fun_type(Value[a_no]) == 'function-basic'">
                            <j-function-basic :parsed="Value[a_no]" @update="Value[a_no] = $event; update_parent();" />
                        </div>
                        <div v-if="g.f.get_fun_type(Value[a_no]) == 'function-arrow'">
                            <j-function-arrow :parsed="Value[a_no]" @update="Value[a_no] = $event; update_parent();" />
                        </div>
                        <div v-if="g.f.get_fun_type(Value[a_no]) == 'function-async'">
                            <j-function-async :parsed="Value[a_no]" @update="Value[a_no] = $event; update_parent();" />
                        </div>
                    </div>
                </toggle-content>
            </div>
        </div>
        <div style="color:black" class="text-cyan-900">]</div>
    </div>`,
        data() {
            return {
                show_new_block: false,
                new_key: "new_1",
                Value: null,
                new_data_model: false,
                new_data_selected: 'string',
                books: [
                    "string",
                    "number",
                    "boolean",
                    "object",
                    "array-basic",
                    "array-obj",
                    "function-basic",
                    "function-arrow",
                    "function-async"
                ]
            }
        },
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
            change_type() {
                var new_data_type = g.JSON.parse(g.JSON.stringify(this.new_data_selected))
                var r = "new string"
                switch (new_data_type) {
                    case "string":
                        r = "new string"
                        break;

                    case "number":
                        r = 0
                        break;

                    case "boolean":
                        r = true
                        break;

                    case "object":
                        r = {}
                        break;

                    case "array-basic":
                        r = []
                        break;

                    case "array-obj":
                        r = []
                        break;

                    case "function-basic":
                        r = function () { }
                        break;

                    case "function-arrow":
                        r = (a, b) => a * b
                        break;

                    case "function-async":
                        r = async function () { }
                        break;

                    default: break;
                }

                return r
            },
            dup_item(a_no) {
                var a = g.JSONF.parse(g.JSONF.stringify(this.Value))
                var b = a[a_no]
                b[0] = b[0] + "_copy"
                this.Value.splice(a_no + 1, 0, b)
                this.update_parent()
            },
            add_new_fun() {
                var new_data_type = g.JSON.parse(g.JSON.stringify(this.new_data_selected))

                switch (new_data_type) {

                    case "string":
                        this.Value.splice((this.Value.length + 1), 0, "new string")
                        break;

                    case "number":
                        this.Value.splice((this.Value.length + 1), 0, 0)
                        break;

                    case "boolean":
                        this.Value.splice((this.Value.length + 1), 0, true)
                        break;

                    case "object":
                        this.Value.splice((this.Value.length + 1), 0, {})
                        break;

                    case "array-basic":
                        this.Value.splice((this.Value.length + 1), 0, [])
                        break;

                    case "array-obj":
                        this.Value.splice((this.Value.length + 1), 0, [["a5", 555]])
                        break;

                    case "function-basic":
                        this.Value.splice((this.Value.length + 1), 0, function () { })
                        break;

                    case "function-arrow":
                        this.Value.splice((this.Value.length + 1), 0, (a, b) => a * b)
                        break;

                    case "function-async":
                        this.Value.splice((this.Value.length + 1), 0, async function () { })
                        break;

                    default: break;
                }
                this.show_new_block = !this.show_new_block
                this.update_parent()
            },
            add_new_fun2() {
                var new_data_type = g.JSON.parse(g.JSON.stringify(this.new_data_selected))
                var new_key_name = g.JSON.parse(g.JSON.stringify(this.new_key))

                switch (new_data_type) {

                    case "string":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, "new string"])
                        break;

                    case "number":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, 0])
                        break;

                    case "boolean":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, true])
                        break;

                    case "object":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, {}])
                        break;

                    case "array-basic":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, []])
                        break;

                    case "array-obj":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, []])
                        break;

                    case "function-basic":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, function () { }])
                        break;

                    case "function-arrow":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, (a, b) => a * b])
                        break;

                    case "function-async":
                        this.Value.splice((this.Value.length + 1), 0, [new_key_name, async function () { }])
                        break;

                    default: break;
                }
                this.show_new_block = !this.show_new_block
                this.update_parent()
            },
            update_parsed() {
                this.Value = this.parsed
            },
            update_parent() {
                this.$emit('update', this.Value)
            },
        }
    },
    "j_array_obj": {
        name: "j-array-obj",
        template: `

<span v-if="!show_wrapper"> 
<button @click="show_new_block = !show_new_block" style="background-color:transparent; border:none; cursor:pointer; width:50px; text-align:left" class="text-800 m-0 p-0 px-2"> + </button> 
</span>
<div>
    <div v-if="show_wrapper" style="color:black" class="text-cyan-900">[
        <button v-if="show_wrapper" @click="show_new_block = !show_new_block" style="background-color:transparent; border:none; cursor:pointer; width:50px; text-align:left; width:50px; text-align:left" class="text-800 m-0 p-0 px-2"> + </button>
    </div>
    <div v-if="show_new_block" class="border-dashed border-300 p-0 m-0">
        <div class="m-0 p-0">
            <v-select v-model="new_data_selected" :options="books" label="title"></v-select>
        </div>
        <div>
            <q-input class="p-0 m-0" filled v-model="new_key" label="key-name"></q-input>
        </div>
        <div>
            <q-btn @click="add_new_fun()" class="p-0 m-0 text-700" flat>Submit</q-btn>
        </div>
    </div>
    <div>
        {{Value}}
    </div>
    <div v-for="(a, a_no) in Value" class="my-0 px-3">
        <div>
            <toggle-content :show_inner_p="false">
                <template v-slot:control>
                    <div>
                        <button class="toggle-handle m-0 text-800 p-0" style="background-color:transparent; border:none; cursor:pointer">
                            <span class="m-0 p-0 text-1000" style="color:black"> {{ a[0]}} {{a[0]}}  : </span>
                            <span class="m-0 p-0">
                                <button class="p-0 text-1000 m-0" style="background-color:transparent; border:none; cursor:pointer;">
                                    <span class="text-cyan-900">
                                        
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'string'">
                                            <i> {{ JSON.stringify(Value[a_no][1].toString().slice(0, 25)) }} </i>
                                        </span>
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'number'">
                                            <i> {{ Value[a_no][1].toString().slice(0, 25) }} </i>
                                        </span>
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'boolean'">
                                            <i> {{ Value[a_no][1].toString().slice(0, 25) }} </i>
                                        </span>
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'array-basic'">
                                            <i> [ {{Value[a_no][1].length}} ] </i>
                                        </span>
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'array-obj'">
                                            <i> [{{Value[a_no][1].length}}]* </i>
                                        </span>
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'object'">
                                            <i> {{ "{ " + Object.keys(Value[a_no][1]).length + " }" }} </i>
                                        </span>
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'function-basic'"> <i> f </i> </span>
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'function-arrow'"> <i> f => </i> </span>
                                        <span v-if="g.f.get_type(Value[a_no][1]) == 'function-async'"> <i> f async </i> </span>
                                    </span>
                                    <q-popup-proxy class="p-0 m-0 border-1" context-menu>
                                        <div>
                                            <button class="mx-3" style="background-color:transparent; border:none" @click="Value.splice(a_no, 1); update_parent()"> X </button>
                                            <button class="mx-2" style="background-color:transparent; border:none" @click="dup_item(a_no)">Dup</button>
                                            <button class="mx-2" style="background-color:transparent; border:none" @click="g.f.array_move(Value, a_no, (a_no-1)); update_parent()">Up</button>
                                            <button class="mx-2" style="background-color:transparent; border:none" @click="g.f.array_move(Value, a_no, (a_no+1)); update_parent()">Dn</button>
                                        </div>
                                        <div class="p-0 m-0 mx-3">
                                            <input style="border:none" @blur="Value[a_no][0] = $event.target.value; update_parent()" :Value="Value[a_no][0]" />
                                        </div>
                                        <div class="p-0 m-0">
                                            <select style="background-color:transparent; border:none"
                                                v-model="new_data_selected" class="p-1 mx-2">
                                                <template v-for="a in books">
                                                    <option> {{a}} </option>
                                                </template>
                                            </select>
                                            <button @click="Value[a_no][1] = change_type(); update_parent()" class="mx-2" style="background-color:transparent; border:none">
                                                Change
                                            </button>
                                        </div>
                                    </q-popup-proxy>
                                </button>
                            </span>
                        </button>
                    </div>
                </template>
                <div v-if="typeof Value[a_no][1] == 'string'">
                    <j-string :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                </div>
                <div v-if="typeof Value[a_no][1] == 'number'">
                    <j-number :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                </div>
                <div v-if="typeof Value[a_no][1] == 'boolean'">
                    <j-boolean :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                </div>
                <div v-if="typeof Value[a_no][1] == 'object' && (Array.isArray(Value[a_no][1])==true)">
                    <j-array-basic v-if="g.f.get_array_type(Value[a_no][1]) == 'array-basic'" :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                    <j-array-obj v-if="g.f.get_array_type(Value[a_no][1]) == 'array-obj'" :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                </div>
                <div v-if="typeof Value[a_no][1] == 'object' && Array.isArray(Value[a_no][1])==false">
                    <j-object :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                </div>
                <div v-if="typeof Value[a_no][1] == 'function'">
                    <div v-if="g.f.get_fun_type(Value[a_no][1]) == 'function-basic'">
                        <j-function-basic :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                    </div>
                    <div v-if="g.f.get_fun_type(Value[a_no][1]) == 'function-arrow'">
                        <j-function-arrow :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                    </div>
                    <div v-if="g.f.get_fun_type(Value[a_no][1]) == 'function-async'">
                        <j-function-async :parsed="Value[a_no][1]" @update="Value[a_no][1] = $event; update_parent();" />
                    </div>
                </div>
            </toggle-content>
        </div>
    </div>
    <div v-if="show_wrapper" style="color:black" class="text-cyan-900">]</div>
</div>        
        
        `,
        data() {
            return {
                show_new_block: false,
                new_key: "new_1",
                Value: null,
                new_data_model: false,
                new_data_selected: 'string',
                books: [
                    "string",
                    "number",
                    "boolean",
                    "object",
                    "array-basic",
                    "array-obj",
                    "function-basic",
                    "function-arrow",
                    "function-async"
                ]
            }
        },
        setup: function (props, { attrs, slots, emit, expose }) {
            return {
                g: Vue.computed(() => g)
            };
        },
        props: {
            parsed: { required: true },
            show_wrapper: { required: false, default: true },
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
            change_type() {
                var new_data_type = g.JSON.parse(g.JSON.stringify(this.new_data_selected))
                var r = "new string"
                switch (new_data_type) {
                    case "string":
                        r = "new string"
                        break;

                    case "number":
                        r = 0
                        break;

                    case "boolean":
                        r = true
                        break;

                    case "object":
                        r = {}
                        break;

                    case "array-basic":
                        r = []
                        break;

                    case "array-obj":
                        r = []
                        break;

                    case "function-basic":
                        r = function () { }
                        break;

                    case "function-arrow":
                        r = (a, b) => a * b
                        break;

                    case "function-async":
                        r = async function () { }
                        break;

                    default: break;
                }

                return r
            },
            dup_item(a_no) {
                var a = g.JSONF.parse(g.JSONF.stringify(this.Value))
                var b = a[a_no]
                b[0] = b[0] + "_copy"
                this.Value.splice(a_no + 1, 0, b)
                this.update_parent()
            },
            add_new_fun() {
                var new_data_type = g.JSON.parse(g.JSON.stringify(this.new_data_selected))
                var new_key_name = g.JSON.parse(g.JSON.stringify(this.new_key))

                switch (new_data_type) {
                    case "string":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, "new string"]
                        )
                        break;

                    case "number":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, 0]
                        )
                        break;

                    case "boolean":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, true]
                        )
                        break;

                    case "object":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, {}]
                        )
                        break;

                    case "array-basic":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, []]
                        )
                        break;

                    case "array-obj":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, []]
                        )
                        break;

                    case "function-basic":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, function () { }]
                        )
                        break;

                    case "function-arrow":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, (a, b) => a * b]
                        )
                        break;

                    case "function-async":
                        this.Value.splice((this.Value.length + 1), 0,
                            [new_key_name, async function () { }]
                        )
                        break;

                    default: break;
                }
                this.show_new_block = !this.show_new_block
                this.update_parent()
            },
            update_parsed() {
                this.Value = this.parsed
            },
            update_parent() {
                this.$emit('update', this.Value)
            },
        }
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
    get_type(Value) {
        if (typeof Value == 'string') { return "string" }
        if (typeof Value == 'number') { return "number" }
        if (typeof Value == 'boolean') { return "boolean" }
        if (typeof Value == 'object' && (Array.isArray(Value) == true)) {
            if (g.f.get_array_type(Value) == 'array-basic') { return 'array-basic' }
            if (g.f.get_array_type(Value) == 'array-obj') { return 'array-obj' }
        }
        if (typeof Value == 'object' && (Array.isArray(Value) == false)) { return "object" }
        if (typeof Value == 'function') {
            if (g.f.get_fun_type(Value) == 'function-basic') { return "function-basic" }
            if (g.f.get_fun_type(Value) == 'function-arrow') { return "function-arrow" }
            if (g.f.get_fun_type(Value) == 'function-async') { return "function-async" }
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
    get_array_type(arr) {
        if (arr.length) {
            var r = false
            try {
                var a = g.f.array_to_obj(arr)
                r = true
            } catch (error) { }
            if (r) { return "array-obj" }
            else { return "array-basic" }
        }
        else { return "array-basic" }
    },
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
    get_socket_address() {
        if (g.f.is_local_host()) { return 'http://localhost:8080/' }
        else { return 'http://super1mpsir-57484.portmap.host:57484/' }
    },
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
    }
}