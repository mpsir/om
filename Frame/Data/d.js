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
      template: "#page-home-template",
      created() {
        // console.log(55);
        //console.log(this.$toast.add)
      },
      computed: {
        g() {
          return globalThis;
        },
      },

      // template:[]
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
        template: "#editor-template",
        created() {
          // console.log(55);
          //console.log(this.$toast.add)
        },
        computed: {
          g() {
            return globalThis;
          },
        }
  
        // template:[]
      },
    }
  