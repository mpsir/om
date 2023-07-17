var r = "";
const p = location.origin;
p == "http://localhost:8080" ? r = "http://localhost:8080" : p == "http://localhost:3000" ? r = "http://localhost:3000" : r = // "https://mpsir.github.io/om"
"http://super1mpsir-57484.portmap.host:57484";
function m(n, e = !1) {
  var a = !1, t = new XMLHttpRequest();
  return t.withCredentials = !0, t.onreadystatechange = function() {
    this.readyState == 4 && this.status == 200 && (a = this.responseText);
  }, t.open("GET", n, e), t.send(), a;
}
function d(n, e) {
  localStorage.setItem(n, JSON.stringify(e));
}
async function f() {
  d("Pages", [
    {
      name: "Home",
      data: `var Page = {
            Libs:[ "jq-ui", "material-icons", "roboto", "rx-js", "vue-use", "socket-io", "vue-quasar", 
                    "vue-iframe", "vue-shortkey", "vue-select", "vue-sortable", 
                    "vue-draggable", "monaco-editor"
                ],
            Comps:["Quasar", "v-select", "i-frame", "monaco-editor", "toggle-content", "draggable", "j-edit", "array-edit"],
            Directive:["resize"],    
            VApp : {
                template:"<div style='padding:16px'> {{ a }}  <br/> <j-edit v-model='a'></j-edit> </div> ",
                data: function() {
                    return {
                        a:{ a:"a1" }
                    }
                }
            }
        }`
    },
    {
      name: "404",
      data: `var Page = {  
            VApp : {
                template:"404 page"
            }
        }`
    }
  ]), d("Components", [
    {
      name: "comp1",
      data: `var Comp = {
                VApp:{
                    template:"this is comp1"
                }
            }`
    }
  ]), d("Directives", []), d("UsePlugins", []), d("Mixin", []), d("Composable", []), d("Templates", []);
}
var u = { Version: 1 };
function k() {
  return !!localStorage.getItem("Frame_VP");
}
function j() {
  console.log(`
checking for upgrading ...`);
  var n = !1;
  return console.log("Frame.Version", u.Version), localStorage.getItem("Frame_VP") ? (console.log("local db version ", JSON.parse(localStorage.getItem("Frame_VP")).Version), n = JSON.parse(localStorage.getItem("Frame_VP")).Version !== u.Version) : (console.log('localStorage "Frame_VP" not found'), n = !1), console.log("IsUpgradable", n + `

`), n;
}
async function S() {
  console.log(`Upgrading

`), y();
}
console.log(`
TargetURL`, r + `
`);
async function L() {
  function n(e, a) {
    localStorage.setItem(e, m(r + a));
  }
  console.log("installing ..."), n("JS_CoreJS", "/Lib/core-js-bundle@3.29.1/minified.min.js"), n("JS_VueDev", "/Lib/vue/vue.global.min.js"), n("JS_JQ", "/Lib/jq/jquery.js"), n("JS_Dexie", "/Lib/dexie/dexie.min.js"), n("JS_RandomBytes", "/Lib/my-random-bytes.js"), n("JS_Serialize", "/Lib/my-serialize.js"), await f(), localStorage.setItem("Frame_VP", JSON.stringify(u));
}
function y(n = !0, e = !0) {
  console.log("deleting frame ..."), n ? localStorage.clear() : localStorage.removeItem("Frame_VP"), e && location.reload();
}
globalThis.AppDelete = y;
async function l(n, e) {
  var t = (await g.db.Libs.toArray()).find(function(o) {
    return o.name == n;
  });
  if (t)
    return t.data;
  const s = m(e);
  return await g.db.Libs.add({ name: n, data: s }), s;
}
var q = "https://mpsir.github.io/om", i = r, b = !1;
r == "http://super1mpsir-57484.portmap.host:57484" ? i = q : (i = r, b = !0);
async function P(n) {
  for (const a of n)
    switch (a) {
      case "material-icons":
        g.d.Libs.find((t) => t == "material-icons") || ($("head").append(`<link rel="stylesheet" data-dyn-name="material-icons" href="${i}/Lib/material-icons/iconfont/material-icons.css">`), g.d.Libs.push("material-icons"));
        break;
      case "roboto":
        var e = g.d.Libs.find((t) => t == "roboto");
        e || (b ? $("head").append(`<link rel="stylesheet" data-dyn-name="roboto" href="${i}/CSS/roboto-local.css">`) : $("head").append(`<link rel="stylesheet" data-dyn-name="roboto" href="${i}/CSS/roboto.css">`), g.d.Libs.push("roboto"));
        break;
      case "vue-select":
        g.d.Libs.find((t) => t == "vue-select") || ($("head").append(`
                    <style data-dyn-name="vue-select-css"> 
                        ${await l("vue-select-css", `${r}/Lib/vue-select/vue-select.css`)} 
                    </style>`), $("body").append(`
                    <script data-dyn-name="vue-select-js" class="remove-me" async="false">
                        ${await l("vue-select-js", `${r}/Lib/vue-select/vue-select.umd.js`)}
                    <\/script>`), g.d.Libs.push("vue-select"));
        break;
      case "rx-js":
        g.d.Libs.find((t) => t == "rx-js") || ($("body").append(`
                    <script data-dyn-name="rx-js" class="remove-me" async="false">
                        ${await l("rx-js", `${r}/Lib/rxjs.umd.min.js`)}
                    <\/script>`), g.d.Libs.push("rx-js"));
        break;
      case "vue-use":
        g.d.Libs.find((t) => t == "vue-use") || ($("body").append(`
                        <script data-dyn-name="vueuse-shared" class="remove-me" async="false">
                            ${await l("vueuse-shared", `${r}/Lib/@vueuse/shared@9.13.0/index.iife.min.js`)}
                        <\/script>
                        <script data-dyn-name="vueuse-core" class="remove-me" async="false">
                            ${await l("vueuse-core", `${r}/Lib/@vueuse/core@9.13.0/index.iife.min.js`)}
                        <\/script>
                        <script data-dyn-name="vueuse-rx-js" class="remove-me" async="false">
                            ${await l("rx-js", `${r}/Lib/@vueuse/rxjs/index.iife.min.js`)}
                        <\/script>`), g.d.Libs.push("vue-use"));
        break;
      case "monaco-editor":
        g.d.Libs.find((t) => t == "monaco-editor") || ($("head").append(`<link rel="stylesheet" data-name="vs/editor/editor.main" href="${i}/Lib/monaco-editor/min/vs/editor/editor.main.css">`), $("body").append(`<script class="remove-me" async="false"> const require = { paths: { vs: '${i}/Lib/monaco-editor/min/vs' } }; <\/script>
                        <script class="remove-me" async="false" src="${i}/Lib/monaco-editor/min/vs/loader.js"><\/script>
                        <script class="remove-me" async="false" src="${i}/Lib/monaco-editor/min/vs/editor/editor.main.nls.js"><\/script>
                        <script class="remove-me" async="false" src="${i}/Lib/monaco-editor/min/vs/editor/editor.main.js"><\/script>`), g.d.Libs.push("monaco-editor"));
        break;
      case "socket-io":
        g.d.Libs.find((t) => t == "socket-io") || ($("body").append(`<script data-dyn-name="socket.io" class="remove-me" async="false">
                        ${await l("socket-io", `${r}/Lib/socket-io-client.js`)}
                    <\/script>`), g.d.Libs.push("socket-io"));
        break;
      case "jq-ui":
        g.d.Libs.find((t) => t == "jq-ui") || ($("head").append(`<link rel="stylesheet" href="${i}/Lib/jq/jquery-ui.min.css">`), $("body").append(`<script class="remove-me" async="false"  src="${i}/Lib/jq/jquery-ui.min.js" ><\/script>
                    <script data-dyn-name="touch-jq-ui" class="remove-me" async="false">
                        ${await l("touch-jq-ui", `${r}/Lib/jq/touch.js`)}
                    <\/script>`), g.d.Libs.push("jq-ui"));
        break;
      case "vue-quasar":
        g.d.Libs.find((t) => t == "vue-quasar") || ($("head").append(`
                    <style data-dyn-name="vue-quasar-css"> 
                        ${await l("vue-quasar-css", `${r}/Lib/quasar/quasar.css`)} 
                    </style>`), $("body").append(`
                    <script data-dyn-name="vue-quasar-js" class="remove-me" async="false">
                        ${await l("vue-quasar-js", `${r}/Lib/quasar/quasar.js`)} 
                    <\/script>`), g.d.Libs.push("vue-quasar"));
        break;
      case "vue-iframe":
        g.d.Libs.find((t) => t == "vue-iframe") || ($("body").append(`
                    <script data-dyn-name="vue-iframe-host" class="remove-me">
                        ${await l("vue-iframe-host", `${r}/Lib/iframe-resize/iframe-host.js`)}
                    <\/script>
                    <script data-dyn-name="vue-iframe-client" class="remove-me" async="false">
                        ${await l("vue-iframe-client", `${r}/Lib/iframe-resize/iframe-client.js`)}
                    <\/script>`), g.d.Libs.push("vue-iframe"));
        break;
      case "vue-shortkey":
        g.d.Libs.find((t) => t == "vue-shortkey") || ($("body").append(`
                    <script data-dyn-name="vue-shortkey" class="remove-me" async="false">
                        ${await l("vue-shortkey", `${r}/Lib/vue3-shortkey.min.js`)}
                    <\/script>`), g.d.Libs.push("vue-shortkey"));
        break;
      case "vue-sortable":
        g.d.Libs.find((t) => t == "vue-sortable") || ($("body").append(`<script data-dyn-name="vue-sortable" class="remove-me" async="false">
                        ${await l("vue-sortable", `${r}/Lib/sortablejs/Sortable.min.js`)}
                    <\/script>`), g.d.Libs.push("vue-sortable"));
        break;
      case "vue-draggable":
        g.d.Libs.find((t) => t == "vue-draggable") || ($("body").append(`<script class="remove-me" async="false">
                        ${await l("vue-draggable", `${r}/Lib/vuedraggable/vuedraggable.umd.min.js`)}
                    <\/script>`), g.d.Libs.push("vue-draggable"));
        break;
    }
  $(".remove-me").remove();
}
const v = function() {
  return JSON.parse(localStorage.getItem("Pages"));
}, A = function(n) {
  return v().find(function(e) {
    return e.name == n;
  }).data;
};
function T() {
  const n = location.search;
  if (n == "")
    return "Home";
  const e = new URLSearchParams(n).get("page");
  return e && v().find(function(t) {
    return t.name == e;
  }) ? e : "404";
}
async function h() {
  const n = T();
  console.log(`
PageName`, n), g.ev(A(n)), console.log(`
Creating Page : ${n}`), console.log(`PageData
`, Page), Page.hasOwnProperty("Libs") && Page.Libs.length && await P(Page.Libs), g.App_Wrapper = g.Vue.createApp(Page.VApp), Page.hasOwnProperty("Comps") && (Page.Comps.includes("Quasar") && g.App_Wrapper.use(g.Quasar), Page.Comps.includes("v-select") && g.App_Wrapper.component("v-select", window["vue-select"]), Page.Comps.includes("i-frame") && g.App_Wrapper.component("i-frame", {
    template: '<iframe ref="i1" v-bind="$attrs" style="width: 1px; min-width: 100%; border:none"></iframe>',
    mounted: function() {
      g.iFrameResize({ log: !1 }, this.$refs.i1);
    },
    computed: { g: function() {
      return g;
    } }
  }), Page.Comps.includes("monaco-editor") && g.App_Wrapper.component("monaco-editor", {
    template: `<div v-bind="$attrs">
            <div v-if="!IsReadOnly">
              
              <q-btn 
                    flat 
                    class="p-0 m-0 text-400" 
                    @click="update_parent()" 
                    text-color="blue" 
                    icon="done_all"
                    :label="update_text"
                no-caps>
              </q-btn>
            </div>
            <div>
              <div ref="m_editor" style="min-height:28px; height: 100%; width:100%"></div>
            </div>
          </div>`,
    data() {
      return { Value: null, input_type: "string" };
    },
    setup: function(e, { attrs: a, slots: t, emit: s, expose: o }) {
      return {
        editor: {},
        g: Vue.computed(() => g)
      };
    },
    props: {
      parsed: { type: String, required: !0 },
      update_text: { type: String, required: !1, default: "" },
      lang: { type: String, required: !1, default: "javascript" },
      format_on_start: { type: Boolean, required: !1, default: !1 },
      IsReadOnly: { type: Boolean, required: !1, default: !1 }
    },
    emits: ["update:parsed", "update"],
    created() {
      this.update_parsed();
    },
    watch: {
      parsed: {
        handler(e, a) {
          this.update_parsed();
        },
        deep: !1
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
        minimap: { enabled: !1 },
        showFoldingControls: "always",
        scrollbar: { vertical: "hidden", horizontal: "visible" },
        overviewRulerBorder: !1,
        automaticLayout: !0,
        scrollBeyondLastLine: !1
        //theme: "vs-dark",
        // automaticLayout: true
      }), setTimeout(() => {
        this.update_editor();
      }, 100), e.format_on_start && (setTimeout(() => {
        this.editor.getAction("editor.action.formatDocument").run();
      }, 500), this.Value = this.editor.getValue()), this.editor.getModel().onDidChangeContent(
        (t) => {
          e.update_editor(), e.Value = e.editor.getValue(), e.$emit("update:parsed", e.Value);
        }
      );
      const a = () => {
        this.editor.getContribution("editor.contrib.folding").getFoldingModel().then((s) => {
          s.onDidChange(() => {
          });
        });
      };
      a(), this.editor.onDidChangeModel(a);
    },
    methods: {
      update_editor: function() {
        const e = this.editor.getModel().getLineCount() * 19;
        $(this.$refs.m_editor).css("height", e + "px"), this.editor.layout(), this.Value = this.editor.getValue();
      },
      update_parsed() {
        this.Value = this.parsed;
        try {
          this.editor.getModel().setValue(this.parsed), this.format_on_start && this.editor.getAction("editor.action.formatDocument").run();
        } catch {
        }
      },
      update_parent() {
        this.$emit("update", this.Value);
      }
    }
  }), Page.Comps.includes("toggle-content") && g.App_Wrapper.component("toggle-content", {
    template: `<span ref="controls" v-bind="$attrs">
            <slot name="control">
              <p>control slot is empty</p>
            </slot>
          </span>
          <slot v-if="show_inner">
            <p>default slot  is empty</p>
          </slot>`,
    props: {
      show_inner_p: { type: Boolean, default: !0, required: !1 }
    },
    data() {
      return { show_inner: !0 };
    },
    created() {
      this.show_inner = this.show_inner_p;
    },
    mounted() {
      var e = this, a = this.$refs.controls, t = $(a).find(".toggle-handle");
      if (!t[0])
        console.log("no handle found", `
add "toggle-handle" class to any ui element.`);
      else {
        var t = t[0];
        $(t).click(function() {
          e.show_inner = !e.show_inner;
        });
      }
    },
    setup: function(e, { attrs: a, slots: t, emit: s, expose: o }) {
      return { g: Vue.computed(() => g) };
    }
  }), Page.Comps.includes("draggable") && g.App_Wrapper.component("draggable", g.vuedraggable), Page.Comps.includes("j-edit") && g.App_Wrapper.component("j-edit", {
    template: `<span>
            <button style="color: #0420b7" @click="isOpened = !isOpened" class="btn-hide-1">
                {{ Array.isArray(flowValue) ? (' [  ' + (flowValue.length)) : (' { ' + (Object.keys(flowValue).length) ) }}
                <q-popup-proxy context-menu breakpoint="0">
                    <div>
                        <q-btn no-caps v-if="Array.isArray(flowValue)"
                            @click="flowValue.splice((flowValue.length + 1), 0, null); sendModelValue();">+</q-btn>
                        <q-btn no-caps v-else
                            @click="flowValue['new_key' + (Object.keys(flowValue).length + 1)] = null; sendModelValue();">+</q-btn>
                        <br />
                        <q-btn no-caps @click="isReArrange = !isReArrange">ReArrange</q-btn>
                    </div>
                </q-popup-proxy>
            </button>
            <div v-if="isReArrange" style="border:2px dotted lightblue" class="q-pa-sm">
                <button @click="isReArrange = false">X</button>
                <div>
                    ..... ..... .....
                </div>
            </div>
            <div v-if="isOpened" class="q-ml-md">
                <array-edit :objType="'array'" :modelValue="g.f.ArrayToKeyArray(flowValue)" v-if="Array.isArray(flowValue)"
                    @update:model-value="flowValue = g.f.KeyArrayToArray($event); sendModelValue();">
                </array-edit>
                <array-edit :objType="'object'" :modelValue="g.f.objectToKeyArray(flowValue)" v-else
                    @update:model-value="flowValue = g.f.KeyArrayToObject($event); sendModelValue()">
                </array-edit>
            </div>
            <button style="color: #0420b7;" @click="isOpened = !isOpened" class="btn-hide-1">
                {{ Array.isArray(flowValue) ? ']' : '}' }}
                <q-popup-proxy context-menu breakpoint="0">
                    <div>
                        <q-btn no-caps v-if="Array.isArray(flowValue)"
                            @click="flowValue.splice((flowValue.length + 1), 0, null); sendModelValue();">+</q-btn>
                        <q-btn no-caps v-else
                            @click="flowValue['new_key' + (Object.keys(flowValue).length + 1)] = null; sendModelValue();">+</q-btn>
                        <br />
                        <q-btn no-caps>ReArrange</q-btn>
                    </div>
                </q-popup-proxy>
            </button>
        </span>`,
    data() {
      return { flowValue: null, isOpened: !0, isReArrange: !1 };
    },
    setup: function(e, { attrs: a, slots: t, emit: s, expose: o }) {
      return {
        g: Vue.computed(() => g)
      };
    },
    props: {
      modelValue: {
        type: [Object, Array],
        required: !0
      },
      isopen: {
        type: Boolean,
        required: !1,
        default: !0
      }
    },
    emits: ["update:modelValue"],
    created() {
      this.isOpened = this.isopen, this.updateFlowValue();
    },
    watch: {
      modelValue: {
        handler: function(e, a) {
          g.f.PS(e) != g.f.PS(a) && this.updateFlowValue();
        },
        deep: !0
      }
    },
    methods: {
      updateFlowValue: function(e = this.modelValue) {
        this.flowValue = g.f.PS(e);
      },
      sendModelValue: function(e = this.flowValue) {
        this.$emit("update:modelValue", g.f.PS(e));
      }
    }
  }), Page.Comps.includes("array-edit") && g.App_Wrapper.component("array-edit", {
    template: `<div v-bind="$attrs">
            <div v-for="(element, element_no) in flowValue">
                <button class="btn-hide-1">
                    <span style=" color:#0420b7">
                        <span v-if="objType == 'object'">{{ element.name }}</span>
                        <span v-if="false && objType == 'array'">{{ element }}</span>
                        <span v-if="objType == 'array'">{{ element_no + 1 }}</span>
                    </span>
                    <q-popup-proxy  breakpoint="0">
                        <div v-if="objType == 'object'">
                            <input class="q-pl-sm" type="text" v-model="element.name" @blur="sendModelValue()" />
                        </div>
                        <div>
                            <span @click="element.data = null; sendModelValue()"
                                :style="g.f.getType(element.data) == 'null' ? checked_style : un_checked_style">null</span>
                            <span @click="element.data = undefined; sendModelValue()"
                                :style="g.f.getType(element.data) == 'undefined' ? checked_style : un_checked_style">undefined</span>
                            <span @click="element.data = 'strings'; sendModelValue()"
                                :style="g.f.getType(element.data) == 'string' ? checked_style : un_checked_style">string</span>
                            <br />
                            <span @click="element.data = 0; sendModelValue()"
                                :style="g.f.getType(element.data) == 'number' ? checked_style : un_checked_style">number</span>
                            <span @click="element.data = false; sendModelValue()"
                                :style="g.f.getType(element.data) == 'boolean' ? checked_style : un_checked_style">boolean</span>
                            <span @click="element.data = {}; sendModelValue()"
                                :style="g.f.getType(element.data) == 'object' ? checked_style : un_checked_style">object</span>
                            <br />
                            <span @click="element.data = []; sendModelValue()"
                                :style="g.f.getType(element.data) == 'array' ? checked_style : un_checked_style">array</span>
                            <span @click="element.data = new Date(); sendModelValue()"
                                :style="g.f.getType(element.data) == 'date' ? checked_style : un_checked_style">date</span>
                            <span @click="element.data = new Map(); sendModelValue()"
                                :style="g.f.getType(element.data) == 'map' ? checked_style : un_checked_style">map</span>
                            <span @click="element.data = new Set(); sendModelValue()"
                                :style="g.f.getType(element.data) == 'set' ? checked_style : un_checked_style">set</span> <br />
                            <span @click="element.data = function () { g.console.log('new function') }; sendModelValue()"
                                :style="g.f.getType(element.data) == 'function' ? checked_style : un_checked_style">function</span>
                            <span @click="element.data = /sir/i; sendModelValue()"
                                :style="g.f.getType(element.data) == 'regexp' ? checked_style : un_checked_style">regexp</span>
                            <span @click="element.data = BigInt(10); sendModelValue()"
                                :style="g.f.getType(element.data) == 'bigint' ? checked_style : un_checked_style">bigint</span>
                        </div>
                        <div>
                            <span style="cursor:pointer" @click="flowValue.splice(element_no, 1); sendModelValue()" class="q-pa-sm">X</span>
                            <span style="cursor:pointer" @click="g.f.dup(flowValue, element_no); sendModelValue()" class="q-pa-sm">Dup</span>
                            <span style="cursor:pointer" @click="flowValue[element_no] = g.f.PS(g.current_import) || null"
                                class="q-pa-sm">Import</span>
                            <span style="cursor:pointer" @click="g.current_import = g.f.PS(flowValue[element_no])" class="q-pa-sm">Export</span>
                        </div>
                    </q-popup-proxy>
                </button>
                <span style="font-weight: bolder; color:black; margin-right: 3px;"> : </span>
                <span v-if="g.f.getType(element.data) == 'boolean'"
                    style="color:darkslategrey; cursor:pointer; user-select: none;"
                    @dblclick="element.data = !element.data; sendModelValue()">
                    {{ element.data }}
                </span>
                <button v-if="g.f.getType(element.data) == 'string'" class="btn-hide-1"
                    style="color:darkslategrey">
                    {{ element.data.substring(0, 30).length ? element.data.substring(0, 30) : 'empty string' }}
                    <q-popup-proxy persistent breakpoint="0">
                        <Teleport :to="'#' + this_id + 'element' + element_no">
                            <div>
                                <toggle-content v-if="! zzz(element.data)" :show_inner_p="true">
                                    <template #control>
                                        <button style="color:darkslategrey"
                                            class="toggle-handle btn-hide-1 q-mt-sm q-mx-sm">html</button>
                                    </template>
                                    <div>
                                        <monaco-editor :lang="'html'" @update="element.data = g.f.PS($event); sendModelValue()"
                                            :parsed="g.f.PS(element.data)"></monaco-editor>
                                    </div>
                                </toggle-content>
                                <toggle-content v-if="! zzz(element.data)" :show_inner_p="false">
                                    <template #control>
                                        <button style="color:darkslategrey" class="toggle-handle btn-hide-1 q-mx-sm">CSS</button>
                                    </template>
                                    <div>
                                        <monaco-editor :lang="'css'" @update="element.data = g.f.PS($event); sendModelValue()"
                                            :parsed="g.f.PS(element.data)"></monaco-editor>
                                    </div>
                                </toggle-content>
                                <toggle-content v-if="! zzz(element.data)" :show_inner_p="false">
                                    <template #control>
                                        <button style="color:darkslategrey" class="toggle-handle btn-hide-1 q-mx-sm">JS</button>
                                    </template>
                                    <div>
                                        <monaco-editor :lang="'javascript'"
                                            @update="element.data = g.f.PS($event); sendModelValue()"
                                            :parsed="g.f.PS(element.data)"></monaco-editor>
                                    </div>
                                </toggle-content>
    
                                <toggle-content v-if="false" :show_inner_p="true">
                                    <template #control>
                                        <span style="color:darkslategrey" class="toggle-handle btn-hide-1">.</span>
                                    </template>
                                    <div v-if="zzz(element.data)">
                                        <j-edit :model-value="g.f.P(element.data)" :isopen="true"
                                            @update:model-value="element.data = g.f.S($event); sendModelValue()">
                                        </j-edit>
                                    </div>
                                    <span v-else> .</span>
                                </toggle-content>
    
                                <div v-if="zzz(element.data)">
                                        <j-edit :model-value="g.f.P(element.data)" :isopen="true"
                                            @update:model-value="element.data = g.f.S($event); sendModelValue()">
                                        </j-edit>
                                </div>
    
                            </div>
                            
                        </Teleport>
                    </q-popup-proxy>
                </button>
                <button v-if="g.f.getType(element.data) == 'number'" style="color:darkslategrey;"
                    class="btn-hide-1">
                    {{ element.data }}
                    <q-popup-proxy breakpoint="0">
                        <div>
                            <input type="number" v-model.number="element.data" @blur="sendModelValue()" />
                        </div>
                    </q-popup-proxy>
                </button>
                <j-edit :isopen="false" v-if="g.f.getType(element.data) == 'array' || g.f.getType(element.data) == 'object'"
                    style="color:rgb(153, 46, 46);" :model-value="element.data"
                    @update:model-value="element.data = g.f.PS($event); sendModelValue()">
                </j-edit>
                <span v-if="g.f.getType(element.data) == 'null' || g.f.getType(element.data) == 'undefined'"
                    style="color:darkslategrey">
                    {{ g.f.getType(element.data) == 'null' ? 'null' : 'undefined' }}
                </span>
                <template v-if="isright(element.data)">
                    <button class="btn-hide-1" style="color:darkslategrey;">
                        {{ g.f.getType(element.data) }}
                        <q-popup-proxy persistent breakpoint="0">
                            <Teleport :to="'#' + this_id + 'element' + element_no">
                                <monaco-editor @update="element.data = g.f.P($event); sendModelValue()"
                                    :parsed="g.f.S(element.data)"></monaco-editor>
                            </Teleport>
                        </q-popup-proxy>
                    </button>
                </template>
                <div :id="this_id + 'element' + element_no"></div>
            </div>
        </div>`,
    data() {
      return { flowValue: null };
    },
    setup: function(e, { attrs: a, slots: t, emit: s, expose: o }) {
      var c = "padding-left:5px; padding-right:5px; cursor:pointer;", _ = "background-color:black; color:white; border-radius:3px;", V = "", w = g.f.generateUID(4);
      return {
        g: Vue.computed(() => g),
        alert: Vue.ref(!0),
        un_checked_style: c + V,
        checked_style: c + _,
        this_id: w
      };
    },
    props: {
      modelValue: {
        type: Array,
        required: !0
      },
      objType: {
        type: String,
        required: !0
      }
    },
    emits: ["update:modelValue"],
    created() {
      this.updateFlowValue();
    },
    watch: {
      modelValue: {
        handler: function(e, a) {
          g.f.PS(e) != g.f.PS(a) && this.updateFlowValue();
        },
        deep: !0
      }
    },
    methods: {
      updateFlowValue: function(e = this.modelValue) {
        this.flowValue = g.f.PS(e);
      },
      sendModelValue: function(e = this.flowValue) {
        this.$emit("update:modelValue", g.f.PS(e));
      },
      zzz: function(e) {
        var a = !1, t = !1;
        try {
          var s = g.f.getType(g.f.P(e));
          s && (a = !0, t = s);
        } catch {
        }
        return !!(a && (t == "object" || t == "array"));
      },
      isright: function(e) {
        return g.f.getType(e) == "date" || g.f.getType(e) == "set" || g.f.getType(e) == "map" || g.f.getType(e) == "function" || g.f.getType(e) == "regexp" || g.f.getType(e) == "bigint";
      }
    }
  })), Page.hasOwnProperty("Directive") && Page.Directive.includes("resize") && g.App_Wrapper.directive("resize", {
    bind: function(e, { value: a = {} }) {
      e.addEventListener("load", () => iframeResize(a, e));
    },
    unbind: function(e) {
      e.iFrameResizer.removeListeners();
    }
  }), g.App = g.App_Wrapper.mount("#app-div");
}
function x() {
  var n = [
    "JS_CoreJS",
    "JS_JQ",
    "JS_VueDev",
    "JS_Dexie",
    "JS_RandomBytes",
    "JS_Serialize"
  ];
  n.forEach((e) => {
    let a = document.createElement("script");
    a.setAttribute("type", "text/javascript"), a.text = localStorage.getItem(e), a.setAttribute("class", "remove-me"), a.setAttribute("async", !1), a.class = "remove-me", document.body.appendChild(a), a.addEventListener("load", () => {
    }), a.addEventListener("error", (t) => {
      console.log("Error on loading file", t);
    });
  });
}
async function M() {
  f(), x(), g.db = await new Dexie("Sir"), await g.db.version(1).stores({
    // settings: "++id, &name",
    // pages: "++id, &name",
    // comps: "++id, &name",
    // directives: "++id, &name",
    // temps: "++id, &name",
    // mixins: "++id, &name",
    // composables: "++id, &name",
    Libs: "++id, &name",
    css: "++id, &name",
    js: "++id, &name",
    images: "++id, &name",
    audios: "++id, &name",
    videos: "++id, &name",
    svg: "++id, &name",
    blobs: "++id, &name"
  }), $("body").append('<div id="app-div"></div>'), $(".remove-me").remove(), g.d = {
    Libs: []
  }, g.r = Vue.reactive({
    IsLive: !0,
    IsEditor: !0,
    IsAppStart: !1,
    IsConnected: !1,
    IsConnectedFirstTime: !1,
    IsReConnected: !1
  });
  var n = {
    S: function(e, a = { space: 2 }) {
      return g.serialize(e, a);
    },
    P: function(e) {
      return g.deserialize(e);
    },
    PS: function(e, a = { space: 2 }) {
      return g.deserialize(g.serialize(e, a));
    },
    getType: function(e) {
      switch (Object.prototype.toString.call(e)) {
        case "[object RegExp]":
          return "regexp";
        case "[object Map]":
          return "map";
        case "[object Set]":
          return "set";
        case "[object Array]":
          return "array";
        case "[object Date]":
          return "date";
        case "[object Object]":
          return "object";
        case "[object Null]":
          return "null";
        case "[object Function]":
          return "function";
        case "[object Undefined]":
          return "undefined";
        default:
          return typeof e;
      }
    },
    objectToKeyArray: function(a) {
      var a = g.f.PS(a), t = [];
      return Object.entries(a).forEach(function(o, c) {
        t.splice(t.length + 1, 0, { id: c, name: o[0], data: o[1] });
      }), t;
    },
    KeyArrayToObject: function(a) {
      var a = g.f.PS(a), t = {};
      return a.forEach(function(s, o) {
        t[s.name] = s.data;
      }), t;
    },
    ArrayToKeyArray: function(a) {
      var a = g.f.PS(a), t = [];
      return a.forEach(function(s, o) {
        t.splice(t.length + 1, 0, { id: o, name: o, data: s });
      }), t;
    },
    KeyArrayToArray: function(a) {
      var a = g.f.PS(a), t = [];
      return a.forEach(function(s, o) {
        t[o] = s.data;
      }), t;
    },
    generateUID: function(e = 16) {
      for (var a = globalThis.randomBytes(e), t = "id", s = 0; s < e; ++s)
        t += a[s].toString(16);
      return t;
    },
    dup: function(e, a) {
      var t = g.f.PS(e[a]);
      t.hasOwnProperty("name") && (t.name = t.name + "_dup"), e.splice(a + 1, 0, t);
    },
    RandomId: function() {
      return "id-" + Date.now();
    },
    ArrayMove: function(e, a, t) {
      if (t >= e.length)
        for (var s = t - e.length + 1; s--; )
          e.push(void 0);
      return e.splice(t, 0, e.splice(a, 1)[0]), e;
    },
    ObjToArray: function(e) {
      return Object.entries(e);
    },
    ArrayToObj: function(e) {
      return Object.fromEntries(e);
    },
    GetTimeStamp: function() {
      var e = /* @__PURE__ */ new Date();
      return e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear() + " @ " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
    }
  };
  g.f = { ...g.f, ...n }, await h();
}
function C() {
  return navigator.userAgent.indexOf("Chrome") != -1;
}
g.f.GetLocalSpace = function() {
  var n = "";
  for (var e in window.localStorage)
    window.localStorage.hasOwnProperty(e) && (n += window.localStorage[e]);
  return n ? 3 + n.length * 16 / (8 * 1024) + " KB" : "Empty (0 KB)";
};
g.f.PageRefresh = async function() {
  console.clear(), console.log("Refreshing Page"), g.App && (await g.App_Wrapper.unmount(), $("#app-div").removeAttr("data-v-app"), h());
};
globalThis.AppStart = async function() {
  C() ? (k() || await L(), j() && await S(), await M()) : alert("please use chrome web browser ...");
};
