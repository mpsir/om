<template>
  <span ref="controls">
    <slot name="control">
      <p>control slot is empty</p>
    </slot>
  </span>
  <slot v-if="show_inner">
    <p>default slot  is empty</p>
  </slot>
</template>
  
<script>
export default {
  props: {
    show_inner_p: { type: Boolean, default: true, required: false }
  },
  data() {
    return { show_inner: true }
  },
  created() {
    this.show_inner = this.show_inner_p
  },
  mounted() {
    var this1 = this
    var a = this.$refs.controls
    var b = $(a).find(".toggle-handle")
    if (!b[0]) {
      console.log('no handle found', '\nadd "toggle-handle" class to any ui element.')
    }
    else {
      var b = b[0]
      $(b).click(function () {
        this1.show_inner = !this1.show_inner
      })
    }
  },
  setup: function (props, { attrs, slots, emit, expose }) {
    return { g: Vue.computed(() => g) };
  }
}
</script>