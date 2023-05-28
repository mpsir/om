globalThis.install_db = {
    settings: [
        { // App
            name: "App",
            app_version: "1.2",
            log_status: false,
            default_lang: 'eng'
        }
    ],
    pages: [
        { // Home
            name: "Home",
            template: `
            <div style="padding:16px"> <json_editor :parsed="pages" /> </div>
            <pre v-if="true" style="padding:16px"> {{ g.r }} </pre>`,
            page_title: "home-page",
            computed: {
                g: function () { return g }
            },
            data: function () {
                return {
                    pages: [1]
                }
            },
            components: [
                 'object_editor', 'array_editor', 'json_editor',
            ]
        },
        { // SelectLang
            name: "SelectLang",
            template: "SelectLang",
            page_title: "SelectLang"
        },
        { // Error_Not_Found
            name: "Error_Not_Found",
            template: "Error_Not_Found",
            page_title: "Error_Not_Found"
        },
    ],
    comps: [
        { // json_editor
            name: "json_editor",
            template: `
            <div class="p-0 m-0" v-bind="$attrs"> 
                <div v-if="Array.isArray(Value)">
                    <div>[</div>
                    <div style="margin-left:16px">
                        <array_editor></array_editor>
                    </div>
                    <div>]</div>
                </div>
                <div v-else>
                    <div>{</div>
                    <div style="margin-left:16px">
                    <object_editor></object_editor>
                    </div>
                    <div>}</div>
                </div>
            </div>`,
            computed: {
                g: function () { return g }
            },
            data: function () { return { Value: null } },
            setup: function (props, { attrs, slots, emit, expose }) {
                return { g: Vue.computed(() => g) };
            },
            props: {
                parsed: {
                    required: true,
                    type: ["Array", "Object"]
                }
            },
            emits: ['update'],
            created: function () {
                this.update_parsed()
            },
            watch: {
                parsed: {
                    handler: function (newValue, oldValue) { this.update_parsed() },
                    deep: true
                }
            },
            methods: {
                update_parsed: function () { this.Value = this.parsed },
                update_parent: function () { this.$emit('update', this.Value) },
            }
        },
        { // 'object_editor'
            name: "object_editor",
            template: `
            <div class="p-0 m-0" v-bind="$attrs"> 
            object_editor
            </div>`,
            computed: {
                g: function () { return g }
            },
            data: function () { return { Value: null } },
            setup: function (props, { attrs, slots, emit, expose }) {
                return { g: Vue.computed(() => g) };
            },
            props: {
                parsed: {
                    required: true,
                    type: ["Object"]
                }
            },
            emits: ['update'],
            created: function () {
                this.update_parsed()
            },
            watch: {
                parsed: {
                    handler: function (newValue, oldValue) { this.update_parsed() },
                    deep: true
                }
            },
            methods: {
                update_parsed: function () { this.Value = this.parsed },
                update_parent: function () { this.$emit('update', this.Value) },
            }
        },
        { // array_editor
            name: "array_editor",
            template: `
            <div class="p-0 m-0" v-bind="$attrs"> 
                array_editor
            </div>`,
            computed: {
                g: function () { return g }
            },
            data: function () { return { Value: null } },
            setup: function (props, { attrs, slots, emit, expose }) {
                return { g: Vue.computed(() => g) };
            },
            props: {
                parsed: {
                    required: true,
                    type: ["Array"]
                }
            },
            emits: ['update'],
            created: function () {
                this.update_parsed()
            },
            watch: {
                parsed: {
                    handler: function (newValue, oldValue) { this.update_parsed() },
                    deep: true
                }
            },
            methods: {
                update_parsed: function () { this.Value = this.parsed },
                update_parent: function () { this.$emit('update', this.Value) },
            }
        }
    ]
}