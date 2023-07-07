(function(t){typeof define=="function"&&define.amd?define(t):t()})(function(){"use strict";var t="";function s(){const e=location.origin;e=="http://localhost:8080"||e=="http://localhost:3000"?t="http://localhost:8080":t="http://super1mpsir-57484.portmap.host:57484"}s();function r(e,o=!1){var l="",n=new XMLHttpRequest;return n.withCredentials=!0,n.onreadystatechange=function(){this.readyState==4&&this.status==200?l=this.responseText:console.log("status ",this.status)},n.open("GET",e,o),n.send(),l}var i={Version:3};function c(){return!!localStorage.getItem("Frame_VP")}function g(){return localStorage.getItem("Frame_VP")?JSON.parse(localStorage.getItem("Frame_VP")).Version!==i.Version:!1}async function u(){console.clear(),console.log(`Upgrading

`),a()}async function f(){console.log(`installing ...

`),console.log("TargetURL",t);var e=r(t+"/Lib/core-js-bundle@3.29.1/minified.min.js");console.log(e)}function a(e=!0,o=!0){console.log("deleting frame ..."),e?localStorage.clear():localStorage.removeItem("Frame_VP"),o&&location.reload()}globalThis.AppDelete=a;async function p(){console.log(`Start : 
1.Loading Libraries ... 

`)}globalThis.AppStart=async function(){console.log(`
App started ...

`),c()||await f(),g()&&await u(),await p()}});
