<template>
    <div v-bind="$attrs">
        <div v-for="element in flowValue">

            <span @click="alert = true" v-if="objType == 'object'">
                {{ element.name }}
            </span>

            <div class="cursor-pointer">
                {{ element.name }}
                <q-popup-edit dark v-model="element.name" auto-save v-slot="scope">
                    <q-input dark v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                </q-popup-edit>
            </div>


            <span v-if="objType == 'array'">{{ element.id + 1 }}</span>
            <span> : </span>

            <edit-null v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'null'"> null </edit-null>
            <edit-undefined v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'undefined'"> undefined </edit-undefined>
            <edit-string v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'string'"> {{ element.data }} </edit-string>
            <edit-number v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'number'"> {{ element.data }} </edit-number>
            <edit-boolean v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'boolean'"> {{ element.data }} </edit-boolean>
            <edit-object v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'object'"> {{ element.data }} </edit-object>
            <edit-array v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'array'"> {{ element.data }} </edit-array>
            <edit-date v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'date'"> {{ element.data }} </edit-date>
            <edit-map v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'map'"> {{ element.data }} </edit-map>
            <edit-set v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'set'"> {{ element.data }} </edit-set>
            <edit-function v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'function'"> {{ element.data }} </edit-function>
            <edit-regexp v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'regexp'"> {{ element.data }} </edit-regexp>
            <edit-bigint v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                v-if="g.f.getType(element.data) == 'bigint'"> {{ element.data }}</edit-bigint>
        </div>
        <pre v-if="false" style="margin:0px">{{ g.f.S(flowValue) }}</pre>
    </div>
</template>
    
<script>
export default {
    data() { return { flowValue: null } },
    setup: function (props, { attrs, slots, emit, expose }) {
        return {
            g: Vue.computed(() => g),
            alert: Vue.ref(true),
        };
    },
    props: {
        modelValue: {
            type: Array,
            required: true
        },
        objType: {
            type: String,
            required: true
        }
    },
    emits: ['update:modelValue',],
    created() {
        this.updateFlowValue()
    },
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
            this.$emit('update:modelValue', g.f.PS(flowValue))
        }
    }
}
</script>