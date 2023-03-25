import{resolveComponent as e,openBlock as t,createBlock as a,createVNode as o,withCtx as l,toDisplayString as n,createTextVNode as d,withDirectives as s,vModelSelect as r,createCommentVNode as u,Fragment as i,renderList as p,resolveDynamicComponent as m,createStaticVNode as c,renderSlot as h}from"vue";g.createApp=async function(e={App:{},VueShortkey:!0,Quasar:!0,vdrag:!0,DraggableResizable:!0,draggable:!0,Ast:!0,MonacoEditor:!0,ToggleContent:!0}){var t=Vue.createApp(e.App);return e.VueShortkey&&t.use(window.VueShortkey),e.Quasar&&t.use(Quasar),e.vdrag&&t.use(vdrag,{}),e.DraggableResizable&&t.use(Vue3DraggableResizable.default),e.draggable&&t.component("draggable",vuedraggable),e.MonacoEditor&&t.component("monaco-editor",g.comps.MonacoEditor),e.ToggleContent&&t.component("toggle-content",g.comps.ToggleContent),e.Ast&&(t.component("ast-editor",g.comps.ast.AstEditor),t.component("ast-string",g.comps.ast.AstString)),t.mount("#app-div")},g.AddDB=async function(){g.db=new g.Dexie("ShreeRam"),g.db.version(1).stores({pages:"++id, name, data",comps:"++id, name, data",opts:"++id, name, data",html_template:"++id, name, data",js_template:"++id, name, data",js:"++id, name, data",css:"++id, name, data",images:"++id, name, data",blobs:"++id, name, data"}),g.Dexie.exists("ShreeRam").then((function(e){e||g.db.pages.bulkAdd([{name:"home",data:""},{name:"admin",data:""}])}))},g.DeleteDb=async function(e=!1){g.db.delete(),e&&location.reload()};const V={setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({Value:g.r.funs})},y={style:{border:"1px solid darkslategray",padding:"16px",margin:"8px","border-radius":"2px"}},v=o("h6",null,"ast editor demo",-1),_={class:"q-my-sm"},f=o("button",{class:"toggle-handle q-pa-sm"},"Value",-1),b={class:"q-pa-sm"};V.render=function(d,s,r,u,i,p){const m=e("toggle-content"),c=e("ast-editor");return t(),a("div",y,[v,o("div",_,[o(m,{show_inner_p:!1},{control:l((()=>[f])),default:l((()=>[o("div",b,n(i.Value),1)])),_:1}),o(c,{"onUpdate:modelValue":s[1]||(s[1]=e=>i.Value=e),modelValue:i.Value},null,8,["modelValue"])])])};const w={setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{g:Vue.computed((()=>g)),val:Vue.ref("var a = 55")}}},q={style:{border:"1px solid darkslategray",padding:"16px",margin:"8px"}},x=o("h6",null,"monaco_editor demo",-1),k={class:"q-my-sm"},O={class:"q-my-lg q-pa-sm",style:{border:"1px solid grey"}},S=d(" with v-model "),A=o("pre",null,n('\n<monaco-editor v-model="val" :IsReadOnly="false"\n        :language="\'javascript\'" :format_on_start="true" />\n'),-1),D={class:"q-my-lg q-pa-sm",style:{border:"1px solid grey"}},R=d(" with manual update "),C=o("pre",null,n('\n<monaco-editor :modelValue="val" @update="val= $event"\n        :IsReadOnly="false" :language="\'javascript\'"\n        :format_on_start="true" />\n'),-1),j={class:"q-my-lg q-pa-sm",style:{border:"1px solid grey"}},I=d(" hide update "),U=o("pre",null,n('\n<monaco-editor @update="val= $event"\n        :IsReadOnly="true"\n        :language="\'javascript\'"\n        :modelValue="val"\n        :format_on_start="true" />\n'),-1);w.render=function(l,d,s,r,u,i){const p=e("monaco-editor");return t(),a("div",q,[x,o("div",k,n(l.val),1),o("div",O,[S,o(p,{modelValue:l.val,"onUpdate:modelValue":d[1]||(d[1]=e=>l.val=e),IsReadOnly:!1,language:"javascript",format_on_start:!0},null,8,["modelValue"]),A]),o("div",D,[R,o(p,{modelValue:l.val,onUpdate:d[2]||(d[2]=e=>l.val=e),IsReadOnly:!1,language:"javascript",format_on_start:!0},null,8,["modelValue"]),C]),o("div",j,[I,o(p,{onUpdate:d[3]||(d[3]=e=>l.val=e),IsReadOnly:!0,language:"javascript",modelValue:l.val,format_on_start:!0},null,8,["modelValue"]),U])])};const N={setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({})},M={style:{border:"1px solid darkslategray",padding:"16px",margin:"8px","border-radius":"2px"}},J=o("h6",null,"toggle-content demo",-1),B={class:"q-my-sm q-pa-sm",style:{border:"1px solid grey"}},E=o("p",null,"inner data is opened by default.",-1),T=o("button",{class:"toggle-handle q-pa-sm"},"click",-1),z=o("div",null," Inner data ",-1),F=o("pre",null,n('\n<toggle-content>\n    <template #control>\n      <button class="toggle-handle">click</button>\n    </template>\n    <div> Inner data </div>\n</toggle-content>\n'),-1),P={class:"q-my-sm q-pa-sm",style:{border:"1px solid grey"}},Q=o("button",{class:"toggle-handle q-pa-sm"},"click",-1),L=o("div",null," Inner data ",-1),H=o("pre",null,n('\n<toggle-content :show_inner_p="false">\n    <template #control>\n      <button class="toggle-handle">click</button>\n    </template>\n    <div> Inner data </div>\n</toggle-content>\n'),-1);N.render=function(n,d,s,r,u,i){const p=e("toggle-content",!0);return t(),a("div",M,[J,o("div",B,[E,o(p,null,{control:l((()=>[T])),default:l((()=>[z])),_:1}),F]),o("div",P,[o(p,{show_inner_p:!1},{control:l((()=>[Q])),default:l((()=>[L])),_:1}),H])])};const G={components:{"ast-editor-demo":V,"monaco-editor-demo":w,"toggle-content-demo":N},setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{g:Vue.computed((()=>g)),current_demo:Vue.ref("ast-editor-demo")}}},K={class:"q-pt-sm"},W=o("button",{onclick:"g.DeleteDb(true)"},"Delete Database",-1),X=o("option",{value:"ast-editor-demo"},"ast-editor",-1),Y=o("option",{value:"monaco-editor-demo"},"monaco-editor",-1),Z=o("option",{value:"toggle-content-demo"},"toggle-content-demo",-1);G.render=function(n,d,i,p,m,c){const g=e("ast-editor-demo"),h=e("monaco-editor-demo"),V=e("toggle-content-demo"),y=e("q-page-container"),v=e("q-layout");return t(),a(v,{view:"hHh lpR fFf"},{default:l((()=>[o(y,null,{default:l((()=>[o("div",K,[W,s(o("select",{"onUpdate:modelValue":d[1]||(d[1]=e=>n.current_demo=e),class:"q-ma-sm q-pa-sm"},[X,Y,Z],512),[[r,n.current_demo]]),"ast-editor-demo"==n.current_demo?(t(),a(g,{key:0})):u("",!0),"monaco-editor-demo"==n.current_demo?(t(),a(h,{key:1})):u("",!0),"toggle-content-demo"==n.current_demo?(t(),a(V,{key:2})):u("",!0)])])),_:1})])),_:1})};const ee={setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{g:Vue.computed((()=>g)),new_type:Vue.ref("ast-string")}},data:()=>({Value:null}),props:{modelValue:{required:!0,type:Object}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{create_new(){this.Value.body.splice(0,0,{type:this.new_type}),this.update_parent()},update_modelValue(){var e=JSON.parse(JSON.stringify(this.modelValue));this.Value=e},update_parent(e=this.Value){this.$emit("update:modelValue",this.Value)}}},te=o("h6",{style:{"margin-bottom":"8px",color:"darkgray"}},"Script",-1),ae={class:"q-mb-md"},oe=c('<option value="ast-scope">Scope</option><option value="ast-null">Null</option><option value="ast-undefined">Undefined</option><option value="ast-string">String</option><option value="ast-number">Number</option><option value="ast-boolean">Boolean</option><option value="ast-object">Object</option><option value="ast-function">Function</option><option value="ast-class">Class</option><option value="ast-promise">Promise</option>',10),le={key:1};ee.render=function(e,l,n,d,u,c){return t(),a(i,null,[te,o("div",ae,[o("button",{onClick:l[1]||(l[1]=e=>{c.create_new()}),class:"q-pa-sm"},"+"),s(o("select",{"onUpdate:modelValue":l[2]||(l[2]=t=>e.new_type=t),class:"q-mx-sm q-pa-sm"},[oe],512),[[r,e.new_type]])]),u.Value.body.length?(t(!0),a(i,{key:0},p(u.Value.body,((e,o)=>(t(),a("div",null,[(t(),a(m(e.type),{"onUpdate:modelValue":e=>{u.Value.body[o]=e,c.update_parent()},modelValue:u.Value.body[o]},null,8,["onUpdate:modelValue","modelValue"]))])))),256)):(t(),a("div",le," 0 items. "))],64)};const ne={setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({Value:null}),props:{modelValue:{required:!0,type:Object}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{update_modelValue(){var e=JSON.parse(JSON.stringify(this.modelValue));this.Value=e},update_parent(){this.$emit("update:modelValue",this.Value)}}};ne.render=function(e,o,l,n,d,s){return t(),a("div",null," ast module inside ")};const de={components:{"ast-script":ee,"ast-module":ne},setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({Value:null}),props:{modelValue:{required:!0,type:Object}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{update_modelValue(){var e=JSON.parse(JSON.stringify(this.modelValue));e.hasOwnProperty("type")||(e.type="Script"),e.hasOwnProperty("body")||(e.body=[]),this.Value=e},update_parent(e=this.Value){this.$emit("update:modelValue",e)}}};de.render=function(o,l,n,d,s,r){const i=e("ast-script"),p=e("ast-module");return t(),a("div",null,["Script"==s.Value.type?(t(),a(i,{key:0,"onUpdate:modelValue":l[1]||(l[1]=e=>r.update_parent(e)),modelValue:s.Value},null,8,["modelValue"])):u("",!0),"Module"==s.Value.type?(t(),a(p,{key:1,"onUpdate:modelValue":l[2]||(l[2]=e=>r.update_parent(e)),modelValue:s.Value},null,8,["modelValue"])):u("",!0)])};const se={setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({Value:null}),props:{modelValue:{type:Object,required:!0,default:""}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{update_modelValue(){this.Value=g.f.pstring(this.modelValue),this.Value.hasOwnProperty("value")||(this.Value.value="some string",this.update_parent())},update_parent(){this.$emit("update:modelValue",this.Value)}}},re={style:{},class:"cursor-pointer"},ue={class:"toggle-handle q-my-sm"};se.render=function(d,s,r,u,i,p){const m=e("q-input"),c=e("toggle-content");return t(),a("div",re,[o(c,{show_inner_p:!1},{control:l((()=>[o("div",ue,n(i.Value.value),1)])),default:l((()=>[o("div",null,[o(m,{style:{width:"100%"},color:"grey-3","label-color":"orange",outlined:"",modelValue:i.Value.value,"onUpdate:modelValue":s[1]||(s[1]=e=>i.Value.value=e)},null,8,["modelValue"])])])),_:1})])};const ie={data:()=>({Value:null,input_type:"string"}),setup:function(e,{attrs:t,slots:a,emit:o,expose:l}){return{editor:{},g:Vue.computed((()=>g))}},props:{modelValue:{type:String,required:!0},language:{type:String,required:!1,default:"json"},format_on_start:{type:Boolean,required:!1,default:!0},IsReadOnly:{type:Boolean,required:!1,default:!0}},emits:["update:modelValue","update"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},mounted(){var e=this;this.editor=g.monaco.editor.create(this.$refs.m_editor,{value:e.Value,overviewRulerLanes:0,hideCursorInOverviewRuler:!0,language:e.language,readOnly:!1,minimap:{enabled:!1},showFoldingControls:"always",scrollbar:{vertical:"hidden",horizontal:"visible"},overviewRulerBorder:!1}),setTimeout((()=>{this.update_editor()}),100),e.format_on_start&&(setTimeout((()=>{this.editor.getAction("editor.action.formatDocument").run()}),500),this.Value=this.editor.getValue()),this.editor.getModel().onDidChangeContent((t=>{e.update_editor(),e.Value=e.editor.getValue(),e.$emit("update:modelValue",e.Value)}));const t=()=>{this.editor.getContribution("editor.contrib.folding").getFoldingModel().then((t=>{t.onDidChange((()=>{e.Value=e.editor.getValue()}))}))};t(),this.editor.onDidChangeModel(t)},methods:{update_editor:function(){const e=19*this.editor.getModel().getLineCount();$(this.$refs.m_editor).css("height",e+"px"),this.editor.layout(),this.Value=this.editor.getValue()},update_modelValue(){this.Value=this.modelValue;try{this.editor.getModel().setValue(this.modelValue),this.format_on_start&&this.editor.getAction("editor.action.formatDocument").run()}catch(e){}},update_parent(){this.$emit("update",this.Value)}}},pe={key:0},me={style:{border:"1px dashed darkgrey"}},ce={ref:"m_editor",style:{"min-height":"28px"}};ie.render=function(l,n,d,s,r,p){const m=e("q-btn");return t(),a(i,null,[d.IsReadOnly?u("",!0):(t(),a("div",pe,[o(m,{onClick:n[1]||(n[1]=e=>p.update_parent()),color:"white","text-color":"black",label:"Update","no-caps":""})])),o("div",me,[o("div",ce,null,512)])],64)};const ge={props:{show_inner_p:{type:Boolean,default:!0,required:!1}},data:()=>({show_inner:!0}),created(){this.show_inner=this.show_inner_p},mounted(){var e=this,t=this.$refs.controls;if((a=$(t).find(".toggle-handle"))[0]){var a=a[0];$(a).click((function(){e.show_inner=!e.show_inner}))}else console.log("no handle found",'\nadd "toggle-handle" class to any ui element.')}},he={ref:"controls"};ge.render=function(e,l,n,d,s,r){return t(),a(i,null,[o("span",he,[h(e.$slots,"control")],512),s.show_inner?h(e.$slots,"default",{key:0}):u("",!0)],64)},g.comps=g.comps||{},g.comps.MonacoEditor=ie,g.comps.ast=g.comps.ast||{},g.comps.ast.AstEditor=de,g.comps.ast.AstString=se,g.comps.ToggleContent=ge,g.d={},g.r=Vue.reactive({funs:{type:"Script",body:[{type:"ast-string"}]}}),g.f={pstring:e=>JSON.parse(JSON.stringify(e)),string:e=>JSON.stringify(e),parse:e=>JSON.parse(e),is_local_host:function(){return"8080"==location.port||"3000"==location.port},add_socket(){var e={},t=!1;g.f.is_local_host()?(e=io("http://localhost:8080/"),t=!0):"mpsir.github.io"!=location.host&&(e=g.io("http://super1mpsir-57484.portmap.host:57484/"),t=!0),t&&e.on("connect",(()=>{}))},start:async function(){g.f.add_socket(),g.AddDB(),g.VApp=g.createApp({App:G,VueShortkey:!0,Quasar:!0,vdrag:!0,DraggableResizable:!0,draggable:!0,Ast:!0,MonacoEditor:!0,ToggleContent:!0})}};
