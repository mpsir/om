(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],3:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
const AST = require("abstract-syntax-tree")
globalThis.AST = AST
},{"abstract-syntax-tree":6}],6:[function(require,module,exports){
const find = require('./src/find')
const each = require('./src/each')
const first = require('./src/first')
const last = require('./src/last')
const count = require('./src/count')
const equal = require('./src/equal')
const has = require('./src/has')
const remove = require('./src/remove')
const prepend = require('./src/prepend')
const append = require('./src/append')
const replace = require('./src/replace')
const walk = require('./src/walk')
const traverse = require('./src/traverse')
const generate = require('./src/generate')
const parse = require('./src/parse')
const reduce = require('./src/reduce')
const template = require('./src/template')
const match = require('./src/match')
const serialize = require('./src/serialize')
const sourcemap = require('./src/sourcemap')
const mark = require('./src/mark')
const program = require('./src/program')
const iife = require('./src/iife')

class AbstractSyntaxTree {
  static find (tree, selector) {
    return find(tree, selector)
  }

  static each (tree, selector, callback) {
    return each(tree, selector, callback)
  }

  static first (tree, selector) {
    return first(tree, selector)
  }

  static last (tree, selector) {
    return last(tree, selector)
  }

  static count (tree, selector) {
    return count(tree, selector)
  }

  static has (tree, selector) {
    return has(tree, selector)
  }

  static remove (tree, target, options) {
    return remove(tree, target, options)
  }

  static prepend (tree, node) {
    return prepend(tree, node)
  }

  static append (tree, node) {
    return append(tree, node)
  }

  static equal (node1, node2) {
    return equal(node1, node2)
  }

  static match (node, selector) {
    return match(node, selector)
  }

  static generate (tree, options) {
    return generate(tree, options)
  }

  static parse (source, options) {
    return parse(source, options)
  }

  static walk (tree, callback) {
    return walk(tree, callback)
  }

  static serialize (node) {
    return serialize(node)
  }

  static traverse (tree, callback) {
    return traverse(tree, callback)
  }

  static replace (tree, callback) {
    return replace(tree, callback)
  }

  static template (source, options) {
    return template(source, options)
  }

  static reduce (tree, callback, accumulator) {
    return reduce(tree, callback, accumulator)
  }

  static program (body, options) {
    return program(body, options)
  }

  static iife (body) {
    return iife(body)
  }

  constructor (source = '', options = {}) {
    if (typeof source === 'string') {
      this._tree = parse(source, { loc: true, ...options })
    } else {
      this._tree = source
    }
  }

  get type () {
    return this._tree.type
  }

  get body () {
    return this._tree.body
  }

  get source () {
    return generate(this._tree)
  }

  get map () {
    return sourcemap(this._tree).map
  }

  set body (body) {
    this._tree.body = body
  }

  find (selector) {
    return find(this._tree, selector)
  }

  each (selector, callback) {
    return each(this._tree, selector, callback)
  }

  first (selector) {
    return first(this._tree, selector)
  }

  last (selector) {
    return last(this._tree, selector)
  }

  count (selector) {
    return count(this._tree, selector)
  }

  has (selector) {
    return has(this._tree, selector)
  }

  remove (target, options) {
    return remove(this._tree, target, options)
  }

  walk (callback) {
    return walk(this._tree, callback)
  }

  traverse (options) {
    return traverse(this._tree, options)
  }

  replace (options) {
    return replace(this._tree, options)
  }

  reduce (callback, accumulator) {
    return reduce(this._tree, callback, accumulator)
  }

  prepend (node) {
    return prepend(this._tree, node)
  }

  append (node) {
    return append(this._tree, node)
  }

  wrap (callback) {
    this._tree.body = callback(this._tree.body)
  }

  unwrap () {
    this._tree.body = first(this._tree, 'BlockStatement').body
  }

  mark () {
    return mark(this._tree)
  }
}

AbstractSyntaxTree.Node = require('./src/nodes/Node')
AbstractSyntaxTree.SourceLocation = require('./src/nodes/SourceLocation')
AbstractSyntaxTree.Position = require('./src/nodes/Position')
AbstractSyntaxTree.Identifier = require('./src/nodes/Identifier')
AbstractSyntaxTree.Literal = require('./src/nodes/Literal')
AbstractSyntaxTree.RegExpLiteral = require('./src/nodes/RegExpLiteral')
AbstractSyntaxTree.Program = require('./src/nodes/Program')
AbstractSyntaxTree.Function = require('./src/nodes/Function')
AbstractSyntaxTree.Statement = require('./src/nodes/Statement')
AbstractSyntaxTree.ExpressionStatement = require('./src/nodes/ExpressionStatement')
AbstractSyntaxTree.Directive = require('./src/nodes/Directive')
AbstractSyntaxTree.BlockStatement = require('./src/nodes/BlockStatement')
AbstractSyntaxTree.FunctionBody = require('./src/nodes/FunctionBody')
AbstractSyntaxTree.EmptyStatement = require('./src/nodes/EmptyStatement')
AbstractSyntaxTree.DebuggerStatement = require('./src/nodes/DebuggerStatement')
AbstractSyntaxTree.WithStatement = require('./src/nodes/WithStatement')
AbstractSyntaxTree.ReturnStatement = require('./src/nodes/ReturnStatement')
AbstractSyntaxTree.LabeledStatement = require('./src/nodes/LabeledStatement')
AbstractSyntaxTree.BreakStatement = require('./src/nodes/BreakStatement')
AbstractSyntaxTree.ContinueStatement = require('./src/nodes/ContinueStatement')
AbstractSyntaxTree.IfStatement = require('./src/nodes/IfStatement')
AbstractSyntaxTree.SwitchStatement = require('./src/nodes/SwitchStatement')
AbstractSyntaxTree.SwitchCase = require('./src/nodes/SwitchCase')
AbstractSyntaxTree.ThrowStatement = require('./src/nodes/ThrowStatement')
AbstractSyntaxTree.TryStatement = require('./src/nodes/TryStatement')
AbstractSyntaxTree.CatchClause = require('./src/nodes/CatchClause')
AbstractSyntaxTree.WhileStatement = require('./src/nodes/WhileStatement')
AbstractSyntaxTree.DoWhileStatement = require('./src/nodes/DoWhileStatement')
AbstractSyntaxTree.ForStatement = require('./src/nodes/ForStatement')
AbstractSyntaxTree.ForInStatement = require('./src/nodes/ForInStatement')
AbstractSyntaxTree.Declaration = require('./src/nodes/Declaration')
AbstractSyntaxTree.FunctionDeclaration = require('./src/nodes/FunctionDeclaration')
AbstractSyntaxTree.VariableDeclaration = require('./src/nodes/VariableDeclaration')
AbstractSyntaxTree.VariableDeclarator = require('./src/nodes/VariableDeclarator')
AbstractSyntaxTree.Expression = require('./src/nodes/Expression')
AbstractSyntaxTree.ThisExpression = require('./src/nodes/ThisExpression')
AbstractSyntaxTree.ArrayExpression = require('./src/nodes/ArrayExpression')
AbstractSyntaxTree.ObjectExpression = require('./src/nodes/ObjectExpression')
AbstractSyntaxTree.Property = require('./src/nodes/Property')
AbstractSyntaxTree.FunctionExpression = require('./src/nodes/FunctionExpression')
AbstractSyntaxTree.UnaryExpression = require('./src/nodes/UnaryExpression')
AbstractSyntaxTree.UnaryOperator = require('./src/nodes/UnaryOperator')
AbstractSyntaxTree.UpdateExpression = require('./src/nodes/UpdateExpression')
AbstractSyntaxTree.UpdateOperator = require('./src/nodes/UpdateOperator')
AbstractSyntaxTree.BinaryExpression = require('./src/nodes/BinaryExpression')
AbstractSyntaxTree.BinaryOperator = require('./src/nodes/BinaryOperator')
AbstractSyntaxTree.AssignmentExpression = require('./src/nodes/AssignmentExpression')
AbstractSyntaxTree.AssignmentOperator = require('./src/nodes/AssignmentOperator')
AbstractSyntaxTree.LogicalExpression = require('./src/nodes/LogicalExpression')
AbstractSyntaxTree.LogicalOperator = require('./src/nodes/LogicalOperator')
AbstractSyntaxTree.MemberExpression = require('./src/nodes/MemberExpression')
AbstractSyntaxTree.ConditionalExpression = require('./src/nodes/ConditionalExpression')
AbstractSyntaxTree.CallExpression = require('./src/nodes/CallExpression')
AbstractSyntaxTree.NewExpression = require('./src/nodes/NewExpression')
AbstractSyntaxTree.SequenceExpression = require('./src/nodes/SequenceExpression')
AbstractSyntaxTree.Pattern = require('./src/nodes/Pattern')
AbstractSyntaxTree.ForOfStatement = require('./src/nodes/ForOfStatement')
AbstractSyntaxTree.Super = require('./src/nodes/Super')
AbstractSyntaxTree.SpreadElement = require('./src/nodes/SpreadElement')
AbstractSyntaxTree.YieldExpression = require('./src/nodes/YieldExpression')
AbstractSyntaxTree.TemplateLiteral = require('./src/nodes/TemplateLiteral')
AbstractSyntaxTree.TaggedTemplateExpression = require('./src/nodes/TaggedTemplateExpression')
AbstractSyntaxTree.TemplateElement = require('./src/nodes/TemplateElement')
AbstractSyntaxTree.ObjectPattern = require('./src/nodes/ObjectPattern')
AbstractSyntaxTree.ArrayPattern = require('./src/nodes/ArrayPattern')
AbstractSyntaxTree.RestElement = require('./src/nodes/RestElement')
AbstractSyntaxTree.AssignmentPattern = require('./src/nodes/AssignmentPattern')
AbstractSyntaxTree.Class = require('./src/nodes/Class')
AbstractSyntaxTree.ClassBody = require('./src/nodes/ClassBody')
AbstractSyntaxTree.MethodDefinition = require('./src/nodes/MethodDefinition')
AbstractSyntaxTree.ClassDeclaration = require('./src/nodes/ClassDeclaration')
AbstractSyntaxTree.ClassExpression = require('./src/nodes/ClassExpression')
AbstractSyntaxTree.MetaProperty = require('./src/nodes/MetaProperty')
AbstractSyntaxTree.ModuleDeclaration = require('./src/nodes/ModuleDeclaration')
AbstractSyntaxTree.ModuleSpecifier = require('./src/nodes/ModuleSpecifier')
AbstractSyntaxTree.ImportDeclaration = require('./src/nodes/ImportDeclaration')
AbstractSyntaxTree.ImportSpecifier = require('./src/nodes/ImportSpecifier')
AbstractSyntaxTree.ImportDefaultSpecifier = require('./src/nodes/ImportDefaultSpecifier')
AbstractSyntaxTree.ImportNamespaceSpecifier = require('./src/nodes/ImportNamespaceSpecifier')
AbstractSyntaxTree.ExportNamedDeclaration = require('./src/nodes/ExportNamedDeclaration')
AbstractSyntaxTree.ExportSpecifier = require('./src/nodes/ExportSpecifier')
AbstractSyntaxTree.ExportDefaultDeclaration = require('./src/nodes/ExportDefaultDeclaration')
AbstractSyntaxTree.ExportAllDeclaration = require('./src/nodes/ExportAllDeclaration')
AbstractSyntaxTree.AwaitExpression = require('./src/nodes/AwaitExpression')
AbstractSyntaxTree.BigIntLiteral = require('./src/nodes/BigIntLiteral')
AbstractSyntaxTree.ChainExpression = require('./src/nodes/ChainExpression')
AbstractSyntaxTree.ChainElement = require('./src/nodes/ChainElement')
AbstractSyntaxTree.ImportExpression = require('./src/nodes/ImportExpression')

AbstractSyntaxTree.toBinaryExpression = require('./src/transform/toBinaryExpression')

AbstractSyntaxTree.binaryExpressionReduction = require('./src/optimize/binaryExpressionReduction')
AbstractSyntaxTree.ifStatementRemoval = require('./src/optimize/ifStatementRemoval')
AbstractSyntaxTree.logicalExpressionReduction = require('./src/optimize/logicalExpressionReduction')
AbstractSyntaxTree.memberExpressionReduction = require('./src/optimize/memberExpressionReduction')
AbstractSyntaxTree.negationOperatorRemoval = require('./src/optimize/negationOperatorRemoval')
AbstractSyntaxTree.ternaryOperatorReduction = require('./src/optimize/ternaryOperatorReduction')
AbstractSyntaxTree.typeofOperatorReduction = require('./src/optimize/typeofOperatorReduction')

module.exports = AbstractSyntaxTree

},{"./src/append":19,"./src/count":20,"./src/each":21,"./src/equal":22,"./src/find":23,"./src/first":24,"./src/generate":25,"./src/has":26,"./src/iife":27,"./src/last":28,"./src/mark":29,"./src/match":30,"./src/nodes/ArrayExpression":31,"./src/nodes/ArrayPattern":32,"./src/nodes/AssignmentExpression":33,"./src/nodes/AssignmentOperator":34,"./src/nodes/AssignmentPattern":35,"./src/nodes/AwaitExpression":36,"./src/nodes/BigIntLiteral":37,"./src/nodes/BinaryExpression":38,"./src/nodes/BinaryOperator":39,"./src/nodes/BlockStatement":40,"./src/nodes/BreakStatement":41,"./src/nodes/CallExpression":42,"./src/nodes/CatchClause":43,"./src/nodes/ChainElement":44,"./src/nodes/ChainExpression":45,"./src/nodes/Class":46,"./src/nodes/ClassBody":47,"./src/nodes/ClassDeclaration":48,"./src/nodes/ClassExpression":49,"./src/nodes/ConditionalExpression":50,"./src/nodes/ContinueStatement":51,"./src/nodes/DebuggerStatement":52,"./src/nodes/Declaration":53,"./src/nodes/Directive":54,"./src/nodes/DoWhileStatement":55,"./src/nodes/EmptyStatement":56,"./src/nodes/ExportAllDeclaration":57,"./src/nodes/ExportDefaultDeclaration":58,"./src/nodes/ExportNamedDeclaration":59,"./src/nodes/ExportSpecifier":60,"./src/nodes/Expression":61,"./src/nodes/ExpressionStatement":62,"./src/nodes/ForInStatement":63,"./src/nodes/ForOfStatement":64,"./src/nodes/ForStatement":65,"./src/nodes/Function":66,"./src/nodes/FunctionBody":67,"./src/nodes/FunctionDeclaration":68,"./src/nodes/FunctionExpression":69,"./src/nodes/Identifier":70,"./src/nodes/IfStatement":71,"./src/nodes/ImportDeclaration":72,"./src/nodes/ImportDefaultSpecifier":73,"./src/nodes/ImportExpression":74,"./src/nodes/ImportNamespaceSpecifier":75,"./src/nodes/ImportSpecifier":76,"./src/nodes/LabeledStatement":77,"./src/nodes/Literal":78,"./src/nodes/LogicalExpression":79,"./src/nodes/LogicalOperator":80,"./src/nodes/MemberExpression":81,"./src/nodes/MetaProperty":82,"./src/nodes/MethodDefinition":83,"./src/nodes/ModuleDeclaration":84,"./src/nodes/ModuleSpecifier":85,"./src/nodes/NewExpression":86,"./src/nodes/Node":87,"./src/nodes/ObjectExpression":88,"./src/nodes/ObjectPattern":89,"./src/nodes/Pattern":90,"./src/nodes/Position":91,"./src/nodes/Program":92,"./src/nodes/Property":93,"./src/nodes/RegExpLiteral":94,"./src/nodes/RestElement":95,"./src/nodes/ReturnStatement":96,"./src/nodes/SequenceExpression":97,"./src/nodes/SourceLocation":98,"./src/nodes/SpreadElement":99,"./src/nodes/Statement":100,"./src/nodes/Super":101,"./src/nodes/SwitchCase":102,"./src/nodes/SwitchStatement":103,"./src/nodes/TaggedTemplateExpression":104,"./src/nodes/TemplateElement":105,"./src/nodes/TemplateLiteral":106,"./src/nodes/ThisExpression":107,"./src/nodes/ThrowStatement":108,"./src/nodes/TryStatement":109,"./src/nodes/UnaryExpression":110,"./src/nodes/UnaryOperator":111,"./src/nodes/UpdateExpression":112,"./src/nodes/UpdateOperator":113,"./src/nodes/VariableDeclaration":114,"./src/nodes/VariableDeclarator":115,"./src/nodes/WhileStatement":116,"./src/nodes/WithStatement":117,"./src/nodes/YieldExpression":118,"./src/optimize/binaryExpressionReduction":119,"./src/optimize/ifStatementRemoval":120,"./src/optimize/logicalExpressionReduction":121,"./src/optimize/memberExpressionReduction":122,"./src/optimize/negationOperatorRemoval":123,"./src/optimize/ternaryOperatorReduction":124,"./src/optimize/typeofOperatorReduction":125,"./src/parse":128,"./src/prepend":129,"./src/program":130,"./src/reduce":131,"./src/remove":132,"./src/replace":133,"./src/serialize":134,"./src/sourcemap":135,"./src/template":137,"./src/transform/toBinaryExpression":138,"./src/traverse":139,"./src/walk":141}],7:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
class ArraySet {
  constructor() {
    this._array = [];
    this._set = new Map();
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  static fromArray(aArray, aAllowDuplicates) {
    const set = new ArraySet();
    for (let i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  }

  /**
   * Return how many unique items are in this ArraySet. If duplicates have been
   * added, than those do not count towards the size.
   *
   * @returns Number
   */
  size() {
    return this._set.size;
  }

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  add(aStr, aAllowDuplicates) {
    const isDuplicate = this.has(aStr);
    const idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set.set(aStr, idx);
    }
  }

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  has(aStr) {
      return this._set.has(aStr);
  }

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  indexOf(aStr) {
    const idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
    throw new Error('"' + aStr + '" is not in the set.');
  }

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  }

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  toArray() {
    return this._array.slice();
  }
}
exports.ArraySet = ArraySet;

},{}],8:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const base64 = require("./base64");

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

const VLQ_BASE_SHIFT = 5;

// binary: 100000
const VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
const VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
const VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
// eslint-disable-next-line no-unused-vars
function fromVLQSigned(aValue) {
  const isNegative = (aValue & 1) === 1;
  const shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  let encoded = "";
  let digit;

  let vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

},{"./base64":9}],9:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function(number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

},{}],10:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  const mid = Math.floor((aHigh - aLow) / 2) + aLow;
  const cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  } else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    }
    return mid;
  }

  // Our needle is less than aHaystack[mid].
  if (mid - aLow > 1) {
    // The element is in the lower half.
    return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
  }

  // we are in termination case (3) or (2) and return the appropriate thing.
  if (aBias == exports.LEAST_UPPER_BOUND) {
    return mid;
  }
  return aLow < 0 ? -1 : aLow;
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  let index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};

},{}],11:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const util = require("./util");

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  const lineA = mappingA.generatedLine;
  const lineB = mappingB.generatedLine;
  const columnA = mappingA.generatedColumn;
  const columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a negligible overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
class MappingList {
  constructor() {
    this._array = [];
    this._sorted = true;
    // Serves as infimum
    this._last = {generatedLine: -1, generatedColumn: 0};
  }

  /**
   * Iterate through internal items. This method takes the same arguments that
   * `Array.prototype.forEach` takes.
   *
   * NOTE: The order of the mappings is NOT guaranteed.
   */
  unsortedForEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  }

  /**
   * Add the given source mapping.
   *
   * @param Object aMapping
   */
  add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  }

  /**
   * Returns the flat, sorted array of mappings. The mappings are sorted by
   * generated position.
   *
   * WARNING: This method returns internal data without copying, for
   * performance. The return value must NOT be mutated, and should be treated as
   * an immutable borrow. If you want to take ownership, you must make your own
   * copy.
   */
  toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  }
}

exports.MappingList = MappingList;

},{"./util":16}],12:[function(require,module,exports){
(function (__dirname){(function (){
/* Determine browser vs node environment by testing the default top level context. Solution courtesy of: https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser */
const isBrowserEnvironment = (function() {
    // eslint-disable-next-line no-undef
    return (typeof window !== "undefined") && (this === window);
}).call();

if (isBrowserEnvironment) {
  // Web version of reading a wasm file into an array buffer.

  let mappingsWasm = null;

  module.exports = function readWasm() {
    if (typeof mappingsWasm === "string") {
      return fetch(mappingsWasm)
        .then(response => response.arrayBuffer());
    }
    if (mappingsWasm instanceof ArrayBuffer) {
      return Promise.resolve(mappingsWasm);
    }
    throw new Error("You must provide the string URL or ArrayBuffer contents " +
                    "of lib/mappings.wasm by calling " +
                    "SourceMapConsumer.initialize({ 'lib/mappings.wasm': ... }) " +
                    "before using SourceMapConsumer");
  };

  module.exports.initialize = input => mappingsWasm = input;
} else {
  // Node version of reading a wasm file into an array buffer.
  const fs = require("fs");
  const path = require("path");

  module.exports = function readWasm() {
    return new Promise((resolve, reject) => {
      const wasmPath = path.join(__dirname, "mappings.wasm");
      fs.readFile(wasmPath, null, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(data.buffer);
      });
    });
  };

  module.exports.initialize = _ => {
    console.debug("SourceMapConsumer.initialize is a no-op when running in node.js");
  };
}

}).call(this)}).call(this,"/node_modules/abstract-syntax-tree/node_modules/source-map/lib")
},{"fs":1,"path":3}],13:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const util = require("./util");
const binarySearch = require("./binary-search");
const ArraySet = require("./array-set").ArraySet;
const base64VLQ = require("./base64-vlq"); // eslint-disable-line no-unused-vars
const readWasm = require("../lib/read-wasm");
const wasm = require("./wasm");

const INTERNAL = Symbol("smcInternal");

class SourceMapConsumer {
  constructor(aSourceMap, aSourceMapURL) {
    // If the constructor was called by super(), just return Promise<this>.
    // Yes, this is a hack to retain the pre-existing API of the base-class
    // constructor also being an async factory function.
    if (aSourceMap == INTERNAL) {
      return Promise.resolve(this);
    }

    return _factory(aSourceMap, aSourceMapURL);
  }

  static initialize(opts) {
    readWasm.initialize(opts["lib/mappings.wasm"]);
  }

  static fromSourceMap(aSourceMap, aSourceMapURL) {
    return _factoryBSM(aSourceMap, aSourceMapURL);
  }

  /**
   * Construct a new `SourceMapConsumer` from `rawSourceMap` and `sourceMapUrl`
   * (see the `SourceMapConsumer` constructor for details. Then, invoke the `async
   * function f(SourceMapConsumer) -> T` with the newly constructed consumer, wait
   * for `f` to complete, call `destroy` on the consumer, and return `f`'s return
   * value.
   *
   * You must not use the consumer after `f` completes!
   *
   * By using `with`, you do not have to remember to manually call `destroy` on
   * the consumer, since it will be called automatically once `f` completes.
   *
   * ```js
   * const xSquared = await SourceMapConsumer.with(
   *   myRawSourceMap,
   *   null,
   *   async function (consumer) {
   *     // Use `consumer` inside here and don't worry about remembering
   *     // to call `destroy`.
   *
   *     const x = await whatever(consumer);
   *     return x * x;
   *   }
   * );
   *
   * // You may not use that `consumer` anymore out here; it has
   * // been destroyed. But you can use `xSquared`.
   * console.log(xSquared);
   * ```
   */
  static async with(rawSourceMap, sourceMapUrl, f) {
    const consumer = await new SourceMapConsumer(rawSourceMap, sourceMapUrl);
    try {
      return await f(consumer);
    } finally {
      consumer.destroy();
    }
  }

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  _parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  }

  /**
   * Iterate over each mapping between an original source/line/column and a
   * generated line/column in this source map.
   *
   * @param Function aCallback
   *        The function that is called with each mapping.
   * @param Object aContext
   *        Optional. If specified, this object will be the value of `this` every
   *        time that `aCallback` is called.
   * @param aOrder
   *        Either `SourceMapConsumer.GENERATED_ORDER` or
   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
   *        iterate over the mappings sorted by the generated file's line/column
   *        order or the original's source/line/column order, respectively. Defaults to
   *        `SourceMapConsumer.GENERATED_ORDER`.
   */
  eachMapping(aCallback, aContext, aOrder) {
    throw new Error("Subclasses must implement eachMapping");
  }

  /**
   * Returns all generated line and column information for the original source,
   * line, and column provided. If no column is provided, returns all mappings
   * corresponding to a either the line we are searching for or the next
   * closest line that has any mappings. Otherwise, returns all mappings
   * corresponding to the given line and either the column we are searching for
   * or the next closest column that has any offsets.
   *
   * The only argument is an object with the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.  The line number is 1-based.
   *   - column: Optional. the column number in the original source.
   *    The column number is 0-based.
   *
   * and an array of objects is returned, each with the following properties:
   *
   *   - line: The line number in the generated source, or null.  The
   *    line number is 1-based.
   *   - column: The column number in the generated source, or null.
   *    The column number is 0-based.
   */
  allGeneratedPositionsFor(aArgs) {
    throw new Error("Subclasses must implement allGeneratedPositionsFor");
  }

  destroy() {
    throw new Error("Subclasses must implement destroy");
  }
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;
SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
class BasicSourceMapConsumer extends SourceMapConsumer {
  constructor(aSourceMap, aSourceMapURL) {
    return super(INTERNAL).then(that => {
      let sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }

      const version = util.getArg(sourceMap, "version");
      let sources = util.getArg(sourceMap, "sources");
      // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
      // requires the array) to play nice here.
      const names = util.getArg(sourceMap, "names", []);
      let sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
      const sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
      const mappings = util.getArg(sourceMap, "mappings");
      const file = util.getArg(sourceMap, "file", null);

      // Once again, Sass deviates from the spec and supplies the version as a
      // string rather than a number, so we use loose equality checking here.
      if (version != that._version) {
        throw new Error("Unsupported version: " + version);
      }

      if (sourceRoot) {
        sourceRoot = util.normalize(sourceRoot);
      }

      sources = sources
        .map(String)
        // Some source maps produce relative source paths like "./foo.js" instead of
        // "foo.js".  Normalize these first so that future comparisons will succeed.
        // See bugzil.la/1090768.
        .map(util.normalize)
        // Always ensure that absolute sources are internally stored relative to
        // the source root, if the source root is absolute. Not doing this would
        // be particularly problematic when the source root is a prefix of the
        // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
        .map(function(source) {
          return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
            ? util.relative(sourceRoot, source)
            : source;
        });

      // Pass `true` below to allow duplicate names and sources. While source maps
      // are intended to be compressed and deduplicated, the TypeScript compiler
      // sometimes generates source maps with duplicates in them. See Github issue
      // #72 and bugzil.la/889492.
      that._names = ArraySet.fromArray(names.map(String), true);
      that._sources = ArraySet.fromArray(sources, true);

      that._absoluteSources = that._sources.toArray().map(function(s) {
        return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
      });

      that.sourceRoot = sourceRoot;
      that.sourcesContent = sourcesContent;
      that._mappings = mappings;
      that._sourceMapURL = aSourceMapURL;
      that.file = file;

      that._computedColumnSpans = false;
      that._mappingsPtr = 0;
      that._wasm = null;

      return wasm().then(w => {
        that._wasm = w;
        return that;
      });
    });
  }

  /**
   * Utility function to find the index of a source.  Returns -1 if not
   * found.
   */
  _findSourceIndex(aSource) {
    let relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    if (this._sources.has(relativeSource)) {
      return this._sources.indexOf(relativeSource);
    }

    // Maybe aSource is an absolute URL as returned by |sources|.  In
    // this case we can't simply undo the transform.
    for (let i = 0; i < this._absoluteSources.length; ++i) {
      if (this._absoluteSources[i] == aSource) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Create a BasicSourceMapConsumer from a SourceMapGenerator.
   *
   * @param SourceMapGenerator aSourceMap
   *        The source map that will be consumed.
   * @param String aSourceMapURL
   *        The URL at which the source map can be found (optional)
   * @returns BasicSourceMapConsumer
   */
  static fromSourceMap(aSourceMap, aSourceMapURL) {
    return new BasicSourceMapConsumer(aSourceMap.toString());
  }

  get sources() {
    return this._absoluteSources.slice();
  }

  _getMappingsPtr() {
    if (this._mappingsPtr === 0) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this._mappingsPtr;
  }

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  _parseMappings(aStr, aSourceRoot) {
    const size = aStr.length;

    const mappingsBufPtr = this._wasm.exports.allocate_mappings(size);
    const mappingsBuf = new Uint8Array(this._wasm.exports.memory.buffer, mappingsBufPtr, size);
    for (let i = 0; i < size; i++) {
      mappingsBuf[i] = aStr.charCodeAt(i);
    }

    const mappingsPtr = this._wasm.exports.parse_mappings(mappingsBufPtr);

    if (!mappingsPtr) {
      const error = this._wasm.exports.get_last_error();
      let msg = `Error parsing mappings (code ${error}): `;

      // XXX: keep these error codes in sync with `fitzgen/source-map-mappings`.
      switch (error) {
        case 1:
          msg += "the mappings contained a negative line, column, source index, or name index";
          break;
        case 2:
          msg += "the mappings contained a number larger than 2**32";
          break;
        case 3:
          msg += "reached EOF while in the middle of parsing a VLQ";
          break;
        case 4:
          msg += "invalid base 64 character while parsing a VLQ";
          break;
        default:
          msg += "unknown error code";
          break;
      }

      throw new Error(msg);
    }

    this._mappingsPtr = mappingsPtr;
  }

  eachMapping(aCallback, aContext, aOrder) {
    const context = aContext || null;
    const order = aOrder || SourceMapConsumer.GENERATED_ORDER;
    const sourceRoot = this.sourceRoot;

    this._wasm.withMappingCallback(
      mapping => {
        if (mapping.source !== null) {
          mapping.source = this._sources.at(mapping.source);
          mapping.source = util.computeSourceURL(sourceRoot, mapping.source, this._sourceMapURL);

          if (mapping.name !== null) {
            mapping.name = this._names.at(mapping.name);
          }
        }

        aCallback.call(context, mapping);
      },
      () => {
        switch (order) {
        case SourceMapConsumer.GENERATED_ORDER:
          this._wasm.exports.by_generated_location(this._getMappingsPtr());
          break;
        case SourceMapConsumer.ORIGINAL_ORDER:
          this._wasm.exports.by_original_location(this._getMappingsPtr());
          break;
        default:
          throw new Error("Unknown order of iteration.");
        }
      }
    );
  }

  allGeneratedPositionsFor(aArgs) {
    let source = util.getArg(aArgs, "source");
    const originalLine = util.getArg(aArgs, "line");
    const originalColumn = aArgs.column || 0;

    source = this._findSourceIndex(source);
    if (source < 0) {
      return [];
    }

    if (originalLine < 1) {
      throw new Error("Line numbers must be >= 1");
    }

    if (originalColumn < 0) {
      throw new Error("Column numbers must be >= 0");
    }

    const mappings = [];

    this._wasm.withMappingCallback(
      m => {
        let lastColumn = m.lastGeneratedColumn;
        if (this._computedColumnSpans && lastColumn === null) {
          lastColumn = Infinity;
        }
        mappings.push({
          line: m.generatedLine,
          column: m.generatedColumn,
          lastColumn,
        });
      }, () => {
        this._wasm.exports.all_generated_locations_for(
          this._getMappingsPtr(),
          source,
          originalLine - 1,
          "column" in aArgs,
          originalColumn
        );
      }
    );

    return mappings;
  }

  destroy() {
    if (this._mappingsPtr !== 0) {
      this._wasm.exports.free_mappings(this._mappingsPtr);
      this._mappingsPtr = 0;
    }
  }

  /**
   * Compute the last column for each generated mapping. The last column is
   * inclusive.
   */
  computeColumnSpans() {
    if (this._computedColumnSpans) {
      return;
    }

    this._wasm.exports.compute_column_spans(this._getMappingsPtr());
    this._computedColumnSpans = true;
  }

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.  The line number
   *     is 1-based.
   *   - column: The column number in the generated source.  The column
   *     number is 0-based.
   *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
   *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.  The
   *     line number is 1-based.
   *   - column: The column number in the original source, or null.  The
   *     column number is 0-based.
   *   - name: The original identifier, or null.
   */
  originalPositionFor(aArgs) {
    const needle = {
      generatedLine: util.getArg(aArgs, "line"),
      generatedColumn: util.getArg(aArgs, "column")
    };

    if (needle.generatedLine < 1) {
      throw new Error("Line numbers must be >= 1");
    }

    if (needle.generatedColumn < 0) {
      throw new Error("Column numbers must be >= 0");
    }

    let bias = util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND);
    if (bias == null) {
      bias = SourceMapConsumer.GREATEST_LOWER_BOUND;
    }

    let mapping;
    this._wasm.withMappingCallback(m => mapping = m, () => {
      this._wasm.exports.original_location_for(
        this._getMappingsPtr(),
        needle.generatedLine - 1,
        needle.generatedColumn,
        bias
      );
    });

    if (mapping) {
      if (mapping.generatedLine === needle.generatedLine) {
        let source = util.getArg(mapping, "source", null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }

        let name = util.getArg(mapping, "name", null);
        if (name !== null) {
          name = this._names.at(name);
        }

        return {
          source,
          line: util.getArg(mapping, "originalLine", null),
          column: util.getArg(mapping, "originalColumn", null),
          name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  }

  /**
   * Return true if we have the source content for every source in the source
   * map, false otherwise.
   */
  hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function(sc) { return sc == null; });
  }

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * available.
   */
  sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    const index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    let relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    let url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      const fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }

    throw new Error('"' + relativeSource + '" is not in the SourceMap.');
  }

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.  The line number
   *     is 1-based.
   *   - column: The column number in the original source.  The column
   *     number is 0-based.
   *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
   *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.  The
   *     line number is 1-based.
   *   - column: The column number in the generated source, or null.
   *     The column number is 0-based.
   */
  generatedPositionFor(aArgs) {
    let source = util.getArg(aArgs, "source");
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    const needle = {
      source,
      originalLine: util.getArg(aArgs, "line"),
      originalColumn: util.getArg(aArgs, "column")
    };

    if (needle.originalLine < 1) {
      throw new Error("Line numbers must be >= 1");
    }

    if (needle.originalColumn < 0) {
      throw new Error("Column numbers must be >= 0");
    }

    let bias = util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND);
    if (bias == null) {
      bias = SourceMapConsumer.GREATEST_LOWER_BOUND;
    }

    let mapping;
    this._wasm.withMappingCallback(m => mapping = m, () => {
      this._wasm.exports.generated_location_for(
        this._getMappingsPtr(),
        needle.source,
        needle.originalLine - 1,
        needle.originalColumn,
        bias
      );
    });

    if (mapping) {
      if (mapping.source === needle.source) {
        let lastColumn = mapping.lastGeneratedColumn;
        if (this._computedColumnSpans && lastColumn === null) {
          lastColumn = Infinity;
        }
        return {
          line: util.getArg(mapping, "generatedLine", null),
          column: util.getArg(mapping, "generatedColumn", null),
          lastColumn,
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  }
}

BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
class IndexedSourceMapConsumer extends SourceMapConsumer {
  constructor(aSourceMap, aSourceMapURL) {
    return super(INTERNAL).then(that => {
      let sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }

      const version = util.getArg(sourceMap, "version");
      const sections = util.getArg(sourceMap, "sections");

      if (version != that._version) {
        throw new Error("Unsupported version: " + version);
      }

      that._sources = new ArraySet();
      that._names = new ArraySet();
      that.__generatedMappings = null;
      that.__originalMappings = null;
      that.__generatedMappingsUnsorted = null;
      that.__originalMappingsUnsorted = null;

      let lastOffset = {
        line: -1,
        column: 0
      };
      return Promise.all(sections.map(s => {
        if (s.url) {
          // The url field will require support for asynchronicity.
          // See https://github.com/mozilla/source-map/issues/16
          throw new Error("Support for url field in sections not implemented.");
        }
        const offset = util.getArg(s, "offset");
        const offsetLine = util.getArg(offset, "line");
        const offsetColumn = util.getArg(offset, "column");

        if (offsetLine < lastOffset.line ||
            (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
          throw new Error("Section offsets must be ordered and non-overlapping.");
        }
        lastOffset = offset;

        const cons = new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL);
        return cons.then(consumer => {
          return {
            generatedOffset: {
              // The offset fields are 0-based, but we use 1-based indices when
              // encoding/decoding from VLQ.
              generatedLine: offsetLine + 1,
              generatedColumn: offsetColumn + 1
            },
            consumer
          };
        });
      })).then(s => {
        that._sections = s;
        return that;
      });
    });
  }

  // `__generatedMappings` and `__originalMappings` are arrays that hold the
  // parsed mapping coordinates from the source map's "mappings" attribute. They
  // are lazily instantiated, accessed via the `_generatedMappings` and
  // `_originalMappings` getters respectively, and we only parse the mappings
  // and create these arrays once queried for a source location. We jump through
  // these hoops because there can be many thousands of mappings, and parsing
  // them is expensive, so we only want to do it if we must.
  //
  // Each object in the arrays is of the form:
  //
  //     {
  //       generatedLine: The line number in the generated code,
  //       generatedColumn: The column number in the generated code,
  //       source: The path to the original source file that generated this
  //               chunk of code,
  //       originalLine: The line number in the original source that
  //                     corresponds to this chunk of generated code,
  //       originalColumn: The column number in the original source that
  //                       corresponds to this chunk of generated code,
  //       name: The name of the original symbol which generated this chunk of
  //             code.
  //     }
  //
  // All properties except for `generatedLine` and `generatedColumn` can be
  // `null`.
  //
  // `_generatedMappings` is ordered by the generated positions.
  //
  // `_originalMappings` is ordered by the original positions.
  get _generatedMappings() {
    if (!this.__generatedMappings) {
      this._sortGeneratedMappings();
    }

    return this.__generatedMappings;
  }

  get _originalMappings() {
    if (!this.__originalMappings) {
      this._sortOriginalMappings();
    }

    return this.__originalMappings;
  }

  get _generatedMappingsUnsorted() {
    if (!this.__generatedMappingsUnsorted) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappingsUnsorted;
  }

  get _originalMappingsUnsorted() {
    if (!this.__originalMappingsUnsorted) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappingsUnsorted;
  }

  _sortGeneratedMappings() {
    const mappings = this._generatedMappingsUnsorted;
    mappings.sort(util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = mappings;
  }

  _sortOriginalMappings() {
    const mappings = this._originalMappingsUnsorted;
    mappings.sort(util.compareByOriginalPositions);
    this.__originalMappings = mappings;
  }

  /**
   * The list of original sources.
   */
  get sources() {
    const sources = [];
    for (let i = 0; i < this._sections.length; i++) {
      for (let j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.  The line number
   *     is 1-based.
   *   - column: The column number in the generated source.  The column
   *     number is 0-based.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.  The
   *     line number is 1-based.
   *   - column: The column number in the original source, or null.  The
   *     column number is 0-based.
   *   - name: The original identifier, or null.
   */
  originalPositionFor(aArgs) {
    const needle = {
      generatedLine: util.getArg(aArgs, "line"),
      generatedColumn: util.getArg(aArgs, "column")
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    const sectionIndex = binarySearch.search(needle, this._sections,
      function(aNeedle, section) {
        const cmp = aNeedle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (aNeedle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    const section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  }

  /**
   * Return true if we have the source content for every source in the source
   * map, false otherwise.
   */
  hasContentsOfAllSources() {
    return this._sections.every(function(s) {
      return s.consumer.hasContentsOfAllSources();
    });
  }

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * available.
   */
  sourceContentFor(aSource, nullOnMissing) {
    for (let i = 0; i < this._sections.length; i++) {
      const section = this._sections[i];

      const content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    throw new Error('"' + aSource + '" is not in the SourceMap.');
  }

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.  The line number
   *     is 1-based.
   *   - column: The column number in the original source.  The column
   *     number is 0-based.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.  The
   *     line number is 1-based.
   *   - column: The column number in the generated source, or null.
   *     The column number is 0-based.
   */
  generatedPositionFor(aArgs) {
    for (let i = 0; i < this._sections.length; i++) {
      const section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) {
        continue;
      }
      const generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        const ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  }

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  _parseMappings(aStr, aSourceRoot) {
    const generatedMappings = this.__generatedMappingsUnsorted = [];
    const originalMappings = this.__originalMappingsUnsorted = [];
    for (let i = 0; i < this._sections.length; i++) {
      const section = this._sections[i];

      const sectionMappings = [];
      section.consumer.eachMapping(m => sectionMappings.push(m));

      for (let j = 0; j < sectionMappings.length; j++) {
        const mapping = sectionMappings[j];

        // TODO: test if null is correct here.  The original code used
        // `source`, which would actually have gotten used as null because
        // var's get hoisted.
        // See: https://github.com/mozilla/source-map/issues/333
        let source = util.computeSourceURL(section.consumer.sourceRoot, null, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        let name = null;
        if (mapping.name) {
          this._names.add(mapping.name);
          name = this._names.indexOf(mapping.name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        const adjustedMapping = {
          source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name
        };

        generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === "number") {
          originalMappings.push(adjustedMapping);
        }
      }
    }
  }

  eachMapping(aCallback, aContext, aOrder) {
    const context = aContext || null;
    const order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    let mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    const sourceRoot = this.sourceRoot;
    mappings.map(function(mapping) {
      let source = null;
      if (mapping.source !== null) {
        source = this._sources.at(mapping.source);
        source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      }
      return {
        source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  }

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  _findMapping(aNeedle, aMappings, aLineName,
              aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError("Line must be greater than or equal to 1, got "
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError("Column must be greater than or equal to 0, got "
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  }

  allGeneratedPositionsFor(aArgs) {
    const line = util.getArg(aArgs, "line");

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    const needle = {
      source: util.getArg(aArgs, "source"),
      originalLine: line,
      originalColumn: util.getArg(aArgs, "column", 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    if (needle.originalLine < 1) {
      throw new Error("Line numbers must be >= 1");
    }

    if (needle.originalColumn < 0) {
      throw new Error("Column numbers must be >= 0");
    }

    const mappings = [];

    let index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      let mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        const originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          let lastColumn = mapping.lastGeneratedColumn;
          if (this._computedColumnSpans && lastColumn === null) {
            lastColumn = Infinity;
          }
          mappings.push({
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn,
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        const originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          let lastColumn = mapping.lastGeneratedColumn;
          if (this._computedColumnSpans && lastColumn === null) {
            lastColumn = Infinity;
          }
          mappings.push({
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn,
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  }

  destroy() {
    for (let i = 0; i < this._sections.length; i++) {
      this._sections[i].consumer.destroy();
    }
  }
}
exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

/*
 * Cheat to get around inter-twingled classes.  `factory()` can be at the end
 * where it has access to non-hoisted classes, but it gets hoisted itself.
 */
function _factory(aSourceMap, aSourceMapURL) {
  let sourceMap = aSourceMap;
  if (typeof aSourceMap === "string") {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  const consumer = sourceMap.sections != null
      ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
      : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
  return Promise.resolve(consumer);
}

function _factoryBSM(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
}

},{"../lib/read-wasm":12,"./array-set":7,"./base64-vlq":8,"./binary-search":10,"./util":16,"./wasm":17}],14:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const base64VLQ = require("./base64-vlq");
const util = require("./util");
const ArraySet = require("./array-set").ArraySet;
const MappingList = require("./mapping-list").MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
class SourceMapGenerator {
  constructor(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, "file", null);
    this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util.getArg(aArgs, "skipValidation", false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }

  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */
  static fromSourceMap(aSourceMapConsumer) {
    const sourceRoot = aSourceMapConsumer.sourceRoot;
    const generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot
    });
    aSourceMapConsumer.eachMapping(function(mapping) {
      const newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      let sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      const content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  }

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  addMapping(aArgs) {
    const generated = util.getArg(aArgs, "generated");
    const original = util.getArg(aArgs, "original", null);
    let source = util.getArg(aArgs, "source", null);
    let name = util.getArg(aArgs, "name", null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name
    });
  }

  /**
   * Set the source content for a source file.
   */
  setSourceContent(aSourceFile, aSourceContent) {
    let source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  }

  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   * @param aSourceMapPath Optional. The dirname of the path to the source map
   *        to be applied. If relative, it is relative to the SourceMapConsumer.
   *        This parameter is needed when the two source maps aren't in the same
   *        directory, and the source map to be applied contains relative source
   *        paths. If so, those relative source paths need to be rewritten
   *        relative to the SourceMapGenerator.
   */
  applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    let sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          "SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, " +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    const sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    const newSources = this._mappings.toArray().length > 0
      ? new ArraySet()
      : this._sources;
    const newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        const original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      const source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      const name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function(srcFile) {
      const content = aSourceMapConsumer.sourceContentFor(srcFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          srcFile = util.join(aSourceMapPath, srcFile);
        }
        if (sourceRoot != null) {
          srcFile = util.relative(sourceRoot, srcFile);
        }
        this.setSourceContent(srcFile, content);
      }
    }, this);
  }

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  _validateMapping(aGenerated, aOriginal, aSource, aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
        throw new Error(
            "original.line and original.column are not numbers -- you probably meant to omit " +
            "the original mapping entirely and only map the generated position. If so, pass " +
            "null for the original mapping instead of an object with empty or null values."
        );
    }

    if (aGenerated && "line" in aGenerated && "column" in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.

    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated
             && aOriginal && "line" in aOriginal && "column" in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.

    } else {
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  }

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  _serializeMappings() {
    let previousGeneratedColumn = 0;
    let previousGeneratedLine = 1;
    let previousOriginalColumn = 0;
    let previousOriginalLine = 0;
    let previousName = 0;
    let previousSource = 0;
    let result = "";
    let next;
    let mapping;
    let nameIdx;
    let sourceIdx;

    const mappings = this._mappings.toArray();
    for (let i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = "";

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else if (i > 0) {
        if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
          continue;
        }
        next += ",";
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  }

  _generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      const key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  }

  /**
   * Externalize the source map.
   */
  toJSON() {
    const map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  }

  /**
   * Render the source map being generated to a string.
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }
}

SourceMapGenerator.prototype._version = 3;
exports.SourceMapGenerator = SourceMapGenerator;

},{"./array-set":7,"./base64-vlq":8,"./mapping-list":11,"./util":16}],15:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const SourceMapGenerator = require("./source-map-generator").SourceMapGenerator;
const util = require("./util");

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
const REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
const NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
const isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
class SourceNode {
  constructor(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   * @param aRelativePath Optional. The path that relative sources in the
   *        SourceMapConsumer should be relative to.
   */
  static fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    const node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    const remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    let remainingLinesIndex = 0;
    const shiftNextLine = function() {
      const lineContents = getNextLine();
      // The last line of a file might not have a newline.
      const newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    let lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    let lastMapping = null;
    let nextLine;

    aSourceMapConsumer.eachMapping(function(mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          nextLine = remainingLines[remainingLinesIndex] || "";
          const code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        nextLine = remainingLines[remainingLinesIndex] || "";
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      const content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        const source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  }

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  }

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (let i = aChunk.length - 1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  }

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  walk(aFn) {
    let chunk;
    for (let i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      } else if (chunk !== "") {
        aFn(chunk, { source: this.source,
                      line: this.line,
                      column: this.column,
                      name: this.name });
      }
    }
  }

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  join(aSep) {
    let newChildren;
    let i;
    const len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len - 1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  }

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  replaceRight(aPattern, aReplacement) {
    const lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === "string") {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push("".replace(aPattern, aReplacement));
    }
    return this;
  }

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  }

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  walkSourceContents(aFn) {
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    const sources = Object.keys(this.sourceContents);
    for (let i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  }

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  toString() {
    let str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  }

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  toStringWithSourceMap(aArgs) {
    const generated = {
      code: "",
      line: 1,
      column: 0
    };
    const map = new SourceMapGenerator(aArgs);
    let sourceMappingActive = false;
    let lastOriginalSource = null;
    let lastOriginalLine = null;
    let lastOriginalColumn = null;
    let lastOriginalName = null;
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if (lastOriginalSource !== original.source
          || lastOriginalLine !== original.line
          || lastOriginalColumn !== original.column
          || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (let idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          // Mappings end at eol
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function(sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map };
  }
}

exports.SourceNode = SourceNode;

},{"./source-map-generator":14,"./util":16}],16:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  }
    throw new Error('"' + aName + '" is a required argument.');

}
exports.getArg = getArg;

const urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
const dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  const match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  let url = "";
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ":";
  }
  url += "//";
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + "@";
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

const MAX_CACHED_INPUTS = 32;

/**
 * Takes some function `f(input) -> result` and returns a memoized version of
 * `f`.
 *
 * We keep at most `MAX_CACHED_INPUTS` memoized results of `f` alive. The
 * memoization is a dumb-simple, linear least-recently-used cache.
 */
function lruMemoize(f) {
  const cache = [];

  return function(input) {
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].input === input) {
        const temp = cache[0];
        cache[0] = cache[i];
        cache[i] = temp;
        return cache[0].result;
      }
    }

    const result = f(input);

    cache.unshift({
      input,
      result,
    });

    if (cache.length > MAX_CACHED_INPUTS) {
      cache.pop();
    }

    return result;
  };
}

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
const normalize = lruMemoize(function normalize(aPath) {
  let path = aPath;
  const url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  const isAbsolute = exports.isAbsolute(path);

  // Split the path into parts between `/` characters. This is much faster than
  // using `.split(/\/+/g)`.
  const parts = [];
  let start = 0;
  let i = 0;
  while (true) {
    start = i;
    i = path.indexOf("/", start);
    if (i === -1) {
      parts.push(path.slice(start));
      break;
    } else {
      parts.push(path.slice(start, i));
      while (i < path.length && path[i] === "/") {
        i++;
      }
    }
  }

  let up = 0;
  for (i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (part === ".") {
      parts.splice(i, 1);
    } else if (part === "..") {
      up++;
    } else if (up > 0) {
      if (part === "") {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join("/");

  if (path === "") {
    path = isAbsolute ? "/" : ".";
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
});
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  const aPathUrl = urlParse(aPath);
  const aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || "/";
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  const joined = aPath.charAt(0) === "/"
    ? aPath
    : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function(aPath) {
  return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, "");

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  let level = 0;
  while (aPath.indexOf(aRoot + "/") !== 0) {
    const index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

const supportsNullProto = (function() {
  const obj = Object.create(null);
  return !("__proto__" in obj);
}());

function identity(s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return "$" + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  const length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  /* eslint-disable no-multi-spaces */
  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }
  /* eslint-enable no-multi-spaces */

  for (let i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  let cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  let cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  let cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || "";

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
      sourceRoot += "/";
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    const parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      const index = parsed.path.lastIndexOf("/");
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;

},{}],17:[function(require,module,exports){
const readWasm = require("../lib/read-wasm");

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.lastGeneratedColumn = null;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

let cachedWasm = null;

module.exports = function wasm() {
  if (cachedWasm) {
    return cachedWasm;
  }

  const callbackStack = [];

  cachedWasm = readWasm().then(buffer => {
      return WebAssembly.instantiate(buffer, {
        env: {
          mapping_callback(
            generatedLine,
            generatedColumn,

            hasLastGeneratedColumn,
            lastGeneratedColumn,

            hasOriginal,
            source,
            originalLine,
            originalColumn,

            hasName,
            name
          ) {
            const mapping = new Mapping();
            // JS uses 1-based line numbers, wasm uses 0-based.
            mapping.generatedLine = generatedLine + 1;
            mapping.generatedColumn = generatedColumn;

            if (hasLastGeneratedColumn) {
              // JS uses inclusive last generated column, wasm uses exclusive.
              mapping.lastGeneratedColumn = lastGeneratedColumn - 1;
            }

            if (hasOriginal) {
              mapping.source = source;
              // JS uses 1-based line numbers, wasm uses 0-based.
              mapping.originalLine = originalLine + 1;
              mapping.originalColumn = originalColumn;

              if (hasName) {
                mapping.name = name;
              }
            }

            callbackStack[callbackStack.length - 1](mapping);
          },

          start_all_generated_locations_for() { console.time("all_generated_locations_for"); },
          end_all_generated_locations_for() { console.timeEnd("all_generated_locations_for"); },

          start_compute_column_spans() { console.time("compute_column_spans"); },
          end_compute_column_spans() { console.timeEnd("compute_column_spans"); },

          start_generated_location_for() { console.time("generated_location_for"); },
          end_generated_location_for() { console.timeEnd("generated_location_for"); },

          start_original_location_for() { console.time("original_location_for"); },
          end_original_location_for() { console.timeEnd("original_location_for"); },

          start_parse_mappings() { console.time("parse_mappings"); },
          end_parse_mappings() { console.timeEnd("parse_mappings"); },

          start_sort_by_generated_location() { console.time("sort_by_generated_location"); },
          end_sort_by_generated_location() { console.timeEnd("sort_by_generated_location"); },

          start_sort_by_original_location() { console.time("sort_by_original_location"); },
          end_sort_by_original_location() { console.timeEnd("sort_by_original_location"); },
        }
      });
  }).then(Wasm => {
    return {
      exports: Wasm.instance.exports,
      withMappingCallback: (mappingCallback, f) => {
        callbackStack.push(mappingCallback);
        try {
          f();
        } finally {
          callbackStack.pop();
        }
      }
    };
  }).then(null, e => {
    cachedWasm = null;
    throw e;
  });

  return cachedWasm;
};

},{"../lib/read-wasm":12}],18:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require("./lib/source-map-generator").SourceMapGenerator;
exports.SourceMapConsumer = require("./lib/source-map-consumer").SourceMapConsumer;
exports.SourceNode = require("./lib/source-node").SourceNode;

},{"./lib/source-map-consumer":13,"./lib/source-map-generator":14,"./lib/source-node":15}],19:[function(require,module,exports){
const template = require('./template')

function normalizeInput (input) {
  if (typeof input === 'string') return template(input)
  return input
}

function appendInput (tree, input) {
  if (Array.isArray(input)) {
    input.forEach(node => tree.push(node))
  } else {
    tree.push(input)
  }
}

module.exports = function append (tree, input) {
  input = normalizeInput(input)
  if (Array.isArray(tree)) {
    appendInput(tree, input)
  } else if (Array.isArray(tree.body)) {
    appendInput(tree.body, input)
  }
  return tree
}

},{"./template":137}],20:[function(require,module,exports){
const find = require('./find')

module.exports = function count (tree, selector) {
  return find(tree, selector).length
}

},{"./find":23}],21:[function(require,module,exports){
const find = require('./find')

module.exports = function each (tree, selector, callback) {
  return find(tree, selector).forEach(callback)
}

},{"./find":23}],22:[function(require,module,exports){
function getValue (object, key) {
  if (typeof object[key] !== 'undefined') return object[key]

  key = ('' + key).split('.')
  for (let i = 0; i < key.length; i++) {
    object = object[key[i]]
    if (typeof object === 'undefined') return
  }
  return object
};

function isPlainObject (object) {
  return Object.prototype.toString.call(object) === '[object Object]'
}

function compare (node, criterias) {
  for (const key in criterias) {
    if (Object.prototype.hasOwnProperty.call(criterias, key)) {
      const value1 = getValue(node, key)
      const value2 = getValue(criterias, key)
      if ({}.toString.call(value2) === '[object RegExp]') {
        if (!value2.test(value1)) return false
      } else if (isPlainObject(value2)) {
        if (!compare(value1, value2)) return false
      } else if (Array.isArray(value2) && Array.isArray(value1)) {
        for (let i = value2.length - 1; i >= 0; i--) {
          if (value1.indexOf(value2[i]) < 0) return false
        }
      } else if (Array.isArray(value2)) {
        return false
      } else if (Array.isArray(value1)) {
        if (value1.indexOf(value2) < 0) return false
      } else {
        if (value1 !== value2) return false
      }
    }
  }

  return true
};

module.exports = function equal (node, criterias) {
  return compare(node, criterias)
}

},{}],23:[function(require,module,exports){
const walk = require('../walk')
const equal = require('../equal')
const TYPES = require('../../types.json')
const esquery = require('esquery')

function isTypeSelector (selector) {
  return TYPES.includes(selector)
}

function isWildcardSelector (selector) {
  return selector === '*'
}

function isQuerySelector (selector) {
  return typeof selector === 'string'
}

function findByType (tree, selector) {
  return findByComparison(tree, { type: selector })
}

function findByWildcard (tree) {
  const nodes = []
  walk(tree, (node) => {
    nodes.push(node)
  })
  return nodes
}

function findByQuery (tree, selector) {
  return esquery(tree, selector)
}

function findByComparison (tree, selector) {
  const nodes = []
  walk(tree, (node) => {
    if (equal(node, selector)) {
      nodes.push(node)
    }
  })
  return nodes
}

module.exports = function find (tree, selector) {
  if (isTypeSelector(selector)) {
    return findByType(tree, selector)
  }
  if (isWildcardSelector(selector)) {
    return findByWildcard(tree)
  }
  if (isQuerySelector(selector)) {
    return findByQuery(tree, selector)
  }
  return findByComparison(tree, selector)
}

},{"../../types.json":142,"../equal":22,"../walk":141,"esquery":170}],24:[function(require,module,exports){
const find = require('./find')

module.exports = function first (tree, selector) {
  return find(tree, selector)[0]
}

},{"./find":23}],25:[function(require,module,exports){
const astring = require("astring")

const generator = {
  JSXElement(node, state) {
    state.write("<")
    this[node.openingElement.type](node.openingElement, state)
    if (node.closingElement) {
      state.write(">")
      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i]
        this[child.type](child, state)
      }
      state.write("</")
      this[node.closingElement.type](node.closingElement, state)
      state.write(">")
    } else {
      state.write(" />")
    }
  },
  JSXOpeningElement(node, state) {
    this[node.name.type](node.name, state)
    for (let i = 0; i < node.attributes.length; i += 1) {
      const attribute = node.attributes[i]
      this[attribute.type](attribute, state)
    }
  },
  JSXClosingElement(node, state) {
    this[node.name.type](node.name, state)
  },
  JSXIdentifier(node, state) {
    state.write(node.name)
  },
  JSXText(node, state) {
    state.write(node.value)
  },
  JSXMemberExpression(node, state) {
    this[node.object.type](node.object, state)
    state.write(".")
    this[node.property.type](node.property, state)
  },
  JSXAttribute(node, state) {
    state.write(" ")
    this[node.name.type](node.name, state)
    state.write("=")
    this[node.value.type](node.value, state)
  },
  JSXNamespacedName(node, state) {
    this[node.namespace.type](node.namespace, state)
    state.write(":")
    this[node.name.type](node.name, state)
  },
  JSXExpressionContainer(node, state) {
    state.write("{")
    this[node.expression.type](node.expression, state)
    state.write("}")
  },
  ...astring.GENERATOR,
}

module.exports = function generate(tree, options = {}) {
  return astring.generate(tree, { generator, ...options })
}

},{"astring":169}],26:[function(require,module,exports){
const count = require('./count')
const traverse = require('./traverse')
const equal = require('./equal')

module.exports = function has (tree, selector) {
  if (typeof selector === 'string') {
    return count(tree, selector) > 0
  }
  let found = false
  traverse(tree, {
    enter (node) {
      if (equal(node, selector)) {
        found = true
        return this.break()
      }
    }
  })
  return found
}

},{"./count":20,"./equal":22,"./traverse":139}],27:[function(require,module,exports){
// An IIFE (Immediately Invoked Function Expression)
// is a JavaScript function that runs as soon as it is defined.

module.exports = function iife (body) {
  body = Array.isArray(body) ? body : [body].filter(Boolean)
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'FunctionExpression',
        id: null,
        params: [],
        body: {
          type: 'BlockStatement',
          body
        },
        async: false,
        generator: false
      },
      arguments: []
    }
  }
}

},{}],28:[function(require,module,exports){
const find = require('./find')

module.exports = function last (tree, selector) {
  const nodes = find(tree, selector)
  return nodes[nodes.length - 1]
}

},{"./find":23}],29:[function(require,module,exports){
const walk = require('./walk')

module.exports = function mark (tree) {
  let cid = 1
  walk(tree, node => {
    node.cid = cid
    cid += 1
  })
}

},{"./walk":141}],30:[function(require,module,exports){
const equal = require('./equal')

function buildNodeFromAttribute (selector) {
  const [start, end] = selector.split('=')
  const startIndex = start.startsWith('[') ? 1 : 0
  const endIndex = end.endsWith(']') ? end.length - 1 : end.length
  const key = start.substring(startIndex)
  const value = JSON.parse(end.substring(0, endIndex))
  return { [key]: value }
}

function buildNodeFromAttributes (selector) {
  const attributes = selector.split('][')
  return attributes.reduce((object, attribute) => {
    return { ...object, ...buildNodeFromAttribute(attribute) }
  }, {})
}

function buildComplexNode (selector) {
  const index = selector.indexOf('[')
  const type = selector.substring(0, index)
  const attribute = selector.substring(index, selector.length)
  return { type, ...buildNodeFromAttributes(attribute) }
}

function buildNode (selector) {
  if (selector.startsWith('[')) {
    return buildNodeFromAttributes(selector)
  } else if (selector.includes('[')) {
    return buildComplexNode(selector)
  }
  return { type: selector }
}

function match (node, selector) {
  if (typeof selector === 'string') {
    return equal(node, buildNode(selector))
  }
  return equal(node, selector)
}

module.exports = match

},{"./equal":22}],31:[function(require,module,exports){
class ArrayExpression {
  constructor (param) {
    this.type = 'ArrayExpression'
    const options = Array.isArray(param) ? { elements: param } : param
    Object.assign(this, options)
  }
}

module.exports = ArrayExpression

},{}],32:[function(require,module,exports){
class ArrayPattern {
  constructor (options) {
    this.type = 'ArrayPattern'
    Object.assign(this, options)
  }
}

module.exports = ArrayPattern

},{}],33:[function(require,module,exports){
class AssignmentExpression {
  constructor (options) {
    this.type = 'AssignmentExpression'
    Object.assign(this, options)
  }
}

module.exports = AssignmentExpression

},{}],34:[function(require,module,exports){
class AssignmentOperator {
  constructor (options) {
    this.type = 'AssignmentOperator'
    Object.assign(this, options)
  }
}

module.exports = AssignmentOperator

},{}],35:[function(require,module,exports){
class AssignmentPattern {
  constructor (options) {
    this.type = 'AssignmentPattern'
    Object.assign(this, options)
  }
}

module.exports = AssignmentPattern

},{}],36:[function(require,module,exports){
class AwaitExpression {
  constructor (options) {
    this.type = 'AwaitExpression'
    Object.assign(this, options)
  }
}

module.exports = AwaitExpression

},{}],37:[function(require,module,exports){
class BigIntLiteral {
  constructor (options) {
    this.type = 'BigIntLiteral'
    Object.assign(this, options)
  }
}

module.exports = BigIntLiteral

},{}],38:[function(require,module,exports){
class BinaryExpression {
  constructor (options) {
    this.type = 'BinaryExpression'
    Object.assign(this, options)
  }
}

module.exports = BinaryExpression

},{}],39:[function(require,module,exports){
class BinaryOperator {
  constructor (options) {
    this.type = 'BinaryOperator'
    Object.assign(this, options)
  }
}

module.exports = BinaryOperator

},{}],40:[function(require,module,exports){
const Statement = require('./Statement')

class BlockStatement extends Statement {
  constructor (options) {
    super()
    this.type = 'BlockStatement'
    this.body = []
    Object.assign(this, options)
  }
}

module.exports = BlockStatement

},{"./Statement":100}],41:[function(require,module,exports){
class BreakStatement {
  constructor (options) {
    this.type = 'BreakStatement'
    Object.assign(this, options)
  }
}

module.exports = BreakStatement

},{}],42:[function(require,module,exports){
const Identifier = require('./Identifier')

class CallExpression {
  constructor (param, array) {
    this.type = 'CallExpression'
    const options = typeof param === 'string' ? { callee: new Identifier(param) } : param
    if (Array.isArray(array)) {
      options.arguments = array.map(param => {
        return typeof param === 'string' ? new Identifier(param) : param
      })
    }
    Object.assign(this, options)
  }
}

module.exports = CallExpression

},{"./Identifier":70}],43:[function(require,module,exports){
class CatchClause {
  constructor (options) {
    this.type = 'CatchClause'
    Object.assign(this, options)
  }
}

module.exports = CatchClause

},{}],44:[function(require,module,exports){
class ChainElement {
  constructor (options) {
    this.type = 'ChainElement'
    Object.assign(this, options)
  }
}

module.exports = ChainElement

},{}],45:[function(require,module,exports){
class ChainExpression {
  constructor (options) {
    this.type = 'ChainExpression'
    Object.assign(this, options)
  }
}

module.exports = ChainExpression

},{}],46:[function(require,module,exports){
class Class {
  constructor (options) {
    this.type = 'Class'
    Object.assign(this, options)
  }
}

module.exports = Class

},{}],47:[function(require,module,exports){
class ClassBody {
  constructor (options) {
    this.type = 'ClassBody'
    Object.assign(this, options)
  }
}

module.exports = ClassBody

},{}],48:[function(require,module,exports){
class ClassDeclaration {
  constructor (options) {
    this.type = 'ClassDeclaration'
    Object.assign(this, options)
  }
}

module.exports = ClassDeclaration

},{}],49:[function(require,module,exports){
class ClassExpression {
  constructor (options) {
    this.type = 'ClassExpression'
    Object.assign(this, options)
  }
}

module.exports = ClassExpression

},{}],50:[function(require,module,exports){
class ConditionalExpression {
  constructor (options) {
    this.type = 'ConditionalExpression'
    Object.assign(this, options)
  }
}

module.exports = ConditionalExpression

},{}],51:[function(require,module,exports){
class ContinueStatement {
  constructor (options) {
    this.type = 'ContinueStatement'
    Object.assign(this, options)
  }
}

module.exports = ContinueStatement

},{}],52:[function(require,module,exports){
class DebuggerStatement {
  constructor (options) {
    this.type = 'DebuggerStatement'
    Object.assign(this, options)
  }
}

module.exports = DebuggerStatement

},{}],53:[function(require,module,exports){
class Declaration {
  constructor (options) {
    this.type = 'Declaration'
    Object.assign(this, options)
  }
}

module.exports = Declaration

},{}],54:[function(require,module,exports){
class Directive {
  constructor (options) {
    this.type = 'Directive'
    Object.assign(this, options)
  }
}

module.exports = Directive

},{}],55:[function(require,module,exports){
class DoWhileStatement {
  constructor (options) {
    this.type = 'DoWhileStatement'
    Object.assign(this, options)
  }
}

module.exports = DoWhileStatement

},{}],56:[function(require,module,exports){
const Statement = require('./Statement')

class EmptyStatement extends Statement {
  constructor (options) {
    super()
    this.type = 'EmptyStatement'
    Object.assign(this, options)
  }
}

module.exports = EmptyStatement

},{"./Statement":100}],57:[function(require,module,exports){
class ExportAllDeclaration {
  constructor (options) {
    this.type = 'ExportAllDeclaration'
    Object.assign(this, options)
  }
}

module.exports = ExportAllDeclaration

},{}],58:[function(require,module,exports){
class ExportDefaultDeclaration {
  constructor (options) {
    this.type = 'ExportDefaultDeclaration'
    Object.assign(this, options)
  }
}

module.exports = ExportDefaultDeclaration

},{}],59:[function(require,module,exports){
class ExportNamedDeclaration {
  constructor (options) {
    this.type = 'ExportNamedDeclaration'
    Object.assign(this, options)
  }
}

module.exports = ExportNamedDeclaration

},{}],60:[function(require,module,exports){
class ExportSpecifier {
  constructor (options) {
    this.type = 'ExportSpecifier'
    Object.assign(this, options)
  }
}

module.exports = ExportSpecifier

},{}],61:[function(require,module,exports){
class Expression {
  constructor (options) {
    this.type = 'Expression'
    Object.assign(this, options)
  }
}

module.exports = Expression

},{}],62:[function(require,module,exports){
const Statement = require('./Statement')

class ExpressionStatement extends Statement {
  constructor (options) {
    super()
    this.type = 'ExpressionStatement'
    this.expression = null
    Object.assign(this, options)
  }
}

module.exports = ExpressionStatement

},{"./Statement":100}],63:[function(require,module,exports){
class ForInStatement {
  constructor (options) {
    this.type = 'ForInStatement'
    Object.assign(this, options)
  }
}

module.exports = ForInStatement

},{}],64:[function(require,module,exports){
class ForOfStatement {
  constructor (options) {
    this.type = 'ForOfStatement'
    Object.assign(this, options)
  }
}

module.exports = ForOfStatement

},{}],65:[function(require,module,exports){
class ForStatement {
  constructor (options) {
    this.type = 'ForStatement'
    Object.assign(this, options)
  }
}

module.exports = ForStatement

},{}],66:[function(require,module,exports){
class Function {
  constructor (options) {
    this.type = 'Function'
    this.generator = false
    Object.assign(this, options)
  }
}

module.exports = Function

},{}],67:[function(require,module,exports){
class FunctionBody {
  constructor (options) {
    this.type = 'FunctionBody'
    Object.assign(this, options)
  }
}

module.exports = FunctionBody

},{}],68:[function(require,module,exports){
class FunctionDeclaration {
  constructor (options) {
    this.type = 'FunctionDeclaration'
    Object.assign(this, options)
  }
}

module.exports = FunctionDeclaration

},{}],69:[function(require,module,exports){
class FunctionExpression {
  constructor (options) {
    this.type = 'FunctionExpression'
    Object.assign(this, options)
  }
}

module.exports = FunctionExpression

},{}],70:[function(require,module,exports){
class Identifier {
  constructor (param) {
    this.type = 'Identifier'
    const options = typeof param === 'string' ? { name: param } : param
    Object.assign(this, options)
  }
}

module.exports = Identifier

},{}],71:[function(require,module,exports){
const Statement = require('./Statement')

class IfStatement extends Statement {
  constructor (options) {
    super()
    this.type = 'IfStatement'
    this.test = null
    this.consequent = null
    this.alternate = null
    Object.assign(this, options)
  }
}

module.exports = IfStatement

},{"./Statement":100}],72:[function(require,module,exports){
class ImportDeclaration {
  constructor (options) {
    this.type = 'ImportDeclaration'
    Object.assign(this, options)
  }
}

module.exports = ImportDeclaration

},{}],73:[function(require,module,exports){
class ImportDefaultSpecifier {
  constructor (options) {
    this.type = 'ImportDefaultSpecifier'
    Object.assign(this, options)
  }
}

module.exports = ImportDefaultSpecifier

},{}],74:[function(require,module,exports){
class ImportExpression {
  constructor (options) {
    this.type = 'ImportExpression'
    Object.assign(this, options)
  }
}

module.exports = ImportExpression

},{}],75:[function(require,module,exports){
class ImportNamespaceSpecifier {
  constructor (options) {
    this.type = 'ImportNamespaceSpecifier'
    Object.assign(this, options)
  }
}

module.exports = ImportNamespaceSpecifier

},{}],76:[function(require,module,exports){
class ImportSpecifier {
  constructor (options) {
    this.type = 'ImportSpecifier'
    Object.assign(this, options)
  }
}

module.exports = ImportSpecifier

},{}],77:[function(require,module,exports){
class LabeledStatement {
  constructor (options) {
    this.type = 'LabeledStatement'
    Object.assign(this, options)
  }
}

module.exports = LabeledStatement

},{}],78:[function(require,module,exports){
const { isRegExp } = require('pure-conditions')

function isPrimitive (param) {
  return typeof param === 'string' || typeof param === 'number' || typeof param === 'boolean' || param === null
}

class Literal {
  constructor (param) {
    this.type = 'Literal'
    if (isRegExp(param)) {
      this.value = {}
      this.regex = {
        pattern: param.source || '',
        flags: param.flags || ''
      }
    } else {
      const options = isPrimitive(param) ? { value: param } : param
      Object.assign(this, options)
    }
  }
}

module.exports = Literal

},{"pure-conditions":191}],79:[function(require,module,exports){
class LogicalExpression {
  constructor (options) {
    this.type = 'LogicalExpression'
    Object.assign(this, options)
  }
}

module.exports = LogicalExpression

},{}],80:[function(require,module,exports){
class LogicalOperator {
  constructor (options) {
    this.type = 'LogicalOperator'
    Object.assign(this, options)
  }
}

module.exports = LogicalOperator

},{}],81:[function(require,module,exports){
class MemberExpression {
  constructor (options) {
    this.type = 'MemberExpression'
    this.computed = false
    Object.assign(this, options)
  }
}

module.exports = MemberExpression

},{}],82:[function(require,module,exports){
class MetaProperty {
  constructor (options) {
    this.type = 'MetaProperty'
    Object.assign(this, options)
  }
}

module.exports = MetaProperty

},{}],83:[function(require,module,exports){
class MethodDefinition {
  constructor (options) {
    this.type = 'MethodDefinition'
    Object.assign(this, options)
  }
}

module.exports = MethodDefinition

},{}],84:[function(require,module,exports){
class ModuleDeclaration {
  constructor (options) {
    this.type = 'ModuleDeclaration'
    Object.assign(this, options)
  }
}

module.exports = ModuleDeclaration

},{}],85:[function(require,module,exports){
class ModuleSpecifier {
  constructor (options) {
    this.type = 'ModuleSpecifier'
    Object.assign(this, options)
  }
}

module.exports = ModuleSpecifier

},{}],86:[function(require,module,exports){
class NewExpression {
  constructor (options) {
    this.type = 'NewExpression'
    Object.assign(this, options)
  }
}

module.exports = NewExpression

},{}],87:[function(require,module,exports){
class Node {
  constructor (options) {
    this.type = 'Node'
    this.loc = null
    Object.assign(this, options)
  }
}

module.exports = Node

},{}],88:[function(require,module,exports){
class ObjectExpression {
  constructor (options) {
    this.type = 'ObjectExpression'
    Object.assign(this, options)
  }
}

module.exports = ObjectExpression

},{}],89:[function(require,module,exports){
class ObjectPattern {
  constructor (options) {
    this.type = 'ObjectPattern'
    Object.assign(this, options)
  }
}

module.exports = ObjectPattern

},{}],90:[function(require,module,exports){
class Pattern {
  constructor (options) {
    this.type = 'Pattern'
    Object.assign(this, options)
  }
}

module.exports = Pattern

},{}],91:[function(require,module,exports){
class Position {
  constructor (options) {
    this.type = 'Position'
    Object.assign(this, options)
  }
}

module.exports = Position

},{}],92:[function(require,module,exports){
class Program {
  constructor (options) {
    this.type = 'Program'
    this.sourceType = 'script'
    this.body = []
    Object.assign(this, options)
  }
}

module.exports = Program

},{}],93:[function(require,module,exports){
class Property {
  constructor (options) {
    this.type = 'Property'
    Object.assign(this, options)
  }
}

module.exports = Property

},{}],94:[function(require,module,exports){
class RegExpLiteral {
  constructor (options) {
    this.type = 'RegExpLiteral'
    Object.assign(this, options)
  }
}

module.exports = RegExpLiteral

},{}],95:[function(require,module,exports){
class RestElement {
  constructor (options) {
    this.type = 'RestElement'
    Object.assign(this, options)
  }
}

module.exports = RestElement

},{}],96:[function(require,module,exports){
class ReturnStatement {
  constructor (options) {
    this.type = 'ReturnStatement'
    Object.assign(this, options)
  }
}

module.exports = ReturnStatement

},{}],97:[function(require,module,exports){
class SequenceExpression {
  constructor (options) {
    this.type = 'SequenceExpression'
    Object.assign(this, options)
  }
}

module.exports = SequenceExpression

},{}],98:[function(require,module,exports){
class SourceLocation {
  constructor (options) {
    this.type = 'SourceLocation'
    this.source = null
    this.start = null
    this.end = null
    Object.assign(this, options)
  }
}

module.exports = SourceLocation

},{}],99:[function(require,module,exports){
class SpreadElement {
  constructor (options) {
    this.type = 'SpreadElement'
    Object.assign(this, options)
  }
}

module.exports = SpreadElement

},{}],100:[function(require,module,exports){
class Statement {
  constructor (options) {
    this.type = 'Statement'
    Object.assign(this, options)
  }
}

module.exports = Statement

},{}],101:[function(require,module,exports){
class Super {
  constructor (options) {
    this.type = 'Super'
    Object.assign(this, options)
  }
}

module.exports = Super

},{}],102:[function(require,module,exports){
class SwitchCase {
  constructor (options) {
    this.type = 'SwitchCase'
    Object.assign(this, options)
  }
}

module.exports = SwitchCase

},{}],103:[function(require,module,exports){
class SwitchStatement {
  constructor (options) {
    this.type = 'SwitchStatement'
    Object.assign(this, options)
  }
}

module.exports = SwitchStatement

},{}],104:[function(require,module,exports){
class TaggedTemplateExpression {
  constructor (options) {
    this.type = 'TaggedTemplateExpression'
    Object.assign(this, options)
  }
}

module.exports = TaggedTemplateExpression

},{}],105:[function(require,module,exports){
class TemplateElement {
  constructor (options) {
    this.type = 'TemplateElement'
    Object.assign(this, options)
  }
}

module.exports = TemplateElement

},{}],106:[function(require,module,exports){
class TemplateLiteral {
  constructor (options) {
    this.type = 'TemplateLiteral'
    Object.assign(this, options)
  }
}

module.exports = TemplateLiteral

},{}],107:[function(require,module,exports){
class ThisExpression {
  constructor (options) {
    this.type = 'ThisExpression'
    Object.assign(this, options)
  }
}

module.exports = ThisExpression

},{}],108:[function(require,module,exports){
class ThrowStatement {
  constructor (options) {
    this.type = 'ThrowStatement'
    Object.assign(this, options)
  }
}

module.exports = ThrowStatement

},{}],109:[function(require,module,exports){
class TryStatement {
  constructor (options) {
    this.type = 'TryStatement'
    Object.assign(this, options)
  }
}

module.exports = TryStatement

},{}],110:[function(require,module,exports){
class UnaryExpression {
  constructor (options) {
    this.type = 'UnaryExpression'
    Object.assign(this, options)
  }
}

module.exports = UnaryExpression

},{}],111:[function(require,module,exports){
class UnaryOperator {
  constructor (options) {
    this.type = 'UnaryOperator'
    Object.assign(this, options)
  }
}

module.exports = UnaryOperator

},{}],112:[function(require,module,exports){
class UpdateExpression {
  constructor (options) {
    this.type = 'UpdateExpression'
    Object.assign(this, options)
  }
}

module.exports = UpdateExpression

},{}],113:[function(require,module,exports){
class UpdateOperator {
  constructor (options) {
    this.type = 'UpdateOperator'
    Object.assign(this, options)
  }
}

module.exports = UpdateOperator

},{}],114:[function(require,module,exports){
class VariableDeclaration {
  constructor (options) {
    this.type = 'VariableDeclaration'
    Object.assign(this, options)
  }
}

module.exports = VariableDeclaration

},{}],115:[function(require,module,exports){
class VariableDeclarator {
  constructor (options) {
    this.type = 'VariableDeclarator'
    Object.assign(this, options)
  }
}

module.exports = VariableDeclarator

},{}],116:[function(require,module,exports){
class WhileStatement {
  constructor (options) {
    this.type = 'WhileStatement'
    Object.assign(this, options)
  }
}

module.exports = WhileStatement

},{}],117:[function(require,module,exports){
class WithStatement {
  constructor (options) {
    this.type = 'WithStatement'
    Object.assign(this, options)
  }
}

module.exports = WithStatement

},{}],118:[function(require,module,exports){
class YieldExpression {
  constructor (options) {
    this.type = 'YieldExpression'
    Object.assign(this, options)
  }
}

module.exports = YieldExpression

},{}],119:[function(require,module,exports){
const OPERATORS = ['+', '-', '*', '/', '%', '**', '===', '==', '!=', '!==', '>', '<', '>=', '<=', '&', '|', '^', '<<', '>>']

function isOperatorSupported (operator) {
  return OPERATORS.includes(operator)
}

function calculate (operator, left, right) {
  switch (operator) {
    case '+': return left + right
    case '-': return left - right
    case '*': return left * right
    case '/': return left / right
    case '%': return left % right
    case '**': return left ** right
    case '==': return left == right
    case '===': return left === right
    case '>': return left > right
    case '<': return left < right
    case '>=': return left >= right
    case '<=': return left <= right
    case '!==': return left !== right
    case '!=': return left != right
    case '&': return left & right
    case '|': return left | right
    case '^': return left ^ right
    case '<<': return left << right
    case '>>': return left >> right
  }
}

module.exports = function binaryExpressionReduction (node) {
  if (node.type === 'BinaryExpression') {
    if (node.left.type === 'BinaryExpression' && isOperatorSupported(node.left.operator)) {
      node.left = binaryExpressionReduction(node.left)
    }
    if (node.right.type === 'BinaryExpression' && isOperatorSupported(node.right.operator)) {
      node.right = binaryExpressionReduction(node.right)
    }
    if (node.left.type === 'Literal' && node.right.type === 'Literal' && isOperatorSupported(node.operator)) {
      return { type: 'Literal', value: calculate(node.operator, node.left.value, node.right.value) }
    }
  }
  return node
}

},{}],120:[function(require,module,exports){
function getBody (node) {
  if (node && node.type === 'BlockStatement') {
    if (node.body.length === 1) {
      return node.body[0]
    }
    return node.body
  }
  return node
}

const isNodeTruthy = require('./utilities/isNodeTruthy')

module.exports = function ifStatementRemoval (node) {
  if (node.type === 'IfStatement') {
    const truthy = isNodeTruthy(node.test)
    if (typeof truthy === 'boolean') {
      if (truthy) {
        return getBody(node.consequent)
      } else {
        return getBody(node.alternate)
      }
    }
  }
  return node
}

},{"./utilities/isNodeTruthy":127}],121:[function(require,module,exports){
const isGlobalProperty = require('./utilities/isGlobalProperty')

const LOGICAL_OPERATORS = ['&&', '||', '??']

function isLogicalOperator (operator) {
  return LOGICAL_OPERATORS.includes(operator)
}

function getGlobalProperty (name) {
  switch (name) {
    case 'Infinity': return Infinity
    case 'NaN': return NaN
    case 'undefined': return undefined
    case 'null': return null
  }
}

function getNodeValue (node) {
  return isGlobalProperty(node) ? getGlobalProperty(node.name) : node.value
}

function identifier (name) {
  return { type: 'Identifier', name }
}

function literal (value) {
  return { type: 'Literal', value }
}

function serialize (value) {
  switch (value) {
    case Infinity: return identifier('Infinity')
    case NaN: return identifier('NaN')
    case undefined: return identifier('undefined')
    case null: return identifier('null')
    default: return literal(value)
  }
}

function evaluate (operator, left, right) {
  switch (operator) {
    case '&&': return serialize(left && right)
    case '||': return serialize(left || right)
    case '??': return serialize(left ?? right)
  }
}

function isNodeSupported (node) {
  return node.type === 'Literal' || isGlobalProperty(node)
}

module.exports = function logicalExpressionReduction (node) {
  if (node.type === 'LogicalExpression' &&
    isNodeSupported(node.left) &&
    isNodeSupported(node.right) &&
    isLogicalOperator(node.operator)) {
    return evaluate(node.operator, getNodeValue(node.left), getNodeValue(node.right))
  }
  return node
}

},{"./utilities/isGlobalProperty":126}],122:[function(require,module,exports){
module.exports = function memberExpressionReduction (node) {
  if (
    node.type === 'MemberExpression' &&
    node.object.type === 'ObjectExpression' &&
    node.property.type === 'Identifier'
  ) {
    const property = node.object.properties.find(property => property.key.type === 'Identifier' && property.key.name === node.property.name)
    if (property && property.value.type === 'Literal') {
      return property.value
    }
  }
  return node
}

},{}],123:[function(require,module,exports){
function isComparisonOperator (operator) {
  return (/^(==|===|!=|!==|<|>|<=|>=)$/).test(operator)
}

function getNegatedOperator (operator) {
  if (operator === '===') return '!=='
  if (operator === '<') return '>='
  if (operator === '>') return '<='
  if (operator === '>=') return '<'
  if (operator === '<=') return '>'
  if (operator === '==') return '!='
  if (operator === '!=') return '=='
  if (operator === '!==') return '==='
}

module.exports = function negationOperatorRemoval (node) {
  if (
    node.type === 'UnaryExpression' &&
    node.operator === '!' &&
    node.argument.type === 'BinaryExpression' &&
    isComparisonOperator(node.argument.operator)
  ) {
    node.argument.operator = getNegatedOperator(node.argument.operator)
    return node.argument
  }
  return node
}

},{}],124:[function(require,module,exports){
const isNodeTruthy = require('./utilities/isNodeTruthy')

function isTruthy (value) {
  return !!value
}

module.exports = function ternaryOperatorReduction (node) {
  if (node.type === 'ConditionalExpression') {
    const truthy = isNodeTruthy(node.test)
    if (typeof truthy === 'boolean') {
      if (truthy) {
        return node.consequent
      } else {
        return node.alternate
      }
    }
  }
  return node
}

},{"./utilities/isNodeTruthy":127}],125:[function(require,module,exports){
const isGlobalProperty = require('./utilities/isGlobalProperty')

function getTypeOfGlobalProperty (name) {
  switch (name) {
    case 'Infinity': return typeof Infinity
    case 'NaN': return typeof NaN
    case 'undefined': return typeof undefined
    case 'null': return typeof null
  }
}

module.exports = function typeofOperatorReduction (node) {
  if (node.type === 'UnaryExpression' && node.operator === 'typeof') {
    if (node.argument.type === 'Literal') {
      return { type: 'Literal', value: typeof node.argument.value }
    } else if (node.argument.type === 'ArrayExpression') {
      return { type: 'Literal', value: typeof [] }
    } else if (node.argument.type === 'ObjectExpression') {
      return { type: 'Literal', value: typeof {} }
    } else if (isGlobalProperty(node.argument)) {
      return { type: 'Literal', value: getTypeOfGlobalProperty(node.argument.name) }
    }
  }
  return node
}

},{"./utilities/isGlobalProperty":126}],126:[function(require,module,exports){
const GLOBAL_PROPERTIES = ['Infinity', 'NaN', 'undefined', 'null']

module.exports = function isGlobalProperty (node) {
  return node.type === 'Identifier' && GLOBAL_PROPERTIES.includes(node.name)
}

},{}],127:[function(require,module,exports){
const truthyValues = ['Infinity']
const falsyValues = ['undefined', 'NaN']

function isTruthy (value) {
  return !!value
}

module.exports = function isNodeTruthy (node) {
  if (node.type === 'Literal') {
    return isTruthy(node.value)
  } else if (node.type === 'ArrayExpression' || node.type === 'ObjectExpression') {
    return true
  } else if (node.type === 'Identifier' && truthyValues.includes(node.name)) {
    return true
  } else if (node.type === 'Identifier' && falsyValues.includes(node.name)) {
    return false
  } else if (node.type === 'UnaryExpression') {
    if (node.operator === 'void') {
      return false
    } else if (node.operator === '-' && node.argument.type === 'Identifier' && truthyValues.includes(node.argument.name)) {
      return true
    }
  } else if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return isTruthy(node.quasis[0].value.raw)
  }
}

},{}],128:[function(require,module,exports){
const meriyah = require('meriyah')

module.exports = function parse (source, options) {
  return meriyah.parseModule(source, options)
}

},{"meriyah":171}],129:[function(require,module,exports){
const template = require('./template')

function normalizeInput (input) {
  if (typeof input === 'string') return template(input)
  return input
}

function prependNode (tree, input) {
  if (Array.isArray(input)) {
    input.reverse().forEach(node => tree.unshift(node))
  } else {
    tree.unshift(input)
  }
}

module.exports = function prepend (tree, input) {
  input = normalizeInput(input)
  if (Array.isArray(tree)) {
    prependNode(tree, input)
  } else if (Array.isArray(tree.body)) {
    prependNode(tree.body, input)
  }
  return tree
}

},{"./template":137}],130:[function(require,module,exports){
module.exports = function program (body, options) {
  body = Array.isArray(body) ? body : [body].filter(Boolean)
  return {
    type: 'Program',
    sourceType: 'module',
    body,
    ...options
  }
}

},{}],131:[function(require,module,exports){
const walk = require('./walk')

module.exports = function (tree, callback, accumulator) {
  walk(tree, node => {
    accumulator = callback(accumulator, node)
  })
  return accumulator
}

},{"./walk":141}],132:[function(require,module,exports){
const estraverse = require("./traverse/estraverse")
const find = require("./find")
const equal = require("./equal")

function removeBySelector(tree, selector, options) {
  const nodes = find(tree, selector)
  removeByNode(
    tree,
    (leaf) => {
      for (let i = 0, ilen = nodes.length; i < ilen; i += 1) {
        if (equal(leaf, nodes[i])) {
          return true
        }
      }
      return false
    },
    options
  )
}

function removeByCallback(tree, callback, options) {
  estraverse.replace(tree, {
    enter(current, parent) {
      if (callback(current, parent) === null) {
        return this.remove()
      }
    },
    leave(current, parent) {
      if (isNodeEmpty(current, parent)) {
        return this.remove()
      }
    },
  })
}

function removeByNode(tree, compare, options) {
  let count = 0
  estraverse.replace(tree, {
    enter(current) {
      if (options.first && count === 1) {
        return this.break()
      }
      if (compare(current)) {
        count += 1
        return this.remove()
      }
    },
    leave(current) {
      if (isNodeEmpty(current)) {
        return this.remove()
      }
    },
  })
}

function isExpressionEmpty(node) {
  return node.expression === null
}

function isVariableDeclarationEmpty(node) {
  return node.type === "VariableDeclaration" && node.declarations.length === 0
}

function isNodeEmpty(node) {
  return isExpressionEmpty(node) || isVariableDeclarationEmpty(node)
}

module.exports = function remove(tree, handle, options = {}) {
  if (typeof handle === "string") {
    return removeBySelector(tree, handle, options)
  } else if (typeof handle === "function") {
    return removeByCallback(tree, handle, options)
  }
  removeByNode(tree, (node) => equal(node, handle), options)
}

},{"./equal":22,"./find":23,"./traverse/estraverse":140}],133:[function(require,module,exports){
const estraverse = require("./traverse/estraverse")

function complexReplace(method, node, parent) {
  const replacement = method(node, parent)
  if (Array.isArray(replacement)) {
    parent.body = parent.body.reduce((result, leaf) => {
      return result.concat(node === leaf ? replacement : leaf)
    }, [])
  } else if (replacement) {
    return replacement
  } else if (replacement === null) {
    parent.body = parent.body
      .reduce((result, leaf) => {
        return result.concat(node === leaf ? null : leaf)
      }, [])
      .filter(Boolean)
  }
}

module.exports = function replace(tree, options) {
  const enter = typeof options === "function" ? options : options.enter
  const leave = options && options.leave
  return estraverse.replace(tree, {
    enter(node, parent) {
      if (enter) {
        const replacement = complexReplace(enter, node, parent)
        if (replacement) {
          return replacement
        }
      }
    },
    leave(node, parent) {
      if (leave) {
        const replacement = complexReplace(leave, node, parent)
        if (replacement) {
          return replacement
        }
      }
    },
  })
}

},{"./traverse/estraverse":140}],134:[function(require,module,exports){
function serializeObjectExpression (node) {
  const object = {}
  node.properties.forEach(property => {
    const key = property.key.name || property.key.value
    object[key] = serialize(property.value)
  })
  return object
}

const NEW_EXPRESSION_OBJECTS = {
  Map,
  Set,
  WeakMap,
  WeakSet,
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
}

function serializeNewExpression (node) {
  if (node.callee.type === 'Identifier') {
    const { name } = node.callee
    if (Object.keys(NEW_EXPRESSION_OBJECTS).includes(name)) {
      return new NEW_EXPRESSION_OBJECTS[name](node.arguments.map(serialize))
    }
  }
}

function serialize (node) {
  if (node.type === 'Literal') {
    if (node.regex) {
      return new RegExp(node.regex.pattern, node.regex.flags)
    }
    return node.value
  } else if (node.type === 'ArrayExpression') {
    return node.elements.map(serialize)
  } else if (node.type === 'ObjectExpression') {
    return serializeObjectExpression(node)
  } else if (node.type === 'NewExpression' && node.callee.type === 'Identifier') {
    const object = serializeNewExpression(node)
    if (object) {
      return object
    }
  } else if (node.type === 'CallExpression' && node.callee.name === 'Symbol') {
    return Symbol(...node.arguments.map(serialize))
  } else if (node.type === 'Identifier') {
    if (node.name === 'Infinity') {
      return Infinity
    } else if (node.name === 'NaN') {
      return NaN
    }
  }
}

module.exports = serialize

},{}],135:[function(require,module,exports){
const { SourceMapGenerator } = require('source-map')
const generate = require('./generate')

module.exports = function sourcemap (tree) {
  const map = new SourceMapGenerator({ file: 'UNKNOWN' })
  const source = generate(tree, { sourceMap: map })
  return { source, map: map.toString() }
}

},{"./generate":25,"source-map":18}],136:[function(require,module,exports){
/*
 * Based on:
 *
 * estemplate
 * https://github.com/RReverser/estemplate
 *
 * Copyright (c) 2014 Ingvar Stepanyan
 * Licensed under the MIT license.
 */

'use strict'

const parse = require('../parse')
const traverse = require('../traverse')
const replace = require('../replace')
const CODE_REGEXP = /([^\s,;]?)\s*?%(=?)\s*([\s\S]+?)\s*%\s*?([^\s,;]?)/g
const INTERNAL_VARIABLE_REGEXP = /^__ASTER_DATA_\d+$/
const INTERNAL_MARKER_REGEXP = /\"(__ASTER_DATA_\d+)\"/g
const BRACKETS = {
  '<': '>',
  '[': ']',
  '(': ')',
  '{': '}',
  "'": "'",
  '"': '"'
}
const SPREAD = {
  'ArrayExpression': 'elements',
  'CallExpression': 'arguments',
  'BlockStatement': 'body',
  'FunctionExpression': 'params',
  'FunctionDeclaration': 'params',
  'Program': 'body'
}

function template(string, options, data) {
  if (!data) {
    data = options
    options = undefined
  }
  return template.compile(string, options)(data)
}

function isInternalVariable(node) {
  return node.type === 'Identifier' && INTERNAL_VARIABLE_REGEXP.test(node.name)
}

function isInternalStatement(node) {
  return node.type === 'ExpressionStatement' && typeof node.expression === 'string'
}

template.modifyTree = function (ast) {
  traverse(ast, {
    leave (node, parent) {
      if (node.type !== '...') {
        return
      }
      var itemsKey = SPREAD[parent.type]
      if (!itemsKey) {
        throw new TypeError('Unknown substitution in ' + parent.type)
      }
      parent[itemsKey] = parent[itemsKey].reduce(function (items, item) {
        if (item.type === '...') {
          return items.concat(item.argument)
        }
        items.push(item)
        return items
      }, [])
    },
    keys: {
      '...': ['argument']
    }
  })
  return ast
}

template.compile = function (string, options) {
  var code = [],
    index = 0

  string = string.replace(CODE_REGEXP, function (match, open, isEval, codePart, close) {
    if (open) {
      var expectedClose = BRACKETS[open]
      if (!expectedClose || close && expectedClose !== close) {
        return match
      }
    }
    if (isEval) {
      var variableName = '__ASTER_DATA_' + (index++)
      var isSpread = open !== '<' && open !== "'" && open !== '"'
      if (isSpread) {
        codePart = '{type: "...", argument: ' + codePart + '}'
      } else if (open === "'" || open === '"') {
        codePart = '{type: "Literal", value: ' + codePart + '}'
      }
      code.push('\t\tvar ' + variableName + ' = ' + codePart)
      return isSpread ? (open + variableName + close) : variableName
    } else {
      if (open !== '<') {
        return match
      }
      code.push(codePart)
      return ''
    }
  })

  var tree = parse(string, options)

  replace(tree, {
    leave (node) {
      if (isInternalVariable(node)) {
        return node.name
      }

      if (isInternalStatement(node)) {
        return node.expression
      }
    }
  })

  if (!(options && options.fast)) {
    code.unshift('\twith (it) {')
    code.push('\t}')
  }

  code.unshift('return function template(it) {')

  code.push(
    '\treturn estemplate.modifyTree(' + JSON.stringify(tree).replace(INTERNAL_MARKER_REGEXP, '$1') + ')',
    '}'
  )

  return new Function('estemplate', code.join('\n'))(template)
}

module.exports = template

},{"../parse":128,"../replace":133,"../traverse":139}],137:[function(require,module,exports){
(function (Buffer){(function (){
const estemplate = require('./estemplate')
const parse = require('../parse')
const ArrayExpression = require('../nodes/ArrayExpression')
const Identifier = require('../nodes/Identifier')
const Literal = require('../nodes/Literal')
const UnaryExpression = require('../nodes/UnaryExpression')
// deprecated
const { builders } = require('ast-types')

const typedArrays = {
  Uint8Array: true,
  Int8Array: true,
  Uint8ClampedArray: true,
  Uint16Array: true,
  Int16Array: true,
  Uint32Array: true,
  Int32Array: true,
  Float32Array: true,
  Float64Array: true
}

function toAST (obj) {
  if (typeof obj === 'undefined') {
    return new UnaryExpression({
      operator: 'void',
      argument: new Literal(0),
      prefix: true
    })
  }

  if (typeof obj === 'number') {
    if (isNaN(obj)) { return new Identifier('NaN') }

    if (obj === Infinity) { return new Identifier('Infinity') }

    if (obj < 0) {
      return new UnaryExpression({
        operator: '-',
        argument: new Literal(-obj),
        prefix: true
      })
    }

    return new Literal(obj)
  }

  if (obj === null || typeof obj === 'string' || typeof obj === 'boolean') { return new Literal(obj) }

  if (typeof obj === 'function') {
    const source = obj.toString()

    try {
      return parse('x = ' + source).body[0].expression.right
    } catch (e) {
      return new Literal(null)
    }
  }

  if (Buffer.isBuffer(obj)) {
    return builders.newExpression(new Identifier('Buffer'), [
      new Literal(obj.toString('base64')),
      new Literal('base64')
    ])
  }

  if (Array.isArray(obj)) { return new ArrayExpression(obj.map(toAST)) }

  if (typeof obj === 'object') {
    const type = Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1]

    if (type === 'String' || type === 'Number' || type === 'Boolean') { return builders.newExpression(new Identifier(type), [toAST(obj.valueOf())]) }

    if (type === 'ArrayBuffer') {
      const buf = new Uint8Array(obj)

      let allZero = true
      for (let i = 0; i < buf.length; i++) {
        if (buf[i] !== 0) {
          allZero = false
          break
        }
      }

      if (allZero) { return builders.newExpression(new Identifier(type), [new Literal(obj.byteLength)]) }

      return builders.memberExpression(toAST(buf), new Identifier('buffer'))
    }

    if (typedArrays[type]) {
      return builders.newExpression(new Identifier(type), [
        new ArrayExpression(Array.prototype.slice.call(obj).map(toAST))
      ])
    }

    if (type === 'Date') {
      let d
      try {
        d = toAST(obj.toISOString())
      } catch (e) {
        d = toAST(NaN)
      }

      return builders.newExpression(new Identifier(type), [d])
    }

    if (type === 'Error') { return builders.newExpression(new Identifier(obj.constructor.name), [toAST(obj.message)]) }

    if (type === 'RegExp') { return new Literal(obj) }

    if (typeof obj.toAST === 'function') { return obj.toAST() }

    const properties = []
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        properties.push(builders.property('init', new Literal(key), toAST(obj[key])))
      }
    }

    return builders.objectExpression(properties)
  }

  throw new Error('Unsupported type to convert to AST')
}

module.exports = function template (source, options) {
  options = options || {}
  if (typeof source === 'string') {
    return estemplate(source, options).body
  }
  return toAST(source, options)
}

}).call(this)}).call(this,{"isBuffer":require("../../../../../../../../AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js")})
},{"../../../../../../../../AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js":2,"../nodes/ArrayExpression":31,"../nodes/Identifier":70,"../nodes/Literal":78,"../nodes/UnaryExpression":110,"../parse":128,"./estemplate":136,"ast-types":168}],138:[function(require,module,exports){
const ArrayExpression = require('../nodes/ArrayExpression')
const BinaryExpression = require('../nodes/BinaryExpression')
const Literal = require('../nodes/Literal')

module.exports = function toBinaryExpression (input) {
  const expression = Array.isArray(input) ? new ArrayExpression({ elements: input }) : input
  if (expression.type === 'ArrayExpression') {
    const { elements } = expression
    if (elements.length === 0) {
      return new Literal({ value: '' })
    }
    if (elements.length === 1) {
      return elements[0]
    }
    if (elements.length === 2) {
      return new BinaryExpression({
        operator: '+',
        left: elements[0],
        right: elements[1]
      })
    }
    if (elements.length >= 3) {
      let expression = new BinaryExpression({
        operator: '+',
        left: elements[0],
        right: elements[1]
      })
      for (let index = 2; index < elements.length; index += 1) {
        expression = new BinaryExpression({
          operator: '+',
          left: expression,
          right: elements[index]
        })
      }
      return expression
    }
  }
  return expression
}

},{"../nodes/ArrayExpression":31,"../nodes/BinaryExpression":38,"../nodes/Literal":78}],139:[function(require,module,exports){
const estraverse = require("./traverse/estraverse")

module.exports = function traverse(tree, options) {
  return estraverse.traverse(tree, options)
}

},{"./traverse/estraverse":140}],140:[function(require,module,exports){
/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

let Syntax, VisitorKeys, BREAK, SKIP, REMOVE, VisitorOption

Syntax = {
  AssignmentExpression: "AssignmentExpression",
  AssignmentPattern: "AssignmentPattern",
  ArrayExpression: "ArrayExpression",
  ArrayPattern: "ArrayPattern",
  ArrowFunctionExpression: "ArrowFunctionExpression",
  AwaitExpression: "AwaitExpression", // CAUTION: It's deferred to ES7.
  BlockStatement: "BlockStatement",
  BinaryExpression: "BinaryExpression",
  BreakStatement: "BreakStatement",
  CallExpression: "CallExpression",
  CatchClause: "CatchClause",
  ChainExpression: "ChainExpression",
  ClassBody: "ClassBody",
  ClassDeclaration: "ClassDeclaration",
  ClassExpression: "ClassExpression",
  ComprehensionBlock: "ComprehensionBlock", // CAUTION: It's deferred to ES7.
  ComprehensionExpression: "ComprehensionExpression", // CAUTION: It's deferred to ES7.
  ConditionalExpression: "ConditionalExpression",
  ContinueStatement: "ContinueStatement",
  DebuggerStatement: "DebuggerStatement",
  DirectiveStatement: "DirectiveStatement",
  DoWhileStatement: "DoWhileStatement",
  EmptyStatement: "EmptyStatement",
  ExportAllDeclaration: "ExportAllDeclaration",
  ExportDefaultDeclaration: "ExportDefaultDeclaration",
  ExportNamedDeclaration: "ExportNamedDeclaration",
  ExportSpecifier: "ExportSpecifier",
  ExpressionStatement: "ExpressionStatement",
  ForStatement: "ForStatement",
  ForInStatement: "ForInStatement",
  ForOfStatement: "ForOfStatement",
  FunctionDeclaration: "FunctionDeclaration",
  FunctionExpression: "FunctionExpression",
  GeneratorExpression: "GeneratorExpression", // CAUTION: It's deferred to ES7.
  Identifier: "Identifier",
  IfStatement: "IfStatement",
  ImportExpression: "ImportExpression",
  ImportDeclaration: "ImportDeclaration",
  ImportDefaultSpecifier: "ImportDefaultSpecifier",
  ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
  ImportSpecifier: "ImportSpecifier",
  Literal: "Literal",
  LabeledStatement: "LabeledStatement",
  LogicalExpression: "LogicalExpression",
  MemberExpression: "MemberExpression",
  MetaProperty: "MetaProperty",
  MethodDefinition: "MethodDefinition",
  ModuleSpecifier: "ModuleSpecifier",
  NewExpression: "NewExpression",
  ObjectExpression: "ObjectExpression",
  ObjectPattern: "ObjectPattern",
  PrivateIdentifier: "PrivateIdentifier",
  Program: "Program",
  Property: "Property",
  PropertyDefinition: "PropertyDefinition",
  RestElement: "RestElement",
  ReturnStatement: "ReturnStatement",
  SequenceExpression: "SequenceExpression",
  SpreadElement: "SpreadElement",
  Super: "Super",
  SwitchStatement: "SwitchStatement",
  SwitchCase: "SwitchCase",
  TaggedTemplateExpression: "TaggedTemplateExpression",
  TemplateElement: "TemplateElement",
  TemplateLiteral: "TemplateLiteral",
  ThisExpression: "ThisExpression",
  ThrowStatement: "ThrowStatement",
  TryStatement: "TryStatement",
  UnaryExpression: "UnaryExpression",
  UpdateExpression: "UpdateExpression",
  VariableDeclaration: "VariableDeclaration",
  VariableDeclarator: "VariableDeclarator",
  WhileStatement: "WhileStatement",
  WithStatement: "WithStatement",
  YieldExpression: "YieldExpression",

  JSXElement: "JSXElement",
  JSXOpeningElement: "JSXOpeningElement",
  JSXClosingElement: "JSXClosingElement",
  JSXIdentifier: "JSXIdentifier",
  JSXTest: "JSXText",
  JSXMemberExpression: "JSXMemberExpression",
  JSXAttribute: "JSXAttribute",
  JSXNamespacedName: "JSXNamespacedName",
  JSXExpressionContainer: "JSXExpressionContainer",
}

VisitorKeys = {
  AssignmentExpression: ["left", "right"],
  AssignmentPattern: ["left", "right"],
  ArrayExpression: ["elements"],
  ArrayPattern: ["elements"],
  ArrowFunctionExpression: ["params", "body"],
  AwaitExpression: ["argument"], // CAUTION: It's deferred to ES7.
  BlockStatement: ["body"],
  BinaryExpression: ["left", "right"],
  BreakStatement: ["label"],
  CallExpression: ["callee", "arguments"],
  CatchClause: ["param", "body"],
  ChainExpression: ["expression"],
  ClassBody: ["body"],
  ClassDeclaration: ["id", "superClass", "body"],
  ClassExpression: ["id", "superClass", "body"],
  ComprehensionBlock: ["left", "right"], // CAUTION: It's deferred to ES7.
  ComprehensionExpression: ["blocks", "filter", "body"], // CAUTION: It's deferred to ES7.
  ConditionalExpression: ["test", "consequent", "alternate"],
  ContinueStatement: ["label"],
  DebuggerStatement: [],
  DirectiveStatement: [],
  DoWhileStatement: ["body", "test"],
  EmptyStatement: [],
  ExportAllDeclaration: ["source"],
  ExportDefaultDeclaration: ["declaration"],
  ExportNamedDeclaration: ["declaration", "specifiers", "source"],
  ExportSpecifier: ["exported", "local"],
  ExpressionStatement: ["expression"],
  ForStatement: ["init", "test", "update", "body"],
  ForInStatement: ["left", "right", "body"],
  ForOfStatement: ["left", "right", "body"],
  FunctionDeclaration: ["id", "params", "body"],
  FunctionExpression: ["id", "params", "body"],
  GeneratorExpression: ["blocks", "filter", "body"], // CAUTION: It's deferred to ES7.
  Identifier: [],
  IfStatement: ["test", "consequent", "alternate"],
  ImportExpression: ["source"],
  ImportDeclaration: ["specifiers", "source"],
  ImportDefaultSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportSpecifier: ["imported", "local"],
  Literal: [],
  LabeledStatement: ["label", "body"],
  LogicalExpression: ["left", "right"],
  MemberExpression: ["object", "property"],
  MetaProperty: ["meta", "property"],
  MethodDefinition: ["key", "value"],
  ModuleSpecifier: [],
  NewExpression: ["callee", "arguments"],
  ObjectExpression: ["properties"],
  ObjectPattern: ["properties"],
  PrivateIdentifier: [],
  Program: ["body"],
  Property: ["key", "value"],
  PropertyDefinition: ["key", "value"],
  RestElement: ["argument"],
  ReturnStatement: ["argument"],
  SequenceExpression: ["expressions"],
  SpreadElement: ["argument"],
  Super: [],
  SwitchStatement: ["discriminant", "cases"],
  SwitchCase: ["test", "consequent"],
  TaggedTemplateExpression: ["tag", "quasi"],
  TemplateElement: [],
  TemplateLiteral: ["quasis", "expressions"],
  ThisExpression: [],
  ThrowStatement: ["argument"],
  TryStatement: ["block", "handler", "finalizer"],
  UnaryExpression: ["argument"],
  UpdateExpression: ["argument"],
  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id", "init"],
  WhileStatement: ["test", "body"],
  WithStatement: ["object", "body"],
  YieldExpression: ["argument"],

  JSXElement: ["openingElement", "closingElement", "children"],
  JSXOpeningElement: ["name"],
  JSXClosingElement: ["name"],
  JSXIdentifier: [],
  JSXText: [],
  JSXMemberExpression: ["object", "property"],
  JSXAttribute: ["name", "value"],
  JSXNamespacedName: ["namespace", "name"],
  JSXExpressionContainer: ["expression"],
}

// unique id
BREAK = {}
SKIP = {}
REMOVE = {}

VisitorOption = {
  Break: BREAK,
  Skip: SKIP,
  Remove: REMOVE,
}

function Reference(parent, key) {
  this.parent = parent
  this.key = key
}

Reference.prototype.replace = function replace(node) {
  this.parent[this.key] = node
}

Reference.prototype.remove = function remove() {
  if (Array.isArray(this.parent)) {
    this.parent.splice(this.key, 1)
    return true
  } else {
    this.replace(null)
    return false
  }
}

function Element(node, path, wrap, ref) {
  this.node = node
  this.path = path
  this.wrap = wrap
  this.ref = ref
}

function Controller() {}

// API:
// return property path array from root to current node
Controller.prototype.path = function path() {
  var i, iz, j, jz, result, element

  function addToPath(result, path) {
    if (Array.isArray(path)) {
      for (j = 0, jz = path.length; j < jz; ++j) {
        result.push(path[j])
      }
    } else {
      result.push(path)
    }
  }

  // root node
  if (!this.__current.path) {
    return null
  }

  // first node is sentinel, second node is root element
  result = []
  for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
    element = this.__leavelist[i]
    addToPath(result, element.path)
  }
  addToPath(result, this.__current.path)
  return result
}

// API:
// return type of current node
Controller.prototype.type = function () {
  var node = this.current()
  return node.type || this.__current.wrap
}

// API:
// return array of parent elements
Controller.prototype.parents = function parents() {
  var i, iz, result

  // first node is sentinel
  result = []
  for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
    result.push(this.__leavelist[i].node)
  }

  return result
}

// API:
// return current node
Controller.prototype.current = function current() {
  return this.__current.node
}

Controller.prototype.__execute = function __execute(callback, element) {
  var previous, result

  result = undefined

  previous = this.__current
  this.__current = element
  this.__state = null
  if (callback) {
    result = callback.call(
      this,
      element.node,
      this.__leavelist[this.__leavelist.length - 1].node
    )
  }
  this.__current = previous

  return result
}

// API:
// notify control skip / break
Controller.prototype.notify = function notify(flag) {
  this.__state = flag
}

// API:
// skip child nodes of current node
Controller.prototype.skip = function () {
  this.notify(SKIP)
}

// API:
// break traversals
Controller.prototype["break"] = function () {
  this.notify(BREAK)
}

// API:
// remove node
Controller.prototype.remove = function () {
  this.notify(REMOVE)
}

Controller.prototype.__initialize = function (root, visitor) {
  this.visitor = visitor
  this.root = root
  this.__worklist = []
  this.__leavelist = []
  this.__current = null
  this.__state = null
  this.__fallback = null
  if (visitor.fallback === "iteration") {
    this.__fallback = Object.keys
  } else if (typeof visitor.fallback === "function") {
    this.__fallback = visitor.fallback
  }

  this.__keys = VisitorKeys
  if (visitor.keys) {
    this.__keys = Object.assign(Object.create(this.__keys), visitor.keys)
  }
}

function isNode(node) {
  if (node == null) {
    return false
  }
  return typeof node === "object" && typeof node.type === "string"
}

function isProperty(nodeType, key) {
  return (
    (nodeType === Syntax.ObjectExpression ||
      nodeType === Syntax.ObjectPattern) &&
    "properties" === key
  )
}

function candidateExistsInLeaveList(leavelist, candidate) {
  for (var i = leavelist.length - 1; i >= 0; --i) {
    if (leavelist[i].node === candidate) {
      return true
    }
  }
  return false
}

Controller.prototype.traverse = function traverse(root, visitor) {
  var worklist,
    leavelist,
    element,
    node,
    nodeType,
    ret,
    key,
    current,
    current2,
    candidates,
    candidate,
    sentinel

  this.__initialize(root, visitor)

  sentinel = {}

  // reference
  worklist = this.__worklist
  leavelist = this.__leavelist

  // initialize
  worklist.push(new Element(root, null, null, null))
  leavelist.push(new Element(null, null, null, null))

  while (worklist.length) {
    element = worklist.pop()

    if (element === sentinel) {
      element = leavelist.pop()

      ret = this.__execute(visitor.leave, element)

      if (this.__state === BREAK || ret === BREAK) {
        return
      }
      continue
    }

    if (element.node) {
      ret = this.__execute(visitor.enter, element)

      if (this.__state === BREAK || ret === BREAK) {
        return
      }

      worklist.push(sentinel)
      leavelist.push(element)

      if (this.__state === SKIP || ret === SKIP) {
        continue
      }

      node = element.node
      nodeType = node.type || element.wrap
      candidates = this.__keys[nodeType]
      if (!candidates) {
        if (this.__fallback) {
          candidates = this.__fallback(node)
        } else {
          // TODO we'd like to iterate through custom nodes too
          // we could try to deduce candidates
          throw new Error("Unknown node type " + nodeType + ".")
        }
      }

      current = candidates.length
      while ((current -= 1) >= 0) {
        key = candidates[current]
        candidate = node[key]
        if (!candidate) {
          continue
        }

        if (Array.isArray(candidate)) {
          current2 = candidate.length
          while ((current2 -= 1) >= 0) {
            if (!candidate[current2]) {
              continue
            }

            if (candidateExistsInLeaveList(leavelist, candidate[current2])) {
              continue
            }

            if (isProperty(nodeType, candidates[current])) {
              element = new Element(
                candidate[current2],
                [key, current2],
                "Property",
                null
              )
            } else if (isNode(candidate[current2])) {
              element = new Element(
                candidate[current2],
                [key, current2],
                null,
                null
              )
            } else {
              continue
            }
            worklist.push(element)
          }
        } else if (isNode(candidate)) {
          if (candidateExistsInLeaveList(leavelist, candidate)) {
            continue
          }

          worklist.push(new Element(candidate, key, null, null))
        }
      }
    }
  }
}

Controller.prototype.replace = function replace(root, visitor) {
  var worklist,
    leavelist,
    node,
    nodeType,
    target,
    element,
    current,
    current2,
    candidates,
    candidate,
    sentinel,
    outer,
    key

  function removeElem(element) {
    var i, key, nextElem, parent

    if (element.ref.remove()) {
      // When the reference is an element of an array.
      key = element.ref.key
      parent = element.ref.parent

      // If removed from array, then decrease following items' keys.
      i = worklist.length
      while (i--) {
        nextElem = worklist[i]
        if (nextElem.ref && nextElem.ref.parent === parent) {
          if (nextElem.ref.key < key) {
            break
          }
          --nextElem.ref.key
        }
      }
    }
  }

  this.__initialize(root, visitor)

  sentinel = {}

  // reference
  worklist = this.__worklist
  leavelist = this.__leavelist

  // initialize
  outer = {
    root: root,
  }
  element = new Element(root, null, null, new Reference(outer, "root"))
  worklist.push(element)
  leavelist.push(element)

  while (worklist.length) {
    element = worklist.pop()

    if (element === sentinel) {
      element = leavelist.pop()

      target = this.__execute(visitor.leave, element)

      // node may be replaced with null,
      // so distinguish between undefined and null in this place
      if (
        target !== undefined &&
        target !== BREAK &&
        target !== SKIP &&
        target !== REMOVE
      ) {
        // replace
        element.ref.replace(target)
      }

      if (this.__state === REMOVE || target === REMOVE) {
        removeElem(element)
      }

      if (this.__state === BREAK || target === BREAK) {
        return outer.root
      }
      continue
    }

    target = this.__execute(visitor.enter, element)

    // node may be replaced with null,
    // so distinguish between undefined and null in this place
    if (
      target !== undefined &&
      target !== BREAK &&
      target !== SKIP &&
      target !== REMOVE
    ) {
      // replace
      element.ref.replace(target)
      element.node = target
    }

    if (this.__state === REMOVE || target === REMOVE) {
      removeElem(element)
      element.node = null
    }

    if (this.__state === BREAK || target === BREAK) {
      return outer.root
    }

    // node may be null
    node = element.node
    if (!node) {
      continue
    }

    worklist.push(sentinel)
    leavelist.push(element)

    if (this.__state === SKIP || target === SKIP) {
      continue
    }

    nodeType = node.type || element.wrap
    candidates = this.__keys[nodeType]
    if (!candidates) {
      if (this.__fallback) {
        candidates = this.__fallback(node)
      } else {
        // TODO we'd like to iterate through custom nodes too
        // we could try to deduce candidates
        throw new Error("Unknown node type " + nodeType + ".")
      }
    }

    current = candidates.length
    while ((current -= 1) >= 0) {
      key = candidates[current]
      candidate = node[key]
      if (!candidate) {
        continue
      }

      if (Array.isArray(candidate)) {
        current2 = candidate.length
        while ((current2 -= 1) >= 0) {
          if (!candidate[current2]) {
            continue
          }
          if (isProperty(nodeType, candidates[current])) {
            element = new Element(
              candidate[current2],
              [key, current2],
              "Property",
              new Reference(candidate, current2)
            )
          } else if (isNode(candidate[current2])) {
            element = new Element(
              candidate[current2],
              [key, current2],
              null,
              new Reference(candidate, current2)
            )
          } else {
            continue
          }
          worklist.push(element)
        }
      } else if (isNode(candidate)) {
        worklist.push(
          new Element(candidate, key, null, new Reference(node, key))
        )
      }
    }
  }

  return outer.root
}

function traverse(root, visitor) {
  var controller = new Controller()
  return controller.traverse(root, visitor)
}

function replace(root, visitor) {
  var controller = new Controller()
  return controller.replace(root, visitor)
}

module.exports = {
  traverse,
  replace,
}

},{}],141:[function(require,module,exports){
const traverse = require("./traverse")

module.exports = function walk(tree, callback) {
  return traverse(tree, { enter: callback })
}

},{"./traverse":139}],142:[function(require,module,exports){
module.exports=[
  "Node",
  "SourceLocation",
  "Position",
  "Identifier",
  "Literal",
  "RegExpLiteral",
  "Program",
  "Function",
  "Statement",
  "ExpressionStatement",
  "Directive",
  "BlockStatement",
  "FunctionBody",
  "EmptyStatement",
  "DebuggerStatement",
  "WithStatement",
  "ReturnStatement",
  "LabeledStatement",
  "BreakStatement",
  "ContinueStatement",
  "IfStatement",
  "SwitchStatement",
  "SwitchCase",
  "ThrowStatement",
  "TryStatement",
  "CatchClause",
  "WhileStatement",
  "DoWhileStatement",
  "ForStatement",
  "ForInStatement",
  "Declaration",
  "FunctionDeclaration",
  "VariableDeclaration",
  "VariableDeclarator",
  "Expression",
  "ThisExpression",
  "ArrayExpression",
  "ObjectExpression",
  "Property",
  "FunctionExpression",
  "ArrowFunctionExpression",
  "UnaryExpression",
  "UnaryOperator",
  "UpdateExpression",
  "UpdateOperator",
  "BinaryExpression",
  "BinaryOperator",
  "AssignmentExpression",
  "AssignmentOperator",
  "LogicalExpression",
  "LogicalOperator",
  "MemberExpression",
  "ConditionalExpression",
  "CallExpression",
  "NewExpression",
  "SequenceExpression",
  "Pattern",
  "ForOfStatement",
  "Super",
  "SpreadElement",
  "YieldExpression",
  "TemplateLiteral",
  "TaggedTemplateExpression",
  "TemplateElement",
  "ObjectPattern",
  "ArrayPattern",
  "RestElement",
  "AssignmentPattern",
  "Class",
  "ClassBody",
  "MethodDefinition",
  "ClassDeclaration",
  "ClassExpression",
  "MetaProperty",
  "ModuleDeclaration",
  "ModuleSpecifier",
  "ImportDeclaration",
  "ImportSpecifier",
  "ImportDefaultSpecifier",
  "ImportNamespaceSpecifier",
  "ExportNamedDeclaration",
  "ExportSpecifier",
  "ExportDefaultDeclaration",
  "ExportAllDeclaration",
  "AwaitExpression",
  "BigIntLiteral",
  "ChainExpression",
  "ChainElement",
  "ImportExpression"
]

},{}],143:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var es_proposals_1 = tslib_1.__importDefault(require("./es-proposals"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(es_proposals_1.default);
    var types = fork.use(types_1.default);
    var defaults = fork.use(shared_1.default).defaults;
    var def = types.Type.def;
    var or = types.Type.or;
    def("Noop")
        .bases("Statement")
        .build();
    def("DoExpression")
        .bases("Expression")
        .build("body")
        .field("body", [def("Statement")]);
    def("BindExpression")
        .bases("Expression")
        .build("object", "callee")
        .field("object", or(def("Expression"), null))
        .field("callee", def("Expression"));
    def("ParenthesizedExpression")
        .bases("Expression")
        .build("expression")
        .field("expression", def("Expression"));
    def("ExportNamespaceSpecifier")
        .bases("Specifier")
        .build("exported")
        .field("exported", def("Identifier"));
    def("ExportDefaultSpecifier")
        .bases("Specifier")
        .build("exported")
        .field("exported", def("Identifier"));
    def("CommentBlock")
        .bases("Comment")
        .build("value", /*optional:*/ "leading", "trailing");
    def("CommentLine")
        .bases("Comment")
        .build("value", /*optional:*/ "leading", "trailing");
    def("Directive")
        .bases("Node")
        .build("value")
        .field("value", def("DirectiveLiteral"));
    def("DirectiveLiteral")
        .bases("Node", "Expression")
        .build("value")
        .field("value", String, defaults["use strict"]);
    def("InterpreterDirective")
        .bases("Node")
        .build("value")
        .field("value", String);
    def("BlockStatement")
        .bases("Statement")
        .build("body")
        .field("body", [def("Statement")])
        .field("directives", [def("Directive")], defaults.emptyArray);
    def("Program")
        .bases("Node")
        .build("body")
        .field("body", [def("Statement")])
        .field("directives", [def("Directive")], defaults.emptyArray)
        .field("interpreter", or(def("InterpreterDirective"), null), defaults["null"]);
    // Split Literal
    def("StringLiteral")
        .bases("Literal")
        .build("value")
        .field("value", String);
    def("NumericLiteral")
        .bases("Literal")
        .build("value")
        .field("value", Number)
        .field("raw", or(String, null), defaults["null"])
        .field("extra", {
        rawValue: Number,
        raw: String
    }, function getDefault() {
        return {
            rawValue: this.value,
            raw: this.value + ""
        };
    });
    def("BigIntLiteral")
        .bases("Literal")
        .build("value")
        // Only String really seems appropriate here, since BigInt values
        // often exceed the limits of JS numbers.
        .field("value", or(String, Number))
        .field("extra", {
        rawValue: String,
        raw: String
    }, function getDefault() {
        return {
            rawValue: String(this.value),
            raw: this.value + "n"
        };
    });
    def("NullLiteral")
        .bases("Literal")
        .build()
        .field("value", null, defaults["null"]);
    def("BooleanLiteral")
        .bases("Literal")
        .build("value")
        .field("value", Boolean);
    def("RegExpLiteral")
        .bases("Literal")
        .build("pattern", "flags")
        .field("pattern", String)
        .field("flags", String)
        .field("value", RegExp, function () {
        return new RegExp(this.pattern, this.flags);
    });
    var ObjectExpressionProperty = or(def("Property"), def("ObjectMethod"), def("ObjectProperty"), def("SpreadProperty"), def("SpreadElement"));
    // Split Property -> ObjectProperty and ObjectMethod
    def("ObjectExpression")
        .bases("Expression")
        .build("properties")
        .field("properties", [ObjectExpressionProperty]);
    // ObjectMethod hoist .value properties to own properties
    def("ObjectMethod")
        .bases("Node", "Function")
        .build("kind", "key", "params", "body", "computed")
        .field("kind", or("method", "get", "set"))
        .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
        .field("params", [def("Pattern")])
        .field("body", def("BlockStatement"))
        .field("computed", Boolean, defaults["false"])
        .field("generator", Boolean, defaults["false"])
        .field("async", Boolean, defaults["false"])
        .field("accessibility", // TypeScript
    or(def("Literal"), null), defaults["null"])
        .field("decorators", or([def("Decorator")], null), defaults["null"]);
    def("ObjectProperty")
        .bases("Node")
        .build("key", "value")
        .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
        .field("value", or(def("Expression"), def("Pattern")))
        .field("accessibility", // TypeScript
    or(def("Literal"), null), defaults["null"])
        .field("computed", Boolean, defaults["false"]);
    var ClassBodyElement = or(def("MethodDefinition"), def("VariableDeclarator"), def("ClassPropertyDefinition"), def("ClassProperty"), def("ClassPrivateProperty"), def("ClassMethod"), def("ClassPrivateMethod"));
    // MethodDefinition -> ClassMethod
    def("ClassBody")
        .bases("Declaration")
        .build("body")
        .field("body", [ClassBodyElement]);
    def("ClassMethod")
        .bases("Declaration", "Function")
        .build("kind", "key", "params", "body", "computed", "static")
        .field("key", or(def("Literal"), def("Identifier"), def("Expression")));
    def("ClassPrivateMethod")
        .bases("Declaration", "Function")
        .build("key", "params", "body", "kind", "computed", "static")
        .field("key", def("PrivateName"));
    ["ClassMethod",
        "ClassPrivateMethod",
    ].forEach(function (typeName) {
        def(typeName)
            .field("kind", or("get", "set", "method", "constructor"), function () { return "method"; })
            .field("body", def("BlockStatement"))
            .field("computed", Boolean, defaults["false"])
            .field("static", or(Boolean, null), defaults["null"])
            .field("abstract", or(Boolean, null), defaults["null"])
            .field("access", or("public", "private", "protected", null), defaults["null"])
            .field("accessibility", or("public", "private", "protected", null), defaults["null"])
            .field("decorators", or([def("Decorator")], null), defaults["null"])
            .field("optional", or(Boolean, null), defaults["null"]);
    });
    var ObjectPatternProperty = or(def("Property"), def("PropertyPattern"), def("SpreadPropertyPattern"), def("SpreadProperty"), // Used by Esprima
    def("ObjectProperty"), // Babel 6
    def("RestProperty") // Babel 6
    );
    // Split into RestProperty and SpreadProperty
    def("ObjectPattern")
        .bases("Pattern")
        .build("properties")
        .field("properties", [ObjectPatternProperty])
        .field("decorators", or([def("Decorator")], null), defaults["null"]);
    def("SpreadProperty")
        .bases("Node")
        .build("argument")
        .field("argument", def("Expression"));
    def("RestProperty")
        .bases("Node")
        .build("argument")
        .field("argument", def("Expression"));
    def("ForAwaitStatement")
        .bases("Statement")
        .build("left", "right", "body")
        .field("left", or(def("VariableDeclaration"), def("Expression")))
        .field("right", def("Expression"))
        .field("body", def("Statement"));
    // The callee node of a dynamic import(...) expression.
    def("Import")
        .bases("Expression")
        .build();
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./es-proposals":147,"tslib":266}],144:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var babel_core_1 = tslib_1.__importDefault(require("./babel-core"));
var flow_1 = tslib_1.__importDefault(require("./flow"));
function default_1(fork) {
    fork.use(babel_core_1.default);
    fork.use(flow_1.default);
}
exports.default = default_1;
module.exports = exports["default"];

},{"./babel-core":143,"./flow":155,"tslib":266}],145:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalOperators = exports.AssignmentOperators = exports.BinaryOperators = void 0;
exports.BinaryOperators = [
    "==", "!=", "===", "!==",
    "<", "<=", ">", ">=",
    "<<", ">>", ">>>",
    "+", "-", "*", "/", "%",
    "&",
    "|", "^", "in",
    "instanceof",
];
exports.AssignmentOperators = [
    "=", "+=", "-=", "*=", "/=", "%=",
    "<<=", ">>=", ">>>=",
    "|=", "^=", "&=",
];
exports.LogicalOperators = [
    "||", "&&",
];

},{}],146:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_operators_1 = require("./core-operators");
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    var types = fork.use(types_1.default);
    var Type = types.Type;
    var def = Type.def;
    var or = Type.or;
    var shared = fork.use(shared_1.default);
    var defaults = shared.defaults;
    var geq = shared.geq;
    // Abstract supertype of all syntactic entities that are allowed to have a
    // .loc field.
    def("Printable")
        .field("loc", or(def("SourceLocation"), null), defaults["null"], true);
    def("Node")
        .bases("Printable")
        .field("type", String)
        .field("comments", or([def("Comment")], null), defaults["null"], true);
    def("SourceLocation")
        .field("start", def("Position"))
        .field("end", def("Position"))
        .field("source", or(String, null), defaults["null"]);
    def("Position")
        .field("line", geq(1))
        .field("column", geq(0));
    def("File")
        .bases("Node")
        .build("program", "name")
        .field("program", def("Program"))
        .field("name", or(String, null), defaults["null"]);
    def("Program")
        .bases("Node")
        .build("body")
        .field("body", [def("Statement")]);
    def("Function")
        .bases("Node")
        .field("id", or(def("Identifier"), null), defaults["null"])
        .field("params", [def("Pattern")])
        .field("body", def("BlockStatement"))
        .field("generator", Boolean, defaults["false"])
        .field("async", Boolean, defaults["false"]);
    def("Statement").bases("Node");
    // The empty .build() here means that an EmptyStatement can be constructed
    // (i.e. it's not abstract) but that it needs no arguments.
    def("EmptyStatement").bases("Statement").build();
    def("BlockStatement")
        .bases("Statement")
        .build("body")
        .field("body", [def("Statement")]);
    // TODO Figure out how to silently coerce Expressions to
    // ExpressionStatements where a Statement was expected.
    def("ExpressionStatement")
        .bases("Statement")
        .build("expression")
        .field("expression", def("Expression"));
    def("IfStatement")
        .bases("Statement")
        .build("test", "consequent", "alternate")
        .field("test", def("Expression"))
        .field("consequent", def("Statement"))
        .field("alternate", or(def("Statement"), null), defaults["null"]);
    def("LabeledStatement")
        .bases("Statement")
        .build("label", "body")
        .field("label", def("Identifier"))
        .field("body", def("Statement"));
    def("BreakStatement")
        .bases("Statement")
        .build("label")
        .field("label", or(def("Identifier"), null), defaults["null"]);
    def("ContinueStatement")
        .bases("Statement")
        .build("label")
        .field("label", or(def("Identifier"), null), defaults["null"]);
    def("WithStatement")
        .bases("Statement")
        .build("object", "body")
        .field("object", def("Expression"))
        .field("body", def("Statement"));
    def("SwitchStatement")
        .bases("Statement")
        .build("discriminant", "cases", "lexical")
        .field("discriminant", def("Expression"))
        .field("cases", [def("SwitchCase")])
        .field("lexical", Boolean, defaults["false"]);
    def("ReturnStatement")
        .bases("Statement")
        .build("argument")
        .field("argument", or(def("Expression"), null));
    def("ThrowStatement")
        .bases("Statement")
        .build("argument")
        .field("argument", def("Expression"));
    def("TryStatement")
        .bases("Statement")
        .build("block", "handler", "finalizer")
        .field("block", def("BlockStatement"))
        .field("handler", or(def("CatchClause"), null), function () {
        return this.handlers && this.handlers[0] || null;
    })
        .field("handlers", [def("CatchClause")], function () {
        return this.handler ? [this.handler] : [];
    }, true) // Indicates this field is hidden from eachField iteration.
        .field("guardedHandlers", [def("CatchClause")], defaults.emptyArray)
        .field("finalizer", or(def("BlockStatement"), null), defaults["null"]);
    def("CatchClause")
        .bases("Node")
        .build("param", "guard", "body")
        .field("param", def("Pattern"))
        .field("guard", or(def("Expression"), null), defaults["null"])
        .field("body", def("BlockStatement"));
    def("WhileStatement")
        .bases("Statement")
        .build("test", "body")
        .field("test", def("Expression"))
        .field("body", def("Statement"));
    def("DoWhileStatement")
        .bases("Statement")
        .build("body", "test")
        .field("body", def("Statement"))
        .field("test", def("Expression"));
    def("ForStatement")
        .bases("Statement")
        .build("init", "test", "update", "body")
        .field("init", or(def("VariableDeclaration"), def("Expression"), null))
        .field("test", or(def("Expression"), null))
        .field("update", or(def("Expression"), null))
        .field("body", def("Statement"));
    def("ForInStatement")
        .bases("Statement")
        .build("left", "right", "body")
        .field("left", or(def("VariableDeclaration"), def("Expression")))
        .field("right", def("Expression"))
        .field("body", def("Statement"));
    def("DebuggerStatement").bases("Statement").build();
    def("Declaration").bases("Statement");
    def("FunctionDeclaration")
        .bases("Function", "Declaration")
        .build("id", "params", "body")
        .field("id", def("Identifier"));
    def("FunctionExpression")
        .bases("Function", "Expression")
        .build("id", "params", "body");
    def("VariableDeclaration")
        .bases("Declaration")
        .build("kind", "declarations")
        .field("kind", or("var", "let", "const"))
        .field("declarations", [def("VariableDeclarator")]);
    def("VariableDeclarator")
        .bases("Node")
        .build("id", "init")
        .field("id", def("Pattern"))
        .field("init", or(def("Expression"), null), defaults["null"]);
    def("Expression").bases("Node");
    def("ThisExpression").bases("Expression").build();
    def("ArrayExpression")
        .bases("Expression")
        .build("elements")
        .field("elements", [or(def("Expression"), null)]);
    def("ObjectExpression")
        .bases("Expression")
        .build("properties")
        .field("properties", [def("Property")]);
    // TODO Not in the Mozilla Parser API, but used by Esprima.
    def("Property")
        .bases("Node") // Want to be able to visit Property Nodes.
        .build("kind", "key", "value")
        .field("kind", or("init", "get", "set"))
        .field("key", or(def("Literal"), def("Identifier")))
        .field("value", def("Expression"));
    def("SequenceExpression")
        .bases("Expression")
        .build("expressions")
        .field("expressions", [def("Expression")]);
    var UnaryOperator = or("-", "+", "!", "~", "typeof", "void", "delete");
    def("UnaryExpression")
        .bases("Expression")
        .build("operator", "argument", "prefix")
        .field("operator", UnaryOperator)
        .field("argument", def("Expression"))
        // Esprima doesn't bother with this field, presumably because it's
        // always true for unary operators.
        .field("prefix", Boolean, defaults["true"]);
    var BinaryOperator = or.apply(void 0, core_operators_1.BinaryOperators);
    def("BinaryExpression")
        .bases("Expression")
        .build("operator", "left", "right")
        .field("operator", BinaryOperator)
        .field("left", def("Expression"))
        .field("right", def("Expression"));
    var AssignmentOperator = or.apply(void 0, core_operators_1.AssignmentOperators);
    def("AssignmentExpression")
        .bases("Expression")
        .build("operator", "left", "right")
        .field("operator", AssignmentOperator)
        .field("left", or(def("Pattern"), def("MemberExpression")))
        .field("right", def("Expression"));
    var UpdateOperator = or("++", "--");
    def("UpdateExpression")
        .bases("Expression")
        .build("operator", "argument", "prefix")
        .field("operator", UpdateOperator)
        .field("argument", def("Expression"))
        .field("prefix", Boolean);
    var LogicalOperator = or.apply(void 0, core_operators_1.LogicalOperators);
    def("LogicalExpression")
        .bases("Expression")
        .build("operator", "left", "right")
        .field("operator", LogicalOperator)
        .field("left", def("Expression"))
        .field("right", def("Expression"));
    def("ConditionalExpression")
        .bases("Expression")
        .build("test", "consequent", "alternate")
        .field("test", def("Expression"))
        .field("consequent", def("Expression"))
        .field("alternate", def("Expression"));
    def("NewExpression")
        .bases("Expression")
        .build("callee", "arguments")
        .field("callee", def("Expression"))
        // The Mozilla Parser API gives this type as [or(def("Expression"),
        // null)], but null values don't really make sense at the call site.
        // TODO Report this nonsense.
        .field("arguments", [def("Expression")]);
    def("CallExpression")
        .bases("Expression")
        .build("callee", "arguments")
        .field("callee", def("Expression"))
        // See comment for NewExpression above.
        .field("arguments", [def("Expression")]);
    def("MemberExpression")
        .bases("Expression")
        .build("object", "property", "computed")
        .field("object", def("Expression"))
        .field("property", or(def("Identifier"), def("Expression")))
        .field("computed", Boolean, function () {
        var type = this.property.type;
        if (type === 'Literal' ||
            type === 'MemberExpression' ||
            type === 'BinaryExpression') {
            return true;
        }
        return false;
    });
    def("Pattern").bases("Node");
    def("SwitchCase")
        .bases("Node")
        .build("test", "consequent")
        .field("test", or(def("Expression"), null))
        .field("consequent", [def("Statement")]);
    def("Identifier")
        .bases("Expression", "Pattern")
        .build("name")
        .field("name", String)
        .field("optional", Boolean, defaults["false"]);
    def("Literal")
        .bases("Expression")
        .build("value")
        .field("value", or(String, Boolean, null, Number, RegExp))
        .field("regex", or({
        pattern: String,
        flags: String
    }, null), function () {
        if (this.value instanceof RegExp) {
            var flags = "";
            if (this.value.ignoreCase)
                flags += "i";
            if (this.value.multiline)
                flags += "m";
            if (this.value.global)
                flags += "g";
            return {
                pattern: this.value.source,
                flags: flags
            };
        }
        return null;
    });
    // Abstract (non-buildable) comment supertype. Not a Node.
    def("Comment")
        .bases("Printable")
        .field("value", String)
        // A .leading comment comes before the node, whereas a .trailing
        // comment comes after it. These two fields should not both be true,
        // but they might both be false when the comment falls inside a node
        // and the node has no children for the comment to lead or trail,
        // e.g. { /*dangling*/ }.
        .field("leading", Boolean, defaults["true"])
        .field("trailing", Boolean, defaults["false"]);
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./core-operators":145,"tslib":266}],147:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
var es2020_1 = tslib_1.__importDefault(require("./es2020"));
function default_1(fork) {
    fork.use(es2020_1.default);
    var types = fork.use(types_1.default);
    var Type = types.Type;
    var def = types.Type.def;
    var or = Type.or;
    var shared = fork.use(shared_1.default);
    var defaults = shared.defaults;
    def("AwaitExpression")
        .build("argument", "all")
        .field("argument", or(def("Expression"), null))
        .field("all", Boolean, defaults["false"]);
    // Decorators
    def("Decorator")
        .bases("Node")
        .build("expression")
        .field("expression", def("Expression"));
    def("Property")
        .field("decorators", or([def("Decorator")], null), defaults["null"]);
    def("MethodDefinition")
        .field("decorators", or([def("Decorator")], null), defaults["null"]);
    // Private names
    def("PrivateName")
        .bases("Expression", "Pattern")
        .build("id")
        .field("id", def("Identifier"));
    def("ClassPrivateProperty")
        .bases("ClassProperty")
        .build("key", "value")
        .field("key", def("PrivateName"))
        .field("value", or(def("Expression"), null), defaults["null"]);
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./es2020":152,"tslib":266}],148:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_operators_1 = require("./core-operators");
var es6_1 = tslib_1.__importDefault(require("./es6"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
function default_1(fork) {
    fork.use(es6_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var BinaryOperator = or.apply(void 0, tslib_1.__spreadArrays(core_operators_1.BinaryOperators, ["**"]));
    def("BinaryExpression")
        .field("operator", BinaryOperator);
    var AssignmentOperator = or.apply(void 0, tslib_1.__spreadArrays(core_operators_1.AssignmentOperators, ["**="]));
    def("AssignmentExpression")
        .field("operator", AssignmentOperator);
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/types":167,"./core-operators":145,"./es6":153,"tslib":266}],149:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var es2016_1 = tslib_1.__importDefault(require("./es2016"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(es2016_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var defaults = fork.use(shared_1.default).defaults;
    def("Function")
        .field("async", Boolean, defaults["false"]);
    def("AwaitExpression")
        .bases("Expression")
        .build("argument")
        .field("argument", def("Expression"));
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./es2016":148,"tslib":266}],150:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var es2017_1 = tslib_1.__importDefault(require("./es2017"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(es2017_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(shared_1.default).defaults;
    def("ForOfStatement")
        .field("await", Boolean, defaults["false"]);
    // Legacy
    def("SpreadProperty")
        .bases("Node")
        .build("argument")
        .field("argument", def("Expression"));
    def("ObjectExpression")
        .field("properties", [or(def("Property"), def("SpreadProperty"), // Legacy
        def("SpreadElement"))]);
    def("TemplateElement")
        .field("value", { "cooked": or(String, null), "raw": String });
    // Legacy
    def("SpreadPropertyPattern")
        .bases("Pattern")
        .build("argument")
        .field("argument", def("Pattern"));
    def("ObjectPattern")
        .field("properties", [or(def("PropertyPattern"), def("Property"), def("RestElement"), def("SpreadPropertyPattern"))]);
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./es2017":149,"tslib":266}],151:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var es2018_1 = tslib_1.__importDefault(require("./es2018"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(es2018_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(shared_1.default).defaults;
    def("CatchClause")
        .field("param", or(def("Pattern"), null), defaults["null"]);
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./es2018":150,"tslib":266}],152:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_operators_1 = require("./core-operators");
var es2019_1 = tslib_1.__importDefault(require("./es2019"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(es2019_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var shared = fork.use(shared_1.default);
    var defaults = shared.defaults;
    def("ImportExpression")
        .bases("Expression")
        .build("source")
        .field("source", def("Expression"));
    def("ExportAllDeclaration")
        .build("source", "exported")
        .field("source", def("Literal"))
        .field("exported", or(def("Identifier"), null));
    // Optional chaining
    def("ChainElement")
        .bases("Node")
        .field("optional", Boolean, defaults["false"]);
    def("CallExpression")
        .bases("Expression", "ChainElement");
    def("MemberExpression")
        .bases("Expression", "ChainElement");
    def("ChainExpression")
        .bases("Expression")
        .build("expression")
        .field("expression", def("ChainElement"));
    def("OptionalCallExpression")
        .bases("CallExpression")
        .build("callee", "arguments", "optional")
        .field("optional", Boolean, defaults["true"]);
    // Deprecated optional chaining type, doesn't work with babelParser@7.11.0 or newer
    def("OptionalMemberExpression")
        .bases("MemberExpression")
        .build("object", "property", "computed", "optional")
        .field("optional", Boolean, defaults["true"]);
    // Nullish coalescing
    var LogicalOperator = or.apply(void 0, tslib_1.__spreadArrays(core_operators_1.LogicalOperators, ["??"]));
    def("LogicalExpression")
        .field("operator", LogicalOperator);
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./core-operators":145,"./es2019":151,"tslib":266}],153:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = tslib_1.__importDefault(require("./core"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(core_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(shared_1.default).defaults;
    def("Function")
        .field("generator", Boolean, defaults["false"])
        .field("expression", Boolean, defaults["false"])
        .field("defaults", [or(def("Expression"), null)], defaults.emptyArray)
        // Legacy
        .field("rest", or(def("Identifier"), null), defaults["null"]);
    // The ESTree way of representing a ...rest parameter.
    def("RestElement")
        .bases("Pattern")
        .build("argument")
        .field("argument", def("Pattern"))
        .field("typeAnnotation", // for Babylon. Flow parser puts it on the identifier
    or(def("TypeAnnotation"), def("TSTypeAnnotation"), null), defaults["null"]);
    def("SpreadElementPattern")
        .bases("Pattern")
        .build("argument")
        .field("argument", def("Pattern"));
    def("FunctionDeclaration")
        .build("id", "params", "body", "generator", "expression")
        // May be `null` in the context of `export default function () {}`
        .field("id", or(def("Identifier"), null));
    def("FunctionExpression")
        .build("id", "params", "body", "generator", "expression");
    def("ArrowFunctionExpression")
        .bases("Function", "Expression")
        .build("params", "body", "expression")
        // The forced null value here is compatible with the overridden
        // definition of the "id" field in the Function interface.
        .field("id", null, defaults["null"])
        // Arrow function bodies are allowed to be expressions.
        .field("body", or(def("BlockStatement"), def("Expression")))
        // The current spec forbids arrow generators, so I have taken the
        // liberty of enforcing that. TODO Report this.
        .field("generator", false, defaults["false"]);
    def("ForOfStatement")
        .bases("Statement")
        .build("left", "right", "body")
        .field("left", or(def("VariableDeclaration"), def("Pattern")))
        .field("right", def("Expression"))
        .field("body", def("Statement"));
    def("YieldExpression")
        .bases("Expression")
        .build("argument", "delegate")
        .field("argument", or(def("Expression"), null))
        .field("delegate", Boolean, defaults["false"]);
    def("GeneratorExpression")
        .bases("Expression")
        .build("body", "blocks", "filter")
        .field("body", def("Expression"))
        .field("blocks", [def("ComprehensionBlock")])
        .field("filter", or(def("Expression"), null));
    def("ComprehensionExpression")
        .bases("Expression")
        .build("body", "blocks", "filter")
        .field("body", def("Expression"))
        .field("blocks", [def("ComprehensionBlock")])
        .field("filter", or(def("Expression"), null));
    def("ComprehensionBlock")
        .bases("Node")
        .build("left", "right", "each")
        .field("left", def("Pattern"))
        .field("right", def("Expression"))
        .field("each", Boolean);
    def("Property")
        .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
        .field("value", or(def("Expression"), def("Pattern")))
        .field("method", Boolean, defaults["false"])
        .field("shorthand", Boolean, defaults["false"])
        .field("computed", Boolean, defaults["false"]);
    def("ObjectProperty")
        .field("shorthand", Boolean, defaults["false"]);
    def("PropertyPattern")
        .bases("Pattern")
        .build("key", "pattern")
        .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
        .field("pattern", def("Pattern"))
        .field("computed", Boolean, defaults["false"]);
    def("ObjectPattern")
        .bases("Pattern")
        .build("properties")
        .field("properties", [or(def("PropertyPattern"), def("Property"))]);
    def("ArrayPattern")
        .bases("Pattern")
        .build("elements")
        .field("elements", [or(def("Pattern"), null)]);
    def("SpreadElement")
        .bases("Node")
        .build("argument")
        .field("argument", def("Expression"));
    def("ArrayExpression")
        .field("elements", [or(def("Expression"), def("SpreadElement"), def("RestElement"), null)]);
    def("NewExpression")
        .field("arguments", [or(def("Expression"), def("SpreadElement"))]);
    def("CallExpression")
        .field("arguments", [or(def("Expression"), def("SpreadElement"))]);
    // Note: this node type is *not* an AssignmentExpression with a Pattern on
    // the left-hand side! The existing AssignmentExpression type already
    // supports destructuring assignments. AssignmentPattern nodes may appear
    // wherever a Pattern is allowed, and the right-hand side represents a
    // default value to be destructured against the left-hand side, if no
    // value is otherwise provided. For example: default parameter values.
    def("AssignmentPattern")
        .bases("Pattern")
        .build("left", "right")
        .field("left", def("Pattern"))
        .field("right", def("Expression"));
    def("MethodDefinition")
        .bases("Declaration")
        .build("kind", "key", "value", "static")
        .field("kind", or("constructor", "method", "get", "set"))
        .field("key", def("Expression"))
        .field("value", def("Function"))
        .field("computed", Boolean, defaults["false"])
        .field("static", Boolean, defaults["false"]);
    var ClassBodyElement = or(def("MethodDefinition"), def("VariableDeclarator"), def("ClassPropertyDefinition"), def("ClassProperty"));
    def("ClassProperty")
        .bases("Declaration")
        .build("key")
        .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
        .field("computed", Boolean, defaults["false"]);
    def("ClassPropertyDefinition") // static property
        .bases("Declaration")
        .build("definition")
        // Yes, Virginia, circular definitions are permitted.
        .field("definition", ClassBodyElement);
    def("ClassBody")
        .bases("Declaration")
        .build("body")
        .field("body", [ClassBodyElement]);
    def("ClassDeclaration")
        .bases("Declaration")
        .build("id", "body", "superClass")
        .field("id", or(def("Identifier"), null))
        .field("body", def("ClassBody"))
        .field("superClass", or(def("Expression"), null), defaults["null"]);
    def("ClassExpression")
        .bases("Expression")
        .build("id", "body", "superClass")
        .field("id", or(def("Identifier"), null), defaults["null"])
        .field("body", def("ClassBody"))
        .field("superClass", or(def("Expression"), null), defaults["null"]);
    def("Super")
        .bases("Expression")
        .build();
    // Specifier and ModuleSpecifier are abstract non-standard types
    // introduced for definitional convenience.
    def("Specifier").bases("Node");
    // This supertype is shared/abused by both def/babel.js and
    // def/esprima.js. In the future, it will be possible to load only one set
    // of definitions appropriate for a given parser, but until then we must
    // rely on default functions to reconcile the conflicting AST formats.
    def("ModuleSpecifier")
        .bases("Specifier")
        // This local field is used by Babel/Acorn. It should not technically
        // be optional in the Babel/Acorn AST format, but it must be optional
        // in the Esprima AST format.
        .field("local", or(def("Identifier"), null), defaults["null"])
        // The id and name fields are used by Esprima. The id field should not
        // technically be optional in the Esprima AST format, but it must be
        // optional in the Babel/Acorn AST format.
        .field("id", or(def("Identifier"), null), defaults["null"])
        .field("name", or(def("Identifier"), null), defaults["null"]);
    // import {<id [as name]>} from ...;
    def("ImportSpecifier")
        .bases("ModuleSpecifier")
        .build("imported", "local")
        .field("imported", def("Identifier"));
    // import <id> from ...;
    def("ImportDefaultSpecifier")
        .bases("ModuleSpecifier")
        .build("local");
    // import <* as id> from ...;
    def("ImportNamespaceSpecifier")
        .bases("ModuleSpecifier")
        .build("local");
    def("ImportDeclaration")
        .bases("Declaration")
        .build("specifiers", "source", "importKind")
        .field("specifiers", [or(def("ImportSpecifier"), def("ImportNamespaceSpecifier"), def("ImportDefaultSpecifier"))], defaults.emptyArray)
        .field("source", def("Literal"))
        .field("importKind", or("value", "type"), function () {
        return "value";
    });
    def("ExportNamedDeclaration")
        .bases("Declaration")
        .build("declaration", "specifiers", "source")
        .field("declaration", or(def("Declaration"), null))
        .field("specifiers", [def("ExportSpecifier")], defaults.emptyArray)
        .field("source", or(def("Literal"), null), defaults["null"]);
    def("ExportSpecifier")
        .bases("ModuleSpecifier")
        .build("local", "exported")
        .field("exported", def("Identifier"));
    def("ExportDefaultDeclaration")
        .bases("Declaration")
        .build("declaration")
        .field("declaration", or(def("Declaration"), def("Expression")));
    def("ExportAllDeclaration")
        .bases("Declaration")
        .build("source")
        .field("source", def("Literal"));
    def("TaggedTemplateExpression")
        .bases("Expression")
        .build("tag", "quasi")
        .field("tag", def("Expression"))
        .field("quasi", def("TemplateLiteral"));
    def("TemplateLiteral")
        .bases("Expression")
        .build("quasis", "expressions")
        .field("quasis", [def("TemplateElement")])
        .field("expressions", [def("Expression")]);
    def("TemplateElement")
        .bases("Node")
        .build("value", "tail")
        .field("value", { "cooked": String, "raw": String })
        .field("tail", Boolean);
    def("MetaProperty")
        .bases("Expression")
        .build("meta", "property")
        .field("meta", def("Identifier"))
        .field("property", def("Identifier"));
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./core":146,"tslib":266}],154:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var es2020_1 = tslib_1.__importDefault(require("./es2020"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(es2020_1.default);
    var types = fork.use(types_1.default);
    var defaults = fork.use(shared_1.default).defaults;
    var def = types.Type.def;
    var or = types.Type.or;
    def("VariableDeclaration")
        .field("declarations", [or(def("VariableDeclarator"), def("Identifier") // Esprima deviation.
        )]);
    def("Property")
        .field("value", or(def("Expression"), def("Pattern") // Esprima deviation.
    ));
    def("ArrayPattern")
        .field("elements", [or(def("Pattern"), def("SpreadElement"), null)]);
    def("ObjectPattern")
        .field("properties", [or(def("Property"), def("PropertyPattern"), def("SpreadPropertyPattern"), def("SpreadProperty") // Used by Esprima.
        )]);
    // Like ModuleSpecifier, except type:"ExportSpecifier" and buildable.
    // export {<id [as name]>} [from ...];
    def("ExportSpecifier")
        .bases("ModuleSpecifier")
        .build("id", "name");
    // export <*> from ...;
    def("ExportBatchSpecifier")
        .bases("Specifier")
        .build();
    def("ExportDeclaration")
        .bases("Declaration")
        .build("default", "declaration", "specifiers", "source")
        .field("default", Boolean)
        .field("declaration", or(def("Declaration"), def("Expression"), // Implies default.
    null))
        .field("specifiers", [or(def("ExportSpecifier"), def("ExportBatchSpecifier"))], defaults.emptyArray)
        .field("source", or(def("Literal"), null), defaults["null"]);
    def("Block")
        .bases("Comment")
        .build("value", /*optional:*/ "leading", "trailing");
    def("Line")
        .bases("Comment")
        .build("value", /*optional:*/ "leading", "trailing");
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./es2020":152,"tslib":266}],155:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var es_proposals_1 = tslib_1.__importDefault(require("./es-proposals"));
var type_annotations_1 = tslib_1.__importDefault(require("./type-annotations"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(es_proposals_1.default);
    fork.use(type_annotations_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(shared_1.default).defaults;
    // Base types
    def("Flow").bases("Node");
    def("FlowType").bases("Flow");
    // Type annotations
    def("AnyTypeAnnotation")
        .bases("FlowType")
        .build();
    def("EmptyTypeAnnotation")
        .bases("FlowType")
        .build();
    def("MixedTypeAnnotation")
        .bases("FlowType")
        .build();
    def("VoidTypeAnnotation")
        .bases("FlowType")
        .build();
    def("SymbolTypeAnnotation")
        .bases("FlowType")
        .build();
    def("NumberTypeAnnotation")
        .bases("FlowType")
        .build();
    def("BigIntTypeAnnotation")
        .bases("FlowType")
        .build();
    def("NumberLiteralTypeAnnotation")
        .bases("FlowType")
        .build("value", "raw")
        .field("value", Number)
        .field("raw", String);
    // Babylon 6 differs in AST from Flow
    // same as NumberLiteralTypeAnnotation
    def("NumericLiteralTypeAnnotation")
        .bases("FlowType")
        .build("value", "raw")
        .field("value", Number)
        .field("raw", String);
    def("BigIntLiteralTypeAnnotation")
        .bases("FlowType")
        .build("value", "raw")
        .field("value", null)
        .field("raw", String);
    def("StringTypeAnnotation")
        .bases("FlowType")
        .build();
    def("StringLiteralTypeAnnotation")
        .bases("FlowType")
        .build("value", "raw")
        .field("value", String)
        .field("raw", String);
    def("BooleanTypeAnnotation")
        .bases("FlowType")
        .build();
    def("BooleanLiteralTypeAnnotation")
        .bases("FlowType")
        .build("value", "raw")
        .field("value", Boolean)
        .field("raw", String);
    def("TypeAnnotation")
        .bases("Node")
        .build("typeAnnotation")
        .field("typeAnnotation", def("FlowType"));
    def("NullableTypeAnnotation")
        .bases("FlowType")
        .build("typeAnnotation")
        .field("typeAnnotation", def("FlowType"));
    def("NullLiteralTypeAnnotation")
        .bases("FlowType")
        .build();
    def("NullTypeAnnotation")
        .bases("FlowType")
        .build();
    def("ThisTypeAnnotation")
        .bases("FlowType")
        .build();
    def("ExistsTypeAnnotation")
        .bases("FlowType")
        .build();
    def("ExistentialTypeParam")
        .bases("FlowType")
        .build();
    def("FunctionTypeAnnotation")
        .bases("FlowType")
        .build("params", "returnType", "rest", "typeParameters")
        .field("params", [def("FunctionTypeParam")])
        .field("returnType", def("FlowType"))
        .field("rest", or(def("FunctionTypeParam"), null))
        .field("typeParameters", or(def("TypeParameterDeclaration"), null));
    def("FunctionTypeParam")
        .bases("Node")
        .build("name", "typeAnnotation", "optional")
        .field("name", or(def("Identifier"), null))
        .field("typeAnnotation", def("FlowType"))
        .field("optional", Boolean);
    def("ArrayTypeAnnotation")
        .bases("FlowType")
        .build("elementType")
        .field("elementType", def("FlowType"));
    def("ObjectTypeAnnotation")
        .bases("FlowType")
        .build("properties", "indexers", "callProperties")
        .field("properties", [
        or(def("ObjectTypeProperty"), def("ObjectTypeSpreadProperty"))
    ])
        .field("indexers", [def("ObjectTypeIndexer")], defaults.emptyArray)
        .field("callProperties", [def("ObjectTypeCallProperty")], defaults.emptyArray)
        .field("inexact", or(Boolean, void 0), defaults["undefined"])
        .field("exact", Boolean, defaults["false"])
        .field("internalSlots", [def("ObjectTypeInternalSlot")], defaults.emptyArray);
    def("Variance")
        .bases("Node")
        .build("kind")
        .field("kind", or("plus", "minus"));
    var LegacyVariance = or(def("Variance"), "plus", "minus", null);
    def("ObjectTypeProperty")
        .bases("Node")
        .build("key", "value", "optional")
        .field("key", or(def("Literal"), def("Identifier")))
        .field("value", def("FlowType"))
        .field("optional", Boolean)
        .field("variance", LegacyVariance, defaults["null"]);
    def("ObjectTypeIndexer")
        .bases("Node")
        .build("id", "key", "value")
        .field("id", def("Identifier"))
        .field("key", def("FlowType"))
        .field("value", def("FlowType"))
        .field("variance", LegacyVariance, defaults["null"])
        .field("static", Boolean, defaults["false"]);
    def("ObjectTypeCallProperty")
        .bases("Node")
        .build("value")
        .field("value", def("FunctionTypeAnnotation"))
        .field("static", Boolean, defaults["false"]);
    def("QualifiedTypeIdentifier")
        .bases("Node")
        .build("qualification", "id")
        .field("qualification", or(def("Identifier"), def("QualifiedTypeIdentifier")))
        .field("id", def("Identifier"));
    def("GenericTypeAnnotation")
        .bases("FlowType")
        .build("id", "typeParameters")
        .field("id", or(def("Identifier"), def("QualifiedTypeIdentifier")))
        .field("typeParameters", or(def("TypeParameterInstantiation"), null));
    def("MemberTypeAnnotation")
        .bases("FlowType")
        .build("object", "property")
        .field("object", def("Identifier"))
        .field("property", or(def("MemberTypeAnnotation"), def("GenericTypeAnnotation")));
    def("UnionTypeAnnotation")
        .bases("FlowType")
        .build("types")
        .field("types", [def("FlowType")]);
    def("IntersectionTypeAnnotation")
        .bases("FlowType")
        .build("types")
        .field("types", [def("FlowType")]);
    def("TypeofTypeAnnotation")
        .bases("FlowType")
        .build("argument")
        .field("argument", def("FlowType"));
    def("ObjectTypeSpreadProperty")
        .bases("Node")
        .build("argument")
        .field("argument", def("FlowType"));
    def("ObjectTypeInternalSlot")
        .bases("Node")
        .build("id", "value", "optional", "static", "method")
        .field("id", def("Identifier"))
        .field("value", def("FlowType"))
        .field("optional", Boolean)
        .field("static", Boolean)
        .field("method", Boolean);
    def("TypeParameterDeclaration")
        .bases("Node")
        .build("params")
        .field("params", [def("TypeParameter")]);
    def("TypeParameterInstantiation")
        .bases("Node")
        .build("params")
        .field("params", [def("FlowType")]);
    def("TypeParameter")
        .bases("FlowType")
        .build("name", "variance", "bound", "default")
        .field("name", String)
        .field("variance", LegacyVariance, defaults["null"])
        .field("bound", or(def("TypeAnnotation"), null), defaults["null"])
        .field("default", or(def("FlowType"), null), defaults["null"]);
    def("ClassProperty")
        .field("variance", LegacyVariance, defaults["null"]);
    def("ClassImplements")
        .bases("Node")
        .build("id")
        .field("id", def("Identifier"))
        .field("superClass", or(def("Expression"), null), defaults["null"])
        .field("typeParameters", or(def("TypeParameterInstantiation"), null), defaults["null"]);
    def("InterfaceTypeAnnotation")
        .bases("FlowType")
        .build("body", "extends")
        .field("body", def("ObjectTypeAnnotation"))
        .field("extends", or([def("InterfaceExtends")], null), defaults["null"]);
    def("InterfaceDeclaration")
        .bases("Declaration")
        .build("id", "body", "extends")
        .field("id", def("Identifier"))
        .field("typeParameters", or(def("TypeParameterDeclaration"), null), defaults["null"])
        .field("body", def("ObjectTypeAnnotation"))
        .field("extends", [def("InterfaceExtends")]);
    def("DeclareInterface")
        .bases("InterfaceDeclaration")
        .build("id", "body", "extends");
    def("InterfaceExtends")
        .bases("Node")
        .build("id")
        .field("id", def("Identifier"))
        .field("typeParameters", or(def("TypeParameterInstantiation"), null), defaults["null"]);
    def("TypeAlias")
        .bases("Declaration")
        .build("id", "typeParameters", "right")
        .field("id", def("Identifier"))
        .field("typeParameters", or(def("TypeParameterDeclaration"), null))
        .field("right", def("FlowType"));
    def("DeclareTypeAlias")
        .bases("TypeAlias")
        .build("id", "typeParameters", "right");
    def("OpaqueType")
        .bases("Declaration")
        .build("id", "typeParameters", "impltype", "supertype")
        .field("id", def("Identifier"))
        .field("typeParameters", or(def("TypeParameterDeclaration"), null))
        .field("impltype", def("FlowType"))
        .field("supertype", or(def("FlowType"), null));
    def("DeclareOpaqueType")
        .bases("OpaqueType")
        .build("id", "typeParameters", "supertype")
        .field("impltype", or(def("FlowType"), null));
    def("TypeCastExpression")
        .bases("Expression")
        .build("expression", "typeAnnotation")
        .field("expression", def("Expression"))
        .field("typeAnnotation", def("TypeAnnotation"));
    def("TupleTypeAnnotation")
        .bases("FlowType")
        .build("types")
        .field("types", [def("FlowType")]);
    def("DeclareVariable")
        .bases("Statement")
        .build("id")
        .field("id", def("Identifier"));
    def("DeclareFunction")
        .bases("Statement")
        .build("id")
        .field("id", def("Identifier"))
        .field("predicate", or(def("FlowPredicate"), null), defaults["null"]);
    def("DeclareClass")
        .bases("InterfaceDeclaration")
        .build("id");
    def("DeclareModule")
        .bases("Statement")
        .build("id", "body")
        .field("id", or(def("Identifier"), def("Literal")))
        .field("body", def("BlockStatement"));
    def("DeclareModuleExports")
        .bases("Statement")
        .build("typeAnnotation")
        .field("typeAnnotation", def("TypeAnnotation"));
    def("DeclareExportDeclaration")
        .bases("Declaration")
        .build("default", "declaration", "specifiers", "source")
        .field("default", Boolean)
        .field("declaration", or(def("DeclareVariable"), def("DeclareFunction"), def("DeclareClass"), def("FlowType"), // Implies default.
    def("TypeAlias"), // Implies named type
    def("DeclareOpaqueType"), // Implies named opaque type
    def("InterfaceDeclaration"), null))
        .field("specifiers", [or(def("ExportSpecifier"), def("ExportBatchSpecifier"))], defaults.emptyArray)
        .field("source", or(def("Literal"), null), defaults["null"]);
    def("DeclareExportAllDeclaration")
        .bases("Declaration")
        .build("source")
        .field("source", or(def("Literal"), null), defaults["null"]);
    def("ImportDeclaration")
        .field("importKind", or("value", "type", "typeof"), function () { return "value"; });
    def("FlowPredicate").bases("Flow");
    def("InferredPredicate")
        .bases("FlowPredicate")
        .build();
    def("DeclaredPredicate")
        .bases("FlowPredicate")
        .build("value")
        .field("value", def("Expression"));
    def("Function")
        .field("predicate", or(def("FlowPredicate"), null), defaults["null"]);
    def("CallExpression")
        .field("typeArguments", or(null, def("TypeParameterInstantiation")), defaults["null"]);
    def("NewExpression")
        .field("typeArguments", or(null, def("TypeParameterInstantiation")), defaults["null"]);
    // Enums
    def("EnumDeclaration")
        .bases("Declaration")
        .build("id", "body")
        .field("id", def("Identifier"))
        .field("body", or(def("EnumBooleanBody"), def("EnumNumberBody"), def("EnumStringBody"), def("EnumSymbolBody")));
    def("EnumBooleanBody")
        .build("members", "explicitType")
        .field("members", [def("EnumBooleanMember")])
        .field("explicitType", Boolean);
    def("EnumNumberBody")
        .build("members", "explicitType")
        .field("members", [def("EnumNumberMember")])
        .field("explicitType", Boolean);
    def("EnumStringBody")
        .build("members", "explicitType")
        .field("members", or([def("EnumStringMember")], [def("EnumDefaultedMember")]))
        .field("explicitType", Boolean);
    def("EnumSymbolBody")
        .build("members")
        .field("members", [def("EnumDefaultedMember")]);
    def("EnumBooleanMember")
        .build("id", "init")
        .field("id", def("Identifier"))
        .field("init", or(def("Literal"), Boolean));
    def("EnumNumberMember")
        .build("id", "init")
        .field("id", def("Identifier"))
        .field("init", def("Literal"));
    def("EnumStringMember")
        .build("id", "init")
        .field("id", def("Identifier"))
        .field("init", def("Literal"));
    def("EnumDefaultedMember")
        .build("id")
        .field("id", def("Identifier"));
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./es-proposals":147,"./type-annotations":157,"tslib":266}],156:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var es2020_1 = tslib_1.__importDefault(require("./es2020"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(es2020_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(shared_1.default).defaults;
    def("JSXAttribute")
        .bases("Node")
        .build("name", "value")
        .field("name", or(def("JSXIdentifier"), def("JSXNamespacedName")))
        .field("value", or(def("Literal"), // attr="value"
    def("JSXExpressionContainer"), // attr={value}
    def("JSXElement"), // attr=<div />
    def("JSXFragment"), // attr=<></>
    null // attr= or just attr
    ), defaults["null"]);
    def("JSXIdentifier")
        .bases("Identifier")
        .build("name")
        .field("name", String);
    def("JSXNamespacedName")
        .bases("Node")
        .build("namespace", "name")
        .field("namespace", def("JSXIdentifier"))
        .field("name", def("JSXIdentifier"));
    def("JSXMemberExpression")
        .bases("MemberExpression")
        .build("object", "property")
        .field("object", or(def("JSXIdentifier"), def("JSXMemberExpression")))
        .field("property", def("JSXIdentifier"))
        .field("computed", Boolean, defaults.false);
    var JSXElementName = or(def("JSXIdentifier"), def("JSXNamespacedName"), def("JSXMemberExpression"));
    def("JSXSpreadAttribute")
        .bases("Node")
        .build("argument")
        .field("argument", def("Expression"));
    var JSXAttributes = [or(def("JSXAttribute"), def("JSXSpreadAttribute"))];
    def("JSXExpressionContainer")
        .bases("Expression")
        .build("expression")
        .field("expression", or(def("Expression"), def("JSXEmptyExpression")));
    var JSXChildren = [or(def("JSXText"), def("JSXExpressionContainer"), def("JSXSpreadChild"), def("JSXElement"), def("JSXFragment"), def("Literal") // Legacy: Esprima should return JSXText instead.
        )];
    def("JSXElement")
        .bases("Expression")
        .build("openingElement", "closingElement", "children")
        .field("openingElement", def("JSXOpeningElement"))
        .field("closingElement", or(def("JSXClosingElement"), null), defaults["null"])
        .field("children", JSXChildren, defaults.emptyArray)
        .field("name", JSXElementName, function () {
        // Little-known fact: the `this` object inside a default function
        // is none other than the partially-built object itself, and any
        // fields initialized directly from builder function arguments
        // (like openingElement, closingElement, and children) are
        // guaranteed to be available.
        return this.openingElement.name;
    }, true) // hidden from traversal
        .field("selfClosing", Boolean, function () {
        return this.openingElement.selfClosing;
    }, true) // hidden from traversal
        .field("attributes", JSXAttributes, function () {
        return this.openingElement.attributes;
    }, true); // hidden from traversal
    def("JSXOpeningElement")
        .bases("Node")
        .build("name", "attributes", "selfClosing")
        .field("name", JSXElementName)
        .field("attributes", JSXAttributes, defaults.emptyArray)
        .field("selfClosing", Boolean, defaults["false"]);
    def("JSXClosingElement")
        .bases("Node")
        .build("name")
        .field("name", JSXElementName);
    def("JSXFragment")
        .bases("Expression")
        .build("openingFragment", "closingFragment", "children")
        .field("openingFragment", def("JSXOpeningFragment"))
        .field("closingFragment", def("JSXClosingFragment"))
        .field("children", JSXChildren, defaults.emptyArray);
    def("JSXOpeningFragment")
        .bases("Node")
        .build();
    def("JSXClosingFragment")
        .bases("Node")
        .build();
    def("JSXText")
        .bases("Literal")
        .build("value", "raw")
        .field("value", String)
        .field("raw", String, function () {
        return this.value;
    });
    def("JSXEmptyExpression")
        .bases("Node")
        .build();
    def("JSXSpreadChild")
        .bases("Node")
        .build("expression")
        .field("expression", def("Expression"));
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./es2020":152,"tslib":266}],157:[function(require,module,exports){
"use strict";;
/**
 * Type annotation defs shared between Flow and TypeScript.
 * These defs could not be defined in ./flow.ts or ./typescript.ts directly
 * because they use the same name.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(shared_1.default).defaults;
    var TypeAnnotation = or(def("TypeAnnotation"), def("TSTypeAnnotation"), null);
    var TypeParamDecl = or(def("TypeParameterDeclaration"), def("TSTypeParameterDeclaration"), null);
    def("Identifier")
        .field("typeAnnotation", TypeAnnotation, defaults["null"]);
    def("ObjectPattern")
        .field("typeAnnotation", TypeAnnotation, defaults["null"]);
    def("Function")
        .field("returnType", TypeAnnotation, defaults["null"])
        .field("typeParameters", TypeParamDecl, defaults["null"]);
    def("ClassProperty")
        .build("key", "value", "typeAnnotation", "static")
        .field("value", or(def("Expression"), null))
        .field("static", Boolean, defaults["false"])
        .field("typeAnnotation", TypeAnnotation, defaults["null"]);
    ["ClassDeclaration",
        "ClassExpression",
    ].forEach(function (typeName) {
        def(typeName)
            .field("typeParameters", TypeParamDecl, defaults["null"])
            .field("superTypeParameters", or(def("TypeParameterInstantiation"), def("TSTypeParameterInstantiation"), null), defaults["null"])
            .field("implements", or([def("ClassImplements")], [def("TSExpressionWithTypeArguments")]), defaults.emptyArray);
    });
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"tslib":266}],158:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var babel_core_1 = tslib_1.__importDefault(require("./babel-core"));
var type_annotations_1 = tslib_1.__importDefault(require("./type-annotations"));
var types_1 = tslib_1.__importDefault(require("../lib/types"));
var shared_1 = tslib_1.__importDefault(require("../lib/shared"));
function default_1(fork) {
    // Since TypeScript is parsed by Babylon, include the core Babylon types
    // but omit the Flow-related types.
    fork.use(babel_core_1.default);
    fork.use(type_annotations_1.default);
    var types = fork.use(types_1.default);
    var n = types.namedTypes;
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(shared_1.default).defaults;
    var StringLiteral = types.Type.from(function (value, deep) {
        if (n.StringLiteral &&
            n.StringLiteral.check(value, deep)) {
            return true;
        }
        if (n.Literal &&
            n.Literal.check(value, deep) &&
            typeof value.value === "string") {
            return true;
        }
        return false;
    }, "StringLiteral");
    def("TSType")
        .bases("Node");
    var TSEntityName = or(def("Identifier"), def("TSQualifiedName"));
    def("TSTypeReference")
        .bases("TSType", "TSHasOptionalTypeParameterInstantiation")
        .build("typeName", "typeParameters")
        .field("typeName", TSEntityName);
    // An abstract (non-buildable) base type that provide a commonly-needed
    // optional .typeParameters field.
    def("TSHasOptionalTypeParameterInstantiation")
        .field("typeParameters", or(def("TSTypeParameterInstantiation"), null), defaults["null"]);
    // An abstract (non-buildable) base type that provide a commonly-needed
    // optional .typeParameters field.
    def("TSHasOptionalTypeParameters")
        .field("typeParameters", or(def("TSTypeParameterDeclaration"), null, void 0), defaults["null"]);
    // An abstract (non-buildable) base type that provide a commonly-needed
    // optional .typeAnnotation field.
    def("TSHasOptionalTypeAnnotation")
        .field("typeAnnotation", or(def("TSTypeAnnotation"), null), defaults["null"]);
    def("TSQualifiedName")
        .bases("Node")
        .build("left", "right")
        .field("left", TSEntityName)
        .field("right", TSEntityName);
    def("TSAsExpression")
        .bases("Expression", "Pattern")
        .build("expression", "typeAnnotation")
        .field("expression", def("Expression"))
        .field("typeAnnotation", def("TSType"))
        .field("extra", or({ parenthesized: Boolean }, null), defaults["null"]);
    def("TSNonNullExpression")
        .bases("Expression", "Pattern")
        .build("expression")
        .field("expression", def("Expression"));
    [
        "TSAnyKeyword",
        "TSBigIntKeyword",
        "TSBooleanKeyword",
        "TSNeverKeyword",
        "TSNullKeyword",
        "TSNumberKeyword",
        "TSObjectKeyword",
        "TSStringKeyword",
        "TSSymbolKeyword",
        "TSUndefinedKeyword",
        "TSUnknownKeyword",
        "TSVoidKeyword",
        "TSThisType",
    ].forEach(function (keywordType) {
        def(keywordType)
            .bases("TSType")
            .build();
    });
    def("TSArrayType")
        .bases("TSType")
        .build("elementType")
        .field("elementType", def("TSType"));
    def("TSLiteralType")
        .bases("TSType")
        .build("literal")
        .field("literal", or(def("NumericLiteral"), def("StringLiteral"), def("BooleanLiteral"), def("TemplateLiteral"), def("UnaryExpression")));
    ["TSUnionType",
        "TSIntersectionType",
    ].forEach(function (typeName) {
        def(typeName)
            .bases("TSType")
            .build("types")
            .field("types", [def("TSType")]);
    });
    def("TSConditionalType")
        .bases("TSType")
        .build("checkType", "extendsType", "trueType", "falseType")
        .field("checkType", def("TSType"))
        .field("extendsType", def("TSType"))
        .field("trueType", def("TSType"))
        .field("falseType", def("TSType"));
    def("TSInferType")
        .bases("TSType")
        .build("typeParameter")
        .field("typeParameter", def("TSTypeParameter"));
    def("TSParenthesizedType")
        .bases("TSType")
        .build("typeAnnotation")
        .field("typeAnnotation", def("TSType"));
    var ParametersType = [or(def("Identifier"), def("RestElement"), def("ArrayPattern"), def("ObjectPattern"))];
    ["TSFunctionType",
        "TSConstructorType",
    ].forEach(function (typeName) {
        def(typeName)
            .bases("TSType", "TSHasOptionalTypeParameters", "TSHasOptionalTypeAnnotation")
            .build("parameters")
            .field("parameters", ParametersType);
    });
    def("TSDeclareFunction")
        .bases("Declaration", "TSHasOptionalTypeParameters")
        .build("id", "params", "returnType")
        .field("declare", Boolean, defaults["false"])
        .field("async", Boolean, defaults["false"])
        .field("generator", Boolean, defaults["false"])
        .field("id", or(def("Identifier"), null), defaults["null"])
        .field("params", [def("Pattern")])
        // tSFunctionTypeAnnotationCommon
        .field("returnType", or(def("TSTypeAnnotation"), def("Noop"), // Still used?
    null), defaults["null"]);
    def("TSDeclareMethod")
        .bases("Declaration", "TSHasOptionalTypeParameters")
        .build("key", "params", "returnType")
        .field("async", Boolean, defaults["false"])
        .field("generator", Boolean, defaults["false"])
        .field("params", [def("Pattern")])
        // classMethodOrPropertyCommon
        .field("abstract", Boolean, defaults["false"])
        .field("accessibility", or("public", "private", "protected", void 0), defaults["undefined"])
        .field("static", Boolean, defaults["false"])
        .field("computed", Boolean, defaults["false"])
        .field("optional", Boolean, defaults["false"])
        .field("key", or(def("Identifier"), def("StringLiteral"), def("NumericLiteral"), 
    // Only allowed if .computed is true.
    def("Expression")))
        // classMethodOrDeclareMethodCommon
        .field("kind", or("get", "set", "method", "constructor"), function getDefault() { return "method"; })
        .field("access", // Not "accessibility"?
    or("public", "private", "protected", void 0), defaults["undefined"])
        .field("decorators", or([def("Decorator")], null), defaults["null"])
        // tSFunctionTypeAnnotationCommon
        .field("returnType", or(def("TSTypeAnnotation"), def("Noop"), // Still used?
    null), defaults["null"]);
    def("TSMappedType")
        .bases("TSType")
        .build("typeParameter", "typeAnnotation")
        .field("readonly", or(Boolean, "+", "-"), defaults["false"])
        .field("typeParameter", def("TSTypeParameter"))
        .field("optional", or(Boolean, "+", "-"), defaults["false"])
        .field("typeAnnotation", or(def("TSType"), null), defaults["null"]);
    def("TSTupleType")
        .bases("TSType")
        .build("elementTypes")
        .field("elementTypes", [or(def("TSType"), def("TSNamedTupleMember"))]);
    def("TSNamedTupleMember")
        .bases("TSType")
        .build("label", "elementType", "optional")
        .field("label", def("Identifier"))
        .field("optional", Boolean, defaults["false"])
        .field("elementType", def("TSType"));
    def("TSRestType")
        .bases("TSType")
        .build("typeAnnotation")
        .field("typeAnnotation", def("TSType"));
    def("TSOptionalType")
        .bases("TSType")
        .build("typeAnnotation")
        .field("typeAnnotation", def("TSType"));
    def("TSIndexedAccessType")
        .bases("TSType")
        .build("objectType", "indexType")
        .field("objectType", def("TSType"))
        .field("indexType", def("TSType"));
    def("TSTypeOperator")
        .bases("TSType")
        .build("operator")
        .field("operator", String)
        .field("typeAnnotation", def("TSType"));
    def("TSTypeAnnotation")
        .bases("Node")
        .build("typeAnnotation")
        .field("typeAnnotation", or(def("TSType"), def("TSTypeAnnotation")));
    def("TSIndexSignature")
        .bases("Declaration", "TSHasOptionalTypeAnnotation")
        .build("parameters", "typeAnnotation")
        .field("parameters", [def("Identifier")]) // Length === 1
        .field("readonly", Boolean, defaults["false"]);
    def("TSPropertySignature")
        .bases("Declaration", "TSHasOptionalTypeAnnotation")
        .build("key", "typeAnnotation", "optional")
        .field("key", def("Expression"))
        .field("computed", Boolean, defaults["false"])
        .field("readonly", Boolean, defaults["false"])
        .field("optional", Boolean, defaults["false"])
        .field("initializer", or(def("Expression"), null), defaults["null"]);
    def("TSMethodSignature")
        .bases("Declaration", "TSHasOptionalTypeParameters", "TSHasOptionalTypeAnnotation")
        .build("key", "parameters", "typeAnnotation")
        .field("key", def("Expression"))
        .field("computed", Boolean, defaults["false"])
        .field("optional", Boolean, defaults["false"])
        .field("parameters", ParametersType);
    def("TSTypePredicate")
        .bases("TSTypeAnnotation", "TSType")
        .build("parameterName", "typeAnnotation", "asserts")
        .field("parameterName", or(def("Identifier"), def("TSThisType")))
        .field("typeAnnotation", or(def("TSTypeAnnotation"), null), defaults["null"])
        .field("asserts", Boolean, defaults["false"]);
    ["TSCallSignatureDeclaration",
        "TSConstructSignatureDeclaration",
    ].forEach(function (typeName) {
        def(typeName)
            .bases("Declaration", "TSHasOptionalTypeParameters", "TSHasOptionalTypeAnnotation")
            .build("parameters", "typeAnnotation")
            .field("parameters", ParametersType);
    });
    def("TSEnumMember")
        .bases("Node")
        .build("id", "initializer")
        .field("id", or(def("Identifier"), StringLiteral))
        .field("initializer", or(def("Expression"), null), defaults["null"]);
    def("TSTypeQuery")
        .bases("TSType")
        .build("exprName")
        .field("exprName", or(TSEntityName, def("TSImportType")));
    // Inferred from Babylon's tsParseTypeMember method.
    var TSTypeMember = or(def("TSCallSignatureDeclaration"), def("TSConstructSignatureDeclaration"), def("TSIndexSignature"), def("TSMethodSignature"), def("TSPropertySignature"));
    def("TSTypeLiteral")
        .bases("TSType")
        .build("members")
        .field("members", [TSTypeMember]);
    def("TSTypeParameter")
        .bases("Identifier")
        .build("name", "constraint", "default")
        .field("name", String)
        .field("constraint", or(def("TSType"), void 0), defaults["undefined"])
        .field("default", or(def("TSType"), void 0), defaults["undefined"]);
    def("TSTypeAssertion")
        .bases("Expression", "Pattern")
        .build("typeAnnotation", "expression")
        .field("typeAnnotation", def("TSType"))
        .field("expression", def("Expression"))
        .field("extra", or({ parenthesized: Boolean }, null), defaults["null"]);
    def("TSTypeParameterDeclaration")
        .bases("Declaration")
        .build("params")
        .field("params", [def("TSTypeParameter")]);
    def("TSTypeParameterInstantiation")
        .bases("Node")
        .build("params")
        .field("params", [def("TSType")]);
    def("TSEnumDeclaration")
        .bases("Declaration")
        .build("id", "members")
        .field("id", def("Identifier"))
        .field("const", Boolean, defaults["false"])
        .field("declare", Boolean, defaults["false"])
        .field("members", [def("TSEnumMember")])
        .field("initializer", or(def("Expression"), null), defaults["null"]);
    def("TSTypeAliasDeclaration")
        .bases("Declaration", "TSHasOptionalTypeParameters")
        .build("id", "typeAnnotation")
        .field("id", def("Identifier"))
        .field("declare", Boolean, defaults["false"])
        .field("typeAnnotation", def("TSType"));
    def("TSModuleBlock")
        .bases("Node")
        .build("body")
        .field("body", [def("Statement")]);
    def("TSModuleDeclaration")
        .bases("Declaration")
        .build("id", "body")
        .field("id", or(StringLiteral, TSEntityName))
        .field("declare", Boolean, defaults["false"])
        .field("global", Boolean, defaults["false"])
        .field("body", or(def("TSModuleBlock"), def("TSModuleDeclaration"), null), defaults["null"]);
    def("TSImportType")
        .bases("TSType", "TSHasOptionalTypeParameterInstantiation")
        .build("argument", "qualifier", "typeParameters")
        .field("argument", StringLiteral)
        .field("qualifier", or(TSEntityName, void 0), defaults["undefined"]);
    def("TSImportEqualsDeclaration")
        .bases("Declaration")
        .build("id", "moduleReference")
        .field("id", def("Identifier"))
        .field("isExport", Boolean, defaults["false"])
        .field("moduleReference", or(TSEntityName, def("TSExternalModuleReference")));
    def("TSExternalModuleReference")
        .bases("Declaration")
        .build("expression")
        .field("expression", StringLiteral);
    def("TSExportAssignment")
        .bases("Statement")
        .build("expression")
        .field("expression", def("Expression"));
    def("TSNamespaceExportDeclaration")
        .bases("Declaration")
        .build("id")
        .field("id", def("Identifier"));
    def("TSInterfaceBody")
        .bases("Node")
        .build("body")
        .field("body", [TSTypeMember]);
    def("TSExpressionWithTypeArguments")
        .bases("TSType", "TSHasOptionalTypeParameterInstantiation")
        .build("expression", "typeParameters")
        .field("expression", TSEntityName);
    def("TSInterfaceDeclaration")
        .bases("Declaration", "TSHasOptionalTypeParameters")
        .build("id", "body")
        .field("id", TSEntityName)
        .field("declare", Boolean, defaults["false"])
        .field("extends", or([def("TSExpressionWithTypeArguments")], null), defaults["null"])
        .field("body", def("TSInterfaceBody"));
    def("TSParameterProperty")
        .bases("Pattern")
        .build("parameter")
        .field("accessibility", or("public", "private", "protected", void 0), defaults["undefined"])
        .field("readonly", Boolean, defaults["false"])
        .field("parameter", or(def("Identifier"), def("AssignmentPattern")));
    def("ClassProperty")
        .field("access", // Not "accessibility"?
    or("public", "private", "protected", void 0), defaults["undefined"]);
    // Defined already in es6 and babel-core.
    def("ClassBody")
        .field("body", [or(def("MethodDefinition"), def("VariableDeclarator"), def("ClassPropertyDefinition"), def("ClassProperty"), def("ClassPrivateProperty"), def("ClassMethod"), def("ClassPrivateMethod"), 
        // Just need to add these types:
        def("TSDeclareMethod"), TSTypeMember)]);
}
exports.default = default_1;
module.exports = exports["default"];

},{"../lib/shared":166,"../lib/types":167,"./babel-core":143,"./type-annotations":157,"tslib":266}],159:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("./lib/types"));
var path_visitor_1 = tslib_1.__importDefault(require("./lib/path-visitor"));
var equiv_1 = tslib_1.__importDefault(require("./lib/equiv"));
var path_1 = tslib_1.__importDefault(require("./lib/path"));
var node_path_1 = tslib_1.__importDefault(require("./lib/node-path"));
function default_1(defs) {
    var fork = createFork();
    var types = fork.use(types_1.default);
    defs.forEach(fork.use);
    types.finalize();
    var PathVisitor = fork.use(path_visitor_1.default);
    return {
        Type: types.Type,
        builtInTypes: types.builtInTypes,
        namedTypes: types.namedTypes,
        builders: types.builders,
        defineMethod: types.defineMethod,
        getFieldNames: types.getFieldNames,
        getFieldValue: types.getFieldValue,
        eachField: types.eachField,
        someField: types.someField,
        getSupertypeNames: types.getSupertypeNames,
        getBuilderName: types.getBuilderName,
        astNodesAreEquivalent: fork.use(equiv_1.default),
        finalize: types.finalize,
        Path: fork.use(path_1.default),
        NodePath: fork.use(node_path_1.default),
        PathVisitor: PathVisitor,
        use: fork.use,
        visit: PathVisitor.visit,
    };
}
exports.default = default_1;
function createFork() {
    var used = [];
    var usedResult = [];
    function use(plugin) {
        var idx = used.indexOf(plugin);
        if (idx === -1) {
            idx = used.length;
            used.push(plugin);
            usedResult[idx] = plugin(fork);
        }
        return usedResult[idx];
    }
    var fork = { use: use };
    return fork;
}
module.exports = exports["default"];

},{"./lib/equiv":161,"./lib/node-path":162,"./lib/path":164,"./lib/path-visitor":163,"./lib/types":167,"tslib":266}],160:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedTypes = void 0;
var namedTypes;
(function (namedTypes) {
})(namedTypes = exports.namedTypes || (exports.namedTypes = {}));

},{}],161:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("./types"));
function default_1(fork) {
    var types = fork.use(types_1.default);
    var getFieldNames = types.getFieldNames;
    var getFieldValue = types.getFieldValue;
    var isArray = types.builtInTypes.array;
    var isObject = types.builtInTypes.object;
    var isDate = types.builtInTypes.Date;
    var isRegExp = types.builtInTypes.RegExp;
    var hasOwn = Object.prototype.hasOwnProperty;
    function astNodesAreEquivalent(a, b, problemPath) {
        if (isArray.check(problemPath)) {
            problemPath.length = 0;
        }
        else {
            problemPath = null;
        }
        return areEquivalent(a, b, problemPath);
    }
    astNodesAreEquivalent.assert = function (a, b) {
        var problemPath = [];
        if (!astNodesAreEquivalent(a, b, problemPath)) {
            if (problemPath.length === 0) {
                if (a !== b) {
                    throw new Error("Nodes must be equal");
                }
            }
            else {
                throw new Error("Nodes differ in the following path: " +
                    problemPath.map(subscriptForProperty).join(""));
            }
        }
    };
    function subscriptForProperty(property) {
        if (/[_$a-z][_$a-z0-9]*/i.test(property)) {
            return "." + property;
        }
        return "[" + JSON.stringify(property) + "]";
    }
    function areEquivalent(a, b, problemPath) {
        if (a === b) {
            return true;
        }
        if (isArray.check(a)) {
            return arraysAreEquivalent(a, b, problemPath);
        }
        if (isObject.check(a)) {
            return objectsAreEquivalent(a, b, problemPath);
        }
        if (isDate.check(a)) {
            return isDate.check(b) && (+a === +b);
        }
        if (isRegExp.check(a)) {
            return isRegExp.check(b) && (a.source === b.source &&
                a.global === b.global &&
                a.multiline === b.multiline &&
                a.ignoreCase === b.ignoreCase);
        }
        return a == b;
    }
    function arraysAreEquivalent(a, b, problemPath) {
        isArray.assert(a);
        var aLength = a.length;
        if (!isArray.check(b) || b.length !== aLength) {
            if (problemPath) {
                problemPath.push("length");
            }
            return false;
        }
        for (var i = 0; i < aLength; ++i) {
            if (problemPath) {
                problemPath.push(i);
            }
            if (i in a !== i in b) {
                return false;
            }
            if (!areEquivalent(a[i], b[i], problemPath)) {
                return false;
            }
            if (problemPath) {
                var problemPathTail = problemPath.pop();
                if (problemPathTail !== i) {
                    throw new Error("" + problemPathTail);
                }
            }
        }
        return true;
    }
    function objectsAreEquivalent(a, b, problemPath) {
        isObject.assert(a);
        if (!isObject.check(b)) {
            return false;
        }
        // Fast path for a common property of AST nodes.
        if (a.type !== b.type) {
            if (problemPath) {
                problemPath.push("type");
            }
            return false;
        }
        var aNames = getFieldNames(a);
        var aNameCount = aNames.length;
        var bNames = getFieldNames(b);
        var bNameCount = bNames.length;
        if (aNameCount === bNameCount) {
            for (var i = 0; i < aNameCount; ++i) {
                var name = aNames[i];
                var aChild = getFieldValue(a, name);
                var bChild = getFieldValue(b, name);
                if (problemPath) {
                    problemPath.push(name);
                }
                if (!areEquivalent(aChild, bChild, problemPath)) {
                    return false;
                }
                if (problemPath) {
                    var problemPathTail = problemPath.pop();
                    if (problemPathTail !== name) {
                        throw new Error("" + problemPathTail);
                    }
                }
            }
            return true;
        }
        if (!problemPath) {
            return false;
        }
        // Since aNameCount !== bNameCount, we need to find some name that's
        // missing in aNames but present in bNames, or vice-versa.
        var seenNames = Object.create(null);
        for (i = 0; i < aNameCount; ++i) {
            seenNames[aNames[i]] = true;
        }
        for (i = 0; i < bNameCount; ++i) {
            name = bNames[i];
            if (!hasOwn.call(seenNames, name)) {
                problemPath.push(name);
                return false;
            }
            delete seenNames[name];
        }
        for (name in seenNames) {
            problemPath.push(name);
            break;
        }
        return false;
    }
    return astNodesAreEquivalent;
}
exports.default = default_1;
module.exports = exports["default"];

},{"./types":167,"tslib":266}],162:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("./types"));
var path_1 = tslib_1.__importDefault(require("./path"));
var scope_1 = tslib_1.__importDefault(require("./scope"));
function nodePathPlugin(fork) {
    var types = fork.use(types_1.default);
    var n = types.namedTypes;
    var b = types.builders;
    var isNumber = types.builtInTypes.number;
    var isArray = types.builtInTypes.array;
    var Path = fork.use(path_1.default);
    var Scope = fork.use(scope_1.default);
    var NodePath = function NodePath(value, parentPath, name) {
        if (!(this instanceof NodePath)) {
            throw new Error("NodePath constructor cannot be invoked without 'new'");
        }
        Path.call(this, value, parentPath, name);
    };
    var NPp = NodePath.prototype = Object.create(Path.prototype, {
        constructor: {
            value: NodePath,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    Object.defineProperties(NPp, {
        node: {
            get: function () {
                Object.defineProperty(this, "node", {
                    configurable: true,
                    value: this._computeNode()
                });
                return this.node;
            }
        },
        parent: {
            get: function () {
                Object.defineProperty(this, "parent", {
                    configurable: true,
                    value: this._computeParent()
                });
                return this.parent;
            }
        },
        scope: {
            get: function () {
                Object.defineProperty(this, "scope", {
                    configurable: true,
                    value: this._computeScope()
                });
                return this.scope;
            }
        }
    });
    NPp.replace = function () {
        delete this.node;
        delete this.parent;
        delete this.scope;
        return Path.prototype.replace.apply(this, arguments);
    };
    NPp.prune = function () {
        var remainingNodePath = this.parent;
        this.replace();
        return cleanUpNodesAfterPrune(remainingNodePath);
    };
    // The value of the first ancestor Path whose value is a Node.
    NPp._computeNode = function () {
        var value = this.value;
        if (n.Node.check(value)) {
            return value;
        }
        var pp = this.parentPath;
        return pp && pp.node || null;
    };
    // The first ancestor Path whose value is a Node distinct from this.node.
    NPp._computeParent = function () {
        var value = this.value;
        var pp = this.parentPath;
        if (!n.Node.check(value)) {
            while (pp && !n.Node.check(pp.value)) {
                pp = pp.parentPath;
            }
            if (pp) {
                pp = pp.parentPath;
            }
        }
        while (pp && !n.Node.check(pp.value)) {
            pp = pp.parentPath;
        }
        return pp || null;
    };
    // The closest enclosing scope that governs this node.
    NPp._computeScope = function () {
        var value = this.value;
        var pp = this.parentPath;
        var scope = pp && pp.scope;
        if (n.Node.check(value) &&
            Scope.isEstablishedBy(value)) {
            scope = new Scope(this, scope);
        }
        return scope || null;
    };
    NPp.getValueProperty = function (name) {
        return types.getFieldValue(this.value, name);
    };
    /**
     * Determine whether this.node needs to be wrapped in parentheses in order
     * for a parser to reproduce the same local AST structure.
     *
     * For instance, in the expression `(1 + 2) * 3`, the BinaryExpression
     * whose operator is "+" needs parentheses, because `1 + 2 * 3` would
     * parse differently.
     *
     * If assumeExpressionContext === true, we don't worry about edge cases
     * like an anonymous FunctionExpression appearing lexically first in its
     * enclosing statement and thus needing parentheses to avoid being parsed
     * as a FunctionDeclaration with a missing name.
     */
    NPp.needsParens = function (assumeExpressionContext) {
        var pp = this.parentPath;
        if (!pp) {
            return false;
        }
        var node = this.value;
        // Only expressions need parentheses.
        if (!n.Expression.check(node)) {
            return false;
        }
        // Identifiers never need parentheses.
        if (node.type === "Identifier") {
            return false;
        }
        while (!n.Node.check(pp.value)) {
            pp = pp.parentPath;
            if (!pp) {
                return false;
            }
        }
        var parent = pp.value;
        switch (node.type) {
            case "UnaryExpression":
            case "SpreadElement":
            case "SpreadProperty":
                return parent.type === "MemberExpression"
                    && this.name === "object"
                    && parent.object === node;
            case "BinaryExpression":
            case "LogicalExpression":
                switch (parent.type) {
                    case "CallExpression":
                        return this.name === "callee"
                            && parent.callee === node;
                    case "UnaryExpression":
                    case "SpreadElement":
                    case "SpreadProperty":
                        return true;
                    case "MemberExpression":
                        return this.name === "object"
                            && parent.object === node;
                    case "BinaryExpression":
                    case "LogicalExpression": {
                        var n_1 = node;
                        var po = parent.operator;
                        var pp_1 = PRECEDENCE[po];
                        var no = n_1.operator;
                        var np = PRECEDENCE[no];
                        if (pp_1 > np) {
                            return true;
                        }
                        if (pp_1 === np && this.name === "right") {
                            if (parent.right !== n_1) {
                                throw new Error("Nodes must be equal");
                            }
                            return true;
                        }
                    }
                    default:
                        return false;
                }
            case "SequenceExpression":
                switch (parent.type) {
                    case "ForStatement":
                        // Although parentheses wouldn't hurt around sequence
                        // expressions in the head of for loops, traditional style
                        // dictates that e.g. i++, j++ should not be wrapped with
                        // parentheses.
                        return false;
                    case "ExpressionStatement":
                        return this.name !== "expression";
                    default:
                        // Otherwise err on the side of overparenthesization, adding
                        // explicit exceptions above if this proves overzealous.
                        return true;
                }
            case "YieldExpression":
                switch (parent.type) {
                    case "BinaryExpression":
                    case "LogicalExpression":
                    case "UnaryExpression":
                    case "SpreadElement":
                    case "SpreadProperty":
                    case "CallExpression":
                    case "MemberExpression":
                    case "NewExpression":
                    case "ConditionalExpression":
                    case "YieldExpression":
                        return true;
                    default:
                        return false;
                }
            case "Literal":
                return parent.type === "MemberExpression"
                    && isNumber.check(node.value)
                    && this.name === "object"
                    && parent.object === node;
            case "AssignmentExpression":
            case "ConditionalExpression":
                switch (parent.type) {
                    case "UnaryExpression":
                    case "SpreadElement":
                    case "SpreadProperty":
                    case "BinaryExpression":
                    case "LogicalExpression":
                        return true;
                    case "CallExpression":
                        return this.name === "callee"
                            && parent.callee === node;
                    case "ConditionalExpression":
                        return this.name === "test"
                            && parent.test === node;
                    case "MemberExpression":
                        return this.name === "object"
                            && parent.object === node;
                    default:
                        return false;
                }
            default:
                if (parent.type === "NewExpression" &&
                    this.name === "callee" &&
                    parent.callee === node) {
                    return containsCallExpression(node);
                }
        }
        if (assumeExpressionContext !== true &&
            !this.canBeFirstInStatement() &&
            this.firstInStatement())
            return true;
        return false;
    };
    function isBinary(node) {
        return n.BinaryExpression.check(node)
            || n.LogicalExpression.check(node);
    }
    // @ts-ignore 'isUnaryLike' is declared but its value is never read. [6133]
    function isUnaryLike(node) {
        return n.UnaryExpression.check(node)
            // I considered making SpreadElement and SpreadProperty subtypes
            // of UnaryExpression, but they're not really Expression nodes.
            || (n.SpreadElement && n.SpreadElement.check(node))
            || (n.SpreadProperty && n.SpreadProperty.check(node));
    }
    var PRECEDENCE = {};
    [["||"],
        ["&&"],
        ["|"],
        ["^"],
        ["&"],
        ["==", "===", "!=", "!=="],
        ["<", ">", "<=", ">=", "in", "instanceof"],
        [">>", "<<", ">>>"],
        ["+", "-"],
        ["*", "/", "%"]
    ].forEach(function (tier, i) {
        tier.forEach(function (op) {
            PRECEDENCE[op] = i;
        });
    });
    function containsCallExpression(node) {
        if (n.CallExpression.check(node)) {
            return true;
        }
        if (isArray.check(node)) {
            return node.some(containsCallExpression);
        }
        if (n.Node.check(node)) {
            return types.someField(node, function (_name, child) {
                return containsCallExpression(child);
            });
        }
        return false;
    }
    NPp.canBeFirstInStatement = function () {
        var node = this.node;
        return !n.FunctionExpression.check(node)
            && !n.ObjectExpression.check(node);
    };
    NPp.firstInStatement = function () {
        return firstInStatement(this);
    };
    function firstInStatement(path) {
        for (var node, parent; path.parent; path = path.parent) {
            node = path.node;
            parent = path.parent.node;
            if (n.BlockStatement.check(parent) &&
                path.parent.name === "body" &&
                path.name === 0) {
                if (parent.body[0] !== node) {
                    throw new Error("Nodes must be equal");
                }
                return true;
            }
            if (n.ExpressionStatement.check(parent) &&
                path.name === "expression") {
                if (parent.expression !== node) {
                    throw new Error("Nodes must be equal");
                }
                return true;
            }
            if (n.SequenceExpression.check(parent) &&
                path.parent.name === "expressions" &&
                path.name === 0) {
                if (parent.expressions[0] !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }
            if (n.CallExpression.check(parent) &&
                path.name === "callee") {
                if (parent.callee !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }
            if (n.MemberExpression.check(parent) &&
                path.name === "object") {
                if (parent.object !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }
            if (n.ConditionalExpression.check(parent) &&
                path.name === "test") {
                if (parent.test !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }
            if (isBinary(parent) &&
                path.name === "left") {
                if (parent.left !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }
            if (n.UnaryExpression.check(parent) &&
                !parent.prefix &&
                path.name === "argument") {
                if (parent.argument !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }
            return false;
        }
        return true;
    }
    /**
     * Pruning certain nodes will result in empty or incomplete nodes, here we clean those nodes up.
     */
    function cleanUpNodesAfterPrune(remainingNodePath) {
        if (n.VariableDeclaration.check(remainingNodePath.node)) {
            var declarations = remainingNodePath.get('declarations').value;
            if (!declarations || declarations.length === 0) {
                return remainingNodePath.prune();
            }
        }
        else if (n.ExpressionStatement.check(remainingNodePath.node)) {
            if (!remainingNodePath.get('expression').value) {
                return remainingNodePath.prune();
            }
        }
        else if (n.IfStatement.check(remainingNodePath.node)) {
            cleanUpIfStatementAfterPrune(remainingNodePath);
        }
        return remainingNodePath;
    }
    function cleanUpIfStatementAfterPrune(ifStatement) {
        var testExpression = ifStatement.get('test').value;
        var alternate = ifStatement.get('alternate').value;
        var consequent = ifStatement.get('consequent').value;
        if (!consequent && !alternate) {
            var testExpressionStatement = b.expressionStatement(testExpression);
            ifStatement.replace(testExpressionStatement);
        }
        else if (!consequent && alternate) {
            var negatedTestExpression = b.unaryExpression('!', testExpression, true);
            if (n.UnaryExpression.check(testExpression) && testExpression.operator === '!') {
                negatedTestExpression = testExpression.argument;
            }
            ifStatement.get("test").replace(negatedTestExpression);
            ifStatement.get("consequent").replace(alternate);
            ifStatement.get("alternate").replace();
        }
    }
    return NodePath;
}
exports.default = nodePathPlugin;
module.exports = exports["default"];

},{"./path":164,"./scope":165,"./types":167,"tslib":266}],163:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("./types"));
var node_path_1 = tslib_1.__importDefault(require("./node-path"));
var hasOwn = Object.prototype.hasOwnProperty;
function pathVisitorPlugin(fork) {
    var types = fork.use(types_1.default);
    var NodePath = fork.use(node_path_1.default);
    var isArray = types.builtInTypes.array;
    var isObject = types.builtInTypes.object;
    var isFunction = types.builtInTypes.function;
    var undefined;
    var PathVisitor = function PathVisitor() {
        if (!(this instanceof PathVisitor)) {
            throw new Error("PathVisitor constructor cannot be invoked without 'new'");
        }
        // Permanent state.
        this._reusableContextStack = [];
        this._methodNameTable = computeMethodNameTable(this);
        this._shouldVisitComments =
            hasOwn.call(this._methodNameTable, "Block") ||
                hasOwn.call(this._methodNameTable, "Line");
        this.Context = makeContextConstructor(this);
        // State reset every time PathVisitor.prototype.visit is called.
        this._visiting = false;
        this._changeReported = false;
    };
    function computeMethodNameTable(visitor) {
        var typeNames = Object.create(null);
        for (var methodName in visitor) {
            if (/^visit[A-Z]/.test(methodName)) {
                typeNames[methodName.slice("visit".length)] = true;
            }
        }
        var supertypeTable = types.computeSupertypeLookupTable(typeNames);
        var methodNameTable = Object.create(null);
        var typeNameKeys = Object.keys(supertypeTable);
        var typeNameCount = typeNameKeys.length;
        for (var i = 0; i < typeNameCount; ++i) {
            var typeName = typeNameKeys[i];
            methodName = "visit" + supertypeTable[typeName];
            if (isFunction.check(visitor[methodName])) {
                methodNameTable[typeName] = methodName;
            }
        }
        return methodNameTable;
    }
    PathVisitor.fromMethodsObject = function fromMethodsObject(methods) {
        if (methods instanceof PathVisitor) {
            return methods;
        }
        if (!isObject.check(methods)) {
            // An empty visitor?
            return new PathVisitor;
        }
        var Visitor = function Visitor() {
            if (!(this instanceof Visitor)) {
                throw new Error("Visitor constructor cannot be invoked without 'new'");
            }
            PathVisitor.call(this);
        };
        var Vp = Visitor.prototype = Object.create(PVp);
        Vp.constructor = Visitor;
        extend(Vp, methods);
        extend(Visitor, PathVisitor);
        isFunction.assert(Visitor.fromMethodsObject);
        isFunction.assert(Visitor.visit);
        return new Visitor;
    };
    function extend(target, source) {
        for (var property in source) {
            if (hasOwn.call(source, property)) {
                target[property] = source[property];
            }
        }
        return target;
    }
    PathVisitor.visit = function visit(node, methods) {
        return PathVisitor.fromMethodsObject(methods).visit(node);
    };
    var PVp = PathVisitor.prototype;
    PVp.visit = function () {
        if (this._visiting) {
            throw new Error("Recursively calling visitor.visit(path) resets visitor state. " +
                "Try this.visit(path) or this.traverse(path) instead.");
        }
        // Private state that needs to be reset before every traversal.
        this._visiting = true;
        this._changeReported = false;
        this._abortRequested = false;
        var argc = arguments.length;
        var args = new Array(argc);
        for (var i = 0; i < argc; ++i) {
            args[i] = arguments[i];
        }
        if (!(args[0] instanceof NodePath)) {
            args[0] = new NodePath({ root: args[0] }).get("root");
        }
        // Called with the same arguments as .visit.
        this.reset.apply(this, args);
        var didNotThrow;
        try {
            var root = this.visitWithoutReset(args[0]);
            didNotThrow = true;
        }
        finally {
            this._visiting = false;
            if (!didNotThrow && this._abortRequested) {
                // If this.visitWithoutReset threw an exception and
                // this._abortRequested was set to true, return the root of
                // the AST instead of letting the exception propagate, so that
                // client code does not have to provide a try-catch block to
                // intercept the AbortRequest exception.  Other kinds of
                // exceptions will propagate without being intercepted and
                // rethrown by a catch block, so their stacks will accurately
                // reflect the original throwing context.
                return args[0].value;
            }
        }
        return root;
    };
    PVp.AbortRequest = function AbortRequest() { };
    PVp.abort = function () {
        var visitor = this;
        visitor._abortRequested = true;
        var request = new visitor.AbortRequest();
        // If you decide to catch this exception and stop it from propagating,
        // make sure to call its cancel method to avoid silencing other
        // exceptions that might be thrown later in the traversal.
        request.cancel = function () {
            visitor._abortRequested = false;
        };
        throw request;
    };
    PVp.reset = function (_path /*, additional arguments */) {
        // Empty stub; may be reassigned or overridden by subclasses.
    };
    PVp.visitWithoutReset = function (path) {
        if (this instanceof this.Context) {
            // Since this.Context.prototype === this, there's a chance we
            // might accidentally call context.visitWithoutReset. If that
            // happens, re-invoke the method against context.visitor.
            return this.visitor.visitWithoutReset(path);
        }
        if (!(path instanceof NodePath)) {
            throw new Error("");
        }
        var value = path.value;
        var methodName = value &&
            typeof value === "object" &&
            typeof value.type === "string" &&
            this._methodNameTable[value.type];
        if (methodName) {
            var context = this.acquireContext(path);
            try {
                return context.invokeVisitorMethod(methodName);
            }
            finally {
                this.releaseContext(context);
            }
        }
        else {
            // If there was no visitor method to call, visit the children of
            // this node generically.
            return visitChildren(path, this);
        }
    };
    function visitChildren(path, visitor) {
        if (!(path instanceof NodePath)) {
            throw new Error("");
        }
        if (!(visitor instanceof PathVisitor)) {
            throw new Error("");
        }
        var value = path.value;
        if (isArray.check(value)) {
            path.each(visitor.visitWithoutReset, visitor);
        }
        else if (!isObject.check(value)) {
            // No children to visit.
        }
        else {
            var childNames = types.getFieldNames(value);
            // The .comments field of the Node type is hidden, so we only
            // visit it if the visitor defines visitBlock or visitLine, and
            // value.comments is defined.
            if (visitor._shouldVisitComments &&
                value.comments &&
                childNames.indexOf("comments") < 0) {
                childNames.push("comments");
            }
            var childCount = childNames.length;
            var childPaths = [];
            for (var i = 0; i < childCount; ++i) {
                var childName = childNames[i];
                if (!hasOwn.call(value, childName)) {
                    value[childName] = types.getFieldValue(value, childName);
                }
                childPaths.push(path.get(childName));
            }
            for (var i = 0; i < childCount; ++i) {
                visitor.visitWithoutReset(childPaths[i]);
            }
        }
        return path.value;
    }
    PVp.acquireContext = function (path) {
        if (this._reusableContextStack.length === 0) {
            return new this.Context(path);
        }
        return this._reusableContextStack.pop().reset(path);
    };
    PVp.releaseContext = function (context) {
        if (!(context instanceof this.Context)) {
            throw new Error("");
        }
        this._reusableContextStack.push(context);
        context.currentPath = null;
    };
    PVp.reportChanged = function () {
        this._changeReported = true;
    };
    PVp.wasChangeReported = function () {
        return this._changeReported;
    };
    function makeContextConstructor(visitor) {
        function Context(path) {
            if (!(this instanceof Context)) {
                throw new Error("");
            }
            if (!(this instanceof PathVisitor)) {
                throw new Error("");
            }
            if (!(path instanceof NodePath)) {
                throw new Error("");
            }
            Object.defineProperty(this, "visitor", {
                value: visitor,
                writable: false,
                enumerable: true,
                configurable: false
            });
            this.currentPath = path;
            this.needToCallTraverse = true;
            Object.seal(this);
        }
        if (!(visitor instanceof PathVisitor)) {
            throw new Error("");
        }
        // Note that the visitor object is the prototype of Context.prototype,
        // so all visitor methods are inherited by context objects.
        var Cp = Context.prototype = Object.create(visitor);
        Cp.constructor = Context;
        extend(Cp, sharedContextProtoMethods);
        return Context;
    }
    // Every PathVisitor has a different this.Context constructor and
    // this.Context.prototype object, but those prototypes can all use the
    // same reset, invokeVisitorMethod, and traverse function objects.
    var sharedContextProtoMethods = Object.create(null);
    sharedContextProtoMethods.reset =
        function reset(path) {
            if (!(this instanceof this.Context)) {
                throw new Error("");
            }
            if (!(path instanceof NodePath)) {
                throw new Error("");
            }
            this.currentPath = path;
            this.needToCallTraverse = true;
            return this;
        };
    sharedContextProtoMethods.invokeVisitorMethod =
        function invokeVisitorMethod(methodName) {
            if (!(this instanceof this.Context)) {
                throw new Error("");
            }
            if (!(this.currentPath instanceof NodePath)) {
                throw new Error("");
            }
            var result = this.visitor[methodName].call(this, this.currentPath);
            if (result === false) {
                // Visitor methods return false to indicate that they have handled
                // their own traversal needs, and we should not complain if
                // this.needToCallTraverse is still true.
                this.needToCallTraverse = false;
            }
            else if (result !== undefined) {
                // Any other non-undefined value returned from the visitor method
                // is interpreted as a replacement value.
                this.currentPath = this.currentPath.replace(result)[0];
                if (this.needToCallTraverse) {
                    // If this.traverse still hasn't been called, visit the
                    // children of the replacement node.
                    this.traverse(this.currentPath);
                }
            }
            if (this.needToCallTraverse !== false) {
                throw new Error("Must either call this.traverse or return false in " + methodName);
            }
            var path = this.currentPath;
            return path && path.value;
        };
    sharedContextProtoMethods.traverse =
        function traverse(path, newVisitor) {
            if (!(this instanceof this.Context)) {
                throw new Error("");
            }
            if (!(path instanceof NodePath)) {
                throw new Error("");
            }
            if (!(this.currentPath instanceof NodePath)) {
                throw new Error("");
            }
            this.needToCallTraverse = false;
            return visitChildren(path, PathVisitor.fromMethodsObject(newVisitor || this.visitor));
        };
    sharedContextProtoMethods.visit =
        function visit(path, newVisitor) {
            if (!(this instanceof this.Context)) {
                throw new Error("");
            }
            if (!(path instanceof NodePath)) {
                throw new Error("");
            }
            if (!(this.currentPath instanceof NodePath)) {
                throw new Error("");
            }
            this.needToCallTraverse = false;
            return PathVisitor.fromMethodsObject(newVisitor || this.visitor).visitWithoutReset(path);
        };
    sharedContextProtoMethods.reportChanged = function reportChanged() {
        this.visitor.reportChanged();
    };
    sharedContextProtoMethods.abort = function abort() {
        this.needToCallTraverse = false;
        this.visitor.abort();
    };
    return PathVisitor;
}
exports.default = pathVisitorPlugin;
module.exports = exports["default"];

},{"./node-path":162,"./types":167,"tslib":266}],164:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("./types"));
var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;
function pathPlugin(fork) {
    var types = fork.use(types_1.default);
    var isArray = types.builtInTypes.array;
    var isNumber = types.builtInTypes.number;
    var Path = function Path(value, parentPath, name) {
        if (!(this instanceof Path)) {
            throw new Error("Path constructor cannot be invoked without 'new'");
        }
        if (parentPath) {
            if (!(parentPath instanceof Path)) {
                throw new Error("");
            }
        }
        else {
            parentPath = null;
            name = null;
        }
        // The value encapsulated by this Path, generally equal to
        // parentPath.value[name] if we have a parentPath.
        this.value = value;
        // The immediate parent Path of this Path.
        this.parentPath = parentPath;
        // The name of the property of parentPath.value through which this
        // Path's value was reached.
        this.name = name;
        // Calling path.get("child") multiple times always returns the same
        // child Path object, for both performance and consistency reasons.
        this.__childCache = null;
    };
    var Pp = Path.prototype;
    function getChildCache(path) {
        // Lazily create the child cache. This also cheapens cache
        // invalidation, since you can just reset path.__childCache to null.
        return path.__childCache || (path.__childCache = Object.create(null));
    }
    function getChildPath(path, name) {
        var cache = getChildCache(path);
        var actualChildValue = path.getValueProperty(name);
        var childPath = cache[name];
        if (!hasOwn.call(cache, name) ||
            // Ensure consistency between cache and reality.
            childPath.value !== actualChildValue) {
            childPath = cache[name] = new path.constructor(actualChildValue, path, name);
        }
        return childPath;
    }
    // This method is designed to be overridden by subclasses that need to
    // handle missing properties, etc.
    Pp.getValueProperty = function getValueProperty(name) {
        return this.value[name];
    };
    Pp.get = function get() {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        var path = this;
        var count = names.length;
        for (var i = 0; i < count; ++i) {
            path = getChildPath(path, names[i]);
        }
        return path;
    };
    Pp.each = function each(callback, context) {
        var childPaths = [];
        var len = this.value.length;
        var i = 0;
        // Collect all the original child paths before invoking the callback.
        for (var i = 0; i < len; ++i) {
            if (hasOwn.call(this.value, i)) {
                childPaths[i] = this.get(i);
            }
        }
        // Invoke the callback on just the original child paths, regardless of
        // any modifications made to the array by the callback. I chose these
        // semantics over cleverly invoking the callback on new elements because
        // this way is much easier to reason about.
        context = context || this;
        for (i = 0; i < len; ++i) {
            if (hasOwn.call(childPaths, i)) {
                callback.call(context, childPaths[i]);
            }
        }
    };
    Pp.map = function map(callback, context) {
        var result = [];
        this.each(function (childPath) {
            result.push(callback.call(this, childPath));
        }, context);
        return result;
    };
    Pp.filter = function filter(callback, context) {
        var result = [];
        this.each(function (childPath) {
            if (callback.call(this, childPath)) {
                result.push(childPath);
            }
        }, context);
        return result;
    };
    function emptyMoves() { }
    function getMoves(path, offset, start, end) {
        isArray.assert(path.value);
        if (offset === 0) {
            return emptyMoves;
        }
        var length = path.value.length;
        if (length < 1) {
            return emptyMoves;
        }
        var argc = arguments.length;
        if (argc === 2) {
            start = 0;
            end = length;
        }
        else if (argc === 3) {
            start = Math.max(start, 0);
            end = length;
        }
        else {
            start = Math.max(start, 0);
            end = Math.min(end, length);
        }
        isNumber.assert(start);
        isNumber.assert(end);
        var moves = Object.create(null);
        var cache = getChildCache(path);
        for (var i = start; i < end; ++i) {
            if (hasOwn.call(path.value, i)) {
                var childPath = path.get(i);
                if (childPath.name !== i) {
                    throw new Error("");
                }
                var newIndex = i + offset;
                childPath.name = newIndex;
                moves[newIndex] = childPath;
                delete cache[i];
            }
        }
        delete cache.length;
        return function () {
            for (var newIndex in moves) {
                var childPath = moves[newIndex];
                if (childPath.name !== +newIndex) {
                    throw new Error("");
                }
                cache[newIndex] = childPath;
                path.value[newIndex] = childPath.value;
            }
        };
    }
    Pp.shift = function shift() {
        var move = getMoves(this, -1);
        var result = this.value.shift();
        move();
        return result;
    };
    Pp.unshift = function unshift() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var move = getMoves(this, args.length);
        var result = this.value.unshift.apply(this.value, args);
        move();
        return result;
    };
    Pp.push = function push() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        isArray.assert(this.value);
        delete getChildCache(this).length;
        return this.value.push.apply(this.value, args);
    };
    Pp.pop = function pop() {
        isArray.assert(this.value);
        var cache = getChildCache(this);
        delete cache[this.value.length - 1];
        delete cache.length;
        return this.value.pop();
    };
    Pp.insertAt = function insertAt(index) {
        var argc = arguments.length;
        var move = getMoves(this, argc - 1, index);
        if (move === emptyMoves && argc <= 1) {
            return this;
        }
        index = Math.max(index, 0);
        for (var i = 1; i < argc; ++i) {
            this.value[index + i - 1] = arguments[i];
        }
        move();
        return this;
    };
    Pp.insertBefore = function insertBefore() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var pp = this.parentPath;
        var argc = args.length;
        var insertAtArgs = [this.name];
        for (var i = 0; i < argc; ++i) {
            insertAtArgs.push(args[i]);
        }
        return pp.insertAt.apply(pp, insertAtArgs);
    };
    Pp.insertAfter = function insertAfter() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var pp = this.parentPath;
        var argc = args.length;
        var insertAtArgs = [this.name + 1];
        for (var i = 0; i < argc; ++i) {
            insertAtArgs.push(args[i]);
        }
        return pp.insertAt.apply(pp, insertAtArgs);
    };
    function repairRelationshipWithParent(path) {
        if (!(path instanceof Path)) {
            throw new Error("");
        }
        var pp = path.parentPath;
        if (!pp) {
            // Orphan paths have no relationship to repair.
            return path;
        }
        var parentValue = pp.value;
        var parentCache = getChildCache(pp);
        // Make sure parentCache[path.name] is populated.
        if (parentValue[path.name] === path.value) {
            parentCache[path.name] = path;
        }
        else if (isArray.check(parentValue)) {
            // Something caused path.name to become out of date, so attempt to
            // recover by searching for path.value in parentValue.
            var i = parentValue.indexOf(path.value);
            if (i >= 0) {
                parentCache[path.name = i] = path;
            }
        }
        else {
            // If path.value disagrees with parentValue[path.name], and
            // path.name is not an array index, let path.value become the new
            // parentValue[path.name] and update parentCache accordingly.
            parentValue[path.name] = path.value;
            parentCache[path.name] = path;
        }
        if (parentValue[path.name] !== path.value) {
            throw new Error("");
        }
        if (path.parentPath.get(path.name) !== path) {
            throw new Error("");
        }
        return path;
    }
    Pp.replace = function replace(replacement) {
        var results = [];
        var parentValue = this.parentPath.value;
        var parentCache = getChildCache(this.parentPath);
        var count = arguments.length;
        repairRelationshipWithParent(this);
        if (isArray.check(parentValue)) {
            var originalLength = parentValue.length;
            var move = getMoves(this.parentPath, count - 1, this.name + 1);
            var spliceArgs = [this.name, 1];
            for (var i = 0; i < count; ++i) {
                spliceArgs.push(arguments[i]);
            }
            var splicedOut = parentValue.splice.apply(parentValue, spliceArgs);
            if (splicedOut[0] !== this.value) {
                throw new Error("");
            }
            if (parentValue.length !== (originalLength - 1 + count)) {
                throw new Error("");
            }
            move();
            if (count === 0) {
                delete this.value;
                delete parentCache[this.name];
                this.__childCache = null;
            }
            else {
                if (parentValue[this.name] !== replacement) {
                    throw new Error("");
                }
                if (this.value !== replacement) {
                    this.value = replacement;
                    this.__childCache = null;
                }
                for (i = 0; i < count; ++i) {
                    results.push(this.parentPath.get(this.name + i));
                }
                if (results[0] !== this) {
                    throw new Error("");
                }
            }
        }
        else if (count === 1) {
            if (this.value !== replacement) {
                this.__childCache = null;
            }
            this.value = parentValue[this.name] = replacement;
            results.push(this);
        }
        else if (count === 0) {
            delete parentValue[this.name];
            delete this.value;
            this.__childCache = null;
            // Leave this path cached as parentCache[this.name], even though
            // it no longer has a value defined.
        }
        else {
            throw new Error("Could not replace path");
        }
        return results;
    };
    return Path;
}
exports.default = pathPlugin;
module.exports = exports["default"];

},{"./types":167,"tslib":266}],165:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("./types"));
var hasOwn = Object.prototype.hasOwnProperty;
function scopePlugin(fork) {
    var types = fork.use(types_1.default);
    var Type = types.Type;
    var namedTypes = types.namedTypes;
    var Node = namedTypes.Node;
    var Expression = namedTypes.Expression;
    var isArray = types.builtInTypes.array;
    var b = types.builders;
    var Scope = function Scope(path, parentScope) {
        if (!(this instanceof Scope)) {
            throw new Error("Scope constructor cannot be invoked without 'new'");
        }
        ScopeType.assert(path.value);
        var depth;
        if (parentScope) {
            if (!(parentScope instanceof Scope)) {
                throw new Error("");
            }
            depth = parentScope.depth + 1;
        }
        else {
            parentScope = null;
            depth = 0;
        }
        Object.defineProperties(this, {
            path: { value: path },
            node: { value: path.value },
            isGlobal: { value: !parentScope, enumerable: true },
            depth: { value: depth },
            parent: { value: parentScope },
            bindings: { value: {} },
            types: { value: {} },
        });
    };
    var scopeTypes = [
        // Program nodes introduce global scopes.
        namedTypes.Program,
        // Function is the supertype of FunctionExpression,
        // FunctionDeclaration, ArrowExpression, etc.
        namedTypes.Function,
        // In case you didn't know, the caught parameter shadows any variable
        // of the same name in an outer scope.
        namedTypes.CatchClause
    ];
    var ScopeType = Type.or.apply(Type, scopeTypes);
    Scope.isEstablishedBy = function (node) {
        return ScopeType.check(node);
    };
    var Sp = Scope.prototype;
    // Will be overridden after an instance lazily calls scanScope.
    Sp.didScan = false;
    Sp.declares = function (name) {
        this.scan();
        return hasOwn.call(this.bindings, name);
    };
    Sp.declaresType = function (name) {
        this.scan();
        return hasOwn.call(this.types, name);
    };
    Sp.declareTemporary = function (prefix) {
        if (prefix) {
            if (!/^[a-z$_]/i.test(prefix)) {
                throw new Error("");
            }
        }
        else {
            prefix = "t$";
        }
        // Include this.depth in the name to make sure the name does not
        // collide with any variables in nested/enclosing scopes.
        prefix += this.depth.toString(36) + "$";
        this.scan();
        var index = 0;
        while (this.declares(prefix + index)) {
            ++index;
        }
        var name = prefix + index;
        return this.bindings[name] = types.builders.identifier(name);
    };
    Sp.injectTemporary = function (identifier, init) {
        identifier || (identifier = this.declareTemporary());
        var bodyPath = this.path.get("body");
        if (namedTypes.BlockStatement.check(bodyPath.value)) {
            bodyPath = bodyPath.get("body");
        }
        bodyPath.unshift(b.variableDeclaration("var", [b.variableDeclarator(identifier, init || null)]));
        return identifier;
    };
    Sp.scan = function (force) {
        if (force || !this.didScan) {
            for (var name in this.bindings) {
                // Empty out this.bindings, just in cases.
                delete this.bindings[name];
            }
            scanScope(this.path, this.bindings, this.types);
            this.didScan = true;
        }
    };
    Sp.getBindings = function () {
        this.scan();
        return this.bindings;
    };
    Sp.getTypes = function () {
        this.scan();
        return this.types;
    };
    function scanScope(path, bindings, scopeTypes) {
        var node = path.value;
        ScopeType.assert(node);
        if (namedTypes.CatchClause.check(node)) {
            // A catch clause establishes a new scope but the only variable
            // bound in that scope is the catch parameter. Any other
            // declarations create bindings in the outer scope.
            var param = path.get("param");
            if (param.value) {
                addPattern(param, bindings);
            }
        }
        else {
            recursiveScanScope(path, bindings, scopeTypes);
        }
    }
    function recursiveScanScope(path, bindings, scopeTypes) {
        var node = path.value;
        if (path.parent &&
            namedTypes.FunctionExpression.check(path.parent.node) &&
            path.parent.node.id) {
            addPattern(path.parent.get("id"), bindings);
        }
        if (!node) {
            // None of the remaining cases matter if node is falsy.
        }
        else if (isArray.check(node)) {
            path.each(function (childPath) {
                recursiveScanChild(childPath, bindings, scopeTypes);
            });
        }
        else if (namedTypes.Function.check(node)) {
            path.get("params").each(function (paramPath) {
                addPattern(paramPath, bindings);
            });
            recursiveScanChild(path.get("body"), bindings, scopeTypes);
        }
        else if ((namedTypes.TypeAlias && namedTypes.TypeAlias.check(node)) ||
            (namedTypes.InterfaceDeclaration && namedTypes.InterfaceDeclaration.check(node)) ||
            (namedTypes.TSTypeAliasDeclaration && namedTypes.TSTypeAliasDeclaration.check(node)) ||
            (namedTypes.TSInterfaceDeclaration && namedTypes.TSInterfaceDeclaration.check(node))) {
            addTypePattern(path.get("id"), scopeTypes);
        }
        else if (namedTypes.VariableDeclarator.check(node)) {
            addPattern(path.get("id"), bindings);
            recursiveScanChild(path.get("init"), bindings, scopeTypes);
        }
        else if (node.type === "ImportSpecifier" ||
            node.type === "ImportNamespaceSpecifier" ||
            node.type === "ImportDefaultSpecifier") {
            addPattern(
            // Esprima used to use the .name field to refer to the local
            // binding identifier for ImportSpecifier nodes, but .id for
            // ImportNamespaceSpecifier and ImportDefaultSpecifier nodes.
            // ESTree/Acorn/ESpree use .local for all three node types.
            path.get(node.local ? "local" :
                node.name ? "name" : "id"), bindings);
        }
        else if (Node.check(node) && !Expression.check(node)) {
            types.eachField(node, function (name, child) {
                var childPath = path.get(name);
                if (!pathHasValue(childPath, child)) {
                    throw new Error("");
                }
                recursiveScanChild(childPath, bindings, scopeTypes);
            });
        }
    }
    function pathHasValue(path, value) {
        if (path.value === value) {
            return true;
        }
        // Empty arrays are probably produced by defaults.emptyArray, in which
        // case is makes sense to regard them as equivalent, if not ===.
        if (Array.isArray(path.value) &&
            path.value.length === 0 &&
            Array.isArray(value) &&
            value.length === 0) {
            return true;
        }
        return false;
    }
    function recursiveScanChild(path, bindings, scopeTypes) {
        var node = path.value;
        if (!node || Expression.check(node)) {
            // Ignore falsy values and Expressions.
        }
        else if (namedTypes.FunctionDeclaration.check(node) &&
            node.id !== null) {
            addPattern(path.get("id"), bindings);
        }
        else if (namedTypes.ClassDeclaration &&
            namedTypes.ClassDeclaration.check(node)) {
            addPattern(path.get("id"), bindings);
        }
        else if (ScopeType.check(node)) {
            if (namedTypes.CatchClause.check(node) &&
                // TODO Broaden this to accept any pattern.
                namedTypes.Identifier.check(node.param)) {
                var catchParamName = node.param.name;
                var hadBinding = hasOwn.call(bindings, catchParamName);
                // Any declarations that occur inside the catch body that do
                // not have the same name as the catch parameter should count
                // as bindings in the outer scope.
                recursiveScanScope(path.get("body"), bindings, scopeTypes);
                // If a new binding matching the catch parameter name was
                // created while scanning the catch body, ignore it because it
                // actually refers to the catch parameter and not the outer
                // scope that we're currently scanning.
                if (!hadBinding) {
                    delete bindings[catchParamName];
                }
            }
        }
        else {
            recursiveScanScope(path, bindings, scopeTypes);
        }
    }
    function addPattern(patternPath, bindings) {
        var pattern = patternPath.value;
        namedTypes.Pattern.assert(pattern);
        if (namedTypes.Identifier.check(pattern)) {
            if (hasOwn.call(bindings, pattern.name)) {
                bindings[pattern.name].push(patternPath);
            }
            else {
                bindings[pattern.name] = [patternPath];
            }
        }
        else if (namedTypes.AssignmentPattern &&
            namedTypes.AssignmentPattern.check(pattern)) {
            addPattern(patternPath.get('left'), bindings);
        }
        else if (namedTypes.ObjectPattern &&
            namedTypes.ObjectPattern.check(pattern)) {
            patternPath.get('properties').each(function (propertyPath) {
                var property = propertyPath.value;
                if (namedTypes.Pattern.check(property)) {
                    addPattern(propertyPath, bindings);
                }
                else if (namedTypes.Property.check(property)) {
                    addPattern(propertyPath.get('value'), bindings);
                }
                else if (namedTypes.SpreadProperty &&
                    namedTypes.SpreadProperty.check(property)) {
                    addPattern(propertyPath.get('argument'), bindings);
                }
            });
        }
        else if (namedTypes.ArrayPattern &&
            namedTypes.ArrayPattern.check(pattern)) {
            patternPath.get('elements').each(function (elementPath) {
                var element = elementPath.value;
                if (namedTypes.Pattern.check(element)) {
                    addPattern(elementPath, bindings);
                }
                else if (namedTypes.SpreadElement &&
                    namedTypes.SpreadElement.check(element)) {
                    addPattern(elementPath.get("argument"), bindings);
                }
            });
        }
        else if (namedTypes.PropertyPattern &&
            namedTypes.PropertyPattern.check(pattern)) {
            addPattern(patternPath.get('pattern'), bindings);
        }
        else if ((namedTypes.SpreadElementPattern &&
            namedTypes.SpreadElementPattern.check(pattern)) ||
            (namedTypes.RestElement &&
                namedTypes.RestElement.check(pattern)) ||
            (namedTypes.SpreadPropertyPattern &&
                namedTypes.SpreadPropertyPattern.check(pattern))) {
            addPattern(patternPath.get('argument'), bindings);
        }
    }
    function addTypePattern(patternPath, types) {
        var pattern = patternPath.value;
        namedTypes.Pattern.assert(pattern);
        if (namedTypes.Identifier.check(pattern)) {
            if (hasOwn.call(types, pattern.name)) {
                types[pattern.name].push(patternPath);
            }
            else {
                types[pattern.name] = [patternPath];
            }
        }
    }
    Sp.lookup = function (name) {
        for (var scope = this; scope; scope = scope.parent)
            if (scope.declares(name))
                break;
        return scope;
    };
    Sp.lookupType = function (name) {
        for (var scope = this; scope; scope = scope.parent)
            if (scope.declaresType(name))
                break;
        return scope;
    };
    Sp.getGlobalScope = function () {
        var scope = this;
        while (!scope.isGlobal)
            scope = scope.parent;
        return scope;
    };
    return Scope;
}
exports.default = scopePlugin;
module.exports = exports["default"];

},{"./types":167,"tslib":266}],166:[function(require,module,exports){
"use strict";;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var types_1 = tslib_1.__importDefault(require("./types"));
function default_1(fork) {
    var types = fork.use(types_1.default);
    var Type = types.Type;
    var builtin = types.builtInTypes;
    var isNumber = builtin.number;
    // An example of constructing a new type with arbitrary constraints from
    // an existing type.
    function geq(than) {
        return Type.from(function (value) { return isNumber.check(value) && value >= than; }, isNumber + " >= " + than);
    }
    ;
    // Default value-returning functions that may optionally be passed as a
    // third argument to Def.prototype.field.
    var defaults = {
        // Functions were used because (among other reasons) that's the most
        // elegant way to allow for the emptyArray one always to give a new
        // array instance.
        "null": function () { return null; },
        "emptyArray": function () { return []; },
        "false": function () { return false; },
        "true": function () { return true; },
        "undefined": function () { },
        "use strict": function () { return "use strict"; }
    };
    var naiveIsPrimitive = Type.or(builtin.string, builtin.number, builtin.boolean, builtin.null, builtin.undefined);
    var isPrimitive = Type.from(function (value) {
        if (value === null)
            return true;
        var type = typeof value;
        if (type === "object" ||
            type === "function") {
            return false;
        }
        return true;
    }, naiveIsPrimitive.toString());
    return {
        geq: geq,
        defaults: defaults,
        isPrimitive: isPrimitive,
    };
}
exports.default = default_1;
module.exports = exports["default"];

},{"./types":167,"tslib":266}],167:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Def = void 0;
var tslib_1 = require("tslib");
var Op = Object.prototype;
var objToStr = Op.toString;
var hasOwn = Op.hasOwnProperty;
var BaseType = /** @class */ (function () {
    function BaseType() {
    }
    BaseType.prototype.assert = function (value, deep) {
        if (!this.check(value, deep)) {
            var str = shallowStringify(value);
            throw new Error(str + " does not match type " + this);
        }
        return true;
    };
    BaseType.prototype.arrayOf = function () {
        var elemType = this;
        return new ArrayType(elemType);
    };
    return BaseType;
}());
var ArrayType = /** @class */ (function (_super) {
    tslib_1.__extends(ArrayType, _super);
    function ArrayType(elemType) {
        var _this = _super.call(this) || this;
        _this.elemType = elemType;
        _this.kind = "ArrayType";
        return _this;
    }
    ArrayType.prototype.toString = function () {
        return "[" + this.elemType + "]";
    };
    ArrayType.prototype.check = function (value, deep) {
        var _this = this;
        return Array.isArray(value) && value.every(function (elem) { return _this.elemType.check(elem, deep); });
    };
    return ArrayType;
}(BaseType));
var IdentityType = /** @class */ (function (_super) {
    tslib_1.__extends(IdentityType, _super);
    function IdentityType(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.kind = "IdentityType";
        return _this;
    }
    IdentityType.prototype.toString = function () {
        return String(this.value);
    };
    IdentityType.prototype.check = function (value, deep) {
        var result = value === this.value;
        if (!result && typeof deep === "function") {
            deep(this, value);
        }
        return result;
    };
    return IdentityType;
}(BaseType));
var ObjectType = /** @class */ (function (_super) {
    tslib_1.__extends(ObjectType, _super);
    function ObjectType(fields) {
        var _this = _super.call(this) || this;
        _this.fields = fields;
        _this.kind = "ObjectType";
        return _this;
    }
    ObjectType.prototype.toString = function () {
        return "{ " + this.fields.join(", ") + " }";
    };
    ObjectType.prototype.check = function (value, deep) {
        return (objToStr.call(value) === objToStr.call({}) &&
            this.fields.every(function (field) {
                return field.type.check(value[field.name], deep);
            }));
    };
    return ObjectType;
}(BaseType));
var OrType = /** @class */ (function (_super) {
    tslib_1.__extends(OrType, _super);
    function OrType(types) {
        var _this = _super.call(this) || this;
        _this.types = types;
        _this.kind = "OrType";
        return _this;
    }
    OrType.prototype.toString = function () {
        return this.types.join(" | ");
    };
    OrType.prototype.check = function (value, deep) {
        return this.types.some(function (type) {
            return type.check(value, deep);
        });
    };
    return OrType;
}(BaseType));
var PredicateType = /** @class */ (function (_super) {
    tslib_1.__extends(PredicateType, _super);
    function PredicateType(name, predicate) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.predicate = predicate;
        _this.kind = "PredicateType";
        return _this;
    }
    PredicateType.prototype.toString = function () {
        return this.name;
    };
    PredicateType.prototype.check = function (value, deep) {
        var result = this.predicate(value, deep);
        if (!result && typeof deep === "function") {
            deep(this, value);
        }
        return result;
    };
    return PredicateType;
}(BaseType));
var Def = /** @class */ (function () {
    function Def(type, typeName) {
        this.type = type;
        this.typeName = typeName;
        this.baseNames = [];
        this.ownFields = Object.create(null);
        // Includes own typeName. Populated during finalization.
        this.allSupertypes = Object.create(null);
        // Linear inheritance hierarchy. Populated during finalization.
        this.supertypeList = [];
        // Includes inherited fields.
        this.allFields = Object.create(null);
        // Non-hidden keys of allFields.
        this.fieldNames = [];
        // This property will be overridden as true by individual Def instances
        // when they are finalized.
        this.finalized = false;
        // False by default until .build(...) is called on an instance.
        this.buildable = false;
        this.buildParams = [];
    }
    Def.prototype.isSupertypeOf = function (that) {
        if (that instanceof Def) {
            if (this.finalized !== true ||
                that.finalized !== true) {
                throw new Error("");
            }
            return hasOwn.call(that.allSupertypes, this.typeName);
        }
        else {
            throw new Error(that + " is not a Def");
        }
    };
    Def.prototype.checkAllFields = function (value, deep) {
        var allFields = this.allFields;
        if (this.finalized !== true) {
            throw new Error("" + this.typeName);
        }
        function checkFieldByName(name) {
            var field = allFields[name];
            var type = field.type;
            var child = field.getValue(value);
            return type.check(child, deep);
        }
        return value !== null &&
            typeof value === "object" &&
            Object.keys(allFields).every(checkFieldByName);
    };
    Def.prototype.bases = function () {
        var supertypeNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            supertypeNames[_i] = arguments[_i];
        }
        var bases = this.baseNames;
        if (this.finalized) {
            if (supertypeNames.length !== bases.length) {
                throw new Error("");
            }
            for (var i = 0; i < supertypeNames.length; i++) {
                if (supertypeNames[i] !== bases[i]) {
                    throw new Error("");
                }
            }
            return this;
        }
        supertypeNames.forEach(function (baseName) {
            // This indexOf lookup may be O(n), but the typical number of base
            // names is very small, and indexOf is a native Array method.
            if (bases.indexOf(baseName) < 0) {
                bases.push(baseName);
            }
        });
        return this; // For chaining.
    };
    return Def;
}());
exports.Def = Def;
var Field = /** @class */ (function () {
    function Field(name, type, defaultFn, hidden) {
        this.name = name;
        this.type = type;
        this.defaultFn = defaultFn;
        this.hidden = !!hidden;
    }
    Field.prototype.toString = function () {
        return JSON.stringify(this.name) + ": " + this.type;
    };
    Field.prototype.getValue = function (obj) {
        var value = obj[this.name];
        if (typeof value !== "undefined") {
            return value;
        }
        if (typeof this.defaultFn === "function") {
            value = this.defaultFn.call(obj);
        }
        return value;
    };
    return Field;
}());
function shallowStringify(value) {
    if (Array.isArray(value)) {
        return "[" + value.map(shallowStringify).join(", ") + "]";
    }
    if (value && typeof value === "object") {
        return "{ " + Object.keys(value).map(function (key) {
            return key + ": " + value[key];
        }).join(", ") + " }";
    }
    return JSON.stringify(value);
}
function typesPlugin(_fork) {
    var Type = {
        or: function () {
            var types = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                types[_i] = arguments[_i];
            }
            return new OrType(types.map(function (type) { return Type.from(type); }));
        },
        from: function (value, name) {
            if (value instanceof ArrayType ||
                value instanceof IdentityType ||
                value instanceof ObjectType ||
                value instanceof OrType ||
                value instanceof PredicateType) {
                return value;
            }
            // The Def type is used as a helper for constructing compound
            // interface types for AST nodes.
            if (value instanceof Def) {
                return value.type;
            }
            // Support [ElemType] syntax.
            if (isArray.check(value)) {
                if (value.length !== 1) {
                    throw new Error("only one element type is permitted for typed arrays");
                }
                return new ArrayType(Type.from(value[0]));
            }
            // Support { someField: FieldType, ... } syntax.
            if (isObject.check(value)) {
                return new ObjectType(Object.keys(value).map(function (name) {
                    return new Field(name, Type.from(value[name], name));
                }));
            }
            if (typeof value === "function") {
                var bicfIndex = builtInCtorFns.indexOf(value);
                if (bicfIndex >= 0) {
                    return builtInCtorTypes[bicfIndex];
                }
                if (typeof name !== "string") {
                    throw new Error("missing name");
                }
                return new PredicateType(name, value);
            }
            // As a last resort, toType returns a type that matches any value that
            // is === from. This is primarily useful for literal values like
            // toType(null), but it has the additional advantage of allowing
            // toType to be a total function.
            return new IdentityType(value);
        },
        // Define a type whose name is registered in a namespace (the defCache) so
        // that future definitions will return the same type given the same name.
        // In particular, this system allows for circular and forward definitions.
        // The Def object d returned from Type.def may be used to configure the
        // type d.type by calling methods such as d.bases, d.build, and d.field.
        def: function (typeName) {
            return hasOwn.call(defCache, typeName)
                ? defCache[typeName]
                : defCache[typeName] = new DefImpl(typeName);
        },
        hasDef: function (typeName) {
            return hasOwn.call(defCache, typeName);
        }
    };
    var builtInCtorFns = [];
    var builtInCtorTypes = [];
    function defBuiltInType(name, example) {
        var objStr = objToStr.call(example);
        var type = new PredicateType(name, function (value) { return objToStr.call(value) === objStr; });
        if (example && typeof example.constructor === "function") {
            builtInCtorFns.push(example.constructor);
            builtInCtorTypes.push(type);
        }
        return type;
    }
    // These types check the underlying [[Class]] attribute of the given
    // value, rather than using the problematic typeof operator. Note however
    // that no subtyping is considered; so, for instance, isObject.check
    // returns false for [], /./, new Date, and null.
    var isString = defBuiltInType("string", "truthy");
    var isFunction = defBuiltInType("function", function () { });
    var isArray = defBuiltInType("array", []);
    var isObject = defBuiltInType("object", {});
    var isRegExp = defBuiltInType("RegExp", /./);
    var isDate = defBuiltInType("Date", new Date());
    var isNumber = defBuiltInType("number", 3);
    var isBoolean = defBuiltInType("boolean", true);
    var isNull = defBuiltInType("null", null);
    var isUndefined = defBuiltInType("undefined", undefined);
    var builtInTypes = {
        string: isString,
        function: isFunction,
        array: isArray,
        object: isObject,
        RegExp: isRegExp,
        Date: isDate,
        number: isNumber,
        boolean: isBoolean,
        null: isNull,
        undefined: isUndefined,
    };
    // In order to return the same Def instance every time Type.def is called
    // with a particular name, those instances need to be stored in a cache.
    var defCache = Object.create(null);
    function defFromValue(value) {
        if (value && typeof value === "object") {
            var type = value.type;
            if (typeof type === "string" &&
                hasOwn.call(defCache, type)) {
                var d = defCache[type];
                if (d.finalized) {
                    return d;
                }
            }
        }
        return null;
    }
    var DefImpl = /** @class */ (function (_super) {
        tslib_1.__extends(DefImpl, _super);
        function DefImpl(typeName) {
            var _this = _super.call(this, new PredicateType(typeName, function (value, deep) { return _this.check(value, deep); }), typeName) || this;
            return _this;
        }
        DefImpl.prototype.check = function (value, deep) {
            if (this.finalized !== true) {
                throw new Error("prematurely checking unfinalized type " + this.typeName);
            }
            // A Def type can only match an object value.
            if (value === null || typeof value !== "object") {
                return false;
            }
            var vDef = defFromValue(value);
            if (!vDef) {
                // If we couldn't infer the Def associated with the given value,
                // and we expected it to be a SourceLocation or a Position, it was
                // probably just missing a "type" field (because Esprima does not
                // assign a type property to such nodes). Be optimistic and let
                // this.checkAllFields make the final decision.
                if (this.typeName === "SourceLocation" ||
                    this.typeName === "Position") {
                    return this.checkAllFields(value, deep);
                }
                // Calling this.checkAllFields for any other type of node is both
                // bad for performance and way too forgiving.
                return false;
            }
            // If checking deeply and vDef === this, then we only need to call
            // checkAllFields once. Calling checkAllFields is too strict when deep
            // is false, because then we only care about this.isSupertypeOf(vDef).
            if (deep && vDef === this) {
                return this.checkAllFields(value, deep);
            }
            // In most cases we rely exclusively on isSupertypeOf to make O(1)
            // subtyping determinations. This suffices in most situations outside
            // of unit tests, since interface conformance is checked whenever new
            // instances are created using builder functions.
            if (!this.isSupertypeOf(vDef)) {
                return false;
            }
            // The exception is when deep is true; then, we recursively check all
            // fields.
            if (!deep) {
                return true;
            }
            // Use the more specific Def (vDef) to perform the deep check, but
            // shallow-check fields defined by the less specific Def (this).
            return vDef.checkAllFields(value, deep)
                && this.checkAllFields(value, false);
        };
        DefImpl.prototype.build = function () {
            var _this = this;
            var buildParams = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                buildParams[_i] = arguments[_i];
            }
            // Calling Def.prototype.build multiple times has the effect of merely
            // redefining this property.
            this.buildParams = buildParams;
            if (this.buildable) {
                // If this Def is already buildable, update self.buildParams and
                // continue using the old builder function.
                return this;
            }
            // Every buildable type will have its "type" field filled in
            // automatically. This includes types that are not subtypes of Node,
            // like SourceLocation, but that seems harmless (TODO?).
            this.field("type", String, function () { return _this.typeName; });
            // Override Dp.buildable for this Def instance.
            this.buildable = true;
            var addParam = function (built, param, arg, isArgAvailable) {
                if (hasOwn.call(built, param))
                    return;
                var all = _this.allFields;
                if (!hasOwn.call(all, param)) {
                    throw new Error("" + param);
                }
                var field = all[param];
                var type = field.type;
                var value;
                if (isArgAvailable) {
                    value = arg;
                }
                else if (field.defaultFn) {
                    // Expose the partially-built object to the default
                    // function as its `this` object.
                    value = field.defaultFn.call(built);
                }
                else {
                    var message = "no value or default function given for field " +
                        JSON.stringify(param) + " of " + _this.typeName + "(" +
                        _this.buildParams.map(function (name) {
                            return all[name];
                        }).join(", ") + ")";
                    throw new Error(message);
                }
                if (!type.check(value)) {
                    throw new Error(shallowStringify(value) +
                        " does not match field " + field +
                        " of type " + _this.typeName);
                }
                built[param] = value;
            };
            // Calling the builder function will construct an instance of the Def,
            // with positional arguments mapped to the fields original passed to .build.
            // If not enough arguments are provided, the default value for the remaining fields
            // will be used.
            var builder = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var argc = args.length;
                if (!_this.finalized) {
                    throw new Error("attempting to instantiate unfinalized type " +
                        _this.typeName);
                }
                var built = Object.create(nodePrototype);
                _this.buildParams.forEach(function (param, i) {
                    if (i < argc) {
                        addParam(built, param, args[i], true);
                    }
                    else {
                        addParam(built, param, null, false);
                    }
                });
                Object.keys(_this.allFields).forEach(function (param) {
                    // Use the default value.
                    addParam(built, param, null, false);
                });
                // Make sure that the "type" field was filled automatically.
                if (built.type !== _this.typeName) {
                    throw new Error("");
                }
                return built;
            };
            // Calling .from on the builder function will construct an instance of the Def,
            // using field values from the passed object. For fields missing from the passed object,
            // their default value will be used.
            builder.from = function (obj) {
                if (!_this.finalized) {
                    throw new Error("attempting to instantiate unfinalized type " +
                        _this.typeName);
                }
                var built = Object.create(nodePrototype);
                Object.keys(_this.allFields).forEach(function (param) {
                    if (hasOwn.call(obj, param)) {
                        addParam(built, param, obj[param], true);
                    }
                    else {
                        addParam(built, param, null, false);
                    }
                });
                // Make sure that the "type" field was filled automatically.
                if (built.type !== _this.typeName) {
                    throw new Error("");
                }
                return built;
            };
            Object.defineProperty(builders, getBuilderName(this.typeName), {
                enumerable: true,
                value: builder
            });
            return this;
        };
        // The reason fields are specified using .field(...) instead of an object
        // literal syntax is somewhat subtle: the object literal syntax would
        // support only one key and one value, but with .field(...) we can pass
        // any number of arguments to specify the field.
        DefImpl.prototype.field = function (name, type, defaultFn, hidden) {
            if (this.finalized) {
                console.error("Ignoring attempt to redefine field " +
                    JSON.stringify(name) + " of finalized type " +
                    JSON.stringify(this.typeName));
                return this;
            }
            this.ownFields[name] = new Field(name, Type.from(type), defaultFn, hidden);
            return this; // For chaining.
        };
        DefImpl.prototype.finalize = function () {
            var _this = this;
            // It's not an error to finalize a type more than once, but only the
            // first call to .finalize does anything.
            if (!this.finalized) {
                var allFields = this.allFields;
                var allSupertypes = this.allSupertypes;
                this.baseNames.forEach(function (name) {
                    var def = defCache[name];
                    if (def instanceof Def) {
                        def.finalize();
                        extend(allFields, def.allFields);
                        extend(allSupertypes, def.allSupertypes);
                    }
                    else {
                        var message = "unknown supertype name " +
                            JSON.stringify(name) +
                            " for subtype " +
                            JSON.stringify(_this.typeName);
                        throw new Error(message);
                    }
                });
                // TODO Warn if fields are overridden with incompatible types.
                extend(allFields, this.ownFields);
                allSupertypes[this.typeName] = this;
                this.fieldNames.length = 0;
                for (var fieldName in allFields) {
                    if (hasOwn.call(allFields, fieldName) &&
                        !allFields[fieldName].hidden) {
                        this.fieldNames.push(fieldName);
                    }
                }
                // Types are exported only once they have been finalized.
                Object.defineProperty(namedTypes, this.typeName, {
                    enumerable: true,
                    value: this.type
                });
                this.finalized = true;
                // A linearization of the inheritance hierarchy.
                populateSupertypeList(this.typeName, this.supertypeList);
                if (this.buildable &&
                    this.supertypeList.lastIndexOf("Expression") >= 0) {
                    wrapExpressionBuilderWithStatement(this.typeName);
                }
            }
        };
        return DefImpl;
    }(Def));
    // Note that the list returned by this function is a copy of the internal
    // supertypeList, *without* the typeName itself as the first element.
    function getSupertypeNames(typeName) {
        if (!hasOwn.call(defCache, typeName)) {
            throw new Error("");
        }
        var d = defCache[typeName];
        if (d.finalized !== true) {
            throw new Error("");
        }
        return d.supertypeList.slice(1);
    }
    // Returns an object mapping from every known type in the defCache to the
    // most specific supertype whose name is an own property of the candidates
    // object.
    function computeSupertypeLookupTable(candidates) {
        var table = {};
        var typeNames = Object.keys(defCache);
        var typeNameCount = typeNames.length;
        for (var i = 0; i < typeNameCount; ++i) {
            var typeName = typeNames[i];
            var d = defCache[typeName];
            if (d.finalized !== true) {
                throw new Error("" + typeName);
            }
            for (var j = 0; j < d.supertypeList.length; ++j) {
                var superTypeName = d.supertypeList[j];
                if (hasOwn.call(candidates, superTypeName)) {
                    table[typeName] = superTypeName;
                    break;
                }
            }
        }
        return table;
    }
    var builders = Object.create(null);
    // This object is used as prototype for any node created by a builder.
    var nodePrototype = {};
    // Call this function to define a new method to be shared by all AST
    // nodes. The replaced method (if any) is returned for easy wrapping.
    function defineMethod(name, func) {
        var old = nodePrototype[name];
        // Pass undefined as func to delete nodePrototype[name].
        if (isUndefined.check(func)) {
            delete nodePrototype[name];
        }
        else {
            isFunction.assert(func);
            Object.defineProperty(nodePrototype, name, {
                enumerable: true,
                configurable: true,
                value: func
            });
        }
        return old;
    }
    function getBuilderName(typeName) {
        return typeName.replace(/^[A-Z]+/, function (upperCasePrefix) {
            var len = upperCasePrefix.length;
            switch (len) {
                case 0: return "";
                // If there's only one initial capital letter, just lower-case it.
                case 1: return upperCasePrefix.toLowerCase();
                default:
                    // If there's more than one initial capital letter, lower-case
                    // all but the last one, so that XMLDefaultDeclaration (for
                    // example) becomes xmlDefaultDeclaration.
                    return upperCasePrefix.slice(0, len - 1).toLowerCase() +
                        upperCasePrefix.charAt(len - 1);
            }
        });
    }
    function getStatementBuilderName(typeName) {
        typeName = getBuilderName(typeName);
        return typeName.replace(/(Expression)?$/, "Statement");
    }
    var namedTypes = {};
    // Like Object.keys, but aware of what fields each AST type should have.
    function getFieldNames(object) {
        var d = defFromValue(object);
        if (d) {
            return d.fieldNames.slice(0);
        }
        if ("type" in object) {
            throw new Error("did not recognize object of type " +
                JSON.stringify(object.type));
        }
        return Object.keys(object);
    }
    // Get the value of an object property, taking object.type and default
    // functions into account.
    function getFieldValue(object, fieldName) {
        var d = defFromValue(object);
        if (d) {
            var field = d.allFields[fieldName];
            if (field) {
                return field.getValue(object);
            }
        }
        return object && object[fieldName];
    }
    // Iterate over all defined fields of an object, including those missing
    // or undefined, passing each field name and effective value (as returned
    // by getFieldValue) to the callback. If the object has no corresponding
    // Def, the callback will never be called.
    function eachField(object, callback, context) {
        getFieldNames(object).forEach(function (name) {
            callback.call(this, name, getFieldValue(object, name));
        }, context);
    }
    // Similar to eachField, except that iteration stops as soon as the
    // callback returns a truthy value. Like Array.prototype.some, the final
    // result is either true or false to indicates whether the callback
    // returned true for any element or not.
    function someField(object, callback, context) {
        return getFieldNames(object).some(function (name) {
            return callback.call(this, name, getFieldValue(object, name));
        }, context);
    }
    // Adds an additional builder for Expression subtypes
    // that wraps the built Expression in an ExpressionStatements.
    function wrapExpressionBuilderWithStatement(typeName) {
        var wrapperName = getStatementBuilderName(typeName);
        // skip if the builder already exists
        if (builders[wrapperName])
            return;
        // the builder function to wrap with builders.ExpressionStatement
        var wrapped = builders[getBuilderName(typeName)];
        // skip if there is nothing to wrap
        if (!wrapped)
            return;
        var builder = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return builders.expressionStatement(wrapped.apply(builders, args));
        };
        builder.from = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return builders.expressionStatement(wrapped.from.apply(builders, args));
        };
        builders[wrapperName] = builder;
    }
    function populateSupertypeList(typeName, list) {
        list.length = 0;
        list.push(typeName);
        var lastSeen = Object.create(null);
        for (var pos = 0; pos < list.length; ++pos) {
            typeName = list[pos];
            var d = defCache[typeName];
            if (d.finalized !== true) {
                throw new Error("");
            }
            // If we saw typeName earlier in the breadth-first traversal,
            // delete the last-seen occurrence.
            if (hasOwn.call(lastSeen, typeName)) {
                delete list[lastSeen[typeName]];
            }
            // Record the new index of the last-seen occurrence of typeName.
            lastSeen[typeName] = pos;
            // Enqueue the base names of this type.
            list.push.apply(list, d.baseNames);
        }
        // Compaction loop to remove array holes.
        for (var to = 0, from = to, len = list.length; from < len; ++from) {
            if (hasOwn.call(list, from)) {
                list[to++] = list[from];
            }
        }
        list.length = to;
    }
    function extend(into, from) {
        Object.keys(from).forEach(function (name) {
            into[name] = from[name];
        });
        return into;
    }
    function finalize() {
        Object.keys(defCache).forEach(function (name) {
            defCache[name].finalize();
        });
    }
    return {
        Type: Type,
        builtInTypes: builtInTypes,
        getSupertypeNames: getSupertypeNames,
        computeSupertypeLookupTable: computeSupertypeLookupTable,
        builders: builders,
        defineMethod: defineMethod,
        getBuilderName: getBuilderName,
        getStatementBuilderName: getStatementBuilderName,
        namedTypes: namedTypes,
        getFieldNames: getFieldNames,
        getFieldValue: getFieldValue,
        eachField: eachField,
        someField: someField,
        finalize: finalize,
    };
}
exports.default = typesPlugin;
;

},{"tslib":266}],168:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visit = exports.use = exports.Type = exports.someField = exports.PathVisitor = exports.Path = exports.NodePath = exports.namedTypes = exports.getSupertypeNames = exports.getFieldValue = exports.getFieldNames = exports.getBuilderName = exports.finalize = exports.eachField = exports.defineMethod = exports.builtInTypes = exports.builders = exports.astNodesAreEquivalent = void 0;
var tslib_1 = require("tslib");
var fork_1 = tslib_1.__importDefault(require("./fork"));
var core_1 = tslib_1.__importDefault(require("./def/core"));
var es6_1 = tslib_1.__importDefault(require("./def/es6"));
var es2016_1 = tslib_1.__importDefault(require("./def/es2016"));
var es2017_1 = tslib_1.__importDefault(require("./def/es2017"));
var es2018_1 = tslib_1.__importDefault(require("./def/es2018"));
var es2019_1 = tslib_1.__importDefault(require("./def/es2019"));
var es2020_1 = tslib_1.__importDefault(require("./def/es2020"));
var jsx_1 = tslib_1.__importDefault(require("./def/jsx"));
var flow_1 = tslib_1.__importDefault(require("./def/flow"));
var esprima_1 = tslib_1.__importDefault(require("./def/esprima"));
var babel_1 = tslib_1.__importDefault(require("./def/babel"));
var typescript_1 = tslib_1.__importDefault(require("./def/typescript"));
var es_proposals_1 = tslib_1.__importDefault(require("./def/es-proposals"));
var namedTypes_1 = require("./gen/namedTypes");
Object.defineProperty(exports, "namedTypes", { enumerable: true, get: function () { return namedTypes_1.namedTypes; } });
var _a = fork_1.default([
    // This core module of AST types captures ES5 as it is parsed today by
    // git://github.com/ariya/esprima.git#master.
    core_1.default,
    // Feel free to add to or remove from this list of extension modules to
    // configure the precise type hierarchy that you need.
    es6_1.default,
    es2016_1.default,
    es2017_1.default,
    es2018_1.default,
    es2019_1.default,
    es2020_1.default,
    jsx_1.default,
    flow_1.default,
    esprima_1.default,
    babel_1.default,
    typescript_1.default,
    es_proposals_1.default,
]), astNodesAreEquivalent = _a.astNodesAreEquivalent, builders = _a.builders, builtInTypes = _a.builtInTypes, defineMethod = _a.defineMethod, eachField = _a.eachField, finalize = _a.finalize, getBuilderName = _a.getBuilderName, getFieldNames = _a.getFieldNames, getFieldValue = _a.getFieldValue, getSupertypeNames = _a.getSupertypeNames, n = _a.namedTypes, NodePath = _a.NodePath, Path = _a.Path, PathVisitor = _a.PathVisitor, someField = _a.someField, Type = _a.Type, use = _a.use, visit = _a.visit;
exports.astNodesAreEquivalent = astNodesAreEquivalent;
exports.builders = builders;
exports.builtInTypes = builtInTypes;
exports.defineMethod = defineMethod;
exports.eachField = eachField;
exports.finalize = finalize;
exports.getBuilderName = getBuilderName;
exports.getFieldNames = getFieldNames;
exports.getFieldValue = getFieldValue;
exports.getSupertypeNames = getSupertypeNames;
exports.NodePath = NodePath;
exports.Path = Path;
exports.PathVisitor = PathVisitor;
exports.someField = someField;
exports.Type = Type;
exports.use = use;
exports.visit = visit;
// Populate the exported fields of the namedTypes namespace, while still
// retaining its member types.
Object.assign(namedTypes_1.namedTypes, n);

},{"./def/babel":144,"./def/core":146,"./def/es-proposals":147,"./def/es2016":148,"./def/es2017":149,"./def/es2018":150,"./def/es2019":151,"./def/es2020":152,"./def/es6":153,"./def/esprima":154,"./def/flow":155,"./def/jsx":156,"./def/typescript":158,"./fork":159,"./gen/namedTypes":160,"tslib":266}],169:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = generate;
exports.baseGenerator = exports.GENERATOR = exports.EXPRESSIONS_PRECEDENCE = exports.NEEDS_PARENTHESES = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var stringify = JSON.stringify;

if (!String.prototype.repeat) {
  throw new Error('String.prototype.repeat is undefined, see https://github.com/davidbonnet/astring#installation');
}

if (!String.prototype.endsWith) {
  throw new Error('String.prototype.endsWith is undefined, see https://github.com/davidbonnet/astring#installation');
}

var OPERATOR_PRECEDENCE = {
  '||': 2,
  '??': 3,
  '&&': 4,
  '|': 5,
  '^': 6,
  '&': 7,
  '==': 8,
  '!=': 8,
  '===': 8,
  '!==': 8,
  '<': 9,
  '>': 9,
  '<=': 9,
  '>=': 9,
  "in": 9,
  "instanceof": 9,
  '<<': 10,
  '>>': 10,
  '>>>': 10,
  '+': 11,
  '-': 11,
  '*': 12,
  '%': 12,
  '/': 12,
  '**': 13
};
var NEEDS_PARENTHESES = 17;
exports.NEEDS_PARENTHESES = NEEDS_PARENTHESES;
var EXPRESSIONS_PRECEDENCE = {
  ArrayExpression: 20,
  TaggedTemplateExpression: 20,
  ThisExpression: 20,
  Identifier: 20,
  PrivateIdentifier: 20,
  Literal: 18,
  TemplateLiteral: 20,
  Super: 20,
  SequenceExpression: 20,
  MemberExpression: 19,
  ChainExpression: 19,
  CallExpression: 19,
  NewExpression: 19,
  ArrowFunctionExpression: NEEDS_PARENTHESES,
  ClassExpression: NEEDS_PARENTHESES,
  FunctionExpression: NEEDS_PARENTHESES,
  ObjectExpression: NEEDS_PARENTHESES,
  UpdateExpression: 16,
  UnaryExpression: 15,
  AwaitExpression: 15,
  BinaryExpression: 14,
  LogicalExpression: 13,
  ConditionalExpression: 4,
  AssignmentExpression: 3,
  YieldExpression: 2,
  RestElement: 1
};
exports.EXPRESSIONS_PRECEDENCE = EXPRESSIONS_PRECEDENCE;

function formatSequence(state, nodes) {
  var generator = state.generator;
  state.write('(');

  if (nodes != null && nodes.length > 0) {
    generator[nodes[0].type](nodes[0], state);
    var length = nodes.length;

    for (var i = 1; i < length; i++) {
      var param = nodes[i];
      state.write(', ');
      generator[param.type](param, state);
    }
  }

  state.write(')');
}

function expressionNeedsParenthesis(state, node, parentNode, isRightHand) {
  var nodePrecedence = state.expressionsPrecedence[node.type];

  if (nodePrecedence === NEEDS_PARENTHESES) {
    return true;
  }

  var parentNodePrecedence = state.expressionsPrecedence[parentNode.type];

  if (nodePrecedence !== parentNodePrecedence) {
    return !isRightHand && nodePrecedence === 15 && parentNodePrecedence === 14 && parentNode.operator === '**' || nodePrecedence < parentNodePrecedence;
  }

  if (nodePrecedence !== 13 && nodePrecedence !== 14) {
    return false;
  }

  if (node.operator === '**' && parentNode.operator === '**') {
    return !isRightHand;
  }

  if (nodePrecedence === 13 && parentNodePrecedence === 13 && (node.operator === '??' || parentNode.operator === '??')) {
    return true;
  }

  if (isRightHand) {
    return OPERATOR_PRECEDENCE[node.operator] <= OPERATOR_PRECEDENCE[parentNode.operator];
  }

  return OPERATOR_PRECEDENCE[node.operator] < OPERATOR_PRECEDENCE[parentNode.operator];
}

function formatExpression(state, node, parentNode, isRightHand) {
  var generator = state.generator;

  if (expressionNeedsParenthesis(state, node, parentNode, isRightHand)) {
    state.write('(');
    generator[node.type](node, state);
    state.write(')');
  } else {
    generator[node.type](node, state);
  }
}

function reindent(state, text, indent, lineEnd) {
  var lines = text.split('\n');
  var end = lines.length - 1;
  state.write(lines[0].trim());

  if (end > 0) {
    state.write(lineEnd);

    for (var i = 1; i < end; i++) {
      state.write(indent + lines[i].trim() + lineEnd);
    }

    state.write(indent + lines[end].trim());
  }
}

function formatComments(state, comments, indent, lineEnd) {
  var length = comments.length;

  for (var i = 0; i < length; i++) {
    var comment = comments[i];
    state.write(indent);

    if (comment.type[0] === 'L') {
      state.write('// ' + comment.value.trim() + '\n', comment);
    } else {
      state.write('/*');
      reindent(state, comment.value, indent, lineEnd);
      state.write('*/' + lineEnd);
    }
  }
}

function hasCallExpression(node) {
  var currentNode = node;

  while (currentNode != null) {
    var _currentNode = currentNode,
        type = _currentNode.type;

    if (type[0] === 'C' && type[1] === 'a') {
      return true;
    } else if (type[0] === 'M' && type[1] === 'e' && type[2] === 'm') {
      currentNode = currentNode.object;
    } else {
      return false;
    }
  }
}

function formatVariableDeclaration(state, node) {
  var generator = state.generator;
  var declarations = node.declarations;
  state.write(node.kind + ' ');
  var length = declarations.length;

  if (length > 0) {
    generator.VariableDeclarator(declarations[0], state);

    for (var i = 1; i < length; i++) {
      state.write(', ');
      generator.VariableDeclarator(declarations[i], state);
    }
  }
}

var ForInStatement, FunctionDeclaration, RestElement, BinaryExpression, ArrayExpression, BlockStatement;
var GENERATOR = {
  Program: function Program(node, state) {
    var indent = state.indent.repeat(state.indentLevel);
    var lineEnd = state.lineEnd,
        writeComments = state.writeComments;

    if (writeComments && node.comments != null) {
      formatComments(state, node.comments, indent, lineEnd);
    }

    var statements = node.body;
    var length = statements.length;

    for (var i = 0; i < length; i++) {
      var statement = statements[i];

      if (writeComments && statement.comments != null) {
        formatComments(state, statement.comments, indent, lineEnd);
      }

      state.write(indent);
      this[statement.type](statement, state);
      state.write(lineEnd);
    }

    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, indent, lineEnd);
    }
  },
  BlockStatement: BlockStatement = function BlockStatement(node, state) {
    var indent = state.indent.repeat(state.indentLevel++);
    var lineEnd = state.lineEnd,
        writeComments = state.writeComments;
    var statementIndent = indent + state.indent;
    state.write('{');
    var statements = node.body;

    if (statements != null && statements.length > 0) {
      state.write(lineEnd);

      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, statementIndent, lineEnd);
      }

      var length = statements.length;

      for (var i = 0; i < length; i++) {
        var statement = statements[i];

        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd);
        }

        state.write(statementIndent);
        this[statement.type](statement, state);
        state.write(lineEnd);
      }

      state.write(indent);
    } else {
      if (writeComments && node.comments != null) {
        state.write(lineEnd);
        formatComments(state, node.comments, statementIndent, lineEnd);
        state.write(indent);
      }
    }

    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, statementIndent, lineEnd);
    }

    state.write('}');
    state.indentLevel--;
  },
  ClassBody: BlockStatement,
  StaticBlock: function StaticBlock(node, state) {
    state.write('static ');
    this.BlockStatement(node, state);
  },
  EmptyStatement: function EmptyStatement(node, state) {
    state.write(';');
  },
  ExpressionStatement: function ExpressionStatement(node, state) {
    var precedence = state.expressionsPrecedence[node.expression.type];

    if (precedence === NEEDS_PARENTHESES || precedence === 3 && node.expression.left.type[0] === 'O') {
      state.write('(');
      this[node.expression.type](node.expression, state);
      state.write(')');
    } else {
      this[node.expression.type](node.expression, state);
    }

    state.write(';');
  },
  IfStatement: function IfStatement(node, state) {
    state.write('if (');
    this[node.test.type](node.test, state);
    state.write(') ');
    this[node.consequent.type](node.consequent, state);

    if (node.alternate != null) {
      state.write(' else ');
      this[node.alternate.type](node.alternate, state);
    }
  },
  LabeledStatement: function LabeledStatement(node, state) {
    this[node.label.type](node.label, state);
    state.write(': ');
    this[node.body.type](node.body, state);
  },
  BreakStatement: function BreakStatement(node, state) {
    state.write('break');

    if (node.label != null) {
      state.write(' ');
      this[node.label.type](node.label, state);
    }

    state.write(';');
  },
  ContinueStatement: function ContinueStatement(node, state) {
    state.write('continue');

    if (node.label != null) {
      state.write(' ');
      this[node.label.type](node.label, state);
    }

    state.write(';');
  },
  WithStatement: function WithStatement(node, state) {
    state.write('with (');
    this[node.object.type](node.object, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  SwitchStatement: function SwitchStatement(node, state) {
    var indent = state.indent.repeat(state.indentLevel++);
    var lineEnd = state.lineEnd,
        writeComments = state.writeComments;
    state.indentLevel++;
    var caseIndent = indent + state.indent;
    var statementIndent = caseIndent + state.indent;
    state.write('switch (');
    this[node.discriminant.type](node.discriminant, state);
    state.write(') {' + lineEnd);
    var occurences = node.cases;
    var occurencesCount = occurences.length;

    for (var i = 0; i < occurencesCount; i++) {
      var occurence = occurences[i];

      if (writeComments && occurence.comments != null) {
        formatComments(state, occurence.comments, caseIndent, lineEnd);
      }

      if (occurence.test) {
        state.write(caseIndent + 'case ');
        this[occurence.test.type](occurence.test, state);
        state.write(':' + lineEnd);
      } else {
        state.write(caseIndent + 'default:' + lineEnd);
      }

      var consequent = occurence.consequent;
      var consequentCount = consequent.length;

      for (var _i = 0; _i < consequentCount; _i++) {
        var statement = consequent[_i];

        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd);
        }

        state.write(statementIndent);
        this[statement.type](statement, state);
        state.write(lineEnd);
      }
    }

    state.indentLevel -= 2;
    state.write(indent + '}');
  },
  ReturnStatement: function ReturnStatement(node, state) {
    state.write('return');

    if (node.argument) {
      state.write(' ');
      this[node.argument.type](node.argument, state);
    }

    state.write(';');
  },
  ThrowStatement: function ThrowStatement(node, state) {
    state.write('throw ');
    this[node.argument.type](node.argument, state);
    state.write(';');
  },
  TryStatement: function TryStatement(node, state) {
    state.write('try ');
    this[node.block.type](node.block, state);

    if (node.handler) {
      var handler = node.handler;

      if (handler.param == null) {
        state.write(' catch ');
      } else {
        state.write(' catch (');
        this[handler.param.type](handler.param, state);
        state.write(') ');
      }

      this[handler.body.type](handler.body, state);
    }

    if (node.finalizer) {
      state.write(' finally ');
      this[node.finalizer.type](node.finalizer, state);
    }
  },
  WhileStatement: function WhileStatement(node, state) {
    state.write('while (');
    this[node.test.type](node.test, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  DoWhileStatement: function DoWhileStatement(node, state) {
    state.write('do ');
    this[node.body.type](node.body, state);
    state.write(' while (');
    this[node.test.type](node.test, state);
    state.write(');');
  },
  ForStatement: function ForStatement(node, state) {
    state.write('for (');

    if (node.init != null) {
      var init = node.init;

      if (init.type[0] === 'V') {
        formatVariableDeclaration(state, init);
      } else {
        this[init.type](init, state);
      }
    }

    state.write('; ');

    if (node.test) {
      this[node.test.type](node.test, state);
    }

    state.write('; ');

    if (node.update) {
      this[node.update.type](node.update, state);
    }

    state.write(') ');
    this[node.body.type](node.body, state);
  },
  ForInStatement: ForInStatement = function ForInStatement(node, state) {
    state.write("for ".concat(node["await"] ? 'await ' : '', "("));
    var left = node.left;

    if (left.type[0] === 'V') {
      formatVariableDeclaration(state, left);
    } else {
      this[left.type](left, state);
    }

    state.write(node.type[3] === 'I' ? ' in ' : ' of ');
    this[node.right.type](node.right, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  ForOfStatement: ForInStatement,
  DebuggerStatement: function DebuggerStatement(node, state) {
    state.write('debugger;', node);
  },
  FunctionDeclaration: FunctionDeclaration = function FunctionDeclaration(node, state) {
    state.write((node.async ? 'async ' : '') + (node.generator ? 'function* ' : 'function ') + (node.id ? node.id.name : ''), node);
    formatSequence(state, node.params);
    state.write(' ');
    this[node.body.type](node.body, state);
  },
  FunctionExpression: FunctionDeclaration,
  VariableDeclaration: function VariableDeclaration(node, state) {
    formatVariableDeclaration(state, node);
    state.write(';');
  },
  VariableDeclarator: function VariableDeclarator(node, state) {
    this[node.id.type](node.id, state);

    if (node.init != null) {
      state.write(' = ');
      this[node.init.type](node.init, state);
    }
  },
  ClassDeclaration: function ClassDeclaration(node, state) {
    state.write('class ' + (node.id ? "".concat(node.id.name, " ") : ''), node);

    if (node.superClass) {
      state.write('extends ');
      var superClass = node.superClass;
      var type = superClass.type;
      var precedence = state.expressionsPrecedence[type];

      if ((type[0] !== 'C' || type[1] !== 'l' || type[5] !== 'E') && (precedence === NEEDS_PARENTHESES || precedence < state.expressionsPrecedence.ClassExpression)) {
        state.write('(');
        this[node.superClass.type](superClass, state);
        state.write(')');
      } else {
        this[superClass.type](superClass, state);
      }

      state.write(' ');
    }

    this.ClassBody(node.body, state);
  },
  ImportDeclaration: function ImportDeclaration(node, state) {
    state.write('import ');
    var specifiers = node.specifiers;
    var length = specifiers.length;
    var i = 0;

    if (length > 0) {
      for (; i < length;) {
        if (i > 0) {
          state.write(', ');
        }

        var specifier = specifiers[i];
        var type = specifier.type[6];

        if (type === 'D') {
          state.write(specifier.local.name, specifier);
          i++;
        } else if (type === 'N') {
          state.write('* as ' + specifier.local.name, specifier);
          i++;
        } else {
          break;
        }
      }

      if (i < length) {
        state.write('{');

        for (;;) {
          var _specifier = specifiers[i];
          var name = _specifier.imported.name;
          state.write(name, _specifier);

          if (name !== _specifier.local.name) {
            state.write(' as ' + _specifier.local.name);
          }

          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }

        state.write('}');
      }

      state.write(' from ');
    }

    this.Literal(node.source, state);
    state.write(';');
  },
  ImportExpression: function ImportExpression(node, state) {
    state.write('import(');
    this[node.source.type](node.source, state);
    state.write(')');
  },
  ExportDefaultDeclaration: function ExportDefaultDeclaration(node, state) {
    state.write('export default ');
    this[node.declaration.type](node.declaration, state);

    if (state.expressionsPrecedence[node.declaration.type] != null && node.declaration.type[0] !== 'F') {
      state.write(';');
    }
  },
  ExportNamedDeclaration: function ExportNamedDeclaration(node, state) {
    state.write('export ');

    if (node.declaration) {
      this[node.declaration.type](node.declaration, state);
    } else {
      state.write('{');
      var specifiers = node.specifiers,
          length = specifiers.length;

      if (length > 0) {
        for (var i = 0;;) {
          var specifier = specifiers[i];
          var name = specifier.local.name;
          state.write(name, specifier);

          if (name !== specifier.exported.name) {
            state.write(' as ' + specifier.exported.name);
          }

          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }
      }

      state.write('}');

      if (node.source) {
        state.write(' from ');
        this.Literal(node.source, state);
      }

      state.write(';');
    }
  },
  ExportAllDeclaration: function ExportAllDeclaration(node, state) {
    if (node.exported != null) {
      state.write('export * as ' + node.exported.name + ' from ');
    } else {
      state.write('export * from ');
    }

    this.Literal(node.source, state);
    state.write(';');
  },
  MethodDefinition: function MethodDefinition(node, state) {
    if (node["static"]) {
      state.write('static ');
    }

    var kind = node.kind[0];

    if (kind === 'g' || kind === 's') {
      state.write(node.kind + ' ');
    }

    if (node.value.async) {
      state.write('async ');
    }

    if (node.value.generator) {
      state.write('*');
    }

    if (node.computed) {
      state.write('[');
      this[node.key.type](node.key, state);
      state.write(']');
    } else {
      this[node.key.type](node.key, state);
    }

    formatSequence(state, node.value.params);
    state.write(' ');
    this[node.value.body.type](node.value.body, state);
  },
  ClassExpression: function ClassExpression(node, state) {
    this.ClassDeclaration(node, state);
  },
  ArrowFunctionExpression: function ArrowFunctionExpression(node, state) {
    state.write(node.async ? 'async ' : '', node);
    var params = node.params;

    if (params != null) {
      if (params.length === 1 && params[0].type[0] === 'I') {
        state.write(params[0].name, params[0]);
      } else {
        formatSequence(state, node.params);
      }
    }

    state.write(' => ');

    if (node.body.type[0] === 'O') {
      state.write('(');
      this.ObjectExpression(node.body, state);
      state.write(')');
    } else {
      this[node.body.type](node.body, state);
    }
  },
  ThisExpression: function ThisExpression(node, state) {
    state.write('this', node);
  },
  Super: function Super(node, state) {
    state.write('super', node);
  },
  RestElement: RestElement = function RestElement(node, state) {
    state.write('...');
    this[node.argument.type](node.argument, state);
  },
  SpreadElement: RestElement,
  YieldExpression: function YieldExpression(node, state) {
    state.write(node.delegate ? 'yield*' : 'yield');

    if (node.argument) {
      state.write(' ');
      this[node.argument.type](node.argument, state);
    }
  },
  AwaitExpression: function AwaitExpression(node, state) {
    state.write('await ', node);
    formatExpression(state, node.argument, node);
  },
  TemplateLiteral: function TemplateLiteral(node, state) {
    var quasis = node.quasis,
        expressions = node.expressions;
    state.write('`');
    var length = expressions.length;

    for (var i = 0; i < length; i++) {
      var expression = expressions[i];
      var _quasi = quasis[i];
      state.write(_quasi.value.raw, _quasi);
      state.write('${');
      this[expression.type](expression, state);
      state.write('}');
    }

    var quasi = quasis[quasis.length - 1];
    state.write(quasi.value.raw, quasi);
    state.write('`');
  },
  TemplateElement: function TemplateElement(node, state) {
    state.write(node.value.raw, node);
  },
  TaggedTemplateExpression: function TaggedTemplateExpression(node, state) {
    formatExpression(state, node.tag, node);
    this[node.quasi.type](node.quasi, state);
  },
  ArrayExpression: ArrayExpression = function ArrayExpression(node, state) {
    state.write('[');

    if (node.elements.length > 0) {
      var elements = node.elements,
          length = elements.length;

      for (var i = 0;;) {
        var element = elements[i];

        if (element != null) {
          this[element.type](element, state);
        }

        if (++i < length) {
          state.write(', ');
        } else {
          if (element == null) {
            state.write(', ');
          }

          break;
        }
      }
    }

    state.write(']');
  },
  ArrayPattern: ArrayExpression,
  ObjectExpression: function ObjectExpression(node, state) {
    var indent = state.indent.repeat(state.indentLevel++);
    var lineEnd = state.lineEnd,
        writeComments = state.writeComments;
    var propertyIndent = indent + state.indent;
    state.write('{');

    if (node.properties.length > 0) {
      state.write(lineEnd);

      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, propertyIndent, lineEnd);
      }

      var comma = ',' + lineEnd;
      var properties = node.properties,
          length = properties.length;

      for (var i = 0;;) {
        var property = properties[i];

        if (writeComments && property.comments != null) {
          formatComments(state, property.comments, propertyIndent, lineEnd);
        }

        state.write(propertyIndent);
        this[property.type](property, state);

        if (++i < length) {
          state.write(comma);
        } else {
          break;
        }
      }

      state.write(lineEnd);

      if (writeComments && node.trailingComments != null) {
        formatComments(state, node.trailingComments, propertyIndent, lineEnd);
      }

      state.write(indent + '}');
    } else if (writeComments) {
      if (node.comments != null) {
        state.write(lineEnd);
        formatComments(state, node.comments, propertyIndent, lineEnd);

        if (node.trailingComments != null) {
          formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        }

        state.write(indent + '}');
      } else if (node.trailingComments != null) {
        state.write(lineEnd);
        formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        state.write(indent + '}');
      } else {
        state.write('}');
      }
    } else {
      state.write('}');
    }

    state.indentLevel--;
  },
  Property: function Property(node, state) {
    if (node.method || node.kind[0] !== 'i') {
      this.MethodDefinition(node, state);
    } else {
      if (!node.shorthand) {
        if (node.computed) {
          state.write('[');
          this[node.key.type](node.key, state);
          state.write(']');
        } else {
          this[node.key.type](node.key, state);
        }

        state.write(': ');
      }

      this[node.value.type](node.value, state);
    }
  },
  PropertyDefinition: function PropertyDefinition(node, state) {
    if (node["static"]) {
      state.write('static ');
    }

    if (node.computed) {
      state.write('[');
    }

    this[node.key.type](node.key, state);

    if (node.computed) {
      state.write(']');
    }

    if (node.value == null) {
      if (node.key.type[0] !== 'F') {
        state.write(';');
      }

      return;
    }

    state.write(' = ');
    this[node.value.type](node.value, state);
    state.write(';');
  },
  ObjectPattern: function ObjectPattern(node, state) {
    state.write('{');

    if (node.properties.length > 0) {
      var properties = node.properties,
          length = properties.length;

      for (var i = 0;;) {
        this[properties[i].type](properties[i], state);

        if (++i < length) {
          state.write(', ');
        } else {
          break;
        }
      }
    }

    state.write('}');
  },
  SequenceExpression: function SequenceExpression(node, state) {
    formatSequence(state, node.expressions);
  },
  UnaryExpression: function UnaryExpression(node, state) {
    if (node.prefix) {
      var operator = node.operator,
          argument = node.argument,
          type = node.argument.type;
      state.write(operator);
      var needsParentheses = expressionNeedsParenthesis(state, argument, node);

      if (!needsParentheses && (operator.length > 1 || type[0] === 'U' && (type[1] === 'n' || type[1] === 'p') && argument.prefix && argument.operator[0] === operator && (operator === '+' || operator === '-'))) {
        state.write(' ');
      }

      if (needsParentheses) {
        state.write(operator.length > 1 ? ' (' : '(');
        this[type](argument, state);
        state.write(')');
      } else {
        this[type](argument, state);
      }
    } else {
      this[node.argument.type](node.argument, state);
      state.write(node.operator);
    }
  },
  UpdateExpression: function UpdateExpression(node, state) {
    if (node.prefix) {
      state.write(node.operator);
      this[node.argument.type](node.argument, state);
    } else {
      this[node.argument.type](node.argument, state);
      state.write(node.operator);
    }
  },
  AssignmentExpression: function AssignmentExpression(node, state) {
    this[node.left.type](node.left, state);
    state.write(' ' + node.operator + ' ');
    this[node.right.type](node.right, state);
  },
  AssignmentPattern: function AssignmentPattern(node, state) {
    this[node.left.type](node.left, state);
    state.write(' = ');
    this[node.right.type](node.right, state);
  },
  BinaryExpression: BinaryExpression = function BinaryExpression(node, state) {
    var isIn = node.operator === 'in';

    if (isIn) {
      state.write('(');
    }

    formatExpression(state, node.left, node, false);
    state.write(' ' + node.operator + ' ');
    formatExpression(state, node.right, node, true);

    if (isIn) {
      state.write(')');
    }
  },
  LogicalExpression: BinaryExpression,
  ConditionalExpression: function ConditionalExpression(node, state) {
    var test = node.test;
    var precedence = state.expressionsPrecedence[test.type];

    if (precedence === NEEDS_PARENTHESES || precedence <= state.expressionsPrecedence.ConditionalExpression) {
      state.write('(');
      this[test.type](test, state);
      state.write(')');
    } else {
      this[test.type](test, state);
    }

    state.write(' ? ');
    this[node.consequent.type](node.consequent, state);
    state.write(' : ');
    this[node.alternate.type](node.alternate, state);
  },
  NewExpression: function NewExpression(node, state) {
    state.write('new ');
    var precedence = state.expressionsPrecedence[node.callee.type];

    if (precedence === NEEDS_PARENTHESES || precedence < state.expressionsPrecedence.CallExpression || hasCallExpression(node.callee)) {
      state.write('(');
      this[node.callee.type](node.callee, state);
      state.write(')');
    } else {
      this[node.callee.type](node.callee, state);
    }

    formatSequence(state, node['arguments']);
  },
  CallExpression: function CallExpression(node, state) {
    var precedence = state.expressionsPrecedence[node.callee.type];

    if (precedence === NEEDS_PARENTHESES || precedence < state.expressionsPrecedence.CallExpression) {
      state.write('(');
      this[node.callee.type](node.callee, state);
      state.write(')');
    } else {
      this[node.callee.type](node.callee, state);
    }

    if (node.optional) {
      state.write('?.');
    }

    formatSequence(state, node['arguments']);
  },
  ChainExpression: function ChainExpression(node, state) {
    this[node.expression.type](node.expression, state);
  },
  MemberExpression: function MemberExpression(node, state) {
    var precedence = state.expressionsPrecedence[node.object.type];

    if (precedence === NEEDS_PARENTHESES || precedence < state.expressionsPrecedence.MemberExpression) {
      state.write('(');
      this[node.object.type](node.object, state);
      state.write(')');
    } else {
      this[node.object.type](node.object, state);
    }

    if (node.computed) {
      if (node.optional) {
        state.write('?.');
      }

      state.write('[');
      this[node.property.type](node.property, state);
      state.write(']');
    } else {
      if (node.optional) {
        state.write('?.');
      } else {
        state.write('.');
      }

      this[node.property.type](node.property, state);
    }
  },
  MetaProperty: function MetaProperty(node, state) {
    state.write(node.meta.name + '.' + node.property.name, node);
  },
  Identifier: function Identifier(node, state) {
    state.write(node.name, node);
  },
  PrivateIdentifier: function PrivateIdentifier(node, state) {
    state.write("#".concat(node.name), node);
  },
  Literal: function Literal(node, state) {
    if (node.raw != null) {
      state.write(node.raw, node);
    } else if (node.regex != null) {
      this.RegExpLiteral(node, state);
    } else if (node.bigint != null) {
      state.write(node.bigint + 'n', node);
    } else {
      state.write(stringify(node.value), node);
    }
  },
  RegExpLiteral: function RegExpLiteral(node, state) {
    var regex = node.regex;
    state.write("/".concat(regex.pattern, "/").concat(regex.flags), node);
  }
};
exports.GENERATOR = GENERATOR;
var EMPTY_OBJECT = {};
var baseGenerator = GENERATOR;
exports.baseGenerator = baseGenerator;

var State = function () {
  function State(options) {
    _classCallCheck(this, State);

    var setup = options == null ? EMPTY_OBJECT : options;
    this.output = '';

    if (setup.output != null) {
      this.output = setup.output;
      this.write = this.writeToStream;
    } else {
      this.output = '';
    }

    this.generator = setup.generator != null ? setup.generator : GENERATOR;
    this.expressionsPrecedence = setup.expressionsPrecedence != null ? setup.expressionsPrecedence : EXPRESSIONS_PRECEDENCE;
    this.indent = setup.indent != null ? setup.indent : '  ';
    this.lineEnd = setup.lineEnd != null ? setup.lineEnd : '\n';
    this.indentLevel = setup.startingIndentLevel != null ? setup.startingIndentLevel : 0;
    this.writeComments = setup.comments ? setup.comments : false;

    if (setup.sourceMap != null) {
      this.write = setup.output == null ? this.writeAndMap : this.writeToStreamAndMap;
      this.sourceMap = setup.sourceMap;
      this.line = 1;
      this.column = 0;
      this.lineEndSize = this.lineEnd.split('\n').length - 1;
      this.mapping = {
        original: null,
        generated: this,
        name: undefined,
        source: setup.sourceMap.file || setup.sourceMap._file
      };
    }
  }

  _createClass(State, [{
    key: "write",
    value: function write(code) {
      this.output += code;
    }
  }, {
    key: "writeToStream",
    value: function writeToStream(code) {
      this.output.write(code);
    }
  }, {
    key: "writeAndMap",
    value: function writeAndMap(code, node) {
      this.output += code;
      this.map(code, node);
    }
  }, {
    key: "writeToStreamAndMap",
    value: function writeToStreamAndMap(code, node) {
      this.output.write(code);
      this.map(code, node);
    }
  }, {
    key: "map",
    value: function map(code, node) {
      if (node != null) {
        var type = node.type;

        if (type[0] === 'L' && type[2] === 'n') {
          this.column = 0;
          this.line++;
          return;
        }

        if (node.loc != null) {
          var mapping = this.mapping;
          mapping.original = node.loc.start;
          mapping.name = node.name;
          this.sourceMap.addMapping(mapping);
        }

        if (type[0] === 'T' && type[8] === 'E' || type[0] === 'L' && type[1] === 'i' && typeof node.value === 'string') {
          var _length = code.length;
          var column = this.column,
              line = this.line;

          for (var i = 0; i < _length; i++) {
            if (code[i] === '\n') {
              column = 0;
              line++;
            } else {
              column++;
            }
          }

          this.column = column;
          this.line = line;
          return;
        }
      }

      var length = code.length;
      var lineEnd = this.lineEnd;

      if (length > 0) {
        if (this.lineEndSize > 0 && (lineEnd.length === 1 ? code[length - 1] === lineEnd : code.endsWith(lineEnd))) {
          this.line += this.lineEndSize;
          this.column = 0;
        } else {
          this.column += length;
        }
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.output;
    }
  }]);

  return State;
}();

function generate(node, options) {
  var state = new State(options);
  state.generator[node.type](node, state);
  return state.output;
}


},{}],170:[function(require,module,exports){
(function (global){(function (){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).esquery=t()}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a,i,s=[],u=!0,l=!1;try{if(a=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=a.call(r)).done)&&(s.push(n.value),s.length!==t);u=!0);}catch(e){l=!0,o=e}finally{try{if(!u&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(l)throw o}}return s}}(e,t)||n(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||n(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,t){if(e){if("string"==typeof e)return o(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(e,t):void 0}}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function a(e,t){return e(t={exports:{}},t.exports),t.exports}var i=a((function(e,t){!function e(t){var r,n,o,a,i,s;function u(e){var t,r,n={};for(t in e)e.hasOwnProperty(t)&&(r=e[t],n[t]="object"==typeof r&&null!==r?u(r):r);return n}function l(e,t){this.parent=e,this.key=t}function c(e,t,r,n){this.node=e,this.path=t,this.wrap=r,this.ref=n}function f(){}function p(e){return null!=e&&("object"==typeof e&&"string"==typeof e.type)}function h(e,t){return(e===r.ObjectExpression||e===r.ObjectPattern)&&"properties"===t}function y(e,t){for(var r=e.length-1;r>=0;--r)if(e[r].node===t)return!0;return!1}function d(e,t){return(new f).traverse(e,t)}function m(e,t){var r;return r=function(e,t){var r,n,o,a;for(n=e.length,o=0;n;)t(e[a=o+(r=n>>>1)])?n=r:(o=a+1,n-=r+1);return o}(t,(function(t){return t.range[0]>e.range[0]})),e.extendedRange=[e.range[0],e.range[1]],r!==t.length&&(e.extendedRange[1]=t[r].range[0]),(r-=1)>=0&&(e.extendedRange[0]=t[r].range[1]),e}return r={AssignmentExpression:"AssignmentExpression",AssignmentPattern:"AssignmentPattern",ArrayExpression:"ArrayExpression",ArrayPattern:"ArrayPattern",ArrowFunctionExpression:"ArrowFunctionExpression",AwaitExpression:"AwaitExpression",BlockStatement:"BlockStatement",BinaryExpression:"BinaryExpression",BreakStatement:"BreakStatement",CallExpression:"CallExpression",CatchClause:"CatchClause",ChainExpression:"ChainExpression",ClassBody:"ClassBody",ClassDeclaration:"ClassDeclaration",ClassExpression:"ClassExpression",ComprehensionBlock:"ComprehensionBlock",ComprehensionExpression:"ComprehensionExpression",ConditionalExpression:"ConditionalExpression",ContinueStatement:"ContinueStatement",DebuggerStatement:"DebuggerStatement",DirectiveStatement:"DirectiveStatement",DoWhileStatement:"DoWhileStatement",EmptyStatement:"EmptyStatement",ExportAllDeclaration:"ExportAllDeclaration",ExportDefaultDeclaration:"ExportDefaultDeclaration",ExportNamedDeclaration:"ExportNamedDeclaration",ExportSpecifier:"ExportSpecifier",ExpressionStatement:"ExpressionStatement",ForStatement:"ForStatement",ForInStatement:"ForInStatement",ForOfStatement:"ForOfStatement",FunctionDeclaration:"FunctionDeclaration",FunctionExpression:"FunctionExpression",GeneratorExpression:"GeneratorExpression",Identifier:"Identifier",IfStatement:"IfStatement",ImportExpression:"ImportExpression",ImportDeclaration:"ImportDeclaration",ImportDefaultSpecifier:"ImportDefaultSpecifier",ImportNamespaceSpecifier:"ImportNamespaceSpecifier",ImportSpecifier:"ImportSpecifier",Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression:"LogicalExpression",MemberExpression:"MemberExpression",MetaProperty:"MetaProperty",MethodDefinition:"MethodDefinition",ModuleSpecifier:"ModuleSpecifier",NewExpression:"NewExpression",ObjectExpression:"ObjectExpression",ObjectPattern:"ObjectPattern",PrivateIdentifier:"PrivateIdentifier",Program:"Program",Property:"Property",PropertyDefinition:"PropertyDefinition",RestElement:"RestElement",ReturnStatement:"ReturnStatement",SequenceExpression:"SequenceExpression",SpreadElement:"SpreadElement",Super:"Super",SwitchStatement:"SwitchStatement",SwitchCase:"SwitchCase",TaggedTemplateExpression:"TaggedTemplateExpression",TemplateElement:"TemplateElement",TemplateLiteral:"TemplateLiteral",ThisExpression:"ThisExpression",ThrowStatement:"ThrowStatement",TryStatement:"TryStatement",UnaryExpression:"UnaryExpression",UpdateExpression:"UpdateExpression",VariableDeclaration:"VariableDeclaration",VariableDeclarator:"VariableDeclarator",WhileStatement:"WhileStatement",WithStatement:"WithStatement",YieldExpression:"YieldExpression"},o={AssignmentExpression:["left","right"],AssignmentPattern:["left","right"],ArrayExpression:["elements"],ArrayPattern:["elements"],ArrowFunctionExpression:["params","body"],AwaitExpression:["argument"],BlockStatement:["body"],BinaryExpression:["left","right"],BreakStatement:["label"],CallExpression:["callee","arguments"],CatchClause:["param","body"],ChainExpression:["expression"],ClassBody:["body"],ClassDeclaration:["id","superClass","body"],ClassExpression:["id","superClass","body"],ComprehensionBlock:["left","right"],ComprehensionExpression:["blocks","filter","body"],ConditionalExpression:["test","consequent","alternate"],ContinueStatement:["label"],DebuggerStatement:[],DirectiveStatement:[],DoWhileStatement:["body","test"],EmptyStatement:[],ExportAllDeclaration:["source"],ExportDefaultDeclaration:["declaration"],ExportNamedDeclaration:["declaration","specifiers","source"],ExportSpecifier:["exported","local"],ExpressionStatement:["expression"],ForStatement:["init","test","update","body"],ForInStatement:["left","right","body"],ForOfStatement:["left","right","body"],FunctionDeclaration:["id","params","body"],FunctionExpression:["id","params","body"],GeneratorExpression:["blocks","filter","body"],Identifier:[],IfStatement:["test","consequent","alternate"],ImportExpression:["source"],ImportDeclaration:["specifiers","source"],ImportDefaultSpecifier:["local"],ImportNamespaceSpecifier:["local"],ImportSpecifier:["imported","local"],Literal:[],LabeledStatement:["label","body"],LogicalExpression:["left","right"],MemberExpression:["object","property"],MetaProperty:["meta","property"],MethodDefinition:["key","value"],ModuleSpecifier:[],NewExpression:["callee","arguments"],ObjectExpression:["properties"],ObjectPattern:["properties"],PrivateIdentifier:[],Program:["body"],Property:["key","value"],PropertyDefinition:["key","value"],RestElement:["argument"],ReturnStatement:["argument"],SequenceExpression:["expressions"],SpreadElement:["argument"],Super:[],SwitchStatement:["discriminant","cases"],SwitchCase:["test","consequent"],TaggedTemplateExpression:["tag","quasi"],TemplateElement:[],TemplateLiteral:["quasis","expressions"],ThisExpression:[],ThrowStatement:["argument"],TryStatement:["block","handler","finalizer"],UnaryExpression:["argument"],UpdateExpression:["argument"],VariableDeclaration:["declarations"],VariableDeclarator:["id","init"],WhileStatement:["test","body"],WithStatement:["object","body"],YieldExpression:["argument"]},n={Break:a={},Skip:i={},Remove:s={}},l.prototype.replace=function(e){this.parent[this.key]=e},l.prototype.remove=function(){return Array.isArray(this.parent)?(this.parent.splice(this.key,1),!0):(this.replace(null),!1)},f.prototype.path=function(){var e,t,r,n,o;function a(e,t){if(Array.isArray(t))for(r=0,n=t.length;r<n;++r)e.push(t[r]);else e.push(t)}if(!this.__current.path)return null;for(o=[],e=2,t=this.__leavelist.length;e<t;++e)a(o,this.__leavelist[e].path);return a(o,this.__current.path),o},f.prototype.type=function(){return this.current().type||this.__current.wrap},f.prototype.parents=function(){var e,t,r;for(r=[],e=1,t=this.__leavelist.length;e<t;++e)r.push(this.__leavelist[e].node);return r},f.prototype.current=function(){return this.__current.node},f.prototype.__execute=function(e,t){var r,n;return n=void 0,r=this.__current,this.__current=t,this.__state=null,e&&(n=e.call(this,t.node,this.__leavelist[this.__leavelist.length-1].node)),this.__current=r,n},f.prototype.notify=function(e){this.__state=e},f.prototype.skip=function(){this.notify(i)},f.prototype.break=function(){this.notify(a)},f.prototype.remove=function(){this.notify(s)},f.prototype.__initialize=function(e,t){this.visitor=t,this.root=e,this.__worklist=[],this.__leavelist=[],this.__current=null,this.__state=null,this.__fallback=null,"iteration"===t.fallback?this.__fallback=Object.keys:"function"==typeof t.fallback&&(this.__fallback=t.fallback),this.__keys=o,t.keys&&(this.__keys=Object.assign(Object.create(this.__keys),t.keys))},f.prototype.traverse=function(e,t){var r,n,o,s,u,l,f,d,m,x,v,g;for(this.__initialize(e,t),g={},r=this.__worklist,n=this.__leavelist,r.push(new c(e,null,null,null)),n.push(new c(null,null,null,null));r.length;)if((o=r.pop())!==g){if(o.node){if(l=this.__execute(t.enter,o),this.__state===a||l===a)return;if(r.push(g),n.push(o),this.__state===i||l===i)continue;if(u=(s=o.node).type||o.wrap,!(x=this.__keys[u])){if(!this.__fallback)throw new Error("Unknown node type "+u+".");x=this.__fallback(s)}for(d=x.length;(d-=1)>=0;)if(v=s[f=x[d]])if(Array.isArray(v)){for(m=v.length;(m-=1)>=0;)if(v[m]&&!y(n,v[m])){if(h(u,x[d]))o=new c(v[m],[f,m],"Property",null);else{if(!p(v[m]))continue;o=new c(v[m],[f,m],null,null)}r.push(o)}}else if(p(v)){if(y(n,v))continue;r.push(new c(v,f,null,null))}}}else if(o=n.pop(),l=this.__execute(t.leave,o),this.__state===a||l===a)return},f.prototype.replace=function(e,t){var r,n,o,u,f,y,d,m,x,v,g,A,E;function b(e){var t,n,o,a;if(e.ref.remove())for(n=e.ref.key,a=e.ref.parent,t=r.length;t--;)if((o=r[t]).ref&&o.ref.parent===a){if(o.ref.key<n)break;--o.ref.key}}for(this.__initialize(e,t),g={},r=this.__worklist,n=this.__leavelist,y=new c(e,null,null,new l(A={root:e},"root")),r.push(y),n.push(y);r.length;)if((y=r.pop())!==g){if(void 0!==(f=this.__execute(t.enter,y))&&f!==a&&f!==i&&f!==s&&(y.ref.replace(f),y.node=f),this.__state!==s&&f!==s||(b(y),y.node=null),this.__state===a||f===a)return A.root;if((o=y.node)&&(r.push(g),n.push(y),this.__state!==i&&f!==i)){if(u=o.type||y.wrap,!(x=this.__keys[u])){if(!this.__fallback)throw new Error("Unknown node type "+u+".");x=this.__fallback(o)}for(d=x.length;(d-=1)>=0;)if(v=o[E=x[d]])if(Array.isArray(v)){for(m=v.length;(m-=1)>=0;)if(v[m]){if(h(u,x[d]))y=new c(v[m],[E,m],"Property",new l(v,m));else{if(!p(v[m]))continue;y=new c(v[m],[E,m],null,new l(v,m))}r.push(y)}}else p(v)&&r.push(new c(v,E,null,new l(o,E)))}}else if(y=n.pop(),void 0!==(f=this.__execute(t.leave,y))&&f!==a&&f!==i&&f!==s&&y.ref.replace(f),this.__state!==s&&f!==s||b(y),this.__state===a||f===a)return A.root;return A.root},t.Syntax=r,t.traverse=d,t.replace=function(e,t){return(new f).replace(e,t)},t.attachComments=function(e,t,r){var o,a,i,s,l=[];if(!e.range)throw new Error("attachComments needs range information");if(!r.length){if(t.length){for(i=0,a=t.length;i<a;i+=1)(o=u(t[i])).extendedRange=[0,e.range[0]],l.push(o);e.leadingComments=l}return e}for(i=0,a=t.length;i<a;i+=1)l.push(m(u(t[i]),r));return s=0,d(e,{enter:function(e){for(var t;s<l.length&&!((t=l[s]).extendedRange[1]>e.range[0]);)t.extendedRange[1]===e.range[0]?(e.leadingComments||(e.leadingComments=[]),e.leadingComments.push(t),l.splice(s,1)):s+=1;return s===l.length?n.Break:l[s].extendedRange[0]>e.range[1]?n.Skip:void 0}}),s=0,d(e,{leave:function(e){for(var t;s<l.length&&(t=l[s],!(e.range[1]<t.extendedRange[0]));)e.range[1]===t.extendedRange[0]?(e.trailingComments||(e.trailingComments=[]),e.trailingComments.push(t),l.splice(s,1)):s+=1;return s===l.length?n.Break:l[s].extendedRange[0]>e.range[1]?n.Skip:void 0}}),e},t.VisitorKeys=o,t.VisitorOption=n,t.Controller=f,t.cloneEnvironment=function(){return e({})},t}(t)})),s=a((function(e){e.exports&&(e.exports=function(){function e(t,r,n,o){this.message=t,this.expected=r,this.found=n,this.location=o,this.name="SyntaxError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,e)}return function(e,t){function r(){this.constructor=e}r.prototype=t.prototype,e.prototype=new r}(e,Error),e.buildMessage=function(e,t){var r={literal:function(e){return'"'+o(e.text)+'"'},class:function(e){var t,r="";for(t=0;t<e.parts.length;t++)r+=e.parts[t]instanceof Array?a(e.parts[t][0])+"-"+a(e.parts[t][1]):a(e.parts[t]);return"["+(e.inverted?"^":"")+r+"]"},any:function(e){return"any character"},end:function(e){return"end of input"},other:function(e){return e.description}};function n(e){return e.charCodeAt(0).toString(16).toUpperCase()}function o(e){return e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(e){return"\\x0"+n(e)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(e){return"\\x"+n(e)}))}function a(e){return e.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(e){return"\\x0"+n(e)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(e){return"\\x"+n(e)}))}return"Expected "+function(e){var t,n,o,a=new Array(e.length);for(t=0;t<e.length;t++)a[t]=(o=e[t],r[o.type](o));if(a.sort(),a.length>0){for(t=1,n=1;t<a.length;t++)a[t-1]!==a[t]&&(a[n]=a[t],n++);a.length=n}switch(a.length){case 1:return a[0];case 2:return a[0]+" or "+a[1];default:return a.slice(0,-1).join(", ")+", or "+a[a.length-1]}}(e)+" but "+function(e){return e?'"'+o(e)+'"':"end of input"}(t)+" found."},{SyntaxError:e,parse:function(t,r){r=void 0!==r?r:{};var n,o,a,i,s={},u={start:de},l=de,c=ce(" ",!1),f=/^[^ [\],():#!=><~+.]/,p=fe([" ","[","]",",","(",")",":","#","!","=",">","<","~","+","."],!0,!1),h=ce(">",!1),y=ce("~",!1),d=ce("+",!1),m=ce(",",!1),x=ce("!",!1),v=ce("*",!1),g=ce("#",!1),A=ce("[",!1),E=ce("]",!1),b=/^[><!]/,S=fe([">","<","!"],!1,!1),_=ce("=",!1),C=function(e){return(e||"")+"="},w=/^[><]/,P=fe([">","<"],!1,!1),k=ce(".",!1),D=function(e,t,r){return{type:"attribute",name:e,operator:t,value:r}},I=ce('"',!1),j=/^[^\\"]/,T=fe(["\\",'"'],!0,!1),F=ce("\\",!1),R={type:"any"},O=function(e,t){return e+t},L=function(e){return{type:"literal",value:(t=e.join(""),t.replace(/\\(.)/g,(function(e,t){switch(t){case"b":return"\b";case"f":return"\f";case"n":return"\n";case"r":return"\r";case"t":return"\t";case"v":return"\v";default:return t}})))};var t},M=ce("'",!1),B=/^[^\\']/,U=fe(["\\","'"],!0,!1),K=/^[0-9]/,W=fe([["0","9"]],!1,!1),q=ce("type(",!1),V=/^[^ )]/,N=fe([" ",")"],!0,!1),G=ce(")",!1),z=/^[imsu]/,H=fe(["i","m","s","u"],!1,!1),Y=ce("/",!1),$=/^[^\/]/,J=fe(["/"],!0,!1),Q=ce(":not(",!1),X=ce(":matches(",!1),Z=ce(":has(",!1),ee=ce(":first-child",!1),te=ce(":last-child",!1),re=ce(":nth-child(",!1),ne=ce(":nth-last-child(",!1),oe=ce(":",!1),ae=0,ie=[{line:1,column:1}],se=0,ue=[],le={};if("startRule"in r){if(!(r.startRule in u))throw new Error("Can't start parsing from rule \""+r.startRule+'".');l=u[r.startRule]}function ce(e,t){return{type:"literal",text:e,ignoreCase:t}}function fe(e,t,r){return{type:"class",parts:e,inverted:t,ignoreCase:r}}function pe(e){var r,n=ie[e];if(n)return n;for(r=e-1;!ie[r];)r--;for(n={line:(n=ie[r]).line,column:n.column};r<e;)10===t.charCodeAt(r)?(n.line++,n.column=1):n.column++,r++;return ie[e]=n,n}function he(e,t){var r=pe(e),n=pe(t);return{start:{offset:e,line:r.line,column:r.column},end:{offset:t,line:n.line,column:n.column}}}function ye(e){ae<se||(ae>se&&(se=ae,ue=[]),ue.push(e))}function de(){var e,t,r,n,o=30*ae+0,a=le[o];return a?(ae=a.nextPos,a.result):(e=ae,(t=me())!==s&&(r=ge())!==s&&me()!==s?e=t=1===(n=r).length?n[0]:{type:"matches",selectors:n}:(ae=e,e=s),e===s&&(e=ae,(t=me())!==s&&(t=void 0),e=t),le[o]={nextPos:ae,result:e},e)}function me(){var e,r,n=30*ae+1,o=le[n];if(o)return ae=o.nextPos,o.result;for(e=[],32===t.charCodeAt(ae)?(r=" ",ae++):(r=s,ye(c));r!==s;)e.push(r),32===t.charCodeAt(ae)?(r=" ",ae++):(r=s,ye(c));return le[n]={nextPos:ae,result:e},e}function xe(){var e,r,n,o=30*ae+2,a=le[o];if(a)return ae=a.nextPos,a.result;if(r=[],f.test(t.charAt(ae))?(n=t.charAt(ae),ae++):(n=s,ye(p)),n!==s)for(;n!==s;)r.push(n),f.test(t.charAt(ae))?(n=t.charAt(ae),ae++):(n=s,ye(p));else r=s;return r!==s&&(r=r.join("")),e=r,le[o]={nextPos:ae,result:e},e}function ve(){var e,r,n,o=30*ae+3,a=le[o];return a?(ae=a.nextPos,a.result):(e=ae,(r=me())!==s?(62===t.charCodeAt(ae)?(n=">",ae++):(n=s,ye(h)),n!==s&&me()!==s?e=r="child":(ae=e,e=s)):(ae=e,e=s),e===s&&(e=ae,(r=me())!==s?(126===t.charCodeAt(ae)?(n="~",ae++):(n=s,ye(y)),n!==s&&me()!==s?e=r="sibling":(ae=e,e=s)):(ae=e,e=s),e===s&&(e=ae,(r=me())!==s?(43===t.charCodeAt(ae)?(n="+",ae++):(n=s,ye(d)),n!==s&&me()!==s?e=r="adjacent":(ae=e,e=s)):(ae=e,e=s),e===s&&(e=ae,32===t.charCodeAt(ae)?(r=" ",ae++):(r=s,ye(c)),r!==s&&(n=me())!==s?e=r="descendant":(ae=e,e=s)))),le[o]={nextPos:ae,result:e},e)}function ge(){var e,r,n,o,a,i,u,l,c=30*ae+4,f=le[c];if(f)return ae=f.nextPos,f.result;if(e=ae,(r=Ae())!==s){for(n=[],o=ae,(a=me())!==s?(44===t.charCodeAt(ae)?(i=",",ae++):(i=s,ye(m)),i!==s&&(u=me())!==s&&(l=Ae())!==s?o=a=[a,i,u,l]:(ae=o,o=s)):(ae=o,o=s);o!==s;)n.push(o),o=ae,(a=me())!==s?(44===t.charCodeAt(ae)?(i=",",ae++):(i=s,ye(m)),i!==s&&(u=me())!==s&&(l=Ae())!==s?o=a=[a,i,u,l]:(ae=o,o=s)):(ae=o,o=s);n!==s?e=r=[r].concat(n.map((function(e){return e[3]}))):(ae=e,e=s)}else ae=e,e=s;return le[c]={nextPos:ae,result:e},e}function Ae(){var e,t,r,n,o,a,i,u=30*ae+5,l=le[u];if(l)return ae=l.nextPos,l.result;if(e=ae,(t=Ee())!==s){for(r=[],n=ae,(o=ve())!==s&&(a=Ee())!==s?n=o=[o,a]:(ae=n,n=s);n!==s;)r.push(n),n=ae,(o=ve())!==s&&(a=Ee())!==s?n=o=[o,a]:(ae=n,n=s);r!==s?(i=t,e=t=r.reduce((function(e,t){return{type:t[0],left:e,right:t[1]}}),i)):(ae=e,e=s)}else ae=e,e=s;return le[u]={nextPos:ae,result:e},e}function Ee(){var e,r,n,o,a,i,u,l=30*ae+6,c=le[l];if(c)return ae=c.nextPos,c.result;if(e=ae,33===t.charCodeAt(ae)?(r="!",ae++):(r=s,ye(x)),r===s&&(r=null),r!==s){if(n=[],(o=be())!==s)for(;o!==s;)n.push(o),o=be();else n=s;n!==s?(a=r,u=1===(i=n).length?i[0]:{type:"compound",selectors:i},a&&(u.subject=!0),e=r=u):(ae=e,e=s)}else ae=e,e=s;return le[l]={nextPos:ae,result:e},e}function be(){var e,r=30*ae+7,n=le[r];return n?(ae=n.nextPos,n.result):((e=function(){var e,r,n=30*ae+8,o=le[n];return o?(ae=o.nextPos,o.result):(42===t.charCodeAt(ae)?(r="*",ae++):(r=s,ye(v)),r!==s&&(r={type:"wildcard",value:r}),e=r,le[n]={nextPos:ae,result:e},e)}())===s&&(e=function(){var e,r,n,o=30*ae+9,a=le[o];return a?(ae=a.nextPos,a.result):(e=ae,35===t.charCodeAt(ae)?(r="#",ae++):(r=s,ye(g)),r===s&&(r=null),r!==s&&(n=xe())!==s?e=r={type:"identifier",value:n}:(ae=e,e=s),le[o]={nextPos:ae,result:e},e)}())===s&&(e=function(){var e,r,n,o,a=30*ae+10,i=le[a];return i?(ae=i.nextPos,i.result):(e=ae,91===t.charCodeAt(ae)?(r="[",ae++):(r=s,ye(A)),r!==s&&me()!==s&&(n=function(){var e,r,n,o,a=30*ae+14,i=le[a];return i?(ae=i.nextPos,i.result):(e=ae,(r=Se())!==s&&me()!==s&&(n=function(){var e,r,n,o=30*ae+12,a=le[o];return a?(ae=a.nextPos,a.result):(e=ae,33===t.charCodeAt(ae)?(r="!",ae++):(r=s,ye(x)),r===s&&(r=null),r!==s?(61===t.charCodeAt(ae)?(n="=",ae++):(n=s,ye(_)),n!==s?(r=C(r),e=r):(ae=e,e=s)):(ae=e,e=s),le[o]={nextPos:ae,result:e},e)}())!==s&&me()!==s?((o=function(){var e,r,n,o,a,i=30*ae+18,u=le[i];if(u)return ae=u.nextPos,u.result;if(e=ae,"type("===t.substr(ae,5)?(r="type(",ae+=5):(r=s,ye(q)),r!==s)if(me()!==s){if(n=[],V.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(N)),o!==s)for(;o!==s;)n.push(o),V.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(N));else n=s;n!==s&&(o=me())!==s?(41===t.charCodeAt(ae)?(a=")",ae++):(a=s,ye(G)),a!==s?(r={type:"type",value:n.join("")},e=r):(ae=e,e=s)):(ae=e,e=s)}else ae=e,e=s;else ae=e,e=s;return le[i]={nextPos:ae,result:e},e}())===s&&(o=function(){var e,r,n,o,a,i,u=30*ae+20,l=le[u];if(l)return ae=l.nextPos,l.result;if(e=ae,47===t.charCodeAt(ae)?(r="/",ae++):(r=s,ye(Y)),r!==s){if(n=[],$.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(J)),o!==s)for(;o!==s;)n.push(o),$.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(J));else n=s;n!==s?(47===t.charCodeAt(ae)?(o="/",ae++):(o=s,ye(Y)),o!==s?((a=function(){var e,r,n=30*ae+19,o=le[n];if(o)return ae=o.nextPos,o.result;if(e=[],z.test(t.charAt(ae))?(r=t.charAt(ae),ae++):(r=s,ye(H)),r!==s)for(;r!==s;)e.push(r),z.test(t.charAt(ae))?(r=t.charAt(ae),ae++):(r=s,ye(H));else e=s;return le[n]={nextPos:ae,result:e},e}())===s&&(a=null),a!==s?(i=a,r={type:"regexp",value:new RegExp(n.join(""),i?i.join(""):"")},e=r):(ae=e,e=s)):(ae=e,e=s)):(ae=e,e=s)}else ae=e,e=s;return le[u]={nextPos:ae,result:e},e}()),o!==s?(r=D(r,n,o),e=r):(ae=e,e=s)):(ae=e,e=s),e===s&&(e=ae,(r=Se())!==s&&me()!==s&&(n=function(){var e,r,n,o=30*ae+11,a=le[o];return a?(ae=a.nextPos,a.result):(e=ae,b.test(t.charAt(ae))?(r=t.charAt(ae),ae++):(r=s,ye(S)),r===s&&(r=null),r!==s?(61===t.charCodeAt(ae)?(n="=",ae++):(n=s,ye(_)),n!==s?(r=C(r),e=r):(ae=e,e=s)):(ae=e,e=s),e===s&&(w.test(t.charAt(ae))?(e=t.charAt(ae),ae++):(e=s,ye(P))),le[o]={nextPos:ae,result:e},e)}())!==s&&me()!==s?((o=function(){var e,r,n,o,a,i,u=30*ae+15,l=le[u];if(l)return ae=l.nextPos,l.result;if(e=ae,34===t.charCodeAt(ae)?(r='"',ae++):(r=s,ye(I)),r!==s){for(n=[],j.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(T)),o===s&&(o=ae,92===t.charCodeAt(ae)?(a="\\",ae++):(a=s,ye(F)),a!==s?(t.length>ae?(i=t.charAt(ae),ae++):(i=s,ye(R)),i!==s?(a=O(a,i),o=a):(ae=o,o=s)):(ae=o,o=s));o!==s;)n.push(o),j.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(T)),o===s&&(o=ae,92===t.charCodeAt(ae)?(a="\\",ae++):(a=s,ye(F)),a!==s?(t.length>ae?(i=t.charAt(ae),ae++):(i=s,ye(R)),i!==s?(a=O(a,i),o=a):(ae=o,o=s)):(ae=o,o=s));n!==s?(34===t.charCodeAt(ae)?(o='"',ae++):(o=s,ye(I)),o!==s?(r=L(n),e=r):(ae=e,e=s)):(ae=e,e=s)}else ae=e,e=s;if(e===s)if(e=ae,39===t.charCodeAt(ae)?(r="'",ae++):(r=s,ye(M)),r!==s){for(n=[],B.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(U)),o===s&&(o=ae,92===t.charCodeAt(ae)?(a="\\",ae++):(a=s,ye(F)),a!==s?(t.length>ae?(i=t.charAt(ae),ae++):(i=s,ye(R)),i!==s?(a=O(a,i),o=a):(ae=o,o=s)):(ae=o,o=s));o!==s;)n.push(o),B.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(U)),o===s&&(o=ae,92===t.charCodeAt(ae)?(a="\\",ae++):(a=s,ye(F)),a!==s?(t.length>ae?(i=t.charAt(ae),ae++):(i=s,ye(R)),i!==s?(a=O(a,i),o=a):(ae=o,o=s)):(ae=o,o=s));n!==s?(39===t.charCodeAt(ae)?(o="'",ae++):(o=s,ye(M)),o!==s?(r=L(n),e=r):(ae=e,e=s)):(ae=e,e=s)}else ae=e,e=s;return le[u]={nextPos:ae,result:e},e}())===s&&(o=function(){var e,r,n,o,a,i,u,l=30*ae+16,c=le[l];if(c)return ae=c.nextPos,c.result;for(e=ae,r=ae,n=[],K.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(W));o!==s;)n.push(o),K.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(W));if(n!==s?(46===t.charCodeAt(ae)?(o=".",ae++):(o=s,ye(k)),o!==s?r=n=[n,o]:(ae=r,r=s)):(ae=r,r=s),r===s&&(r=null),r!==s){if(n=[],K.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(W)),o!==s)for(;o!==s;)n.push(o),K.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(W));else n=s;n!==s?(i=n,u=(a=r)?[].concat.apply([],a).join(""):"",r={type:"literal",value:parseFloat(u+i.join(""))},e=r):(ae=e,e=s)}else ae=e,e=s;return le[l]={nextPos:ae,result:e},e}())===s&&(o=function(){var e,t,r=30*ae+17,n=le[r];return n?(ae=n.nextPos,n.result):((t=xe())!==s&&(t={type:"literal",value:t}),e=t,le[r]={nextPos:ae,result:e},e)}()),o!==s?(r=D(r,n,o),e=r):(ae=e,e=s)):(ae=e,e=s),e===s&&(e=ae,(r=Se())!==s&&(r={type:"attribute",name:r}),e=r)),le[a]={nextPos:ae,result:e},e)}())!==s&&me()!==s?(93===t.charCodeAt(ae)?(o="]",ae++):(o=s,ye(E)),o!==s?e=r=n:(ae=e,e=s)):(ae=e,e=s),le[a]={nextPos:ae,result:e},e)}())===s&&(e=function(){var e,r,n,o,a,i,u,l,c=30*ae+21,f=le[c];if(f)return ae=f.nextPos,f.result;if(e=ae,46===t.charCodeAt(ae)?(r=".",ae++):(r=s,ye(k)),r!==s)if((n=xe())!==s){for(o=[],a=ae,46===t.charCodeAt(ae)?(i=".",ae++):(i=s,ye(k)),i!==s&&(u=xe())!==s?a=i=[i,u]:(ae=a,a=s);a!==s;)o.push(a),a=ae,46===t.charCodeAt(ae)?(i=".",ae++):(i=s,ye(k)),i!==s&&(u=xe())!==s?a=i=[i,u]:(ae=a,a=s);o!==s?(l=n,r={type:"field",name:o.reduce((function(e,t){return e+t[0]+t[1]}),l)},e=r):(ae=e,e=s)}else ae=e,e=s;else ae=e,e=s;return le[c]={nextPos:ae,result:e},e}())===s&&(e=function(){var e,r,n,o,a=30*ae+22,i=le[a];return i?(ae=i.nextPos,i.result):(e=ae,":not("===t.substr(ae,5)?(r=":not(",ae+=5):(r=s,ye(Q)),r!==s&&me()!==s&&(n=ge())!==s&&me()!==s?(41===t.charCodeAt(ae)?(o=")",ae++):(o=s,ye(G)),o!==s?e=r={type:"not",selectors:n}:(ae=e,e=s)):(ae=e,e=s),le[a]={nextPos:ae,result:e},e)}())===s&&(e=function(){var e,r,n,o,a=30*ae+23,i=le[a];return i?(ae=i.nextPos,i.result):(e=ae,":matches("===t.substr(ae,9)?(r=":matches(",ae+=9):(r=s,ye(X)),r!==s&&me()!==s&&(n=ge())!==s&&me()!==s?(41===t.charCodeAt(ae)?(o=")",ae++):(o=s,ye(G)),o!==s?e=r={type:"matches",selectors:n}:(ae=e,e=s)):(ae=e,e=s),le[a]={nextPos:ae,result:e},e)}())===s&&(e=function(){var e,r,n,o,a=30*ae+24,i=le[a];return i?(ae=i.nextPos,i.result):(e=ae,":has("===t.substr(ae,5)?(r=":has(",ae+=5):(r=s,ye(Z)),r!==s&&me()!==s&&(n=ge())!==s&&me()!==s?(41===t.charCodeAt(ae)?(o=")",ae++):(o=s,ye(G)),o!==s?e=r={type:"has",selectors:n}:(ae=e,e=s)):(ae=e,e=s),le[a]={nextPos:ae,result:e},e)}())===s&&(e=function(){var e,r,n=30*ae+25,o=le[n];return o?(ae=o.nextPos,o.result):(":first-child"===t.substr(ae,12)?(r=":first-child",ae+=12):(r=s,ye(ee)),r!==s&&(r=_e(1)),e=r,le[n]={nextPos:ae,result:e},e)}())===s&&(e=function(){var e,r,n=30*ae+26,o=le[n];return o?(ae=o.nextPos,o.result):(":last-child"===t.substr(ae,11)?(r=":last-child",ae+=11):(r=s,ye(te)),r!==s&&(r=Ce(1)),e=r,le[n]={nextPos:ae,result:e},e)}())===s&&(e=function(){var e,r,n,o,a,i=30*ae+27,u=le[i];if(u)return ae=u.nextPos,u.result;if(e=ae,":nth-child("===t.substr(ae,11)?(r=":nth-child(",ae+=11):(r=s,ye(re)),r!==s)if(me()!==s){if(n=[],K.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(W)),o!==s)for(;o!==s;)n.push(o),K.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(W));else n=s;n!==s&&(o=me())!==s?(41===t.charCodeAt(ae)?(a=")",ae++):(a=s,ye(G)),a!==s?(r=_e(parseInt(n.join(""),10)),e=r):(ae=e,e=s)):(ae=e,e=s)}else ae=e,e=s;else ae=e,e=s;return le[i]={nextPos:ae,result:e},e}())===s&&(e=function(){var e,r,n,o,a,i=30*ae+28,u=le[i];if(u)return ae=u.nextPos,u.result;if(e=ae,":nth-last-child("===t.substr(ae,16)?(r=":nth-last-child(",ae+=16):(r=s,ye(ne)),r!==s)if(me()!==s){if(n=[],K.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(W)),o!==s)for(;o!==s;)n.push(o),K.test(t.charAt(ae))?(o=t.charAt(ae),ae++):(o=s,ye(W));else n=s;n!==s&&(o=me())!==s?(41===t.charCodeAt(ae)?(a=")",ae++):(a=s,ye(G)),a!==s?(r=Ce(parseInt(n.join(""),10)),e=r):(ae=e,e=s)):(ae=e,e=s)}else ae=e,e=s;else ae=e,e=s;return le[i]={nextPos:ae,result:e},e}())===s&&(e=function(){var e,r,n,o=30*ae+29,a=le[o];return a?(ae=a.nextPos,a.result):(e=ae,58===t.charCodeAt(ae)?(r=":",ae++):(r=s,ye(oe)),r!==s&&(n=xe())!==s?e=r={type:"class",name:n}:(ae=e,e=s),le[o]={nextPos:ae,result:e},e)}()),le[r]={nextPos:ae,result:e},e)}function Se(){var e,r,n,o,a,i,u,l,c=30*ae+13,f=le[c];if(f)return ae=f.nextPos,f.result;if(e=ae,(r=xe())!==s){for(n=[],o=ae,46===t.charCodeAt(ae)?(a=".",ae++):(a=s,ye(k)),a!==s&&(i=xe())!==s?o=a=[a,i]:(ae=o,o=s);o!==s;)n.push(o),o=ae,46===t.charCodeAt(ae)?(a=".",ae++):(a=s,ye(k)),a!==s&&(i=xe())!==s?o=a=[a,i]:(ae=o,o=s);n!==s?(u=r,l=n,e=r=[].concat.apply([u],l).join("")):(ae=e,e=s)}else ae=e,e=s;return le[c]={nextPos:ae,result:e},e}function _e(e){return{type:"nth-child",index:{type:"literal",value:e}}}function Ce(e){return{type:"nth-last-child",index:{type:"literal",value:e}}}if((n=l())!==s&&ae===t.length)return n;throw n!==s&&ae<t.length&&ye({type:"end"}),o=ue,a=se<t.length?t.charAt(se):null,i=se<t.length?he(se,se+1):he(se,se),new e(e.buildMessage(o,a),o,a,i)}}}())}));function u(e,t){for(var r=0;r<t.length;++r){if(null==e)return e;e=e[t[r]]}return e}var l="function"==typeof WeakMap?new WeakMap:null;function c(e){if(null==e)return function(){return!0};if(null!=l){var t=l.get(e);return null!=t||(t=f(e),l.set(e,t)),t}return f(e)}function f(t){switch(t.type){case"wildcard":return function(){return!0};case"identifier":var r=t.value.toLowerCase();return function(e,t,n){var o=n&&n.nodeTypeKey||"type";return r===e[o].toLowerCase()};case"field":var n=t.name.split(".");return function(e,t){return function e(t,r,n,o){for(var a=r,i=o;i<n.length;++i){if(null==a)return!1;var s=a[n[i]];if(Array.isArray(s)){for(var u=0;u<s.length;++u)if(e(t,s[u],n,i+1))return!0;return!1}a=s}return t===a}(e,t[n.length-1],n,0)};case"matches":var o=t.selectors.map(c);return function(e,t,r){for(var n=0;n<o.length;++n)if(o[n](e,t,r))return!0;return!1};case"compound":var a=t.selectors.map(c);return function(e,t,r){for(var n=0;n<a.length;++n)if(!a[n](e,t,r))return!1;return!0};case"not":var s=t.selectors.map(c);return function(e,t,r){for(var n=0;n<s.length;++n)if(s[n](e,t,r))return!1;return!0};case"has":var l=t.selectors.map(c);return function(e,t,r){var n=!1,o=[];return i.traverse(e,{enter:function(e,t){null!=t&&o.unshift(t);for(var a=0;a<l.length;++a)if(l[a](e,o,r))return n=!0,void this.break()},leave:function(){o.shift()},keys:r&&r.visitorKeys,fallback:r&&r.fallback||"iteration"}),n};case"child":var f=c(t.left),p=c(t.right);return function(e,t,r){return!!(t.length>0&&p(e,t,r))&&f(t[0],t.slice(1),r)};case"descendant":var h=c(t.left),x=c(t.right);return function(e,t,r){if(x(e,t,r))for(var n=0,o=t.length;n<o;++n)if(h(t[n],t.slice(n+1),r))return!0;return!1};case"attribute":var v=t.name.split(".");switch(t.operator){case void 0:return function(e){return null!=u(e,v)};case"=":switch(t.value.type){case"regexp":return function(e){var r=u(e,v);return"string"==typeof r&&t.value.value.test(r)};case"literal":var g="".concat(t.value.value);return function(e){return g==="".concat(u(e,v))};case"type":return function(r){return t.value.value===e(u(r,v))}}throw new Error("Unknown selector value type: ".concat(t.value.type));case"!=":switch(t.value.type){case"regexp":return function(e){return!t.value.value.test(u(e,v))};case"literal":var A="".concat(t.value.value);return function(e){return A!=="".concat(u(e,v))};case"type":return function(r){return t.value.value!==e(u(r,v))}}throw new Error("Unknown selector value type: ".concat(t.value.type));case"<=":return function(e){return u(e,v)<=t.value.value};case"<":return function(e){return u(e,v)<t.value.value};case">":return function(e){return u(e,v)>t.value.value};case">=":return function(e){return u(e,v)>=t.value.value}}throw new Error("Unknown operator: ".concat(t.operator));case"sibling":var E=c(t.left),b=c(t.right);return function(e,r,n){return b(e,r,n)&&y(e,E,r,"LEFT_SIDE",n)||t.left.subject&&E(e,r,n)&&y(e,b,r,"RIGHT_SIDE",n)};case"adjacent":var S=c(t.left),_=c(t.right);return function(e,r,n){return _(e,r,n)&&d(e,S,r,"LEFT_SIDE",n)||t.right.subject&&S(e,r,n)&&d(e,_,r,"RIGHT_SIDE",n)};case"nth-child":var C=t.index.value,w=c(t.right);return function(e,t,r){return w(e,t,r)&&m(e,t,C,r)};case"nth-last-child":var P=-t.index.value,k=c(t.right);return function(e,t,r){return k(e,t,r)&&m(e,t,P,r)};case"class":return function(e,r,n){if(n&&n.matchClass)return n.matchClass(t.name,e,r);if(n&&n.nodeTypeKey)return!1;switch(t.name.toLowerCase()){case"statement":if("Statement"===e.type.slice(-9))return!0;case"declaration":return"Declaration"===e.type.slice(-11);case"pattern":if("Pattern"===e.type.slice(-7))return!0;case"expression":return"Expression"===e.type.slice(-10)||"Literal"===e.type.slice(-7)||"Identifier"===e.type&&(0===r.length||"MetaProperty"!==r[0].type)||"MetaProperty"===e.type;case"function":return"FunctionDeclaration"===e.type||"FunctionExpression"===e.type||"ArrowFunctionExpression"===e.type}throw new Error("Unknown class name: ".concat(t.name))}}throw new Error("Unknown selector type: ".concat(t.type))}function p(e,t){var r=t&&t.nodeTypeKey||"type",n=e[r];return t&&t.visitorKeys&&t.visitorKeys[n]?t.visitorKeys[n]:i.VisitorKeys[n]?i.VisitorKeys[n]:t&&"function"==typeof t.fallback?t.fallback(e):Object.keys(e).filter((function(e){return e!==r}))}function h(t,r){var n=r&&r.nodeTypeKey||"type";return null!==t&&"object"===e(t)&&"string"==typeof t[n]}function y(e,r,n,o,a){var i=t(n,1)[0];if(!i)return!1;for(var s=p(i,a),u=0;u<s.length;++u){var l=i[s[u]];if(Array.isArray(l)){var c=l.indexOf(e);if(c<0)continue;var f=void 0,y=void 0;"LEFT_SIDE"===o?(f=0,y=c):(f=c+1,y=l.length);for(var d=f;d<y;++d)if(h(l[d],a)&&r(l[d],n,a))return!0}}return!1}function d(e,r,n,o,a){var i=t(n,1)[0];if(!i)return!1;for(var s=p(i,a),u=0;u<s.length;++u){var l=i[s[u]];if(Array.isArray(l)){var c=l.indexOf(e);if(c<0)continue;if("LEFT_SIDE"===o&&c>0&&h(l[c-1],a)&&r(l[c-1],n,a))return!0;if("RIGHT_SIDE"===o&&c<l.length-1&&h(l[c+1],a)&&r(l[c+1],n,a))return!0}}return!1}function m(e,r,n,o){if(0===n)return!1;var a=t(r,1)[0];if(!a)return!1;for(var i=p(a,o),s=0;s<i.length;++s){var u=a[i[s]];if(Array.isArray(u)){var l=n<0?u.length+n:n-1;if(l>=0&&l<u.length&&u[l]===e)return!0}}return!1}function x(t,n,o,a){if(n){var s=[],u=c(n),l=function t(n,o){if(null==n||"object"!=e(n))return[];null==o&&(o=n);for(var a=n.subject?[o]:[],i=Object.keys(n),s=0;s<i.length;++s){var u=i[s],l=n[u];a.push.apply(a,r(t(l,"left"===u?l:o)))}return a}(n).map(c);i.traverse(t,{enter:function(e,t){if(null!=t&&s.unshift(t),u(e,s,a))if(l.length)for(var r=0,n=l.length;r<n;++r){l[r](e,s,a)&&o(e,t,s);for(var i=0,c=s.length;i<c;++i){var f=s.slice(i+1);l[r](s[i],f,a)&&o(s[i],t,f)}}else o(e,t,s)},leave:function(){s.shift()},keys:a&&a.visitorKeys,fallback:a&&a.fallback||"iteration"})}}function v(e,t,r){var n=[];return x(e,t,(function(e){n.push(e)}),r),n}function g(e){return s.parse(e)}function A(e,t,r){return v(e,g(t),r)}return A.parse=g,A.match=v,A.traverse=x,A.matches=function(e,t,r,n){return!t||!!e&&(r||(r=[]),c(t)(e,r,n))},A.query=A,A}));


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],171:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).meriyah={})}(this,(function(e){"use strict";const t={0:"Unexpected token",28:"Unexpected token: '%0'",1:"Octal escape sequences are not allowed in strict mode",2:"Octal escape sequences are not allowed in template strings",3:"Unexpected token `#`",4:"Illegal Unicode escape sequence",5:"Invalid code point %0",6:"Invalid hexadecimal escape sequence",8:"Octal literals are not allowed in strict mode",7:"Decimal integer literals with a leading zero are forbidden in strict mode",9:"Expected number in radix %0",146:"Invalid left-hand side assignment to a destructible right-hand side",10:"Non-number found after exponent indicator",11:"Invalid BigIntLiteral",12:"No identifiers allowed directly after numeric literal",13:"Escapes \\8 or \\9 are not syntactically valid escapes",14:"Unterminated string literal",15:"Unterminated template literal",16:"Multiline comment was not closed properly",17:"The identifier contained dynamic unicode escape that was not closed",18:"Illegal character '%0'",19:"Missing hexadecimal digits",20:"Invalid implicit octal",21:"Invalid line break in string literal",22:"Only unicode escapes are legal in identifier names",23:"Expected '%0'",24:"Invalid left-hand side in assignment",25:"Invalid left-hand side in async arrow",26:'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',27:"Member access on super must be in a method",29:"Await expression not allowed in formal parameter",30:"Yield expression not allowed in formal parameter",93:"Unexpected token: 'escaped keyword'",31:"Unary expressions as the left operand of an exponentiation expression must be disambiguated with parentheses",120:"Async functions can only be declared at the top level or inside a block",32:"Unterminated regular expression",33:"Unexpected regular expression flag",34:"Duplicate regular expression flag '%0'",35:"%0 functions must have exactly %1 argument%2",36:"Setter function argument must not be a rest parameter",37:"%0 declaration must have a name in this context",38:"Function name may not contain any reserved words or be eval or arguments in strict mode",39:"The rest operator is missing an argument",40:"A getter cannot be a generator",41:"A setter cannot be a generator",42:"A computed property name must be followed by a colon or paren",131:"Object literal keys that are strings or numbers must be a method or have a colon",44:"Found `* async x(){}` but this should be `async * x(){}`",43:"Getters and setters can not be generators",45:"'%0' can not be generator method",46:"No line break is allowed after '=>'",47:"The left-hand side of the arrow can only be destructed through assignment",48:"The binding declaration is not destructible",49:"Async arrow can not be followed by new expression",50:"Classes may not have a static property named 'prototype'",51:"Class constructor may not be a %0",52:"Duplicate constructor method in class",53:"Invalid increment/decrement operand",54:"Invalid use of `new` keyword on an increment/decrement expression",55:"`=>` is an invalid assignment target",56:"Rest element may not have a trailing comma",57:"Missing initializer in %0 declaration",58:"'for-%0' loop head declarations can not have an initializer",59:"Invalid left-hand side in for-%0 loop: Must have a single binding",60:"Invalid shorthand property initializer",61:"Property name __proto__ appears more than once in object literal",62:"Let is disallowed as a lexically bound name",63:"Invalid use of '%0' inside new expression",64:"Illegal 'use strict' directive in function with non-simple parameter list",65:'Identifier "let" disallowed as left-hand side expression in strict mode',66:"Illegal continue statement",67:"Illegal break statement",68:"Cannot have `let[...]` as a var name in strict mode",69:"Invalid destructuring assignment target",70:"Rest parameter may not have a default initializer",71:"The rest argument must the be last parameter",72:"Invalid rest argument",74:"In strict mode code, functions can only be declared at top level or inside a block",75:"In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement",76:"Without web compatibility enabled functions can not be declared at top level, inside a block, or as the body of an if statement",77:"Class declaration can't appear in single-statement context",78:"Invalid left-hand side in for-%0",79:"Invalid assignment in for-%0",80:"for await (... of ...) is only valid in async functions and async generators",81:"The first token after the template expression should be a continuation of the template",83:"`let` declaration not allowed here and `let` cannot be a regular var name in strict mode",82:"`let \n [` is a restricted production at the start of a statement",84:"Catch clause requires exactly one parameter, not more (and no trailing comma)",85:"Catch clause parameter does not support default values",86:"Missing catch or finally after try",87:"More than one default clause in switch statement",88:"Illegal newline after throw",89:"Strict mode code may not include a with statement",90:"Illegal return statement",91:"The left hand side of the for-header binding declaration is not destructible",92:"new.target only allowed within functions",94:"'#' not followed by identifier",100:"Invalid keyword",99:"Can not use 'let' as a class name",98:"'A lexical declaration can't define a 'let' binding",97:"Can not use `let` as variable name in strict mode",95:"'%0' may not be used as an identifier in this context",96:"Await is only valid in async functions",101:"The %0 keyword can only be used with the module goal",102:"Unicode codepoint must not be greater than 0x10FFFF",103:"%0 source must be string",104:"Only a identifier can be used to indicate alias",105:"Only '*' or '{...}' can be imported after default",106:"Trailing decorator may be followed by method",107:"Decorators can't be used with a constructor",109:"HTML comments are only allowed with web compatibility (Annex B)",110:"The identifier 'let' must not be in expression position in strict mode",111:"Cannot assign to `eval` and `arguments` in strict mode",112:"The left-hand side of a for-of loop may not start with 'let'",113:"Block body arrows can not be immediately invoked without a group",114:"Block body arrows can not be immediately accessed without a group",115:"Unexpected strict mode reserved word",116:"Unexpected eval or arguments in strict mode",117:"Decorators must not be followed by a semicolon",118:"Calling delete on expression not allowed in strict mode",119:"Pattern can not have a tail",121:"Can not have a `yield` expression on the left side of a ternary",122:"An arrow function can not have a postfix update operator",123:"Invalid object literal key character after generator star",124:"Private fields can not be deleted",126:"Classes may not have a field called constructor",125:"Classes may not have a private element named constructor",127:"A class field initializer may not contain arguments",128:"Generators can only be declared at the top level or inside a block",129:"Async methods are a restricted production and cannot have a newline following it",130:"Unexpected character after object literal property name",132:"Invalid key token",133:"Label '%0' has already been declared",134:"continue statement must be nested within an iteration statement",135:"Undefined label '%0'",136:"Trailing comma is disallowed inside import(...) arguments",137:"import() requires exactly one argument",138:"Cannot use new with import(...)",139:"... is not allowed in import()",140:"Expected '=>'",141:"Duplicate binding '%0'",142:"Cannot export a duplicate name '%0'",145:"Duplicate %0 for-binding",143:"Exported binding '%0' needs to refer to a top-level declared variable",144:"Unexpected private field",148:"Numeric separators are not allowed at the end of numeric literals",147:"Only one underscore is allowed as numeric separator",149:"JSX value should be either an expression or a quoted JSX text",150:"Expected corresponding JSX closing tag for %0",151:"Adjacent JSX elements must be wrapped in an enclosing tag",152:"JSX attributes must only be assigned a non-empty 'expression'",153:"'%0' has already been declared",154:"'%0' shadowed a catch clause binding",155:"Dot property must be an identifier",156:"Encountered invalid input after spread/rest argument",157:"Catch without try",158:"Finally without try",159:"Expected corresponding closing tag for JSX fragment",160:"Coalescing and logical operators used together in the same expression must be disambiguated with parentheses",161:"Invalid tagged template on optional chain",162:"Invalid optional chain from super property",163:"Invalid optional chain from new expression",164:'Cannot use "import.meta" outside a module',165:"Leading decorators must be attached to a class declaration"};class n extends SyntaxError{constructor(e,n,o,r,...s){const a="["+n+":"+o+"]: "+t[r].replace(/%(\d+)/g,((e,t)=>s[t]));super(`${a}`),this.index=e,this.line=n,this.column=o,this.description=a,this.loc={line:n,column:o}}}function o(e,t,...o){throw new n(e.index,e.line,e.column,t,...o)}function r(e){throw new n(e.index,e.line,e.column,e.type,e.params)}function s(e,t,o,r,...s){throw new n(e,t,o,r,...s)}function a(e,t,o,r){throw new n(e,t,o,r)}const i=((e,t)=>{const n=new Uint32Array(104448);let o=0,r=0;for(;o<3540;){const s=e[o++];if(s<0)r-=s;else{let a=e[o++];2&s&&(a=t[a]),1&s?n.fill(a,r,r+=e[o++]):n[r++]=a}}return n})([-1,2,24,2,25,2,5,-1,0,77595648,3,44,2,3,0,14,2,57,2,58,3,0,3,0,3168796671,0,4294956992,2,1,2,0,2,59,3,0,4,0,4294966523,3,0,4,2,16,2,60,2,0,0,4294836735,0,3221225471,0,4294901942,2,61,0,134152192,3,0,2,0,4294951935,3,0,2,0,2683305983,0,2684354047,2,17,2,0,0,4294961151,3,0,2,2,19,2,0,0,608174079,2,0,2,131,2,6,2,56,-1,2,37,0,4294443263,2,1,3,0,3,0,4294901711,2,39,0,4089839103,0,2961209759,0,1342439375,0,4294543342,0,3547201023,0,1577204103,0,4194240,0,4294688750,2,2,0,80831,0,4261478351,0,4294549486,2,2,0,2967484831,0,196559,0,3594373100,0,3288319768,0,8469959,2,194,2,3,0,3825204735,0,123747807,0,65487,0,4294828015,0,4092591615,0,1080049119,0,458703,2,3,2,0,0,2163244511,0,4227923919,0,4236247022,2,66,0,4284449919,0,851904,2,4,2,11,0,67076095,-1,2,67,0,1073741743,0,4093591391,-1,0,50331649,0,3265266687,2,32,0,4294844415,0,4278190047,2,18,2,129,-1,3,0,2,2,21,2,0,2,9,2,0,2,14,2,15,3,0,10,2,69,2,0,2,70,2,71,2,72,2,0,2,73,2,0,2,10,0,261632,2,23,3,0,2,2,12,2,4,3,0,18,2,74,2,5,3,0,2,2,75,0,2088959,2,27,2,8,0,909311,3,0,2,0,814743551,2,41,0,67057664,3,0,2,2,40,2,0,2,28,2,0,2,29,2,7,0,268374015,2,26,2,49,2,0,2,76,0,134153215,-1,2,6,2,0,2,7,0,2684354559,0,67044351,0,3221160064,0,1,-1,3,0,2,2,42,0,1046528,3,0,3,2,8,2,0,2,51,0,4294960127,2,9,2,38,2,10,0,4294377472,2,11,3,0,7,0,4227858431,3,0,8,2,12,2,0,2,78,2,9,2,0,2,79,2,80,2,81,-1,2,124,0,1048577,2,82,2,13,-1,2,13,0,131042,2,83,2,84,2,85,2,0,2,33,-83,2,0,2,53,2,7,3,0,4,0,1046559,2,0,2,14,2,0,0,2147516671,2,20,3,86,2,2,0,-16,2,87,0,524222462,2,4,2,0,0,4269801471,2,4,2,0,2,15,2,77,2,16,3,0,2,2,47,2,0,-1,2,17,-16,3,0,206,-2,3,0,655,2,18,3,0,36,2,68,-1,2,17,2,9,3,0,8,2,89,2,121,2,0,0,3220242431,3,0,3,2,19,2,90,2,91,3,0,2,2,92,2,0,2,93,2,94,2,0,0,4351,2,0,2,8,3,0,2,0,67043391,0,3909091327,2,0,2,22,2,8,2,18,3,0,2,0,67076097,2,7,2,0,2,20,0,67059711,0,4236247039,3,0,2,0,939524103,0,8191999,2,97,2,98,2,15,2,21,3,0,3,0,67057663,3,0,349,2,99,2,100,2,6,-264,3,0,11,2,22,3,0,2,2,31,-1,0,3774349439,2,101,2,102,3,0,2,2,19,2,103,3,0,10,2,9,2,17,2,0,2,45,2,0,2,30,2,104,2,23,0,1638399,2,172,2,105,3,0,3,2,18,2,24,2,25,2,5,2,26,2,0,2,7,2,106,-1,2,107,2,108,2,109,-1,3,0,3,2,11,-2,2,0,2,27,-3,2,150,-4,2,18,2,0,2,35,0,1,2,0,2,62,2,28,2,11,2,9,2,0,2,110,-1,3,0,4,2,9,2,21,2,111,2,6,2,0,2,112,2,0,2,48,-4,3,0,9,2,20,2,29,2,30,-4,2,113,2,114,2,29,2,20,2,7,-2,2,115,2,29,2,31,-2,2,0,2,116,-2,0,4277137519,0,2269118463,-1,3,18,2,-1,2,32,2,36,2,0,3,29,2,2,34,2,19,-3,3,0,2,2,33,-1,2,0,2,34,2,0,2,34,2,0,2,46,-10,2,0,0,203775,-2,2,18,2,43,2,35,-2,2,17,2,117,2,20,3,0,2,2,36,0,2147549120,2,0,2,11,2,17,2,135,2,0,2,37,2,52,0,5242879,3,0,2,0,402644511,-1,2,120,0,1090519039,-2,2,122,2,38,2,0,0,67045375,2,39,0,4226678271,0,3766565279,0,2039759,-4,3,0,2,0,3288270847,0,3,3,0,2,0,67043519,-5,2,0,0,4282384383,0,1056964609,-1,3,0,2,0,67043345,-1,2,0,2,40,2,41,-1,2,10,2,42,-6,2,0,2,11,-3,3,0,2,0,2147484671,2,125,0,4190109695,2,50,-2,2,126,0,4244635647,0,27,2,0,2,7,2,43,2,0,2,63,-1,2,0,2,40,-8,2,54,2,44,0,67043329,2,127,2,45,0,8388351,-2,2,128,0,3028287487,2,46,2,130,0,33259519,2,41,-9,2,20,-5,2,64,-2,3,0,28,2,31,-3,3,0,3,2,47,3,0,6,2,48,-85,3,0,33,2,47,-126,3,0,18,2,36,-269,3,0,17,2,40,2,7,2,41,-2,2,17,2,49,2,0,2,20,2,50,2,132,2,23,-21,3,0,2,-4,3,0,2,0,4294936575,2,0,0,4294934783,-2,0,196635,3,0,191,2,51,3,0,38,2,29,-1,2,33,-279,3,0,8,2,7,-1,2,133,2,52,3,0,11,2,6,-72,3,0,3,2,134,0,1677656575,-166,0,4161266656,0,4071,0,15360,-4,0,28,-13,3,0,2,2,37,2,0,2,136,2,137,2,55,2,0,2,138,2,139,2,140,3,0,10,2,141,2,142,2,15,3,37,2,3,53,2,3,54,2,0,4294954999,2,0,-16,2,0,2,88,2,0,0,2105343,0,4160749584,0,65534,-42,0,4194303871,0,2011,-6,2,0,0,1073684479,0,17407,-11,2,0,2,31,-40,3,0,6,0,8323103,-1,3,0,2,2,42,-37,2,55,2,144,2,145,2,146,2,147,2,148,-105,2,24,-32,3,0,1334,2,9,-1,3,0,129,2,27,3,0,6,2,9,3,0,180,2,149,3,0,233,0,1,-96,3,0,16,2,9,-47,3,0,154,2,56,-22381,3,0,7,2,23,-6130,3,5,2,-1,0,69207040,3,44,2,3,0,14,2,57,2,58,-3,0,3168731136,0,4294956864,2,1,2,0,2,59,3,0,4,0,4294966275,3,0,4,2,16,2,60,2,0,2,33,-1,2,17,2,61,-1,2,0,2,56,0,4294885376,3,0,2,0,3145727,0,2617294944,0,4294770688,2,23,2,62,3,0,2,0,131135,2,95,0,70256639,0,71303167,0,272,2,40,2,56,-1,2,37,2,30,-1,2,96,2,63,0,4278255616,0,4294836227,0,4294549473,0,600178175,0,2952806400,0,268632067,0,4294543328,0,57540095,0,1577058304,0,1835008,0,4294688736,2,65,2,64,0,33554435,2,123,2,65,2,151,0,131075,0,3594373096,0,67094296,2,64,-1,0,4294828e3,0,603979263,2,160,0,3,0,4294828001,0,602930687,2,183,0,393219,0,4294828016,0,671088639,0,2154840064,0,4227858435,0,4236247008,2,66,2,36,-1,2,4,0,917503,2,36,-1,2,67,0,537788335,0,4026531935,-1,0,1,-1,2,32,2,68,0,7936,-3,2,0,0,2147485695,0,1010761728,0,4292984930,0,16387,2,0,2,14,2,15,3,0,10,2,69,2,0,2,70,2,71,2,72,2,0,2,73,2,0,2,11,-1,2,23,3,0,2,2,12,2,4,3,0,18,2,74,2,5,3,0,2,2,75,0,253951,3,19,2,0,122879,2,0,2,8,0,276824064,-2,3,0,2,2,40,2,0,0,4294903295,2,0,2,29,2,7,-1,2,17,2,49,2,0,2,76,2,41,-1,2,20,2,0,2,27,-2,0,128,-2,2,77,2,8,0,4064,-1,2,119,0,4227907585,2,0,2,118,2,0,2,48,2,173,2,9,2,38,2,10,-1,0,74440192,3,0,6,-2,3,0,8,2,12,2,0,2,78,2,9,2,0,2,79,2,80,2,81,-3,2,82,2,13,-3,2,83,2,84,2,85,2,0,2,33,-83,2,0,2,53,2,7,3,0,4,0,817183,2,0,2,14,2,0,0,33023,2,20,3,86,2,-17,2,87,0,524157950,2,4,2,0,2,88,2,4,2,0,2,15,2,77,2,16,3,0,2,2,47,2,0,-1,2,17,-16,3,0,206,-2,3,0,655,2,18,3,0,36,2,68,-1,2,17,2,9,3,0,8,2,89,0,3072,2,0,0,2147516415,2,9,3,0,2,2,23,2,90,2,91,3,0,2,2,92,2,0,2,93,2,94,0,4294965179,0,7,2,0,2,8,2,91,2,8,-1,0,1761345536,2,95,0,4294901823,2,36,2,18,2,96,2,34,2,166,0,2080440287,2,0,2,33,2,143,0,3296722943,2,0,0,1046675455,0,939524101,0,1837055,2,97,2,98,2,15,2,21,3,0,3,0,7,3,0,349,2,99,2,100,2,6,-264,3,0,11,2,22,3,0,2,2,31,-1,0,2700607615,2,101,2,102,3,0,2,2,19,2,103,3,0,10,2,9,2,17,2,0,2,45,2,0,2,30,2,104,-3,2,105,3,0,3,2,18,-1,3,5,2,2,26,2,0,2,7,2,106,-1,2,107,2,108,2,109,-1,3,0,3,2,11,-2,2,0,2,27,-8,2,18,2,0,2,35,-1,2,0,2,62,2,28,2,29,2,9,2,0,2,110,-1,3,0,4,2,9,2,17,2,111,2,6,2,0,2,112,2,0,2,48,-4,3,0,9,2,20,2,29,2,30,-4,2,113,2,114,2,29,2,20,2,7,-2,2,115,2,29,2,31,-2,2,0,2,116,-2,0,4277075969,2,29,-1,3,18,2,-1,2,32,2,117,2,0,3,29,2,2,34,2,19,-3,3,0,2,2,33,-1,2,0,2,34,2,0,2,34,2,0,2,48,-10,2,0,0,197631,-2,2,18,2,43,2,118,-2,2,17,2,117,2,20,2,119,2,51,-2,2,119,2,23,2,17,2,33,2,119,2,36,0,4294901904,0,4718591,2,119,2,34,0,335544350,-1,2,120,2,121,-2,2,122,2,38,2,7,-1,2,123,2,65,0,3758161920,0,3,-4,2,0,2,27,0,2147485568,0,3,2,0,2,23,0,176,-5,2,0,2,47,2,186,-1,2,0,2,23,2,197,-1,2,0,0,16779263,-2,2,11,-7,2,0,2,121,-3,3,0,2,2,124,2,125,0,2147549183,0,2,-2,2,126,2,35,0,10,0,4294965249,0,67633151,0,4026597376,2,0,0,536871935,-1,2,0,2,40,-8,2,54,2,47,0,1,2,127,2,23,-3,2,128,2,35,2,129,2,130,0,16778239,-10,2,34,-5,2,64,-2,3,0,28,2,31,-3,3,0,3,2,47,3,0,6,2,48,-85,3,0,33,2,47,-126,3,0,18,2,36,-269,3,0,17,2,40,2,7,-3,2,17,2,131,2,0,2,23,2,48,2,132,2,23,-21,3,0,2,-4,3,0,2,0,67583,-1,2,103,-2,0,11,3,0,191,2,51,3,0,38,2,29,-1,2,33,-279,3,0,8,2,7,-1,2,133,2,52,3,0,11,2,6,-72,3,0,3,2,134,2,135,-187,3,0,2,2,37,2,0,2,136,2,137,2,55,2,0,2,138,2,139,2,140,3,0,10,2,141,2,142,2,15,3,37,2,3,53,2,3,54,2,2,143,-73,2,0,0,1065361407,0,16384,-11,2,0,2,121,-40,3,0,6,2,117,-1,3,0,2,0,2063,-37,2,55,2,144,2,145,2,146,2,147,2,148,-138,3,0,1334,2,9,-1,3,0,129,2,27,3,0,6,2,9,3,0,180,2,149,3,0,233,0,1,-96,3,0,16,2,9,-47,3,0,154,2,56,-28517,2,0,0,1,-1,2,124,2,0,0,8193,-21,2,193,0,10255,0,4,-11,2,64,2,171,-1,0,71680,-1,2,161,0,4292900864,0,805306431,-5,2,150,-1,2,157,-1,0,6144,-2,2,127,-1,2,154,-1,0,2147532800,2,151,2,165,2,0,2,164,0,524032,0,4,-4,2,190,0,205128192,0,1333757536,0,2147483696,0,423953,0,747766272,0,2717763192,0,4286578751,0,278545,2,152,0,4294886464,0,33292336,0,417809,2,152,0,1327482464,0,4278190128,0,700594195,0,1006647527,0,4286497336,0,4160749631,2,153,0,469762560,0,4171219488,0,8323120,2,153,0,202375680,0,3214918176,0,4294508592,2,153,-1,0,983584,0,48,0,58720273,0,3489923072,0,10517376,0,4293066815,0,1,0,2013265920,2,177,2,0,0,2089,0,3221225552,0,201375904,2,0,-2,0,256,0,122880,0,16777216,2,150,0,4160757760,2,0,-6,2,167,-11,0,3263218176,-1,0,49664,0,2160197632,0,8388802,-1,0,12713984,-1,2,154,2,159,2,178,-2,2,162,-20,0,3758096385,-2,2,155,0,4292878336,2,90,2,169,0,4294057984,-2,2,163,2,156,2,175,-2,2,155,-1,2,182,-1,2,170,2,124,0,4026593280,0,14,0,4292919296,-1,2,158,0,939588608,-1,0,805306368,-1,2,124,0,1610612736,2,156,2,157,2,4,2,0,-2,2,158,2,159,-3,0,267386880,-1,2,160,0,7168,-1,0,65024,2,154,2,161,2,179,-7,2,168,-8,2,162,-1,0,1426112704,2,163,-1,2,164,0,271581216,0,2149777408,2,23,2,161,2,124,0,851967,2,180,-1,2,23,2,181,-4,2,158,-20,2,195,2,165,-56,0,3145728,2,185,-4,2,166,2,124,-4,0,32505856,-1,2,167,-1,0,2147385088,2,90,1,2155905152,2,-3,2,103,2,0,2,168,-2,2,169,-6,2,170,0,4026597375,0,1,-1,0,1,-1,2,171,-3,2,117,2,64,-2,2,166,-2,2,176,2,124,-878,2,159,-36,2,172,-1,2,201,-10,2,188,-5,2,174,-6,0,4294965251,2,27,-1,2,173,-1,2,174,-2,0,4227874752,-3,0,2146435072,2,159,-2,0,1006649344,2,124,-1,2,90,0,201375744,-3,0,134217720,2,90,0,4286677377,0,32896,-1,2,158,-3,2,175,-349,2,176,0,1920,2,177,3,0,264,-11,2,157,-2,2,178,2,0,0,520617856,0,2692743168,0,36,-3,0,524284,-11,2,23,-1,2,187,-1,2,184,0,3221291007,2,178,-1,2,202,0,2158720,-3,2,159,0,1,-4,2,124,0,3808625411,0,3489628288,2,200,0,1207959680,0,3221274624,2,0,-3,2,179,0,120,0,7340032,-2,2,180,2,4,2,23,2,163,3,0,4,2,159,-1,2,181,2,177,-1,0,8176,2,182,2,179,2,183,-1,0,4290773232,2,0,-4,2,163,2,189,0,15728640,2,177,-1,2,161,-1,0,4294934512,3,0,4,-9,2,90,2,170,2,184,3,0,4,0,704,0,1849688064,2,185,-1,2,124,0,4294901887,2,0,0,130547712,0,1879048192,2,199,3,0,2,-1,2,186,2,187,-1,0,17829776,0,2025848832,0,4261477888,-2,2,0,-1,0,4286580608,-1,0,29360128,2,192,0,16252928,0,3791388672,2,38,3,0,2,-2,2,196,2,0,-1,2,103,-1,0,66584576,-1,2,191,3,0,9,2,124,-1,0,4294755328,3,0,2,-1,2,161,2,178,3,0,2,2,23,2,188,2,90,-2,0,245760,0,2147418112,-1,2,150,2,203,0,4227923456,-1,2,164,2,161,2,90,-3,0,4292870145,0,262144,2,124,3,0,2,0,1073758848,2,189,-1,0,4227921920,2,190,0,68289024,0,528402016,0,4292927536,3,0,4,-2,0,268435456,2,91,-2,2,191,3,0,5,-1,2,192,2,163,2,0,-2,0,4227923936,2,62,-1,2,155,2,95,2,0,2,154,2,158,3,0,6,-1,2,177,3,0,3,-2,0,2146959360,0,9440640,0,104857600,0,4227923840,3,0,2,0,768,2,193,2,77,-2,2,161,-2,2,119,-1,2,155,3,0,8,0,512,0,8388608,2,194,2,172,2,187,0,4286578944,3,0,2,0,1152,0,1266679808,2,191,0,576,0,4261707776,2,95,3,0,9,2,155,3,0,5,2,16,-1,0,2147221504,-28,2,178,3,0,3,-3,0,4292902912,-6,2,96,3,0,85,-33,0,4294934528,3,0,126,-18,2,195,3,0,269,-17,2,155,2,124,2,198,3,0,2,2,23,0,4290822144,-2,0,67174336,0,520093700,2,17,3,0,21,-2,2,179,3,0,3,-2,0,30720,-1,0,32512,3,0,2,0,4294770656,-191,2,174,-38,2,170,2,0,2,196,3,0,279,-8,2,124,2,0,0,4294508543,0,65295,-11,2,177,3,0,72,-3,0,3758159872,0,201391616,3,0,155,-7,2,170,-1,0,384,-1,0,133693440,-3,2,196,-2,2,26,3,0,4,2,169,-2,2,90,2,155,3,0,4,-2,2,164,-1,2,150,0,335552923,2,197,-1,0,538974272,0,2214592512,0,132e3,-10,0,192,-8,0,12288,-21,0,134213632,0,4294901761,3,0,42,0,100663424,0,4294965284,3,0,6,-1,0,3221282816,2,198,3,0,11,-1,2,199,3,0,40,-6,0,4286578784,2,0,-2,0,1006694400,3,0,24,2,35,-1,2,94,3,0,2,0,1,2,163,3,0,6,2,197,0,4110942569,0,1432950139,0,2701658217,0,4026532864,0,4026532881,2,0,2,45,3,0,8,-1,2,158,-2,2,169,0,98304,0,65537,2,170,-5,0,4294950912,2,0,2,118,0,65528,2,177,0,4294770176,2,26,3,0,4,-30,2,174,0,3758153728,-3,2,169,-2,2,155,2,188,2,158,-1,2,191,-1,2,161,0,4294754304,3,0,2,-3,0,33554432,-2,2,200,-3,2,169,0,4175478784,2,201,0,4286643712,0,4286644216,2,0,-4,2,202,-1,2,165,0,4227923967,3,0,32,-1334,2,163,2,0,-129,2,94,-6,2,163,-180,2,203,-233,2,4,3,0,96,-16,2,163,3,0,47,-154,2,165,3,0,22381,-7,2,17,3,0,6128],[4294967295,4294967291,4092460543,4294828031,4294967294,134217726,268435455,2147483647,1048575,1073741823,3892314111,134217727,1061158911,536805376,4294910143,4160749567,4294901759,4294901760,536870911,262143,8388607,4294902783,4294918143,65535,67043328,2281701374,4294967232,2097151,4294903807,4194303,255,67108863,4294967039,511,524287,131071,127,4292870143,4294902271,4294549487,33554431,1023,67047423,4294901888,4286578687,4294770687,67043583,32767,15,2047999,67043343,16777215,4294902e3,4294934527,4294966783,4294967279,2047,262083,20511,4290772991,41943039,493567,4294959104,603979775,65536,602799615,805044223,4294965206,8191,1031749119,4294917631,2134769663,4286578493,4282253311,4294942719,33540095,4294905855,4294967264,2868854591,1608515583,265232348,534519807,2147614720,1060109444,4093640016,17376,2139062143,224,4169138175,4294909951,4286578688,4294967292,4294965759,2044,4292870144,4294966272,4294967280,8289918,4294934399,4294901775,4294965375,1602223615,4294967259,4294443008,268369920,4292804608,486341884,4294963199,3087007615,1073692671,4128527,4279238655,4294902015,4294966591,2445279231,3670015,3238002687,31,63,4294967288,4294705151,4095,3221208447,4294549472,2147483648,4285526655,4294966527,4294705152,4294966143,64,4294966719,16383,3774873592,458752,536807423,67043839,3758096383,3959414372,3755993023,2080374783,4294835295,4294967103,4160749565,4087,184024726,2862017156,1593309078,268434431,268434414,4294901763,536870912,2952790016,202506752,139264,402653184,4261412864,4227922944,49152,61440,3758096384,117440512,65280,3233808384,3221225472,2097152,4294965248,32768,57152,67108864,4293918720,4290772992,25165824,57344,4227915776,4278190080,4227907584,65520,4026531840,4227858432,4160749568,3758129152,4294836224,63488,1073741824,4294967040,4194304,251658240,196608,4294963200,64512,417808,4227923712,12582912,50331648,65472,4294967168,4294966784,16,4294917120,2080374784,4096,65408,524288,65532]);function l(e){return e.column++,e.currentChar=e.source.charCodeAt(++e.index)}function c(e,t){if(55296!=(64512&t))return 0;const n=e.source.charCodeAt(e.index+1);return 56320!=(64512&n)?0:(t=e.currentChar=65536+((1023&t)<<10)+(1023&n),0==(1&i[0+(t>>>5)]>>>t)&&o(e,18,p(t)),e.index++,e.column++,1)}function u(e,t){e.currentChar=e.source.charCodeAt(++e.index),e.flags|=1,0==(4&t)&&(e.column=0,e.line++)}function d(e){e.flags|=1,e.currentChar=e.source.charCodeAt(++e.index),e.column=0,e.line++}function p(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(e>>>10)+String.fromCharCode(1023&e)}function f(e){return e<65?e-48:e-65+10&15}const k=[0,0,0,0,0,0,0,0,0,0,1032,0,0,2056,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8192,0,3,0,0,8192,0,0,0,256,0,33024,0,0,242,242,114,114,114,114,114,114,594,594,0,0,16384,0,0,0,0,67,67,67,67,67,67,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,1,0,0,4099,0,71,71,71,71,71,71,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,16384,0,0,0,0],g=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],m=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0];function b(e){return e<=127?g[e]:1&i[34816+(e>>>5)]>>>e}function h(e){return e<=127?m[e]:1&i[0+(e>>>5)]>>>e||8204===e||8205===e}const P=["SingleLine","MultiLine","HTMLOpen","HTMLClose","HashbangComment"];function y(e,t,n,r,s,a,i,l){return 2048&r&&o(e,0),x(e,t,n,s,a,i,l)}function x(e,t,n,o,r,s,a){const{index:i}=e;for(e.tokenPos=e.index,e.linePos=e.line,e.colPos=e.column;e.index<e.end;){if(8&k[e.currentChar]){const n=13===e.currentChar;d(e),n&&e.index<e.end&&10===e.currentChar&&(e.currentChar=t.charCodeAt(++e.index));break}if((8232^e.currentChar)<=1){d(e);break}l(e),e.tokenPos=e.index,e.linePos=e.line,e.colPos=e.column}if(e.onComment){const n={start:{line:s,column:a},end:{line:e.linePos,column:e.colPos}};e.onComment(P[255&o],t.slice(i,e.tokenPos),r,e.tokenPos,n)}return 1|n}function v(e,t,n){const{index:r}=e;for(;e.index<e.end;)if(e.currentChar<43){let o=!1;for(;42===e.currentChar;)if(o||(n&=-5,o=!0),47===l(e)){if(l(e),e.onComment){const n={start:{line:e.linePos,column:e.colPos},end:{line:e.line,column:e.column}};e.onComment(P[1],t.slice(r,e.index-2),r-2,e.index,n)}return e.tokenPos=e.index,e.linePos=e.line,e.colPos=e.column,n}if(o)continue;8&k[e.currentChar]?13===e.currentChar?(n|=5,d(e)):(u(e,n),n=-5&n|1):l(e)}else(8232^e.currentChar)<=1?(n=-5&n|1,d(e)):(n&=-5,l(e));o(e,16)}function w(e,t){const n=e.index;let r=0;e:for(;;){const t=e.currentChar;if(l(e),1&r)r&=-2;else switch(t){case 47:if(r)break;break e;case 92:r|=1;break;case 91:r|=2;break;case 93:r&=1;break;case 13:case 10:case 8232:case 8233:o(e,32)}if(e.index>=e.source.length)return o(e,32)}const s=e.index-1;let a=0,i=e.currentChar;const{index:c}=e;for(;h(i);){switch(i){case 103:2&a&&o(e,34,"g"),a|=2;break;case 105:1&a&&o(e,34,"i"),a|=1;break;case 109:4&a&&o(e,34,"m"),a|=4;break;case 117:16&a&&o(e,34,"u"),a|=16;break;case 121:8&a&&o(e,34,"y"),a|=8;break;case 115:32&a&&o(e,34,"s"),a|=32;break;case 100:64&a&&o(e,34,"d"),a|=64;break;default:o(e,33)}i=l(e)}const u=e.source.slice(c,e.index),d=e.source.slice(n,s);return e.tokenRegExp={pattern:d,flags:u},512&t&&(e.tokenRaw=e.source.slice(e.tokenPos,e.index)),e.tokenValue=function(e,t,n){try{return new RegExp(t,n)}catch(r){try{return new RegExp(t,n.replace("d","")),null}catch(t){o(e,32)}}}(e,d,u),65540}function q(e,t,n){const{index:r}=e;let s="",a=l(e),i=e.index;for(;0==(8&k[a]);){if(a===n)return s+=e.source.slice(i,e.index),l(e),512&t&&(e.tokenRaw=e.source.slice(r,e.index)),e.tokenValue=s,134283267;if(8==(8&a)&&92===a){if(s+=e.source.slice(i,e.index),a=l(e),a<127||8232===a||8233===a){const n=C(e,t,a);n>=0?s+=p(n):E(e,n,0)}else s+=p(a);i=e.index+1}e.index>=e.end&&o(e,14),a=l(e)}o(e,14)}function C(e,t,n){switch(n){case 98:return 8;case 102:return 12;case 114:return 13;case 110:return 10;case 116:return 9;case 118:return 11;case 13:if(e.index<e.end){const t=e.source.charCodeAt(e.index+1);10===t&&(e.index=e.index+1,e.currentChar=t)}case 10:case 8232:case 8233:return e.column=-1,e.line++,-1;case 48:case 49:case 50:case 51:{let o=n-48,r=e.index+1,s=e.column+1;if(r<e.end){const n=e.source.charCodeAt(r);if(0==(32&k[n])){if((0!==o||512&k[n])&&1024&t)return-2}else{if(1024&t)return-2;if(e.currentChar=n,o=o<<3|n-48,r++,s++,r<e.end){const t=e.source.charCodeAt(r);32&k[t]&&(e.currentChar=t,o=o<<3|t-48,r++,s++)}e.flags|=64,e.index=r-1,e.column=s-1}}return o}case 52:case 53:case 54:case 55:{if(1024&t)return-2;let o=n-48;const r=e.index+1,s=e.column+1;if(r<e.end){const t=e.source.charCodeAt(r);32&k[t]&&(o=o<<3|t-48,e.currentChar=t,e.index=r,e.column=s)}return e.flags|=64,o}case 120:{const t=l(e);if(0==(64&k[t]))return-4;const n=f(t),o=l(e);if(0==(64&k[o]))return-4;return n<<4|f(o)}case 117:{const t=l(e);if(123===e.currentChar){let t=0;for(;0!=(64&k[l(e)]);)if(t=t<<4|f(e.currentChar),t>1114111)return-5;return e.currentChar<1||125!==e.currentChar?-4:t}{if(0==(64&k[t]))return-4;const n=e.source.charCodeAt(e.index+1);if(0==(64&k[n]))return-4;const o=e.source.charCodeAt(e.index+2);if(0==(64&k[o]))return-4;const r=e.source.charCodeAt(e.index+3);return 0==(64&k[r])?-4:(e.index+=3,e.column+=3,e.currentChar=e.source.charCodeAt(e.index),f(t)<<12|f(n)<<8|f(o)<<4|f(r))}}case 56:case 57:if(0==(256&t))return-3;default:return n}}function E(e,t,n){switch(t){case-1:return;case-2:o(e,n?2:1);case-3:o(e,13);case-4:o(e,6);case-5:o(e,102)}}function A(e,t){const{index:n}=e;let r=67174409,s="",a=l(e);for(;96!==a;){if(36===a&&123===e.source.charCodeAt(e.index+1)){l(e),r=67174408;break}if(8==(8&a)&&92===a)if(a=l(e),a>126)s+=p(a);else{const n=C(e,1024|t,a);if(n>=0)s+=p(n);else{if(-1!==n&&65536&t){s=void 0,a=S(e,a),a<0&&(r=67174408);break}E(e,n,1)}}else e.index<e.end&&13===a&&10===e.source.charCodeAt(e.index)&&(s+=p(a),e.currentChar=e.source.charCodeAt(++e.index)),((83&a)<3&&10===a||(8232^a)<=1)&&(e.column=-1,e.line++),s+=p(a);e.index>=e.end&&o(e,15),a=l(e)}return l(e),e.tokenValue=s,e.tokenRaw=e.source.slice(n+1,e.index-(67174409===r?1:2)),r}function S(e,t){for(;96!==t;){switch(t){case 36:{const n=e.index+1;if(n<e.end&&123===e.source.charCodeAt(n))return e.index=n,e.column++,-t;break}case 10:case 8232:case 8233:e.column=-1,e.line++}e.index>=e.end&&o(e,15),t=l(e)}return t}function D(e,t){return e.index>=e.end&&o(e,0),e.index--,e.column--,A(e,t)}function L(e,t,n){let r=e.currentChar,s=0,i=9,c=64&n?0:1,u=0,d=0;if(64&n)s="."+V(e,r),r=e.currentChar,110===r&&o(e,11);else{if(48===r)if(r=l(e),120==(32|r)){for(n=136,r=l(e);4160&k[r];)95!==r?(d=1,s=16*s+f(r),u++,r=l(e)):(d||o(e,147),d=0,r=l(e));0!==u&&d||o(e,0===u?19:148)}else if(111==(32|r)){for(n=132,r=l(e);4128&k[r];)95!==r?(d=1,s=8*s+(r-48),u++,r=l(e)):(d||o(e,147),d=0,r=l(e));0!==u&&d||o(e,0===u?0:148)}else if(98==(32|r)){for(n=130,r=l(e);4224&k[r];)95!==r?(d=1,s=2*s+(r-48),u++,r=l(e)):(d||o(e,147),d=0,r=l(e));0!==u&&d||o(e,0===u?0:148)}else if(32&k[r])for(1024&t&&o(e,1),n=1;16&k[r];){if(512&k[r]){n=32,c=0;break}s=8*s+(r-48),r=l(e)}else 512&k[r]?(1024&t&&o(e,1),e.flags|=64,n=32):95===r&&o(e,0);if(48&n){if(c){for(;i>=0&&4112&k[r];)95!==r?(d=0,s=10*s+(r-48),r=l(e),--i):(r=l(e),(95===r||32&n)&&a(e.index,e.line,e.index+1,147),d=1);if(d&&a(e.index,e.line,e.index+1,148),i>=0&&!b(r)&&46!==r)return e.tokenValue=s,512&t&&(e.tokenRaw=e.source.slice(e.tokenPos,e.index)),134283266}s+=V(e,r),r=e.currentChar,46===r&&(95===l(e)&&o(e,0),n=64,s+="."+V(e,e.currentChar),r=e.currentChar)}}const p=e.index;let g=0;if(110===r&&128&n)g=1,r=l(e);else if(101==(32|r)){r=l(e),256&k[r]&&(r=l(e));const{index:t}=e;0==(16&k[r])&&o(e,10),s+=e.source.substring(p,t)+V(e,r),r=e.currentChar}return(e.index<e.end&&16&k[r]||b(r))&&o(e,12),g?(e.tokenRaw=e.source.slice(e.tokenPos,e.index),e.tokenValue=BigInt(s),134283389):(e.tokenValue=15&n?s:32&n?parseFloat(e.source.substring(e.tokenPos,e.index)):+s,512&t&&(e.tokenRaw=e.source.slice(e.tokenPos,e.index)),134283266)}function V(e,t){let n=0,o=e.index,r="";for(;4112&k[t];)if(95!==t)n=0,t=l(e);else{const{index:s}=e;95===(t=l(e))&&a(e.index,e.line,e.index+1,147),n=1,r+=e.source.substring(o,s),o=e.index}return n&&a(e.index,e.line,e.index+1,148),r+e.source.substring(o,e.index)}const T=["end of source","identifier","number","string","regular expression","false","true","null","template continuation","template tail","=>","(","{",".","...","}",")",";",",","[","]",":","?","'",'"',"</","/>","++","--","=","<<=",">>=",">>>=","**=","+=","-=","*=","/=","%=","^=","|=","&=","||=","&&=","??=","typeof","delete","void","!","~","+","-","in","instanceof","*","%","/","**","&&","||","===","!==","==","!=","<=",">=","<",">","<<",">>",">>>","&","|","^","var","let","const","break","case","catch","class","continue","debugger","default","do","else","export","extends","finally","for","function","if","import","new","return","super","switch","this","throw","try","while","with","implements","interface","package","private","protected","public","static","yield","as","async","await","constructor","get","set","from","of","enum","eval","arguments","escaped keyword","escaped future reserved keyword","reserved if strict","#","BigIntLiteral","??","?.","WhiteSpace","Illegal","LineTerminator","PrivateField","Template","@","target","meta","LineFeed","Escaped","JSXText"],R=Object.create(null,{this:{value:86113},function:{value:86106},if:{value:20571},return:{value:20574},var:{value:86090},else:{value:20565},for:{value:20569},new:{value:86109},in:{value:8738868},typeof:{value:16863277},while:{value:20580},case:{value:20558},break:{value:20557},try:{value:20579},catch:{value:20559},delete:{value:16863278},throw:{value:86114},switch:{value:86112},continue:{value:20561},default:{value:20563},instanceof:{value:8476725},do:{value:20564},void:{value:16863279},finally:{value:20568},async:{value:209007},await:{value:209008},class:{value:86096},const:{value:86092},constructor:{value:12401},debugger:{value:20562},export:{value:20566},extends:{value:20567},false:{value:86021},from:{value:12404},get:{value:12402},implements:{value:36966},import:{value:86108},interface:{value:36967},let:{value:241739},null:{value:86023},of:{value:274549},package:{value:36968},private:{value:36969},protected:{value:36970},public:{value:36971},set:{value:12403},static:{value:36972},super:{value:86111},true:{value:86022},with:{value:20581},yield:{value:241773},enum:{value:86134},eval:{value:537079927},as:{value:77934},arguments:{value:537079928},target:{value:143494},meta:{value:143495}});function N(e,t,n){for(;m[l(e)];);return e.tokenValue=e.source.slice(e.tokenPos,e.index),92!==e.currentChar&&e.currentChar<=126?R[e.tokenValue]||208897:U(e,t,0,n)}function I(e,t){const n=O(e);return h(n)||o(e,4),e.tokenValue=p(n),U(e,t,1,4&k[n])}function U(e,t,n,r){let s=e.index;for(;e.index<e.end;)if(92===e.currentChar){e.tokenValue+=e.source.slice(s,e.index),n=1;const t=O(e);h(t)||o(e,4),r=r&&4&k[t],e.tokenValue+=p(t),s=e.index}else{if(!h(e.currentChar)&&!c(e,e.currentChar))break;l(e)}e.index<=e.end&&(e.tokenValue+=e.source.slice(s,e.index));const a=e.tokenValue.length;if(r&&a>=2&&a<=11){const o=R[e.tokenValue];return void 0===o?208897:n?209008===o?0==(4196352&t)?o:121:1024&t?36972===o||36864==(36864&o)?122:20480==(20480&o)?1073741824&t&&0==(8192&t)?o:121:143483:1073741824&t&&0==(8192&t)&&20480==(20480&o)?o:241773===o?1073741824&t?143483:2097152&t?121:o:209007===o?143483:36864==(36864&o)?o:121:o}return 208897}function B(e){return b(l(e))||o(e,94),131}function O(e){return 117!==e.source.charCodeAt(e.index+1)&&o(e,4),e.currentChar=e.source.charCodeAt(e.index+=2),function(e){let t=0;const n=e.currentChar;if(123===n){const n=e.index-2;for(;64&k[l(e)];)t=t<<4|f(e.currentChar),t>1114111&&a(n,e.line,e.index+1,102);return 125!==e.currentChar&&a(n,e.line,e.index-1,6),l(e),t}0==(64&k[n])&&o(e,6);const r=e.source.charCodeAt(e.index+1);0==(64&k[r])&&o(e,6);const s=e.source.charCodeAt(e.index+2);0==(64&k[s])&&o(e,6);const i=e.source.charCodeAt(e.index+3);0==(64&k[i])&&o(e,6);return t=f(n)<<12|f(r)<<8|f(s)<<4|f(i),e.currentChar=e.source.charCodeAt(e.index+=4),t}(e)}const G=[129,129,129,129,129,129,129,129,129,128,136,128,128,130,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,128,16842800,134283267,131,208897,8457015,8455751,134283267,67174411,16,8457014,25233970,18,25233971,67108877,8457016,134283266,134283266,134283266,134283266,134283266,134283266,134283266,134283266,134283266,134283266,21,1074790417,8456258,1077936157,8456259,22,133,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,69271571,137,20,8455497,208897,132,4096,4096,4096,4096,4096,4096,4096,208897,4096,208897,208897,4096,208897,4096,208897,4096,208897,4096,4096,4096,208897,4096,4096,208897,4096,4096,2162700,8455240,1074790415,16842801,129];function j(e,t){if(e.flags=1^(1|e.flags),e.startPos=e.index,e.startColumn=e.column,e.startLine=e.line,e.token=F(e,t,0),e.onToken&&1048576!==e.token){const t={start:{line:e.linePos,column:e.colPos},end:{line:e.line,column:e.column}};e.onToken(function(e){switch(e){case 134283266:return"NumericLiteral";case 134283267:return"StringLiteral";case 86021:case 86022:return"BooleanLiteral";case 86023:return"NullLiteral";case 65540:return"RegularExpression";case 67174408:case 67174409:case 132:return"TemplateLiteral";default:return 143360==(143360&e)?"Identifier":4096==(4096&e)?"Keyword":"Punctuator"}}(e.token),e.tokenPos,e.index,t)}}function F(e,t,n){const r=0===e.index,s=e.source;let a=e.index,c=e.line,f=e.column;for(;e.index<e.end;){e.tokenPos=e.index,e.colPos=e.column,e.linePos=e.line;let g=e.currentChar;if(g<=126){const i=G[g];switch(i){case 67174411:case 16:case 2162700:case 1074790415:case 69271571:case 20:case 21:case 1074790417:case 18:case 16842801:case 133:case 129:return l(e),i;case 208897:return N(e,t,0);case 4096:return N(e,t,1);case 134283266:return L(e,t,144);case 134283267:return q(e,t,g);case 132:return A(e,t);case 137:return I(e,t);case 131:return B(e);case 128:l(e);break;case 130:n|=5,d(e);break;case 136:u(e,n),n=-5&n|1;break;case 8456258:let p=l(e);if(e.index<e.end){if(60===p)return e.index<e.end&&61===l(e)?(l(e),4194334):8456516;if(61===p)return l(e),8456256;if(33===p){const o=e.index+1;if(o+1<e.end&&45===s.charCodeAt(o)&&45==s.charCodeAt(o+1)){e.column+=3,e.currentChar=s.charCodeAt(e.index+=3),n=y(e,s,n,t,2,e.tokenPos,e.linePos,e.colPos),a=e.tokenPos,c=e.linePos,f=e.colPos;continue}return 8456258}if(47===p){if(0==(16&t))return 8456258;const n=e.index+1;if(n<e.end&&(p=s.charCodeAt(n),42===p||47===p))break;return l(e),25}}return 8456258;case 1077936157:{l(e);const t=e.currentChar;return 61===t?61===l(e)?(l(e),8455996):8455998:62===t?(l(e),10):1077936157}case 16842800:return 61!==l(e)?16842800:61!==l(e)?8455999:(l(e),8455997);case 8457015:return 61!==l(e)?8457015:(l(e),4194342);case 8457014:{if(l(e),e.index>=e.end)return 8457014;const t=e.currentChar;return 61===t?(l(e),4194340):42!==t?8457014:61!==l(e)?8457273:(l(e),4194337)}case 8455497:return 61!==l(e)?8455497:(l(e),4194343);case 25233970:{l(e);const t=e.currentChar;return 43===t?(l(e),33619995):61===t?(l(e),4194338):25233970}case 25233971:{l(e);const i=e.currentChar;if(45===i){if(l(e),(1&n||r)&&62===e.currentChar){0==(256&t)&&o(e,109),l(e),n=y(e,s,n,t,3,a,c,f),a=e.tokenPos,c=e.linePos,f=e.colPos;continue}return 33619996}return 61===i?(l(e),4194339):25233971}case 8457016:if(l(e),e.index<e.end){const o=e.currentChar;if(47===o){l(e),n=x(e,s,n,0,e.tokenPos,e.linePos,e.colPos),a=e.tokenPos,c=e.linePos,f=e.colPos;continue}if(42===o){l(e),n=v(e,s,n),a=e.tokenPos,c=e.linePos,f=e.colPos;continue}if(32768&t)return w(e,t);if(61===o)return l(e),4259877}return 8457016;case 67108877:const k=l(e);if(k>=48&&k<=57)return L(e,t,80);if(46===k){const t=e.index+1;if(t<e.end&&46===s.charCodeAt(t))return e.column+=2,e.currentChar=s.charCodeAt(e.index+=2),14}return 67108877;case 8455240:{l(e);const t=e.currentChar;return 124===t?(l(e),61===e.currentChar?(l(e),4194346):8979003):61===t?(l(e),4194344):8455240}case 8456259:{l(e);const t=e.currentChar;if(61===t)return l(e),8456257;if(62!==t)return 8456259;if(l(e),e.index<e.end){const t=e.currentChar;if(62===t)return 61===l(e)?(l(e),4194336):8456518;if(61===t)return l(e),4194335}return 8456517}case 8455751:{l(e);const t=e.currentChar;return 38===t?(l(e),61===e.currentChar?(l(e),4194347):8979258):61===t?(l(e),4194345):8455751}case 22:{let t=l(e);if(63===t)return l(e),61===e.currentChar?(l(e),4194348):276889982;if(46===t){const n=e.index+1;if(n<e.end&&(t=s.charCodeAt(n),!(t>=48&&t<=57)))return l(e),67108991}return 22}}}else{if((8232^g)<=1){n=-5&n|1,d(e);continue}if(55296==(64512&g)||0!=(1&i[34816+(g>>>5)]>>>g))return 56320==(64512&g)&&(g=(1023&g)<<10|1023&g|65536,0==(1&i[0+(g>>>5)]>>>g)&&o(e,18,p(g)),e.index++,e.currentChar=g),e.column++,e.tokenValue="",U(e,t,0,0);if(160===(k=g)||65279===k||133===k||5760===k||k>=8192&&k<=8203||8239===k||8287===k||12288===k||8201===k||65519===k){l(e);continue}o(e,18,p(g))}}var k;return 1048576}const H={AElig:"Æ",AMP:"&",Aacute:"Á",Abreve:"Ă",Acirc:"Â",Acy:"А",Afr:"𝔄",Agrave:"À",Alpha:"Α",Amacr:"Ā",And:"⩓",Aogon:"Ą",Aopf:"𝔸",ApplyFunction:"⁡",Aring:"Å",Ascr:"𝒜",Assign:"≔",Atilde:"Ã",Auml:"Ä",Backslash:"∖",Barv:"⫧",Barwed:"⌆",Bcy:"Б",Because:"∵",Bernoullis:"ℬ",Beta:"Β",Bfr:"𝔅",Bopf:"𝔹",Breve:"˘",Bscr:"ℬ",Bumpeq:"≎",CHcy:"Ч",COPY:"©",Cacute:"Ć",Cap:"⋒",CapitalDifferentialD:"ⅅ",Cayleys:"ℭ",Ccaron:"Č",Ccedil:"Ç",Ccirc:"Ĉ",Cconint:"∰",Cdot:"Ċ",Cedilla:"¸",CenterDot:"·",Cfr:"ℭ",Chi:"Χ",CircleDot:"⊙",CircleMinus:"⊖",CirclePlus:"⊕",CircleTimes:"⊗",ClockwiseContourIntegral:"∲",CloseCurlyDoubleQuote:"”",CloseCurlyQuote:"’",Colon:"∷",Colone:"⩴",Congruent:"≡",Conint:"∯",ContourIntegral:"∮",Copf:"ℂ",Coproduct:"∐",CounterClockwiseContourIntegral:"∳",Cross:"⨯",Cscr:"𝒞",Cup:"⋓",CupCap:"≍",DD:"ⅅ",DDotrahd:"⤑",DJcy:"Ђ",DScy:"Ѕ",DZcy:"Џ",Dagger:"‡",Darr:"↡",Dashv:"⫤",Dcaron:"Ď",Dcy:"Д",Del:"∇",Delta:"Δ",Dfr:"𝔇",DiacriticalAcute:"´",DiacriticalDot:"˙",DiacriticalDoubleAcute:"˝",DiacriticalGrave:"`",DiacriticalTilde:"˜",Diamond:"⋄",DifferentialD:"ⅆ",Dopf:"𝔻",Dot:"¨",DotDot:"⃜",DotEqual:"≐",DoubleContourIntegral:"∯",DoubleDot:"¨",DoubleDownArrow:"⇓",DoubleLeftArrow:"⇐",DoubleLeftRightArrow:"⇔",DoubleLeftTee:"⫤",DoubleLongLeftArrow:"⟸",DoubleLongLeftRightArrow:"⟺",DoubleLongRightArrow:"⟹",DoubleRightArrow:"⇒",DoubleRightTee:"⊨",DoubleUpArrow:"⇑",DoubleUpDownArrow:"⇕",DoubleVerticalBar:"∥",DownArrow:"↓",DownArrowBar:"⤓",DownArrowUpArrow:"⇵",DownBreve:"̑",DownLeftRightVector:"⥐",DownLeftTeeVector:"⥞",DownLeftVector:"↽",DownLeftVectorBar:"⥖",DownRightTeeVector:"⥟",DownRightVector:"⇁",DownRightVectorBar:"⥗",DownTee:"⊤",DownTeeArrow:"↧",Downarrow:"⇓",Dscr:"𝒟",Dstrok:"Đ",ENG:"Ŋ",ETH:"Ð",Eacute:"É",Ecaron:"Ě",Ecirc:"Ê",Ecy:"Э",Edot:"Ė",Efr:"𝔈",Egrave:"È",Element:"∈",Emacr:"Ē",EmptySmallSquare:"◻",EmptyVerySmallSquare:"▫",Eogon:"Ę",Eopf:"𝔼",Epsilon:"Ε",Equal:"⩵",EqualTilde:"≂",Equilibrium:"⇌",Escr:"ℰ",Esim:"⩳",Eta:"Η",Euml:"Ë",Exists:"∃",ExponentialE:"ⅇ",Fcy:"Ф",Ffr:"𝔉",FilledSmallSquare:"◼",FilledVerySmallSquare:"▪",Fopf:"𝔽",ForAll:"∀",Fouriertrf:"ℱ",Fscr:"ℱ",GJcy:"Ѓ",GT:">",Gamma:"Γ",Gammad:"Ϝ",Gbreve:"Ğ",Gcedil:"Ģ",Gcirc:"Ĝ",Gcy:"Г",Gdot:"Ġ",Gfr:"𝔊",Gg:"⋙",Gopf:"𝔾",GreaterEqual:"≥",GreaterEqualLess:"⋛",GreaterFullEqual:"≧",GreaterGreater:"⪢",GreaterLess:"≷",GreaterSlantEqual:"⩾",GreaterTilde:"≳",Gscr:"𝒢",Gt:"≫",HARDcy:"Ъ",Hacek:"ˇ",Hat:"^",Hcirc:"Ĥ",Hfr:"ℌ",HilbertSpace:"ℋ",Hopf:"ℍ",HorizontalLine:"─",Hscr:"ℋ",Hstrok:"Ħ",HumpDownHump:"≎",HumpEqual:"≏",IEcy:"Е",IJlig:"Ĳ",IOcy:"Ё",Iacute:"Í",Icirc:"Î",Icy:"И",Idot:"İ",Ifr:"ℑ",Igrave:"Ì",Im:"ℑ",Imacr:"Ī",ImaginaryI:"ⅈ",Implies:"⇒",Int:"∬",Integral:"∫",Intersection:"⋂",InvisibleComma:"⁣",InvisibleTimes:"⁢",Iogon:"Į",Iopf:"𝕀",Iota:"Ι",Iscr:"ℐ",Itilde:"Ĩ",Iukcy:"І",Iuml:"Ï",Jcirc:"Ĵ",Jcy:"Й",Jfr:"𝔍",Jopf:"𝕁",Jscr:"𝒥",Jsercy:"Ј",Jukcy:"Є",KHcy:"Х",KJcy:"Ќ",Kappa:"Κ",Kcedil:"Ķ",Kcy:"К",Kfr:"𝔎",Kopf:"𝕂",Kscr:"𝒦",LJcy:"Љ",LT:"<",Lacute:"Ĺ",Lambda:"Λ",Lang:"⟪",Laplacetrf:"ℒ",Larr:"↞",Lcaron:"Ľ",Lcedil:"Ļ",Lcy:"Л",LeftAngleBracket:"⟨",LeftArrow:"←",LeftArrowBar:"⇤",LeftArrowRightArrow:"⇆",LeftCeiling:"⌈",LeftDoubleBracket:"⟦",LeftDownTeeVector:"⥡",LeftDownVector:"⇃",LeftDownVectorBar:"⥙",LeftFloor:"⌊",LeftRightArrow:"↔",LeftRightVector:"⥎",LeftTee:"⊣",LeftTeeArrow:"↤",LeftTeeVector:"⥚",LeftTriangle:"⊲",LeftTriangleBar:"⧏",LeftTriangleEqual:"⊴",LeftUpDownVector:"⥑",LeftUpTeeVector:"⥠",LeftUpVector:"↿",LeftUpVectorBar:"⥘",LeftVector:"↼",LeftVectorBar:"⥒",Leftarrow:"⇐",Leftrightarrow:"⇔",LessEqualGreater:"⋚",LessFullEqual:"≦",LessGreater:"≶",LessLess:"⪡",LessSlantEqual:"⩽",LessTilde:"≲",Lfr:"𝔏",Ll:"⋘",Lleftarrow:"⇚",Lmidot:"Ŀ",LongLeftArrow:"⟵",LongLeftRightArrow:"⟷",LongRightArrow:"⟶",Longleftarrow:"⟸",Longleftrightarrow:"⟺",Longrightarrow:"⟹",Lopf:"𝕃",LowerLeftArrow:"↙",LowerRightArrow:"↘",Lscr:"ℒ",Lsh:"↰",Lstrok:"Ł",Lt:"≪",Map:"⤅",Mcy:"М",MediumSpace:" ",Mellintrf:"ℳ",Mfr:"𝔐",MinusPlus:"∓",Mopf:"𝕄",Mscr:"ℳ",Mu:"Μ",NJcy:"Њ",Nacute:"Ń",Ncaron:"Ň",Ncedil:"Ņ",Ncy:"Н",NegativeMediumSpace:"​",NegativeThickSpace:"​",NegativeThinSpace:"​",NegativeVeryThinSpace:"​",NestedGreaterGreater:"≫",NestedLessLess:"≪",NewLine:"\n",Nfr:"𝔑",NoBreak:"⁠",NonBreakingSpace:" ",Nopf:"ℕ",Not:"⫬",NotCongruent:"≢",NotCupCap:"≭",NotDoubleVerticalBar:"∦",NotElement:"∉",NotEqual:"≠",NotEqualTilde:"≂̸",NotExists:"∄",NotGreater:"≯",NotGreaterEqual:"≱",NotGreaterFullEqual:"≧̸",NotGreaterGreater:"≫̸",NotGreaterLess:"≹",NotGreaterSlantEqual:"⩾̸",NotGreaterTilde:"≵",NotHumpDownHump:"≎̸",NotHumpEqual:"≏̸",NotLeftTriangle:"⋪",NotLeftTriangleBar:"⧏̸",NotLeftTriangleEqual:"⋬",NotLess:"≮",NotLessEqual:"≰",NotLessGreater:"≸",NotLessLess:"≪̸",NotLessSlantEqual:"⩽̸",NotLessTilde:"≴",NotNestedGreaterGreater:"⪢̸",NotNestedLessLess:"⪡̸",NotPrecedes:"⊀",NotPrecedesEqual:"⪯̸",NotPrecedesSlantEqual:"⋠",NotReverseElement:"∌",NotRightTriangle:"⋫",NotRightTriangleBar:"⧐̸",NotRightTriangleEqual:"⋭",NotSquareSubset:"⊏̸",NotSquareSubsetEqual:"⋢",NotSquareSuperset:"⊐̸",NotSquareSupersetEqual:"⋣",NotSubset:"⊂⃒",NotSubsetEqual:"⊈",NotSucceeds:"⊁",NotSucceedsEqual:"⪰̸",NotSucceedsSlantEqual:"⋡",NotSucceedsTilde:"≿̸",NotSuperset:"⊃⃒",NotSupersetEqual:"⊉",NotTilde:"≁",NotTildeEqual:"≄",NotTildeFullEqual:"≇",NotTildeTilde:"≉",NotVerticalBar:"∤",Nscr:"𝒩",Ntilde:"Ñ",Nu:"Ν",OElig:"Œ",Oacute:"Ó",Ocirc:"Ô",Ocy:"О",Odblac:"Ő",Ofr:"𝔒",Ograve:"Ò",Omacr:"Ō",Omega:"Ω",Omicron:"Ο",Oopf:"𝕆",OpenCurlyDoubleQuote:"“",OpenCurlyQuote:"‘",Or:"⩔",Oscr:"𝒪",Oslash:"Ø",Otilde:"Õ",Otimes:"⨷",Ouml:"Ö",OverBar:"‾",OverBrace:"⏞",OverBracket:"⎴",OverParenthesis:"⏜",PartialD:"∂",Pcy:"П",Pfr:"𝔓",Phi:"Φ",Pi:"Π",PlusMinus:"±",Poincareplane:"ℌ",Popf:"ℙ",Pr:"⪻",Precedes:"≺",PrecedesEqual:"⪯",PrecedesSlantEqual:"≼",PrecedesTilde:"≾",Prime:"″",Product:"∏",Proportion:"∷",Proportional:"∝",Pscr:"𝒫",Psi:"Ψ",QUOT:'"',Qfr:"𝔔",Qopf:"ℚ",Qscr:"𝒬",RBarr:"⤐",REG:"®",Racute:"Ŕ",Rang:"⟫",Rarr:"↠",Rarrtl:"⤖",Rcaron:"Ř",Rcedil:"Ŗ",Rcy:"Р",Re:"ℜ",ReverseElement:"∋",ReverseEquilibrium:"⇋",ReverseUpEquilibrium:"⥯",Rfr:"ℜ",Rho:"Ρ",RightAngleBracket:"⟩",RightArrow:"→",RightArrowBar:"⇥",RightArrowLeftArrow:"⇄",RightCeiling:"⌉",RightDoubleBracket:"⟧",RightDownTeeVector:"⥝",RightDownVector:"⇂",RightDownVectorBar:"⥕",RightFloor:"⌋",RightTee:"⊢",RightTeeArrow:"↦",RightTeeVector:"⥛",RightTriangle:"⊳",RightTriangleBar:"⧐",RightTriangleEqual:"⊵",RightUpDownVector:"⥏",RightUpTeeVector:"⥜",RightUpVector:"↾",RightUpVectorBar:"⥔",RightVector:"⇀",RightVectorBar:"⥓",Rightarrow:"⇒",Ropf:"ℝ",RoundImplies:"⥰",Rrightarrow:"⇛",Rscr:"ℛ",Rsh:"↱",RuleDelayed:"⧴",SHCHcy:"Щ",SHcy:"Ш",SOFTcy:"Ь",Sacute:"Ś",Sc:"⪼",Scaron:"Š",Scedil:"Ş",Scirc:"Ŝ",Scy:"С",Sfr:"𝔖",ShortDownArrow:"↓",ShortLeftArrow:"←",ShortRightArrow:"→",ShortUpArrow:"↑",Sigma:"Σ",SmallCircle:"∘",Sopf:"𝕊",Sqrt:"√",Square:"□",SquareIntersection:"⊓",SquareSubset:"⊏",SquareSubsetEqual:"⊑",SquareSuperset:"⊐",SquareSupersetEqual:"⊒",SquareUnion:"⊔",Sscr:"𝒮",Star:"⋆",Sub:"⋐",Subset:"⋐",SubsetEqual:"⊆",Succeeds:"≻",SucceedsEqual:"⪰",SucceedsSlantEqual:"≽",SucceedsTilde:"≿",SuchThat:"∋",Sum:"∑",Sup:"⋑",Superset:"⊃",SupersetEqual:"⊇",Supset:"⋑",THORN:"Þ",TRADE:"™",TSHcy:"Ћ",TScy:"Ц",Tab:"\t",Tau:"Τ",Tcaron:"Ť",Tcedil:"Ţ",Tcy:"Т",Tfr:"𝔗",Therefore:"∴",Theta:"Θ",ThickSpace:"  ",ThinSpace:" ",Tilde:"∼",TildeEqual:"≃",TildeFullEqual:"≅",TildeTilde:"≈",Topf:"𝕋",TripleDot:"⃛",Tscr:"𝒯",Tstrok:"Ŧ",Uacute:"Ú",Uarr:"↟",Uarrocir:"⥉",Ubrcy:"Ў",Ubreve:"Ŭ",Ucirc:"Û",Ucy:"У",Udblac:"Ű",Ufr:"𝔘",Ugrave:"Ù",Umacr:"Ū",UnderBar:"_",UnderBrace:"⏟",UnderBracket:"⎵",UnderParenthesis:"⏝",Union:"⋃",UnionPlus:"⊎",Uogon:"Ų",Uopf:"𝕌",UpArrow:"↑",UpArrowBar:"⤒",UpArrowDownArrow:"⇅",UpDownArrow:"↕",UpEquilibrium:"⥮",UpTee:"⊥",UpTeeArrow:"↥",Uparrow:"⇑",Updownarrow:"⇕",UpperLeftArrow:"↖",UpperRightArrow:"↗",Upsi:"ϒ",Upsilon:"Υ",Uring:"Ů",Uscr:"𝒰",Utilde:"Ũ",Uuml:"Ü",VDash:"⊫",Vbar:"⫫",Vcy:"В",Vdash:"⊩",Vdashl:"⫦",Vee:"⋁",Verbar:"‖",Vert:"‖",VerticalBar:"∣",VerticalLine:"|",VerticalSeparator:"❘",VerticalTilde:"≀",VeryThinSpace:" ",Vfr:"𝔙",Vopf:"𝕍",Vscr:"𝒱",Vvdash:"⊪",Wcirc:"Ŵ",Wedge:"⋀",Wfr:"𝔚",Wopf:"𝕎",Wscr:"𝒲",Xfr:"𝔛",Xi:"Ξ",Xopf:"𝕏",Xscr:"𝒳",YAcy:"Я",YIcy:"Ї",YUcy:"Ю",Yacute:"Ý",Ycirc:"Ŷ",Ycy:"Ы",Yfr:"𝔜",Yopf:"𝕐",Yscr:"𝒴",Yuml:"Ÿ",ZHcy:"Ж",Zacute:"Ź",Zcaron:"Ž",Zcy:"З",Zdot:"Ż",ZeroWidthSpace:"​",Zeta:"Ζ",Zfr:"ℨ",Zopf:"ℤ",Zscr:"𝒵",aacute:"á",abreve:"ă",ac:"∾",acE:"∾̳",acd:"∿",acirc:"â",acute:"´",acy:"а",aelig:"æ",af:"⁡",afr:"𝔞",agrave:"à",alefsym:"ℵ",aleph:"ℵ",alpha:"α",amacr:"ā",amalg:"⨿",amp:"&",and:"∧",andand:"⩕",andd:"⩜",andslope:"⩘",andv:"⩚",ang:"∠",ange:"⦤",angle:"∠",angmsd:"∡",angmsdaa:"⦨",angmsdab:"⦩",angmsdac:"⦪",angmsdad:"⦫",angmsdae:"⦬",angmsdaf:"⦭",angmsdag:"⦮",angmsdah:"⦯",angrt:"∟",angrtvb:"⊾",angrtvbd:"⦝",angsph:"∢",angst:"Å",angzarr:"⍼",aogon:"ą",aopf:"𝕒",ap:"≈",apE:"⩰",apacir:"⩯",ape:"≊",apid:"≋",apos:"'",approx:"≈",approxeq:"≊",aring:"å",ascr:"𝒶",ast:"*",asymp:"≈",asympeq:"≍",atilde:"ã",auml:"ä",awconint:"∳",awint:"⨑",bNot:"⫭",backcong:"≌",backepsilon:"϶",backprime:"‵",backsim:"∽",backsimeq:"⋍",barvee:"⊽",barwed:"⌅",barwedge:"⌅",bbrk:"⎵",bbrktbrk:"⎶",bcong:"≌",bcy:"б",bdquo:"„",becaus:"∵",because:"∵",bemptyv:"⦰",bepsi:"϶",bernou:"ℬ",beta:"β",beth:"ℶ",between:"≬",bfr:"𝔟",bigcap:"⋂",bigcirc:"◯",bigcup:"⋃",bigodot:"⨀",bigoplus:"⨁",bigotimes:"⨂",bigsqcup:"⨆",bigstar:"★",bigtriangledown:"▽",bigtriangleup:"△",biguplus:"⨄",bigvee:"⋁",bigwedge:"⋀",bkarow:"⤍",blacklozenge:"⧫",blacksquare:"▪",blacktriangle:"▴",blacktriangledown:"▾",blacktriangleleft:"◂",blacktriangleright:"▸",blank:"␣",blk12:"▒",blk14:"░",blk34:"▓",block:"█",bne:"=⃥",bnequiv:"≡⃥",bnot:"⌐",bopf:"𝕓",bot:"⊥",bottom:"⊥",bowtie:"⋈",boxDL:"╗",boxDR:"╔",boxDl:"╖",boxDr:"╓",boxH:"═",boxHD:"╦",boxHU:"╩",boxHd:"╤",boxHu:"╧",boxUL:"╝",boxUR:"╚",boxUl:"╜",boxUr:"╙",boxV:"║",boxVH:"╬",boxVL:"╣",boxVR:"╠",boxVh:"╫",boxVl:"╢",boxVr:"╟",boxbox:"⧉",boxdL:"╕",boxdR:"╒",boxdl:"┐",boxdr:"┌",boxh:"─",boxhD:"╥",boxhU:"╨",boxhd:"┬",boxhu:"┴",boxminus:"⊟",boxplus:"⊞",boxtimes:"⊠",boxuL:"╛",boxuR:"╘",boxul:"┘",boxur:"└",boxv:"│",boxvH:"╪",boxvL:"╡",boxvR:"╞",boxvh:"┼",boxvl:"┤",boxvr:"├",bprime:"‵",breve:"˘",brvbar:"¦",bscr:"𝒷",bsemi:"⁏",bsim:"∽",bsime:"⋍",bsol:"\\",bsolb:"⧅",bsolhsub:"⟈",bull:"•",bullet:"•",bump:"≎",bumpE:"⪮",bumpe:"≏",bumpeq:"≏",cacute:"ć",cap:"∩",capand:"⩄",capbrcup:"⩉",capcap:"⩋",capcup:"⩇",capdot:"⩀",caps:"∩︀",caret:"⁁",caron:"ˇ",ccaps:"⩍",ccaron:"č",ccedil:"ç",ccirc:"ĉ",ccups:"⩌",ccupssm:"⩐",cdot:"ċ",cedil:"¸",cemptyv:"⦲",cent:"¢",centerdot:"·",cfr:"𝔠",chcy:"ч",check:"✓",checkmark:"✓",chi:"χ",cir:"○",cirE:"⧃",circ:"ˆ",circeq:"≗",circlearrowleft:"↺",circlearrowright:"↻",circledR:"®",circledS:"Ⓢ",circledast:"⊛",circledcirc:"⊚",circleddash:"⊝",cire:"≗",cirfnint:"⨐",cirmid:"⫯",cirscir:"⧂",clubs:"♣",clubsuit:"♣",colon:":",colone:"≔",coloneq:"≔",comma:",",commat:"@",comp:"∁",compfn:"∘",complement:"∁",complexes:"ℂ",cong:"≅",congdot:"⩭",conint:"∮",copf:"𝕔",coprod:"∐",copy:"©",copysr:"℗",crarr:"↵",cross:"✗",cscr:"𝒸",csub:"⫏",csube:"⫑",csup:"⫐",csupe:"⫒",ctdot:"⋯",cudarrl:"⤸",cudarrr:"⤵",cuepr:"⋞",cuesc:"⋟",cularr:"↶",cularrp:"⤽",cup:"∪",cupbrcap:"⩈",cupcap:"⩆",cupcup:"⩊",cupdot:"⊍",cupor:"⩅",cups:"∪︀",curarr:"↷",curarrm:"⤼",curlyeqprec:"⋞",curlyeqsucc:"⋟",curlyvee:"⋎",curlywedge:"⋏",curren:"¤",curvearrowleft:"↶",curvearrowright:"↷",cuvee:"⋎",cuwed:"⋏",cwconint:"∲",cwint:"∱",cylcty:"⌭",dArr:"⇓",dHar:"⥥",dagger:"†",daleth:"ℸ",darr:"↓",dash:"‐",dashv:"⊣",dbkarow:"⤏",dblac:"˝",dcaron:"ď",dcy:"д",dd:"ⅆ",ddagger:"‡",ddarr:"⇊",ddotseq:"⩷",deg:"°",delta:"δ",demptyv:"⦱",dfisht:"⥿",dfr:"𝔡",dharl:"⇃",dharr:"⇂",diam:"⋄",diamond:"⋄",diamondsuit:"♦",diams:"♦",die:"¨",digamma:"ϝ",disin:"⋲",div:"÷",divide:"÷",divideontimes:"⋇",divonx:"⋇",djcy:"ђ",dlcorn:"⌞",dlcrop:"⌍",dollar:"$",dopf:"𝕕",dot:"˙",doteq:"≐",doteqdot:"≑",dotminus:"∸",dotplus:"∔",dotsquare:"⊡",doublebarwedge:"⌆",downarrow:"↓",downdownarrows:"⇊",downharpoonleft:"⇃",downharpoonright:"⇂",drbkarow:"⤐",drcorn:"⌟",drcrop:"⌌",dscr:"𝒹",dscy:"ѕ",dsol:"⧶",dstrok:"đ",dtdot:"⋱",dtri:"▿",dtrif:"▾",duarr:"⇵",duhar:"⥯",dwangle:"⦦",dzcy:"џ",dzigrarr:"⟿",eDDot:"⩷",eDot:"≑",eacute:"é",easter:"⩮",ecaron:"ě",ecir:"≖",ecirc:"ê",ecolon:"≕",ecy:"э",edot:"ė",ee:"ⅇ",efDot:"≒",efr:"𝔢",eg:"⪚",egrave:"è",egs:"⪖",egsdot:"⪘",el:"⪙",elinters:"⏧",ell:"ℓ",els:"⪕",elsdot:"⪗",emacr:"ē",empty:"∅",emptyset:"∅",emptyv:"∅",emsp13:" ",emsp14:" ",emsp:" ",eng:"ŋ",ensp:" ",eogon:"ę",eopf:"𝕖",epar:"⋕",eparsl:"⧣",eplus:"⩱",epsi:"ε",epsilon:"ε",epsiv:"ϵ",eqcirc:"≖",eqcolon:"≕",eqsim:"≂",eqslantgtr:"⪖",eqslantless:"⪕",equals:"=",equest:"≟",equiv:"≡",equivDD:"⩸",eqvparsl:"⧥",erDot:"≓",erarr:"⥱",escr:"ℯ",esdot:"≐",esim:"≂",eta:"η",eth:"ð",euml:"ë",euro:"€",excl:"!",exist:"∃",expectation:"ℰ",exponentiale:"ⅇ",fallingdotseq:"≒",fcy:"ф",female:"♀",ffilig:"ﬃ",fflig:"ﬀ",ffllig:"ﬄ",ffr:"𝔣",filig:"ﬁ",fjlig:"fj",flat:"♭",fllig:"ﬂ",fltns:"▱",fnof:"ƒ",fopf:"𝕗",forall:"∀",fork:"⋔",forkv:"⫙",fpartint:"⨍",frac12:"½",frac13:"⅓",frac14:"¼",frac15:"⅕",frac16:"⅙",frac18:"⅛",frac23:"⅔",frac25:"⅖",frac34:"¾",frac35:"⅗",frac38:"⅜",frac45:"⅘",frac56:"⅚",frac58:"⅝",frac78:"⅞",frasl:"⁄",frown:"⌢",fscr:"𝒻",gE:"≧",gEl:"⪌",gacute:"ǵ",gamma:"γ",gammad:"ϝ",gap:"⪆",gbreve:"ğ",gcirc:"ĝ",gcy:"г",gdot:"ġ",ge:"≥",gel:"⋛",geq:"≥",geqq:"≧",geqslant:"⩾",ges:"⩾",gescc:"⪩",gesdot:"⪀",gesdoto:"⪂",gesdotol:"⪄",gesl:"⋛︀",gesles:"⪔",gfr:"𝔤",gg:"≫",ggg:"⋙",gimel:"ℷ",gjcy:"ѓ",gl:"≷",glE:"⪒",gla:"⪥",glj:"⪤",gnE:"≩",gnap:"⪊",gnapprox:"⪊",gne:"⪈",gneq:"⪈",gneqq:"≩",gnsim:"⋧",gopf:"𝕘",grave:"`",gscr:"ℊ",gsim:"≳",gsime:"⪎",gsiml:"⪐",gt:">",gtcc:"⪧",gtcir:"⩺",gtdot:"⋗",gtlPar:"⦕",gtquest:"⩼",gtrapprox:"⪆",gtrarr:"⥸",gtrdot:"⋗",gtreqless:"⋛",gtreqqless:"⪌",gtrless:"≷",gtrsim:"≳",gvertneqq:"≩︀",gvnE:"≩︀",hArr:"⇔",hairsp:" ",half:"½",hamilt:"ℋ",hardcy:"ъ",harr:"↔",harrcir:"⥈",harrw:"↭",hbar:"ℏ",hcirc:"ĥ",hearts:"♥",heartsuit:"♥",hellip:"…",hercon:"⊹",hfr:"𝔥",hksearow:"⤥",hkswarow:"⤦",hoarr:"⇿",homtht:"∻",hookleftarrow:"↩",hookrightarrow:"↪",hopf:"𝕙",horbar:"―",hscr:"𝒽",hslash:"ℏ",hstrok:"ħ",hybull:"⁃",hyphen:"‐",iacute:"í",ic:"⁣",icirc:"î",icy:"и",iecy:"е",iexcl:"¡",iff:"⇔",ifr:"𝔦",igrave:"ì",ii:"ⅈ",iiiint:"⨌",iiint:"∭",iinfin:"⧜",iiota:"℩",ijlig:"ĳ",imacr:"ī",image:"ℑ",imagline:"ℐ",imagpart:"ℑ",imath:"ı",imof:"⊷",imped:"Ƶ",in:"∈",incare:"℅",infin:"∞",infintie:"⧝",inodot:"ı",int:"∫",intcal:"⊺",integers:"ℤ",intercal:"⊺",intlarhk:"⨗",intprod:"⨼",iocy:"ё",iogon:"į",iopf:"𝕚",iota:"ι",iprod:"⨼",iquest:"¿",iscr:"𝒾",isin:"∈",isinE:"⋹",isindot:"⋵",isins:"⋴",isinsv:"⋳",isinv:"∈",it:"⁢",itilde:"ĩ",iukcy:"і",iuml:"ï",jcirc:"ĵ",jcy:"й",jfr:"𝔧",jmath:"ȷ",jopf:"𝕛",jscr:"𝒿",jsercy:"ј",jukcy:"є",kappa:"κ",kappav:"ϰ",kcedil:"ķ",kcy:"к",kfr:"𝔨",kgreen:"ĸ",khcy:"х",kjcy:"ќ",kopf:"𝕜",kscr:"𝓀",lAarr:"⇚",lArr:"⇐",lAtail:"⤛",lBarr:"⤎",lE:"≦",lEg:"⪋",lHar:"⥢",lacute:"ĺ",laemptyv:"⦴",lagran:"ℒ",lambda:"λ",lang:"⟨",langd:"⦑",langle:"⟨",lap:"⪅",laquo:"«",larr:"←",larrb:"⇤",larrbfs:"⤟",larrfs:"⤝",larrhk:"↩",larrlp:"↫",larrpl:"⤹",larrsim:"⥳",larrtl:"↢",lat:"⪫",latail:"⤙",late:"⪭",lates:"⪭︀",lbarr:"⤌",lbbrk:"❲",lbrace:"{",lbrack:"[",lbrke:"⦋",lbrksld:"⦏",lbrkslu:"⦍",lcaron:"ľ",lcedil:"ļ",lceil:"⌈",lcub:"{",lcy:"л",ldca:"⤶",ldquo:"“",ldquor:"„",ldrdhar:"⥧",ldrushar:"⥋",ldsh:"↲",le:"≤",leftarrow:"←",leftarrowtail:"↢",leftharpoondown:"↽",leftharpoonup:"↼",leftleftarrows:"⇇",leftrightarrow:"↔",leftrightarrows:"⇆",leftrightharpoons:"⇋",leftrightsquigarrow:"↭",leftthreetimes:"⋋",leg:"⋚",leq:"≤",leqq:"≦",leqslant:"⩽",les:"⩽",lescc:"⪨",lesdot:"⩿",lesdoto:"⪁",lesdotor:"⪃",lesg:"⋚︀",lesges:"⪓",lessapprox:"⪅",lessdot:"⋖",lesseqgtr:"⋚",lesseqqgtr:"⪋",lessgtr:"≶",lesssim:"≲",lfisht:"⥼",lfloor:"⌊",lfr:"𝔩",lg:"≶",lgE:"⪑",lhard:"↽",lharu:"↼",lharul:"⥪",lhblk:"▄",ljcy:"љ",ll:"≪",llarr:"⇇",llcorner:"⌞",llhard:"⥫",lltri:"◺",lmidot:"ŀ",lmoust:"⎰",lmoustache:"⎰",lnE:"≨",lnap:"⪉",lnapprox:"⪉",lne:"⪇",lneq:"⪇",lneqq:"≨",lnsim:"⋦",loang:"⟬",loarr:"⇽",lobrk:"⟦",longleftarrow:"⟵",longleftrightarrow:"⟷",longmapsto:"⟼",longrightarrow:"⟶",looparrowleft:"↫",looparrowright:"↬",lopar:"⦅",lopf:"𝕝",loplus:"⨭",lotimes:"⨴",lowast:"∗",lowbar:"_",loz:"◊",lozenge:"◊",lozf:"⧫",lpar:"(",lparlt:"⦓",lrarr:"⇆",lrcorner:"⌟",lrhar:"⇋",lrhard:"⥭",lrm:"‎",lrtri:"⊿",lsaquo:"‹",lscr:"𝓁",lsh:"↰",lsim:"≲",lsime:"⪍",lsimg:"⪏",lsqb:"[",lsquo:"‘",lsquor:"‚",lstrok:"ł",lt:"<",ltcc:"⪦",ltcir:"⩹",ltdot:"⋖",lthree:"⋋",ltimes:"⋉",ltlarr:"⥶",ltquest:"⩻",ltrPar:"⦖",ltri:"◃",ltrie:"⊴",ltrif:"◂",lurdshar:"⥊",luruhar:"⥦",lvertneqq:"≨︀",lvnE:"≨︀",mDDot:"∺",macr:"¯",male:"♂",malt:"✠",maltese:"✠",map:"↦",mapsto:"↦",mapstodown:"↧",mapstoleft:"↤",mapstoup:"↥",marker:"▮",mcomma:"⨩",mcy:"м",mdash:"—",measuredangle:"∡",mfr:"𝔪",mho:"℧",micro:"µ",mid:"∣",midast:"*",midcir:"⫰",middot:"·",minus:"−",minusb:"⊟",minusd:"∸",minusdu:"⨪",mlcp:"⫛",mldr:"…",mnplus:"∓",models:"⊧",mopf:"𝕞",mp:"∓",mscr:"𝓂",mstpos:"∾",mu:"μ",multimap:"⊸",mumap:"⊸",nGg:"⋙̸",nGt:"≫⃒",nGtv:"≫̸",nLeftarrow:"⇍",nLeftrightarrow:"⇎",nLl:"⋘̸",nLt:"≪⃒",nLtv:"≪̸",nRightarrow:"⇏",nVDash:"⊯",nVdash:"⊮",nabla:"∇",nacute:"ń",nang:"∠⃒",nap:"≉",napE:"⩰̸",napid:"≋̸",napos:"ŉ",napprox:"≉",natur:"♮",natural:"♮",naturals:"ℕ",nbsp:" ",nbump:"≎̸",nbumpe:"≏̸",ncap:"⩃",ncaron:"ň",ncedil:"ņ",ncong:"≇",ncongdot:"⩭̸",ncup:"⩂",ncy:"н",ndash:"–",ne:"≠",neArr:"⇗",nearhk:"⤤",nearr:"↗",nearrow:"↗",nedot:"≐̸",nequiv:"≢",nesear:"⤨",nesim:"≂̸",nexist:"∄",nexists:"∄",nfr:"𝔫",ngE:"≧̸",nge:"≱",ngeq:"≱",ngeqq:"≧̸",ngeqslant:"⩾̸",nges:"⩾̸",ngsim:"≵",ngt:"≯",ngtr:"≯",nhArr:"⇎",nharr:"↮",nhpar:"⫲",ni:"∋",nis:"⋼",nisd:"⋺",niv:"∋",njcy:"њ",nlArr:"⇍",nlE:"≦̸",nlarr:"↚",nldr:"‥",nle:"≰",nleftarrow:"↚",nleftrightarrow:"↮",nleq:"≰",nleqq:"≦̸",nleqslant:"⩽̸",nles:"⩽̸",nless:"≮",nlsim:"≴",nlt:"≮",nltri:"⋪",nltrie:"⋬",nmid:"∤",nopf:"𝕟",not:"¬",notin:"∉",notinE:"⋹̸",notindot:"⋵̸",notinva:"∉",notinvb:"⋷",notinvc:"⋶",notni:"∌",notniva:"∌",notnivb:"⋾",notnivc:"⋽",npar:"∦",nparallel:"∦",nparsl:"⫽⃥",npart:"∂̸",npolint:"⨔",npr:"⊀",nprcue:"⋠",npre:"⪯̸",nprec:"⊀",npreceq:"⪯̸",nrArr:"⇏",nrarr:"↛",nrarrc:"⤳̸",nrarrw:"↝̸",nrightarrow:"↛",nrtri:"⋫",nrtrie:"⋭",nsc:"⊁",nsccue:"⋡",nsce:"⪰̸",nscr:"𝓃",nshortmid:"∤",nshortparallel:"∦",nsim:"≁",nsime:"≄",nsimeq:"≄",nsmid:"∤",nspar:"∦",nsqsube:"⋢",nsqsupe:"⋣",nsub:"⊄",nsubE:"⫅̸",nsube:"⊈",nsubset:"⊂⃒",nsubseteq:"⊈",nsubseteqq:"⫅̸",nsucc:"⊁",nsucceq:"⪰̸",nsup:"⊅",nsupE:"⫆̸",nsupe:"⊉",nsupset:"⊃⃒",nsupseteq:"⊉",nsupseteqq:"⫆̸",ntgl:"≹",ntilde:"ñ",ntlg:"≸",ntriangleleft:"⋪",ntrianglelefteq:"⋬",ntriangleright:"⋫",ntrianglerighteq:"⋭",nu:"ν",num:"#",numero:"№",numsp:" ",nvDash:"⊭",nvHarr:"⤄",nvap:"≍⃒",nvdash:"⊬",nvge:"≥⃒",nvgt:">⃒",nvinfin:"⧞",nvlArr:"⤂",nvle:"≤⃒",nvlt:"<⃒",nvltrie:"⊴⃒",nvrArr:"⤃",nvrtrie:"⊵⃒",nvsim:"∼⃒",nwArr:"⇖",nwarhk:"⤣",nwarr:"↖",nwarrow:"↖",nwnear:"⤧",oS:"Ⓢ",oacute:"ó",oast:"⊛",ocir:"⊚",ocirc:"ô",ocy:"о",odash:"⊝",odblac:"ő",odiv:"⨸",odot:"⊙",odsold:"⦼",oelig:"œ",ofcir:"⦿",ofr:"𝔬",ogon:"˛",ograve:"ò",ogt:"⧁",ohbar:"⦵",ohm:"Ω",oint:"∮",olarr:"↺",olcir:"⦾",olcross:"⦻",oline:"‾",olt:"⧀",omacr:"ō",omega:"ω",omicron:"ο",omid:"⦶",ominus:"⊖",oopf:"𝕠",opar:"⦷",operp:"⦹",oplus:"⊕",or:"∨",orarr:"↻",ord:"⩝",order:"ℴ",orderof:"ℴ",ordf:"ª",ordm:"º",origof:"⊶",oror:"⩖",orslope:"⩗",orv:"⩛",oscr:"ℴ",oslash:"ø",osol:"⊘",otilde:"õ",otimes:"⊗",otimesas:"⨶",ouml:"ö",ovbar:"⌽",par:"∥",para:"¶",parallel:"∥",parsim:"⫳",parsl:"⫽",part:"∂",pcy:"п",percnt:"%",period:".",permil:"‰",perp:"⊥",pertenk:"‱",pfr:"𝔭",phi:"φ",phiv:"ϕ",phmmat:"ℳ",phone:"☎",pi:"π",pitchfork:"⋔",piv:"ϖ",planck:"ℏ",planckh:"ℎ",plankv:"ℏ",plus:"+",plusacir:"⨣",plusb:"⊞",pluscir:"⨢",plusdo:"∔",plusdu:"⨥",pluse:"⩲",plusmn:"±",plussim:"⨦",plustwo:"⨧",pm:"±",pointint:"⨕",popf:"𝕡",pound:"£",pr:"≺",prE:"⪳",prap:"⪷",prcue:"≼",pre:"⪯",prec:"≺",precapprox:"⪷",preccurlyeq:"≼",preceq:"⪯",precnapprox:"⪹",precneqq:"⪵",precnsim:"⋨",precsim:"≾",prime:"′",primes:"ℙ",prnE:"⪵",prnap:"⪹",prnsim:"⋨",prod:"∏",profalar:"⌮",profline:"⌒",profsurf:"⌓",prop:"∝",propto:"∝",prsim:"≾",prurel:"⊰",pscr:"𝓅",psi:"ψ",puncsp:" ",qfr:"𝔮",qint:"⨌",qopf:"𝕢",qprime:"⁗",qscr:"𝓆",quaternions:"ℍ",quatint:"⨖",quest:"?",questeq:"≟",quot:'"',rAarr:"⇛",rArr:"⇒",rAtail:"⤜",rBarr:"⤏",rHar:"⥤",race:"∽̱",racute:"ŕ",radic:"√",raemptyv:"⦳",rang:"⟩",rangd:"⦒",range:"⦥",rangle:"⟩",raquo:"»",rarr:"→",rarrap:"⥵",rarrb:"⇥",rarrbfs:"⤠",rarrc:"⤳",rarrfs:"⤞",rarrhk:"↪",rarrlp:"↬",rarrpl:"⥅",rarrsim:"⥴",rarrtl:"↣",rarrw:"↝",ratail:"⤚",ratio:"∶",rationals:"ℚ",rbarr:"⤍",rbbrk:"❳",rbrace:"}",rbrack:"]",rbrke:"⦌",rbrksld:"⦎",rbrkslu:"⦐",rcaron:"ř",rcedil:"ŗ",rceil:"⌉",rcub:"}",rcy:"р",rdca:"⤷",rdldhar:"⥩",rdquo:"”",rdquor:"”",rdsh:"↳",real:"ℜ",realine:"ℛ",realpart:"ℜ",reals:"ℝ",rect:"▭",reg:"®",rfisht:"⥽",rfloor:"⌋",rfr:"𝔯",rhard:"⇁",rharu:"⇀",rharul:"⥬",rho:"ρ",rhov:"ϱ",rightarrow:"→",rightarrowtail:"↣",rightharpoondown:"⇁",rightharpoonup:"⇀",rightleftarrows:"⇄",rightleftharpoons:"⇌",rightrightarrows:"⇉",rightsquigarrow:"↝",rightthreetimes:"⋌",ring:"˚",risingdotseq:"≓",rlarr:"⇄",rlhar:"⇌",rlm:"‏",rmoust:"⎱",rmoustache:"⎱",rnmid:"⫮",roang:"⟭",roarr:"⇾",robrk:"⟧",ropar:"⦆",ropf:"𝕣",roplus:"⨮",rotimes:"⨵",rpar:")",rpargt:"⦔",rppolint:"⨒",rrarr:"⇉",rsaquo:"›",rscr:"𝓇",rsh:"↱",rsqb:"]",rsquo:"’",rsquor:"’",rthree:"⋌",rtimes:"⋊",rtri:"▹",rtrie:"⊵",rtrif:"▸",rtriltri:"⧎",ruluhar:"⥨",rx:"℞",sacute:"ś",sbquo:"‚",sc:"≻",scE:"⪴",scap:"⪸",scaron:"š",sccue:"≽",sce:"⪰",scedil:"ş",scirc:"ŝ",scnE:"⪶",scnap:"⪺",scnsim:"⋩",scpolint:"⨓",scsim:"≿",scy:"с",sdot:"⋅",sdotb:"⊡",sdote:"⩦",seArr:"⇘",searhk:"⤥",searr:"↘",searrow:"↘",sect:"§",semi:";",seswar:"⤩",setminus:"∖",setmn:"∖",sext:"✶",sfr:"𝔰",sfrown:"⌢",sharp:"♯",shchcy:"щ",shcy:"ш",shortmid:"∣",shortparallel:"∥",shy:"­",sigma:"σ",sigmaf:"ς",sigmav:"ς",sim:"∼",simdot:"⩪",sime:"≃",simeq:"≃",simg:"⪞",simgE:"⪠",siml:"⪝",simlE:"⪟",simne:"≆",simplus:"⨤",simrarr:"⥲",slarr:"←",smallsetminus:"∖",smashp:"⨳",smeparsl:"⧤",smid:"∣",smile:"⌣",smt:"⪪",smte:"⪬",smtes:"⪬︀",softcy:"ь",sol:"/",solb:"⧄",solbar:"⌿",sopf:"𝕤",spades:"♠",spadesuit:"♠",spar:"∥",sqcap:"⊓",sqcaps:"⊓︀",sqcup:"⊔",sqcups:"⊔︀",sqsub:"⊏",sqsube:"⊑",sqsubset:"⊏",sqsubseteq:"⊑",sqsup:"⊐",sqsupe:"⊒",sqsupset:"⊐",sqsupseteq:"⊒",squ:"□",square:"□",squarf:"▪",squf:"▪",srarr:"→",sscr:"𝓈",ssetmn:"∖",ssmile:"⌣",sstarf:"⋆",star:"☆",starf:"★",straightepsilon:"ϵ",straightphi:"ϕ",strns:"¯",sub:"⊂",subE:"⫅",subdot:"⪽",sube:"⊆",subedot:"⫃",submult:"⫁",subnE:"⫋",subne:"⊊",subplus:"⪿",subrarr:"⥹",subset:"⊂",subseteq:"⊆",subseteqq:"⫅",subsetneq:"⊊",subsetneqq:"⫋",subsim:"⫇",subsub:"⫕",subsup:"⫓",succ:"≻",succapprox:"⪸",succcurlyeq:"≽",succeq:"⪰",succnapprox:"⪺",succneqq:"⪶",succnsim:"⋩",succsim:"≿",sum:"∑",sung:"♪",sup1:"¹",sup2:"²",sup3:"³",sup:"⊃",supE:"⫆",supdot:"⪾",supdsub:"⫘",supe:"⊇",supedot:"⫄",suphsol:"⟉",suphsub:"⫗",suplarr:"⥻",supmult:"⫂",supnE:"⫌",supne:"⊋",supplus:"⫀",supset:"⊃",supseteq:"⊇",supseteqq:"⫆",supsetneq:"⊋",supsetneqq:"⫌",supsim:"⫈",supsub:"⫔",supsup:"⫖",swArr:"⇙",swarhk:"⤦",swarr:"↙",swarrow:"↙",swnwar:"⤪",szlig:"ß",target:"⌖",tau:"τ",tbrk:"⎴",tcaron:"ť",tcedil:"ţ",tcy:"т",tdot:"⃛",telrec:"⌕",tfr:"𝔱",there4:"∴",therefore:"∴",theta:"θ",thetasym:"ϑ",thetav:"ϑ",thickapprox:"≈",thicksim:"∼",thinsp:" ",thkap:"≈",thksim:"∼",thorn:"þ",tilde:"˜",times:"×",timesb:"⊠",timesbar:"⨱",timesd:"⨰",tint:"∭",toea:"⤨",top:"⊤",topbot:"⌶",topcir:"⫱",topf:"𝕥",topfork:"⫚",tosa:"⤩",tprime:"‴",trade:"™",triangle:"▵",triangledown:"▿",triangleleft:"◃",trianglelefteq:"⊴",triangleq:"≜",triangleright:"▹",trianglerighteq:"⊵",tridot:"◬",trie:"≜",triminus:"⨺",triplus:"⨹",trisb:"⧍",tritime:"⨻",trpezium:"⏢",tscr:"𝓉",tscy:"ц",tshcy:"ћ",tstrok:"ŧ",twixt:"≬",twoheadleftarrow:"↞",twoheadrightarrow:"↠",uArr:"⇑",uHar:"⥣",uacute:"ú",uarr:"↑",ubrcy:"ў",ubreve:"ŭ",ucirc:"û",ucy:"у",udarr:"⇅",udblac:"ű",udhar:"⥮",ufisht:"⥾",ufr:"𝔲",ugrave:"ù",uharl:"↿",uharr:"↾",uhblk:"▀",ulcorn:"⌜",ulcorner:"⌜",ulcrop:"⌏",ultri:"◸",umacr:"ū",uml:"¨",uogon:"ų",uopf:"𝕦",uparrow:"↑",updownarrow:"↕",upharpoonleft:"↿",upharpoonright:"↾",uplus:"⊎",upsi:"υ",upsih:"ϒ",upsilon:"υ",upuparrows:"⇈",urcorn:"⌝",urcorner:"⌝",urcrop:"⌎",uring:"ů",urtri:"◹",uscr:"𝓊",utdot:"⋰",utilde:"ũ",utri:"▵",utrif:"▴",uuarr:"⇈",uuml:"ü",uwangle:"⦧",vArr:"⇕",vBar:"⫨",vBarv:"⫩",vDash:"⊨",vangrt:"⦜",varepsilon:"ϵ",varkappa:"ϰ",varnothing:"∅",varphi:"ϕ",varpi:"ϖ",varpropto:"∝",varr:"↕",varrho:"ϱ",varsigma:"ς",varsubsetneq:"⊊︀",varsubsetneqq:"⫋︀",varsupsetneq:"⊋︀",varsupsetneqq:"⫌︀",vartheta:"ϑ",vartriangleleft:"⊲",vartriangleright:"⊳",vcy:"в",vdash:"⊢",vee:"∨",veebar:"⊻",veeeq:"≚",vellip:"⋮",verbar:"|",vert:"|",vfr:"𝔳",vltri:"⊲",vnsub:"⊂⃒",vnsup:"⊃⃒",vopf:"𝕧",vprop:"∝",vrtri:"⊳",vscr:"𝓋",vsubnE:"⫋︀",vsubne:"⊊︀",vsupnE:"⫌︀",vsupne:"⊋︀",vzigzag:"⦚",wcirc:"ŵ",wedbar:"⩟",wedge:"∧",wedgeq:"≙",weierp:"℘",wfr:"𝔴",wopf:"𝕨",wp:"℘",wr:"≀",wreath:"≀",wscr:"𝓌",xcap:"⋂",xcirc:"◯",xcup:"⋃",xdtri:"▽",xfr:"𝔵",xhArr:"⟺",xharr:"⟷",xi:"ξ",xlArr:"⟸",xlarr:"⟵",xmap:"⟼",xnis:"⋻",xodot:"⨀",xopf:"𝕩",xoplus:"⨁",xotime:"⨂",xrArr:"⟹",xrarr:"⟶",xscr:"𝓍",xsqcup:"⨆",xuplus:"⨄",xutri:"△",xvee:"⋁",xwedge:"⋀",yacute:"ý",yacy:"я",ycirc:"ŷ",ycy:"ы",yen:"¥",yfr:"𝔶",yicy:"ї",yopf:"𝕪",yscr:"𝓎",yucy:"ю",yuml:"ÿ",zacute:"ź",zcaron:"ž",zcy:"з",zdot:"ż",zeetrf:"ℨ",zeta:"ζ",zfr:"𝔷",zhcy:"ж",zigrarr:"⇝",zopf:"𝕫",zscr:"𝓏",zwj:"‍",zwnj:"‌"},J={0:65533,128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};function M(e){return e.replace(/&(?:[a-zA-Z]+|#[xX][\da-fA-F]+|#\d+);/g,(e=>{if("#"===e.charAt(1)){const t=e.charAt(2);return function(e){if(e>=55296&&e<=57343||e>1114111)return"�";e in J&&(e=J[e]);return String.fromCodePoint(e)}("X"===t||"x"===t?parseInt(e.slice(3),16):parseInt(e.slice(2),10))}return H[e.slice(1,-1)]||e}))}function z(e,t){return e.startPos=e.tokenPos=e.index,e.startColumn=e.colPos=e.column,e.startLine=e.linePos=e.line,e.token=8192&k[e.currentChar]?function(e,t){const n=e.currentChar;let r=l(e);const s=e.index;for(;r!==n;)e.index>=e.end&&o(e,14),r=l(e);r!==n&&o(e,14);e.tokenValue=e.source.slice(s,e.index),l(e),512&t&&(e.tokenRaw=e.source.slice(e.tokenPos,e.index));return 134283267}(e,t):F(e,t,0),e.token}function X(e,t){if(e.startPos=e.tokenPos=e.index,e.startColumn=e.colPos=e.column,e.startLine=e.linePos=e.line,e.index>=e.end)return e.token=1048576;switch(G[e.source.charCodeAt(e.index)]){case 8456258:l(e),47===e.currentChar?(l(e),e.token=25):e.token=8456258;break;case 2162700:l(e),e.token=2162700;break;default:{let n=0;for(;e.index<e.end;){const t=k[e.source.charCodeAt(e.index)];if(1024&t?(n|=5,d(e)):2048&t?(u(e,n),n=-5&n|1):l(e),16384&k[e.currentChar])break}const o=e.source.slice(e.tokenPos,e.index);512&t&&(e.tokenRaw=o),e.tokenValue=M(o),e.token=138}}return e.token}function _(e){if(143360==(143360&e.token)){const{index:t}=e;let n=e.currentChar;for(;32770&k[n];)n=l(e);e.tokenValue+=e.source.slice(t,e.index)}return e.token=208897,e.token}function $(e,t,n){0!=(1&e.flags)||1048576==(1048576&e.token)||n||o(e,28,T[255&e.token]),W(e,t,1074790417)}function Y(e,t,n,o){return t-n<13&&"use strict"===o&&(1048576==(1048576&e.token)||1&e.flags)?1:0}function Z(e,t,n){return e.token!==n?0:(j(e,t),1)}function W(e,t,n){return e.token===n&&(j(e,t),!0)}function K(e,t,n){e.token!==n&&o(e,23,T[255&n]),j(e,t)}function Q(e,t){switch(t.type){case"ArrayExpression":t.type="ArrayPattern";const n=t.elements;for(let t=0,o=n.length;t<o;++t){const o=n[t];o&&Q(e,o)}return;case"ObjectExpression":t.type="ObjectPattern";const r=t.properties;for(let t=0,n=r.length;t<n;++t)Q(e,r[t]);return;case"AssignmentExpression":return t.type="AssignmentPattern","="!==t.operator&&o(e,69),delete t.operator,void Q(e,t.left);case"Property":return void Q(e,t.value);case"SpreadElement":t.type="RestElement",Q(e,t.argument)}}function ee(e,t,n,r,s){1024&t&&(36864==(36864&r)&&o(e,115),s||537079808!=(537079808&r)||o(e,116)),20480==(20480&r)&&o(e,100),24&n&&241739===r&&o(e,98),4196352&t&&209008===r&&o(e,96),2098176&t&&241773===r&&o(e,95,"yield")}function te(e,t,n){1024&t&&(36864==(36864&n)&&o(e,115),537079808==(537079808&n)&&o(e,116),122===n&&o(e,93),121===n&&o(e,93)),20480==(20480&n)&&o(e,100),4196352&t&&209008===n&&o(e,96),2098176&t&&241773===n&&o(e,95,"yield")}function ne(e,t,n){return 209008===n&&(4196352&t&&o(e,96),e.destructible|=128),241773===n&&2097152&t&&o(e,95,"yield"),20480==(20480&n)||36864==(36864&n)||122==n}function oe(e,t,n,r){for(;t;){if(t["$"+n])return r&&o(e,134),1;r&&t.loop&&(r=0),t=t.$}return 0}function re(e,t,n,o,r,s){return 2&t&&(s.start=n,s.end=e.startPos,s.range=[n,e.startPos]),4&t&&(s.loc={start:{line:o,column:r},end:{line:e.startLine,column:e.startColumn}},e.sourceFile&&(s.loc.source=e.sourceFile)),s}function se(e){switch(e.type){case"JSXIdentifier":return e.name;case"JSXNamespacedName":return e.namespace+":"+e.name;case"JSXMemberExpression":return se(e.object)+"."+se(e.property)}}function ae(e,t,n){const o=le({parent:void 0,type:2},1024);return ue(e,t,o,n,1,0),o}function ie(e,t,...n){const{index:o,line:r,column:s}=e;return{type:t,params:n,index:o,line:r,column:s}}function le(e,t){return{parent:e,type:t,scopeError:void 0}}function ce(e,t,n,o,r,s){4&r?de(e,t,n,o,r):ue(e,t,n,o,r,s),64&s&&pe(e,o)}function ue(e,t,n,r,s,a){const i=n["#"+r];i&&0==(2&i)&&(1&s?n.scopeError=ie(e,141,r):256&t&&64&i&&2&a||o(e,141,r)),128&n.type&&n.parent["#"+r]&&0==(2&n.parent["#"+r])&&o(e,141,r),1024&n.type&&i&&0==(2&i)&&1&s&&(n.scopeError=ie(e,141,r)),64&n.type&&768&n.parent["#"+r]&&o(e,154,r),n["#"+r]=s}function de(e,t,n,r,s){let a=n;for(;a&&0==(256&a.type);){const i=a["#"+r];248&i&&(256&t&&0==(1024&t)&&(128&s&&68&i||128&i&&68&s)||o(e,141,r)),a===n&&1&i&&1&s&&(a.scopeError=ie(e,141,r)),768&i&&(0==(512&i)||0==(256&t)||1024&t)&&o(e,141,r),a["#"+r]=s,a=a.parent}}function pe(e,t){void 0!==e.exportedNames&&""!==t&&(e.exportedNames["#"+t]&&o(e,142,t),e.exportedNames["#"+t]=1)}function fe(e,t){void 0!==e.exportedBindings&&""!==t&&(e.exportedBindings["#"+t]=1)}function ke(e,t){return 2098176&e?!(2048&e&&209008===t)&&(!(2097152&e&&241773===t)&&(143360==(143360&t)||12288==(12288&t))):143360==(143360&t)||12288==(12288&t)||36864==(36864&t)}function ge(e,t,n,r){537079808==(537079808&n)&&(1024&t&&o(e,116),r&&(e.flags|=512)),ke(t,n)||o(e,0)}function me(e,t,n){let r,s,a="";null!=t&&(t.module&&(n|=3072),t.next&&(n|=1),t.loc&&(n|=4),t.ranges&&(n|=2),t.uniqueKeyInPattern&&(n|=-2147483648),t.lexical&&(n|=64),t.webcompat&&(n|=256),t.directives&&(n|=520),t.globalReturn&&(n|=32),t.raw&&(n|=512),t.preserveParens&&(n|=128),t.impliedStrict&&(n|=1024),t.jsx&&(n|=16),t.identifierPattern&&(n|=268435456),t.specDeviation&&(n|=536870912),t.source&&(a=t.source),null!=t.onComment&&(r=Array.isArray(t.onComment)?function(e,t){return function(n,o,r,s,a){const i={type:n,value:o};2&e&&(i.start=r,i.end=s,i.range=[r,s]),4&e&&(i.loc=a),t.push(i)}}(n,t.onComment):t.onComment),null!=t.onToken&&(s=Array.isArray(t.onToken)?function(e,t){return function(n,o,r,s){const a={token:n};2&e&&(a.start=o,a.end=r,a.range=[o,r]),4&e&&(a.loc=s),t.push(a)}}(n,t.onToken):t.onToken));const i=function(e,t,n,o){return{source:e,flags:0,index:0,line:1,column:0,startPos:0,end:e.length,tokenPos:0,startColumn:0,colPos:0,linePos:1,startLine:1,sourceFile:t,tokenValue:"",token:1048576,tokenRaw:"",tokenRegExp:void 0,currentChar:e.charCodeAt(0),exportedNames:[],exportedBindings:[],assignable:1,destructible:0,onComment:n,onToken:o,leadingDecorators:[]}}(e,a,r,s);1&n&&function(e){const t=e.source;35===e.currentChar&&33===t.charCodeAt(e.index+1)&&(l(e),l(e),x(e,t,0,4,e.tokenPos,e.linePos,e.colPos))}(i);const c=64&n?{parent:void 0,type:2}:void 0;let u=[],d="script";if(2048&n){if(d="module",u=function(e,t,n){j(e,32768|t);const o=[];if(8&t)for(;134283267===e.token;){const{tokenPos:n,linePos:r,colPos:s,token:a}=e;o.push(qe(e,t,ot(e,t),a,n,r,s))}for(;1048576!==e.token;)o.push(be(e,t,n));return o}(i,8192|n,c),c)for(const e in i.exportedBindings)"#"!==e[0]||c[e]||o(i,143,e.slice(1))}else u=function(e,t,n){j(e,1073774592|t);const o=[];for(;134283267===e.token;){const{index:n,tokenPos:r,tokenValue:s,linePos:a,colPos:i,token:l}=e,c=ot(e,t);Y(e,n,r,s)&&(t|=1024),o.push(qe(e,t,c,l,r,a,i))}for(;1048576!==e.token;)o.push(he(e,t,n,4,{}));return o}(i,8192|n,c);const p={type:"Program",sourceType:d,body:u};return 2&n&&(p.start=0,p.end=e.length,p.range=[0,e.length]),4&n&&(p.loc={start:{line:1,column:0},end:{line:i.line,column:i.column}},i.sourceFile&&(p.loc.source=a)),p}function be(e,t,n){let r;switch(e.leadingDecorators=xt(e,t),e.token){case 20566:r=function(e,t,n){const r=e.tokenPos,s=e.linePos,a=e.colPos;j(e,32768|t);const i=[];let l,c=null,u=null;if(W(e,32768|t,20563)){switch(e.token){case 86106:c=rt(e,t,n,4,1,1,0,e.tokenPos,e.linePos,e.colPos);break;case 133:case 86096:c=yt(e,t,n,1,e.tokenPos,e.linePos,e.colPos);break;case 209007:const{tokenPos:o,linePos:r,colPos:s}=e;c=nt(e,t,0);const{flags:a}=e;0==(1&a)&&(86106===e.token?c=rt(e,t,n,4,1,1,1,o,r,s):67174411===e.token?(c=Pt(e,t,c,1,1,0,a,o,r,s),c=ze(e,t,c,0,0,o,r,s),c=Ge(e,t,0,0,o,r,s,c)):143360&e.token&&(n&&(n=ae(e,t,e.tokenValue)),c=nt(e,t,0),c=gt(e,t,n,[c],1,o,r,s)));break;default:c=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos),$(e,32768|t)}return n&&pe(e,"default"),re(e,t,r,s,a,{type:"ExportDefaultDeclaration",declaration:c})}switch(e.token){case 8457014:{j(e,t);let i=null;return W(e,t,77934)&&(n&&pe(e,e.tokenValue),i=nt(e,t,0)),K(e,t,12404),134283267!==e.token&&o(e,103,"Export"),u=ot(e,t),$(e,32768|t),re(e,t,r,s,a,{type:"ExportAllDeclaration",source:u,exported:i})}case 2162700:{j(e,t);const r=[],s=[];for(;143360&e.token;){const{tokenPos:a,tokenValue:l,linePos:c,colPos:u}=e,d=nt(e,t,0);let p;77934===e.token?(j(e,t),134217728==(134217728&e.token)&&o(e,104),n&&(r.push(e.tokenValue),s.push(l)),p=nt(e,t,0)):(n&&(r.push(e.tokenValue),s.push(e.tokenValue)),p=d),i.push(re(e,t,a,c,u,{type:"ExportSpecifier",local:d,exported:p})),1074790415!==e.token&&K(e,t,18)}if(K(e,t,1074790415),W(e,t,12404))134283267!==e.token&&o(e,103,"Export"),u=ot(e,t);else if(n){let t=0,n=r.length;for(;t<n;t++)pe(e,r[t]);for(t=0,n=s.length;t<n;t++)fe(e,s[t])}$(e,32768|t);break}case 86096:c=yt(e,t,n,2,e.tokenPos,e.linePos,e.colPos);break;case 86106:c=rt(e,t,n,4,1,2,0,e.tokenPos,e.linePos,e.colPos);break;case 241739:c=Ae(e,t,n,8,64,e.tokenPos,e.linePos,e.colPos);break;case 86092:c=Ae(e,t,n,16,64,e.tokenPos,e.linePos,e.colPos);break;case 86090:c=Se(e,t,n,64,e.tokenPos,e.linePos,e.colPos);break;case 209007:const{tokenPos:d,linePos:p,colPos:f}=e;if(j(e,t),0==(1&e.flags)&&86106===e.token){c=rt(e,t,n,4,1,2,1,d,p,f),n&&(l=c.id?c.id.name:"",pe(e,l));break}default:o(e,28,T[255&e.token])}return re(e,t,r,s,a,{type:"ExportNamedDeclaration",declaration:c,specifiers:i,source:u})}(e,t,n);break;case 86108:r=function(e,t,n){const r=e.tokenPos,s=e.linePos,a=e.colPos;j(e,t);let i=null;const{tokenPos:l,linePos:c,colPos:u}=e;let d=[];if(134283267===e.token)i=ot(e,t);else{if(143360&e.token){if(d=[re(e,t,l,c,u,{type:"ImportDefaultSpecifier",local:Ve(e,t,n)})],W(e,t,18))switch(e.token){case 8457014:d.push(Te(e,t,n));break;case 2162700:Re(e,t,n,d);break;default:o(e,105)}}else switch(e.token){case 8457014:d=[Te(e,t,n)];break;case 2162700:Re(e,t,n,d);break;case 67174411:return Ie(e,t,r,s,a);case 67108877:return Ne(e,t,r,s,a);default:o(e,28,T[255&e.token])}i=function(e,t){W(e,t,12404),134283267!==e.token&&o(e,103,"Import");return ot(e,t)}(e,t)}return $(e,32768|t),re(e,t,r,s,a,{type:"ImportDeclaration",specifiers:d,source:i})}(e,t,n);break;default:r=he(e,t,n,4,{})}return e.leadingDecorators.length&&o(e,165),r}function he(e,t,n,r,s){const a=e.tokenPos,i=e.linePos,l=e.colPos;switch(e.token){case 86106:return rt(e,t,n,r,1,0,0,a,i,l);case 133:case 86096:return yt(e,t,n,0,a,i,l);case 86092:return Ae(e,t,n,16,0,a,i,l);case 241739:return function(e,t,n,r,s,a,i){const{token:l,tokenValue:c}=e;let u=nt(e,t,0);if(2240512&e.token){const o=De(e,t,n,8,0);return $(e,32768|t),re(e,t,s,a,i,{type:"VariableDeclaration",kind:"let",declarations:o})}e.assignable=1,1024&t&&o(e,83);if(21===e.token)return ve(e,t,n,r,{},c,u,l,0,s,a,i);if(10===e.token){let n;64&t&&(n=ae(e,t,c)),e.flags=128^(128|e.flags),u=gt(e,t,n,[u],0,s,a,i)}else u=ze(e,t,u,0,0,s,a,i),u=Ge(e,t,0,0,s,a,i,u);18===e.token&&(u=Be(e,t,0,s,a,i,u));return xe(e,t,u,s,a,i)}(e,t,n,r,a,i,l);case 20566:o(e,101,"export");case 86108:switch(j(e,t),e.token){case 67174411:return Ie(e,t,a,i,l);case 67108877:return Ne(e,t,a,i,l);default:o(e,101,"import")}case 209007:return we(e,t,n,r,s,1,a,i,l);default:return Pe(e,t,n,r,s,1,a,i,l)}}function Pe(e,t,n,r,s,a,i,l,c){switch(e.token){case 86090:return Se(e,t,n,0,i,l,c);case 20574:return function(e,t,n,r,s){0==(32&t)&&8192&t&&o(e,90);j(e,32768|t);const a=1&e.flags||1048576&e.token?null:Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);return $(e,32768|t),re(e,t,n,r,s,{type:"ReturnStatement",argument:a})}(e,t,i,l,c);case 20571:return function(e,t,n,o,r,s,a){j(e,t),K(e,32768|t,67174411),e.assignable=1;const i=Oe(e,t,0,1,e.tokenPos,e.line,e.colPos);K(e,32768|t,16);const l=Ce(e,t,n,o,e.tokenPos,e.linePos,e.colPos);let c=null;20565===e.token&&(j(e,32768|t),c=Ce(e,t,n,o,e.tokenPos,e.linePos,e.colPos));return re(e,t,r,s,a,{type:"IfStatement",test:i,consequent:l,alternate:c})}(e,t,n,s,i,l,c);case 20569:return function(e,t,n,r,s,a,i){j(e,t);const l=((4194304&t)>0||(2048&t)>0&&(8192&t)>0)&&W(e,t,209008);K(e,32768|t,67174411),n&&(n=le(n,1));let c,u=null,d=null,p=0,f=null,k=86090===e.token||241739===e.token||86092===e.token;const{token:g,tokenPos:m,linePos:b,colPos:h}=e;k?241739===g?(f=nt(e,t,0),2240512&e.token?(8738868===e.token?1024&t&&o(e,65):f=re(e,t,m,b,h,{type:"VariableDeclaration",kind:"let",declarations:De(e,134217728|t,n,8,32)}),e.assignable=1):1024&t?o(e,65):(k=!1,e.assignable=1,f=ze(e,t,f,0,0,m,b,h),274549===e.token&&o(e,112))):(j(e,t),f=re(e,t,m,b,h,86090===g?{type:"VariableDeclaration",kind:"var",declarations:De(e,134217728|t,n,4,32)}:{type:"VariableDeclaration",kind:"const",declarations:De(e,134217728|t,n,16,32)}),e.assignable=1):1074790417===g?l&&o(e,80):2097152==(2097152&g)?(f=2162700===g?ut(e,t,void 0,1,0,0,2,32,m,b,h):at(e,t,void 0,1,0,0,2,32,m,b,h),p=e.destructible,256&t&&64&p&&o(e,61),e.assignable=16&p?2:1,f=ze(e,134217728|t,f,0,0,e.tokenPos,e.linePos,e.colPos)):f=Me(e,134217728|t,1,0,1,m,b,h);if(262144==(262144&e.token)){if(274549===e.token){2&e.assignable&&o(e,78,l?"await":"of"),Q(e,f),j(e,32768|t),c=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos),K(e,32768|t,16);return re(e,t,s,a,i,{type:"ForOfStatement",left:f,right:c,body:Ee(e,t,n,r),await:l})}2&e.assignable&&o(e,78,"in"),Q(e,f),j(e,32768|t),l&&o(e,80),c=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos),K(e,32768|t,16);return re(e,t,s,a,i,{type:"ForInStatement",body:Ee(e,t,n,r),left:f,right:c})}l&&o(e,80);k||(8&p&&1077936157!==e.token&&o(e,78,"loop"),f=Ge(e,134217728|t,0,0,m,b,h,f));18===e.token&&(f=Be(e,t,0,e.tokenPos,e.linePos,e.colPos,f));K(e,32768|t,1074790417),1074790417!==e.token&&(u=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos));K(e,32768|t,1074790417),16!==e.token&&(d=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos));K(e,32768|t,16);const P=Ee(e,t,n,r);return re(e,t,s,a,i,{type:"ForStatement",init:f,test:u,update:d,body:P})}(e,t,n,s,i,l,c);case 20564:return function(e,t,n,o,r,s,a){j(e,32768|t);const i=Ee(e,t,n,o);K(e,t,20580),K(e,32768|t,67174411);const l=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);return K(e,32768|t,16),W(e,t,1074790417),re(e,t,r,s,a,{type:"DoWhileStatement",body:i,test:l})}(e,t,n,s,i,l,c);case 20580:return function(e,t,n,o,r,s,a){j(e,t),K(e,32768|t,67174411);const i=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);K(e,32768|t,16);const l=Ee(e,t,n,o);return re(e,t,r,s,a,{type:"WhileStatement",test:i,body:l})}(e,t,n,s,i,l,c);case 86112:return function(e,t,n,r,s,a,i){j(e,t),K(e,32768|t,67174411);const l=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);K(e,t,16),K(e,t,2162700);const c=[];let u=0;n&&(n=le(n,8));for(;1074790415!==e.token;){const{tokenPos:s,linePos:a,colPos:i}=e;let l=null;const d=[];for(W(e,32768|t,20558)?l=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos):(K(e,32768|t,20563),u&&o(e,87),u=1),K(e,32768|t,21);20558!==e.token&&1074790415!==e.token&&20563!==e.token;)d.push(he(e,4096|t,n,2,{$:r}));c.push(re(e,t,s,a,i,{type:"SwitchCase",test:l,consequent:d}))}return K(e,32768|t,1074790415),re(e,t,s,a,i,{type:"SwitchStatement",discriminant:l,cases:c})}(e,t,n,s,i,l,c);case 1074790417:return function(e,t,n,o,r){return j(e,32768|t),re(e,t,n,o,r,{type:"EmptyStatement"})}(e,t,i,l,c);case 2162700:return ye(e,t,n?le(n,2):n,s,i,l,c);case 86114:return function(e,t,n,r,s){j(e,32768|t),1&e.flags&&o(e,88);const a=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);return $(e,32768|t),re(e,t,n,r,s,{type:"ThrowStatement",argument:a})}(e,t,i,l,c);case 20557:return function(e,t,n,r,s,a){j(e,32768|t);let i=null;if(0==(1&e.flags)&&143360&e.token){const{tokenValue:r}=e;i=nt(e,32768|t,0),oe(e,n,r,0)||o(e,135,r)}else 0==(135168&t)&&o(e,67);return $(e,32768|t),re(e,t,r,s,a,{type:"BreakStatement",label:i})}(e,t,s,i,l,c);case 20561:return function(e,t,n,r,s,a){0==(131072&t)&&o(e,66);j(e,t);let i=null;if(0==(1&e.flags)&&143360&e.token){const{tokenValue:r}=e;i=nt(e,32768|t,0),oe(e,n,r,1)||o(e,135,r)}return $(e,32768|t),re(e,t,r,s,a,{type:"ContinueStatement",label:i})}(e,t,s,i,l,c);case 20579:return function(e,t,n,r,s,a,i){j(e,32768|t);const l=n?le(n,32):void 0,c=ye(e,t,l,{$:r},e.tokenPos,e.linePos,e.colPos),{tokenPos:u,linePos:d,colPos:p}=e,f=W(e,32768|t,20559)?function(e,t,n,r,s,a,i){let l=null,c=n;W(e,t,67174411)&&(n&&(n=le(n,4)),l=At(e,t,n,2097152==(2097152&e.token)?256:512,0,e.tokenPos,e.linePos,e.colPos),18===e.token?o(e,84):1077936157===e.token&&o(e,85),K(e,32768|t,16),n&&(c=le(n,64)));const u=ye(e,t,c,{$:r},e.tokenPos,e.linePos,e.colPos);return re(e,t,s,a,i,{type:"CatchClause",param:l,body:u})}(e,t,n,r,u,d,p):null;let k=null;if(20568===e.token){j(e,32768|t);k=ye(e,t,l?le(n,4):void 0,{$:r},e.tokenPos,e.linePos,e.colPos)}f||k||o(e,86);return re(e,t,s,a,i,{type:"TryStatement",block:c,handler:f,finalizer:k})}(e,t,n,s,i,l,c);case 20581:return function(e,t,n,r,s,a,i){j(e,t),1024&t&&o(e,89);K(e,32768|t,67174411);const l=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);K(e,32768|t,16);const c=Pe(e,t,n,2,r,0,e.tokenPos,e.linePos,e.colPos);return re(e,t,s,a,i,{type:"WithStatement",object:l,body:c})}(e,t,n,s,i,l,c);case 20562:return function(e,t,n,o,r){return j(e,32768|t),$(e,32768|t),re(e,t,n,o,r,{type:"DebuggerStatement"})}(e,t,i,l,c);case 209007:return we(e,t,n,r,s,0,i,l,c);case 20559:o(e,157);case 20568:o(e,158);case 86106:o(e,1024&t?74:0==(256&t)?76:75);case 86096:o(e,77);default:return function(e,t,n,r,s,a,i,l,c){const{tokenValue:u,token:d}=e;let p;if(241739===d)p=nt(e,t,0),1024&t&&o(e,83),69271571===e.token&&o(e,82);else p=_e(e,t,2,0,1,0,0,1,e.tokenPos,e.linePos,e.colPos);if(143360&d&&21===e.token)return ve(e,t,n,r,s,u,p,d,a,i,l,c);p=ze(e,t,p,0,0,i,l,c),p=Ge(e,t,0,0,i,l,c,p),18===e.token&&(p=Be(e,t,0,i,l,c,p));return xe(e,t,p,i,l,c)}(e,t,n,r,s,a,i,l,c)}}function ye(e,t,n,o,r,s,a){const i=[];for(K(e,32768|t,2162700);1074790415!==e.token;)i.push(he(e,t,n,2,{$:o}));return K(e,32768|t,1074790415),re(e,t,r,s,a,{type:"BlockStatement",body:i})}function xe(e,t,n,o,r,s){return $(e,32768|t),re(e,t,o,r,s,{type:"ExpressionStatement",expression:n})}function ve(e,t,n,r,s,a,i,l,c,u,d,p){ee(e,t,0,l,1),function(e,t,n){let r=t;for(;r;)r["$"+n]&&o(e,133,n),r=r.$;t["$"+n]=1}(e,s,a),j(e,32768|t);return re(e,t,u,d,p,{type:"LabeledStatement",label:i,body:c&&0==(1024&t)&&256&t&&86106===e.token?rt(e,t,le(n,2),r,0,0,0,e.tokenPos,e.linePos,e.colPos):Pe(e,t,n,r,s,c,e.tokenPos,e.linePos,e.colPos)})}function we(e,t,n,r,s,a,i,l,c){const{token:u,tokenValue:d}=e;let p=nt(e,t,0);if(21===e.token)return ve(e,t,n,r,s,d,p,u,1,i,l,c);const f=1&e.flags;if(!f){if(86106===e.token)return a||o(e,120),rt(e,t,n,r,1,0,1,i,l,c);if(143360==(143360&e.token))return p=ht(e,t,1,i,l,c),18===e.token&&(p=Be(e,t,0,i,l,c,p)),xe(e,t,p,i,l,c)}return 67174411===e.token?p=Pt(e,t,p,1,1,0,f,i,l,c):(10===e.token&&(ge(e,t,u,1),p=ft(e,t,e.tokenValue,p,0,1,0,i,l,c)),e.assignable=1),p=ze(e,t,p,0,0,i,l,c),18===e.token&&(p=Be(e,t,0,i,l,c,p)),p=Ge(e,t,0,0,i,l,c,p),e.assignable=1,xe(e,t,p,i,l,c)}function qe(e,t,n,o,r,s,a){return 1074790417!==o&&(e.assignable=2,n=ze(e,t,n,0,0,r,s,a),1074790417!==e.token&&(n=Ge(e,t,0,0,r,s,a,n),18===e.token&&(n=Be(e,t,0,r,s,a,n))),$(e,32768|t)),8&t&&"Literal"===n.type&&"string"==typeof n.value?re(e,t,r,s,a,{type:"ExpressionStatement",expression:n,directive:n.raw.slice(1,-1)}):re(e,t,r,s,a,{type:"ExpressionStatement",expression:n})}function Ce(e,t,n,o,r,s,a){return 1024&t||0==(256&t)||86106!==e.token?Pe(e,t,n,0,{$:o},0,e.tokenPos,e.linePos,e.colPos):rt(e,t,le(n,2),0,0,0,0,r,s,a)}function Ee(e,t,n,o){return Pe(e,134217728^(134217728|t)|131072,n,0,{loop:1,$:o},0,e.tokenPos,e.linePos,e.colPos)}function Ae(e,t,n,o,r,s,a,i){j(e,t);const l=De(e,t,n,o,r);return $(e,32768|t),re(e,t,s,a,i,{type:"VariableDeclaration",kind:8&o?"let":"const",declarations:l})}function Se(e,t,n,o,r,s,a){j(e,t);const i=De(e,t,n,4,o);return $(e,32768|t),re(e,t,r,s,a,{type:"VariableDeclaration",kind:"var",declarations:i})}function De(e,t,n,r,s){let a=1;const i=[Le(e,t,n,r,s)];for(;W(e,t,18);)a++,i.push(Le(e,t,n,r,s));return a>1&&32&s&&262144&e.token&&o(e,59,T[255&e.token]),i}function Le(e,t,n,r,a){const{token:i,tokenPos:l,linePos:c,colPos:u}=e;let d=null;const p=At(e,t,n,r,a,l,c,u);return 1077936157===e.token?(j(e,32768|t),d=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos),(32&a||0==(2097152&i))&&(274549===e.token||8738868===e.token&&(2097152&i||0==(4&r)||1024&t))&&s(l,e.line,e.index-3,58,274549===e.token?"of":"in")):(16&r||(2097152&i)>0)&&262144!=(262144&e.token)&&o(e,57,16&r?"const":"destructuring"),re(e,t,l,c,u,{type:"VariableDeclarator",id:p,init:d})}function Ve(e,t,n){return ke(t,e.token)||o(e,115),537079808==(537079808&e.token)&&o(e,116),n&&ue(e,t,n,e.tokenValue,8,0),nt(e,t,0)}function Te(e,t,n){const{tokenPos:o,linePos:r,colPos:a}=e;return j(e,t),K(e,t,77934),134217728==(134217728&e.token)&&s(o,e.line,e.index,28,T[255&e.token]),re(e,t,o,r,a,{type:"ImportNamespaceSpecifier",local:Ve(e,t,n)})}function Re(e,t,n,r){for(j(e,t);143360&e.token;){let{token:s,tokenValue:a,tokenPos:i,linePos:l,colPos:c}=e;const u=nt(e,t,0);let d;W(e,t,77934)?(134217728==(134217728&e.token)||18===e.token?o(e,104):ee(e,t,16,e.token,0),a=e.tokenValue,d=nt(e,t,0)):(ee(e,t,16,s,0),d=u),n&&ue(e,t,n,a,8,0),r.push(re(e,t,i,l,c,{type:"ImportSpecifier",local:d,imported:u})),1074790415!==e.token&&K(e,t,18)}return K(e,t,1074790415),r}function Ne(e,t,n,o,r){let s=$e(e,t,re(e,t,n,o,r,{type:"Identifier",name:"import"}),n,o,r);return s=ze(e,t,s,0,0,n,o,r),s=Ge(e,t,0,0,n,o,r,s),xe(e,t,s,n,o,r)}function Ie(e,t,n,o,r){let s=Ye(e,t,0,n,o,r);return s=ze(e,t,s,0,0,n,o,r),18===e.token&&(s=Be(e,t,0,n,o,r,s)),xe(e,t,s,n,o,r)}function Ue(e,t,n,o,r,s,a,i){let l=_e(e,t,2,0,n,o,r,1,s,a,i);return l=ze(e,t,l,r,0,s,a,i),Ge(e,t,r,0,s,a,i,l)}function Be(e,t,n,o,r,s,a){const i=[a];for(;W(e,32768|t,18);)i.push(Ue(e,t,1,0,n,e.tokenPos,e.linePos,e.colPos));return re(e,t,o,r,s,{type:"SequenceExpression",expressions:i})}function Oe(e,t,n,o,r,s,a){const i=Ue(e,t,o,0,n,r,s,a);return 18===e.token?Be(e,t,n,r,s,a,i):i}function Ge(e,t,n,r,s,a,i,l){const{token:c}=e;if(4194304==(4194304&c)){2&e.assignable&&o(e,24),(!r&&1077936157===c&&"ArrayExpression"===l.type||"ObjectExpression"===l.type)&&Q(e,l),j(e,32768|t);const u=Ue(e,t,1,1,n,e.tokenPos,e.linePos,e.colPos);return e.assignable=2,re(e,t,s,a,i,r?{type:"AssignmentPattern",left:l,right:u}:{type:"AssignmentExpression",left:l,operator:T[255&c],right:u})}return 8454144==(8454144&c)&&(l=He(e,t,n,s,a,i,4,c,l)),W(e,32768|t,22)&&(l=Fe(e,t,l,s,a,i)),l}function je(e,t,n,o,r,s,a,i){const{token:l}=e;j(e,32768|t);const c=Ue(e,t,1,1,n,e.tokenPos,e.linePos,e.colPos);return i=re(e,t,r,s,a,o?{type:"AssignmentPattern",left:i,right:c}:{type:"AssignmentExpression",left:i,operator:T[255&l],right:c}),e.assignable=2,i}function Fe(e,t,n,o,r,s){const a=Ue(e,134217728^(134217728|t),1,0,0,e.tokenPos,e.linePos,e.colPos);K(e,32768|t,21),e.assignable=1;const i=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);return e.assignable=2,re(e,t,o,r,s,{type:"ConditionalExpression",test:n,consequent:a,alternate:i})}function He(e,t,n,r,s,a,i,l,c){const u=8738868&-((134217728&t)>0);let d,p;for(e.assignable=2;8454144&e.token&&(d=e.token,p=3840&d,(524288&d&&268435456&l||524288&l&&268435456&d)&&o(e,160),!(p+((8457273===d)<<8)-((u===d)<<12)<=i));)j(e,32768|t),c=re(e,t,r,s,a,{type:524288&d||268435456&d?"LogicalExpression":"BinaryExpression",left:c,right:He(e,t,n,e.tokenPos,e.linePos,e.colPos,p,d,Me(e,t,0,n,1,e.tokenPos,e.linePos,e.colPos)),operator:T[255&d]});return 1077936157===e.token&&o(e,24),c}function Je(e,t,n,a,i,l){const{tokenPos:c,linePos:u,colPos:d}=e;K(e,32768|t,2162700);const p=[],f=t;if(1074790415!==e.token){for(;134283267===e.token;){const{index:n,tokenPos:o,tokenValue:r,token:a}=e,i=ot(e,t);Y(e,n,o,r)&&(t|=1024,128&e.flags&&s(e.index,e.line,e.tokenPos,64),64&e.flags&&s(e.index,e.line,e.tokenPos,8)),p.push(qe(e,t,i,a,o,e.linePos,e.colPos))}1024&t&&(i&&(537079808==(537079808&i)&&o(e,116),36864==(36864&i)&&o(e,38)),512&e.flags&&o(e,116),256&e.flags&&o(e,115)),64&t&&n&&void 0!==l&&0==(1024&f)&&0==(8192&t)&&r(l)}for(e.flags=832^(832|e.flags),e.destructible=256^(256|e.destructible);1074790415!==e.token;)p.push(he(e,t,n,4,{}));return K(e,24&a?32768|t:t,1074790415),e.flags&=-193,1077936157===e.token&&o(e,24),re(e,t,c,u,d,{type:"BlockStatement",body:p})}function Me(e,t,n,o,r,s,a,i){return ze(e,t,_e(e,t,2,0,n,0,o,r,s,a,i),o,0,s,a,i)}function ze(e,t,n,r,s,a,i,l){if(33619968==(33619968&e.token)&&0==(1&e.flags))n=function(e,t,n,r,s,a){2&e.assignable&&o(e,53);const{token:i}=e;return j(e,t),e.assignable=2,re(e,t,r,s,a,{type:"UpdateExpression",argument:n,operator:T[255&i],prefix:!1})}(e,t,n,a,i,l);else if(67108864==(67108864&e.token)){switch(t=134217728^(134217728|t),e.token){case 67108877:j(e,8192^(1073750016|t)),e.assignable=1;n=re(e,t,a,i,l,{type:"MemberExpression",object:n,computed:!1,property:Xe(e,t)});break;case 69271571:{let o=!1;2048==(2048&e.flags)&&(o=!0,e.flags=2048^(2048|e.flags)),j(e,32768|t);const{tokenPos:s,linePos:c,colPos:u}=e,d=Oe(e,t,r,1,s,c,u);K(e,t,20),e.assignable=1,n=re(e,t,a,i,l,{type:"MemberExpression",object:n,computed:!0,property:d}),o&&(e.flags|=2048);break}case 67174411:{if(1024==(1024&e.flags))return e.flags=1024^(1024|e.flags),n;let o=!1;2048==(2048&e.flags)&&(o=!0,e.flags=2048^(2048|e.flags));const s=tt(e,t,r);e.assignable=2,n=re(e,t,a,i,l,{type:"CallExpression",callee:n,arguments:s}),o&&(e.flags|=2048);break}case 67108991:j(e,8192^(1073750016|t)),e.flags|=2048,e.assignable=2,n=function(e,t,n,r,s,a){let i,l=!1;69271571!==e.token&&67174411!==e.token||2048==(2048&e.flags)&&(l=!0,e.flags=2048^(2048|e.flags));if(69271571===e.token){j(e,32768|t);const{tokenPos:o,linePos:l,colPos:c}=e,u=Oe(e,t,0,1,o,l,c);K(e,t,20),e.assignable=2,i=re(e,t,r,s,a,{type:"MemberExpression",object:n,computed:!0,optional:!0,property:u})}else if(67174411===e.token){const o=tt(e,t,0);e.assignable=2,i=re(e,t,r,s,a,{type:"CallExpression",callee:n,arguments:o,optional:!0})}else{0==(143360&e.token)&&o(e,155);const l=nt(e,t,0);e.assignable=2,i=re(e,t,r,s,a,{type:"MemberExpression",object:n,computed:!1,optional:!0,property:l})}l&&(e.flags|=2048);return i}(e,t,n,a,i,l);break;default:2048==(2048&e.flags)&&o(e,161),e.assignable=2,n=re(e,t,a,i,l,{type:"TaggedTemplateExpression",tag:n,quasi:67174408===e.token?Ke(e,65536|t):We(e,t,e.tokenPos,e.linePos,e.colPos)})}n=ze(e,t,n,0,1,a,i,l)}return 0===s&&2048==(2048&e.flags)&&(e.flags=2048^(2048|e.flags),n=re(e,t,a,i,l,{type:"ChainExpression",expression:n})),n}function Xe(e,t){return 0==(143360&e.token)&&131!==e.token&&o(e,155),1&t&&131===e.token?Ct(e,t,e.tokenPos,e.linePos,e.colPos):nt(e,t,0)}function _e(e,t,n,r,a,i,l,c,u,d,p){if(143360==(143360&e.token)){switch(e.token){case 209008:return function(e,t,n,r,a,i,l){if(r&&(e.destructible|=128),4194304&t||2048&t&&8192&t){n&&o(e,0),8388608&t&&s(e.index,e.line,e.index,29),j(e,32768|t);const r=Me(e,t,0,0,1,e.tokenPos,e.linePos,e.colPos);return 8457273===e.token&&o(e,31),e.assignable=2,re(e,t,a,i,l,{type:"AwaitExpression",argument:r})}return 2048&t&&o(e,96),pt(e,t,a,i,l)}(e,t,r,l,u,d,p);case 241773:return function(e,t,n,r,s,a,i){if(n&&(e.destructible|=256),2097152&t){j(e,32768|t),8388608&t&&o(e,30),r||o(e,24),22===e.token&&o(e,121);let n=null,l=!1;return 0==(1&e.flags)&&(l=W(e,32768|t,8457014),(77824&e.token||l)&&(n=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos))),e.assignable=2,re(e,t,s,a,i,{type:"YieldExpression",argument:n,delegate:l})}return 1024&t&&o(e,95,"yield"),pt(e,t,s,a,i)}(e,t,l,a,u,d,p);case 209007:return function(e,t,n,r,s,a,i,l,c,u){const{token:d}=e,p=nt(e,t,a),{flags:f}=e;if(0==(1&f)){if(86106===e.token)return st(e,t,1,n,l,c,u);if(143360==(143360&e.token))return r||o(e,0),ht(e,t,s,l,c,u)}return i||67174411!==e.token?10===e.token?(ge(e,t,d,1),i&&o(e,49),ft(e,t,e.tokenValue,p,i,s,0,l,c,u)):p:Pt(e,t,p,s,1,0,f,l,c,u)}(e,t,l,c,a,i,r,u,d,p)}const{token:f,tokenValue:k}=e,g=nt(e,65536|t,i);return 10===e.token?(c||o(e,0),ge(e,t,f,1),ft(e,t,k,g,r,a,0,u,d,p)):(16384&t&&537079928===f&&o(e,127),241739===f&&(1024&t&&o(e,110),24&n&&o(e,98)),e.assignable=1024&t&&537079808==(537079808&f)?2:1,g)}if(134217728==(134217728&e.token))return ot(e,t);switch(e.token){case 33619995:case 33619996:return function(e,t,n,r,s,a,i){n&&o(e,54),r||o(e,0);const{token:l}=e;j(e,32768|t);const c=Me(e,t,0,0,1,e.tokenPos,e.linePos,e.colPos);return 2&e.assignable&&o(e,53),e.assignable=2,re(e,t,s,a,i,{type:"UpdateExpression",argument:c,operator:T[255&l],prefix:!0})}(e,t,r,c,u,d,p);case 16863278:case 16842800:case 16842801:case 25233970:case 25233971:case 16863277:case 16863279:return function(e,t,n,r,s,a,i){n||o(e,0);const l=e.token;j(e,32768|t);const c=Me(e,t,0,i,1,e.tokenPos,e.linePos,e.colPos);var u;return 8457273===e.token&&o(e,31),1024&t&&16863278===l&&("Identifier"===c.type?o(e,118):(u=c).property&&"PrivateIdentifier"===u.property.type&&o(e,124)),e.assignable=2,re(e,t,r,s,a,{type:"UnaryExpression",operator:T[255&l],argument:c,prefix:!0})}(e,t,c,u,d,p,l);case 86106:return st(e,t,0,l,u,d,p);case 2162700:return function(e,t,n,r,s,a,i){const l=ut(e,t,void 0,n,r,0,2,0,s,a,i);256&t&&64&e.destructible&&o(e,61);8&e.destructible&&o(e,60);return l}(e,t,a?0:1,l,u,d,p);case 69271571:return function(e,t,n,r,s,a,i){const l=at(e,t,void 0,n,r,0,2,0,s,a,i);256&t&&64&e.destructible&&o(e,61);8&e.destructible&&o(e,60);return l}(e,t,a?0:1,l,u,d,p);case 67174411:return function(e,t,n,r,s,a,i,l){e.flags=128^(128|e.flags);const{tokenPos:c,linePos:u,colPos:d}=e;j(e,1073774592|t);const p=64&t?le({parent:void 0,type:2},1024):void 0;if(W(e,t=134217728^(134217728|t),16))return kt(e,t,p,[],n,0,a,i,l);let f,k=0;e.destructible&=-385;let g=[],m=0,b=0;const{tokenPos:h,linePos:P,colPos:y}=e;e.assignable=1;for(;16!==e.token;){const{token:n,tokenPos:a,linePos:i,colPos:l}=e;if(143360&n)p&&ue(e,t,p,e.tokenValue,1,0),f=_e(e,t,r,0,1,0,1,1,a,i,l),16===e.token||18===e.token?2&e.assignable?(k|=16,b=1):537079808!=(537079808&n)&&36864!=(36864&n)||(b=1):(1077936157===e.token?b=1:k|=16,f=ze(e,t,f,1,0,a,i,l),16!==e.token&&18!==e.token&&(f=Ge(e,t,1,0,a,i,l,f)));else{if(2097152!=(2097152&n)){if(14===n){f=lt(e,t,p,16,r,s,0,1,0,a,i,l),16&e.destructible&&o(e,72),b=1,!m||16!==e.token&&18!==e.token||g.push(f),k|=8;break}if(k|=16,f=Ue(e,t,1,0,1,a,i,l),!m||16!==e.token&&18!==e.token||g.push(f),18===e.token&&(m||(m=1,g=[f])),m){for(;W(e,32768|t,18);)g.push(Ue(e,t,1,0,1,e.tokenPos,e.linePos,e.colPos));e.assignable=2,f=re(e,t,h,P,y,{type:"SequenceExpression",expressions:g})}return K(e,t,16),e.destructible=k,f}f=2162700===n?ut(e,1073741824|t,p,0,1,0,r,s,a,i,l):at(e,1073741824|t,p,0,1,0,r,s,a,i,l),k|=e.destructible,b=1,e.assignable=2,16!==e.token&&18!==e.token&&(8&k&&o(e,119),f=ze(e,t,f,0,0,a,i,l),k|=16,16!==e.token&&18!==e.token&&(f=Ge(e,t,0,0,a,i,l,f)))}if(!m||16!==e.token&&18!==e.token||g.push(f),!W(e,32768|t,18))break;if(m||(m=1,g=[f]),16===e.token){k|=8;break}}m&&(e.assignable=2,f=re(e,t,h,P,y,{type:"SequenceExpression",expressions:g}));K(e,t,16),16&k&&8&k&&o(e,146);if(k|=256&e.destructible?256:0|128&e.destructible?128:0,10===e.token)return 48&k&&o(e,47),4196352&t&&128&k&&o(e,29),2098176&t&&256&k&&o(e,30),b&&(e.flags|=128),kt(e,t,p,m?g:[f],n,0,a,i,l);8&k&&o(e,140);return e.destructible=256^(256|e.destructible)|k,128&t?re(e,t,c,u,d,{type:"ParenthesizedExpression",expression:f}):f}(e,t,a,1,0,u,d,p);case 86021:case 86022:case 86023:return function(e,t,n,o,r){const s=T[255&e.token],a=86023===e.token?null:"true"===s;return j(e,t),e.assignable=2,re(e,t,n,o,r,512&t?{type:"Literal",value:a,raw:s}:{type:"Literal",value:a})}(e,t,u,d,p);case 86113:return function(e,t){const{tokenPos:n,linePos:o,colPos:r}=e;return j(e,t),e.assignable=2,re(e,t,n,o,r,{type:"ThisExpression"})}(e,t);case 65540:return function(e,t,n,o,r){const{tokenRaw:s,tokenRegExp:a,tokenValue:i}=e;return j(e,t),e.assignable=2,re(e,t,n,o,r,512&t?{type:"Literal",value:i,regex:a,raw:s}:{type:"Literal",value:i,regex:a})}(e,t,u,d,p);case 133:case 86096:return function(e,t,n,r,s,a){let i=null,l=null;const c=xt(e,t=16777216^(16778240|t));c.length&&(r=e.tokenPos,s=e.linePos,a=e.colPos);j(e,t),4096&e.token&&20567!==e.token&&(ne(e,t,e.token)&&o(e,115),537079808==(537079808&e.token)&&o(e,116),i=nt(e,t,0));let u=t;W(e,32768|t,20567)?(l=Me(e,t,0,n,0,e.tokenPos,e.linePos,e.colPos),u|=524288):u=524288^(524288|u);const d=wt(e,u,t,void 0,2,0,n);return e.assignable=2,re(e,t,r,s,a,1&t?{type:"ClassExpression",id:i,superClass:l,decorators:c,body:d}:{type:"ClassExpression",id:i,superClass:l,body:d})}(e,t,l,u,d,p);case 86111:return function(e,t,n,r,s){switch(j(e,t),e.token){case 67108991:o(e,162);case 67174411:0==(524288&t)&&o(e,26),16384&t&&o(e,27),e.assignable=2;break;case 69271571:case 67108877:0==(262144&t)&&o(e,27),16384&t&&o(e,27),e.assignable=1;break;default:o(e,28,"super")}return re(e,t,n,r,s,{type:"Super"})}(e,t,u,d,p);case 67174409:return We(e,t,u,d,p);case 67174408:return Ke(e,t);case 86109:return function(e,t,n,r,s,a){const i=nt(e,32768|t,0),{tokenPos:l,linePos:c,colPos:u}=e;if(W(e,t,67108877)){if(67108864&t&&143494===e.token)return e.assignable=2,function(e,t,n,o,r,s){const a=nt(e,t,0);return re(e,t,o,r,s,{type:"MetaProperty",meta:n,property:a})}(e,t,i,r,s,a);o(e,92)}e.assignable=2,16842752==(16842752&e.token)&&o(e,63,T[255&e.token]);const d=_e(e,t,2,1,0,0,n,1,l,c,u);t=134217728^(134217728|t),67108991===e.token&&o(e,163);const p=bt(e,t,d,n,l,c,u);return e.assignable=2,re(e,t,r,s,a,{type:"NewExpression",callee:p,arguments:67174411===e.token?tt(e,t,n):[]})}(e,t,l,u,d,p);case 134283389:return Ze(e,t,u,d,p);case 131:return Ct(e,t,u,d,p);case 86108:return function(e,t,n,r,s,a,i){let l=nt(e,t,0);if(67108877===e.token)return $e(e,t,l,s,a,i);n&&o(e,138);return l=Ye(e,t,r,s,a,i),e.assignable=2,ze(e,t,l,r,0,s,a,i)}(e,t,r,l,u,d,p);case 8456258:if(16&t)return Dt(e,t,1,u,d,p);default:if(ke(t,e.token))return pt(e,t,u,d,p);o(e,28,T[255&e.token])}}function $e(e,t,n,r,s,a){return 0==(2048&t)&&o(e,164),j(e,t),143495!==e.token&&"meta"!==e.tokenValue&&o(e,28,T[255&e.token]),e.assignable=2,re(e,t,r,s,a,{type:"MetaProperty",meta:n,property:nt(e,t,0)})}function Ye(e,t,n,r,s,a){K(e,32768|t,67174411),14===e.token&&o(e,139);const i=Ue(e,t,1,0,n,e.tokenPos,e.linePos,e.colPos);return K(e,t,16),re(e,t,r,s,a,{type:"ImportExpression",source:i})}function Ze(e,t,n,o,r){const{tokenRaw:s,tokenValue:a}=e;return j(e,t),e.assignable=2,re(e,t,n,o,r,512&t?{type:"Literal",value:a,bigint:s.slice(0,-1),raw:s}:{type:"Literal",value:a,bigint:s.slice(0,-1)})}function We(e,t,n,o,r){e.assignable=2;const{tokenValue:s,tokenRaw:a,tokenPos:i,linePos:l,colPos:c}=e;K(e,t,67174409);return re(e,t,n,o,r,{type:"TemplateLiteral",expressions:[],quasis:[Qe(e,t,s,a,i,l,c,!0)]})}function Ke(e,t){t=134217728^(134217728|t);const{tokenValue:n,tokenRaw:r,tokenPos:s,linePos:a,colPos:i}=e;K(e,32768|t,67174408);const l=[Qe(e,t,n,r,s,a,i,!1)],c=[Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos)];for(1074790415!==e.token&&o(e,81);67174409!==(e.token=D(e,t));){const{tokenValue:n,tokenRaw:r,tokenPos:s,linePos:a,colPos:i}=e;K(e,32768|t,67174408),l.push(Qe(e,t,n,r,s,a,i,!1)),c.push(Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos)),1074790415!==e.token&&o(e,81)}{const{tokenValue:n,tokenRaw:o,tokenPos:r,linePos:s,colPos:a}=e;K(e,t,67174409),l.push(Qe(e,t,n,o,r,s,a,!0))}return re(e,t,s,a,i,{type:"TemplateLiteral",expressions:c,quasis:l})}function Qe(e,t,n,o,r,s,a,i){const l=re(e,t,r,s,a,{type:"TemplateElement",value:{cooked:n,raw:o},tail:i}),c=i?1:2;return 2&t&&(l.start+=1,l.range[0]+=1,l.end-=c,l.range[1]-=c),4&t&&(l.loc.start.column+=1,l.loc.end.column-=c),l}function et(e,t,n,o,r){K(e,32768|(t=134217728^(134217728|t)),14);const s=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);return e.assignable=1,re(e,t,n,o,r,{type:"SpreadElement",argument:s})}function tt(e,t,n){j(e,32768|t);const o=[];if(16===e.token)return j(e,t),o;for(;16!==e.token&&(14===e.token?o.push(et(e,t,e.tokenPos,e.linePos,e.colPos)):o.push(Ue(e,t,1,0,n,e.tokenPos,e.linePos,e.colPos)),18===e.token)&&(j(e,32768|t),16!==e.token););return K(e,t,16),o}function nt(e,t,n){const{tokenValue:o,tokenPos:r,linePos:s,colPos:a}=e;return j(e,t),re(e,t,r,s,a,268435456&t?{type:"Identifier",name:o,pattern:1===n}:{type:"Identifier",name:o})}function ot(e,t){const{tokenValue:n,tokenRaw:o,tokenPos:r,linePos:s,colPos:a}=e;return 134283389===e.token?Ze(e,t,r,s,a):(j(e,t),e.assignable=2,re(e,t,r,s,a,512&t?{type:"Literal",value:n,raw:o}:{type:"Literal",value:n}))}function rt(e,t,n,r,s,a,i,l,c,u){j(e,32768|t);const d=s?Z(e,t,8457014):0;let p,f=null,k=n?{parent:void 0,type:2}:void 0;if(67174411===e.token)0==(1&a)&&o(e,37,"Function");else{const s=4&r&&(0==(8192&t)||0==(2048&t))?4:64;te(e,t|(3072&t)<<11,e.token),n&&(4&s?de(e,t,n,e.tokenValue,s):ue(e,t,n,e.tokenValue,s,r),k=le(k,256),a&&2&a&&pe(e,e.tokenValue)),p=e.token,143360&e.token?f=nt(e,t,0):o(e,28,T[255&e.token])}t=32243712^(32243712|t)|67108864|2*i+d<<21|(d?0:1073741824),n&&(k=le(k,512));return re(e,t,l,c,u,{type:"FunctionDeclaration",id:f,params:mt(e,8388608|t,k,0,1),body:Je(e,143360^(143360|t),n?le(k,128):k,8,p,n?k.scopeError:void 0),async:1===i,generator:1===d})}function st(e,t,n,o,r,s,a){j(e,32768|t);const i=Z(e,t,8457014),l=2*n+i<<21;let c,u=null,d=64&t?{parent:void 0,type:2}:void 0;(176128&e.token)>0&&(te(e,32243712^(32243712|t)|l,e.token),d&&(d=le(d,256)),c=e.token,u=nt(e,t,0)),t=32243712^(32243712|t)|67108864|l|(i?0:1073741824),d&&(d=le(d,512));const p=mt(e,8388608|t,d,o,1),f=Je(e,-134377473&t,d?le(d,128):d,0,c,void 0);return e.assignable=2,re(e,t,r,s,a,{type:"FunctionExpression",id:u,params:p,body:f,async:1===n,generator:1===i})}function at(e,t,n,r,s,a,i,l,c,u,d){j(e,32768|t);const p=[];let f=0;for(t=134217728^(134217728|t);20!==e.token;)if(W(e,32768|t,18))p.push(null);else{let r;const{token:c,tokenPos:u,linePos:d,colPos:k,tokenValue:g}=e;if(143360&c)if(r=_e(e,t,i,0,1,0,s,1,u,d,k),1077936157===e.token){2&e.assignable&&o(e,24),j(e,32768|t),n&&ce(e,t,n,g,i,l);const c=Ue(e,t,1,1,s,e.tokenPos,e.linePos,e.colPos);r=re(e,t,u,d,k,a?{type:"AssignmentPattern",left:r,right:c}:{type:"AssignmentExpression",operator:"=",left:r,right:c}),f|=256&e.destructible?256:0|128&e.destructible?128:0}else 18===e.token||20===e.token?(2&e.assignable?f|=16:n&&ce(e,t,n,g,i,l),f|=256&e.destructible?256:0|128&e.destructible?128:0):(f|=1&i?32:0==(2&i)?16:0,r=ze(e,t,r,s,0,u,d,k),18!==e.token&&20!==e.token?(1077936157!==e.token&&(f|=16),r=Ge(e,t,s,a,u,d,k,r)):1077936157!==e.token&&(f|=2&e.assignable?16:32));else 2097152&c?(r=2162700===e.token?ut(e,t,n,0,s,a,i,l,u,d,k):at(e,t,n,0,s,a,i,l,u,d,k),f|=e.destructible,e.assignable=16&e.destructible?2:1,18===e.token||20===e.token?2&e.assignable&&(f|=16):8&e.destructible?o(e,69):(r=ze(e,t,r,s,0,u,d,k),f=2&e.assignable?16:0,18!==e.token&&20!==e.token?r=Ge(e,t,s,a,u,d,k,r):1077936157!==e.token&&(f|=2&e.assignable?16:32))):14===c?(r=lt(e,t,n,20,i,l,0,s,a,u,d,k),f|=e.destructible,18!==e.token&&20!==e.token&&o(e,28,T[255&e.token])):(r=Me(e,t,1,0,1,u,d,k),18!==e.token&&20!==e.token?(r=Ge(e,t,s,a,u,d,k,r),0==(3&i)&&67174411===c&&(f|=16)):2&e.assignable?f|=16:67174411===c&&(f|=1&e.assignable&&3&i?32:16));if(p.push(r),!W(e,32768|t,18))break;if(20===e.token)break}K(e,t,20);const k=re(e,t,c,u,d,{type:a?"ArrayPattern":"ArrayExpression",elements:p});return!r&&4194304&e.token?it(e,t,f,s,a,c,u,d,k):(e.destructible=f,k)}function it(e,t,n,r,s,a,i,l,c){1077936157!==e.token&&o(e,24),j(e,32768|t),16&n&&o(e,24),s||Q(e,c);const{tokenPos:u,linePos:d,colPos:p}=e,f=Ue(e,t,1,1,r,u,d,p);return e.destructible=72^(72|n)|(128&e.destructible?128:0)|(256&e.destructible?256:0),re(e,t,a,i,l,s?{type:"AssignmentPattern",left:c,right:f}:{type:"AssignmentExpression",left:c,operator:"=",right:f})}function lt(e,t,n,r,s,a,i,l,c,u,d,p){j(e,32768|t);let f=null,k=0,{token:g,tokenValue:m,tokenPos:b,linePos:h,colPos:P}=e;if(143360&g)e.assignable=1,f=_e(e,t,s,0,1,0,l,1,b,h,P),g=e.token,f=ze(e,t,f,l,0,b,h,P),18!==e.token&&e.token!==r&&(2&e.assignable&&1077936157===e.token&&o(e,69),k|=16,f=Ge(e,t,l,c,b,h,P,f)),2&e.assignable?k|=16:g===r||18===g?n&&ce(e,t,n,m,s,a):k|=32,k|=128&e.destructible?128:0;else if(g===r)o(e,39);else{if(!(2097152&g)){k|=32,f=Me(e,t,1,l,1,e.tokenPos,e.linePos,e.colPos);const{token:n,tokenPos:s,linePos:a,colPos:i}=e;return 1077936157===n&&n!==r&&18!==n?(2&e.assignable&&o(e,24),f=Ge(e,t,l,c,s,a,i,f),k|=16):(18===n?k|=16:n!==r&&(f=Ge(e,t,l,c,s,a,i,f)),k|=1&e.assignable?32:16),e.destructible=k,e.token!==r&&18!==e.token&&o(e,156),re(e,t,u,d,p,{type:c?"RestElement":"SpreadElement",argument:f})}f=2162700===e.token?ut(e,t,n,1,l,c,s,a,b,h,P):at(e,t,n,1,l,c,s,a,b,h,P),g=e.token,1077936157!==g&&g!==r&&18!==g?(8&e.destructible&&o(e,69),f=ze(e,t,f,l,0,b,h,P),k|=2&e.assignable?16:0,4194304==(4194304&e.token)?(1077936157!==e.token&&(k|=16),f=Ge(e,t,l,c,b,h,P,f)):(8454144==(8454144&e.token)&&(f=He(e,t,1,b,h,P,4,g,f)),W(e,32768|t,22)&&(f=Fe(e,t,f,b,h,P)),k|=2&e.assignable?16:32)):k|=1074790415===r&&1077936157!==g?16:e.destructible}if(e.token!==r)if(1&s&&(k|=i?16:32),W(e,32768|t,1077936157)){16&k&&o(e,24),Q(e,f);const n=Ue(e,t,1,1,l,e.tokenPos,e.linePos,e.colPos);f=re(e,t,b,h,P,c?{type:"AssignmentPattern",left:f,right:n}:{type:"AssignmentExpression",left:f,operator:"=",right:n}),k=16}else k|=16;return e.destructible=k,re(e,t,u,d,p,{type:c?"RestElement":"SpreadElement",argument:f})}function ct(e,t,n,s,a,i,l){const c=0==(64&n)?31981568:14680064;let u=64&(t=(t|c)^c|(88&n)<<18|100925440)?le({parent:void 0,type:2},512):void 0;const d=function(e,t,n,s,a,i){K(e,t,67174411);const l=[];if(e.flags=128^(128|e.flags),16===e.token)return 512&s&&o(e,35,"Setter","one",""),j(e,t),l;256&s&&o(e,35,"Getter","no","s");512&s&&14===e.token&&o(e,36);t=134217728^(134217728|t);let c=0,u=0;for(;18!==e.token;){let r=null;const{tokenPos:d,linePos:p,colPos:f}=e;if(143360&e.token?(0==(1024&t)&&(36864==(36864&e.token)&&(e.flags|=256),537079808==(537079808&e.token)&&(e.flags|=512)),r=St(e,t,n,1|s,0,d,p,f)):(2162700===e.token?r=ut(e,t,n,1,i,1,a,0,d,p,f):69271571===e.token?r=at(e,t,n,1,i,1,a,0,d,p,f):14===e.token&&(r=lt(e,t,n,16,a,0,0,i,1,d,p,f)),u=1,48&e.destructible&&o(e,48)),1077936157===e.token){j(e,32768|t),u=1;r=re(e,t,d,p,f,{type:"AssignmentPattern",left:r,right:Ue(e,t,1,1,0,e.tokenPos,e.linePos,e.colPos)})}if(c++,l.push(r),!W(e,t,18))break;if(16===e.token)break}512&s&&1!==c&&o(e,35,"Setter","one","");n&&void 0!==n.scopeError&&r(n.scopeError);u&&(e.flags|=128);return K(e,t,16),l}(e,8388608|t,u,n,1,s);u&&(u=le(u,128));return re(e,t,a,i,l,{type:"FunctionExpression",params:d,body:Je(e,-134230017&t,u,0,void 0,void 0),async:(16&n)>0,generator:(8&n)>0,id:null})}function ut(e,t,n,r,a,i,l,c,u,d,p){j(e,t);const f=[];let k=0,g=0;for(t=134217728^(134217728|t);1074790415!==e.token;){const{token:r,tokenValue:u,linePos:d,colPos:p,tokenPos:m}=e;if(14===r)f.push(lt(e,t,n,1074790415,l,c,0,a,i,m,d,p));else{let b,h=0,P=null;const y=e.token;if(143360&e.token||121===e.token)if(P=nt(e,t,0),18===e.token||1074790415===e.token||1077936157===e.token)if(h|=4,1024&t&&537079808==(537079808&r)?k|=16:ee(e,t,l,r,0),n&&ce(e,t,n,u,l,c),W(e,32768|t,1077936157)){k|=8;const n=Ue(e,t,1,1,a,e.tokenPos,e.linePos,e.colPos);k|=256&e.destructible?256:0|128&e.destructible?128:0,b=re(e,t,m,d,p,{type:"AssignmentPattern",left:-2147483648&t?Object.assign({},P):P,right:n})}else k|=(209008===r?128:0)|(121===r?16:0),b=-2147483648&t?Object.assign({},P):P;else if(W(e,32768|t,21)){const{tokenPos:s,linePos:d,colPos:p}=e;if("__proto__"===u&&g++,143360&e.token){const o=e.token,r=e.tokenValue;k|=121===y?16:0,b=_e(e,t,l,0,1,0,a,1,s,d,p);const{token:u}=e;b=ze(e,t,b,a,0,s,d,p),18===e.token||1074790415===e.token?1077936157===u||1074790415===u||18===u?(k|=128&e.destructible?128:0,2&e.assignable?k|=16:n&&143360==(143360&o)&&ce(e,t,n,r,l,c)):k|=1&e.assignable?32:16:4194304==(4194304&e.token)?(2&e.assignable?k|=16:1077936157!==u?k|=32:n&&ce(e,t,n,r,l,c),b=Ge(e,t,a,i,s,d,p,b)):(k|=16,8454144==(8454144&e.token)&&(b=He(e,t,1,s,d,p,4,u,b)),W(e,32768|t,22)&&(b=Fe(e,t,b,s,d,p)))}else 2097152==(2097152&e.token)?(b=69271571===e.token?at(e,t,n,0,a,i,l,c,s,d,p):ut(e,t,n,0,a,i,l,c,s,d,p),k=e.destructible,e.assignable=16&k?2:1,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):8&e.destructible?o(e,69):(b=ze(e,t,b,a,0,s,d,p),k=2&e.assignable?16:0,4194304==(4194304&e.token)?b=je(e,t,a,i,s,d,p,b):(8454144==(8454144&e.token)&&(b=He(e,t,1,s,d,p,4,r,b)),W(e,32768|t,22)&&(b=Fe(e,t,b,s,d,p)),k|=2&e.assignable?16:32))):(b=Me(e,t,1,a,1,s,d,p),k|=1&e.assignable?32:16,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):(b=ze(e,t,b,a,0,s,d,p),k=2&e.assignable?16:0,18!==e.token&&1074790415!==r&&(1077936157!==e.token&&(k|=16),b=Ge(e,t,a,i,s,d,p,b))))}else 69271571===e.token?(k|=16,209007===r&&(h|=16),h|=2|(12402===r?256:12403===r?512:1),P=dt(e,t,a),k|=e.assignable,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):143360&e.token?(k|=16,121===r&&o(e,93),209007===r&&(1&e.flags&&o(e,129),h|=16),P=nt(e,t,0),h|=12402===r?256:12403===r?512:1,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):67174411===e.token?(k|=16,h|=1,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):8457014===e.token?(k|=16,12402===r?o(e,40):12403===r?o(e,41):143483===r&&o(e,93),j(e,t),h|=9|(209007===r?16:0),143360&e.token?P=nt(e,t,0):134217728==(134217728&e.token)?P=ot(e,t):69271571===e.token?(h|=2,P=dt(e,t,a),k|=e.assignable):o(e,28,T[255&e.token]),b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):134217728==(134217728&e.token)?(209007===r&&(h|=16),h|=12402===r?256:12403===r?512:1,k|=16,P=ot(e,t),b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):o(e,130);else if(134217728==(134217728&e.token))if(P=ot(e,t),21===e.token){K(e,32768|t,21);const{tokenPos:o,linePos:s,colPos:d}=e;if("__proto__"===u&&g++,143360&e.token){b=_e(e,t,l,0,1,0,a,1,o,s,d);const{token:r,tokenValue:u}=e;b=ze(e,t,b,a,0,o,s,d),18===e.token||1074790415===e.token?1077936157===r||1074790415===r||18===r?2&e.assignable?k|=16:n&&ce(e,t,n,u,l,c):k|=1&e.assignable?32:16:1077936157===e.token?(2&e.assignable&&(k|=16),b=Ge(e,t,a,i,o,s,d,b)):(k|=16,b=Ge(e,t,a,i,o,s,d,b))}else 2097152==(2097152&e.token)?(b=69271571===e.token?at(e,t,n,0,a,i,l,c,o,s,d):ut(e,t,n,0,a,i,l,c,o,s,d),k=e.destructible,e.assignable=16&k?2:1,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):8!=(8&e.destructible)&&(b=ze(e,t,b,a,0,o,s,d),k=2&e.assignable?16:0,4194304==(4194304&e.token)?b=je(e,t,a,i,o,s,d,b):(8454144==(8454144&e.token)&&(b=He(e,t,1,o,s,d,4,r,b)),W(e,32768|t,22)&&(b=Fe(e,t,b,o,s,d)),k|=2&e.assignable?16:32))):(b=Me(e,t,1,0,1,o,s,d),k|=1&e.assignable?32:16,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):(b=ze(e,t,b,a,0,o,s,d),k=1&e.assignable?0:16,18!==e.token&&1074790415!==e.token&&(1077936157!==e.token&&(k|=16),b=Ge(e,t,a,i,o,s,d,b))))}else 67174411===e.token?(h|=1,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos),k=16|e.assignable):o(e,131);else if(69271571===e.token)if(P=dt(e,t,a),k|=256&e.destructible?256:0,h|=2,21===e.token){j(e,32768|t);const{tokenPos:s,linePos:u,colPos:d,tokenValue:p,token:f}=e;if(143360&e.token){b=_e(e,t,l,0,1,0,a,1,s,u,d);const{token:o}=e;b=ze(e,t,b,a,0,s,u,d),4194304==(4194304&e.token)?(k|=2&e.assignable?16:1077936157===o?0:32,b=je(e,t,a,i,s,u,d,b)):18===e.token||1074790415===e.token?1077936157===o||1074790415===o||18===o?2&e.assignable?k|=16:n&&143360==(143360&f)&&ce(e,t,n,p,l,c):k|=1&e.assignable?32:16:(k|=16,b=Ge(e,t,a,i,s,u,d,b))}else 2097152==(2097152&e.token)?(b=69271571===e.token?at(e,t,n,0,a,i,l,c,s,u,d):ut(e,t,n,0,a,i,l,c,s,u,d),k=e.destructible,e.assignable=16&k?2:1,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):8&k?o(e,60):(b=ze(e,t,b,a,0,s,u,d),k=2&e.assignable?16|k:0,4194304==(4194304&e.token)?(1077936157!==e.token&&(k|=16),b=je(e,t,a,i,s,u,d,b)):(8454144==(8454144&e.token)&&(b=He(e,t,1,s,u,d,4,r,b)),W(e,32768|t,22)&&(b=Fe(e,t,b,s,u,d)),k|=2&e.assignable?16:32))):(b=Me(e,t,1,0,1,s,u,d),k|=1&e.assignable?32:16,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):(b=ze(e,t,b,a,0,s,u,d),k=1&e.assignable?0:16,18!==e.token&&1074790415!==e.token&&(1077936157!==e.token&&(k|=16),b=Ge(e,t,a,i,s,u,d,b))))}else 67174411===e.token?(h|=1,b=ct(e,t,h,a,e.tokenPos,d,p),k=16):o(e,42);else if(8457014===r)if(K(e,32768|t,8457014),h|=8,143360&e.token){const{token:n,line:o,index:r}=e;P=nt(e,t,0),h|=1,67174411===e.token?(k|=16,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):s(r,o,r,209007===n?44:12402===n||12403===e.token?43:45,T[255&n])}else 134217728==(134217728&e.token)?(k|=16,P=ot(e,t),h|=1,b=ct(e,t,h,a,m,d,p)):69271571===e.token?(k|=16,h|=3,P=dt(e,t,a),b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):o(e,123);else o(e,28,T[255&r]);k|=128&e.destructible?128:0,e.destructible=k,f.push(re(e,t,m,d,p,{type:"Property",key:P,value:b,kind:768&h?512&h?"set":"get":"init",computed:(2&h)>0,method:(1&h)>0,shorthand:(4&h)>0}))}if(k|=e.destructible,18!==e.token)break;j(e,t)}K(e,t,1074790415),g>1&&(k|=64);const m=re(e,t,u,d,p,{type:i?"ObjectPattern":"ObjectExpression",properties:f});return!r&&4194304&e.token?it(e,t,k,a,i,u,d,p,m):(e.destructible=k,m)}function dt(e,t,n){j(e,32768|t);const o=Ue(e,134217728^(134217728|t),1,0,n,e.tokenPos,e.linePos,e.colPos);return K(e,t,20),o}function pt(e,t,n,o,r){const{tokenValue:s}=e,a=nt(e,t,0);if(e.assignable=1,10===e.token){let i;return 64&t&&(i=ae(e,t,s)),e.flags=128^(128|e.flags),gt(e,t,i,[a],0,n,o,r)}return a}function ft(e,t,n,r,s,a,i,l,c,u){a||o(e,55),s&&o(e,49),e.flags&=-129;return gt(e,t,64&t?ae(e,t,n):void 0,[r],i,l,c,u)}function kt(e,t,n,r,s,a,i,l,c){s||o(e,55);for(let t=0;t<r.length;++t)Q(e,r[t]);return gt(e,t,n,r,a,i,l,c)}function gt(e,t,n,s,a,i,l,c){1&e.flags&&o(e,46),K(e,32768|t,10),t=15728640^(15728640|t)|a<<22;const u=2162700!==e.token;let d;if(n&&void 0!==n.scopeError&&r(n.scopeError),u)d=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);else{switch(n&&(n=le(n,128)),d=Je(e,134246400^(134246400|t),n,16,void 0,void 0),e.token){case 69271571:0==(1&e.flags)&&o(e,113);break;case 67108877:case 67174409:case 22:o(e,114);case 67174411:0==(1&e.flags)&&o(e,113),e.flags|=1024}8454144==(8454144&e.token)&&0==(1&e.flags)&&o(e,28,T[255&e.token]),33619968==(33619968&e.token)&&o(e,122)}return e.assignable=2,re(e,t,i,l,c,{type:"ArrowFunctionExpression",params:s,body:d,async:1===a,expression:u})}function mt(e,t,n,s,a){K(e,t,67174411),e.flags=128^(128|e.flags);const i=[];if(W(e,t,16))return i;t=134217728^(134217728|t);let l=0;for(;18!==e.token;){let r;const{tokenPos:c,linePos:u,colPos:d}=e;if(143360&e.token?(0==(1024&t)&&(36864==(36864&e.token)&&(e.flags|=256),537079808==(537079808&e.token)&&(e.flags|=512)),r=St(e,t,n,1|a,0,c,u,d)):(2162700===e.token?r=ut(e,t,n,1,s,1,a,0,c,u,d):69271571===e.token?r=at(e,t,n,1,s,1,a,0,c,u,d):14===e.token?r=lt(e,t,n,16,a,0,0,s,1,c,u,d):o(e,28,T[255&e.token]),l=1,48&e.destructible&&o(e,48)),1077936157===e.token){j(e,32768|t),l=1;r=re(e,t,c,u,d,{type:"AssignmentPattern",left:r,right:Ue(e,t,1,1,s,e.tokenPos,e.linePos,e.colPos)})}if(i.push(r),!W(e,t,18))break;if(16===e.token)break}return l&&(e.flags|=128),n&&(l||1024&t)&&void 0!==n.scopeError&&r(n.scopeError),K(e,t,16),i}function bt(e,t,n,o,r,s,a){const{token:i}=e;if(67108864&i){if(67108877===i){j(e,1073741824|t),e.assignable=1;return bt(e,t,re(e,t,r,s,a,{type:"MemberExpression",object:n,computed:!1,property:Xe(e,t)}),0,r,s,a)}if(69271571===i){j(e,32768|t);const{tokenPos:i,linePos:l,colPos:c}=e,u=Oe(e,t,o,1,i,l,c);return K(e,t,20),e.assignable=1,bt(e,t,re(e,t,r,s,a,{type:"MemberExpression",object:n,computed:!0,property:u}),0,r,s,a)}if(67174408===i||67174409===i)return e.assignable=2,bt(e,t,re(e,t,r,s,a,{type:"TaggedTemplateExpression",tag:n,quasi:67174408===e.token?Ke(e,65536|t):We(e,t,e.tokenPos,e.linePos,e.colPos)}),0,r,s,a)}return n}function ht(e,t,n,r,s,a){return 209008===e.token&&o(e,29),2098176&t&&241773===e.token&&o(e,30),537079808==(537079808&e.token)&&(e.flags|=512),ft(e,t,e.tokenValue,nt(e,t,0),0,n,1,r,s,a)}function Pt(e,t,n,r,s,a,i,l,c,u){j(e,32768|t);const d=64&t?le({parent:void 0,type:2},1024):void 0;if(W(e,t=134217728^(134217728|t),16))return 10===e.token?(1&i&&o(e,46),kt(e,t,d,[],r,1,l,c,u)):re(e,t,l,c,u,{type:"CallExpression",callee:n,arguments:[]});let p=0,f=null,k=0;e.destructible=384^(384|e.destructible);const g=[];for(;16!==e.token;){const{token:r,tokenPos:i,linePos:m,colPos:b}=e;if(143360&r)d&&ue(e,t,d,e.tokenValue,s,0),f=_e(e,t,s,0,1,0,1,1,i,m,b),16===e.token||18===e.token?2&e.assignable?(p|=16,k=1):537079808==(537079808&r)?e.flags|=512:36864==(36864&r)&&(e.flags|=256):(1077936157===e.token?k=1:p|=16,f=ze(e,t,f,1,0,i,m,b),16!==e.token&&18!==e.token&&(f=Ge(e,t,1,0,i,m,b,f)));else if(2097152&r)f=2162700===r?ut(e,t,d,0,1,0,s,a,i,m,b):at(e,t,d,0,1,0,s,a,i,m,b),p|=e.destructible,k=1,16!==e.token&&18!==e.token&&(8&p&&o(e,119),f=ze(e,t,f,0,0,i,m,b),p|=16,8454144==(8454144&e.token)&&(f=He(e,t,1,l,c,u,4,r,f)),W(e,32768|t,22)&&(f=Fe(e,t,f,l,c,u)));else{if(14!==r){for(f=Ue(e,t,1,0,0,i,m,b),p=e.assignable,g.push(f);W(e,32768|t,18);)g.push(Ue(e,t,1,0,0,i,m,b));return p|=e.assignable,K(e,t,16),e.destructible=16|p,e.assignable=2,re(e,t,l,c,u,{type:"CallExpression",callee:n,arguments:g})}f=lt(e,t,d,16,s,a,1,1,0,i,m,b),p|=(16===e.token?0:16)|e.destructible,k=1}if(g.push(f),!W(e,32768|t,18))break}return K(e,t,16),p|=256&e.destructible?256:0|128&e.destructible?128:0,10===e.token?(48&p&&o(e,25),(1&e.flags||1&i)&&o(e,46),128&p&&o(e,29),2098176&t&&256&p&&o(e,30),k&&(e.flags|=128),kt(e,t,d,g,r,1,l,c,u)):(8&p&&o(e,60),e.assignable=2,re(e,t,l,c,u,{type:"CallExpression",callee:n,arguments:g}))}function yt(e,t,n,r,s,a,i){let l=xt(e,t=16777216^(16778240|t));l.length&&(s=e.tokenPos,a=e.linePos,i=e.colPos),e.leadingDecorators.length&&(e.leadingDecorators.push(...l),l=e.leadingDecorators,e.leadingDecorators=[]),j(e,t);let c=null,u=null;const{tokenValue:d}=e;4096&e.token&&20567!==e.token?(ne(e,t,e.token)&&o(e,115),537079808==(537079808&e.token)&&o(e,116),n&&(ue(e,t,n,d,32,0),r&&2&r&&pe(e,d)),c=nt(e,t,0)):0==(1&r)&&o(e,37,"Class");let p=t;W(e,32768|t,20567)?(u=Me(e,t,0,0,0,e.tokenPos,e.linePos,e.colPos),p|=524288):p=524288^(524288|p);const f=wt(e,p,t,n,2,8,0);return re(e,t,s,a,i,1&t?{type:"ClassDeclaration",id:c,superClass:u,decorators:l,body:f}:{type:"ClassDeclaration",id:c,superClass:u,body:f})}function xt(e,t){const n=[];if(1&t)for(;133===e.token;)n.push(vt(e,t,e.tokenPos,e.linePos,e.colPos));return n}function vt(e,t,n,o,r){j(e,32768|t);let s=_e(e,t,2,0,1,0,0,1,n,o,r);return s=ze(e,t,s,0,0,n,o,r),re(e,t,n,o,r,{type:"Decorator",expression:s})}function wt(e,t,n,r,s,a,i){const{tokenPos:l,linePos:c,colPos:u}=e;K(e,32768|t,2162700),t=134217728^(134217728|t);let d=32&e.flags;e.flags=32^(32|e.flags);const p=[];let f;for(;1074790415!==e.token;){let a=0;f=xt(e,t),a=f.length,a>0&&"constructor"===e.tokenValue&&o(e,107),1074790415===e.token&&o(e,106),W(e,t,1074790417)?a>0&&o(e,117):p.push(qt(e,t,r,n,s,f,0,i,e.tokenPos,e.linePos,e.colPos))}return K(e,8&a?32768|t:t,1074790415),e.flags=-33&e.flags|d,re(e,t,l,c,u,{type:"ClassBody",body:p})}function qt(e,t,n,r,s,a,i,l,c,u,d){let p=i?32:0,f=null;const{token:k,tokenPos:g,linePos:m,colPos:b}=e;if(176128&k)switch(f=nt(e,t,0),k){case 36972:if(!i&&67174411!==e.token&&1048576!=(1048576&e.token)&&1077936157!==e.token)return qt(e,t,n,r,s,a,1,l,c,u,d);break;case 209007:if(67174411!==e.token&&0==(1&e.flags)){if(1&t&&1073741824==(1073741824&e.token))return Et(e,t,f,p,a,g,m,b);p|=16|(Z(e,t,8457014)?8:0)}break;case 12402:if(67174411!==e.token){if(1&t&&1073741824==(1073741824&e.token))return Et(e,t,f,p,a,g,m,b);p|=256}break;case 12403:if(67174411!==e.token){if(1&t&&1073741824==(1073741824&e.token))return Et(e,t,f,p,a,g,m,b);p|=512}}else if(69271571===k)p|=2,f=dt(e,r,l);else if(134217728==(134217728&k))f=ot(e,t);else if(8457014===k)p|=8,j(e,t);else if(1&t&&131===e.token)p|=4096,f=Ct(e,16384|t,g,m,b);else if(1&t&&1073741824==(1073741824&e.token))p|=128;else{if(i&&2162700===k)return function(e,t,n,o,r,s){n&&(n=le(n,2));const a=540672;t=(t|a)^a|262144;const{body:i}=ye(e,t,n,{},o,r,s);return re(e,t,o,r,s,{type:"StaticBlock",body:i})}(e,t,n,g,m,b);122===k?(f=nt(e,t,0),67174411!==e.token&&o(e,28,T[255&e.token])):o(e,28,T[255&e.token])}if(792&p&&(143360&e.token?f=nt(e,t,0):134217728==(134217728&e.token)?f=ot(e,t):69271571===e.token?(p|=2,f=dt(e,t,0)):122===e.token?f=nt(e,t,0):1&t&&131===e.token?(p|=4096,f=Ct(e,t,g,m,b)):o(e,132)),0==(2&p)&&("constructor"===e.tokenValue?(1073741824==(1073741824&e.token)?o(e,126):0==(32&p)&&67174411===e.token&&(920&p?o(e,51,"accessor"):0==(524288&t)&&(32&e.flags?o(e,52):e.flags|=32)),p|=64):0==(4096&p)&&824&p&&"prototype"===e.tokenValue&&o(e,50)),1&t&&67174411!==e.token)return Et(e,t,f,p,a,g,m,b);const h=ct(e,t,p,l,e.tokenPos,e.linePos,e.colPos);return re(e,t,c,u,d,1&t?{type:"MethodDefinition",kind:0==(32&p)&&64&p?"constructor":256&p?"get":512&p?"set":"method",static:(32&p)>0,computed:(2&p)>0,key:f,decorators:a,value:h}:{type:"MethodDefinition",kind:0==(32&p)&&64&p?"constructor":256&p?"get":512&p?"set":"method",static:(32&p)>0,computed:(2&p)>0,key:f,value:h})}function Ct(e,t,n,r,s){j(e,t);const{tokenValue:a}=e;return"constructor"===a&&o(e,125),j(e,t),re(e,t,n,r,s,{type:"PrivateIdentifier",name:a})}function Et(e,t,n,r,s,a,i,l){let c=null;if(8&r&&o(e,0),1077936157===e.token){j(e,32768|t);const{tokenPos:n,linePos:r,colPos:s}=e;537079928===e.token&&o(e,116),c=_e(e,16384|t,2,0,1,0,0,1,n,r,s),1073741824==(1073741824&e.token)&&4194304!=(4194304&e.token)||(c=ze(e,16384|t,c,0,0,n,r,s),c=Ge(e,16384|t,0,0,n,r,s,c),18===e.token&&(c=Be(e,t,0,a,i,l,c)))}return re(e,t,a,i,l,{type:"PropertyDefinition",key:n,value:c,static:(32&r)>0,computed:(2&r)>0,decorators:s})}function At(e,t,n,r,s,a,i,l){if(143360&e.token)return St(e,t,n,r,s,a,i,l);2097152!=(2097152&e.token)&&o(e,28,T[255&e.token]);const c=69271571===e.token?at(e,t,n,1,0,1,r,s,a,i,l):ut(e,t,n,1,0,1,r,s,a,i,l);return 16&e.destructible&&o(e,48),32&e.destructible&&o(e,48),c}function St(e,t,n,r,s,a,i,l){const{tokenValue:c,token:u}=e;return 1024&t&&(537079808==(537079808&u)?o(e,116):36864==(36864&u)&&o(e,115)),20480==(20480&u)&&o(e,100),2099200&t&&241773===u&&o(e,30),241739===u&&24&r&&o(e,98),4196352&t&&209008===u&&o(e,96),j(e,t),n&&ce(e,t,n,c,r,s),re(e,t,a,i,l,{type:"Identifier",name:c})}function Dt(e,t,n,r,s,a){if(j(e,t),8456259===e.token)return re(e,t,r,s,a,{type:"JSXFragment",openingFragment:Lt(e,t,r,s,a),children:Tt(e,t),closingFragment:Vt(e,t,n,e.tokenPos,e.linePos,e.colPos)});let i=null,l=[];const c=function(e,t,n,r,s,a){143360!=(143360&e.token)&&4096!=(4096&e.token)&&o(e,0);const i=Nt(e,t,e.tokenPos,e.linePos,e.colPos),l=function(e,t){const n=[];for(;8457016!==e.token&&8456259!==e.token&&1048576!==e.token;)n.push(Ut(e,t,e.tokenPos,e.linePos,e.colPos));return n}(e,t),c=8457016===e.token;8456259===e.token?X(e,t):(K(e,t,8457016),n?K(e,t,8456259):X(e,t));return re(e,t,r,s,a,{type:"JSXOpeningElement",name:i,attributes:l,selfClosing:c})}(e,t,n,r,s,a);if(!c.selfClosing){l=Tt(e,t),i=function(e,t,n,o,r,s){K(e,t,25);const a=Nt(e,t,e.tokenPos,e.linePos,e.colPos);n?K(e,t,8456259):e.token=X(e,t);return re(e,t,o,r,s,{type:"JSXClosingElement",name:a})}(e,t,n,e.tokenPos,e.linePos,e.colPos);const r=se(i.name);se(c.name)!==r&&o(e,150,r)}return re(e,t,r,s,a,{type:"JSXElement",children:l,openingElement:c,closingElement:i})}function Lt(e,t,n,o,r){return X(e,t),re(e,t,n,o,r,{type:"JSXOpeningFragment"})}function Vt(e,t,n,o,r,s){return K(e,t,25),K(e,t,8456259),re(e,t,o,r,s,{type:"JSXClosingFragment"})}function Tt(e,t){const n=[];for(;25!==e.token;)e.index=e.tokenPos=e.startPos,e.column=e.colPos=e.startColumn,e.line=e.linePos=e.startLine,X(e,t),n.push(Rt(e,t,e.tokenPos,e.linePos,e.colPos));return n}function Rt(e,t,n,r,s){return 138===e.token?function(e,t,n,o,r){X(e,t);const s={type:"JSXText",value:e.tokenValue};512&t&&(s.raw=e.tokenRaw);return re(e,t,n,o,r,s)}(e,t,n,r,s):2162700===e.token?Ot(e,t,0,0,n,r,s):8456258===e.token?Dt(e,t,0,n,r,s):void o(e,0)}function Nt(e,t,n,o,r){_(e);let s=Gt(e,t,n,o,r);if(21===e.token)return Bt(e,t,s,n,o,r);for(;W(e,t,67108877);)_(e),s=It(e,t,s,n,o,r);return s}function It(e,t,n,o,r,s){return re(e,t,o,r,s,{type:"JSXMemberExpression",object:n,property:Gt(e,t,e.tokenPos,e.linePos,e.colPos)})}function Ut(e,t,n,r,s){if(2162700===e.token)return function(e,t,n,o,r){j(e,t),K(e,t,14);const s=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);return K(e,t,1074790415),re(e,t,n,o,r,{type:"JSXSpreadAttribute",argument:s})}(e,t,n,r,s);_(e);let a=null,i=Gt(e,t,n,r,s);if(21===e.token&&(i=Bt(e,t,i,n,r,s)),1077936157===e.token){const n=z(e,t),{tokenPos:r,linePos:s,colPos:i}=e;switch(n){case 134283267:a=ot(e,t);break;case 8456258:a=Dt(e,t,1,r,s,i);break;case 2162700:a=Ot(e,t,1,1,r,s,i);break;default:o(e,149)}}return re(e,t,n,r,s,{type:"JSXAttribute",value:a,name:i})}function Bt(e,t,n,o,r,s){K(e,t,21);return re(e,t,o,r,s,{type:"JSXNamespacedName",namespace:n,name:Gt(e,t,e.tokenPos,e.linePos,e.colPos)})}function Ot(e,t,n,r,s,a,i){j(e,32768|t);const{tokenPos:l,linePos:c,colPos:u}=e;if(14===e.token)return function(e,t,n,o,r){K(e,t,14);const s=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);return K(e,t,1074790415),re(e,t,n,o,r,{type:"JSXSpreadChild",expression:s})}(e,t,s,a,i);let d=null;return 1074790415===e.token?(r&&o(e,152),d=function(e,t,n,o,r){return e.startPos=e.tokenPos,e.startLine=e.linePos,e.startColumn=e.colPos,re(e,t,n,o,r,{type:"JSXEmptyExpression"})}(e,t,e.startPos,e.startLine,e.startColumn)):d=Ue(e,t,1,0,0,l,c,u),n?K(e,t,1074790415):X(e,t),re(e,t,s,a,i,{type:"JSXExpressionContainer",expression:d})}function Gt(e,t,n,o,r){const{tokenValue:s}=e;return j(e,t),re(e,t,n,o,r,{type:"JSXIdentifier",name:s})}var jt=Object.freeze({__proto__:null});e.ESTree=jt,e.parse=function(e,t){return me(e,t,0)},e.parseModule=function(e,t){return me(e,t,3072)},e.parseScript=function(e,t){return me(e,t,0)},e.version="4.3.8",Object.defineProperty(e,"__esModule",{value:!0})}));

},{}],172:[function(require,module,exports){
function endsWith (string1, string2) {
  return string1.endsWith(string2)
}
module.exports = endsWith

},{}],173:[function(require,module,exports){
function exists (object) {
  return typeof object !== 'undefined'
}
module.exports = exists

},{}],174:[function(require,module,exports){
function hasDuplicates (value) {
  return new Set(value).size !== value.length
}
module.exports = hasDuplicates

},{}],175:[function(require,module,exports){
function hasExtension (path, extension) {
  if (!extension) {
    const index = path.lastIndexOf('.')
    if (index === -1) { return false }
    const ending = path.substr(index + 1)
    if (ending.startsWith('/') || ending.startsWith('\\')) { return false }
    return !!ending
  }
  if (extension.startsWith('.')) { return path.endsWith(extension) }
  return path.endsWith(`.${extension}`)
}
module.exports = hasExtension

},{}],176:[function(require,module,exports){
function hasKeys (object) {
  if (object instanceof Map || object instanceof Set) return !!object.size
  for (const property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property)) return true
  }
  return false
}
module.exports = hasKeys

},{}],177:[function(require,module,exports){
function hasLengthOf (value, number) {
  return value.length === number
}
module.exports = hasLengthOf

},{}],178:[function(require,module,exports){
function hasLengthOfAtLeast (value, number) {
  return value.length >= number
}
module.exports = hasLengthOfAtLeast

},{}],179:[function(require,module,exports){
function hasLengthOfAtMost (value, number) {
  return value.length <= number
}
module.exports = hasLengthOfAtMost

},{}],180:[function(require,module,exports){
function hasNewLine (string) {
  return /\n/g.test(string)
}
module.exports = hasNewLine

},{}],181:[function(require,module,exports){
function hasNumber (value) {
  return typeof value === 'number' ? true : Object.values(value).some(element => typeof element === 'number')
}
module.exports = hasNumber

},{}],182:[function(require,module,exports){
function hasNumbers (value) {
  return Object.values(value).filter(element => typeof element === 'number').length > 1
}
module.exports = hasNumbers

},{}],183:[function(require,module,exports){
function hasTypeOf (value, type) {
  // eslint-disable-next-line valid-typeof
  return typeof value === type
}
module.exports = hasTypeOf

},{}],184:[function(require,module,exports){
function hasWhitespace (string) {
  return /\s|&nbsp;/g.test(string)
}
module.exports = hasWhitespace

},{}],185:[function(require,module,exports){
function hasWords (string, words) {
  const result = string.match(/\w+/g)
  if (!result || !result.length) return false
  if (!words) return !!result.length
  return result.length === words
}
module.exports = hasWords

},{}],186:[function(require,module,exports){
function have (value, number) {
  return (!number && value.length) > 0 || (value.length === number)
}
module.exports = have

},{}],187:[function(require,module,exports){
function haveLessThan (value, number) {
  return value.length < number
}
module.exports = haveLessThan

},{}],188:[function(require,module,exports){
function haveMany (value) {
  return value.length > 1
}
module.exports = haveMany

},{}],189:[function(require,module,exports){
function haveMoreThan (value1, value2) {
  return value1.length > value2
}
module.exports = haveMoreThan

},{}],190:[function(require,module,exports){
function includes (value1, value2) {
  return value1.includes(value2)
}
module.exports = includes

},{}],191:[function(require,module,exports){
const isNumeric = require('./isNumeric')
const isPositive = require('./isPositive')
const isNegative = require('./isNegative')
const isFinite = require('./isFinite')
const isInfinite = require('./isInfinite')
const isPresent = require('./isPresent')
const isUndefined = require('./isUndefined')
const isNull = require('./isNull')
const isEven = require('./isEven')
const isOdd = require('./isOdd')
const isEmpty = require('./isEmpty')
const isAlpha = require('./isAlpha')
const isAlphaNumeric = require('./isAlphaNumeric')
const isObject = require('./isObject')
const isFrozen = require('./isFrozen')
const isSealed = require('./isSealed')
const isRegExp = require('./isRegExp')
const isNumber = require('./isNumber')
const isDigit = require('./isDigit')
const isDecimal = require('./isDecimal')
const isString = require('./isString')
const isBoolean = require('./isBoolean')
const isArray = require('./isArray')
const isSymbol = require('./isSymbol')
const isMap = require('./isMap')
const isWeakMap = require('./isWeakMap')
const isSet = require('./isSet')
const isWeakSet = require('./isWeakSet')
const isDate = require('./isDate')
const isTruthy = require('./isTruthy')
const isFalsy = require('./isFalsy')
const hasWhitespace = require('./hasWhitespace')
const hasNewLine = require('./hasNewLine')
const hasNumber = require('./hasNumber')
const hasNumbers = require('./hasNumbers')
const hasDuplicates = require('./hasDuplicates')
const isPrime = require('./isPrime')
const isPalindrome = require('./isPalindrome')
const isEmail = require('./isEmail')
const isUrl = require('./isUrl')
const haveMany = require('./haveMany')
const isMultiple = require('./isMultiple')
const isDivisible = require('./isDivisible')
const isSoonerThan = require('./isSoonerThan')
const isLaterThan = require('./isLaterThan')
const respondsTo = require('./respondsTo')
const startsWith = require('./startsWith')
const endsWith = require('./endsWith')
const isAlternative = require('./isAlternative')
const isExclusiveAlternative = require('./isExclusiveAlternative')
const isConjunction = require('./isConjunction')
const isEqual = require('./isEqual')
const notEqual = require('./notEqual')
const isGreaterThanOrEqual = require('./isGreaterThanOrEqual')
const includes = require('./includes')
const matches = require('./matches')
const isBitwiseAlternative = require('./isBitwiseAlternative')
const isBitwiseConjunction = require('./isBitwiseConjunction')
const isBitwiseAlternativeNegation = require('./isBitwiseAlternativeNegation')
const isBitwiseNegation = require('./isBitwiseNegation')
const haveMoreThan = require('./haveMoreThan')
const have = require('./have')
const haveLessThan = require('./haveLessThan')
const isBetween = require('./isBetween')
const isLessThan = require('./isLessThan')
const isGreaterThan = require('./isGreaterThan')
const isLessThanOrEqual = require('./isLessThanOrEqual')
const hasLengthOf = require('./hasLengthOf')
const hasLengthOfAtLeast = require('./hasLengthOfAtLeast')
const hasLengthOfAtMost = require('./hasLengthOfAtMost')
const isIn = require('./isIn')
const hasExtension = require('./hasExtension')
const isAudio = require('./isAudio')
const isVideo = require('./isVideo')
const isImage = require('./isImage')
const isEmptyArray = require('./isEmptyArray')
const isEmptyObject = require('./isEmptyObject')
const isEmptySet = require('./isEmptySet')
const isPhone = require('./isPhone')
const isMobile = require('./isMobile')
const isTablet = require('./isTablet')
const isComputer = require('./isComputer')
const isNaN = require('./isNaN')
const hasTypeOf = require('./hasTypeOf')
const isFunction = require('./isFunction')
const isError = require('./isError')
const isExtensible = require('./isExtensible')
const hasKeys = require('./hasKeys')
const isMissing = require('./isMissing')
const exists = require('./exists')
const hasWords = require('./hasWords')
const isInstanceOf = require('./isInstanceOf')
const isPlainObject = require('./isPlainObject')

module.exports = {
  isPositive,
  isNegative,
  isFinite,
  isInfinite,
  isPresent,
  isUndefined,
  isNull,
  isEven,
  isOdd,
  isEmpty,
  isAlpha,
  isAlphaNumeric,
  isObject,
  isFrozen,
  isSealed,
  isRegExp,
  isNumber,
  isDigit,
  isDecimal,
  isNumeric,
  isString,
  isBoolean,
  isArray,
  isSymbol,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  isDate,
  isTruthy,
  isFalsy,
  hasWhitespace,
  hasNewLine,
  hasNumber,
  hasNumbers,
  hasDuplicates,
  isPrime,
  isPalindrome,
  isEmail,
  isUrl,
  haveMany,
  isMultiple,
  isDivisible,
  isSoonerThan,
  isLaterThan,
  respondsTo,
  startsWith,
  endsWith,
  isAlternative,
  isExclusiveAlternative,
  isConjunction,
  isEqual,
  notEqual,
  isGreaterThanOrEqual,
  includes,
  matches,
  isBitwiseAlternative,
  isBitwiseConjunction,
  isBitwiseAlternativeNegation,
  isBitwiseNegation,
  haveMoreThan,
  have,
  haveLessThan,
  isBetween,
  isLessThan,
  isGreaterThan,
  isLessThanOrEqual,
  hasLengthOf,
  hasLengthOfAtLeast,
  hasLengthOfAtMost,
  isIn,
  hasExtension,
  isAudio,
  isVideo,
  isImage,
  isEmptyArray,
  isEmptyObject,
  isEmptySet,
  isPhone,
  isMobile,
  isTablet,
  isComputer,
  isNaN,
  hasTypeOf,
  isFunction,
  isError,
  isExtensible,
  hasKeys,
  isMissing,
  exists,
  hasWords,
  isInstanceOf,
  isPlainObject
}

},{"./endsWith":172,"./exists":173,"./hasDuplicates":174,"./hasExtension":175,"./hasKeys":176,"./hasLengthOf":177,"./hasLengthOfAtLeast":178,"./hasLengthOfAtMost":179,"./hasNewLine":180,"./hasNumber":181,"./hasNumbers":182,"./hasTypeOf":183,"./hasWhitespace":184,"./hasWords":185,"./have":186,"./haveLessThan":187,"./haveMany":188,"./haveMoreThan":189,"./includes":190,"./isAlpha":192,"./isAlphaNumeric":193,"./isAlternative":194,"./isArray":195,"./isAudio":196,"./isBetween":197,"./isBitwiseAlternative":198,"./isBitwiseAlternativeNegation":199,"./isBitwiseConjunction":200,"./isBitwiseNegation":201,"./isBoolean":202,"./isComputer":203,"./isConjunction":204,"./isDate":205,"./isDecimal":206,"./isDigit":207,"./isDivisible":208,"./isEmail":209,"./isEmpty":210,"./isEmptyArray":211,"./isEmptyObject":212,"./isEmptySet":213,"./isEqual":214,"./isError":215,"./isEven":216,"./isExclusiveAlternative":217,"./isExtensible":218,"./isFalsy":219,"./isFinite":220,"./isFrozen":221,"./isFunction":222,"./isGreaterThan":223,"./isGreaterThanOrEqual":224,"./isImage":225,"./isIn":226,"./isInfinite":227,"./isInstanceOf":228,"./isLaterThan":229,"./isLessThan":230,"./isLessThanOrEqual":231,"./isMap":232,"./isMissing":233,"./isMobile":234,"./isMultiple":235,"./isNaN":236,"./isNegative":237,"./isNull":238,"./isNumber":239,"./isNumeric":240,"./isObject":241,"./isOdd":242,"./isPalindrome":243,"./isPhone":244,"./isPlainObject":245,"./isPositive":246,"./isPresent":247,"./isPrime":248,"./isRegExp":249,"./isSealed":250,"./isSet":251,"./isSoonerThan":252,"./isString":253,"./isSymbol":254,"./isTablet":255,"./isTruthy":256,"./isUndefined":257,"./isUrl":258,"./isVideo":259,"./isWeakMap":260,"./isWeakSet":261,"./matches":262,"./notEqual":263,"./respondsTo":264,"./startsWith":265}],192:[function(require,module,exports){
function isAlpha (string) {
  return [...string].every(char => /[A-Za-z]/.test(char))
}
module.exports = isAlpha

},{}],193:[function(require,module,exports){
function isAlphaNumeric (string) {
  return [...string].every(char => /[A-Za-z0-9]/.test(char))
}
module.exports = isAlphaNumeric

},{}],194:[function(require,module,exports){
function isAlternative (value1, value2) {
  return !!(value1 || value2)
}
module.exports = isAlternative

},{}],195:[function(require,module,exports){
function isArray (value) {
  return Array.isArray(value)
}
module.exports = isArray

},{}],196:[function(require,module,exports){
function isAudio (string) {
  const extensions = [
    '.3gp',
    '.aa',
    '.aac',
    '.aax',
    '.act',
    '.aiff',
    '.amr',
    '.ape',
    '.au',
    '.awb',
    '.dct',
    '.dss',
    '.dvf',
    '.flac',
    '.gsm',
    '.iklax',
    '.ivs',
    '.m4a',
    '.m4b',
    '.m4p',
    '.mmf',
    '.mp3',
    '.mpc',
    '.msv',
    '.nsf',
    '.ogg',
    '.oga',
    '.mogg',
    '.opus',
    '.ra',
    '.rm',
    '.raw',
    '.sln',
    '.tta',
    '.vox',
    '.wav',
    '.wma',
    '.wv',
    '.webm',
    '.8svx'
  ]
  return extensions.includes(string.substr(string.lastIndexOf('.')))
}
module.exports = isAudio

},{}],197:[function(require,module,exports){
function isBetween (value1, value2, value3) {
  return value1 >= value2 && value1 <= value3
}
module.exports = isBetween

},{}],198:[function(require,module,exports){
function isBitwiseAlternative (value1, value2) {
  return !!(value1 | value2)
}
module.exports = isBitwiseAlternative

},{}],199:[function(require,module,exports){
function isBitwiseAlternativeNegation (value1, value2) {
  return !!((value1 && !value2) || (!value1 && value2))
}
module.exports = isBitwiseAlternativeNegation

},{}],200:[function(require,module,exports){
function isBitwiseConjunction (value1, value2) {
  return !!(value1 & value2)
}
module.exports = isBitwiseConjunction

},{}],201:[function(require,module,exports){
function isBitwiseNegation (value) {
  return !!(~value)
}
module.exports = isBitwiseNegation

},{}],202:[function(require,module,exports){
function isBoolean (value) {
  return Object.prototype.toString.call(value) === '[object Boolean]'
}
module.exports = isBoolean

},{}],203:[function(require,module,exports){
function isComputer () {
  return window.matchMedia('(min-width: 992px)').matches
}
module.exports = isComputer

},{}],204:[function(require,module,exports){
function isConjunction (value1, value2) {
  return !!(value1 && value2)
}
module.exports = isConjunction

},{}],205:[function(require,module,exports){
function isDate (value) {
  return Object.prototype.toString.call(value) === '[object Date]'
}
module.exports = isDate

},{}],206:[function(require,module,exports){
function isDecimal (value) {
  return value % 1 !== 0
}
module.exports = isDecimal

},{}],207:[function(require,module,exports){
function isDigit (value) {
  return /^[0-9]{1}$/.test(value)
}
module.exports = isDigit

},{}],208:[function(require,module,exports){
function isDivisible (number1, number2) {
  return number1 % number2 === 0
}
module.exports = isDivisible

},{}],209:[function(require,module,exports){
function isEmail (string) {
  string = string.toLowerCase()
  const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regExp.test(string)
}
module.exports = isEmail

},{}],210:[function(require,module,exports){
function isEmpty (value) {
  const type = Object.prototype.toString.call(value).substr(8).replace(']', '')
  return value == null || (
    ((type === 'Array' || type === 'String') && (value.length === 0)) ||
    ((type === 'Set' || type === 'Map') && (value.size === 0)) ||
    ((type === 'Object' || type === 'Function') && (Object.keys(value).length === 0))
  )
}
module.exports = isEmpty

},{}],211:[function(require,module,exports){
function isEmptyArray (array) {
  return !array.length
}
module.exports = isEmptyArray

},{}],212:[function(require,module,exports){
function isEmptyObject (object) {
  if (!object) return false
  return Object.keys(object).length === 0 && object.constructor === Object
}
module.exports = isEmptyObject

},{}],213:[function(require,module,exports){
function isEmptySet (set) {
  return !set.size
}
module.exports = isEmptySet

},{}],214:[function(require,module,exports){
function isEqual (value1, value2, strict) {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) { return false }
    if (strict) {
      return value1.every((value, index) => value === value2[index])
    }
    const array1 = value1.slice().sort()
    const array2 = value2.slice().sort()
    return array1.every((value, index) => value === array2[index])
  }
  return value1 === value2
}
module.exports = isEqual

},{}],215:[function(require,module,exports){
function isError (object) {
  return object instanceof Error
}
module.exports = isError

},{}],216:[function(require,module,exports){
function isEven (number) {
  return number % 2 === 0
}
module.exports = isEven

},{}],217:[function(require,module,exports){
function isExclusiveAlternative (value1, value2) {
  return !!((value1 && !value2) || (!value1 && value2))
}
module.exports = isExclusiveAlternative

},{}],218:[function(require,module,exports){
function isExtensible (object) {
  return Object.isExtensible(object)
}
module.exports = isExtensible

},{}],219:[function(require,module,exports){
function isFalsy (value) {
  return !value
}
module.exports = isFalsy

},{}],220:[function(require,module,exports){
function isNumberFinite (number) {
  return isFinite(number)
}
module.exports = isNumberFinite

},{}],221:[function(require,module,exports){
function isFrozen (object) {
  return Object.isFrozen(object)
}
module.exports = isFrozen

},{}],222:[function(require,module,exports){
function isFunction (value) {
  return typeof value === 'function'
}
module.exports = isFunction

},{}],223:[function(require,module,exports){
function isGreaterThan (number1, number2) {
  return number1 > number2
}
module.exports = isGreaterThan

},{}],224:[function(require,module,exports){
function isGreaterThanOrEqual (value1, value2) {
  return value1 >= value2
}
module.exports = isGreaterThanOrEqual

},{}],225:[function(require,module,exports){
function isImage (string) {
  const extensions = [
    '.tif',
    '.tiff',
    '.gif',
    '.jpeg',
    '.jpg',
    '.jif',
    '.jfif',
    '.jp2',
    '.jpx',
    '.j2k',
    '.j2c',
    '.fpx',
    '.pcd',
    '.png',
    '.svg',
    '.bmp'
  ]
  return extensions.includes(string.substr(string.lastIndexOf('.')))
}
module.exports = isImage

},{}],226:[function(require,module,exports){
function isIn (value1, value2) {
  return value2.includes(value1)
}
module.exports = isIn

},{}],227:[function(require,module,exports){
function isInfinite (number) {
  return number === Number.POSITIVE_INFINITY || number === Number.NEGATIVE_INFINITY
}
module.exports = isInfinite

},{}],228:[function(require,module,exports){
function isInstanceOf (object1, object2) {
  return object1 instanceof object2
}
module.exports = isInstanceOf

},{}],229:[function(require,module,exports){
function isLaterThan (date1, date2) {
  return date1 > date2
}
module.exports = isLaterThan

},{}],230:[function(require,module,exports){
function isLessThan (number1, number2) {
  return number1 < number2
}
module.exports = isLessThan

},{}],231:[function(require,module,exports){
function isLessThanOrEqual (number1, number2) {
  return number1 <= number2
}
module.exports = isLessThanOrEqual

},{}],232:[function(require,module,exports){
function isMap (value) {
  return Object.prototype.toString.call(value) === '[object Map]'
}
module.exports = isMap

},{}],233:[function(require,module,exports){
function isMissing (object) {
  return typeof object === 'undefined'
}
module.exports = isMissing

},{}],234:[function(require,module,exports){
function isMobile () {
  return window.matchMedia('(max-width: 767px)').matches
}
module.exports = isMobile

},{}],235:[function(require,module,exports){
function isMultiple (number1, number2) {
  return number1 % number2 === 0
}
module.exports = isMultiple

},{}],236:[function(require,module,exports){
function isNaN (value) {
  return Number.isNaN(value)
}
module.exports = isNaN

},{}],237:[function(require,module,exports){
function isNegative (number) {
  return number < 0
}
module.exports = isNegative

},{}],238:[function(require,module,exports){
function isNull (value) {
  return value === null
}
module.exports = isNull

},{}],239:[function(require,module,exports){
function isNumber (value) {
  return Object.prototype.toString.call(value) === '[object Number]'
}
module.exports = isNumber

},{}],240:[function(require,module,exports){
function isNumeric (value) {
  const type = typeof value
  return (type === 'string' || type === 'number') && !isNaN(Number(value))
}

module.exports = isNumeric

},{}],241:[function(require,module,exports){
function isObject (value) {
  const type = typeof value
  return (type === 'function' || type === 'object') && !!value
}
module.exports = isObject

},{}],242:[function(require,module,exports){
function isOdd (number) {
  return number % 2 !== 0
}
module.exports = isOdd

},{}],243:[function(require,module,exports){
function isPalindrome (string) {
  string = string.toLowerCase()
  return string.split('').reverse().join('') === string
}
module.exports = isPalindrome

},{}],244:[function(require,module,exports){
function isPhone (string) {
  if (!string) return false
  const regExp = /^(\+?\(?\d{1,3}\)?(-|\s)?)?(\d{2,3}(-|\s)?){3}$/
  return regExp.test(string)
}
module.exports = isPhone

},{}],245:[function(require,module,exports){
function isPlainObject (object) {
  return Object.prototype.toString.call(object) === '[object Object]'
}
module.exports = isPlainObject

},{}],246:[function(require,module,exports){
function isPositive (number) {
  return number > 0
}
module.exports = isPositive

},{}],247:[function(require,module,exports){
function isPresent (value) {
  return value !== undefined
}
module.exports = isPresent

},{}],248:[function(require,module,exports){
function isPrime (number) {
  if (number === 1) return false
  for (let i = 2; i < number; i++) if (number % i === 0) return false
  return true
}
module.exports = isPrime

},{}],249:[function(require,module,exports){
function isRegExp (value) {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}
module.exports = isRegExp

},{}],250:[function(require,module,exports){
function isSealed (object) {
  return Object.isSealed(object)
}
module.exports = isSealed

},{}],251:[function(require,module,exports){
function isSet (value) {
  return Object.prototype.toString.call(value) === '[object Set]'
}
module.exports = isSet

},{}],252:[function(require,module,exports){
function isSoonerThan (date1, date2) {
  return date1 < date2
}
module.exports = isSoonerThan

},{}],253:[function(require,module,exports){
function isString (value) {
  return Object.prototype.toString.call(value) === '[object String]'
}
module.exports = isString

},{}],254:[function(require,module,exports){
function isSymbol (value) {
  return Object.prototype.toString.call(value) === '[object Symbol]'
}
module.exports = isSymbol

},{}],255:[function(require,module,exports){
function isTablet () {
  return window.matchMedia('(min-width: 768px) and (max-width: 991px)').matches
}
module.exports = isTablet

},{}],256:[function(require,module,exports){
function isTruthy (value) {
  return !!value
}
module.exports = isTruthy

},{}],257:[function(require,module,exports){
function isUndefined (value) {
  return value === undefined
}
module.exports = isUndefined

},{}],258:[function(require,module,exports){
function isUrl (string) {
  const regExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/
  return regExp.test(string)
}
module.exports = isUrl

},{}],259:[function(require,module,exports){
function isVideo (string) {
  const extensions = [
    '.webm',
    '.mkv',
    '.flv',
    '.flv',
    '.vob',
    '.ogv',
    '.ogg',
    '.drc',
    '.gifv',
    '.mng',
    '.avi',
    '.mov',
    '.qt',
    '.wmv',
    '.yuv',
    '.rm',
    '.rmvb',
    '.asf',
    '.amv',
    '.mp4',
    '.m4v',
    '.mpg',
    '.mp2',
    '.mpeg',
    '.mpe',
    '.mpv',
    '.mpg',
    '.mpeg',
    '.m2v',
    '.m4v',
    '.svi',
    '.3gp',
    '.3g2',
    '.mxf',
    '.roq',
    '.nsv',
    '.flv',
    '.f4v',
    '.f4p',
    '.f4a',
    '.f4b'
  ]
  return extensions.includes(string.substr(string.lastIndexOf('.')))
}
module.exports = isVideo

},{}],260:[function(require,module,exports){
function isWeakMap (value) {
  return Object.prototype.toString.call(value) === '[object WeakMap]'
}
module.exports = isWeakMap

},{}],261:[function(require,module,exports){
function isWeakSet (value) {
  return Object.prototype.toString.call(value) === '[object WeakSet]'
}
module.exports = isWeakSet

},{}],262:[function(require,module,exports){
function matches (string, regExp) {
  return !!string.match(regExp)
}
module.exports = matches

},{}],263:[function(require,module,exports){
function notEqual (value1, value2) {
  return value1 !== value2
}
module.exports = notEqual

},{}],264:[function(require,module,exports){
function respondsTo (object, string) {
  return !!(object[string] && typeof object[string] === 'function')
}
module.exports = respondsTo

},{}],265:[function(require,module,exports){
function startsWith (string1, string2) {
  return string1.startsWith(string2)
}
module.exports = startsWith

},{}],266:[function(require,module,exports){
(function (global){(function (){
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, Symbol, Reflect, Promise, SuppressedError */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __esDecorate;
var __runInitializers;
var __propKey;
var __setFunctionName;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __classPrivateFieldIn;
var __createBinding;
var __addDisposableResource;
var __disposeResources;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
        function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
        var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
        var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
        var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
        var _, done = false;
        for (var i = decorators.length - 1; i >= 0; i--) {
            var context = {};
            for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
            for (var p in contextIn.access) context.access[p] = contextIn.access[p];
            context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
            var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
            if (kind === "accessor") {
                if (result === void 0) continue;
                if (result === null || typeof result !== "object") throw new TypeError("Object expected");
                if (_ = accept(result.get)) descriptor.get = _;
                if (_ = accept(result.set)) descriptor.set = _;
                if (_ = accept(result.init)) initializers.unshift(_);
            }
            else if (_ = accept(result)) {
                if (kind === "field") initializers.unshift(_);
                else descriptor[key] = _;
            }
        }
        if (target) Object.defineProperty(target, contextIn.name, descriptor);
        done = true;
    };

    __runInitializers = function (thisArg, initializers, value) {
        var useValue = arguments.length > 2;
        for (var i = 0; i < initializers.length; i++) {
            value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
        }
        return useValue ? value : void 0;
    };

    __propKey = function (x) {
        return typeof x === "symbol" ? x : "".concat(x);
    };

    __setFunctionName = function (f, name, prefix) {
        if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
        return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    __classPrivateFieldIn = function (state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    };

    __addDisposableResource = function (env, value, async) {
        if (value !== null && value !== void 0) {
            if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
            var dispose;
            if (async) {
                if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
                dispose = value[Symbol.asyncDispose];
            }
            if (dispose === void 0) {
                if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
                dispose = value[Symbol.dispose];
            }
            if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
            env.stack.push({ value: value, dispose: dispose, async: async });
        }
        else if (async) {
            env.stack.push({ async: true });
        }
        return value;
    };

    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    __disposeResources = function (env) {
        function fail(e) {
            env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__esDecorate", __esDecorate);
    exporter("__runInitializers", __runInitializers);
    exporter("__propKey", __propKey);
    exporter("__setFunctionName", __setFunctionName);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
    exporter("__classPrivateFieldIn", __classPrivateFieldIn);
    exporter("__addDisposableResource", __addDisposableResource);
    exporter("__disposeResources", __disposeResources);
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[5]);
