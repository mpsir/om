import{resolveComponent as e,openBlock as t,createBlock as o,createVNode as a,withCtx as l,toDisplayString as n,createTextVNode as s,withDirectives as d,vModelSelect as r,createCommentVNode as u,Fragment as i,renderList as p,resolveDynamicComponent as m,createStaticVNode as c,renderSlot as h}from"vue";g.createApp=async function(e={App:{},VueShortkey:!0,Quasar:!0,vdrag:!0,DraggableResizable:!0,draggable:!0,Ast:!0,MonacoEditor:!0,ToggleContent:!0}){var t=Vue.createApp(e.App);return e.VueShortkey&&t.use(window.VueShortkey),e.Quasar&&t.use(Quasar),e.vdrag&&t.use(vdrag,{}),e.DraggableResizable&&t.use(Vue3DraggableResizable.default),e.draggable&&t.component("draggable",vuedraggable),e.MonacoEditor&&t.component("monaco-editor",g.comps.MonacoEditor),e.ToggleContent&&t.component("toggle-content",g.comps.ToggleContent),e.Ast&&(t.component("ast-editor",g.comps.ast.AstEditor),t.component("ast-string",g.comps.ast.AstString)),t.mount("#app-div")};const V={setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({Value:g.r.funs})},y={style:{border:"1px solid darkslategray",padding:"16px",margin:"8px","border-radius":"2px"}},v=a("h6",null,"ast editor demo",-1),_={class:"q-my-sm"},f=a("button",{class:"toggle-handle q-pa-sm"},"Value",-1),b={class:"q-pa-sm"};V.render=function(s,d,r,u,i,p){const m=e("toggle-content"),c=e("ast-editor");return t(),o("div",y,[v,a("div",_,[a(m,{show_inner_p:!1},{control:l((()=>[f])),default:l((()=>[a("div",b,n(i.Value),1)])),_:1}),a(c,{"onUpdate:modelValue":d[1]||(d[1]=e=>i.Value=e),modelValue:i.Value},null,8,["modelValue"])])])};const q={setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{g:Vue.computed((()=>g)),val:Vue.ref("var a = 55")}}},w={style:{border:"1px solid darkslategray",padding:"16px",margin:"8px"}},x=a("h6",null,"monaco_editor demo",-1),O={class:"q-my-sm"},k={class:"q-my-lg q-pa-sm",style:{border:"1px solid grey"}},S=s(" with v-model "),A=a("pre",null,n('\n<monaco-editor v-model="val" :IsReadOnly="false"\n        :language="\'javascript\'" :format_on_start="true" />\n'),-1),C={class:"q-my-lg q-pa-sm",style:{border:"1px solid grey"}},R=s(" with manual update "),j=a("pre",null,n('\n<monaco-editor :modelValue="val" @update="val= $event"\n        :IsReadOnly="false" :language="\'javascript\'"\n        :format_on_start="true" />\n'),-1),I={class:"q-my-lg q-pa-sm",style:{border:"1px solid grey"}},U=s(" hide update "),N=a("pre",null,n('\n<monaco-editor @update="val= $event"\n        :IsReadOnly="true"\n        :language="\'javascript\'"\n        :modelValue="val"\n        :format_on_start="true" />\n'),-1);q.render=function(l,s,d,r,u,i){const p=e("monaco-editor");return t(),o("div",w,[x,a("div",O,n(l.val),1),a("div",k,[S,a(p,{modelValue:l.val,"onUpdate:modelValue":s[1]||(s[1]=e=>l.val=e),IsReadOnly:!1,language:"javascript",format_on_start:!0},null,8,["modelValue"]),A]),a("div",C,[R,a(p,{modelValue:l.val,onUpdate:s[2]||(s[2]=e=>l.val=e),IsReadOnly:!1,language:"javascript",format_on_start:!0},null,8,["modelValue"]),j]),a("div",I,[U,a(p,{onUpdate:s[3]||(s[3]=e=>l.val=e),IsReadOnly:!0,language:"javascript",modelValue:l.val,format_on_start:!0},null,8,["modelValue"]),N])])};const M={setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({})},J={style:{border:"1px solid darkslategray",padding:"16px",margin:"8px","border-radius":"2px"}},D=a("h6",null,"toggle-content demo",-1),E={class:"q-my-sm q-pa-sm",style:{border:"1px solid grey"}},T=a("p",null,"inner data is opened by default.",-1),z=a("button",{class:"toggle-handle q-pa-sm"},"click",-1),B=a("div",null," Inner data ",-1),F=a("pre",null,n('\n<toggle-content>\n    <template #control>\n      <button class="toggle-handle">click</button>\n    </template>\n    <div> Inner data </div>\n</toggle-content>\n'),-1),P={class:"q-my-sm q-pa-sm",style:{border:"1px solid grey"}},Q=a("button",{class:"toggle-handle q-pa-sm"},"click",-1),L=a("div",null," Inner data ",-1),H=a("pre",null,n('\n<toggle-content :show_inner_p="false">\n    <template #control>\n      <button class="toggle-handle">click</button>\n    </template>\n    <div> Inner data </div>\n</toggle-content>\n'),-1);M.render=function(n,s,d,r,u,i){const p=e("toggle-content",!0);return t(),o("div",J,[D,a("div",E,[T,a(p,null,{control:l((()=>[z])),default:l((()=>[B])),_:1}),F]),a("div",P,[a(p,{show_inner_p:!1},{control:l((()=>[Q])),default:l((()=>[L])),_:1}),H])])};const G={components:{"ast-editor-demo":V,"monaco-editor-demo":q,"toggle-content-demo":M},setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{g:Vue.computed((()=>g)),current_demo:Vue.ref("ast-editor-demo")}}},K={class:"q-pt-sm"},W=a("option",{value:"ast-editor-demo"},"ast-editor",-1),X=a("option",{value:"monaco-editor-demo"},"monaco-editor",-1),Y=a("option",{value:"toggle-content-demo"},"toggle-content-demo",-1);G.render=function(n,s,i,p,m,c){const g=e("ast-editor-demo"),h=e("monaco-editor-demo"),V=e("toggle-content-demo"),y=e("q-page-container"),v=e("q-layout");return t(),o(v,{view:"hHh lpR fFf"},{default:l((()=>[a(y,null,{default:l((()=>[a("div",K,[d(a("select",{"onUpdate:modelValue":s[1]||(s[1]=e=>n.current_demo=e),class:"q-ma-sm q-pa-sm"},[W,X,Y],512),[[r,n.current_demo]]),"ast-editor-demo"==n.current_demo?(t(),o(g,{key:0})):u("",!0),"monaco-editor-demo"==n.current_demo?(t(),o(h,{key:1})):u("",!0),"toggle-content-demo"==n.current_demo?(t(),o(V,{key:2})):u("",!0)])])),_:1})])),_:1})};const Z={setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{g:Vue.computed((()=>g)),new_type:Vue.ref("ast-string")}},data:()=>({Value:null}),props:{modelValue:{required:!0,type:Object}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{create_new(){this.Value.body.splice(0,0,{type:this.new_type}),this.update_parent()},update_modelValue(){var e=JSON.parse(JSON.stringify(this.modelValue));this.Value=e},update_parent(e=this.Value){this.$emit("update:modelValue",this.Value)}}},ee=a("h6",{style:{"margin-bottom":"8px",color:"darkgray"}},"Script",-1),te={class:"q-mb-md"},oe=c('<option value="ast-scope">Scope</option><option value="ast-null">Null</option><option value="ast-undefined">Undefined</option><option value="ast-string">String</option><option value="ast-number">Number</option><option value="ast-boolean">Boolean</option><option value="ast-object">Object</option><option value="ast-function">Function</option><option value="ast-class">Class</option><option value="ast-promise">Promise</option>',10),ae={key:1};Z.render=function(e,l,n,s,u,c){return t(),o(i,null,[ee,a("div",te,[a("button",{onClick:l[1]||(l[1]=e=>{c.create_new()}),class:"q-pa-sm"},"+"),d(a("select",{"onUpdate:modelValue":l[2]||(l[2]=t=>e.new_type=t),class:"q-mx-sm q-pa-sm"},[oe],512),[[r,e.new_type]])]),u.Value.body.length?(t(!0),o(i,{key:0},p(u.Value.body,((e,a)=>(t(),o("div",null,[(t(),o(m(e.type),{"onUpdate:modelValue":e=>{u.Value.body[a]=e,c.update_parent()},modelValue:u.Value.body[a]},null,8,["onUpdate:modelValue","modelValue"]))])))),256)):(t(),o("div",ae," 0 items. "))],64)};const le={setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({Value:null}),props:{modelValue:{required:!0,type:Object}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{update_modelValue(){var e=JSON.parse(JSON.stringify(this.modelValue));this.Value=e},update_parent(){this.$emit("update:modelValue",this.Value)}}};le.render=function(e,a,l,n,s,d){return t(),o("div",null," ast module inside ")};const ne={components:{"ast-script":Z,"ast-module":le},setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({Value:null}),props:{modelValue:{required:!0,type:Object}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{update_modelValue(){var e=JSON.parse(JSON.stringify(this.modelValue));e.hasOwnProperty("type")||(e.type="Script"),e.hasOwnProperty("body")||(e.body=[]),this.Value=e},update_parent(e=this.Value){this.$emit("update:modelValue",e)}}};ne.render=function(a,l,n,s,d,r){const i=e("ast-script"),p=e("ast-module");return t(),o("div",null,["Script"==d.Value.type?(t(),o(i,{key:0,"onUpdate:modelValue":l[1]||(l[1]=e=>r.update_parent(e)),modelValue:d.Value},null,8,["modelValue"])):u("",!0),"Module"==d.Value.type?(t(),o(p,{key:1,"onUpdate:modelValue":l[2]||(l[2]=e=>r.update_parent(e)),modelValue:d.Value},null,8,["modelValue"])):u("",!0)])};const se={setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{g:Vue.computed((()=>g))}},data:()=>({Value:null}),props:{modelValue:{type:Object,required:!0,default:""}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{update_modelValue(){this.Value=g.f.pstring(this.modelValue),this.Value.hasOwnProperty("value")||(this.Value.value="some string",this.update_parent())},update_parent(){this.$emit("update:modelValue",this.Value)}}},de={style:{},class:"cursor-pointer"},re={class:"toggle-handle q-my-sm"};se.render=function(s,d,r,u,i,p){const m=e("q-input"),c=e("toggle-content");return t(),o("div",de,[a(c,{show_inner_p:!1},{control:l((()=>[a("div",re,n(i.Value.value),1)])),default:l((()=>[a("div",null,[a(m,{style:{width:"100%"},color:"grey-3","label-color":"orange",outlined:"",modelValue:i.Value.value,"onUpdate:modelValue":d[1]||(d[1]=e=>i.Value.value=e)},null,8,["modelValue"])])])),_:1})])};const ue={data:()=>({Value:null,input_type:"string"}),setup:function(e,{attrs:t,slots:o,emit:a,expose:l}){return{editor:{},g:Vue.computed((()=>g))}},props:{modelValue:{type:String,required:!0},language:{type:String,required:!1,default:"json"},format_on_start:{type:Boolean,required:!1,default:!0},IsReadOnly:{type:Boolean,required:!1,default:!0}},emits:["update:modelValue","update"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},mounted(){var e=this;this.editor=g.monaco.editor.create(this.$refs.m_editor,{value:e.Value,overviewRulerLanes:0,hideCursorInOverviewRuler:!0,language:e.language,readOnly:!1,minimap:{enabled:!1},showFoldingControls:"always",scrollbar:{vertical:"hidden",horizontal:"visible"},overviewRulerBorder:!1}),setTimeout((()=>{this.update_editor()}),100),e.format_on_start&&(setTimeout((()=>{this.editor.getAction("editor.action.formatDocument").run()}),500),this.Value=this.editor.getValue()),this.editor.getModel().onDidChangeContent((t=>{e.update_editor(),e.Value=e.editor.getValue(),e.$emit("update:modelValue",e.Value)}));const t=()=>{this.editor.getContribution("editor.contrib.folding").getFoldingModel().then((t=>{t.onDidChange((()=>{e.Value=e.editor.getValue()}))}))};t(),this.editor.onDidChangeModel(t)},methods:{update_editor:function(){const e=19*this.editor.getModel().getLineCount();$(this.$refs.m_editor).css("height",e+"px"),this.editor.layout(),this.Value=this.editor.getValue()},update_modelValue(){this.Value=this.modelValue;try{this.editor.getModel().setValue(this.modelValue),this.format_on_start&&this.editor.getAction("editor.action.formatDocument").run()}catch(e){}},update_parent(){this.$emit("update",this.Value)}}},ie={key:0},pe={style:{border:"1px dashed darkgrey"}},me={ref:"m_editor",style:{"min-height":"28px"}};ue.render=function(l,n,s,d,r,p){const m=e("q-btn");return t(),o(i,null,[s.IsReadOnly?u("",!0):(t(),o("div",ie,[a(m,{onClick:n[1]||(n[1]=e=>p.update_parent()),color:"white","text-color":"black",label:"Update","no-caps":""})])),a("div",pe,[a("div",me,null,512)])],64)};const ce={props:{show_inner_p:{type:Boolean,default:!0,required:!1}},data:()=>({show_inner:!0}),created(){this.show_inner=this.show_inner_p},mounted(){var e=this,t=this.$refs.controls;if((o=$(t).find(".toggle-handle"))[0]){var o=o[0];$(o).click((function(){e.show_inner=!e.show_inner}))}else console.log("no handle found",'\nadd "toggle-handle" class to any ui element.')}},ge={ref:"controls"};ce.render=function(e,l,n,s,d,r){return t(),o(i,null,[a("span",ge,[h(e.$slots,"control")],512),d.show_inner?h(e.$slots,"default",{key:0}):u("",!0)],64)},g.comps=g.comps||{},g.comps.MonacoEditor=ue,g.comps.ast=g.comps.ast||{},g.comps.ast.AstEditor=ne,g.comps.ast.AstString=se,g.comps.ToggleContent=ce,g.d={},g.r=Vue.reactive({funs:{type:"Script",body:[{type:"ast-string"}]}}),g.f={pstring:e=>JSON.parse(JSON.stringify(e)),string:e=>JSON.stringify(e),parse:e=>JSON.parse(e),is_local_host:function(){return"8080"==location.port||"3000"==location.port},start:async function(){var e={};g.f.is_local_host()?(console.log("this is local host"),e=io()):("mpsir.github.io"!=location.host&&(e=g.io("http://super1mpsir-57484.portmap.host:57484/")),console.log("this is not local host")),e.on("connect",(()=>{alert("connected")})),console.log("g.f.start","method called"),g.VApp=g.createApp({App:G,VueShortkey:!0,Quasar:!0,vdrag:!0,DraggableResizable:!0,draggable:!0,Ast:!0,MonacoEditor:!0,ToggleContent:!0})}};
