var n = "";
function r() {
  const e = location.origin;
  e == "http://localhost:8080" || e == "http://localhost:3000" ? n = "http://localhost:8080" : n = "http://super1mpsir-57484.portmap.host:57484";
}
r();
function s(e, o = !1) {
  var a = "", t = new XMLHttpRequest();
  return t.withCredentials = !0, t.onreadystatechange = function() {
    this.readyState == 4 && this.status == 200 ? a = this.responseText : console.log("status ", this.status);
  }, t.open("GET", e, o), t.send(), a;
}
var i = {
  Version: 3
};
function c() {
  return !!localStorage.getItem("Frame_VP");
}
function g() {
  return localStorage.getItem("Frame_VP") ? JSON.parse(localStorage.getItem("Frame_VP")).Version !== i.Version : !1;
}
async function u() {
  console.clear(), console.log(`Upgrading

`), l();
}
async function p() {
  console.log(`installing ...

`), console.log("TargetURL", n);
  var e = s(n + "/Lib/core-js-bundle@3.29.1/minified.min.js");
  console.log(e);
}
function l(e = !0, o = !0) {
  console.log("deleting frame ..."), e ? localStorage.clear() : localStorage.removeItem("Frame_VP"), o && location.reload();
}
globalThis.AppDelete = l;
async function f() {
  console.log(`Start : 
1.Loading Libraries ... 

`);
}
globalThis.AppStart = async function() {
  console.log(`
App started ...

`), c() || await p(), g() && await u(), await f();
};
