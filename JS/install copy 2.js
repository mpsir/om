g.ReturnInstall = function () {
    globalThis.install_db = {
        settings: [
            {
                name: "App",
                user: {
                    status: false,
                    name: "user_name",
                    pass: "user_password",
                    role: "",
                    balance: 0,
                    gender: 'male'
                },
                defaultLang: "unset"
            }
        ],
        pages: [
            {
                name: "Home",
                pageTitle: "Home",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                    <div v-if="g.r.settings[0].user.status"><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                       <div>
                            <logout v-if="g.r.settings[0].user.status"></logout>
                            <login v-else></login>
                       </div>
                       <div v-if="g.r.settings[0].user.status">
                            <button @click="g.f.PageChangeTo('Admin')">Admin</button>
                       </div>
                       <div v-if="g.r.settings[0].user.status">
                            <button @click="g.f.PageChangeTo('MyGame-1')">MyGame-1</button>
                       </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () {
                        return {
                        }
                    },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    components: {
                        login: "",
                        logout: "",
                        a77: {
                            template: 'a7'
                        }
                    },
                })
            },
            {
                name: "NotFound",
                pageTitle: "Page-Not-Found",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div class="q-my-sm">
                            Page 
                            <span style="color:blue"> {{ g.f.GetPageName() }} </span>
                            not found.
                        </div>
                        <div class="q-my-sm"> 
                            <a v-if="false" href="/">Home</a> 
                            <button @click="g.f.PageChangeTo('Home')">Home</button>
                        </div>
                        <div class="q-my-sm">  
                            <button @click="g.f.PageChangeTo('Admin')">Admin</button>
                        </div>
                    </div>
                    `,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () {
                        return {
                        }
                    },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) }
                })
            },
            {
                name: "Admin",
                pageTitle: "Admin",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div> Admin </div>
                        <div v-if="g.r.settings[0].user.status"><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Home')">Home</button>  </div>
                        <div> <button @click="g.f.PageChangeTo('Settings')">Settings</button> </div>
                        <div> <button @click="g.f.PageChangeTo('Pages')">Pages</button> </div>
                        <div> <button @click="g.f.PageChangeTo('Comps')">Comps</button> </div>
                        <div> <button @click="g.f.PageChangeTo('Directives')">Directives</button> </div>
                        <div> <button @click="g.f.PageChangeTo('Temps')">Temps</button> </div>
                        <div> <button @click="g.f.PageChangeTo('Mixins')">Mixins</button> </div>
                        <div> <button @click="g.f.PageChangeTo('Composables')">Composables</button> </div>                   
                        <div v-if="g.r.settings[0].user.role == 'super-admin'"> 
                            <a href="/Server.html">Server</a>
                            <button v-if="false" @click="g.f.PageChangeTo('Pages')">Pages</button> 
                        </div>                   
                        <div class="q-my-md"> <button @click="g.f.DeleteDB()">DeleteDB</button> </div>
                        <div class="q-my-sm">
                            <toggle-content :show_inner_p="false">
                                <template #control> <button class="toggle-handle">g.f</button> </template>
                                <div> 
                                    <j-edit :model-value="g.f.PS(g.f)" :isopen="true" @update:model-value="update_g_f(g.f.PS($event))"> </j-edit>
                                </div>
                            </toggle-content>
                        </div>
                        <div class="q-my-sm">
                            <toggle-content :show_inner_p="false">
                                <template #control> <button class="toggle-handle">g.r</button> </template>
                                <div> 
                                    <j-edit :model-value="g.f.PS(g.r)" :isopen="true" @update:model-value="update_g_r(g.f.PS($event))">  </j-edit>
                                </div>
                            </toggle-content>
                        </div>
                        <div class="q-my-sm">
                            <toggle-content :show_inner_p="true">
                                <template #control> <button class="toggle-handle">BackUp</button> </template>
                                <div> 
                                <div v-if="true">{{ ReturnBkp() }}</div>
                                <div> <button @click="ReturnBkp()">show/update bkp</button></div>
                                <div> <button @click="SendBkp()">send bkp to server</button></div>
                                
<pre>{{thisBkp}}</pre>
                                </div>
                            </toggle-content>
                        </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () {
                        return { thisBkp: "" }
                    },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    methods: {
                        update_g_r: function (data) {
                            var data = data
                            var a = Object.keys(data)
                            a.forEach(a_key => {
                                var b = `g.r.${a_key} = data.${a_key}`
                                eval(b)
                            });
                        },
                        update_g_f: function (data) {
                            var data = data
                            var a = Object.keys(data)
                            a.forEach(a_key => {
                                var b = `g.f.${a_key} = data.${a_key}`
                                eval(b)
                            });
                        },
                        ReturnBkp: async function () {
                            var settings = await g.db.settings.toArray()
                                settings[0].user = { 
                                    "status": false,
                                    "name": "user_name",
                                    "pass": "user_password",
                                    "role": "",
                                    "balance": 0,
                                    "gender": "male"
                                }
                                settings[0].defaultLang = "unset"
                                settings.forEach(setti => {
                                    delete setti.id
                                });
                            var pages = await g.db.pages.toArray()
                            pages.forEach(page => {
                                delete page.id
                            });
                            var comps = await g.db.comps.toArray()
                            comps.forEach(comp => {
                                delete comp.id
                            });

                            var Bkp = ""
                            Bkp += `g.ReturnInstall = function(){ globalThis.install_db = {\n\n`
                            Bkp += `settings:${g.f.S(settings)},

pages:${g.f.S(pages)},

comps:${g.f.S(comps)}

`
                            Bkp += `}}`
                            this.thisBkp = Bkp
                        },
                        SendBkp:function(){
                            g.socket.emit(
                                'msg',
                                {
                                    type: 'admin',
                                    subt_type: "UpdateBkp",
                                    data: this.thisBkp
                                }
                            )
                        }
                    }
                })
            },
            {
                name: "MyGame-1",
                pageTitle: "Game1",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div>
                            Game1
                        </div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Home')">Home</button>  </div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Admin')">Admin</button>  </div>
                        <div v-if="g.r.settings[0].user.status"><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                    </div>
                    `,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () {
                        return {
                        }
                    },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) }
                })
            },
            {
                name: "Pages",
                pageTitle: "Pages",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
        <div> Pages </div>
        <div><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
        <div class="q-my-sm">
            <button @click="g.f.PageChangeTo('Home')">Home</button>
            <button @click="g.f.PageChangeTo('Admin')" class="q-ml-sm">Admin</button>
        </div>
        <div class="q-my-sm">
            <button @click="g.db.pages.bulkPut(g.f.PS(g.r.pages))"> Update Pages </button>
        </div>
        <div class="q-my-md">
            <div v-for="(p, p_no) in g.f.PS(g.r.pages)" class="q-my-sm">
                <toggle-content :show_inner_p="p_no == 0 ? true : false">
                    <template #control>
                        <button class="toggle-handle">{{ p.name }}</button>
                    </template>
                    <edit-t
                        :model-value="g.f.P(g.r.pages[p_no].data)" 
                        :isopen="true"
                        @update:model-value="g.r.pages[p_no].data = g.f.S($event)"
                    ></edit-t>
                </toggle-content>
            </div>
        </div>
        <div>
            <toggle-content :show_inner_p="false">
                <template #control>
                    <button class="toggle-handle">Pages</button>
                </template>
                <div>
                    <j-edit :model-value="g.f.PS(g.r.pages)" :isopen="true"
                        @update:model-value="g.r.pages = g.f.PS($event)"> </j-edit>
                </div>
            </toggle-content>
        </div>
    </div>
                    `,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    components: {
                        "edit-t": ""
                    }
                })
            },
            {
                name: "Comps",
                pageTitle: "Comps",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div> Comps </div>
                        <div><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Home')">Home</button>  </div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Admin')">Admin</button>  </div>
                        <div class="q-my-sm"> 
                            <button @click="updateComps()">
                                Update Comps 
                            </button> 
                        </div>
                        <div class="q-my-md">
                            <div v-for="(p, p_no) in g.f.PS(g.r.comps)" class="q-my-sm">
                                <toggle-content :show_inner_p="p_no == 0 ? true : false">
                                    <template #control>
                                        <button class="toggle-handle">{{ p.name }}</button>
                                    </template>
                                    <edit-t
                                        :model-value="g.f.P(g.r.comps[p_no].data)" 
                                        :isopen="true"
                                        @update:model-value="g.r.comps[p_no].data = g.f.S($event)"
                                    ></edit-t>
                                </toggle-content>
                            </div>
                        </div>
                        <div> 
                            <div>
                                <j-edit :model-value="g.f.PS(g.r.comps)" :isopen="true" @update:model-value="g.r.comps = g.f.PS($event)"> </j-edit>
                            </div>
                        </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () { return {} },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    methods: {
                        updateComps: function () {
                            var a = g.f.PS(g.r.comps)
                            console.log(a);
                            g.db.comps.bulkPut(a);
                        }
                    },
                    components: {
                        "edit-t": ""
                    }
                })
            },
            {
                name: "Settings",
                pageTitle: "Settings",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div> Settings </div>
                        <div><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Home')">Home</button>  </div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Admin')">Admin</button>  </div>
                        <div> 
                        <div class="q-my-sm"> 
                            <button @click="updateSettings()">
                                Update Settings 
                            </button> 
                        </div>
                            <div>
                                <j-edit :model-value="g.f.PS(g.r.settings)" :isopen="true" @update:model-value="g.r.settings = g.f.PS($event)"> </j-edit>
                            </div>
                        </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () { return {} },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    methods: {
                        updateSettings: function () {
                            var a = g.f.PS(g.r.settings)
                            g.db.settings.bulkPut(a);
                        }
                    }
                })
            },
            {
                name: "Directives",
                pageTitle: "Directives",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div> Directives </div>
                        <div><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Home')">Home</button>  </div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Admin')">Admin</button>  </div>
                        <div> 
                        <div class="q-my-sm"> 
                            <button @click="updateDirectives()">
                                Update Directives 
                            </button> 
                        </div>
                            <div>
                                <j-edit :model-value="g.f.PS(g.r.directives)" :isopen="true" @update:model-value="g.r.directives = g.f.PS($event)"> </j-edit>
                            </div>
                        </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () { return {} },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    methods: {
                        updateDirectives: function () {
                            var a = g.f.PS(g.r.directives)
                            g.db.directives.bulkPut(a);
                        }
                    }
                })
            },
            {
                name: "Temps",
                pageTitle: "Temps",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div> Temps </div>
                        <div><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Home')">Home</button>  </div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Admin')">Admin</button>  </div>
                        <div v-if="g.r.settings[0].user.status"><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                        <div> 
                        <div class="q-my-sm"> 
                            <button @click="updateTemps()">
                                Update Temps 
                            </button> 
                        </div>
                            <div>
                                <j-edit :model-value="g.f.PS(g.r.temps)" :isopen="true" @update:model-value="g.r.temps = g.f.PS($event)"> </j-edit>
                            </div>
                        </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () { return {} },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    methods: {
                        updateTemps: function () {
                            var a = g.f.PS(g.r.temps)
                            g.db.temps.bulkPut(a);
                        }
                    }
                })
            },
            {
                name: "Mixins",
                pageTitle: "Mixins",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div> Mixins </div>
                        <div><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Home')">Home</button>  </div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Admin')">Admin</button>  </div>
                        <div> 
                        <div class="q-my-sm"> 
                            <button @click="updateMixins()">
                                Update Mixins 
                            </button> 
                        </div>
                            <div>
                                <j-edit :model-value="g.f.PS(g.r.mixins)" :isopen="true" @update:model-value="g.r.mixins = g.f.PS($event)"> </j-edit>
                            </div>
                        </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () { return {} },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    methods: {
                        updateMixins: function () {
                            var a = g.f.PS(g.r.mixins)
                            g.db.mixins.bulkPut(a);
                        }
                    }
                })
            },
            {
                name: "Composables",
                pageTitle: "Composables",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div> Composables </div>
                        <div><button @click="g.r.IsLive = ! g.r.IsLive">IsLive {{ g.r.IsLive }} </button></div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Home')">Home</button>  </div>
                        <div class="q-my-sm"> <button @click="g.f.PageChangeTo('Admin')">Admin</button>  </div>
                        <div> 
                        <div class="q-my-sm"> 
                            <button @click="updateComposables()">
                                Update Composables 
                            </button> 
                        </div>
                            <div>
                                <j-edit :model-value="g.f.PS(g.r.composables)" :isopen="true" @update:model-value="g.r.composables = g.f.PS($event)"> </j-edit>
                            </div>
                        </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () { return {} },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    methods: {
                        updateComposables: function () {
                            var a = g.f.PS(g.r.composables)
                            g.db.composables.bulkPut(a);
                        }
                    }
                })
            },
            {
                name: "SetDefaultLang",
                pageTitle: "SetDefaultLang",
                data: g.f.S({
                    template: `
                    <div class="page-app" style="display: none;">
                        <span v-if="false" class="material-icons" style="font-size: 24px;">face</span>
                        <div class="q-my-md">
                            <div> Please choose your default Language </div>
                            <div>
                                <button @click="setHindi()">Hindi</button>
                                <button class="q-ml-sm" @click="setEnglish()">English</button>
                            </div>
                        </div>
                        <div class="q-my-md">
                            <div> Please choose your default Language </div>
                            <div>
                                <button @click="setHindi()">Hindi</button>
                                <button class="q-ml-sm" @click="setEnglish()">English</button>
                            </div>
                        </div>
                    </div>`,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () { return {} },
                    mounted: function () { g.$(".page-app").css({ "display": "block" }) },
                    methods: {
                        setHindi: function () {
                            var settings = g.f.PS(g.r.settings)
                            settings[0].defaultLang = "Hindi"
                            g.db.settings.bulkPut(settings)
                            // g.r.settings[0].defaultLang = "Eng"
                            // g.console.log('setting lang as hindi')
                        },
                        setEnglish: function () {
                            var settings = g.f.PS(g.r.settings)
                            settings[0].defaultLang = "English"
                            g.db.settings.bulkPut(settings)
                            // g.r.settings[0].defaultLang = "Eng"
                            // g.console.log('setting lang as hindi')
                        }
                    }
                })
            },
        ],
        comps: [
            {
                name: "login",
                data: g.f.S({
                    template: `
                    <div>
                        <div class="q-my-sm"> <input v-model="uname" /> </div>    
                        <div class="q-my-sm"> <input v-model="upass" /> </div>    
                        <div class="q-my-sm"> <button @click="login_try()">Submit</button> </div>    
                    </div>
                    `,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () {
                        return {
                            uname: "uname",
                            upass: "password"
                        }
                    },
                    methods: {
                        login_try: function () {
                            g.socket.emit(
                                'msg',
                                {
                                    type: 'admin',
                                    subt_type: "logIn",
                                    data: {
                                        uname: this.uname,
                                        upass: this.upass
                                    }
                                }
                            )
                        }
                    },
                    components: {
                        a7: "",
                    }
                })
            },
            {
                name: "logout",
                data: g.f.S({
                    template: `
                    <div>
                        <div class="q-my-sm"> <button @click="logout_try()">Logout</button> </div>    
                    </div>
                    `,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () {
                        return {
                        }
                    },
                    methods: {
                        logout_try: function () { // logOut
                            g.socket.emit(
                                'msg',
                                {
                                    type: 'admin',
                                    subt_type: "logOut"
                                }
                            )
                        }
                    }
                })
            },
            {
                name: "a7",
                data: g.f.S({
                    template: `
                    <div>
                        this is a7   
                    </div>
                    `,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () {
                        return {
                        }
                    }
                })
            },
            {
                name: "edit-t",
                data: g.f.S({
                    template: `
                    <div>
                        this is edit-t <br/>
                        <a7></a7>
                    </div>
                    `,
                    setup: function (props, { attrs, slots, emit, expose }) {
                        return { g: Vue.computed(() => g) };
                    },
                    data: function () {
                        return {
                        }
                    },
                    props: {
                        modelValue: {
                            // type: "Array",
                            type: ["Array", "Object"],
                            required: true
                        },
                    },
                    components: {}
                })
            },
        ]
    }
}


