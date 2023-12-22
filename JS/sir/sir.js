const Frame = { Version: 11 };
function setItem(e, n) {
  localStorage.setItem(e, JSON.stringify(n));
}
async function install() {
  setItem(
    "Pages",
    [{ name: "Home", data: `{
  "Libs": [
    "jq-ui",
    "material-icons",
    "roboto",
    "rx-js",
    "vue-use",
    "socket-io",
    "vue-quasar",
    "vue-iframe",
    "vue-shortkey",
    "vue-select",
    "vue-sortable",
    "vue-draggable",
    "monaco-editor"
  ],
  "Comps": [
    "Quasar",
    "v-select",
    "i-frame",
    "monaco-editor",
    "toggle-content",
    "draggable",
    "j-edit",
    "array-edit"
  ],
  "Directive": [
    "resize"
  ],
  "VApp": {
    "setup": function(props, { attrs, slots, emit, expose }) {
    const all_pages = VueUse.useStorage('Pages')
    const all_components = VueUse.useStorage('Components')

    const IsLocalHost = function () {
        if (location.port == '8081' || location.port == '3000') { return true }
        else { return false }
    }
    if (IsLocalHost()) {
        g.socket = io('http://localhost:8081/', {
            transports: ['websocket'], upgrade: false
        })
    }
    else {
        g.socket = io('http://super1mpsir-57484.portmap.host:57484/', {
            transports: ['websocket'], upgrade: false
        })
    }
    g.socket.on('connect', function () {
        console.log('connected to server.');
        g.r.IsConnected = true
        g.r.IsReConnected = false
    });
    socket.on('disconnect', function (socket) {
        console.log('disconnect from server.');
        g.r.IsConnected = false
    });
    socket.on('reconnect', function (socket) {
        console.log('re-connected.');
        g.r.IsConnected = true
        g.r.IsReConnected = true
    });
    socket.on('msg', function (data, c_back) {
        data.hasOwnProperty('type') ? console.log('got msg', data.type) : null
        if (data.type == 'runEV') {
            data.hasOwnProperty('data') ? g.eval(data.data) : null
        } 
        if (data.type == 'Log') {
            data.hasOwnProperty('data') ? g.console.log(data.data) : null
        } 
        if (data.type == 'LogSuccess') {
            data.hasOwnProperty('data') ? g.console.log('LogSuccess', data.data) : null
            // g.r.User = g.f.P(data.data)
            localStorage.setItem('User', data.data)
        }
        if (data.type == 'LogOutSuccess') {
            g.console.log('LogOutSuccess')
            localStorage.setItem('User', JSON.stringify(false))
        } 
    });

    const myInterval = setInterval(function () {
        var a = g.f.P(localStorage.getItem('User'))
        var b = g.f.PS(g.r.User)
        if (g.f.S(a) != g.f.S(b)) { g.r.User = a }
    }, 50);

    return { all_pages, myInterval, all_components }
},
    "template": "\\u003Cdiv style=\\"padding:16px\\"\\u003E\\r\\n    \\u003Cp style=\\"font-weight:bolder; font-size:20px\\"\\u003ESir\\u003C\\u002Fp\\u003E\\r\\n\\r\\n    \\u003Cdiv style=\\"margin-top:16px;\\"\\u003E\\r\\n        \\u003Cdiv v-if=\\"g.r.User != false\\"\\u003E\\r\\n            \\u003Clogged-in \\u002F\\u003E\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003Cdiv v-else\\u003E\\r\\n            \\u003Clogged-out \\u002F\\u003E\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n\\r\\n    \\u003Cdiv style=\\"margin-top:30px;\\" v-if=\\"g.r.User != false\\"\\u003E\\r\\n        Hello \\u003Cspan style=\\"font-weight:bolder; text-decoration:underline\\"\\u003E {{g.r.User.printName}} \\u003C\\u002Fspan\\u003E \\u003Cbr\\u002F\\u003E\\r\\n        Role : {{g.r.User.role}} \\u003Cbr\\u002F\\u003E\\r\\n        Amount : {{g.r.User.amount}}\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n\\r\\n    \\u003Cdiv v-if=\\"g.r.User != false\\" style=\\"padding:8px; margin-top:20px; font-weight:bolder; background-color:rgba(1,1,1,.15)\\"\\u003E\\r\\n        \\u003Cdiv style=\\"margin-bottom:16px;\\"\\u003E\\r\\n            Projects\\r\\n            \\u003Cspan style=\\"margin-left:16px; text-decoration:underline\\"\\u003E\\r\\n                {{ g.r.User.projects.length }}\\r\\n            \\u003C\\u002Fspan\\u003E\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003Cdiv v-if=\\"g.r.User.projects.length\\"\\u003E\\r\\n            \\u003Cdiv style=\\"margin:16px 0px\\" v-for=\\"(Prj, PrjNo) in g.r.User.projects\\"\\u003E\\r\\n                \\u003Cspan style=\\"margin-right:16px\\"\\u003E{{PrjNo}}\\u003C\\u002Fspan\\u003E \\r\\n                {{Prj.name}}\\r\\n                \\u003Cdiv style=\\"font-weight:normal\\"\\u003E\\r\\n                    Type : {{Prj.type}} \\u003Cbr\\u002F\\u003E\\r\\n                    Board : {{Prj.board}} \\u003Cbr\\u002F\\u003E\\r\\n                    Board Activated : {{Prj['board-activated']}} \\u003Cbr\\u002F\\u003E\\r\\n                    Stage : {{Prj['Stage']}} \\r\\n                    \\u003Cdiv v-for=\\"(Msg, MsgNo) in Prj.msg\\"\\u003E\\r\\n                        {{Msg}}\\r\\n                    \\u003C\\u002Fdiv\\u003E\\r\\n                \\u003C\\u002Fdiv\\u003E\\r\\n            \\u003C\\u002Fdiv\\u003E\\r\\n            \\u003Cpre v-if=\\"g.r.User != false && g.r.User.role == 'super-admin'\\"\\u003E\\r\\n                {{g.r.User.projects}}\\r\\n            \\u003C\\u002Fpre\\u003E\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003Cdiv v-else\\u003E\\r\\n            No Projects Found.\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n\\r\\n    \\u003Cdiv v-if=\\"g.r.User != false\\" style=\\"margin-top:20px; font-weight:bolder;\\"\\u003E\\r\\n        Play Store\\r\\n        \\u003Cul style=\\"margin-top:0px; font-weight:normal;\\"\\u003E\\r\\n            \\u003Cli\\u003EGames\\r\\n                \\u003Cspan style=\\"margin-left:16px; text-decoration:underline\\"\\u003E35\\u003C\\u002Fspan\\u003E\\r\\n            \\u003C\\u002Fli\\u003E\\r\\n            \\u003Cli\\u003EBusiness Applications\\r\\n                \\u003Cspan style=\\"margin-left:16px; text-decoration:underline\\"\\u003E275\\u003C\\u002Fspan\\u003E\\r\\n            \\u003C\\u002Fli\\u003E\\r\\n            \\u003Cli\\u003EGeneral Apps\\r\\n                \\u003Cspan style=\\"margin-left:16px; text-decoration:underline\\"\\u003E56\\u003C\\u002Fspan\\u003E\\r\\n            \\u003C\\u002Fli\\u003E\\r\\n        \\u003C\\u002Ful\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n\\r\\n    \\u003Cdiv v-if=\\"g.r.User != false && g.r.User.role == 'super-admin'\\"\\u003E\\r\\n        \\u003Cpre style=\\"margin-top:16px\\"\\u003E{{ g.f.S(g.r) }}\\u003C\\u002Fpre\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n\\r\\n\\u003C\\u002Fdiv\\u003E",
    "data": function() {
                    return {
                        a:{ a:"a1" }
                    }
                },
    "computed": {
      "g": function(){ return g }
    },
    "watch": {
      "all_pages": function(val, oldVal) {
    g.r.IsLive ? g.f.PageRefresh() : null
},
      "all_components": function(val, oldVal) {
    g.r.IsLive ? g.f.PageRefresh() : null
}
    },
    "beforeUnmount": function () { g.socket.disconnect(); g.clearInterval(this.myInterval); },
    "components": {
      "logged-in": "logged-in",
      "logged-out": "logged-out"
    }
  }
}` }, { name: "Admin", data: `{
            Libs:[ "jq-ui", "material-icons", "roboto", "rx-js", "vue-use", "socket-io", "vue-quasar", 
                    "vue-iframe", "vue-shortkey", "vue-select", "vue-sortable", 
                    "vue-draggable", "monaco-editor"
                ],
            Comps:["Quasar", "v-select", "i-frame", "monaco-editor", "toggle-content", "draggable", "j-edit", "array-edit"],
            Directive:["resize"],    
            VApp : {
                template: '<div>Admin page</div>', 
                data: function() {
                    return {
                        a:{ a:"a1" }
                    }
                },
                computed:{
                    g : function(){ return g }
                }
            }
        }` }, { name: "Pages", data: `{
            Libs:[ "jq-ui", "material-icons", "roboto", "rx-js", "vue-use", "socket-io", "vue-quasar", 
                    "vue-iframe", "vue-shortkey", "vue-select", "vue-sortable", 
                    "vue-draggable", "monaco-editor"
                ],
            Comps:["Quasar", "v-select", "i-frame", "monaco-editor", "toggle-content", "draggable", "j-edit", "array-edit"],
            Directive:["resize"],    
            VApp : {
                template: '<div>pages</div>', 
                data: function() {
                    return {
                        a:{ a:"a1" }
                    }
                },
                computed:{
                    g : function(){ return g }
                }
            }
        }` }, { name: "Comps", data: `{
            Libs:[ "jq-ui", "material-icons", "roboto", "rx-js", "vue-use", "socket-io", "vue-quasar", 
                    "vue-iframe", "vue-shortkey", "vue-select", "vue-sortable", 
                    "vue-draggable", "monaco-editor"
                ],
            Comps:["Quasar", "v-select", "i-frame", "monaco-editor", "toggle-content", "draggable", "j-edit", "array-edit"],
            Directive:["resize"],    
            VApp : {
                template: 'comps', 
                data: function() {
                    return {
                        a:{ a:"a1" }
                    }
                },
                computed:{
                    g : function(){ return g }
                }
            }
        }` }, { name: "404", data: `{  
            VApp : {
                template:"404 page"
            }
        }` }, { name: "bkp", data: `{  
            VApp : {
                template:"bkp page"
            }
        }` }]
  ), setItem(
    "Components",
    [{ name: "i-frame", data: `{
  "VApp": {
    "template": "\\u003Ciframe ref=\\"i1\\" v-bind=\\"$attrs\\" style=\\"width: 1px; min-width: 100%; border:none\\"\\u003E\\u003C\\u002Fiframe\\u003E",
    "mounted": function () { g.iFrameResize({ log: false }, this.$refs.i1) },
    "computed": {
      "g": function () { return g }
    }
  }
}` }, { name: "monaco-editor", data: `{
  "VApp": {
    "template": "\\u003Cdiv v-bind=\\"$attrs\\"\\u003E\\r\\n    \\u003Cdiv v-if=\\"!isreadonly\\"\\u003E\\r\\n        \\u003Cq-btn flat class=\\"p-0 m-0 text-400\\" @click=\\"update_parent()\\" text-color=\\"blue\\" icon=\\"done_all\\"\\r\\n            :label=\\"update_text\\" no-caps\\u003E\\r\\n        \\u003C\\u002Fq-btn\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n    \\u003Cdiv\\u003E\\r\\n        \\u003Cdiv ref=\\"m_editor\\" style=\\"min-height:28px; height: 100%; width:100%\\"\\u003E\\u003C\\u002Fdiv\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n\\u003C\\u002Fdiv\\u003E",
    "data": function() { return { Value: null, input_type: 'string' } },
    "setup": function (props, { attrs, slots, emit, expose }) {
                      return {
                          editor: {},
                          g: Vue.computed(() => g)
                      };
                  },
    "props": {
      "parsed": {
        "type2": "String",
        "required": true
      },
      "update_text": {
        "type2": "String",
        "required": false,
        "default": ""
      },
      "lang": {
        "type2": "String",
        "required": false,
        "default": "javascript"
      },
      "format_on_start": {
        "type2": "Boolean",
        "required": false,
        "default": false
      },
      "isreadonly": {
        "type2": "Boolean",
        "required": false,
        "default": false
      }
    },
    "emits": [
      "update:parsed",
      "update"
    ],
    "created": function() { this.update_parsed() },
    "watch": {
      "parsed": {
        "handler": function(newValue, oldValue) { this.update_parsed() },
        "deep": false
      }
    },
    "mounted": function() {
                      var this1 = this
                      this.editor = g.monaco.editor.create(this.$refs.m_editor, {
                          value: this1.Value,
                          overviewRulerLanes: 0,
                          hideCursorInOverviewRuler: true,
                          language: this1.lang,
                          readOnly: false,
                          minimap: { enabled: false },
                          showFoldingControls: 'always',
                          scrollbar: { vertical: 'hidden', horizontal: "visible" },
                          overviewRulerBorder: false,
                          automaticLayout: true,
                          scrollBeyondLastLine: false,
                          //theme: "vs-dark",
                          // automaticLayout: true
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
                              });
                          });
                      };
                      registerOnDidChangeFolding();
                      this.editor.onDidChangeModel(registerOnDidChangeFolding);
                  },
    "methods": {
      "update_editor": function () {
                          const contentHeight = this.editor.getModel().getLineCount() * 19;
                          $(this.$refs.m_editor).css('height', contentHeight + 'px');
                          this.editor.layout();
                          this.Value = this.editor.getValue()
                      },
      "update_parsed": function() {
                          this.Value = this.parsed
                          try {
                              this.editor.getModel().setValue(this.parsed)
                              if (this.format_on_start) {
                                  this.editor.getAction('editor.action.formatDocument').run()
                              }
                          } catch (error) { }
                      },
      "update_parent": function() {
                          this.$emit('update', this.Value)
                      }
    }
  }
}` }, { name: "toggle-content", data: `{
  "VApp": {
    "template": "\\u003Cspan ref=\\"controls\\" v-bind=\\"$attrs\\"\\u003E\\r\\n                \\u003Cslot name=\\"control\\"\\u003E\\r\\n                  \\u003Cp\\u003Econtrol slot is empty\\u003C\\u002Fp\\u003E\\r\\n                \\u003C\\u002Fslot\\u003E\\r\\n              \\u003C\\u002Fspan\\u003E\\r\\n\\u003Cslot v-if=\\"show_inner\\"\\u003E\\r\\n    \\u003Cp\\u003Edefault slot is empty\\u003C\\u002Fp\\u003E\\r\\n\\u003C\\u002Fslot\\u003E",
    "props": {
      "show_inner_p": {
        "type2": "Boolean",
        "default": true,
        "required": false
      }
    },
    "data": function() {
                    return { show_inner: true }
                },
    "created": function() {
                    this.show_inner = this.show_inner_p
                },
    "mounted": function() {
                    var this1 = this
                    var a = this.$refs.controls
                    var b = $(a).find(".toggle-handle")
                    if (!b[0]) {
                        console.log('no handle found, add toggle-handle class to any ui element.')
                    }
                    else {
                        var b = b[0]
                        $(b).click(function () {
                            this1.show_inner = !this1.show_inner
                        })
                    }
                },
    "setup": function (props, { attrs, slots, emit, expose }) {
                    return { g: Vue.computed(() => g) };
                }
  }
}` }, { name: "j-edit", data: `{
  "VApp": {
    "template": "\\u003Cspan\\u003E\\r\\n    \\u003Cbutton style=\\"color: #0420b7; padding-right:0px; margin-right:0px\\" @click=\\"isOpened = !isOpened\\" class=\\"btn-hide-1\\"\\u003E\\r\\n            {{ Array.isArray(flowValue) ? (' [  ' + (flowValue.length)) : (' { ' + (Object.keys(flowValue).length) ) }}\\r\\n\\r\\n            \\u003Cspan style=\\"color:black\\" v-if=\\"g.f.getType(flowValue) == 'object' && flowValue.hasOwnProperty('name')\\"\\u003E\\r\\n                 -\\r\\n                 {{ flowValue.name }}\\r\\n            \\u003C\\u002Fspan\\u003E\\r\\n\\r\\n            \\u003Cq-popup-proxy context-menu breakpoint=\\"0\\"\\u003E\\r\\n                \\u003Cdiv style=\\"border:1px solid black; border-radius:8px; padding:8px; background-color:white\\"\\u003E\\r\\n                    \\u003Cdiv  v-if=\\"Array.isArray(flowValue)\\"\\u003E\\r\\n                        \\u003Cq-btn no-caps \\r\\n                            @click=\\"flowValue.splice((flowValue.length + 1), 0, null); sendModelValue();\\"\\u003E+\\r\\n                        \\u003C\\u002Fq-btn\\u003E\\r\\n                    \\u003C\\u002Fdiv\\u003E\\r\\n                    \\u003Cq-btn no-caps v-else\\r\\n                        @click=\\"flowValue['new_key' + (Object.keys(flowValue).length + 1)] = null; sendModelValue();\\"\\u003E+\\r\\n                    \\u003C\\u002Fq-btn\\u003E\\r\\n                    \\u003Cbr \\u002F\\u003E\\r\\n                    \\u003Cq-btn style=\\"margin-top:8px\\" no-caps @click=\\"isReArrange = !isReArrange\\"\\u003EReArrange\\u003C\\u002Fq-btn\\u003E\\r\\n                \\u003C\\u002Fdiv\\u003E\\r\\n            \\u003C\\u002Fq-popup-proxy\\u003E\\r\\n    \\u003C\\u002Fbutton\\u003E\\r\\n    \\u003Cdiv v-if=\\"isReArrange\\" style=\\"border:2px dotted lightblue\\" class=\\"q-pa-sm\\"\\u003E\\r\\n        \\u003Cbutton @click=\\"isReArrange = false\\"\\u003EX\\u003C\\u002Fbutton\\u003E\\r\\n        \\u003Cdiv\\u003E\\r\\n            ..... ..... .....\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n    \\u003Cdiv v-if=\\"isOpened\\" class=\\"q-ml-md\\"\\u003E\\r\\n        \\u003Carray-edit :objType=\\"'array'\\" :modelValue=\\"g.f.ArrayToKeyArray(flowValue)\\" v-if=\\"Array.isArray(flowValue)\\"\\r\\n            @update:model-value=\\"flowValue = g.f.KeyArrayToArray($event); sendModelValue();\\"\\u003E\\r\\n        \\u003C\\u002Farray-edit\\u003E\\r\\n        \\u003Carray-edit :objType=\\"'object'\\" :modelValue=\\"g.f.objectToKeyArray(flowValue)\\" v-else\\r\\n            @update:model-value=\\"flowValue = g.f.KeyArrayToObject($event); sendModelValue()\\"\\u003E\\r\\n        \\u003C\\u002Farray-edit\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n    \\u003Cbutton style=\\"color: #0420b7;\\" @click=\\"isOpened = !isOpened\\" class=\\"btn-hide-1\\"\\u003E\\r\\n            {{ Array.isArray(flowValue) ? ']' : '}' }}\\r\\n            \\u003Cq-popup-proxy context-menu breakpoint=\\"0\\"\\u003E\\r\\n                \\u003Cdiv\\u003E\\r\\n                    \\u003Cq-btn no-caps v-if=\\"Array.isArray(flowValue)\\"\\r\\n                        @click=\\"flowValue.splice((flowValue.length + 1), 0, null); sendModelValue();\\"\\u003E+\\u003C\\u002Fq-btn\\u003E\\r\\n                    \\u003Cq-btn no-caps v-else\\r\\n                        @click=\\"flowValue['new_key' + (Object.keys(flowValue).length + 1)] = null; sendModelValue();\\"\\u003E+\\u003C\\u002Fq-btn\\u003E\\r\\n                    \\u003Cbr \\u002F\\u003E\\r\\n                    \\u003Cq-btn no-caps\\u003EReArrange\\u003C\\u002Fq-btn\\u003E\\r\\n                \\u003C\\u002Fdiv\\u003E\\r\\n            \\u003C\\u002Fq-popup-proxy\\u003E\\r\\n    \\u003C\\u002Fbutton\\u003E\\r\\n\\u003C\\u002Fspan\\u003E",
    "data": function() { return { flowValue: null, isOpened: true, isReArrange: false } },
    "setup": function (props, { attrs, slots, emit, expose }) {
                    return {
                        g: Vue.computed(() => g)
                    };
                },
    "props": {
      "modelValue": {
        "type2": "[Object, Array]",
        "required": true
      },
      "isopen": {
        "type2": "Boolean",
        "required": false,
        "default": true
      }
    },
    "emits": [
      "update:modelValue"
    ],
    "created": function() {
                    this.isOpened = this.isopen
                    this.updateFlowValue()
                },
    "watch": {
      "modelValue": {
        "handler": function (newValue, oldValue) {
                            if (g.f.PS(newValue) != g.f.PS(oldValue)) { this.updateFlowValue() }
                        },
        "deep": true
      }
    },
    "methods": {
      "updateFlowValue": function (modelValue = this.modelValue) {
                        this.flowValue = g.f.PS(modelValue)
                    },
      "sendModelValue": function (flowValue = this.flowValue) {
                        // console.log( "sendModelValue in JEdit", g.f.PS(flowValue));
                        this.$emit('update:modelValue', g.f.PS(flowValue))
                    }
    }
  }
}` }, { name: "array-edit", data: `{
  "VApp": {
    "template": "\\u003Cdiv v-bind=\\"$attrs\\"\\u003E\\r\\n    \\u003Cdiv v-for=\\"(element, element_no) in flowValue\\"\\u003E\\r\\n        \\u003Cbutton class=\\"btn-hide-1\\"\\u003E\\r\\n            \\u003Cspan style=\\"color:darkslategrey; font-weight:bolder\\"\\u003E\\r\\n                \\u003Cspan v-if=\\"objType == 'object'\\"\\u003E{{ element.name }}\\u003C\\u002Fspan\\u003E\\r\\n                \\u003Cspan v-if=\\"false && objType == 'array'\\"\\u003E{{ element }}\\u003C\\u002Fspan\\u003E\\r\\n                \\u003Cspan v-if=\\"objType == 'array'\\"\\u003E{{ element_no + 1 }}\\u003C\\u002Fspan\\u003E\\r\\n            \\u003C\\u002Fspan\\u003E\\r\\n            \\u003Cq-popup-proxy  breakpoint=\\"0\\"\\u003E\\r\\n\\u003Cdiv style=\\"border:1px solid black; border-radius:8px; margin:0px; padding:3px\\"\\u003E\\r\\n\\u003Cdiv  v-if=\\"objType == 'object'\\"\\u003E\\r\\n\\u003Cinput style=\\"text-align:center\\" class=\\"q-pl-sm\\" type=\\"text\\" v-model=\\"element.name\\" @blur=\\"sendModelValue()\\" \\u002F\\u003E\\r\\n\\u003C\\u002Fdiv\\u003E\\r\\n\\u003Cdiv\\u003E\\r\\n\\u003Cspan @click=\\"element.data = null; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'null' ? checked_style : un_checked_style\\"\\u003Enull\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = undefined; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'undefined' ? checked_style : un_checked_style\\"\\u003Eundefined\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = 'strings'; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'string' ? checked_style : un_checked_style\\"\\u003Estring\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cbr \\u002F\\u003E\\r\\n\\u003Cspan @click=\\"element.data = 0; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'number' ? checked_style : un_checked_style\\"\\u003Enumber\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = false; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'boolean' ? checked_style : un_checked_style\\"\\u003Eboolean\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = {}; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'object' ? checked_style : un_checked_style\\"\\u003Eobject\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cbr \\u002F\\u003E\\r\\n\\u003Cspan @click=\\"element.data = []; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'array' ? checked_style : un_checked_style\\"\\u003Earray\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = new Date(); sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'date' ? checked_style : un_checked_style\\"\\u003Edate\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = new Map(); sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'map' ? checked_style : un_checked_style\\"\\u003Emap\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = new Set(); sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'set' ? checked_style : un_checked_style\\"\\u003Eset\\u003C\\u002Fspan\\u003E \\u003Cbr \\u002F\\u003E\\r\\n\\u003Cspan @click=\\"element.data = function () { g.console.log('new function') }; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'function' ? checked_style : un_checked_style\\"\\u003Efunction\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = \\u002Fsir\\u002Fi; sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'regexp' ? checked_style : un_checked_style\\"\\u003Eregexp\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan @click=\\"element.data = BigInt(10); sendModelValue()\\"\\r\\n    :style=\\"g.f.getType(element.data) == 'bigint' ? checked_style : un_checked_style\\"\\u003Ebigint\\u003C\\u002Fspan\\u003E\\r\\n\\u003C\\u002Fdiv\\u003E\\r\\n\\u003Cdiv\\u003E\\r\\n\\u003Cspan style=\\"cursor:pointer\\" @click=\\"flowValue.splice(element_no, 1); sendModelValue()\\" class=\\"q-pa-sm\\"\\u003EX\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan style=\\"cursor:pointer\\" @click=\\"g.f.dup(flowValue, element_no); sendModelValue()\\" class=\\"q-pa-sm\\"\\u003EDup\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan style=\\"cursor:pointer\\" @click=\\"flowValue[element_no] = g.f.PS(g.current_import) || null\\"\\r\\n    class=\\"q-pa-sm\\"\\u003EImport\\u003C\\u002Fspan\\u003E\\r\\n\\u003Cspan style=\\"cursor:pointer\\" @click=\\"g.current_import = g.f.PS(flowValue[element_no])\\" class=\\"q-pa-sm\\"\\u003EExport\\u003C\\u002Fspan\\u003E\\r\\n\\u003C\\u002Fdiv\\u003E\\r\\n\\u003C\\u002Fdiv\\u003E\\r\\n            \\u003C\\u002Fq-popup-proxy\\u003E\\r\\n        \\u003C\\u002Fbutton\\u003E\\r\\n        \\u003Cspan style=\\"font-weight: bolder; color:black; margin-right: 3px;\\"\\u003E : \\u003C\\u002Fspan\\u003E\\r\\n        \\u003Cspan v-if=\\"g.f.getType(element.data) == 'boolean'\\"\\r\\n            style=\\"color:darkslategrey; cursor:pointer; user-select: none;\\"\\r\\n            @dblclick=\\"element.data = !element.data; sendModelValue()\\"\\u003E\\r\\n            {{ element.data }}\\r\\n        \\u003C\\u002Fspan\\u003E\\r\\n        \\u003Cbutton v-if=\\"g.f.getType(element.data) == 'string'\\" class=\\"btn-hide-1\\"\\r\\n            style=\\"color:darkslategrey\\"\\u003E\\r\\n            {{ element.data.substring(0, 30).length ? element.data.substring(0, 30) : 'empty string' }}\\r\\n            \\u003Cq-popup-proxy persistent breakpoint=\\"0\\"\\u003E\\r\\n                \\u003CTeleport :to=\\"'#' + this_id + 'element' + element_no\\"\\u003E\\r\\n                    \\u003Cdiv\\u003E\\r\\n\\r\\n                    \\u003Ctoggle-content v-if=\\"! zzz(element.data)\\" :show_inner_p=\\"false\\"\\u003E\\r\\n                            \\u003Ctemplate #control\\u003E\\r\\n                                \\u003Cbutton style=\\"color:darkslategrey\\"\\r\\n                                    class=\\"toggle-handle btn-hide-1 q-mt-sm q-mx-sm\\"\\u003EDOM\\u003C\\u002Fbutton\\u003E\\r\\n        \\u003C\\u002Ftemplate\\u003E\\r\\n        \\u003Cdiv\\u003E\\r\\n            \\u003Cmonaco-editor v-if=\\"false\\" :lang=\\"'html'\\" @update=\\"element.data = g.f.PS($event); sendModelValue()\\"\\r\\n                :parsed=\\"g.f.PS(element.data)\\"\\u003E\\u003C\\u002Fmonaco-editor\\u003E\\r\\n\\r\\n            \\u003Cdom-parser v-if=\\"true\\" style=\\"margin: 16px 0px; padding: 16px 16px; border: 1px dashed green;\\"\\r\\n                @update=\\"element.data = g.f.PS($event); sendModelValue()\\" :model-value=\\"g.f.PS(element.data)\\"\\u003E\\r\\n            \\u003C\\u002Fdom-parser\\u003E\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003C\\u002Ftoggle-content\\u003E\\r\\n\\r\\n\\r\\n\\r\\n        \\u003Ctoggle-content v-if=\\"! zzz(element.data)\\" :show_inner_p=\\"true\\"\\u003E\\r\\n            \\u003Ctemplate #control\\u003E\\r\\n                \\u003Cbutton style=\\"color:darkslategrey\\"\\r\\n                                    class=\\"toggle-handle btn-hide-1 q-mt-sm q-mx-sm\\"\\u003Ehtml\\u003C\\u002Fbutton\\u003E\\r\\n            \\u003C\\u002Ftemplate\\u003E\\r\\n            \\u003Cdiv\\u003E\\r\\n                \\u003Cmonaco-editor :lang=\\"'html'\\" @update=\\"element.data = g.f.PS($event); sendModelValue()\\"\\r\\n                    :parsed=\\"g.f.PS(element.data)\\"\\u003E\\u003C\\u002Fmonaco-editor\\u003E\\r\\n            \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003C\\u002Ftoggle-content\\u003E\\r\\n        \\u003Ctoggle-content v-if=\\"! zzz(element.data)\\" :show_inner_p=\\"false\\"\\u003E\\r\\n            \\u003Ctemplate #control\\u003E\\r\\n                \\u003Cbutton style=\\"color:darkslategrey\\" class=\\"toggle-handle btn-hide-1 q-mx-sm\\"\\u003ECSS\\u003C\\u002Fbutton\\u003E\\r\\n            \\u003C\\u002Ftemplate\\u003E\\r\\n            \\u003Cdiv\\u003E\\r\\n                \\u003Cmonaco-editor :lang=\\"'css'\\" @update=\\"element.data = g.f.PS($event); sendModelValue()\\"\\r\\n                    :parsed=\\"g.f.PS(element.data)\\"\\u003E\\u003C\\u002Fmonaco-editor\\u003E\\r\\n            \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003C\\u002Ftoggle-content\\u003E\\r\\n        \\u003Ctoggle-content v-if=\\"! zzz(element.data)\\" :show_inner_p=\\"false\\"\\u003E\\r\\n            \\u003Ctemplate #control\\u003E\\r\\n                \\u003Cbutton style=\\"color:darkslategrey\\" class=\\"toggle-handle btn-hide-1 q-mx-sm\\"\\u003EJS\\u003C\\u002Fbutton\\u003E\\r\\n            \\u003C\\u002Ftemplate\\u003E\\r\\n            \\u003Cdiv\\u003E\\r\\n                \\u003Cmonaco-editor :lang=\\"'javascript'\\" @update=\\"element.data = g.f.PS($event); sendModelValue()\\"\\r\\n                    :parsed=\\"g.f.PS(element.data)\\"\\u003E\\u003C\\u002Fmonaco-editor\\u003E\\r\\n            \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003C\\u002Ftoggle-content\\u003E\\r\\n\\r\\n        \\u003Ctoggle-content v-if=\\"false\\" :show_inner_p=\\"true\\"\\u003E\\r\\n            \\u003Ctemplate #control\\u003E\\r\\n                \\u003Cspan style=\\"color:darkslategrey\\" class=\\"toggle-handle btn-hide-1\\"\\u003E.\\u003C\\u002Fspan\\u003E\\r\\n            \\u003C\\u002Ftemplate\\u003E\\r\\n            \\u003Cdiv v-if=\\"zzz(element.data)\\"\\u003E\\r\\n                \\u003Cj-edit :model-value=\\"g.f.P(element.data)\\" :isopen=\\"false\\"\\r\\n                    @update:model-value=\\"element.data = g.f.S($event); sendModelValue()\\"\\u003E\\r\\n                \\u003C\\u002Fj-edit\\u003E\\r\\n            \\u003C\\u002Fdiv\\u003E\\r\\n            \\u003Cspan v-else\\u003E .\\u003C\\u002Fspan\\u003E\\r\\n        \\u003C\\u002Ftoggle-content\\u003E\\r\\n\\r\\n        \\u003Cdiv v-if=\\"zzz(element.data)\\"\\u003E \\r\\n            \\u003Cj-edit :model-value=\\"g.f.P(element.data)\\" :isopen=\\"false\\"\\r\\n                @update:model-value=\\"element.data = g.f.S($event); sendModelValue()\\"\\u003E\\r\\n            \\u003C\\u002Fj-edit\\u003E\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n\\r\\n    \\u003C\\u002FTeleport\\u003E\\r\\n    \\u003C\\u002Fq-popup-proxy\\u003E\\r\\n    \\u003C\\u002Fbutton\\u003E\\r\\n    \\u003Cbutton v-if=\\"g.f.getType(element.data) == 'number'\\" style=\\"color:darkslategrey;\\"\\r\\n                        class=\\"btn-hide-1\\"\\u003E\\r\\n            {{ element.data }}\\r\\n            \\u003Cq-popup-proxy breakpoint=\\"0\\"\\u003E\\r\\n                \\u003Cdiv\\u003E\\r\\n                    \\u003Cinput type=\\"number\\" v-model.number=\\"element.data\\" @blur=\\"sendModelValue()\\" \\u002F\\u003E\\r\\n                \\u003C\\u002Fdiv\\u003E\\r\\n            \\u003C\\u002Fq-popup-proxy\\u003E\\r\\n        \\u003C\\u002Fbutton\\u003E\\r\\n    \\u003Cj-edit :isopen=\\"false\\" v-if=\\"g.f.getType(element.data) == 'array' || g.f.getType(element.data) == 'object'\\"\\r\\n        style=\\"color:rgb(153, 46, 46);\\" :model-value=\\"element.data\\"\\r\\n        @update:model-value=\\"element.data = g.f.PS($event); sendModelValue()\\"\\u003E\\r\\n    \\u003C\\u002Fj-edit\\u003E\\r\\n    \\u003Cspan v-if=\\"g.f.getType(element.data) == 'null' || g.f.getType(element.data) == 'undefined'\\"\\r\\n                        style=\\"color:darkslategrey\\"\\u003E\\r\\n                        {{ g.f.getType(element.data) == 'null' ? 'null' : 'undefined' }}\\r\\n        \\u003C\\u002Fspan\\u003E\\r\\n    \\u003Ctemplate v-if=\\"isright(element.data)\\"\\u003E\\r\\n        \\u003Cbutton class=\\"btn-hide-1\\" style=\\"color:darkslategrey;\\"\\u003E\\r\\n                {{ g.f.getType(element.data) }}\\r\\n                \\u003Cq-popup-proxy persistent breakpoint=\\"0\\"\\u003E\\r\\n                    \\u003CTeleport :to=\\"'#' + this_id + 'element' + element_no\\"\\u003E\\r\\n                        \\u003Cmonaco-editor @update=\\"element.data = g.f.P($event); sendModelValue()\\"\\r\\n                            :parsed=\\"g.f.S(element.data)\\"\\u003E\\u003C\\u002Fmonaco-editor\\u003E\\r\\n                    \\u003C\\u002FTeleport\\u003E\\r\\n                \\u003C\\u002Fq-popup-proxy\\u003E\\r\\n            \\u003C\\u002Fbutton\\u003E\\r\\n    \\u003C\\u002Ftemplate\\u003E\\r\\n    \\u003Cdiv :id=\\"this_id + 'element' + element_no\\"\\u003E\\u003C\\u002Fdiv\\u003E\\r\\n\\u003C\\u002Fdiv\\u003E\\r\\n\\u003C\\u002Fdiv\\u003E",
    "data": function() { return { flowValue: null } },
    "setup": function (props, { attrs, slots, emit, expose }) {
                    var common_style = "padding-left:5px; padding-right:5px; cursor:pointer;"
                    var checked_style = "background-color:black; color:white; border-radius:3px;"
                    var un_checked_style = ""
                    var this_id = g.f.generateUID(4)
                    return {
                        g: Vue.computed(() => g),
                        alert: Vue.ref(true),
                        un_checked_style: common_style + un_checked_style,
                        checked_style: common_style + checked_style,
                        this_id: this_id
                    };
                },
    "props": {
      "modelValue": {
        "type2": "Array",
        "required": true
      },
      "objType": {
        "type2": "String",
        "required": true
      }
    },
    "emits": [
      "update:modelValue"
    ],
    "created": function() {
                    this.updateFlowValue()
                },
    "watch": {
      "modelValue": {
        "handler": function (newValue, oldValue) {
                            if (g.f.PS(newValue) != g.f.PS(oldValue)) { this.updateFlowValue() }
                        },
        "deep": true
      }
    },
    "methods": {
      "updateFlowValue": function (modelValue = this.modelValue) {
                        this.flowValue = g.f.PS(modelValue)
                    },
      "sendModelValue": function (flowValue = this.flowValue) {
                        this.$emit('update:modelValue', g.f.PS(flowValue))
                    },
      "zzz": function (data) {
                        var result1 = false
                        var result2 = false
                        try {
                            var a = g.f.getType(g.f.P(data))
                            if (a) {
                                result1 = true
                                result2 = a
                            }
                        } catch (error) { }

                        if (result1) {
                            // return true
                            // console.log('result2', result2);
                            if (result2 == 'object' || result2 == 'array') {
                                return true
                            }
                        }
                        // g.f.getType(g.f.P(element.data)) == 'object' || g.f.getType(g.f.P(element.data)) == 'array' == 'object' || g.f.getType(g.f.P(element.data)) == 'array'
                        return false
                    },
      "isright": function (data) {
                        if (
                            g.f.getType(data) == 'date' ||
                            g.f.getType(data) == 'set' ||
                            g.f.getType(data) == 'map' ||
                            g.f.getType(data) == 'function' ||
                            g.f.getType(data) == 'regexp' ||
                            g.f.getType(data) == 'bigint'
                        ) {
                            return true
                        } else {
                            return false
                        }
                    }
    }
  }
}` }, { name: "dom-parser", data: `{
  "VApp": {
    "template": "\\u003Cp style=\\"margin-top:12px\\"\\u003E\\r\\n\\u003Cdiv style=\\"font-weight:bolder; margin-bottom:8px\\" v-if=\\"t.tagName\\"\\u003E\\r\\n    {{t.tagName}}\\r\\n\\u003C\\u002Fdiv\\u003E\\r\\n\\u003Ctoggle-content :show_inner_p=\\"true\\"\\u003E\\r\\n    \\u003Ctemplate v-slot:control\\u003E\\r\\n        \\u003Cbutton style=\\"padding:0px 8px; background-color:rgba(1,1,1,0.1); border:none; margin-top:8px;\\"\\r\\n            class=\\"toggle-handle\\"\\u003E\\r\\n                {{  g.f.objectToKeyArray( getAttributes(t) ).length  }} -\\r\\n            Attributes\\r\\n\\r\\n                \\u003C\\u002Fbutton\\u003E\\r\\n    \\u003C\\u002Ftemplate\\u003E\\r\\n    \\u003Cdiv style=\\"border:none; padding:0px; margin:16px 0px;\\"\\u003E\\r\\n        \\u003Cp style=\\"font-weight:bolder; margin-top:16px\\"\\u003E\\r\\n        \\u003Cp\\u003E\\r\\n            \\u003Ctoggle-content :show_inner_p=\\"false\\"\\u003E\\r\\n                \\u003Ctemplate v-slot:control\\u003E\\r\\n                    \\u003Cbutton style=\\"margin:5px 0px; border:none; background-color:rgba(1,1,1,.1)\\" class=\\"toggle-handle\\"\\u003E+\\u003C\\u002Fbutton\\u003E\\r\\n                \\u003C\\u002Ftemplate\\u003E\\r\\n                \\u003Cdiv\\u003E\\r\\n                    \\u003Cinput style=\\"margin:8px 0px; padding-left:8px; border:none; background-color:rgba(1,1,1,.1)\\" v-model=\\"newAttrName\\" \\u002F\\u003E\\r\\n                    \\u003Cbr \\u002F\\u003E\\r\\n                    \\u003Cbutton style=\\"margin:5px 0px\\" @click=\\"new_attr(); sendModelValue()\\"\\u003ESubmit\\u003C\\u002Fbutton\\u003E\\r\\n                \\u003C\\u002Fdiv\\u003E\\r\\n            \\u003C\\u002Ftoggle-content\\u003E\\r\\n        \\u003C\\u002Fp\\u003E\\r\\n        \\u003C\\u002Fp\\u003E\\r\\n        \\u003Cp\\u003E\\r\\n        \\u003Cdiv v-for=\\"(s_val, s_name, no) in getAttributes(t)\\"\\u003E\\r\\n            \\u003Ctoggle-content :show_inner_p=\\"false\\"\\u003E\\r\\n                \\u003Ctemplate v-slot:control\\u003E\\r\\n                    \\u003Cbutton style=\\"background-color:rgba(1,1,1,.1); border:none; font-weight:bolder\\" class=\\"toggle-handle\\"\\u003E{{\\r\\n                s_name }}\\u003C\\u002Fbutton\\u003E\\r\\n                \\u003C\\u002Ftemplate\\u003E\\r\\n                \\u003Cdiv\\u003E\\r\\n                    \\u003Cbutton @click=\\"g.$(t).removeAttr(s_name); sendModelValue()\\"\\r\\n                style=\\"background-color:transparent; border:none\\"\\u003EX\\u003C\\u002Fbutton\\u003E\\r\\n                    \\u003Cbutton @click=\\"dupAttr(s_name, s_val); sendModelValue()\\"\\r\\n                style=\\"background-color:transparent; border:none\\"\\u003EDup\\u003C\\u002Fbutton\\u003E\\r\\n                \\u003C\\u002Fdiv\\u003E\\r\\n                \\u003Cdiv\\u003E\\r\\n                    \\u003Cmonaco-editor @update=\\"updateName(s_name, $event, s_val);  sendModelValue()\\" :update_text=\\"''\\"\\r\\n                        :lang=\\"'javascript'\\" :format_on_start=\\"false\\" :isreadonly=\\"false\\" :parsed=\\"s_name\\"\\u003E\\r\\n                    \\u003C\\u002Fmonaco-editor\\u003E\\r\\n                \\u003C\\u002Fdiv\\u003E\\r\\n                \\u003Cdiv\\u003E\\r\\n                    \\u003Cmonaco-editor @update=\\"g.$(t).attr(s_name, $event); sendModelValue()\\" :update_text=\\"''\\"\\r\\n                        :lang=\\"'javascript'\\" :format_on_start=\\"false\\" :isreadonly=\\"false\\" :parsed=\\"s_val\\"\\u003E\\r\\n                    \\u003C\\u002Fmonaco-editor\\u003E\\r\\n                \\u003C\\u002Fdiv\\u003E\\r\\n            \\u003C\\u002Ftoggle-content\\u003E\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003C\\u002FP\\u003E\\r\\n    \\u003C\\u002Fdiv\\u003E\\r\\n\\u003C\\u002Ftoggle-content\\u003E\\r\\n\\u003Cp\\u003E\\r\\n    \\u003Ctoggle-content :show_inner_p=\\"true\\"\\u003E\\r\\n        \\u003Ctemplate v-slot:control\\u003E\\r\\n            \\u003Cbutton style=\\"padding:0px 8px; background-color:rgba(1,1,1,.1); border:none;\\"\\r\\n            class=\\"toggle-handle\\"\\u003E {{ g.$(t).contents().length }} - Childrens  \\u003C\\u002Fbutton\\u003E\\r\\n            \\u003Cbutton\\r\\n    style=\\"border:none; background-color:rgba(1,1,1,.1); margin-left:8px\\"\\r\\n    @click=\\"g.console.log(g.$(t).contents())\\"\\u003EChildrens\\u003C\\u002Fbutton\\u003E\\r\\n        \\u003C\\u002Ftemplate\\u003E\\r\\n        \\u003Cdiv v-if=\\"true\\" style=\\"border:none; padding:0px; margin-top:16px\\"\\u003E\\r\\n\\r\\n\\r\\n\\r\\n\\r\\n            \\u003Cdiv v-for=\\"(a, b) in g.$(t).contents()\\" style=\\"border:1px dashed rgba(1,1,1,.2);\\"\\u003E\\r\\n                \\u003Ctoggle-content :show_inner_p=\\"false\\"\\u003E\\r\\n                    \\u003Ctemplate v-slot:control\\u003E\\r\\n                        \\u003Cdiv style=\\"font-weight:bolder; background-color:rgba(1,1,1,.05);\\" v-if=\\"a.nodeType==1\\"\\r\\n                            class=\\"toggle-handle\\"\\u003E\\r\\n                            {{a.tagName.toLowerCase()}}\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                        \\u003Cdiv style=\\"font-weight:bolder; background-color:rgba(1,1,1,.1);\\" v-else-if=\\"a.nodeType==2\\"\\r\\n                            class=\\"toggle-handle\\"\\u003E\\r\\n                            Attribute\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                        \\u003Cdiv v-else-if=\\"a.nodeType==3\\" class=\\"toggle-handle\\" style=\\"background-color:rgba(1,1,1,.05)\\"\\u003E\\r\\n                            \\u003Cspan style=\\"font-weight:bolder;\\"\\u003Etext : \\u003C\\u002Fspan\\u003E\\r\\n                            \\u003Cspan style=\\"font-weight:bolder; color:grba(0,0,1)\\"\\u003E{{a.nodeValue.length}} : \\u003C\\u002Fspan\\u003E\\r\\n                            {{a.nodeValue}}\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                        \\u003Cdiv v-else-if=\\"a.nodeType==8\\" class=\\"toggle-handle\\"\\r\\n                            style=\\"font-weight:bolder; background-color:rgba(1,1,1,.05)\\"\\u003E\\r\\n                            Comment\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                        \\u003Cdiv v-else class=\\"toggle-handle\\" style=\\"font-weight:bolder; background-color:rgba(1,1,1,.05)\\"\\u003E\\r\\n                            \\u003Cbutton class=\\"toggle-handle\\"\\u003EType ???\\u003C\\u002Fbutton\\u003E\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                    \\u003C\\u002Ftemplate\\u003E\\r\\n                    \\u003Cdiv\\u003E\\r\\n                        \\u003Cbutton style=\\"background-color:rgba(0,0,0,.08); border:none; margin-left:8px\\" @click=\\"g.console.log('a', typeof a,  a);\\"\\u003ELog\\u003C\\u002Fbutton\\u003E\\r\\n                    \\u003C\\u002Fdiv\\u003E\\r\\n                    \\u003Cdiv style=\\"margin-top:16px\\"\\u003E\\r\\n                        \\u003Cdiv v-if=\\"a.nodeType==1\\"\\u003E\\r\\n                            \\u003Cdom-parser style=\\"margin: 16px 0px; padding: 16px 16px; border: 1px dashed green;\\"\\r\\n                                v-if=\\"true\\" @update=\\"g.console.log($event)\\" :model-value=\\"g.f.GetDomResult(a)\\"\\u003E\\r\\n                            \\u003C\\u002Fdom-parser\\u003E\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                        \\u003Cdiv v-else-if=\\"a.nodeType==2\\"\\u003E\\r\\n                            Attribute\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                        \\u003Cdiv v-else-if=\\"a.nodeType==3\\"\\u003E\\r\\n                            \\u003Cmonaco-editor v-if=\\"true\\" @update=\\"g.console.log(typeof $event, $event)\\" :update_text=\\"''\\"\\r\\n                                :lang=\\"'javascript'\\" :format_on_start=\\"false\\" :isreadonly=\\"false\\" :parsed=\\"a.nodeValue\\"\\u003E\\r\\n                            \\u003C\\u002Fmonaco-editor\\u003E\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                        \\u003Cdiv v-else-if=\\"a.nodeType==8\\"\\u003E\\r\\n                            Comment\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                        \\u003Cdiv v-else\\u003E\\r\\n                            \\u003Cbutton class=\\"toggle-handle\\"\\u003EType ???\\u003C\\u002Fbutton\\u003E\\r\\n                        \\u003C\\u002Fdiv\\u003E\\r\\n                    \\u003C\\u002Fdiv\\u003E\\r\\n                    \\u003Cdiv\\u003E\\r\\n                    \\u003C\\u002Fdiv\\u003E\\r\\n                \\u003C\\u002Ftoggle-content\\u003E\\r\\n            \\u003C\\u002Fdiv\\u003E\\r\\n        \\u003C\\u002Fdiv\\u003E\\r\\n    \\u003C\\u002Ftoggle-content\\u003E\\r\\n\\u003C\\u002Fp\\u003E\\r\\n\\u003C\\u002Fp\\u003E",
    "setup": function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
    "data": function() { return { flowValue: null, t: null, newAttrName: "newAttrName" } },
    "props": {
      "modelValue": {
        "type2": "[String]",
        "required": true
      }
    },
    "emits": [
      "update"
    ],
    "created": function() {
                        this.updateFlowValue()
                    },
    "watch": {
      "modelValue": {
        "handler": function (newValue, oldValue) {
                                this.updateFlowValue()
                            },
        "deep": false
      }
    },
    "methods": {
      "dupAttr": function (s_name, s_val) {
                            g.$(this.t).attr(s_name + '_dup', s_val);
                        },
      "updateName": function (s_name, new_name, s_val) {
                            // var s_val = s_val
                            g.$(this.t).attr(new_name, s_val);
                            g.$(this.t).removeAttr(s_name);
                        },
      "new_attr": function () {
                            // newAttrName
                            g.$(this.t).attr(this.newAttrName, 'someValue');
                        },
      "getAttributes": function (node) {
                            var i,
                                attributeNodes = node.attributes,
                                length = attributeNodes.length,
                                attrs = {};
    
                            for (i = 0; i < length; i++) attrs[attributeNodes[i].name] = attributeNodes[i].value;
                            return attrs;
                        },
      "UpdateT": function () {
                            // console.log($(this.t).attr('id'));
                            $(this.t).attr('id', 'a66')
    
                            console.log(this.getAttributes(this.t));
    
    
                            this.sendModelValue()
                            // console.log('t', this.t);
                            // this.$forceUpdate()
                        },
      "updateFlowValue": function (modelValue = this.modelValue) {
                            this.flowValue = g.f.PS(modelValue)
                            this.t = (g.ParseDOM.parseFromString(this.flowValue, "text/html")).body.firstChild;
                        },
      "sendModelValue": function (flowValue = this.flowValue) {
                            // console.log( "sendModelValue in JEdit", g.f.PS(flowValue));
                            this.$emit('update', g.f.GetDomResult(this.t))
                        }
    }
  }
}` }, { name: "logged-in", data: `{
  "VApp": {
    "template": "\\u003Cp\\u003E \\r\\n    \\u003Cbutton @click=\\"logout_try()\\"\\u003ELog-out\\u003C\\u002Fbutton\\u003E\\r\\n\\u003C\\u002Fp\\u003E",
    "setup": function (props, { attrs, slots, emit, expose }) {
    return { g: Vue.computed(() => g) };
},
    "data": function() { return { } },
    "methods": {
      "logout_try": function () { \r
    g.socket.emit('msg', { type: 'LogOut' })\r
}
    }
  }
}` }, { name: "logged-out", data: `{
  "VApp": {
    "template": "\\u003Cp style=\\"margin:16px\\"\\u003E Please Log-in \\u003C\\u002Fp\\u003E\\r\\n\\u003Cp style=\\"margin:8px\\"\\u003E\\r\\n    \\u003Cinput style=\\"padding-left:8px\\" v-model=\\"uname\\" \\u002F\\u003E\\r\\n\\u003C\\u002Fp\\u003E\\r\\n\\u003Cp style=\\"margin:16px 8px\\"\\u003E\\r\\n    \\u003Cinput style=\\"padding-left:8px\\" v-model=\\"upass\\" \\u002F\\u003E\\r\\n\\u003C\\u002Fp\\u003E\\r\\n\\u003Cp style=\\"margin:8px\\"\\u003E\\r\\n    \\u003Cbutton @click=\\"log_try()\\"\\u003ESubmit\\u003C\\u002Fbutton\\u003E\\r\\n\\u003C\\u002Fp\\u003E",
    "setup": function (props, { attrs, slots, emit, expose }) {
    return { g: Vue.computed(() => g) };
},
    "data": function() { return { uname : "user name", upass:"password" } },
    "methods": {
      "log_try": function () { \r
    var uname = g.f.PS(this.uname)\r
    var upass = g.f.PS(this.upass)\r
    console.log(JSON.parse(localStorage.getItem("Frame_VP")).Version)\r
    // JSON.parse(localStorage.getItem("Frame_VP")).Version\r
    g.socket.emit('msg', { type: 'LogIn', data: {\r
        uname : uname, \r
        upass:upass,\r
        Version:JSON.parse(localStorage.getItem("Frame_VP")).Version\r
    } })\r
}
    }
  }
}` }]
  ), setItem("Directives", []), setItem("UsePlugins", []), setItem("Mixin", []), setItem("Composable", []), setItem("Templates", []);
}
var TargetURL_1 = JSON.parse(JSON.stringify(g.TargetURL)), GitURL = "https://mpsir.github.io/om", T1 = TargetURL_1, T2 = !1;
TargetURL_1 == "http://super1mpsir-57484.portmap.host:57484" ? T1 = GitURL : (T1 = TargetURL_1, T2 = !0);
g.f = {
  GetDomResult: function(e) {
    var n = g.StringifyXML.serializeToString(e);
    return n = n.replace(' xmlns="http://www.w3.org/1999/xhtml"', ""), n;
  },
  isCrome: function() {
    return navigator.userAgent.indexOf("Chrome") != -1;
  },
  S: function(e, n = { space: 2 }) {
    return g.serialize(e, n);
  },
  P: function(e) {
    return g.deserialize(e);
  },
  PS: function(e, n = { space: 2 }) {
    return g.deserialize(g.serialize(e, n));
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
  objectToKeyArray: function(n) {
    var n = g.f.PS(n), r = [];
    return Object.entries(n).forEach(function(u, o) {
      r.splice(r.length + 1, 0, { id: o, name: u[0], data: u[1] });
    }), r;
  },
  KeyArrayToObject: function(n) {
    var n = g.f.PS(n), r = {};
    return n.forEach(function(t, u) {
      r[t.name] = t.data;
    }), r;
  },
  ArrayToKeyArray: function(n) {
    var n = g.f.PS(n), r = [];
    return n.forEach(function(t, u) {
      r.splice(r.length + 1, 0, { id: u, name: u, data: t });
    }), r;
  },
  KeyArrayToArray: function(n) {
    var n = g.f.PS(n), r = [];
    return n.forEach(function(t, u) {
      r[u] = t.data;
    }), r;
  },
  generateUID: function(e = 16) {
    for (var n = globalThis.randomBytes(e), r = "id", t = 0; t < e; ++t)
      r += n[t].toString(16);
    return r;
  },
  dup: function(e, n) {
    var r = g.f.PS(e[n]);
    r.hasOwnProperty("name") && (r.name = r.name + "_dup"), e.splice(n + 1, 0, r);
  },
  RandomId: function() {
    return "id-" + Date.now();
  },
  ArrayMove: function(e, n, r) {
    if (r >= e.length)
      for (var t = r - e.length + 1; t--; )
        e.push(void 0);
    return e.splice(r, 0, e.splice(n, 1)[0]), e;
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
  },
  GetFile: function(e, n = !1) {
    var r = !1, t = new XMLHttpRequest();
    return t.withCredentials = !0, t.onreadystatechange = function() {
      this.readyState == 4 && this.status == 200 && (r = this.responseText);
    }, t.open("GET", e, n), t.send(), r;
  },
  GetLocalSpace: function() {
    var e = "";
    for (var n in window.localStorage)
      window.localStorage.hasOwnProperty(n) && (e += window.localStorage[n]);
    return e ? 3 + e.length * 16 / (8 * 1024) + " KB" : "Empty (0 KB)";
  },
  PageRefresh: async function() {
    console.clear(), console.log(`

Refreshing Page

`), g.App && (await g.App_Wrapper.unmount(), $("#app-div").removeAttr("data-v-app"), g.f.CreatePage());
  },
  PageChangeTo: async function(e) {
    console.clear(), console.log("Changing Page To ", e), g.App && (await g.App_Wrapper.unmount(), $("#app-div").removeAttr("data-v-app")), g.f.GetPageNames().find(function(r) {
      return r.name == e;
    }) ? g.f.CreatePage(e) : g.f.CreatePage("404");
  },
  GetPageNames: function() {
    return JSON.parse(localStorage.getItem("Pages"));
  },
  GetCurrentPageName: function() {
    const e = location.search;
    if (e == "")
      return "Home";
    const n = new URLSearchParams(e).get("page");
    return n && g.f.GetPageNames().find(function(t) {
      return t.name == n;
    }) ? n : "404";
  },
  GetPageData: function(e) {
    return g.f.GetPageNames().find(function(n) {
      return n.name == e;
    }).data;
  },
  AppDelete: async function(e = !0, n = !0) {
    console.log("deleting frame ..."), e ? localStorage.clear() : localStorage.removeItem("Frame_VP"), e || localStorage.removeItem("User"), n && location.reload();
  },
  addScripts: function() {
    var e = [
      "JS_CoreJS",
      "JS_JQ",
      "JS_VueDev",
      "JS_Dexie",
      "JS_RandomBytes",
      "JS_Serialize"
    ];
    e.forEach((n) => {
      let r = document.createElement("script");
      r.setAttribute("type", "text/javascript"), r.text = localStorage.getItem(n), r.setAttribute("class", "remove-me"), r.setAttribute("async", !1), r.class = "remove-me", document.body.appendChild(r), r.addEventListener("load", () => {
      }), r.addEventListener("error", (t) => {
        console.log("Error on loading file", t);
      });
    });
  },
  IsInstalled: function() {
    return !!localStorage.getItem("Frame_VP");
  },
  IsUpgradable: function() {
    var e = !1;
    return localStorage.getItem("Frame_VP") ? e = JSON.parse(localStorage.getItem("Frame_VP")).Version !== Frame.Version : e = !1, e;
  },
  Install: async function() {
    function e(r, t) {
      localStorage.setItem(r, g.f.GetFile(g.TargetURL + t));
    }
    [
      ["JS_CoreJS", "/Lib/core-js-bundle@3.29.1/minified.min.js"],
      ["JS_VueDev", "/Lib/vue/vue.global.min.js"],
      ["JS_JQ", "/Lib/jq/jquery.js"],
      ["JS_Dexie", "/Lib/dexie/dexie.min.js"],
      ["JS_RandomBytes", "/Lib/my-random-bytes.js"],
      ["JS_Serialize", "/Lib/my-serialize.js"]
    ].forEach((r) => {
      e(r[0], r[1]);
    }), await install(), localStorage.setItem("Frame_VP", JSON.stringify(Frame)), localStorage.setItem("User", JSON.stringify(!1)), console.log("installed finished.");
  },
  StartCommon: async function() {
    g.f.addScripts(), g.db = await new Dexie("Sir"), await g.db.version(1).stores({
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
    }), g.d = { Libs: [] }, g.r = Vue.reactive({
      IsLive: !0,
      IsEditor: !1,
      IsConnected: !1,
      IsReConnected: !1,
      User: !1
    });
  },
  Start: async function() {
    await g.f.StartCommon(), $("body").append('<div id="app-div"></div>'), await g.f.CreatePage(), $(".remove-me").remove();
  },
  AdminStart: async function(e) {
    console.log("VApp", e), await g.f.StartCommon(), await g.f.CreateAdminPage(e), $(".remove-me").remove();
  },
  CreatePageCommon: async function(e) {
    if (e.VApp.hasOwnProperty("components"))
      for (const n in e.VApp.components)
        typeof e.VApp.components[n] == "string" && (e.VApp.components[n] = g.f.GetComp(e.VApp.components[n]));
    e.hasOwnProperty("Libs") && e.Libs.length && await g.f.AddLibs(e.Libs), g.App_Wrapper = g.Vue.createApp(e.VApp), e.hasOwnProperty("Comps") && (e.Comps.includes("Quasar") && g.App_Wrapper.use(g.Quasar), e.Comps.includes("v-select") && g.App_Wrapper.component("v-select", window["vue-select"]), e.Comps.includes("draggable") && g.App_Wrapper.component("draggable", g.vuedraggable), e.Comps.includes("i-frame") && g.App_Wrapper.component("i-frame", g.f.GetComp("i-frame")), e.Comps.includes("monaco-editor") && g.App_Wrapper.component("monaco-editor", g.f.GetComp("monaco-editor")), e.Comps.includes("toggle-content") && g.App_Wrapper.component("toggle-content", g.f.GetComp("toggle-content")), e.Comps.includes("j-edit") && g.App_Wrapper.component("j-edit", g.f.GetComp("j-edit")), e.Comps.includes("array-edit") && g.App_Wrapper.component("array-edit", g.f.GetComp("array-edit")), g.App_Wrapper.component("dom-parser", g.f.GetComp("dom-parser"))), e.hasOwnProperty("Directive") && e.Directive.includes("resize") && g.App_Wrapper.directive("resize", {
      bind: function(n, { value: r = {} }) {
        n.addEventListener("load", () => iframeResize(r, n));
      },
      unbind: function(n) {
        n.iFrameResizer.removeListeners();
      }
    }), g.App = g.App_Wrapper.mount("#app-div"), $("#app-div").css("display", "block");
  },
  CreatePage: async function(e = g.f.GetCurrentPageName()) {
    g.ev("var Page = " + g.f.GetPageData(e)), console.log(Page), Page.hasOwnProperty("Title") && (document.title = Page.Title), await g.f.CreatePageCommon(Page);
  },
  CreateAdminPage: async function(e, n = g.f.GetCurrentPageName()) {
    e.template = $("#main-html").text(), g.ev("var Page =" + g.f.GetPageData(n)), console.log(`
PageName : `, n, Page, `

`), Page.VApp = e, await g.f.CreatePageCommon(Page);
  },
  GetLib: async function(e, n) {
    var t = (await g.db.Libs.toArray()).find(function(o) {
      return o.name == e;
    });
    if (t)
      return t.data;
    const u = g.f.GetFile(n);
    return await g.db.Libs.add({ name: e, data: u }), u;
  },
  AddLibs: async function(e) {
    for (const r of e)
      switch (r) {
        case "material-icons":
          g.d.Libs.find((t) => t == "material-icons") || ($("head").append(`<link rel="stylesheet" data-dyn-name="material-icons" href="${T1}/Lib/material-icons/iconfont/material-icons.css">`), g.d.Libs.push("material-icons"));
          break;
        case "roboto":
          var n = g.d.Libs.find((t) => t == "roboto");
          n || (T2 ? $("head").append(`<link rel="stylesheet" data-dyn-name="roboto" href="${T1}/CSS/roboto-local.css">`) : $("head").append(`<link rel="stylesheet" data-dyn-name="roboto" href="${T1}/CSS/roboto.css">`), g.d.Libs.push("roboto"));
          break;
        case "vue-select":
          g.d.Libs.find((t) => t == "vue-select") || ($("head").append(`
                        <style data-dyn-name="vue-select-css"> 
                            ${await g.f.GetLib("vue-select-css", `${TargetURL_1}/Lib/vue-select/vue-select.css`)} 
                        </style>`), $("body").append(`
                        <script data-dyn-name="vue-select-js" class="remove-me" async="false">
                            ${await g.f.GetLib("vue-select-js", `${TargetURL_1}/Lib/vue-select/vue-select.umd.js`)}
                        <\/script>`), g.d.Libs.push("vue-select"));
          break;
        case "rx-js":
          g.d.Libs.find((t) => t == "rx-js") || ($("body").append(`
                        <script data-dyn-name="rx-js" class="remove-me" async="false">
                            ${await g.f.GetLib("rx-js", `${TargetURL_1}/Lib/rxjs.umd.min.js`)}
                        <\/script>`), g.d.Libs.push("rx-js"));
          break;
        case "vue-use":
          g.d.Libs.find((t) => t == "vue-use") || ($("body").append(`
                            <script data-dyn-name="vueuse-shared" class="remove-me" async="false">
                                ${await g.f.GetLib("vueuse-shared", `${TargetURL_1}/Lib/@vueuse/shared@9.13.0/index.iife.min.js`)}
                            <\/script>
                            <script data-dyn-name="vueuse-core" class="remove-me" async="false">
                                ${await g.f.GetLib("vueuse-core", `${TargetURL_1}/Lib/@vueuse/core@9.13.0/index.iife.min.js`)}
                            <\/script>
                            <script data-dyn-name="vueuse-rx-js" class="remove-me" async="false">
                                ${await g.f.GetLib("rx-js", `${TargetURL_1}/Lib/@vueuse/rxjs/index.iife.min.js`)}
                            <\/script>`), g.d.Libs.push("vue-use"));
          break;
        case "monaco-editor":
          g.d.Libs.find((t) => t == "monaco-editor") || ($("head").append(`<link rel="stylesheet" data-name="vs/editor/editor.main" href="${T1}/Lib/monaco-editor/min/vs/editor/editor.main.css">`), $("body").append(`<script class="remove-me" async="false"> const require = { paths: { vs: '${T1}/Lib/monaco-editor/min/vs' } }; <\/script>
                            <script class="remove-me" async="false" src="${T1}/Lib/monaco-editor/min/vs/loader.js"><\/script>
                            <script class="remove-me" async="false" src="${T1}/Lib/monaco-editor/min/vs/editor/editor.main.nls.js"><\/script>
                            <script class="remove-me" async="false" src="${T1}/Lib/monaco-editor/min/vs/editor/editor.main.js"><\/script>`), g.d.Libs.push("monaco-editor"));
          break;
        case "socket-io":
          g.d.Libs.find((t) => t == "socket-io") || ($("body").append(`<script data-dyn-name="socket.io" class="remove-me" async="false">
                            ${await g.f.GetLib("socket-io", `${TargetURL_1}/Lib/socket-io-client.js`)}
                        <\/script>`), g.d.Libs.push("socket-io"));
          break;
        case "jq-ui":
          g.d.Libs.find((t) => t == "jq-ui") || ($("head").append(`<link rel="stylesheet" href="${T1}/Lib/jq/jquery-ui.min.css">`), $("body").append(`<script class="remove-me" async="false"  src="${T1}/Lib/jq/jquery-ui.min.js" ><\/script>
                        <script data-dyn-name="touch-jq-ui" class="remove-me" async="false">
                            ${await g.f.GetLib("touch-jq-ui", `${TargetURL_1}/Lib/jq/touch.js`)}
                        <\/script>`), g.d.Libs.push("jq-ui"));
          break;
        case "vue-quasar":
          g.d.Libs.find((t) => t == "vue-quasar") || ($("head").append(`
                        <style data-dyn-name="vue-quasar-css"> 
                            ${await g.f.GetLib("vue-quasar-css", `${TargetURL_1}/Lib/quasar/quasar.css`)} 
                        </style>`), $("body").append(`
                        <script data-dyn-name="vue-quasar-js" class="remove-me" async="false">
                            ${await g.f.GetLib("vue-quasar-js", `${TargetURL_1}/Lib/quasar/quasar.js`)} 
                        <\/script>`), g.d.Libs.push("vue-quasar"));
          break;
        case "vue-iframe":
          g.d.Libs.find((t) => t == "vue-iframe") || ($("body").append(`
                        <script data-dyn-name="vue-iframe-host" class="remove-me">
                            ${await g.f.GetLib("vue-iframe-host", `${TargetURL_1}/Lib/iframe-resize/iframe-host.js`)}
                        <\/script>
                        <script data-dyn-name="vue-iframe-client" class="remove-me" async="false">
                            ${await g.f.GetLib("vue-iframe-client", `${TargetURL_1}/Lib/iframe-resize/iframe-client.js`)}
                        <\/script>`), g.d.Libs.push("vue-iframe"));
          break;
        case "vue-shortkey":
          g.d.Libs.find((t) => t == "vue-shortkey") || ($("body").append(`
                        <script data-dyn-name="vue-shortkey" class="remove-me" async="false">
                            ${await g.f.GetLib("vue-shortkey", `${TargetURL_1}/Lib/vue3-shortkey.min.js`)}
                        <\/script>`), g.d.Libs.push("vue-shortkey"));
          break;
        case "vue-sortable":
          g.d.Libs.find((t) => t == "vue-sortable") || ($("body").append(`<script data-dyn-name="vue-sortable" class="remove-me" async="false">
                            ${await g.f.GetLib("vue-sortable", `${TargetURL_1}/Lib/sortablejs/Sortable.min.js`)}
                        <\/script>`), g.d.Libs.push("vue-sortable"));
          break;
        case "vue-draggable":
          g.d.Libs.find((t) => t == "vue-draggable") || ($("body").append(`<script class="remove-me" async="false">
                            ${await g.f.GetLib("vue-draggable", `${TargetURL_1}/Lib/vuedraggable/vuedraggable.umd.min.js`)}
                        <\/script>`), g.d.Libs.push("vue-draggable"));
          break;
      }
  },
  GetComp: function(CName) {
    var a = g.f.P(g.localStorage.getItem("Components")).filter(function(n) {
      return n.name == CName;
    });
    if (a.length) {
      var VApp = g.f.P(a[0].data).VApp;
      if (VApp.hasOwnProperty("props"))
        for (const property in VApp.props)
          VApp.props[property].hasOwnProperty("type2") && (eval(`VApp.props[property].type = ${VApp.props[property].type2}`), delete VApp.props[property].type2);
      if (VApp.hasOwnProperty("components"))
        for (const e in VApp.components)
          typeof VApp.components[e] == "string" && (VApp.components[e] = g.f.GetComp(VApp.components[e]));
      return VApp;
    } else
      return console.log(CName + " - not found"), !1;
  }
};
async function StartCommon() {
  g.f.IsInstalled() || await g.f.Install(), g.f.IsUpgradable() && await g.f.AppDelete();
}
globalThis.AppStart = async function() {
  await StartCommon(), await g.f.Start();
};
globalThis.AdminStart = async function(e) {
  await StartCommon(), await g.f.AdminStart(e);
};
