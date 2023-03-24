var g = globalThis
g.f = {
  pstring(obj) { return JSON.parse(JSON.stringify(obj)) },
  string(obj) { return JSON.stringify(obj) },
  parse(obj) { return JSON.parse(obj) },
}
g.d = {}
g.r = Vue.reactive({ funs: `g.f = { a: function(){ } }` })

async function start() {

  var App = {
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        g: Vue.computed(() => g)
      };
    }
  }

  g.Mixins = {
    modelValue: {
      computed: {
        g() { return g }
      },
      data() { return { Value: null } },
      props: ['modelValue'],
      emits: ['update:modelValue'],
      created() { this.update_modelValue() },
      watch: {
        modelValue: {
          handler(newValue, oldValue) { this.update_modelValue() },
          deep: true
        }
      },
      methods: {
        update_modelValue() { this.Value = this.modelValue },
        update_parent() { this.$emit('update:modelValue', this.Value) },
      }
    }
  }


  var a = Vue.createApp(App);
  a.use(window['VueShortkey']);
  a.use(Quasar);
  a.use(vdrag, {});
  a.use(Vue3DraggableResizable.default)
  a.component('draggable', vuedraggable);

  a.component('monaco-editor', {
    mixins: [g.Mixins.modelValue],
    data() { return { input_type: 'string' } },
    setup: function (props, { attrs, slots, emit, expose }) {
      return {
        editor: {}
      };
    },
    template: `
    <div v-if="!IsReadOnly">
    <q-btn @click="update_parent()" color="white" text-color="black" label="Update" no-caps></q-btn>
    </div>
            <div style="border:1px dashed darkgrey">
                <div ref="m_editor" style="min-height:28px; ">
                </div>
            </div>`,
    mounted() {
      var this1 = this
      this.editor = g.monaco.editor.create(this.$refs.m_editor, {
        value: this1.Value,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        language: this.$attrs.language || 'json',
        readOnly: false,
        minimap: { enabled: false },
        showFoldingControls: 'always',
        scrollbar: {
          vertical: 'hidden',
          horizontal: "visible"
        },
        overviewRulerBorder: false,
      });

      setTimeout(() => { this.update_editor() }, 100);
      if (JSON.parse(this.$attrs.format_on_start || true)) {
        setTimeout(() => { this.editor.getAction('editor.action.formatDocument').run() }, 500);
        globalThis.editor = this1.editor
        this.Value = this.editor.getValue()
      }
      this.editor.getModel().onDidChangeContent(event => { this.update_editor(); this.Value = this.editor.getValue() });
      const registerOnDidChangeFolding = () => {
        const foldingContrib = this.editor.getContribution('editor.contrib.folding');
        foldingContrib.getFoldingModel().then(foldingModel => {
          foldingModel.onDidChange(() => {
            this1.Value = this1.editor.getValue()
            //console.log('editor.getValue()', this1.editor.getValue());
            //this1.editor.viewModel.lines.getViewLineCount()
          });
        });
      };
      registerOnDidChangeFolding();
      this.editor.onDidChangeModel(registerOnDidChangeFolding);
    },
    methods: {
      update_editor: function () {
        const contentHeight = this.editor.getModel().getLineCount() * 19;
        $(this.$refs.m_editor).css('height', contentHeight + 'px');
        this.editor.layout();
        this.Value = this.editor.getValue()
      },
      update_modelValue() {
        var modelValue = g.f.pstring(this.modelValue)
        if (typeof modelValue != "string") {
          this.input_type = typeof modelValue
          this.Value = g.f.string(this.modelValue)
        }
        else { this.Value = this.modelValue }
      },
      update_parent() {
        console.log('this.input_type', this.input_type);
        if (typeof this.input_type != 'string') { this.$emit('update:modelValue', g.f.string(this.Value)) }
        else { this.$emit('update:modelValue', this.Value) }
      },
    },
    computed:{
      IsReadOnly(){ return this.$attrs.readOnly || false }
    }
  });

  a.component('ast-editor', {
    data() { return { flow_string: null, flow_obj: null } },
    setup() { return {} },
    created() { this.update_flow() },
    methods: {
      update_flow() {
        this.flow_string = this.parsed
        this.flow_obj = g.esprima.parseScript(this.flow_string, {
          jsx: false, 	// Support JSX syntax
          range: false, 	// Annotate each node with its index-based location
          loc: false, 	// Annotate each node with its column and row-based location
          tolerant: false, 	// Tolerate a few cases of syntax errors
          tokens: false, 	// Collect every token
          comment: false 	// Collect every line and block comment
        })
      },
      generate(flow_obj = this.flow_obj) {
        this.flow_string = g.astring.generate(flow_obj)
      }
    },
    watch: {
      parsed(new1, old1) { this.update_flow() }
    },
    props: {
      parsed: { required: true, type: String }
    },
    computed: {
      g() { return g }
    },
    template: `
<div>
      <pre>
      {{flow_obj.body}}
      </pre>
      <monaco-editor readOnly 
      :modelValue="flow_obj.body"
      @update:modelValue="g.console.log($event)"
       />
      
      <p class="q-pa-sm" v-for="(node1, node1_no) in flow_obj.body">
        <component :is="node1.type" :parsed="node1" @update="flow_obj.body[node1_no]=$event"></component>
      </p>

      {{ flow_string }}
</div>`
  })

  a.component('ExpressionStatement', {
    data() { return { flow_string: null, flow_obj: null } },
    template: `ExpressionStatement`,
    props: {
      parsed: { type: Object, required: true }
    },
    emits: ['update'],

  })

  // a.component('b1', moon.Button)

  g.App = a.mount("#app-div");

}

function AST_Resolver(obj) {
  console.log('obj', g.f.pstring(obj));
  return "var a = 5;"
}