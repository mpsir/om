g.d.Pages = [
  {
    name: "Home",
    gcomps: [],
    Vue: {
      setup() {
        const leftDrawerOpen = Vue.ref(false);
        const rightDrawerOpen = Vue.ref(false);
        return {
          tab: Vue.ref("mails"),
          leftDrawerOpen,
          toggleLeftDrawer() {
            leftDrawerOpen.value = !leftDrawerOpen.value;
          },
          rightDrawerOpen,
          toggleRightDrawer() {
            rightDrawerOpen.value = !rightDrawerOpen.value;
          },
        };
      },
      template: `
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" ></q-btn>
          <q-toolbar-title>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            ShreeRam
          </q-toolbar-title>
          <q-btn dense flat round icon="menu" @click="toggleRightDrawer" ></q-btn>
        </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        left drawer
    </q-drawer>
    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
        right drawer
    </q-drawer>
    <q-page-container>
          page-body
    </q-page-container>
    <q-footer elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-toolbar-title class="flex">
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            <div style="margin-left: 16px; text-align: center;">ShreeRam</div>
          </q-toolbar-title>
        </q-toolbar>
    </q-footer>
  </q-layout>      
      `,
      created() {
        // console.log(55);
        //console.log(this.$toast.add)
      },
      computed: {
        g() {
          return globalThis;
        },
      }
    },
  },
];

g.d.EditorObj = 
    {
      name: "Home",
      gcomps: [],
      Vue: {
        data() {
          return { 
            x: 100,
            y: 100,
            h: 100,
            w: 100,
            active: false
          }
        },
        methods: {
          print(val) {
            console.log(val)
          }
        },
        setup() {
          return {
            
          };
        },
        template: `
        {{g.navigator.platform}}
    <div class="parent" style="width: 200px;
      height: 200px;
      position: absolute;
      top: 100px;
      left: 100px;
      border: 1px solid #000;
      user-select: none;
        ">
      <Vue3DraggableResizable
      :parent="false"
        :initW="110"
        :initH="120"
        v-model:x="x"
        v-model:y="y"
        v-model:w="w"
        v-model:h="h"
        v-model:active="active"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        This is a test example
      </Vue3DraggableResizable>
    </div>

    <div v-if="false" class="q-pa-md flex justify-center">
      <div style="max-width: 90%; width: 300px;">
        <q-intersection
          v-for="index in 60"
          :key="index"
          transition="flip-right"
          class="example-item"
        >
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                Q
              </q-avatar>
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Contact #{{ index }}</q-item-label>
              <q-item-label caption lines="1">some@email.com</q-item-label>
            </q-item-section>
  
            <q-item-section side>
              <q-icon name="chat_bubble" color="green" ></q-icon>
            </q-item-section>
          </q-item>
        </q-intersection>
      </div>
    </div>

    <div>div 1</div>
    <br/>
    <div v-if="false" v-drag style="width:100px; border:1px solid black; z-index: 5555; position: absolute; top: 0px;">ok</div>
    <br/>
    
    <div v-drag style="border:1px solid black; position: absolute;">
      drag me! 
      drag me! 
    </div>
    <br/>
    <br/>
    <div style="width:100px; border:1px solid black; ">div 2</div>
        `,
        created() {
          // console.log(55);
          //console.log(this.$toast.add)
        },
        computed: {
          g() {
            return globalThis;
          },
        }
      },
    }
  