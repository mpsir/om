<template>
  <div v-bind="$attrs">
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
  </div>
</template>
  
<script>
// import OtherComponent from ?./OtherComponent.vue?
export default {
  data() { return { Value: null, input_type: 'string' } },
  setup: function (props, { attrs, slots, emit, expose }) {
    return {
      editor: {},
      g: Vue.computed(() => g)
    };
  },
  props: {
    parsed: { type: String, required: true },
    update_text: { type: String, required: false, default: '' },
    lang: { type: String, required: false, default: 'javascript' },
    format_on_start: { type: Boolean, required: false, default: false },
    IsReadOnly: { type: Boolean, required: false, default: false }
  },
  emits: ['update:parsed', 'update'],
  created() { this.update_parsed() },
  watch: {
    parsed: {
      handler(newValue, oldValue) { this.update_parsed() },
      deep: false
    }
  },
  mounted() {
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
  methods: {
    update_editor: function () {
      const contentHeight = this.editor.getModel().getLineCount() * 19;
      $(this.$refs.m_editor).css('height', contentHeight + 'px');
      this.editor.layout();
      this.Value = this.editor.getValue()
    },
    update_parsed() {
      this.Value = this.parsed
      try {
        this.editor.getModel().setValue(this.parsed)
        if (this.format_on_start) {
          this.editor.getAction('editor.action.formatDocument').run()
        }
      } catch (error) { }
    },
    update_parent() {
      this.$emit('update', this.Value)
    },
  }
}
</script>