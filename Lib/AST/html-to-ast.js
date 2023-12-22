(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
const HtmlObj = require("html-to-ast")
globalThis.HtmlObj = HtmlObj
// browserify main.js -o bundle.js
},{"html-to-ast":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var htmlVoidElements = ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'frame', 'hr', 'image', 'img', 'input', 'isindex', 'keygen', 'link', 'menuitem', 'meta', 'nextid', 'param', 'source', 'track', 'wbr'];

var attrRE = /\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g;
var parseTag = function parseTag(tag) {
  var res = {
    type: 'tag',
    name: '',
    voidElement: false,
    attrs: {},
    children: []
  };
  var tagMatch = tag.match(/<\/?([^\s]+?)[/\s>]/);

  if (tagMatch) {
    res.name = tagMatch[1];
    res.voidElement = htmlVoidElements.includes(tagMatch[1]) || tag.charAt(tag.length - 2) === '/'; // handle comment tag

    if (res.name.startsWith('!--')) {
      var endIndex = tag.indexOf('-->');
      return {
        type: 'comment',
        comment: endIndex !== -1 ? tag.slice(4, endIndex) : ''
      };
    }
  }

  var reg = new RegExp(attrRE);
  var result = null;

  for (;;) {
    result = reg.exec(tag);

    if (result === null) {
      break;
    }

    if (!result[0].trim()) {
      continue;
    }

    if (result[1]) {
      var attr = result[1].trim();
      var arr = [attr, ''];

      if (attr.indexOf('=') > -1) {
        arr = attr.split('=');
      }

      res.attrs[arr[0]] = arr[1];
      reg.lastIndex--;
    } else if (result[2]) {
      res.attrs[result[2]] = result[3].trim().substring(1, result[3].length - 1);
    }
  }

  return res;
};

var tagRE = /<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g;
var whitespaceRE = /^\s*$/; // re-used obj for quick lookups of components

var empty = /*#__PURE__*/Object.create(null);
var parse = function parse(html, options) {
  if (options === void 0) {
    options = {};
  }

  options || (options = {});
  options.components || (options.components = empty);
  var result = [];
  var arr = [];
  var current;
  var level = -1;
  var inComponent = false; // handle text at top level

  if (html.indexOf('<') !== 0) {
    var end = html.indexOf('<');
    result.push({
      type: 'text',
      content: end === -1 ? html : html.substring(0, end)
    });
  } // @ts-ignore


  html.replace(tagRE, function (tag, index) {
    if (inComponent) {
      if (tag !== '</' + current.name + '>') {
        return '';
      } else {
        inComponent = false;
      }
    }

    var isOpen = tag.charAt(1) !== '/';
    var isComment = tag.startsWith('<!--');
    var start = index + tag.length;
    var nextChar = html.charAt(start);
    var parent;

    if (isComment) {
      var comment = parseTag(tag); // if we're at root, push new base node

      if (level < 0) {
        result.push(comment);
        return result;
      }

      parent = arr[level];

      if (parent && parent.children && Array.isArray(parent.children)) {
        parent.children.push(comment);
      }

      return result;
    }

    if (isOpen) {
      level++;
      current = parseTag(tag);

      if (current.type === 'tag' && current.name && options.components && options.components[current.name]) {
        current.type = 'component';
        inComponent = true;
      }

      if (!current.voidElement && !inComponent && nextChar && nextChar !== '<' && Array.isArray(current.children)) {
        current.children.push({
          type: 'text',
          content: html.slice(start, html.indexOf('<', start))
        });
      } // if we're at root, push new base node


      if (level === 0) {
        result.push(current);
      }

      parent = arr[level - 1];

      if (parent && parent.children) {
        parent.children.push(current);
      }

      arr[level] = current;
    }

    if (!isOpen || current.voidElement) {
      if (level > -1 && (current.voidElement || current.name === tag.slice(2, -1))) {
        level--; // move current up a level to match the end tag

        current = level === -1 ? result : arr[level];
      }

      if (!inComponent && nextChar !== '<' && nextChar) {
        // trailing text node
        // if we're at the root, push a base text node. otherwise add as
        // a child to the current node.
        parent = level === -1 ? result : arr[level].children; // calculate correct end of the content slice in case there's
        // no tag after the text node.

        var _end = html.indexOf('<', start);

        var content = html.slice(start, _end === -1 ? undefined : _end); // if a node is nothing but whitespace, collapse it as the spec states:
        // https://www.w3.org/TR/html4/struct/text.html#h-9.1

        if (whitespaceRE.test(content)) {
          content = ' ';
        } // don't add whitespace-only text nodes if they would be trailing text nodes
        // or if they would be leading whitespace-only text nodes:
        //  * end > -1 indicates this is not a trailing text node
        //  * leading node is when level is -1 and parent has length 0


        if (_end > -1 && level + parent.length >= 0 || content !== ' ') {
          if (parent && Array.isArray(parent)) {
            parent.push({
              type: 'text',
              content: content
            });
          }
        }
      }
    }
  });
  return result;
};

// function attrString(attrs) {
//   console.log('attrs', attrs)
//   // globalThis.alert(555)
//   var buff = [];

//   for (var key in attrs) {
//     buff.push(key + '="' + attrs[key] + '"');
//   }

//   if (!buff.length) {
//     return '';
//   }

//   return ' ' + buff.join(' ');
// }

function attrString(attrs) {
  var r = ""
  // console.log('attrs', attrs)
  for (const property in attrs) {
    r += " "
    if(attrs[property].length){
      // r += property + "=" + attrs[property]
      r += property + "=" + JSON.stringify(attrs[property])
      // r += property + "=" + g.f.S(attrs[property])
    }
    else { r += property }
  }
  

  return r
}

function _stringify(buff, doc) {
  switch (doc.type) {
    case 'text':
      return buff + doc.content;

    case 'tag':
      buff += '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + (doc.voidElement ? '/>' : '>');

      if (doc.voidElement) {
        return buff;
      }

      return buff + doc.children.reduce(_stringify, '') + '</' + doc.name + '>';

    case 'comment':
      buff += '<!--' + doc.comment + '-->';
      return buff;

    default:
      return '';
  }
}

var stringify = function stringify(doc) {
  return doc.reduce(function (token, rootEl) {
    return token + _stringify('', rootEl);
  }, '');
};

exports.htmlVoidElements = htmlVoidElements;
exports.parse = parse;
exports.stringify = stringify;


},{}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=["area","base","basefont","bgsound","br","col","command","embed","frame","hr","image","img","input","isindex","keygen","link","menuitem","meta","nextid","param","source","track","wbr"],t=/\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g,n=function(n){var r={type:"tag",name:"",voidElement:!1,attrs:{},children:[]},i=n.match(/<\/?([^\s]+?)[/\s>]/);if(i&&(r.name=i[1],r.voidElement=e.includes(i[1])||"/"===n.charAt(n.length-2),r.name.startsWith("!--"))){var s=n.indexOf("--\x3e");return{type:"comment",comment:-1!==s?n.slice(4,s):""}}for(var a=new RegExp(t),c=null;null!==(c=a.exec(n));)if(c[0].trim())if(c[1]){var o=c[1].trim(),m=[o,""];o.indexOf("=")>-1&&(m=o.split("=")),r.attrs[m[0]]=m[1],a.lastIndex--}else c[2]&&(r.attrs[c[2]]=c[3].trim().substring(1,c[3].length-1));return r},r=/<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g,i=/^\s*$/,s=Object.create(null);function a(e,t){switch(t.type){case"text":return e+t.content;case"tag":return e+="<"+t.name+(t.attrs?function(e){var t=[];for(var n in e)t.push(n+'="'+e[n]+'"');return t.length?" "+t.join(" "):""}(t.attrs):"")+(t.voidElement?"/>":">"),t.voidElement?e:e+t.children.reduce(a,"")+"</"+t.name+">";case"comment":return e+"\x3c!--"+t.comment+"--\x3e";default:return""}}exports.htmlVoidElements=e,exports.parse=function(e,t){void 0===t&&(t={}),t||(t={}),t.components||(t.components=s);var a,c=[],o=[],m=-1,l=!1;if(0!==e.indexOf("<")){var u=e.indexOf("<");c.push({type:"text",content:-1===u?e:e.substring(0,u)})}return e.replace(r,(function(r,s){if(l){if(r!=="</"+a.name+">")return"";l=!1}var u,d="/"!==r.charAt(1),h=r.startsWith("\x3c!--"),p=s+r.length,f=e.charAt(p);if(h){var x=n(r);return m<0?(c.push(x),c):((u=o[m])&&u.children&&Array.isArray(u.children)&&u.children.push(x),c)}if(d&&(m++,"tag"===(a=n(r)).type&&a.name&&t.components&&t.components[a.name]&&(a.type="component",l=!0),!a.voidElement&&!l&&f&&"<"!==f&&Array.isArray(a.children)&&a.children.push({type:"text",content:e.slice(p,e.indexOf("<",p))}),0===m&&c.push(a),(u=o[m-1])&&u.children&&u.children.push(a),o[m]=a),(!d||a.voidElement)&&(m>-1&&(a.voidElement||a.name===r.slice(2,-1))&&(m--,a=-1===m?c:o[m]),!l&&"<"!==f&&f)){u=-1===m?c:o[m].children;var v=e.indexOf("<",p),g=e.slice(p,-1===v?void 0:v);i.test(g)&&(g=" "),(v>-1&&m+u.length>=0||" "!==g)&&u&&Array.isArray(u)&&u.push({type:"text",content:g})}})),c},exports.stringify=function(e){return e.reduce((function(e,t){return e+a("",t)}),"")};


},{}],5:[function(require,module,exports){
(function (process){(function (){

'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./html-to-ast.cjs.production.min.js')
} else {
  module.exports = require('./html-to-ast.cjs.development.js')
}

}).call(this)}).call(this,require('_process'))
},{"./html-to-ast.cjs.development.js":3,"./html-to-ast.cjs.production.min.js":4,"_process":1}]},{},[2]);
