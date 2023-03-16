var g = globalThis;
g.f = {
  GetPageName() {
    const queryString = window.location.search;
    if (queryString == "") { return "Home" }
    const urlParams = new URLSearchParams(queryString);
    const p = urlParams.get("p");
    if (!p) { return "Home" } else { return p }
    return "Home";
  },
  parse: JSONF.parse,
  string: JSONF.stringify,
  pstring: function (data) { return JSONF.parse(JSONF.stringify(data)) },
  AppReBoot() {
    g.App.unmount();
    Boot();
  },
  GetPageObject(PageName) {
    var FoundPage = g.d.Pages.find((p) => { return p.name == PageName });
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
    script.setAttribute('src', '/node_modules/monaco-editor/min/vs/loader.js');
    script.setAttribute('async', 'false');
    script.onload = function handleScriptLoaded() {
      // console.log(require);
      require.config({ paths: { vs: '/node_modules/monaco-editor/min/vs' } });
    };
    script.onerror = function handleScriptError() { console.log('error loading script') };
    document.body.appendChild(script);
  },
  CreateApp(App, DomTarget) {
    console.log(App, 'App');
    var a = Vue.createApp(App);
    {
      a.use(window["VueShortkey"]);
      a.use(Quasar);
      a.use(vdrag, {
        // global configuration
      });
      a.use(Vue3DraggableResizable.default)
    }
    { // directives
    }
    { // comps
      a.component("draggable", window["vue3-draggable"]);
      a.component("v-select", window["vue-select"]);
    }
    return a.mount(DomTarget);
  },
  BootEditor(){
    g.AppEditor = g.f.CreateApp(g.f.pstring(g.d.EditorObj.Vue), "#editor-dom-wrapper");
  },
  Boot() {
    g.f.BootEditor()
    var PageObject = g.f.GetPageObject(g.f.GetPageName());
    if (PageObject) {
      //PageObject.Vue.template = g.f.ResolveTemplate(PageObject.Vue.template)
      //console.log('PageObject', PageObject);
      //console.log('template', PageObject.Vue.template);
      //g.App = g.f.CreateApp(g.f.pstring(PageObject.Vue), "#page-dom-wrapper");
    } else { console.log("Page Not Found: ", g.f.GetPageName()) }
  },
};
g.r = {
  PageName: g.f.GetPageName(),
};
g.d = {
  Templates: [],
  Pages: [],
  Components: [],
  Themes: [],
  Options: [],
};
