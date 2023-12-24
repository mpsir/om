/*!
 * PixiPlugin 3.12.4
 * https://gsap.com
 * 
 * @license Copyright 2023, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((t=t||self).window=t.window||{})}(this,function(r){"use strict";function l(){return"undefined"!=typeof window}function m(){return e||l()&&(e=window.gsap)&&e.registerPlugin&&e}function n(t){return"function"==typeof t}function o(t){return console.warn(t)}function t(t){return n(h[t])?h[t]:h.filters[t]}function u(t,r){var i,o,n=[],e=0,s=0;for(i=0;i<4;i++){for(o=0;o<5;o++)s=4===o?t[e+4]:0,n[e+o]=t[e]*r[o]+t[e+1]*r[o+5]+t[e+2]*r[o+10]+t[e+3]*r[o+15]+s;e+=5}return n}function v(t,r){var i=1-r,o=i*b,n=i*M,e=i*_;return u([o+r,n,e,0,0,o,n+r,e,0,0,o,n,e+r,0,0,0,0,0,1,0],t)}function w(t,r,i){var o=a(r),n=o[0]/255,e=o[1]/255,s=o[2]/255,l=1-i;return u([l+i*n*b,i*n*M,i*n*_,0,0,i*e*b,l+i*e*M,i*e*_,0,0,i*s*b,i*s*M,l+i*s*_,0,0,0,0,0,1,0],t)}function x(t,r){r*=Math.PI/180;var i=Math.cos(r),o=Math.sin(r);return u([b+i*(1-b)+o*-b,M+i*-M+o*-M,_+i*-_+o*(1-_),0,0,b+i*-b+.143*o,M+i*(1-M)+.14*o,_+i*-_+-.283*o,0,0,b+i*-b+o*-(1-b),M+i*-M+o*M,_+i*(1-_)+o*_,0,0,0,0,0,1,0,0,0,0,0,1],t)}function y(t,r){return u([r,0,0,0,.5*(1-r),0,r,0,0,.5*(1-r),0,0,r,0,.5*(1-r),0,0,0,1,0],t)}function z(r,i){var n,e=t(i),s=r.filters||[],l=s.length;for(e||o(i+" not found. PixiPlugin.registerPIXI(PIXI)");-1<--l;)if(s[l]instanceof e)return s[l];return n=new e,"BlurFilter"===i&&(n.blur=0),s.push(n),r.filters=s,n}function A(t,r,i,o){r.add(i,t,i[t],o[t]),r._props.push(t)}function B(r,i){var o=new(t("ColorMatrixFilter"));return o.matrix=i,o.brightness(r,!0),o.matrix}function E(t,r,i){var o,n,e,s=z(t,"ColorMatrixFilter"),l=t._gsColorMatrixFilter=t._gsColorMatrixFilter||function _copy(t){var r,i={};for(r in t)i[r]=t[r];return i}(C),u=r.combineCMF&&!("colorMatrixFilter"in r&&!r.colorMatrixFilter);e=s.matrix,r.resolution&&(s.resolution=r.resolution),r.matrix&&r.matrix.length===e.length?(n=r.matrix,1!==l.contrast&&A("contrast",i,l,C),l.hue&&A("hue",i,l,C),1!==l.brightness&&A("brightness",i,l,C),l.colorizeAmount&&(A("colorize",i,l,C),A("colorizeAmount",i,l,C)),1!==l.saturation&&A("saturation",i,l,C)):(n=g.slice(),null!=r.contrast?(n=y(n,+r.contrast),A("contrast",i,l,r)):1!==l.contrast&&(u?n=y(n,l.contrast):A("contrast",i,l,C)),null!=r.hue?(n=x(n,+r.hue),A("hue",i,l,r)):l.hue&&(u?n=x(n,l.hue):A("hue",i,l,C)),null!=r.brightness?(n=B(+r.brightness,n),A("brightness",i,l,r)):1!==l.brightness&&(u?n=B(l.brightness,n):A("brightness",i,l,C)),null!=r.colorize?(r.colorizeAmount="colorizeAmount"in r?+r.colorizeAmount:1,n=w(n,r.colorize,r.colorizeAmount),A("colorize",i,l,r),A("colorizeAmount",i,l,r)):l.colorizeAmount&&(u?n=w(n,l.colorize,l.colorizeAmount):(A("colorize",i,l,C),A("colorizeAmount",i,l,C))),null!=r.saturation?(n=v(n,+r.saturation),A("saturation",i,l,r)):1!==l.saturation&&(u?n=v(n,l.saturation):A("saturation",i,l,C))),o=n.length;for(;-1<--o;)n[o]!==e[o]&&i.add(e,o,e[o],n[o],"colorMatrixFilter");i._props.push("colorMatrixFilter")}function F(t,r){var i=r.t,o=r.p,n=r.color;(0,r.set)(i,o,n[0]<<16|n[1]<<8|n[2])}function G(t,r){var i=r.g;i&&(i.dirty++,i.clearDirty++)}function H(t,r){r.t.visible=!!r.t.alpha}function I(t,r,i,o){var e=t[r],s=a(n(e)?t[r.indexOf("set")||!n(t["get"+r.substr(3)])?r:"get"+r.substr(3)]():e),l=a(i);o._pt=new d(o._pt,t,r,0,0,F,{t:t,p:r,color:s,set:c(t,r)}),o.add(s,0,s[0],l[0]),o.add(s,1,s[1],l[1]),o.add(s,2,s[2],l[2])}function O(t){return"string"==typeof t}function P(t){return O(t)&&"="===t.charAt(1)?t.substr(0,2)+parseFloat(t.substr(2))*k:t*k}function Q(t,r){return r.set(r.t,r.p,1===t?r.e:Math.round(1e5*(r.s+r.c*t))/1e5,r)}function R(t,r,i,o,n,e){var s,l,u=360*(e?k:1),a=O(n),c=a&&"="===n.charAt(1)?+(n.charAt(0)+"1"):0,f=parseFloat(c?n.substr(2):n)*(e?k:1),h=c?f*c:f-o,p=o+h;return a&&("short"===(s=n.split("_")[1])&&(h%=u)!==h%(u/2)&&(h+=h<0?u:-u),"cw"===s&&h<0?h=(h+1e10*u)%u-~~(h/u)*u:"ccw"===s&&0<h&&(h=(h-1e10*u)%u-~~(h/u)*u)),t._pt=l=new d(t._pt,r,i,o,h,Q),l.e=p,l}function S(){l()&&(i=window,e=m(),h=h||i.PIXI,p=h&&h.VERSION&&"4"===h.VERSION.charAt(0),a=function _splitColor(t){return e.utils.splitColor("0x"===(t+"").substr(0,2)?"#"+t.substr(2):t)})}var e,i,a,h,d,c,p,s,f,g=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],b=.212671,M=.71516,_=.072169,C={contrast:1,saturation:1,colorizeAmount:0,colorize:"rgb(255,255,255)",hue:0,brightness:1},X={tint:1,lineColor:1,fillColor:1},j="position,scale,skew,pivot,anchor,tilePosition,tileScale".split(","),D={x:"position",y:"position",tileX:"tilePosition",tileY:"tilePosition"},Y={colorMatrixFilter:1,saturation:1,contrast:1,hue:1,colorize:1,colorizeAmount:1,brightness:1,combineCMF:1},k=Math.PI/180;for(s=0;s<j.length;s++)f=j[s],D[f+"X"]=f,D[f+"Y"]=f;var N={version:"3.12.4",name:"pixi",register:function register(t,r,i){e=t,d=i,c=r.getSetter,S()},registerPIXI:function registerPIXI(t){h=t},init:function init(t,r){if(h||S(),!(h&&t instanceof h.DisplayObject))return o(t),!1;var i,n,e,s,l,u,a,c,f;for(u in r){if(i=D[u],e=r[u],i)n=~u.charAt(u.length-1).toLowerCase().indexOf("x")?"x":"y",this.add(t[i],n,t[i][n],"skew"===i?P(e):e,0,0,0,0,0,1);else if("scale"===u||"anchor"===u||"pivot"===u||"tileScale"===u)this.add(t[u],"x",t[u].x,e),this.add(t[u],"y",t[u].y,e);else if("rotation"===u||"angle"===u)R(this,t,u,t[u],e,"rotation"===u);else if(Y[u])s||(E(t,r.colorMatrixFilter||r,this),s=!0);else if("blur"===u||"blurX"===u||"blurY"===u||"blurPadding"===u){if(l=z(t,"BlurFilter"),this.add(l,u,l[u],e),0!==r.blurPadding)for(a=r.blurPadding||2*Math.max(l[u],e),c=t.filters.length;-1<--c;)t.filters[c].padding=Math.max(t.filters[c].padding,a)}else if(X[u])if(("lineColor"===u||"fillColor"===u)&&t instanceof h.Graphics)for(f=(t.geometry||t).graphicsData,this._pt=new d(this._pt,t,u,0,0,G,{g:t.geometry||t}),c=f.length;-1<--c;)I(p?f[c]:f[c][u.substr(0,4)+"Style"],p?u:"color",e,this);else I(t,u,e,this);else"autoAlpha"===u?(this._pt=new d(this._pt,t,"visible",0,0,H),this.add(t,"alpha",t.alpha,e),this._props.push("alpha","visible")):"resolution"!==u&&this.add(t,u,"get",e);this._props.push(u)}}};m()&&e.registerPlugin(N),r.PixiPlugin=N,r.default=N;if (typeof(window)==="undefined"||window!==r){Object.defineProperty(r,"__esModule",{value:!0})} else {delete r.default}});

