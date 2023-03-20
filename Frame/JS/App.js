var g = globalThis

g.f={
    pstring(obj){ return JSON.parse( JSON.stringify(obj) ) },
    string(obj){ return JSON.stringify(obj) },
    parse(obj){ return JSON.parse(obj) },
}

g.d = {
  data_types:[
    'undefined',
    'null',
    'string',
    'number',
    'bool',
    'obj',
    'array',
    'function',
    'class',
    'map',
    'weakmap',
    'promise',
    'date',
    'symbol',
    'bigint',
    'scope',
  ]
}

g.r = Vue.reactive({
  ast: {
    type: 'string',
    val: ""
  },
  ast_r: 'var a = 5;'
})

async function start() {

    var App = {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g)
      };
    }
  }

  var a = Vue.createApp(App);
  a.use(window['VueShortkey']);
  a.use(Quasar);
  a.use(vdrag, {});
  a.use(Vue3DraggableResizable.default)
  a.component('draggable', vuedraggable);
  a.component('m-edit-funs', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        funs: VueUse.useObservable(
          Dexie.liveQuery(() => db.funs.toArray())
        ),
        g: Vue.computed(() => g)
      };
    },
    template: `
                <div v-if="false">
                    <m-editor format_on_start="true" language='json' :val="g.f.string(g.f)"></m-editor>
                </div>
                <div v-if="true" v-for="(value, key, index) in g.f">
                <p>
                <h6>{{ key }}</h6>
                {{ typeof value }}, <br/>
                {{ typeof g.JSON.parse(value) }}
                <m-editor v-if="false" format_on_start="true" language='javascript' 
                    :val="g.f.string(value)"></m-editor>

                </p>
                    <m-editor v-if="false" format_on_start="true" language='json' :val="g.f.string(g.f)"></m-editor>
                </div>
                `
  });
  a.component('m-editor', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        editor: {},
        g: Vue.computed(() => g),
        update_editor: function () {
          const contentHeight = this.editor.getModel().getLineCount() * 19;
          $(this.$refs.m_editor).css('height', contentHeight + 'px');
          this.editor.layout();
        }
      };
    },
    props: {
      val: { type: String, required: true }
    },
    template: `
            <div style="border:1px dashed darkgrey">
                <div ref="m_editor" style="min-height:28px;">
                </div>
            </div>
            `,
    mounted() {
      this.editor = g.monaco.editor.create(this.$refs.m_editor, {
        value: this.val,
        language: this.$attrs.language || 'json',
        readOnly: false,
        minimap: { enabled: false }
      });
      setTimeout(() => { this.update_editor() }, 100);
      if (JSON.parse(this.$attrs.format_on_start || true)) {
        setTimeout(() => { this.editor.getAction('editor.action.formatDocument').run() }, 500);
      }
      this.editor.getModel().onDidChangeContent(event => { this.update_editor() });
    }
  });
  a.component('ast', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
<div>
    <div>
      <ast-undefined :parsed="flow" v-if="flow.type=='undefined'" />
      <ast-null :parsed="flow" v-if="flow.type=='null'" />
      <ast-string :parsed="flow" v-if="flow.type=='string'"  />
      <ast-number :parsed="flow" v-if="flow.type=='number'"  />
      <ast-bool :parsed="flow" v-if="flow.type=='bool'"  />
      <ast-obj :parsed="flow" v-if="flow.type=='obj'"  />
      <ast-array :parsed="flow" v-if="flow.type=='array'"  />
      <ast-function :parsed="flow" v-if="flow.type=='function'"  />
      <ast-class :parsed="flow" v-if="flow.type=='class'"  />
      <ast-map :parsed="flow" v-if="flow.type=='map'" />
      <ast-weak-map :parsed="flow" v-if="flow.type=='weakmap'" />
      <ast-promise :parsed="flow" v-if="flow.type=='promise'" />
      <ast-date :parsed="flow" v-if="flow.type=='date'" />
      <ast-symbol :parsed="flow" v-if="flow.type=='symbol'" />
      <ast-big-int :parsed="flow" v-if="flow.type=='bigint'" />
      <ast-scope :parsed="flow" v-if="flow.type=='scope'" />
    </div>
    <div>
        <p>Result:</p>
        <p style="margin-bottom: 0px;">{{ g.AST_Resolver(flow) }}</p>
    </div>
    <div>
        <p>Obj:</p>
        <pre style="margin-bottom: 0px;">{{ flow }}</pre>
    </div>
</div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-string', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
    <div>
    <q-expansion-item default-opened expand-separator icon="signal_wifi_off" label="Wifi settings" class="bg-grey-4">
      <template v-slot:header>
          <q-item-section> 
            string
          </q-item-section>
      </template>
      <q-card class="bg-grey-3">
          <q-card-section>
          <p><ast-data-type @update="g.console.log($event)" :parsed="flow.type" /></p>

           <pre> {{flow}} </pre>
          </q-card-section>
      </q-card>
    </q-expansion-item>  
    </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-number', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      number 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-obj', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
              object 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-function', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      function 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-array', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      array 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-bool', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      bool 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-map', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      map 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-class', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      class
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-weak-map', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      weak-map  
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-undefined', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div>
              undefined  
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-null', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div>
                null 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-promise', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
            promise  
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-big-int', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      big-int 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-date', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      date 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-symbol', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      symbol
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-scope', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
            <div style="">
      scope 
            </div>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      }
    },
    watch: {
      val: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: true
      }
    }
  });
  a.component('ast-data-type', {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g),
      };
    },
    emits: ['update'],
    data(){
      return { flow:{} }
    },
    props: {
      parsed: { required: true }
    },
    template: `
    {{flow}}
            <v-select 
            @update:modelValue="update_parent($event)"
            :modelValue="flow"
            style="max-width:150px" 
            :options="[{ color: 'string' }, { color: 'null' }]" label-by="color"
            ></v-select>
            `,
    mounted() { },
    created() {
      this.update_parsed()
    },
    methods:{
      update_parsed(){
        this.flow = this.parsed
      },
      update_parent(data){
        this.$emit('update', this.flow)
      }
    },
    watch: {
      parsed: {
        handler(newValue, oldValue) { this.update_parsed() },
        deep: false
      }
    }
  });
  g.App = a.mount("#app-div");
}

function AST_Resolver(obj) {
    console.log('obj', g.f.pstring(obj) );
  return "var a = 5;"
}