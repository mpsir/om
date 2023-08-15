var s = JSON.parse(JSON.stringify(g.TargetURL));
async function i(t, e) {
  var n = (await g.db.Libs.toArray()).find(function(l) {
    return l.name == t;
  });
  if (n)
    return n.data;
  const r = g.f.GetFile(e);
  return await g.db.Libs.add({ name: t, data: r }), r;
}
var S = "https://mpsir.github.io/om", o = s, p = !1;
s == "http://super1mpsir-57484.portmap.host:57484" ? o = S : (o = s, p = !0);
async function L(t) {
  for (const a of t)
    switch (a) {
      case "material-icons":
        g.d.Libs.find((n) => n == "material-icons") || ($("head").append(`<link rel="stylesheet" data-dyn-name="material-icons" href="${o}/Lib/material-icons/iconfont/material-icons.css">`), g.d.Libs.push("material-icons"));
        break;
      case "roboto":
        var e = g.d.Libs.find((n) => n == "roboto");
        e || (p ? $("head").append(`<link rel="stylesheet" data-dyn-name="roboto" href="${o}/CSS/roboto-local.css">`) : $("head").append(`<link rel="stylesheet" data-dyn-name="roboto" href="${o}/CSS/roboto.css">`), g.d.Libs.push("roboto"));
        break;
      case "vue-select":
        g.d.Libs.find((n) => n == "vue-select") || ($("head").append(`
                    <style data-dyn-name="vue-select-css"> 
                        ${await i("vue-select-css", `${s}/Lib/vue-select/vue-select.css`)} 
                    </style>`), $("body").append(`
                    <script data-dyn-name="vue-select-js" class="remove-me" async="false">
                        ${await i("vue-select-js", `${s}/Lib/vue-select/vue-select.umd.js`)}
                    <\/script>`), g.d.Libs.push("vue-select"));
        break;
      case "rx-js":
        g.d.Libs.find((n) => n == "rx-js") || ($("body").append(`
                    <script data-dyn-name="rx-js" class="remove-me" async="false">
                        ${await i("rx-js", `${s}/Lib/rxjs.umd.min.js`)}
                    <\/script>`), g.d.Libs.push("rx-js"));
        break;
      case "vue-use":
        g.d.Libs.find((n) => n == "vue-use") || ($("body").append(`
                        <script data-dyn-name="vueuse-shared" class="remove-me" async="false">
                            ${await i("vueuse-shared", `${s}/Lib/@vueuse/shared@9.13.0/index.iife.min.js`)}
                        <\/script>
                        <script data-dyn-name="vueuse-core" class="remove-me" async="false">
                            ${await i("vueuse-core", `${s}/Lib/@vueuse/core@9.13.0/index.iife.min.js`)}
                        <\/script>
                        <script data-dyn-name="vueuse-rx-js" class="remove-me" async="false">
                            ${await i("rx-js", `${s}/Lib/@vueuse/rxjs/index.iife.min.js`)}
                        <\/script>`), g.d.Libs.push("vue-use"));
        break;
      case "monaco-editor":
        g.d.Libs.find((n) => n == "monaco-editor") || ($("head").append(`<link rel="stylesheet" data-name="vs/editor/editor.main" href="${o}/Lib/monaco-editor/min/vs/editor/editor.main.css">`), $("body").append(`<script class="remove-me" async="false"> const require = { paths: { vs: '${o}/Lib/monaco-editor/min/vs' } }; <\/script>
                        <script class="remove-me" async="false" src="${o}/Lib/monaco-editor/min/vs/loader.js"><\/script>
                        <script class="remove-me" async="false" src="${o}/Lib/monaco-editor/min/vs/editor/editor.main.nls.js"><\/script>
                        <script class="remove-me" async="false" src="${o}/Lib/monaco-editor/min/vs/editor/editor.main.js"><\/script>`), g.d.Libs.push("monaco-editor"));
        break;
      case "socket-io":
        g.d.Libs.find((n) => n == "socket-io") || ($("body").append(`<script data-dyn-name="socket.io" class="remove-me" async="false">
                        ${await i("socket-io", `${s}/Lib/socket-io-client.js`)}
                    <\/script>`), g.d.Libs.push("socket-io"));
        break;
      case "jq-ui":
        g.d.Libs.find((n) => n == "jq-ui") || ($("head").append(`<link rel="stylesheet" href="${o}/Lib/jq/jquery-ui.min.css">`), $("body").append(`<script class="remove-me" async="false"  src="${o}/Lib/jq/jquery-ui.min.js" ><\/script>
                    <script data-dyn-name="touch-jq-ui" class="remove-me" async="false">
                        ${await i("touch-jq-ui", `${s}/Lib/jq/touch.js`)}
                    <\/script>`), g.d.Libs.push("jq-ui"));
        break;
      case "vue-quasar":
        g.d.Libs.find((n) => n == "vue-quasar") || ($("head").append(`
                    <style data-dyn-name="vue-quasar-css"> 
                        ${await i("vue-quasar-css", `${s}/Lib/quasar/quasar.css`)} 
                    </style>`), $("body").append(`
                    <script data-dyn-name="vue-quasar-js" class="remove-me" async="false">
                        ${await i("vue-quasar-js", `${s}/Lib/quasar/quasar.js`)} 
                    <\/script>`), g.d.Libs.push("vue-quasar"));
        break;
      case "vue-iframe":
        g.d.Libs.find((n) => n == "vue-iframe") || ($("body").append(`
                    <script data-dyn-name="vue-iframe-host" class="remove-me">
                        ${await i("vue-iframe-host", `${s}/Lib/iframe-resize/iframe-host.js`)}
                    <\/script>
                    <script data-dyn-name="vue-iframe-client" class="remove-me" async="false">
                        ${await i("vue-iframe-client", `${s}/Lib/iframe-resize/iframe-client.js`)}
                    <\/script>`), g.d.Libs.push("vue-iframe"));
        break;
      case "vue-shortkey":
        g.d.Libs.find((n) => n == "vue-shortkey") || ($("body").append(`
                    <script data-dyn-name="vue-shortkey" class="remove-me" async="false">
                        ${await i("vue-shortkey", `${s}/Lib/vue3-shortkey.min.js`)}
                    <\/script>`), g.d.Libs.push("vue-shortkey"));
        break;
      case "vue-sortable":
        g.d.Libs.find((n) => n == "vue-sortable") || ($("body").append(`<script data-dyn-name="vue-sortable" class="remove-me" async="false">
                        ${await i("vue-sortable", `${s}/Lib/sortablejs/Sortable.min.js`)}
                    <\/script>`), g.d.Libs.push("vue-sortable"));
        break;
      case "vue-draggable":
        g.d.Libs.find((n) => n == "vue-draggable") || ($("body").append(`<script class="remove-me" async="false">
                        ${await i("vue-draggable", `${s}/Lib/vuedraggable/vuedraggable.umd.min.js`)}
                    <\/script>`), g.d.Libs.push("vue-draggable"));
        break;
    }
  $(".remove-me").remove();
}
async function u(t = g.f.GetPageName()) {
  g.ev(g.f.GetPageData(t)), console.log(`
PageName : `, t, Page, `

`), Page.hasOwnProperty("Title") && (document.title = Page.Title), Page.hasOwnProperty("Libs") && Page.Libs.length && await L(Page.Libs), g.App_Wrapper = g.Vue.createApp(Page.VApp), Page.hasOwnProperty("Comps") && (Page.Comps.includes("Quasar") && g.App_Wrapper.use(g.Quasar), Page.Comps.includes("v-select") && g.App_Wrapper.component("v-select", window["vue-select"]), Page.Comps.includes("i-frame") && g.App_Wrapper.component("i-frame", {
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
    setup: function(e, { attrs: a, slots: n, emit: r, expose: l }) {
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
        (n) => {
          e.update_editor(), e.Value = e.editor.getValue(), e.$emit("update:parsed", e.Value);
        }
      );
      const a = () => {
        this.editor.getContribution("editor.contrib.folding").getFoldingModel().then((r) => {
          r.onDidChange(() => {
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
      var e = this, a = this.$refs.controls, n = $(a).find(".toggle-handle");
      if (!n[0])
        console.log("no handle found", `
add "toggle-handle" class to any ui element.`);
      else {
        var n = n[0];
        $(n).click(function() {
          e.show_inner = !e.show_inner;
        });
      }
    },
    setup: function(e, { attrs: a, slots: n, emit: r, expose: l }) {
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
    setup: function(e, { attrs: a, slots: n, emit: r, expose: l }) {
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
    setup: function(e, { attrs: a, slots: n, emit: r, expose: l }) {
      var c = "padding-left:5px; padding-right:5px; cursor:pointer;", w = "background-color:black; color:white; border-radius:3px;", V = "", j = g.f.generateUID(4);
      return {
        g: Vue.computed(() => g),
        alert: Vue.ref(!0),
        un_checked_style: c + V,
        checked_style: c + w,
        this_id: j
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
        var a = !1, n = !1;
        try {
          var r = g.f.getType(g.f.P(e));
          r && (a = !0, n = r);
        } catch {
        }
        return !!(a && (n == "object" || n == "array"));
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
var m = function(t) {
  var e = "";
  return t.forEach((a) => {
  }), e;
}, f = function(t) {
  var e = "";
  return t.forEach((a) => {
  }), e;
}, v = function(t) {
  var e = "";
  return t.forEach((a) => {
  }), e;
}, y = function(t) {
  var e = "";
  return t.forEach((a) => {
  }), e;
}, b = function(t) {
  var e = "";
  return t.forEach((a) => {
  }), e;
}, h = function(t) {
  var e = "";
  return t.length && (e += " style='", t.forEach(function(a, n) {
    e += `${a[0]}:${a[1]};`;
  }), e += "'"), e;
};
function q(t) {
  var e = "";
  return t.tagName = t.tagName || "div", e += `<${t.tagName}`, t.classes && (e += v(t.classes)), t.styles && (e += h(t.styles)), t.attrs && (e += m(t.attrs)), t.events && (e += y(t.events)), t.binds && (e += f(t.events)), e += ">", t.children && (e += g.f.ReturnT(t.children)), t.slots && (e += b(t.slots)), e += `</${t.tagName}>`, e;
}
function A(t) {
  var e = "";
  return e;
}
function P(t) {
  var e = "";
  return t.tagName = t.tagName || "div", e += `<${t.tagName}`, t.classes && (e += v(t.classes)), t.styles && (e += h(t.styles)), t.attrs && (e += m(t.attrs)), t.events && (e += y(t.events)), t.binds && (e += f(t.events)), e += ">", t.children && (e += g.f.ReturnT(t.children)), t.slots && (e += b(t.slots)), e += `</${t.tagName}>`, e;
}
function T(t) {
  var e = "";
  return t.forEach((a) => {
    if (typeof a == "string")
      e += a;
    else
      switch (a.type) {
        case "html":
          e += q(a);
          break;
        case "comp":
          e += P(a);
          break;
        case "tmplt":
          e += A();
          break;
      }
  }), e == "" ? "template is empty." : e;
}
g.f = {
  isCrome: function() {
    return navigator.userAgent.indexOf("Chrome") != -1;
  },
  S: function(t, e = { space: 2 }) {
    return g.serialize(t, e);
  },
  P: function(t) {
    return g.deserialize(t);
  },
  PS: function(t, e = { space: 2 }) {
    return g.deserialize(g.serialize(t, e));
  },
  getType: function(t) {
    switch (Object.prototype.toString.call(t)) {
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
        return typeof t;
    }
  },
  objectToKeyArray: function(e) {
    var e = g.f.PS(e), a = [];
    return Object.entries(e).forEach(function(r, l) {
      a.splice(a.length + 1, 0, { id: l, name: r[0], data: r[1] });
    }), a;
  },
  KeyArrayToObject: function(e) {
    var e = g.f.PS(e), a = {};
    return e.forEach(function(n, r) {
      a[n.name] = n.data;
    }), a;
  },
  ArrayToKeyArray: function(e) {
    var e = g.f.PS(e), a = [];
    return e.forEach(function(n, r) {
      a.splice(a.length + 1, 0, { id: r, name: r, data: n });
    }), a;
  },
  KeyArrayToArray: function(e) {
    var e = g.f.PS(e), a = [];
    return e.forEach(function(n, r) {
      a[r] = n.data;
    }), a;
  },
  generateUID: function(t = 16) {
    for (var e = globalThis.randomBytes(t), a = "id", n = 0; n < t; ++n)
      a += e[n].toString(16);
    return a;
  },
  dup: function(t, e) {
    var a = g.f.PS(t[e]);
    a.hasOwnProperty("name") && (a.name = a.name + "_dup"), t.splice(e + 1, 0, a);
  },
  RandomId: function() {
    return "id-" + Date.now();
  },
  ArrayMove: function(t, e, a) {
    if (a >= t.length)
      for (var n = a - t.length + 1; n--; )
        t.push(void 0);
    return t.splice(a, 0, t.splice(e, 1)[0]), t;
  },
  ObjToArray: function(t) {
    return Object.entries(t);
  },
  ArrayToObj: function(t) {
    return Object.fromEntries(t);
  },
  GetTimeStamp: function() {
    var t = /* @__PURE__ */ new Date();
    return t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear() + " @ " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
  },
  GetFile: function(t, e = !1) {
    var a = !1, n = new XMLHttpRequest();
    return n.withCredentials = !0, n.onreadystatechange = function() {
      this.readyState == 4 && this.status == 200 && (a = this.responseText);
    }, n.open("GET", t, e), n.send(), a;
  },
  GetLocalSpace: function() {
    var t = "";
    for (var e in window.localStorage)
      window.localStorage.hasOwnProperty(e) && (t += window.localStorage[e]);
    return t ? 3 + t.length * 16 / (8 * 1024) + " KB" : "Empty (0 KB)";
  },
  PageRefresh: async function() {
    console.clear(), console.log("Refreshing Page"), g.App && (await g.App_Wrapper.unmount(), $("#app-div").removeAttr("data-v-app"), u());
  },
  PageChangeTo: async function(t) {
    console.clear(), console.log("Changing Page To ", t), g.App && (await g.App_Wrapper.unmount(), $("#app-div").removeAttr("data-v-app"));
    const e = g.f.PageNames().find(function(a) {
      return a.name == t;
    });
    u(e ? t : "404");
  },
  PageNames: function() {
    return JSON.parse(localStorage.getItem("Pages"));
  },
  GetPageName: function() {
    const t = location.search;
    if (t == "")
      return "Home";
    const e = new URLSearchParams(t).get("page");
    return e && g.f.PageNames().find(function(n) {
      return n.name == e;
    }) ? e : "404";
  },
  GetPageData: function(t) {
    return g.f.PageNames().find(function(e) {
      return e.name == t;
    }).data;
  },
  ReturnT: function(t) {
    return typeof t == "string" ? t : T(t);
  },
  AppDelete: async function(t = !0, e = !0) {
    console.log("deleting frame ..."), t ? localStorage.clear() : localStorage.removeItem("Frame_VP"), e && location.reload();
  },
  addScripts: function() {
    var t = [
      "JS_CoreJS",
      "JS_JQ",
      "JS_VueDev",
      "JS_Dexie",
      "JS_RandomBytes",
      "JS_Serialize"
    ];
    t.forEach((e) => {
      let a = document.createElement("script");
      a.setAttribute("type", "text/javascript"), a.text = localStorage.getItem(e), a.setAttribute("class", "remove-me"), a.setAttribute("async", !1), a.class = "remove-me", document.body.appendChild(a), a.addEventListener("load", () => {
      }), a.addEventListener("error", (n) => {
        console.log("Error on loading file", n);
      });
    });
  }
};
function x() {
  return !!localStorage.getItem("Frame_VP");
}
const _ = { Version: 1 };
function C() {
  var t = !1;
  return localStorage.getItem("Frame_VP") ? t = JSON.parse(localStorage.getItem("Frame_VP")).Version !== _.Version : t = !1, t;
}
function d(t, e) {
  localStorage.setItem(t, JSON.stringify(e));
}
async function k() {
  d("Pages", [
    // Home
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
                template: g.f.ReturnT([
                    {
                        type:"html",
                        tagName:"div",
                        styles:[['padding', '8px'], ['color', 'red']],
                        children: [ 
                            "Home"
                        ]
                    }
                ]), 
                data: function() {
                    return {
                        a:{ a:"a1" }
                    }
                },
                computed:{
                    g : function(){ return g }
                }
            }
        }`
    },
    // Admin
    {
      name: "Admin",
      data: `var Page = {
            Libs:[ "jq-ui", "material-icons", "roboto", "rx-js", "vue-use", "socket-io", "vue-quasar", 
                    "vue-iframe", "vue-shortkey", "vue-select", "vue-sortable", 
                    "vue-draggable", "monaco-editor"
                ],
            Comps:["Quasar", "v-select", "i-frame", "monaco-editor", "toggle-content", "draggable", "j-edit", "array-edit"],
            Directive:["resize"],    
            VApp : {
                template: g.f.ReturnT([
                    {
                        type:"html",
                        tagName:"div",
                        styles:[['padding', '8px'], ['color', 'red']],
                        children: [ 
                            "Admin"
                        ]
                    }
                ]), 
                data: function() {
                    return {
                        a:{ a:"a1" }
                    }
                },
                computed:{
                    g : function(){ return g }
                }
            }
        }`
    },
    // Pages
    {
      name: "Pages",
      data: `var Page = {
            Libs:[ "jq-ui", "material-icons", "roboto", "rx-js", "vue-use", "socket-io", "vue-quasar", 
                    "vue-iframe", "vue-shortkey", "vue-select", "vue-sortable", 
                    "vue-draggable", "monaco-editor"
                ],
            Comps:["Quasar", "v-select", "i-frame", "monaco-editor", "toggle-content", "draggable", "j-edit", "array-edit"],
            Directive:["resize"],    
            VApp : {
                template: g.f.ReturnT([
                    {
                        type:"html",
                        tagName:"div",
                        styles:[['padding', '8px'], ['color', 'red']],
                        children: [ 
                            "Pages"
                        ]
                    }
                ]), 
                data: function() {
                    return {
                        a:{ a:"a1" }
                    }
                },
                computed:{
                    g : function(){ return g }
                }
            }
        }`
    },
    // Comps
    {
      name: "Comps",
      data: `var Page = {
            Libs:[ "jq-ui", "material-icons", "roboto", "rx-js", "vue-use", "socket-io", "vue-quasar", 
                    "vue-iframe", "vue-shortkey", "vue-select", "vue-sortable", 
                    "vue-draggable", "monaco-editor"
                ],
            Comps:["Quasar", "v-select", "i-frame", "monaco-editor", "toggle-content", "draggable", "j-edit", "array-edit"],
            Directive:["resize"],    
            VApp : {
                template: g.f.ReturnT([
                    {
                        type:"html",
                        tagName:"div",
                        styles:[['padding', '8px'], ['color', 'red']],
                        children: [ 
                            "Comps"
                        ]
                    }
                ]), 
                data: function() {
                    return {
                        a:{ a:"a1" }
                    }
                },
                computed:{
                    g : function(){ return g }
                }
            }
        }`
    },
    // 404
    {
      name: "404",
      data: `var Page = {  
            VApp : {
                template:"404 page"
            }
        }`
    }
  ]), d("Components", [
    // comp 1
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
async function M() {
  k(), g.f.addScripts(), g.db = await new Dexie("Sir"), await g.db.version(1).stores({
    Libs: "++id, &name",
    css: "++id, &name",
    js: "++id, &name",
    images: "++id, &name",
    audios: "++id, &name",
    videos: "++id, &name",
    svg: "++id, &name",
    blobs: "++id, &name"
    // settings: "++id, &name",
    // pages: "++id, &name",
    // comps: "++id, &name",
    // directives: "++id, &name",
    // temps: "++id, &name",
    // mixins: "++id, &name",
    // composables: "++id, &name",
  }), $("body").append('<div id="app-div"></div>'), $(".remove-me").remove(), g.d = { Libs: [] }, g.r = Vue.reactive({
    IsLive: !0,
    IsEditor: !0,
    IsAppStart: !1,
    IsConnected: !1,
    IsConnectedFirstTime: !1,
    IsReConnected: !1
  }), await u();
}
async function R() {
  function t(e, a) {
    localStorage.setItem(e, g.f.GetFile(g.TargetURL + a));
  }
  console.log("installing ..."), t("JS_CoreJS", "/Lib/core-js-bundle@3.29.1/minified.min.js"), t("JS_VueDev", "/Lib/vue/vue.global.min.js"), t("JS_JQ", "/Lib/jq/jquery.js"), t("JS_Dexie", "/Lib/dexie/dexie.min.js"), t("JS_RandomBytes", "/Lib/my-random-bytes.js"), t("JS_Serialize", "/Lib/my-serialize.js"), await k(), localStorage.setItem("Frame_VP", JSON.stringify(_)), console.log("installing completed ...");
}
globalThis.AppStart = async function() {
  if (!g.f.isCrome()) {
    alert("please use chrome web browser ...");
    return;
  }
  x() || await R(), C() && await g.f.AppDelete(), await M();
};
