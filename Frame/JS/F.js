/*
    cycle.js
    2021-05-31

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    This code should be minified before deployment.
    See https://www.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

// The file uses the WeakMap feature of ES6.

/*jslint eval */

/*property
    $ref, decycle, forEach, get, indexOf, isArray, keys, length, push,
    retrocycle, set, stringify, test
*/

if (typeof JSON.decycle !== "function") {
    JSON.decycle = function decycle(object, replacer) {
        "use strict";

// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form

//      {"$ref": PATH}

// where the PATH is a JSONPath string that locates the first occurance.

// So,

//      var a = [];
//      a[0] = a;
//      return JSON.stringify(JSON.decycle(a));

// produces the string '[{"$ref":"$"}]'.

// If a replacer function is provided, then it will be called for each value.
// A replacer function receives a value and returns a replacement value.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child element or
// property.

        var objects = new WeakMap();     // object to path mappings

        return (function derez(value, path) {

// The derez function recurses through the object, producing the deep copy.

            var old_path;   // The path of an earlier occurance of value
            var nu;         // The new object or array

// If a replacer function was provided, then call it to get a replacement value.

            if (replacer !== undefined) {
                value = replacer(value);
            }

// typeof null === "object", so go on if this value is really an object but not
// one of the weird builtin objects.

            if (
                typeof value === "object"
                && value !== null
                && !(value instanceof Boolean)
                && !(value instanceof Date)
                && !(value instanceof Number)
                && !(value instanceof RegExp)
                && !(value instanceof String)
            ) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a {"$ref":PATH} object. This uses an
// ES6 WeakMap.

                old_path = objects.get(value);
                if (old_path !== undefined) {
                    return {$ref: old_path};
                }

// Otherwise, accumulate the unique value and its path.

                objects.set(value, path);

// If it is an array, replicate the array.

                if (Array.isArray(value)) {
                    nu = [];
                    value.forEach(function (element, i) {
                        nu[i] = derez(element, path + "[" + i + "]");
                    });
                } else {

// If it is an object, replicate the object.

                    nu = {};
                    Object.keys(value).forEach(function (name) {
                        nu[name] = derez(
                            value[name],
                            path + "[" + JSON.stringify(name) + "]"
                        );
                    });
                }
                return nu;
            }
            return value;
        }(object, "$"));
    };
}


if (typeof JSON.retrocycle !== "function") {
    JSON.retrocycle = function retrocycle($) {
        "use strict";

// Restore an object that was reduced by decycle. Members whose values are
// objects of the form
//      {$ref: PATH}
// are replaced with references to the value found by the PATH. This will
// restore cycles. The object will be mutated.

// The eval function is used to locate the values described by a PATH. The
// root object is kept in a $ variable. A regular expression is used to
// assure that the PATH is extremely well formed. The regexp contains nested
// * quantifiers. That has been known to have extremely bad performance
// problems on some browsers for very long strings. A PATH is expected to be
// reasonably short. A PATH is allowed to belong to a very restricted subset of
// Goessner's JSONPath.

// So,
//      var s = '[{"$ref":"$"}]';
//      return JSON.retrocycle(JSON.parse(s));
// produces an array containing a single element which is the array itself.

        var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

        (function rez(value) {

// The rez function walks recursively through the object looking for $ref
// properties. When it finds one that has a value that is a path, then it
// replaces the $ref object with a reference to the value that is found by
// the path.

            if (value && typeof value === "object") {
                if (Array.isArray(value)) {
                    value.forEach(function (element, i) {
                        if (typeof element === "object" && element !== null) {
                            var path = element.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(element);
                            }
                        }
                    });
                } else {
                    Object.keys(value).forEach(function (name) {
                        var item = value[name];
                        if (typeof item === "object" && item !== null) {
                            var path = item.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[name] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    });
                }
            }
        }($));
        return $;
    };
}


var g = globalThis;

g.f = {
	GetHighestZ() {
		return Math.max.apply(
			null,
			$.map($('body *'), function(e, n) {
				if ($(e).css('position') != 'static')
					return parseInt($(e).css('z-index')) || 1;
			})
		);
	},
	start() {
		g.f.add_monaco();
		g.f.Boot();
	},
	GetPageName() {
		const queryString = window.location.search;
		if (queryString == '') {
			return 'Home';
		}
		const urlParams = new URLSearchParams(queryString);
		const p = urlParams.get('p');
		if (!p) {
			return 'Home';
		} else {
			return p;
		}
		return 'Home';
	},
	parse: JSONF.parse,
	string: JSONF.stringify,
	pstring: function(data) {
		return JSONF.parse(JSONF.stringify(data));
	},
	AppReBoot() {
		g.App.unmount();
		Boot();
	},
	GetPageObject(PageName) {
		var FoundPage = g.d.Pages.find(p => {
			return p.name == PageName;
		});
		return FoundPage;
	},
	ArrayUp(Arr, INo) {},
	ArrayDn(Arr, INo) {},
	ArrayDup(Arr, INo) {},
	ArrayDel(Arr, INo) {},
	ArrayMoveTo(Arr, INo) {},
	ArrToObject() {},
	ObjectToArr() {},
	add_monaco() {
		const script = document.createElement('script');
		var a = 'https://mpsir.github.io/om';
		script.setAttribute(
			'src',
			a + '/node_modules/monaco-editor/min/vs/loader.js'
		);
		script.setAttribute('async', 'false');
		script.onload = function handleScriptLoaded() {
			// console.log(require);
			require.config({
				paths: { vs: a + '/node_modules/monaco-editor/min/vs' }
			});
		};
		script.onerror = function handleScriptError() {
			console.log('error loading script');
		};
		document.body.appendChild(script);
	},
	CreateApp(App, DomTarget) {
		//console.log(App, 'App');
		var a = Vue.createApp(App);
		{
			a.use(window['VueShortkey']);
			a.use(Quasar);
			a.use(vdrag, {
				// global configuration
			});
			a.use(window['v-resizable']);
		}
		{
			// directives
			a.directive('drag-resize', {
				// called before bound element's attributes
				// or event listeners are applied
				created(el, binding, vnode, prevVnode) {
					//console.log(binding);

					// console.log('vnode', vnode);
					// g.a = vnode
					 
					// console.log('vnode', JSON.stringify(vnode));
					// see below for details on arguments
				},
				// called right before the element is inserted into the DOM.
				beforeMount(el, binding, vnode, prevVnode) {
					//console.log(binding);
					
				},
				// called when the bound element's parent component
				// and all its children are mounted.
				mounted(el, binding, vnode, prevVnode) {},
				// called before the parent component is updated
				beforeUpdate(el, binding, vnode, prevVnode) {
					console.log(binding);

				},
				// called after the parent component and
				// all of its children have updated
				updated(el, binding, vnode, prevVnode) {
					console.log(binding);
					
				},
				// called before the parent component is unmounted
				beforeUnmount(el, binding, vnode, prevVnode) {},
				// called when the parent component is unmounted
				unmounted(el, binding, vnode, prevVnode) {}
			});
		}
		{
			// comps
			a.component('draggable', window['vue3-draggable']);
			a.component('v-select', window['vue-select']);
			a.component('m-comp-1', {
				data(){
					return { d1:1 }
				},
				template:`<div> 
				<h1>this is m-comp-1</h1>
				d1 {{ d1 }}
				</div>`
			});
		}
		return a.mount(DomTarget);
	},
	BootEditor() {
		g.AppEditor = g.f.CreateApp(
			g.f.pstring(g.d.EditorObj.Vue),
			'#editor-dom-wrapper'
		);
	},
	Boot() {
		var PageObject = g.f.GetPageObject(g.f.GetPageName());
		if (PageObject) {
			PageObject.Vue.template = g.f.ResolveTemplate(PageObject.Vue.template);
			//console.log('PageObject', PageObject);
			// console.log('template', PageObject.Vue.template);
			// g.App = g.f.CreateApp(g.f.pstring(PageObject.Vue), '#page-dom-wrapper');
		} else {
			console.log('Page Not Found: ', g.f.GetPageName());
		}
		g.f.BootEditor();
	},
	ResolveTemplate(template) {
		if (typeof template == 'string') {
			return template;
		}
		//console.log('template', template);
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
			name: 'Home',
			gcomps: [],
			Vue: {
				setup() {
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
				created() {
					// console.log(55);
					//console.log(this.$toast.add)
				},
				computed: {
					g() {
						return globalThis;
					}
				}
			}
		}
	],
	Components: [],
	Themes: [],
	Options: [],
	EditorObj: {
		name: 'Home',
		gcomps: [],
		Vue: {
			data() {
				return {};
			},
			methods: {
				print(val) {
					console.log(val);
				}
			},
			setup() {
				const { x, y } = VueUse.useMouse()
				return { isB:true, x, y };
			},
			template: `
<div style="z-index:10000; min-width:25%; min-height:25%; position:absolute; top:0%; left:0%; border:1px solid black; border-radius:3px">
		<button @click="isB = !isB">isB</button>
		{{ x }}
</div>

<m-comp-1 v-drag-resize="isB">
	  ...

</m-comp-1>      
    
    
   `,
			created() {},
			computed: {
				g() {
					return globalThis;
				}
			}
		}
	}
};
