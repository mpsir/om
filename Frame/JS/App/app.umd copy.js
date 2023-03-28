! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(require("vue")) : "function" == typeof define && define.amd ? define(["vue"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).Vue)
}(this, (function(vue) {
    "use strict";
    const _sfc_main$2 = {
            data: () => ({}),
            components: {}
        },
        _hoisted_1$2 = {
            style: {
                "background-color": "aqua"
            }
        };

    function _sfc_render$2(e, t, a, o, r, n) {
        return vue.openBlock(), vue.createBlock("div", _hoisted_1$2, " AppEditor ")
    }
    _sfc_main$2.render = _sfc_render$2;
    const _sfc_main$1 = {
            data: () => ({
                Value: null,
                input_type: "string"
            }),
            setup: function(e, {
                attrs: t,
                slots: a,
                emit: o,
                expose: r
            }) {
                return {
                    editor: {},
                    g: Vue.computed((() => g))
                }
            },
            props: {
                modelValue: {
                    type: String,
                    required: !0
                },
                update_text: {
                    type: String,
                    required: !1,
                    default: "Update"
                },
                lang: {
                    type: String,
                    required: !1,
                    default: "json"
                },
                format_on_start: {
                    type: Boolean,
                    required: !1,
                    default: !0
                },
                IsReadOnly: {
                    type: Boolean,
                    required: !1,
                    default: !0
                }
            },
            emits: ["update:modelValue", "update"],
            created() {
                this.update_modelValue()
            },
            watch: {
                modelValue: {
                    handler(e, t) {
                        this.update_modelValue()
                    },
                    deep: !0
                }
            },
            mounted() {
                var e = this;
                this.editor = g.monaco.editor.create(this.$refs.m_editor, {
                    value: e.Value,
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: !0,
                    language: e.lang,
                    readOnly: !1,
                    minimap: {
                        enabled: !1
                    },
                    showFoldingControls: "always",
                    scrollbar: {
                        vertical: "hidden",
                        horizontal: "visible"
                    },
                    overviewRulerBorder: !1
                }), setTimeout((() => {
                    this.update_editor()
                }), 100), e.format_on_start && (setTimeout((() => {
                    this.editor.getAction("editor.action.formatDocument").run()
                }), 500), this.Value = this.editor.getValue()), this.editor.getModel().onDidChangeContent((t => {
                    e.update_editor(), e.Value = e.editor.getValue(), e.$emit("update:modelValue", e.Value)
                }));
                const t = () => {
                    this.editor.getContribution("editor.contrib.folding").getFoldingModel().then((t => {
                        t.onDidChange((() => {
                            e.Value = e.editor.getValue()
                        }))
                    }))
                };
                t(), this.editor.onDidChangeModel(t)
            },
            methods: {
                update_editor: function() {
                    const e = 19 * this.editor.getModel().getLineCount();
                    $(this.$refs.m_editor).css("height", e + "px"), this.editor.layout(), this.Value = this.editor.getValue()
                },
                update_modelValue() {
                    this.Value = this.modelValue;
                    try {
                        this.editor.getModel().setValue(this.modelValue), this.format_on_start && this.editor.getAction("editor.action.formatDocument").run()
                    } catch (e) {}
                },
                update_parent() {
                    this.$emit("update", this.Value)
                }
            }
        },
        _hoisted_1$1 = {
            key: 0
        },
        _hoisted_2 = {
            style: {
                border: "1px dashed darkgrey"
            }
        },
        _hoisted_3 = {
            ref: "m_editor",
            style: {
                "min-height": "28px"
            }
        };

    function _sfc_render$1(e, t, a, o, r, n) {
        const s = vue.resolveComponent("q-btn");
        return vue.openBlock(), vue.createBlock(vue.Fragment, null, [a.IsReadOnly ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createBlock("div", _hoisted_1$1, [vue.createVNode(s, {
            onClick: t[1] || (t[1] = e => n.update_parent()),
            color: "white",
            "text-color": "black",
            label: a.update_text,
            "no-caps": ""
        }, null, 8, ["label"])])), vue.createVNode("div", _hoisted_2, [vue.createVNode("div", _hoisted_3, null, 512)])], 64)
    }
    _sfc_main$1.render = _sfc_render$1;
    const _sfc_main = {
            props: {
                show_inner_p: {
                    type: Boolean,
                    default: !0,
                    required: !1
                }
            },
            data: () => ({
                show_inner: !0
            }),
            created() {
                this.show_inner = this.show_inner_p
            },
            mounted() {
                var e = this,
                    t = this.$refs.controls;
                if ((a = $(t).find(".toggle-handle"))[0]) {
                    var a = a[0];
                    $(a).click((function() {
                        e.show_inner = !e.show_inner
                    }))
                } else console.log("no handle found", '\nadd "toggle-handle" class to any ui element.')
            }
        },
        _hoisted_1 = {
            ref: "controls"
        };

    function _sfc_render(e, t, a, o, r, n) {
        return vue.openBlock(), vue.createBlock(vue.Fragment, null, [vue.createVNode("span", _hoisted_1, [vue.renderSlot(e.$slots, "control")], 512), r.show_inner ? vue.renderSlot(e.$slots, "default", {
            key: 0
        }) : vue.createCommentVNode("", !0)], 64)
    }
    _sfc_main.render = _sfc_render, g.AddDB = async function() {
        var e = await g.Dexie.exists("ShreeRam");
        g.db = await new g.Dexie("ShreeRam"), g.db.version(1).stores({
            pages: "++id, &name",
            comps: "++id, &name",
            opts: "++id, &name",
            templates: "++id, &name",
            js: "++id, &name",
            css: "++id, &name",
            images: "++id, &name",
            blobs: "++id, &name"
        }), e || (g.db.pages.bulkAdd(g.pages), g.db.comps.bulkAdd(g.comps))
    }, g.DeleteDb = async function(e = !1) {
        g.db.delete(), e && location.reload()
    };
    var GetAppFromDB = async function(e) {
        var t = await g.db.pages.toArray();
        return t = t.find((function(t) {
            return t.name == e
        }))
    };

    function render_template(e) {
        var t = "";
        if ("string" == typeof e) return e;
        if ("object" == typeof e) {
            if (Array.isArray(e)) return e.forEach((e => {
                t += function(e) {
                    return "string" == typeof e ? e : "object" == typeof e ? "<div> object-demo </div>" : ""
                }(e)
            })), t;
            t += (temp, "<div> object-demo </div>")
        }
        return "<div>Template-Resove-Type : Unknown</div>"
    }

    function CreateAppEditor() {
        g.AppEditor_Wrapper = Vue.createApp(_sfc_main$2), g.AppEditor_Wrapper.use(Quasar), g.AppEditor_Wrapper.use(window.VueShortkey), g.AppEditor_Wrapper.use(vdrag, {}), g.AppEditor_Wrapper.use(Vue3DraggableResizable.default), g.AppEditor_Wrapper.component("draggable", vuedraggable), g.AppEditor_Wrapper.component("monaco-editor", _sfc_main$1), g.AppEditor_Wrapper.component("toggle-content", _sfc_main), g.AppEditor = g.AppEditor_Wrapper.mount("#editor-div")
    }
    var CreateApp = async function() {
        g.r.current_page_name = g.f.get_page_name();
        var page_object = await GetAppFromDB(g.r.current_page_name),
            page_object_2 = {};
        if (g.r.current_page_object = page_object, page_object.hasOwnProperty("template") && (page_object_2.template = render_template(page_object.template)), page_object.hasOwnProperty("setup")) {
            var try_me = `page_object_2.setup = ${page_object.setup}`;
            console.log(try_me), eval(try_me)
        }
        if (page_object.hasOwnProperty("data")) {
            var try_me = `page_object_2.data = ${page_object.data}`;
            console.log(try_me), eval(try_me)
        }
        if (page_object.hasOwnProperty("computed")) {
            var try_me = `page_object_2.computed = ${page_object.computed}`;
            console.log(try_me), eval(try_me)
        }
        g.App_Wrapper = Vue.createApp(page_object_2);
        var use_quasar = page_object.use_quasar || !1;
        use_quasar && g.App_Wrapper.use(Quasar);
        var use_vue_shortkey = page_object.use_vue_shortkey || !1;
        use_vue_shortkey && g.App_Wrapper.use(window.VueShortkey);
        var use_vdrag = page_object.use_vdrag || !1;
        use_vdrag && g.App_Wrapper.use(vdrag, {});
        var use_DraggableResizable = page_object.use_DraggableResizable || !1;
        use_DraggableResizable && g.App_Wrapper.use(Vue3DraggableResizable.default);
        var use_draggable = page_object.use_draggable || !1;
        use_draggable && g.App_Wrapper.component("draggable", vuedraggable);
        var use_MonacoEditor = page_object.use_MonacoEditor || !1;
        use_MonacoEditor && (r += g.App_Wrapper.component("monaco-editor", _sfc_main$1));
        var use_ToggleContent = page_object.use_ToggleContent || !1;
        use_ToggleContent && g.App_Wrapper.component("toggle-content", _sfc_main), g.App = g.App_Wrapper.mount("#app-div")
    };
    g.start = async function() {
        g.f.add_socket(), await g.AddDB(), await Dexie.liveQuery((() => db.pages.toArray())).subscribe((function(e) {
            g.f.update()
        })), await Dexie.liveQuery((() => db.comps.toArray())).subscribe((function(e) {
            g.f.update()
        })), await Dexie.liveQuery((() => db.opts.toArray())).subscribe((function(e) {
            g.f.update()
        })), await Dexie.liveQuery((() => db.templates.toArray())).subscribe((function(e) {
            g.f.update()
        })), await CreateApp(), await CreateAppEditor()
    }, g.pages = [{
        name: "home",
        template: ['\n    <div class="q-pt-sm" style="background-color:grey">\n      <button class="q-pa-sm q-ma-sm" onclick="g.DeleteDb(true)">Delete Database</button>\n      <div>\n        ...\n      </div>\n    </div>\n  '],
        data: "function (){ return {} }",
        setup: "function (props, { attrs, slots, emit, expose }) { return { } }",
        computed: "{ g(){ return g } }",
        use_quasar: !0,
        use_vue_shortkey: !0,
        use_vdrag: !0,
        use_DraggableResizable: !0,
        use_draggable: !0,
        use_MonacoEditor: !0,
        use_ToggleContent: !0,
        components: {}
    }, {
        name: "home2",
        template: "ok2",
        data: "data(){ return {} }",
        setup: "function setup(props, { attrs, slots, emit, expose }) { return { } }",
        computed: "computed: { g(){ return g } }",
        use_quasar: !0,
        use_vue_shortkey: !0,
        use_vdrag: !0,
        use_DraggableResizable: !0,
        use_draggable: !0,
        use_MonacoEditor: !0,
        use_ToggleContent: !0,
        components: {}
    }], g.comps = [{
        name: "comp1",
        template: ['\n    <div class="q-pa-sm">\n      This is comp1\n    </div>\n  '],
        data: "data(){ return {} }",
        setup: "setup(props, { attrs, slots, emit, expose }) { return { } }",
        computed: "computed: { g(){ return g } }",
        components: {}
    }], g.d = {}, g.r = Vue.reactive({
        IsLive: !0,
        IsLivePages: !0,
        funs: {
            type: "Script",
            body: [{
                type: "ast-string"
            }]
        }
    }), g.f = {
        pstring: e => JSON.parse(JSON.stringify(e)),
        string: e => JSON.stringify(e),
        parse: e => JSON.parse(e),
        is_local_host: function() {
            return "8080" == location.port || "3000" == location.port
        },
        add_socket() {
            var e = {},
                t = !1;
            g.f.is_local_host() ? (e = io("http://localhost:8080/"), t = !0) : "mpsir.github.io" != location.host && (e = g.io("http://super1mpsir-57484.portmap.host:57484/"), t = !0), t && e.on("connect", (() => {}))
        },
        live_data: e => VueUse.useObservable(Dexie.liveQuery(e)),
        get_page_name() {
            var e = location.search;
            if ("" == e) return "home";
            const t = new URLSearchParams(e).get("page");
            return t || "home"
        },
        async update() {
            g.App && g.r.IsLive && g.r.IsLivePages
        }
    }
}));