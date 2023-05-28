<template>
    <div>
        <button @click="isOpened = !isOpened" class="btn-hide-1">
            {{ Array.isArray(flowValue) ? '[' : '{' }}
        </button>
        <div v-if="isOpened" class="q-ml-sm">
            <array-edit :objType="'array'" :modelValue="g.f.ArrayToKeyArray(flowValue)" v-if="Array.isArray(flowValue)"
                @update:model-value="flowValue = g.f.KeyArrayToArray($event); sendModelValue(); ">
            </array-edit>
            <array-edit :objType="'object'" :modelValue="g.f.objectToKeyArray(flowValue)" v-else
                @update:model-value="flowValue = g.f.KeyArrayToObject($event); sendModelValue()">
            </array-edit>
        </div>
        <button @click="isOpened = !isOpened" class="btn-hide-1">
            {{ Array.isArray(flowValue) ? ']' : '}' }}
        </button>
    </div>
</template>
    
<script>
export default {
    data() { return { flowValue: null, isOpened: this.isOpen } },
    setup: function (props, { attrs, slots, emit, expose }) {
        return {
            g: Vue.computed(() => g)
        };
    },
    props: {
        modelValue: {
            type: [Object, Array],
            required: true
        },
        isOpen: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    emits: ['update:modelValue',],
    created() { this.updateFlowValue() },
    watch: {
        modelValue: {
            handler: function (newValue, oldValue) {
                if (g.f.PS(newValue) != g.f.PS(oldValue)) { this.updateFlowValue() }
            },
            deep: true
        }
    },
    methods: {
        updateFlowValue: function (modelValue = this.modelValue) {
            this.flowValue = g.f.PS(modelValue)
        },
        sendModelValue: function (flowValue = this.flowValue) {
            // console.log( "sendModelValue in JEdit", g.f.PS(flowValue));
            this.$emit('update:modelValue', g.f.PS(flowValue))
        }
    }
}
</script>