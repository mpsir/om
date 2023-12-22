(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const HtmlPrettify = require("html-prettify")
globalThis.HtmlPrettify = HtmlPrettify
// browserify main.js -o bundle.js
},{"html-prettify":2}],2:[function(require,module,exports){
const addIndentation = require('./utils/addIndentation')
const { mergeAttributesWithElements } = require('./utils/toLines')

/**
 * @param {string} markup
 * @param {{ char?: string; count?: number }} options
 * @returns {string}
 */
const prettify = (markup, options = {}) => {
  const splitted = mergeAttributesWithElements(markup)

  return addIndentation(splitted, options)
}

module.exports = prettify

},{"./utils/addIndentation":3,"./utils/toLines":4}],3:[function(require,module,exports){
/**
 * @param {string[]} splittedHtml
 * @param {{ char?: string; count?: number}} options
 * @returns {string}
 */
const addIndentation = (splittedHtml, options = {}) => {
  const char = options.char || ' '
  const count = options.count || 2

  let level = 0
  const opened = []

  return splittedHtml.reverse().reduce((indented, elTag) => {
    if (opened.length
      && level
      && opened[level]
      /* if current element tag is the same as previously opened one */
      && opened[level] === elTag.substring(1, opened[level].length + 1)
    ) {
      opened.splice(level, 1)
      level--
    }

    const indentation = char.repeat(level ? level * count : 0)

    const newIndented = [
      `${indentation}${elTag}`,
      ...indented,
    ]

    // if current element tag is closing tag
    // add it to opened elements
    if (elTag.substring(0, 2) === '</') {
      level++
      opened[level] = elTag.substring(2, elTag.length - 1)
    }

    return newIndented
  }, []).join('\n')
}

module.exports = addIndentation

},{}],4:[function(require,module,exports){
/**
 * @param {string} nonFormattedString Any non formatted string
 * @returns {string[]} Array of strings separated on new lines
 */
const removeEmptyLines = (nonFormattedString) => (
  // Replace
  // - 1 or more spaces or tabs at the start of line
  // - 1 or more spaces or tabs at the end of line
  // - empty lines
  // with empty string
  nonFormattedString.trim().replace(/(^(\s|\t)+|(( |\t)+)$)/gm, '')
)

/**
 * @param {string} markup
 * @returns {string[]} Array of strings splitted on new lines without empty lines
 */
const mergeAttributesWithElements = (markup) => {
  const splittedMarkup = removeEmptyLines(markup).split('\n')

  const mergedLines = []
  let currentElement = ''
  for (let i = 0; i < splittedMarkup.length; i += 1) {
    const line = splittedMarkup[i]

    // If line is closing element/tag separate closing tag from rest of the line with space
    if (line.endsWith('/>')) {
      mergedLines.push(`${currentElement}${line.slice(0, -2)} />`)
      currentElement = ''
      // eslint-disable-next-line no-continue
      continue
    }

    if (line.endsWith('>')) {
      mergedLines.push(`${currentElement}${
        line.startsWith('>') || line.startsWith('<') ? '' : ' '
      }${line}`)
      currentElement = ''
      // eslint-disable-next-line no-continue
      continue
    }

    currentElement += currentElement.length ? ` ${line}` : line
  }

  return mergedLines
}

module.exports = {
  mergeAttributesWithElements,
  removeEmptyLines,
}

},{}]},{},[1]);
