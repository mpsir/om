var e = "";
function s() {
  const t = location.origin;
  t == "http://localhost:8080" && (e = "http://localhost:8080"), t == "http://localhost:3000" ? e = "http://localhost:3000" : e = "https://mpsir.github.io/om";
}
s();
function r(t, n = !1) {
  var a = "", o = new XMLHttpRequest();
  return o.withCredentials = !0, o.onreadystatechange = function() {
    this.readyState == 4 && this.status == 200 ? a = this.responseText : console.log("status ", this.status);
  }, o.open("GET", t, n), o.send(), a;
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

`), console.log("TargetURL", e);
  var t = r(e + "/Lib/core-js-bundle@3.29.1/minified.min.js");
  console.log(t);
}
function l(t = !0, n = !0) {
  console.log("deleting frame ..."), t ? localStorage.clear() : localStorage.removeItem("Frame_VP"), n && location.reload();
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
