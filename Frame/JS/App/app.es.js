import{resolveComponent,openBlock,createBlock,Fragment,createVNode,createCommentVNode,renderSlot,withCtx,renderList,createTextVNode,toDisplayString}from"vue";const _sfc_main$7={data:()=>({Value:null,input_type:"string"}),setup:function(e,{attrs:t,slots:o,emit:a,expose:r}){return{editor:{},g:Vue.computed((()=>g))}},props:{modelValue:{type:String,required:!0},update_text:{type:String,required:!1,default:"Update"},lang:{type:String,required:!1,default:"json"},format_on_start:{type:Boolean,required:!1,default:!0},IsReadOnly:{type:Boolean,required:!1,default:!0}},emits:["update:modelValue","update"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},mounted(){var e=this;this.editor=g.monaco.editor.create(this.$refs.m_editor,{value:e.Value,overviewRulerLanes:0,hideCursorInOverviewRuler:!0,language:e.lang,readOnly:!1,minimap:{enabled:!1},showFoldingControls:"always",scrollbar:{vertical:"hidden",horizontal:"visible"},overviewRulerBorder:!1}),setTimeout((()=>{this.update_editor()}),100),e.format_on_start&&(setTimeout((()=>{this.editor.getAction("editor.action.formatDocument").run()}),500),this.Value=this.editor.getValue()),this.editor.getModel().onDidChangeContent((t=>{e.update_editor(),e.Value=e.editor.getValue(),e.$emit("update:modelValue",e.Value)}));const t=()=>{this.editor.getContribution("editor.contrib.folding").getFoldingModel().then((t=>{t.onDidChange((()=>{e.Value=e.editor.getValue()}))}))};t(),this.editor.onDidChangeModel(t)},methods:{update_editor:function(){const e=19*this.editor.getModel().getLineCount();$(this.$refs.m_editor).css("height",e+"px"),this.editor.layout(),this.Value=this.editor.getValue()},update_modelValue(){this.Value=this.modelValue;try{this.editor.getModel().setValue(this.modelValue),this.format_on_start&&this.editor.getAction("editor.action.formatDocument").run()}catch(e){}},update_parent(){this.$emit("update",this.Value)}}},_hoisted_1$7={key:0},_hoisted_2$5={style:{border:"1px dashed darkgrey"}},_hoisted_3$3={ref:"m_editor",style:{"min-height":"28px"}};function _sfc_render$7(e,t,o,a,r,n){const d=resolveComponent("q-btn");return openBlock(),createBlock(Fragment,null,[o.IsReadOnly?createCommentVNode("",!0):(openBlock(),createBlock("div",_hoisted_1$7,[createVNode(d,{onClick:t[1]||(t[1]=e=>n.update_parent()),color:"white","text-color":"black",label:o.update_text,"no-caps":""},null,8,["label"])])),createVNode("div",_hoisted_2$5,[createVNode("div",_hoisted_3$3,null,512)])],64)}_sfc_main$7.render=_sfc_render$7;const _sfc_main$6={props:{show_inner_p:{type:Boolean,default:!0,required:!1}},data:()=>({show_inner:!0}),created(){this.show_inner=this.show_inner_p},mounted(){var e=this,t=this.$refs.controls;if((o=$(t).find(".toggle-handle"))[0]){var o=o[0];$(o).click((function(){e.show_inner=!e.show_inner}))}else console.log("no handle found",'\nadd "toggle-handle" class to any ui element.')}},_hoisted_1$6={ref:"controls"};function _sfc_render$6(e,t,o,a,r,n){return openBlock(),createBlock(Fragment,null,[createVNode("span",_hoisted_1$6,[renderSlot(e.$slots,"control")],512),r.show_inner?renderSlot(e.$slots,"default",{key:0}):createCommentVNode("",!0)],64)}_sfc_main$6.render=_sfc_render$6;const _sfc_main$5={data:()=>({Value:null}),components:{},setup:function(e,{attrs:t,slots:o,emit:a,expose:r}){return{g:Vue.computed((()=>g))}},props:{modelValue:{type:[Object,String],required:!0,default:""}},emits:["update:modelValue"],created(){this.update_modelValue()},watch:{modelValue:{handler(e,t){this.update_modelValue()},deep:!0}},methods:{update_modelValue(){this.Value=this.modelValue},update_template(){this.$emit("update:modelValue",this.Value)}}},_hoisted_1$5=createVNode("button",{class:"toggle-handle q-mt-sm q-pa-sm"},"Template",-1),_hoisted_2$4={class:"q-my-sm"},_hoisted_3$2={key:0,class:"q-pa-sm"},_hoisted_4$1={key:0},_hoisted_5$1={class:"q-my-sm"},_hoisted_6$1={key:1},_hoisted_7$1=createTextVNode(" edit object - template ");function _sfc_render$5(e,t,o,a,r,n){const d=resolveComponent("monaco-editor"),s=resolveComponent("toggle-content");return openBlock(),createBlock(s,{show_inner_p:!1},{control:withCtx((()=>[_hoisted_1$5])),default:withCtx((()=>[createVNode("div",_hoisted_2$4,[Array.isArray(r.Value)?(openBlock(),createBlock("button",_hoisted_3$2," + String ")):createCommentVNode("",!0),Array.isArray(r.Value)?(openBlock(),createBlock("button",{key:1,onClick:t[1]||(t[1]=e=>{r.Value.splice(r.Value.length+1,0,{}),n.update_template()}),class:"q-pa-sm"}," + Object ")):createCommentVNode("",!0)]),"string"==typeof r.Value?(openBlock(),createBlock("div",_hoisted_4$1,[createVNode(d,{update_text:"update template",IsReadOnly:!1,onUpdate:t[2]||(t[2]=e=>{r.Value=e,n.update_template()}),lang:"html",modelValue:r.Value},null,8,["modelValue"])])):createCommentVNode("",!0),"object"==typeof r.Value?(openBlock(),createBlock(Fragment,{key:1},[Array.isArray(r.Value)?(openBlock(!0),createBlock(Fragment,{key:0},renderList(r.Value,((e,t)=>(openBlock(),createBlock("div",_hoisted_5$1,["string"==typeof e?(openBlock(),createBlock(d,{key:0,update_text:"update",IsReadOnly:!1,onUpdate:e=>{r.Value[t]=e,n.update_template()},lang:"html",modelValue:r.Value[t]},null,8,["onUpdate","modelValue"])):(openBlock(),createBlock("div",_hoisted_6$1," ... "))])))),256)):(openBlock(),createBlock(Fragment,{key:1},[_hoisted_7$1],64))],64)):createCommentVNode("",!0)])),_:1})}_sfc_main$5.render=_sfc_render$5;const _sfc_main$4={props:{page_id:{type:Number,required:!0}},methods:{update_page(){var e=g.f.pstring(this.page);g.db.pages.put(e)}},data(){return{page:g.f.live_data((()=>db.pages.filter((e=>e.id==this.page_id)).first()))}},computed:{g:()=>g},components:{"edit-template":_sfc_main$5}},_hoisted_1$4={class:"toggle-handle q-pa-sm"},_hoisted_2$3=createVNode("button",{class:"toggle-handle q-pa-sm"}," Page-Object",-1);function _sfc_render$4(e,t,o,a,r,n){const d=resolveComponent("monaco-editor"),s=resolveComponent("toggle-content"),i=resolveComponent("edit-template");return r.page?(openBlock(),createBlock(s,{key:0,show_inner_p:!0},{control:withCtx((()=>[createVNode("button",_hoisted_1$4,toDisplayString(r.page.name),1)])),default:withCtx((()=>[createVNode("div",null,[createVNode(s,{show_inner_p:!1},{control:withCtx((()=>[_hoisted_2$3])),default:withCtx((()=>[createVNode("div",null,[createVNode(d,{update_text:"update page object",IsReadOnly:!1,onUpdate:t[1]||(t[1]=e=>{r.page=n.g.f.parse(e),n.update_page()}),lang:"json",modelValue:n.g.f.string(r.page)},null,8,["modelValue"])])])),_:1}),createVNode(i,{modelValue:r.page.template,"onUpdate:modelValue":t[2]||(t[2]=e=>{r.page.template=e,n.update_page()})},null,8,["modelValue"])])])),_:1})):createCommentVNode("",!0)}_sfc_main$4.render=_sfc_render$4;const _sfc_main$3={data:()=>({pages:g.f.live_data((()=>db.pages.toArray()))}),components:{"edit-page":_sfc_main$4}},_hoisted_1$3={style:{margin:"8px"}};function _sfc_render$3(e,t,o,a,r,n){const d=resolveComponent("edit-page");return r.pages?(openBlock(!0),createBlock(Fragment,{key:0},renderList(r.pages,((e,t)=>(openBlock(),createBlock("div",_hoisted_1$3,[createVNode(d,{page_id:r.pages[t].id},null,8,["page_id"])])))),256)):createCommentVNode("",!0)}_sfc_main$3.render=_sfc_render$3;const _sfc_main$2={props:{comp_id:{type:Number,required:!0}},methods:{update_comp(){var e=g.f.pstring(this.comp);g.db.comps.put(e)}},data(){return{comp:g.f.live_data((()=>db.comps.filter((e=>e.id==this.comp_id)).first()))}},computed:{g:()=>g},components:{}},_hoisted_1$2={class:"toggle-handle q-pa-sm"},_hoisted_2$2={key:0},_hoisted_3$1={key:0};function _sfc_render$2(e,t,o,a,r,n){const d=resolveComponent("monaco-editor"),s=resolveComponent("toggle-content");return r.comp?(openBlock(),createBlock(s,{key:0,show_inner_p:!1},{control:withCtx((()=>[createVNode("button",_hoisted_1$2,toDisplayString(r.comp.name),1)])),default:withCtx((()=>[createVNode("div",null,[Array.isArray(r.comp.template)?(openBlock(),createBlock("div",_hoisted_2$2,[createVNode("div",null,[createVNode("button",{class:"q-pa-sm q-my-sm",onClick:t[1]||(t[1]=(...e)=>n.update_comp&&n.update_comp(...e))}," update "+toDisplayString(r.comp.name),1),createVNode(d,{update_text:"update template",IsReadOnly:!1,onUpdate:t[2]||(t[2]=e=>r.comp.template[0]=e),lang:"html",modelValue:r.comp.template[0]},null,8,["modelValue"])]),(openBlock(),createBlock("div",_hoisted_3$1,[createVNode(d,{update_text:"update comp object",IsReadOnly:!1,onUpdate:t[3]||(t[3]=e=>r.comp=n.g.f.parse(e)),lang:"json",modelValue:n.g.f.string(r.comp)},null,8,["modelValue"]),createTextVNode(" "+toDisplayString(r.comp),1)]))])):createCommentVNode("",!0)])])),_:1})):createCommentVNode("",!0)}_sfc_main$2.render=_sfc_render$2;const _sfc_main$1={data:()=>({comps:g.f.live_data((()=>db.comps.toArray()))}),components:{"edit-comp":_sfc_main$2}},_hoisted_1$1={key:0,style:{margin:"8px"}},_hoisted_2$1={key:1};function _sfc_render$1(e,t,o,a,r,n){const d=resolveComponent("edit-comp");return r.comps?(openBlock(),createBlock("div",_hoisted_1$1,[r.comps.length?(openBlock(!0),createBlock(Fragment,{key:0},renderList(r.comps,((e,t)=>(openBlock(),createBlock("div",null,[createVNode(d,{comp_id:r.comps[t].id},null,8,["comp_id"])])))),256)):(openBlock(),createBlock("div",_hoisted_2$1," We have 0 components this time. "))])):createCommentVNode("",!0)}_sfc_main$1.render=_sfc_render$1;const _sfc_main={props:{},data:()=>({tab:"Pages"}),components:{"db-pages":_sfc_main$3,"db-comps":_sfc_main$1}},_hoisted_1=createVNode("div",{class:"text-h6 q-mb-md"},"Backup-Restore",-1),_hoisted_2=createVNode("div",{class:"text-h6 q-mb-md"},"Pages",-1),_hoisted_3=createVNode("div",{class:"text-h6 q-mb-md"},"Comps",-1),_hoisted_4=createVNode("div",{class:"text-h6 q-mb-md"},"Options",-1),_hoisted_5=createTextVNode(" ... "),_hoisted_6=createVNode("div",{class:"text-h6 q-mb-md"},"Templates",-1),_hoisted_7=createTextVNode(" ... "),_hoisted_8=createVNode("div",{class:"text-h6 q-mb-md"},"JS",-1),_hoisted_9=createTextVNode(" ... "),_hoisted_10=createVNode("div",{class:"text-h6 q-mb-md"},"CSS",-1),_hoisted_11=createTextVNode(" ... "),_hoisted_12=createVNode("div",{class:"text-h6 q-mb-md"},"Images",-1),_hoisted_13=createTextVNode(" ... "),_hoisted_14=createVNode("div",{class:"text-h6 q-mb-md"},"Blobs",-1),_hoisted_15=createTextVNode(" ... ");function _sfc_render(e,t,o,a,r,n){const d=resolveComponent("q-tab"),s=resolveComponent("q-tabs"),i=resolveComponent("q-tab-panel"),p=resolveComponent("db-pages"),l=resolveComponent("db-comps"),c=resolveComponent("q-tab-panels");return openBlock(),createBlock("div",null,[createVNode(s,{align:"left",modelValue:r.tab,"onUpdate:modelValue":t[1]||(t[1]=e=>r.tab=e)},{default:withCtx((()=>[createVNode(d,{name:"Backup-Restore",label:"Backup","no-caps":""}),createVNode(d,{name:"Pages",label:"Pages","no-caps":""}),createVNode(d,{name:"Comps",label:"Comps","no-caps":""}),createVNode(d,{name:"Options",label:"Options","no-caps":""}),createVNode(d,{name:"Templates",label:"Templates","no-caps":""}),createVNode(d,{name:"JS",label:"JS","no-caps":""}),createVNode(d,{name:"CSS",label:"CSS","no-caps":""}),createVNode(d,{name:"Images",label:"Images","no-caps":""}),createVNode(d,{name:"Blobs",label:"Blobs","no-caps":""})])),_:1},8,["modelValue"]),createVNode(c,{modelValue:r.tab,"onUpdate:modelValue":t[2]||(t[2]=e=>r.tab=e),swipeable:""},{default:withCtx((()=>[createVNode(i,{name:"Backup-Restore"},{default:withCtx((()=>[_hoisted_1])),_:1}),createVNode(i,{name:"Pages"},{default:withCtx((()=>[_hoisted_2,createVNode(p)])),_:1}),createVNode(i,{name:"Comps"},{default:withCtx((()=>[_hoisted_3,createVNode(l)])),_:1}),createVNode(i,{name:"Options"},{default:withCtx((()=>[_hoisted_4,_hoisted_5])),_:1}),createVNode(i,{name:"Templates"},{default:withCtx((()=>[_hoisted_6,_hoisted_7])),_:1}),createVNode(i,{name:"JS"},{default:withCtx((()=>[_hoisted_8,_hoisted_9])),_:1}),createVNode(i,{name:"CSS"},{default:withCtx((()=>[_hoisted_10,_hoisted_11])),_:1}),createVNode(i,{name:"Images"},{default:withCtx((()=>[_hoisted_12,_hoisted_13])),_:1}),createVNode(i,{name:"Blobs"},{default:withCtx((()=>[_hoisted_14,_hoisted_15])),_:1})])),_:1},8,["modelValue"])])}_sfc_main.render=_sfc_render,g.AddDB=async function(){var e=await g.Dexie.exists("ShreeRam");g.db=await new g.Dexie("ShreeRam"),g.db.version(1).stores({pages:"++id, &name",comps:"++id, &name",opts:"++id, &name",templates:"++id, &name",js:"++id, &name",css:"++id, &name",images:"++id, &name",blobs:"++id, &name"}),e||(g.db.pages.bulkAdd(g.pages),g.db.comps.bulkAdd(g.comps))},g.DeleteDb=async function(e=!1){g.db.delete(),e&&location.reload()},g.GetAppFromDB=async function(e){console.log(e);var t=await g.db.pages.toArray();return t=t.find((function(t){return t.name==e}))},g.render_template=function(e){var t="";if("string"==typeof e)return e;if("object"==typeof e){if(Array.isArray(e))return e.forEach((e=>{t+=function(e){return"string"==typeof e?e:"object"==typeof e?"<div> object-demo </div>":""}(e)})),t;t+=(temp,"<div> object-demo </div>")}return"<div>Template-Resove-Type : Unknown</div>"},g.add_v_plugins=function(page_object){var page_object_2={};if(page_object.hasOwnProperty("template")&&(page_object_2.template=g.render_template(page_object.template)),page_object.hasOwnProperty("setup")){var try_me=`page_object_2.setup = ${page_object.setup}`;eval(try_me)}if(page_object.hasOwnProperty("data")){var try_me=`page_object_2.data = ${page_object.data}`;eval(try_me)}if(page_object.hasOwnProperty("computed")){var try_me=`page_object_2.computed = ${page_object.computed}`;eval(try_me)}return page_object_2},g.start=async function(){g.f.add_socket(),await g.AddDB(),await Dexie.liveQuery((()=>db.pages.toArray())).subscribe((function(e){g.f.update()})),await Dexie.liveQuery((()=>db.comps.toArray())).subscribe((function(e){g.f.update()})),await Dexie.liveQuery((()=>db.opts.toArray())).subscribe((function(e){g.f.update()})),await Dexie.liveQuery((()=>db.templates.toArray())).subscribe((function(e){g.f.update()})),await g.CreateApp(),await g.CreateAppEditor()},g.CreateApp=async function(){var e=g.r;e.current_page_name=g.f.get_page_name();var t=await g.GetAppFromDB(e.current_page_name),o=g.add_v_plugins(t);g.r.current_page_object=t,g.App_Wrapper=Vue.createApp(o),(t.use_quasar||!1)&&g.App_Wrapper.use(Quasar),(t.use_vue_shortkey||!1)&&g.App_Wrapper.use(window.VueShortkey),(t.use_vdrag||!1)&&g.App_Wrapper.use(vdrag,{}),(t.use_DraggableResizable||!1)&&g.App_Wrapper.use(Vue3DraggableResizable.default),(t.use_draggable||!1)&&g.App_Wrapper.component("draggable",vuedraggable),(t.use_MonacoEditor||!1)&&(e+=g.App_Wrapper.component("monaco-editor",_sfc_main$7)),(t.use_ToggleContent||!1)&&g.App_Wrapper.component("toggle-content",_sfc_main$6),g.App=g.App_Wrapper.mount("#app-div")},g.CreateAppEditor=async function(){g.AppEditor_Wrapper=Vue.createApp(g.add_v_plugins(await g.GetAppFromDB("editor"))),g.AppEditor_Wrapper.use(Quasar),g.AppEditor_Wrapper.use(window.VueShortkey),g.AppEditor_Wrapper.use(vdrag,{}),g.AppEditor_Wrapper.use(Vue3DraggableResizable.default),g.AppEditor_Wrapper.component("draggable",vuedraggable),g.AppEditor_Wrapper.component("monaco-editor",_sfc_main$7),g.AppEditor_Wrapper.component("toggle-content",_sfc_main$6),g.AppEditor_Wrapper.component("db-editor",_sfc_main),g.AppEditor=g.AppEditor_Wrapper.mount("#editor-div")},g.pages=[{name:"home",template:['\n    <div class="q-pt-sm" style="background-color:grey">\n      <button class="q-pa-sm q-ma-sm" onclick="g.DeleteDb(true)">Delete Database</button>\n      <div style="margin-left:8px">\n        home page ends here.\n      </div>\n    </div>\n  '],data:"function (){ return {} }",setup:"function (props, { attrs, slots, emit, expose }) { return { } }",computed:"{ g(){ return g } }",use_quasar:!0,use_vue_shortkey:!0,use_vdrag:!0,use_DraggableResizable:!0,use_draggable:!0,use_MonacoEditor:!0,use_ToggleContent:!0,components:{}},{name:"editor",template:['\n<div class="parent">\n  <Vue3DraggableResizable\n  style="border:1px solid black; background-color:white; padding:8px; user-select:none"\n    :initW="300"\n    :initH="300"\n    v-model:x="x"\n    v-model:y="y"\n    v-model:w="w"\n    v-model:h="h"\n    v-model:active="active"\n    :draggable="true"\n    :resizable="true" >\n    <db-editor />\n  </Vue3DraggableResizable>\n</div>\n  '],data:"function (){ return {\n    x: 100,\n      y: 100,\n      h: 100,\n      w: 100,\n      active: false\n  } }",setup:"function (props, { attrs, slots, emit, expose }) { return { } }",computed:"{ g(){ return g } }",use_quasar:!0,use_vue_shortkey:!0,use_vdrag:!0,use_DraggableResizable:!0,use_draggable:!0,use_MonacoEditor:!0,use_ToggleContent:!0,components:{}}],g.comps=[{name:"comp1",template:['\n    <div class="q-pa-sm">\n      This is comp1\n    </div>\n  '],data:"data(){ return {} }",setup:"setup(props, { attrs, slots, emit, expose }) { return { } }",computed:"computed: { g(){ return g } }",components:{}}],g.d={},g.r=Vue.reactive({IsLive:!0}),g.f={pstring:e=>JSON.parse(JSON.stringify(e)),string:e=>JSON.stringify(e),parse:e=>JSON.parse(e),is_local_host:function(){return"8080"==location.port||"3000"==location.port},add_socket(){var e={},t=!1;g.f.is_local_host()?(e=io("http://localhost:8080/"),t=!0):"mpsir.github.io"!=location.host&&(e=g.io("http://super1mpsir-57484.portmap.host:57484/"),t=!0),t&&e.on("connect",(()=>{}))},live_data:e=>VueUse.useObservable(Dexie.liveQuery(e)),get_page_name(){var e=location.search;if(""==e)return"home";const t=new URLSearchParams(e).get("page");return t||"home"},update(){g.App&&(g.App_Wrapper.unmount(),$("#app-div").removeAttr("data-v-app"),g.CreateApp())}};
