(function(e){typeof define=="function"&&define.amd?define(e):e()})(function(){"use strict";var e="";function s(){const t=location.origin;t=="http://localhost:8080"?e="http://localhost:8080":t=="http://localhost:3000"?e="http://localhost:3000":e="https://mpsir.github.io/om"}s();function i(t,o=!1){var l="",n=new XMLHttpRequest;return n.withCredentials=!0,n.onreadystatechange=function(){this.readyState==4&&this.status==200?l=this.responseText:console.log("status ",this.status)},n.open("GET",t,o),n.send(),l}var r={Version:3};function c(){return!!localStorage.getItem("Frame_VP")}function g(){return localStorage.getItem("Frame_VP")?JSON.parse(localStorage.getItem("Frame_VP")).Version!==r.Version:!1}async function u(){console.clear(),console.log(`Upgrading

`),a()}async function f(){console.log(`installing ...

`),console.log("TargetURL",e);var t=i(e+"/Lib/core-js-bundle@3.29.1/minified.min.js");console.log(t)}function a(t=!0,o=!0){console.log("deleting frame ..."),t?localStorage.clear():localStorage.removeItem("Frame_VP"),o&&location.reload()}globalThis.AppDelete=a;async function p(){console.log(`Start : 
1.Loading Libraries ... 

`)}globalThis.AppStart=async function(){console.log(`
App started ...

`),c()||await f(),g()&&await u(),await p()}});
