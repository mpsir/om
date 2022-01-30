import{n as d,I as u,_ as p}from"./index.dd4fdec3.js";import"./vendor.719c5f33.js";var v=function(){var t=this,r=t.$createElement,e=t._self._c||r;return e("div",{staticClass:"block_content array"},[e("button",{on:{click:function(a){t.toAddItem=!t.toAddItem}}},[t._v("+")]),t._v(" "),e("ol",{staticClass:"array-ol"},[e("draggable",{attrs:{handle:".dragbar"},on:{end:t.onDragEnd},model:{value:t.flowData,callback:function(a){t.flowData=a},expression:"flowData"}},t._l(t.flowData,function(a,l){return e("li",{key:""+a.type+l,class:["array-item",{"hide-item":t.hideMyItem[l]==!0}]},[a.type!=="object"&&a.type!=="array"?e("p",[a.type==="string"?e("input",{directives:[{name:"model",rawName:"v-model",value:a.remark,expression:"member.remark"}],staticClass:"val-input",attrs:{type:"text",placeholder:"string"},domProps:{value:a.remark},on:{input:function(n){n.target.composing||t.$set(a,"remark",n.target.value)}}}):t._e(),t._v(" "),a.type=="number"?e("input",{directives:[{name:"model",rawName:"v-model.number",value:a.remark,expression:"member.remark",modifiers:{number:!0}}],staticClass:"val-input",attrs:{type:"number",placeholder:"number"},domProps:{value:a.remark},on:{input:[function(n){n.target.composing||t.$set(a,"remark",t._n(n.target.value))},function(n){return t.numberInputChange(a)}],blur:function(n){return t.$forceUpdate()}}}):t._e(),t._v(" "),a.type=="boolean"?e("select",{directives:[{name:"model",rawName:"v-model",value:a.remark,expression:"member.remark"}],staticClass:"val-input",attrs:{name:"value"},on:{change:function(n){var o=Array.prototype.filter.call(n.target.options,function(s){return s.selected}).map(function(s){var i="_value"in s?s._value:s.value;return i});t.$set(a,"remark",n.target.multiple?o:o[0])}}},[e("option",{domProps:{value:!0}},[t._v("true")]),t._v(" "),e("option",{domProps:{value:!1}},[t._v("false")])]):t._e()]):e("div",[e("span",{class:["json-key","json-desc"]},[t._v(`
              `+t._s(a.type.toUpperCase())+`
              `),a.type=="object"||a.type=="array"?e("i",{staticClass:"collapse-down v-json-edit-icon-arrow_drop_down",on:{click:function(n){return t.closeBlock(l,n)}}}):t._e(),t._v(" "),a.type=="object"?e("i",[t._v(t._s("{"+a.childParams.length+"}"))]):t._e(),t._v(" "),a.type=="array"?e("i",[t._v(t._s("["+a.childParams.length+"]"))]):t._e()]),t._v(" "),e("span",{staticClass:"json-val"},[a.type=="array"?[e("array-view",{attrs:{parsedData:a.childParams||[]},model:{value:a.childParams,callback:function(n){t.$set(a,"childParams",n)},expression:"member.childParams"}})]:t._e(),t._v(" "),a.type=="object"?[e("json-view",{attrs:{parsedData:a.childParams||{}},model:{value:a.childParams,callback:function(n){t.$set(a,"childParams",n)},expression:"member.childParams"}})]:t._e()],2)]),t._v(" "),e("div",{staticClass:"tools"},[e("select",{directives:[{name:"model",rawName:"v-model",value:a.type,expression:"member.type"}],staticClass:"tools-types",on:{change:[function(n){var o=Array.prototype.filter.call(n.target.options,function(s){return s.selected}).map(function(s){var i="_value"in s?s._value:s.value;return i});t.$set(a,"type",n.target.multiple?o:o[0])},function(n){return t.itemTypeChange(a)}]}},t._l(t.formats,function(n,o){return e("option",{key:o,domProps:{value:n}},[t._v(t._s(n))])}),0),t._v(" "),e("i",{staticClass:"dragbar v-json-edit-icon-drag"}),t._v(" "),e("i",{staticClass:"del-btn",on:{click:function(n){return t.delItem(t.parsedData,a,l)}}},[e("i",{staticClass:"v-json-edit-icon-huishouzhan_huaban"})])])])}),0)],1),t._v(" "),t.toAddItem?e("item-add-form",{attrs:{needName:!1},on:{confirm:t.newItem,cancel:t.cancelNewItem}}):t._e(),t._v(" "),t.toAddItem?t._e():e("div",{staticClass:"block add-key",on:{click:t.addItem}},[e("i",{staticClass:"v-json-edit-icon-add"})])],1)},f=[];const h={name:"ArrayView",props:["parsedData"],data:function(){return{formats:["string","array","object","number","boolean"],flowData:this.parsedData,toAddItem:!1,hideMyItem:{}}},watch:{parsedData:{handler(t,r){this.flowData=this.parsedData||[]}}},components:{"item-add-form":u,"json-view":()=>p(()=>import("./index.dd4fdec3.js").then(function(t){return t.J}),["assets/index.dd4fdec3.js","assets/index.44067813.css","assets/vendor.719c5f33.js"])},methods:{delItem:function(t,r,e){this.flowData.splice(e,1),this.hideMyItem[e]&&(this.hideMyItem[e]=!1),this.$emit("input",this.flowData)},addItem:function(){this.toAddItem=!0},cancelNewItem:function(){this.toAddItem=!1},closeBlock:function(t,r){this.$set(this.hideMyItem,t,!this.hideMyItem[t])},newItem:function(t){this.toAddItem=!1;let r={name:t.key,type:t.type};t.type=="array"||t.type=="object"?(r.childParams=t.val,r.remark=null):(r.childParams=null,r.remark=t.val),this.flowData.push(r),this.$emit("input",this.flowData),this.cancelNewItem()},onDragEnd:function(){this.$emit("input",this.flowData)},itemTypeChange:function(t){(t.type==="array"||t.type==="object")&&(t.childParams=[],t.remark=null),t.type==="boolean"&&(t.remark=!0),t.type==="string"&&(t.remark=""),t.type==="number"&&(t.remark=0)},numberInputChange:function(t){t.remark||(t.remark=0)}}},c={};var m=d(h,v,f,!1,_,null,null,null);function _(t){for(let r in c)this[r]=c[r]}var w=m.exports;export{w as default};