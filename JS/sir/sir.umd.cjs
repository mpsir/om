(function(r){typeof define=="function"&&define.amd?define(r):r()})(function(){"use strict";var r="";const d=location.origin;d=="http://localhost:8080"?r="http://localhost:8080":d=="http://localhost:3000"?r="http://localhost:3000":r="http://super1mpsir-57484.portmap.host:57484";function m(t,a=!1){var s=!1,e=new XMLHttpRequest;return e["Access-Control-Allow-Origin"]="*",e.withCredentials=!0,e.onreadystatechange=function(){this.readyState==4&&this.status==200&&(s=this.responseText)},e.open("GET",t,a),e.send(),s}function l(t,a){localStorage.setItem(t,JSON.stringify(a))}async function p(){l("Pages",[{name:"Home",data:`var Page = {
            Libs:[ 
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
            "monaco-editor",

        ],    
            VApp : {
                template:"home page"
            }
        }`},{name:"404",data:`var Page = {  
            VApp : {
                template:"404 page"
            }
        }`}]),l("Components",[{name:"comp1",data:`var Comp = {
                VApp:{
                    template:"this is comp1"
                }
            }`}]),l("Directives",[]),l("UsePlugins",[]),l("Mixin",[]),l("Composable",[]),l("Templates",[])}var u={Version:1};function h(){return!!localStorage.getItem("Frame_VP")}function L(){console.log(`
checking for upgrading ...`);var t=!1;return console.log("Frame.Version",u.Version),localStorage.getItem("Frame_VP")?(console.log("local db version ",JSON.parse(localStorage.getItem("Frame_VP")).Version),t=JSON.parse(localStorage.getItem("Frame_VP")).Version!==u.Version):(console.log('localStorage "Frame_VP" not found'),t=!1),console.log("IsUpgradable",t+`

`),t}async function j(){console.log(`Upgrading

`),f()}console.log(`
TargetURL`,r+`
`);async function S(){function t(a,s){localStorage.setItem(a,m(r+s))}console.log("installing ..."),t("JS_CoreJS","/Lib/core-js-bundle@3.29.1/minified.min.js"),t("JS_VueDev","/Lib/vue/vue.global.min.js"),t("JS_JQ","/Lib/jq/jquery.js"),t("JS_Dexie","/Lib/dexie/dexie.min.js"),t("JS_RandomBytes","/Lib/my-random-bytes.js"),t("JS_Serialize","/Lib/my-serialize.js"),await p(),localStorage.setItem("Frame_VP",JSON.stringify(u))}function f(t=!0,a=!0){console.log("deleting frame ..."),t?localStorage.clear():localStorage.removeItem("Frame_VP"),a&&location.reload()}globalThis.AppDelete=f;async function n(t,a){var e=(await g.db.Libs.toArray()).find(function(c){return c.name==t});if(e)return e.data;const i=m(a);return await g.db.Libs.add({name:t,data:i}),i}var w="https://mpsir.github.io/om",o=r,b=!1;r=="http://super1mpsir-57484.portmap.host:57484"?o=w:(o=r,b=!0);async function P(t){for(const s of t)switch(s){case"material-icons":g.d.Libs.find(e=>e=="material-icons")||($("head").append(`<link rel="stylesheet" data-dyn-name="material-icons" href="${o}/Lib/material-icons/iconfont/material-icons.css">`),g.d.Libs.push("material-icons"));break;case"roboto":var a=g.d.Libs.find(e=>e=="roboto");a||(b?$("head").append(`<link rel="stylesheet" data-dyn-name="roboto" href="${o}/CSS/roboto-local.css">`):$("head").append(`<link rel="stylesheet" data-dyn-name="roboto" href="${o}/CSS/roboto.css">`),g.d.Libs.push("roboto"));break;case"vue-select":g.d.Libs.find(e=>e=="vue-select")||($("head").append(`
                    <style data-dyn-name="vue-select-css"> 
                        ${await n("vue-select-css",`${r}/Lib/vue-select/vue-select.css`)} 
                    </style>`),$("body").append(`
                    <script data-dyn-name="vue-select-js" class="remove-me" async="false">
                        ${await n("vue-select-js",`${r}/Lib/vue-select/vue-select.umd.js`)}
                    <\/script>`),g.d.Libs.push("vue-select"));break;case"rx-js":g.d.Libs.find(e=>e=="rx-js")||($("body").append(`
                    <script data-dyn-name="rx-js" class="remove-me" async="false">
                        ${await n("rx-js",`${r}/Lib/rxjs.umd.min.js`)}
                    <\/script>`),g.d.Libs.push("rx-js"));break;case"vue-use":g.d.Libs.find(e=>e=="vue-use")||($("body").append(`
                        <script data-dyn-name="vueuse-shared" class="remove-me" async="false">
                            ${await n("vueuse-shared",`${r}/Lib/@vueuse/shared@9.13.0/index.iife.min.js`)}
                        <\/script>
                        <script data-dyn-name="vueuse-core" class="remove-me" async="false">
                            ${await n("vueuse-core",`${r}/Lib/@vueuse/core@9.13.0/index.iife.min.js`)}
                        <\/script>
                        <script data-dyn-name="vueuse-rx-js" class="remove-me" async="false">
                            ${await n("rx-js",`${r}/Lib/@vueuse/rxjs/index.iife.min.js`)}
                        <\/script>`),g.d.Libs.push("vue-use"));break;case"monaco-editor":g.d.Libs.find(e=>e=="monaco-editor")||($("head").append(`<link rel="stylesheet" data-name="vs/editor/editor.main" href="${o}/Lib/monaco-editor/min/vs/editor/editor.main.css">`),$("body").append(`<script class="remove-me" async="false"> const require = { paths: { vs: '${o}/Lib/monaco-editor/min/vs' } }; <\/script>
                        <script class="remove-me" async="false" src="${o}/Lib/monaco-editor/min/vs/loader.js"><\/script>
                        <script class="remove-me" async="false" src="${o}/Lib/monaco-editor/min/vs/editor/editor.main.nls.js"><\/script>
                        <script class="remove-me" async="false" src="${o}/Lib/monaco-editor/min/vs/editor/editor.main.js"><\/script>`),g.d.Libs.push("monaco-editor"));break;case"socket-io":g.d.Libs.find(e=>e=="socket-io")||($("body").append(`<script data-dyn-name="socket.io" class="remove-me" async="false">
                        ${await n("socket-io",`${r}/Lib/socket-io-client.js`)}
                    <\/script>`),g.d.Libs.push("socket-io"));break;case"jq-ui":g.d.Libs.find(e=>e=="jq-ui")||($("head").append(`<link rel="stylesheet" href="${o}/Lib/jq/jquery-ui.min.css">`),$("body").append(`<script class="remove-me" async="false"  src="${o}/Lib/jq/jquery-ui.min.js" ><\/script>
                    <script data-dyn-name="touch-jq-ui" class="remove-me" async="false">
                        ${await n("touch-jq-ui",`${r}/Lib/jq/touch.js`)}
                    <\/script>`),g.d.Libs.push("jq-ui"));break;case"vue-quasar":g.d.Libs.find(e=>e=="vue-quasar")||($("head").append(`
                    <style data-dyn-name="vue-quasar-css"> 
                        ${await n("vue-quasar-css",`${r}/Lib/quasar/quasar.css`)} 
                    </style>`),$("body").append(`
                    <script data-dyn-name="vue-quasar-js" class="remove-me" async="false">
                        ${await n("vue-quasar-js",`${r}/Lib/quasar/quasar.js`)} 
                    <\/script>`),g.d.Libs.push("vue-quasar"));break;case"vue-iframe":g.d.Libs.find(e=>e=="vue-iframe")||($("body").append(`
                    <script data-dyn-name="vue-iframe-host" class="remove-me">
                        ${await n("vue-iframe-host",`${r}/Lib/iframe-resize/iframe-host.js`)}
                    <\/script>
                    <script data-dyn-name="vue-iframe-client" class="remove-me" async="false">
                        ${await n("vue-iframe-client",`${r}/Lib/iframe-resize/iframe-client.js`)}
                    <\/script>`),g.d.Libs.push("vue-iframe"));break;case"vue-shortkey":g.d.Libs.find(e=>e=="vue-shortkey")||($("body").append(`
                    <script data-dyn-name="vue-shortkey" class="remove-me" async="false">
                        ${await n("vue-shortkey",`${r}/Lib/vue3-shortkey.min.js`)}
                    <\/script>`),g.d.Libs.push("vue-shortkey"));break;case"vue-sortable":g.d.Libs.find(e=>e=="vue-sortable")||($("body").append(`<script data-dyn-name="vue-sortable" class="remove-me" async="false">
                        ${await n("vue-sortable",`${r}/Lib/sortablejs/Sortable.min.js`)}
                    <\/script>`),g.d.Libs.push("vue-sortable"));break;case"vue-draggable":g.d.Libs.find(e=>e=="vue-draggable")||($("body").append(`<script class="remove-me" async="false">
                        ${await n("vue-draggable",`${r}/Lib/vuedraggable/vuedraggable.umd.min.js`)}
                    <\/script>`),g.d.Libs.push("vue-draggable"));break}$(".remove-me").remove()}const v=function(){return JSON.parse(localStorage.getItem("Pages"))},A=function(t){return v().find(function(a){return a.name==t}).data};function k(){const t=location.search;if(t=="")return"Home";const a=new URLSearchParams(t).get("page");return a&&v().find(function(e){return e.name==a})?a:"404"}async function y(){const t=k();console.log("PageName",t),g.ev(A(t)),console.log(`
Creating Page : ${t}`),console.log(`PageData
`,Page),Page.hasOwnProperty("Libs")&&Page.Libs.length&&await P(Page.Libs),g.App_Wrapper=Vue.createApp(Page.VApp),g.App=g.App_Wrapper.mount("#app-div")}function q(){var t=["JS_CoreJS","JS_JQ","JS_VueDev","JS_Dexie","JS_RandomBytes","JS_Serialize"];t.forEach(a=>{let s=document.createElement("script");s.setAttribute("type","text/javascript"),s.text=localStorage.getItem(a),s.setAttribute("class","remove-me"),s.setAttribute("async",!1),s.class="remove-me",document.body.appendChild(s),s.addEventListener("load",()=>{}),s.addEventListener("error",e=>{console.log("Error on loading file",e)})})}async function x(){p(),q(),g.db=await new Dexie("Sir"),await g.db.version(1).stores({Libs:"++id, &name",css:"++id, &name",js:"++id, &name",images:"++id, &name",audios:"++id, &name",videos:"++id, &name",svg:"++id, &name",blobs:"++id, &name"}),$("body").append('<div id="app-div"></div>'),$(".remove-me").remove(),g.d={Libs:[]},g.r=Vue.reactive({IsLive:!0,IsEditor:!0,IsAppStart:!1,IsConnected:!1,IsConnectedFirstTime:!1,IsReConnected:!1});var t={S:function(a,s={space:2}){return g.serialize(a,s)},P:function(a){return g.deserialize(a)},PS:function(a,s={space:2}){return g.deserialize(g.serialize(a,s))},getType:function(a){switch(Object.prototype.toString.call(a)){case"[object RegExp]":return"regexp";case"[object Map]":return"map";case"[object Set]":return"set";case"[object Array]":return"array";case"[object Date]":return"date";case"[object Object]":return"object";case"[object Null]":return"null";case"[object Function]":return"function";case"[object Undefined]":return"undefined";default:return typeof a}},objectToKeyArray:function(s){var s=g.f.PS(s),e=[];return Object.entries(s).forEach(function(c,J){e.splice(e.length+1,0,{id:J,name:c[0],data:c[1]})}),e},KeyArrayToObject:function(s){var s=g.f.PS(s),e={};return s.forEach(function(i,c){e[i.name]=i.data}),e},ArrayToKeyArray:function(s){var s=g.f.PS(s),e=[];return s.forEach(function(i,c){e.splice(e.length+1,0,{id:c,name:c,data:i})}),e},KeyArrayToArray:function(s){var s=g.f.PS(s),e=[];return s.forEach(function(i,c){e[c]=i.data}),e},generateUID:function(a=16){for(var s=globalThis.randomBytes(a),e="id",i=0;i<a;++i)e+=s[i].toString(16);return e},dup:function(a,s){var e=g.f.PS(a[s]);e.hasOwnProperty("name")&&(e.name=e.name+"_dup"),a.splice(s+1,0,e)},RandomId:function(){return"id-"+Date.now()},ArrayMove:function(a,s,e){if(e>=a.length)for(var i=e-a.length+1;i--;)a.push(void 0);return a.splice(e,0,a.splice(s,1)[0]),a},ObjToArray:function(a){return Object.entries(a)},ArrayToObj:function(a){return Object.fromEntries(a)},GetTimeStamp:function(){var a=new Date;return a.getDate()+"/"+(a.getMonth()+1)+"/"+a.getFullYear()+" @ "+a.getHours()+":"+a.getMinutes()+":"+a.getSeconds()}};g.f={...g.f,...t},await y()}function I(){return navigator.userAgent.indexOf("Chrome")!=-1}g.f.GetLocalSpace=function(){var t="";for(var a in window.localStorage)window.localStorage.hasOwnProperty(a)&&(t+=window.localStorage[a]);return t?3+t.length*16/(8*1024)+" KB":"Empty (0 KB)"},g.f.PageRefresh=async function(){console.clear(),console.log("Refreshing Page"),g.App&&(await g.App_Wrapper.unmount(),$("#app-div").removeAttr("data-v-app"),y())},globalThis.AppStart=async function(){I()?(h()||await S(),L()&&await j(),await x()):alert("please use chrome web browser ...")}});
