import MonacoEditor from '/Comps/Basic/MonacoEditor.vue'
import ToggleContent from '/Comps/Basic/ToggleContent.vue'
import JEdit from '/Comps/JEdit/JEdit.vue'
import ArrayEdit from '/Comps/JEdit/ArrayEdit.vue'
import ArrayAdd from '/Comps/JEdit/ArrayAdd.vue'
import Draggable from "vue3-draggable";

import edit_null from "/Comps/JEdit/edit_null.vue"
import edit_undefined from "/Comps/JEdit/edit_undefined.vue"
import edit_string from "/Comps/JEdit/edit_string.vue"
import edit_number from "/Comps/JEdit/edit_number.vue"
import edit_boolean from "/Comps/JEdit/edit_boolean.vue"
import edit_object from "/Comps/JEdit/edit_object.vue"
import edit_array from "/Comps/JEdit/edit_array.vue"
import edit_date from "/Comps/JEdit/edit_date.vue"
import edit_map from "/Comps/JEdit/edit_map.vue"
import edit_set from "/Comps/JEdit/edit_set.vue"
import edit_function from "/Comps/JEdit/edit_function.vue"
import edit_regexp from "/Comps/JEdit/edit_regexp.vue"
import edit_bigint from "/Comps/JEdit/edit_bigint.vue"


g.f = {
    S: function (objToStr, opts = { space: 2 }) {
        return g.serialize(objToStr, opts)
    },
    P: function (strToObj) {
        return g.deserialize(strToObj)
    },
    PS: function (objToStr, opts = { space: 2 }) {
        return g.deserialize(g.serialize(objToStr, opts))
    },
    getType: function (obj) {
        switch (Object.prototype.toString.call(obj)) {
            case "[object RegExp]":
                return "regexp";
                break;
            case "[object Map]":
                return "map";
                break;
            case "[object Set]":
                return "set";
                break;
            case "[object Array]":
                return "array";
                break;
            case "[object Date]":
                return "date";
                break;
            case "[object Object]":
                return "object";
                break;
            case "[object Null]": return "null"; break;
            case "[object Function]":
                return "function";
                break;
            case "[object Undefined]":
                return "undefined"
                break;
            default:
                // "null"
                // "undefined"
                // "string"
                // "number"
                // "boolean"
                // "object"
                // "array"
                // "date"
                // "map"
                // "set"
                // "function"
                // "regexp"
                //  bigint
                return typeof obj;
                break;
        }
    },
    objectToKeyArray: function (obj) {
        var obj = g.f.PS(obj)
        // console.log('obj\n', obj);
        var r = []
        const entries = Object.entries(obj);
        entries.forEach(function (element, e_no) { r.splice((r.length + 1), 0, { id: e_no, name: element[0], data: element[1] }) });
        return r
    },
    KeyArrayToObject: function (KeyArray) {
        var KeyArray = g.f.PS(KeyArray)
        var r = {}
        KeyArray.forEach(function (element, e_no) { r[element.name] = element.data });
        return r
    },
    ArrayToKeyArray: function (arr) {
        var arr = g.f.PS(arr)
        // console.log('\n\narr\n', arr);
        var r = []
        arr.forEach(function (element, e_no) { r.splice((r.length + 1), 0, { id: e_no, name: e_no, data: element }) });
        return r
    },
    KeyArrayToArray: function (KeyArray) {
        var KeyArray = g.f.PS(KeyArray)
        var r = []
        KeyArray.forEach(function (element, e_no) { r[e_no] = element.data });
        return r
    },
    generateUID: function (UID_LENGTH=16) {
        var bytes = globalThis.randomBytes(UID_LENGTH);
        var result = 'id';
        for (var i = 0; i < UID_LENGTH; ++i) {
            result += bytes[i].toString(16);
        }
        return result;
    }
}

var SirVueLib = {
    install(app, opts) {
        app.component("v-select", window["vue-select"])
        app.component("i-frame", {
            template: `<iframe ref="i1" v-bind="$attrs" style="width: 1px; min-width: 100%; border:none"></iframe>`,
            mounted: function () { g.iFrameResize({ log: false }, this.$refs.i1) },
            computed: { g: function () { return g } }
        })
        app.component('monaco-editor', MonacoEditor)
        app.component('toggle-content', ToggleContent)
        app.component('draggable-basic', Draggable)
        app.component('draggable', g.vuedraggable)
        app.component('j-edit', JEdit)
        app.component('array-edit', ArrayEdit)
        app.component('array-add', ArrayAdd)

        app.component('edit-null', edit_null) 
        app.component('edit-undefined', edit_undefined) 
        app.component('edit-string', edit_string)
        app.component('edit-number', edit_number) 
        app.component('edit-boolean', edit_boolean) 
        app.component('edit-object', edit_object) 
        app.component('edit-array', edit_array) 
        app.component('edit-date', edit_date) 
        app.component('edit-map', edit_map) 
        app.component('edit-set', edit_set) 
        app.component('edit-function', edit_function) 
        app.component('edit-regexp', edit_regexp) 
        app.component('edit-bigint', edit_bigint) 

    }
}

export default {
    CreateApp: function (page_obj, useApp = { Q: true, Sir: true }) {
        g.App_Wrapper = Vue.createApp(page_obj)
        g.App_Wrapper.use(Quasar)
        g.App_Wrapper.use(SirVueLib)
        // useApp.Q ? g.App_Wrapper.use(Quasar) : null
        // useApp.Sir ? g.App_Wrapper.use(SirVueLib) : null
        g.App = g.App_Wrapper.mount('#app-div')
    }
}