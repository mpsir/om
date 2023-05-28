<template>
    <div v-bind="$attrs" style="display: inline-block;">
        map
    </div>
</template>
    
<script>
export default {
    data() { return { flowValue: null } },
    setup: function (props, { attrs, slots, emit, expose }) {
        return {
            g: Vue.computed(() => g)
        };
    },
    props: {
        modelValue: {
            // type: Array,
            // required: true
        }
    },
    emits: ['update:modelValue',],
    created() { this.updateFlowValue() },
    watch: {
        modelValue: {
            handler: function (newValue, oldValue) {
                if (g.f.PS(newValue) != g.f.PS(oldValue)) {
                    this.updateFlowValue()
                }
            },
            deep: true
        }
    },
    methods: {
        updateFlowValue: function (modelValue = this.modelValue) {
            // this.flowValue = g.f.PS(modelValue)
        },
        sendModelValue: function (flowValue = this.flowValue) {
            // this.$emit('update:modelValue', g.f.PS(flowValue))
        }
    }
}
</script>