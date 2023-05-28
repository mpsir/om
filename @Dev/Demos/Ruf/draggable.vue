<template>
    <div v-bind="$attrs">
        <draggable v-if="app_ready" :handle="'.' + handleClass" ghost-class="ghost" v-model="flowValue" group="people" @start="drag = true"
            @end="drag = false; sendModelValue()" item-key="id">
            <template #item="{ element }">
                <div>

                    <span @dbl-click="test()" v-if="objType == 'object'" :class="handleClass">
                        {{ element.name }}
                    </span>

                        
                    <q-dialog v-model="alert5">
                        <q-card>
                            <q-card-section>
                                <div class="text-h6">alert5</div>
                            </q-card-section>

                        </q-card>
                    </q-dialog>

                    <span v-if="objType == 'array'" :class="handleClass">{{ element.id + 1 }}</span>
                    <span> : </span>

                    <edit-null v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                        v-if="g.f.getType(element.data) == 'null'"> null </edit-null>
                    <edit-undefined v-model="element.data"
                        @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                        v-if="g.f.getType(element.data) == 'undefined'"> undefined </edit-undefined>
                    <edit-string v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                        v-if="g.f.getType(element.data) == 'string'"> {{ element.data }} </edit-string>
                    <edit-number v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                        v-if="g.f.getType(element.data) == 'number'"> {{ element.data }} </edit-number>
                    <edit-boolean v-model="element.data"
                        @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
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
                    <edit-function v-model="element.data"
                        @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                        v-if="g.f.getType(element.data) == 'function'"> {{ element.data }} </edit-function>
                    <edit-regexp v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                        v-if="g.f.getType(element.data) == 'regexp'"> {{ element.data }} </edit-regexp>
                    <edit-bigint v-model="element.data" @update:modelValue="element.data = g.f.PS($event); sendModelValue()"
                        v-if="g.f.getType(element.data) == 'bigint'"> {{ element.data }}</edit-bigint>
                </div>
            </template>
        </draggable>
        <pre v-if="false" style="margin:0px">{{ g.f.S(flowValue) }}</pre>
    </div>
</template>
    
<script>
export default {
    data() { return { flowValue: null, comp_started: false, } },
    setup: function (props, { attrs, slots, emit, expose }) {
        return {
            alert5: false,
            g: Vue.computed(() => g),
            handleClass: g.f.generateUID(8),
            show_edit_name: false,
            app_ready:true
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
        test:function(){
            this.alert5 =  true
            this.app_ready = false
            setTimeout(() => {
                this.app_ready = true
            }, 1000);
            console.log(this.alert5);
        },
        updateFlowValue: function (modelValue = this.modelValue) {
            this.flowValue = g.f.PS(modelValue)
        },
        sendModelValue: function (flowValue = this.flowValue) {
            this.$emit('update:modelValue', g.f.PS(flowValue))
        }
    },
    mounted: function () {
        this.comp_started = true

    }
}
</script>