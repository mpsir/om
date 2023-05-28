<template>
    <div v-bind="$attrs">
        <pre>{{ flowValue }}</pre>
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
            type:Array,
            required:true
        }
    },
    emits: ['update:modelValue',],
    created() { this.updateFlowValue() },
    watch: {
        modelValue: {
            handler: function (newValue, oldValue) { this.updateFlowValue() },
            deep: true
        }
    },
    methods: {
        updateFlowValue: function (modelValue = this.modelValue) {
            this.flowValue = modelValue
        },
        sendModelValue: function (flowValue = this.flowValue) {
            this.$emit('update:modelValue', flowValue)
        }
    }
}
</script>