var g = globalThis;
function create_script(file_path, isAsync, callback) {
	const script = document.createElement('script');
	script.setAttribute('src', file_path);
	script.setAttribute('async', isAsync + '');
	script.onload = function handleScriptLoaded() {
		if (callback != null) {
			callback();
		}
	};
	script.onerror = function handleScriptError() {
		console.log('error loading script', file_path);
	};
	document.body.appendChild(script);
}
g.f = {
	// window.location.hostname.search("github.io")
	c: async function () { },
	IsGithubHosted: function () {
		if (window.location.hostname.search('github.io') == -1) {
			return false;
		}
		return true;
	},
	add2: function () {
		g.db.friends.add({
			name: 'a2',
			age: 566
		});
	},
	addDB: function () {
		g.db = new Dexie('myDatabase');
		db.version(1).stores({
			funs: '++id, name, value',
			options: '++id, name, value',
			mixins: '++id, name, value',
			composable: '++id, name, value',
			templates: '++id, name, value',
			pages: '++id, name, value',
			comps: '++id, name, value'
		});
		// g.db.functions
		// g.db.friends.add({
		// 	name: 'a1',
		// 	age: 5,
		//   });
	},
	GetHighestZ: function () {
		return Math.max.apply(
			null,
			$.map($('body *'), function (e, n) {
				if ($(e).css('position') != 'static')
					return parseInt($(e).css('z-index')) || 1;
			})
		);
	},
	start: async function () {
		var script_path = '/Frame/JS/F.js';
		if (g.f.IsGithubHosted()) {
			script_path = 'https://mpsir.github.io/om' + script_path;
		}
		create_script(script_path, (isAsync = false), function () { });

		g.f.addDB();
		g.f.Boot();
	},
	GetPageName: function () {
		const queryString = window.location.search;
		if (queryString == '') {
			return 'home';
		}
		const urlParams = new URLSearchParams(queryString);
		const p = urlParams.get('p');
		if (!p) {
			return 'home';
		} else {
			return p;
		}
		return 'home';
	},
	parse: function (s) {
		return JSON.parse(s);
	},
	string: function (s) {
		return JSON.stringify(s);
	},
	pstring: function (data) {
		return JSON.parse(JSON.stringify(data));
	},
	AppReBoot: function () {
		g.App.unmount();
		Boot();
	},
	GetPageObject: function (PageName) {
		var FoundPage = g.d.Pages.find(p => {
			return p.name == PageName;
		});
		if (FoundPage) {
			return FoundPage;
		} else {
			return g.d.Pages.find(p => {
				return p.name == 'home';
			});
		}
	},
	ArrayUp: function (Arr, INo) { },
	ArrayDn: function (Arr, INo) { },
	ArrayDup: function (Arr, INo) { },
	ArrayDel: function (Arr, INo) { },
	ArrayMoveTo: function (Arr, INo) { },
	ArrToObject: function () { },
	ObjectToArr: function (obj1) {
		var r = Object.entries(obj1);
		return r;
	},
	CreateApp: function (App, DomTarget) {
		console.log('App', App);
		var a = Vue.createApp(App);
		{
			a.use(window['VueShortkey']);
			a.use(Quasar);
			a.use(vdrag, {});
			a.use(window['v-resizable']);
		}
		{
			// directives
			a.directive('drag-resize', {
				// called before bound element's attributes
				// or event listeners are applied
				created(el, binding, vnode, prevVnode) {
					// g.a = vnode
					// see below for details on arguments
				},
				// called right before the element is inserted into the DOM.
				beforeMount(el, binding, vnode, prevVnode) { },
				// called when the bound element's parent component
				// and all its children are mounted.
				mounted(el, binding, vnode, prevVnode) { },
				// called before the parent component is updated
				beforeUpdate(el, binding, vnode, prevVnode) { },
				// called after the parent component and
				// all of its children have updated
				updated(el, binding, vnode, prevVnode) { },
				// called before the parent component is unmounted
				beforeUnmount(el, binding, vnode, prevVnode) { },
				// called when the parent component is unmounted
				unmounted(el, binding, vnode, prevVnode) { }
			});
		}
		{
			// comps
			a.component('draggable', window['vue3-draggable']);
			//a.component('v-select', window['vue-select']);
			a.component('m-comp-1', {
				data() {
					return { d1: 1 };
				},
				template: `<div> 
				<h1>this is m-comp-1</h1>
				d1 {{ d1 }}
				</div>`
			});
			a.component('m-edit-funs', {
				setup: function (props, { attrs, slots, emit, expose }) {
					return {
						funs: VueUse.useObservable(
							Dexie.liveQuery(() => db.funs.toArray())
						),
						g: Vue.computed(() => g)
					};
				},
				template: `
					<div v-if="false">
						<m-editor format_on_start="true" language='json' :val="g.f.string(g.f)"></m-editor>
					</div>
					<div v-if="true" v-for="(value, key, index) in g.f">
					<p>
					<h6>{{ key }}</h6>
					{{ typeof value }}, <br/>
					{{ typeof g.JSON.parse(value) }}
					<m-editor v-if="false" format_on_start="true" language='javascript' 
						:val="g.f.string(value)"></m-editor>

					</p>
						<m-editor v-if="false" format_on_start="true" language='json' :val="g.f.string(g.f)"></m-editor>
					</div>
					`
			});
			a.component('m-editor', {
				setup: function (props, { attrs, slots, emit, expose }) {
					return {
						editor: {},
						g: Vue.computed(() => g),
						update_editor: function () {
							const contentHeight = this.editor.getModel().getLineCount() * 19;
							$(this.$refs.m_editor).css('height', contentHeight + 'px');
							this.editor.layout();
						}
					};
				},
				props: {
					val: { type: String, required: true }
				},
				template: `
				<div style="border:1px dashed darkgrey">
					<div ref="m_editor" style="min-height:28px;">
					</div>
				</div>
				`,
				mounted() {
					this.editor = g.monaco.editor.create(this.$refs.m_editor, {
						value: this.val,
						language: this.$attrs.language || 'json',
						readOnly: false,
						minimap: { enabled: false }
					});
					setTimeout(() => { this.update_editor() }, 100);
					if (JSON.parse(this.$attrs.format_on_start || true)) {
						setTimeout(() => { this.editor.getAction('editor.action.formatDocument').run() }, 500);
					}
					this.editor.getModel().onDidChangeContent(event => { this.update_editor() });
				}
			});
		}
		return a.mount(DomTarget);
	},
	BootEditor: function () {
		g.AppEditor = g.f.CreateApp(
			g.f.pstring(g.d.EditorObj.Vue),
			'#editor-dom-wrapper'
		);
	},
	Boot: function () {
		var PageObject = g.f.GetPageObject(g.f.GetPageName());
		if (PageObject) {
			PageObject.Vue.template = g.f.ResolveTemplate(PageObject.Vue.template);

			g.App = g.f.CreateApp(g.f.pstring(PageObject.Vue), '#page-dom-wrapper');
		} else {
			console.log('Page Not Found: ', g.f.GetPageName());
		}
		//g.f.BootEditor();
	},
	ResolveTemplate: function (template) {
		if (typeof template == 'string') {
			return template;
		}
		return template;
	}
};

g.r = {
	PageName: g.f.GetPageName()
};

g.d = {
	Templates: [],
	Pages: [
		{
			name: 'home',
			gcomps: [],
			Vue: {
				setup: function (props, { attrs, slots, emit, expose }) {
					const leftDrawerOpen = Vue.ref(false);
					const rightDrawerOpen = Vue.ref(false);
					return {
						tab: Vue.ref('mails'),
						leftDrawerOpen,
						toggleLeftDrawer() {
							leftDrawerOpen.value = !leftDrawerOpen.value;
						},
						rightDrawerOpen,
						toggleRightDrawer() {
							rightDrawerOpen.value = !rightDrawerOpen.value;
						}
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
				created: function () { },
				computed: {
					g: function () {
						return globalThis;
					}
				}
			}
		},
		{
			name: 'admin',
			gcomps: [],
			Vue: {
				setup: function (props, { attrs, slots, emit, expose }) {
					return {
						tab: Vue.ref('Funs')
					};
				},
				template: `
				<q-layout view="hHh lpR fFf">
				  <q-header elevated class="bg-primary text-white" height-hint="98">
					<q-tabs v-model="tab">
						<q-tab name="F" label="F" :no-caps="true" />
						<q-tab name="Bkp" label="Bkp" :no-caps="true" />
						<q-tab name="Pages" label="Pages" :no-caps="true" />
						<q-tab name="Comps" label="Comps" :no-caps="true" />
						<q-tab name="Options" label="Options" :no-caps="true" />
						<q-tab name="Mixins" label="Mixins" :no-caps="true" />
						<q-tab name="Composable" label="Composable" :no-caps="true" />
						<q-tab name="Templates" label="Templates" :no-caps="true" />
					</q-tabs>
				  </q-header>
			  
				  <q-page-container>
					<q-tab-panels v-model="tab">

					<q-tab-panel name="Funs">
							<div class="text-h4 q-mb-md">Functions</div>
							<p>
							<m-edit-funs>
							</m-edit-funs>
							</p>
					</q-tab-panel>

						<q-tab-panel name="Pages">
							<div class="text-h4 q-mb-md">Pages</div>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
						</q-tab-panel>
						<q-tab-panel name="Comps">
							<div class="text-h4 q-mb-md">Comps</div>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
						</q-tab-panel>

						

						<q-tab-panel name="Options">
							<div class="text-h4 q-mb-md">Opts</div>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
						</q-tab-panel>
						
						<q-tab-panel name="Mixins">
							<div class="text-h4 q-mb-md">Mixins</div>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
						</q-tab-panel>

						<q-tab-panel name="Composable">
							<div class="text-h4 q-mb-md">Composable</div>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
						</q-tab-panel>


						

						<q-tab-panel name="Templates">
							<div class="text-h4 q-mb-md">Templates</div>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
						</q-tab-panel>

						

						<q-tab-panel name="Bkp">
							<div class="text-h4 q-mb-md">BkpRestore</div>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
							<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
						</q-tab-panel>

					</q-tab-panels>

				  </q-page-container>
				</q-layout>
        `,
				created: function () { },
				computed: {
					g: function () {
						return globalThis;
					}
				},
				components: {}
			}
		}
	],
	Components: [],
	Themes: [],
	Options: [],
	EditorObj: {
		name: 'home',
		gcomps: [],
		Vue: {
			data: function () {
				return {};
			},
			methods: {
				print: function (val) { }
			},
			setup: function (props, { attrs, slots, emit, expose }) {
				return {
					isB: true,
					x,
					y,
					friends: VueUse.useObservable(
						Dexie.liveQuery(() => db.friends.toArray())
					)
				};
			},
			template: `
<div style="z-index:10000; min-width:25%; min-height:25%; position:absolute; top:0%; left:0%; border:1px solid black; border-radius:3px">
		<button @click="isB = !isB">isB</button>
		<br/>	{{friends}} <br/>
		<button @click="g.f.add2()">
		add 
		</button>
</div>

<m-comp-1 v-if="false" v-drag-resize="isB">
	  ...

</m-comp-1>      
    
    
   `,
			created: function () { },
			computed: {
				g: function () {
					return globalThis;
				}
			}
		}
	}
};
