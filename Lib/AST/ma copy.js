(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    var meriyah = require('meriyah');
    var astring = require('astring');
    
    console.log(meriyah);
    console.log(astring);
    },{"astring":2,"meriyah":3}],2:[function(require,module,exports){
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
    
    
    },{}],3:[function(require,module,exports){
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).meriyah={})}(this,(function(e){"use strict";const t={0:"Unexpected token",28:"Unexpected token: '%0'",1:"Octal escape sequences are not allowed in strict mode",2:"Octal escape sequences are not allowed in template strings",3:"Unexpected token `#`",4:"Illegal Unicode escape sequence",5:"Invalid code point %0",6:"Invalid hexadecimal escape sequence",8:"Octal literals are not allowed in strict mode",7:"Decimal integer literals with a leading zero are forbidden in strict mode",9:"Expected number in radix %0",146:"Invalid left-hand side assignment to a destructible right-hand side",10:"Non-number found after exponent indicator",11:"Invalid BigIntLiteral",12:"No identifiers allowed directly after numeric literal",13:"Escapes \\8 or \\9 are not syntactically valid escapes",14:"Unterminated string literal",15:"Unterminated template literal",16:"Multiline comment was not closed properly",17:"The identifier contained dynamic unicode escape that was not closed",18:"Illegal character '%0'",19:"Missing hexadecimal digits",20:"Invalid implicit octal",21:"Invalid line break in string literal",22:"Only unicode escapes are legal in identifier names",23:"Expected '%0'",24:"Invalid left-hand side in assignment",25:"Invalid left-hand side in async arrow",26:'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',27:"Member access on super must be in a method",29:"Await expression not allowed in formal parameter",30:"Yield expression not allowed in formal parameter",93:"Unexpected token: 'escaped keyword'",31:"Unary expressions as the left operand of an exponentiation expression must be disambiguated with parentheses",120:"Async functions can only be declared at the top level or inside a block",32:"Unterminated regular expression",33:"Unexpected regular expression flag",34:"Duplicate regular expression flag '%0'",35:"%0 functions must have exactly %1 argument%2",36:"Setter function argument must not be a rest parameter",37:"%0 declaration must have a name in this context",38:"Function name may not contain any reserved words or be eval or arguments in strict mode",39:"The rest operator is missing an argument",40:"A getter cannot be a generator",41:"A setter cannot be a generator",42:"A computed property name must be followed by a colon or paren",131:"Object literal keys that are strings or numbers must be a method or have a colon",44:"Found `* async x(){}` but this should be `async * x(){}`",43:"Getters and setters can not be generators",45:"'%0' can not be generator method",46:"No line break is allowed after '=>'",47:"The left-hand side of the arrow can only be destructed through assignment",48:"The binding declaration is not destructible",49:"Async arrow can not be followed by new expression",50:"Classes may not have a static property named 'prototype'",51:"Class constructor may not be a %0",52:"Duplicate constructor method in class",53:"Invalid increment/decrement operand",54:"Invalid use of `new` keyword on an increment/decrement expression",55:"`=>` is an invalid assignment target",56:"Rest element may not have a trailing comma",57:"Missing initializer in %0 declaration",58:"'for-%0' loop head declarations can not have an initializer",59:"Invalid left-hand side in for-%0 loop: Must have a single binding",60:"Invalid shorthand property initializer",61:"Property name __proto__ appears more than once in object literal",62:"Let is disallowed as a lexically bound name",63:"Invalid use of '%0' inside new expression",64:"Illegal 'use strict' directive in function with non-simple parameter list",65:'Identifier "let" disallowed as left-hand side expression in strict mode',66:"Illegal continue statement",67:"Illegal break statement",68:"Cannot have `let[...]` as a var name in strict mode",69:"Invalid destructuring assignment target",70:"Rest parameter may not have a default initializer",71:"The rest argument must the be last parameter",72:"Invalid rest argument",74:"In strict mode code, functions can only be declared at top level or inside a block",75:"In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement",76:"Without web compatibility enabled functions can not be declared at top level, inside a block, or as the body of an if statement",77:"Class declaration can't appear in single-statement context",78:"Invalid left-hand side in for-%0",79:"Invalid assignment in for-%0",80:"for await (... of ...) is only valid in async functions and async generators",81:"The first token after the template expression should be a continuation of the template",83:"`let` declaration not allowed here and `let` cannot be a regular var name in strict mode",82:"`let \n [` is a restricted production at the start of a statement",84:"Catch clause requires exactly one parameter, not more (and no trailing comma)",85:"Catch clause parameter does not support default values",86:"Missing catch or finally after try",87:"More than one default clause in switch statement",88:"Illegal newline after throw",89:"Strict mode code may not include a with statement",90:"Illegal return statement",91:"The left hand side of the for-header binding declaration is not destructible",92:"new.target only allowed within functions",94:"'#' not followed by identifier",100:"Invalid keyword",99:"Can not use 'let' as a class name",98:"'A lexical declaration can't define a 'let' binding",97:"Can not use `let` as variable name in strict mode",95:"'%0' may not be used as an identifier in this context",96:"Await is only valid in async functions",101:"The %0 keyword can only be used with the module goal",102:"Unicode codepoint must not be greater than 0x10FFFF",103:"%0 source must be string",104:"Only a identifier can be used to indicate alias",105:"Only '*' or '{...}' can be imported after default",106:"Trailing decorator may be followed by method",107:"Decorators can't be used with a constructor",109:"HTML comments are only allowed with web compatibility (Annex B)",110:"The identifier 'let' must not be in expression position in strict mode",111:"Cannot assign to `eval` and `arguments` in strict mode",112:"The left-hand side of a for-of loop may not start with 'let'",113:"Block body arrows can not be immediately invoked without a group",114:"Block body arrows can not be immediately accessed without a group",115:"Unexpected strict mode reserved word",116:"Unexpected eval or arguments in strict mode",117:"Decorators must not be followed by a semicolon",118:"Calling delete on expression not allowed in strict mode",119:"Pattern can not have a tail",121:"Can not have a `yield` expression on the left side of a ternary",122:"An arrow function can not have a postfix update operator",123:"Invalid object literal key character after generator star",124:"Private fields can not be deleted",126:"Classes may not have a field called constructor",125:"Classes may not have a private element named constructor",127:"A class field initializer may not contain arguments",128:"Generators can only be declared at the top level or inside a block",129:"Async methods are a restricted production and cannot have a newline following it",130:"Unexpected character after object literal property name",132:"Invalid key token",133:"Label '%0' has already been declared",134:"continue statement must be nested within an iteration statement",135:"Undefined label '%0'",136:"Trailing comma is disallowed inside import(...) arguments",137:"import() requires exactly one argument",138:"Cannot use new with import(...)",139:"... is not allowed in import()",140:"Expected '=>'",141:"Duplicate binding '%0'",142:"Cannot export a duplicate name '%0'",145:"Duplicate %0 for-binding",143:"Exported binding '%0' needs to refer to a top-level declared variable",144:"Unexpected private field",148:"Numeric separators are not allowed at the end of numeric literals",147:"Only one underscore is allowed as numeric separator",149:"JSX value should be either an expression or a quoted JSX text",150:"Expected corresponding JSX closing tag for %0",151:"Adjacent JSX elements must be wrapped in an enclosing tag",152:"JSX attributes must only be assigned a non-empty 'expression'",153:"'%0' has already been declared",154:"'%0' shadowed a catch clause binding",155:"Dot property must be an identifier",156:"Encountered invalid input after spread/rest argument",157:"Catch without try",158:"Finally without try",159:"Expected corresponding closing tag for JSX fragment",160:"Coalescing and logical operators used together in the same expression must be disambiguated with parentheses",161:"Invalid tagged template on optional chain",162:"Invalid optional chain from super property",163:"Invalid optional chain from new expression",164:'Cannot use "import.meta" outside a module',165:"Leading decorators must be attached to a class declaration"};class n extends SyntaxError{constructor(e,n,o,r,...s){const a="["+n+":"+o+"]: "+t[r].replace(/%(\d+)/g,((e,t)=>s[t]));super(`${a}`),this.index=e,this.line=n,this.column=o,this.description=a,this.loc={line:n,column:o}}}function o(e,t,...o){throw new n(e.index,e.line,e.column,t,...o)}function r(e){throw new n(e.index,e.line,e.column,e.type,e.params)}function s(e,t,o,r,...s){throw new n(e,t,o,r,...s)}function a(e,t,o,r){throw new n(e,t,o,r)}const i=((e,t)=>{const n=new Uint32Array(104448);let o=0,r=0;for(;o<3540;){const s=e[o++];if(s<0)r-=s;else{let a=e[o++];2&s&&(a=t[a]),1&s?n.fill(a,r,r+=e[o++]):n[r++]=a}}return n})([-1,2,24,2,25,2,5,-1,0,77595648,3,44,2,3,0,14,2,57,2,58,3,0,3,0,3168796671,0,4294956992,2,1,2,0,2,59,3,0,4,0,4294966523,3,0,4,2,16,2,60,2,0,0,4294836735,0,3221225471,0,4294901942,2,61,0,134152192,3,0,2,0,4294951935,3,0,2,0,2683305983,0,2684354047,2,17,2,0,0,4294961151,3,0,2,2,19,2,0,0,608174079,2,0,2,131,2,6,2,56,-1,2,37,0,4294443263,2,1,3,0,3,0,4294901711,2,39,0,4089839103,0,2961209759,0,1342439375,0,4294543342,0,3547201023,0,1577204103,0,4194240,0,4294688750,2,2,0,80831,0,4261478351,0,4294549486,2,2,0,2967484831,0,196559,0,3594373100,0,3288319768,0,8469959,2,194,2,3,0,3825204735,0,123747807,0,65487,0,4294828015,0,4092591615,0,1080049119,0,458703,2,3,2,0,0,2163244511,0,4227923919,0,4236247022,2,66,0,4284449919,0,851904,2,4,2,11,0,67076095,-1,2,67,0,1073741743,0,4093591391,-1,0,50331649,0,3265266687,2,32,0,4294844415,0,4278190047,2,18,2,129,-1,3,0,2,2,21,2,0,2,9,2,0,2,14,2,15,3,0,10,2,69,2,0,2,70,2,71,2,72,2,0,2,73,2,0,2,10,0,261632,2,23,3,0,2,2,12,2,4,3,0,18,2,74,2,5,3,0,2,2,75,0,2088959,2,27,2,8,0,909311,3,0,2,0,814743551,2,41,0,67057664,3,0,2,2,40,2,0,2,28,2,0,2,29,2,7,0,268374015,2,26,2,49,2,0,2,76,0,134153215,-1,2,6,2,0,2,7,0,2684354559,0,67044351,0,3221160064,0,1,-1,3,0,2,2,42,0,1046528,3,0,3,2,8,2,0,2,51,0,4294960127,2,9,2,38,2,10,0,4294377472,2,11,3,0,7,0,4227858431,3,0,8,2,12,2,0,2,78,2,9,2,0,2,79,2,80,2,81,-1,2,124,0,1048577,2,82,2,13,-1,2,13,0,131042,2,83,2,84,2,85,2,0,2,33,-83,2,0,2,53,2,7,3,0,4,0,1046559,2,0,2,14,2,0,0,2147516671,2,20,3,86,2,2,0,-16,2,87,0,524222462,2,4,2,0,0,4269801471,2,4,2,0,2,15,2,77,2,16,3,0,2,2,47,2,0,-1,2,17,-16,3,0,206,-2,3,0,655,2,18,3,0,36,2,68,-1,2,17,2,9,3,0,8,2,89,2,121,2,0,0,3220242431,3,0,3,2,19,2,90,2,91,3,0,2,2,92,2,0,2,93,2,94,2,0,0,4351,2,0,2,8,3,0,2,0,67043391,0,3909091327,2,0,2,22,2,8,2,18,3,0,2,0,67076097,2,7,2,0,2,20,0,67059711,0,4236247039,3,0,2,0,939524103,0,8191999,2,97,2,98,2,15,2,21,3,0,3,0,67057663,3,0,349,2,99,2,100,2,6,-264,3,0,11,2,22,3,0,2,2,31,-1,0,3774349439,2,101,2,102,3,0,2,2,19,2,103,3,0,10,2,9,2,17,2,0,2,45,2,0,2,30,2,104,2,23,0,1638399,2,172,2,105,3,0,3,2,18,2,24,2,25,2,5,2,26,2,0,2,7,2,106,-1,2,107,2,108,2,109,-1,3,0,3,2,11,-2,2,0,2,27,-3,2,150,-4,2,18,2,0,2,35,0,1,2,0,2,62,2,28,2,11,2,9,2,0,2,110,-1,3,0,4,2,9,2,21,2,111,2,6,2,0,2,112,2,0,2,48,-4,3,0,9,2,20,2,29,2,30,-4,2,113,2,114,2,29,2,20,2,7,-2,2,115,2,29,2,31,-2,2,0,2,116,-2,0,4277137519,0,2269118463,-1,3,18,2,-1,2,32,2,36,2,0,3,29,2,2,34,2,19,-3,3,0,2,2,33,-1,2,0,2,34,2,0,2,34,2,0,2,46,-10,2,0,0,203775,-2,2,18,2,43,2,35,-2,2,17,2,117,2,20,3,0,2,2,36,0,2147549120,2,0,2,11,2,17,2,135,2,0,2,37,2,52,0,5242879,3,0,2,0,402644511,-1,2,120,0,1090519039,-2,2,122,2,38,2,0,0,67045375,2,39,0,4226678271,0,3766565279,0,2039759,-4,3,0,2,0,3288270847,0,3,3,0,2,0,67043519,-5,2,0,0,4282384383,0,1056964609,-1,3,0,2,0,67043345,-1,2,0,2,40,2,41,-1,2,10,2,42,-6,2,0,2,11,-3,3,0,2,0,2147484671,2,125,0,4190109695,2,50,-2,2,126,0,4244635647,0,27,2,0,2,7,2,43,2,0,2,63,-1,2,0,2,40,-8,2,54,2,44,0,67043329,2,127,2,45,0,8388351,-2,2,128,0,3028287487,2,46,2,130,0,33259519,2,41,-9,2,20,-5,2,64,-2,3,0,28,2,31,-3,3,0,3,2,47,3,0,6,2,48,-85,3,0,33,2,47,-126,3,0,18,2,36,-269,3,0,17,2,40,2,7,2,41,-2,2,17,2,49,2,0,2,20,2,50,2,132,2,23,-21,3,0,2,-4,3,0,2,0,4294936575,2,0,0,4294934783,-2,0,196635,3,0,191,2,51,3,0,38,2,29,-1,2,33,-279,3,0,8,2,7,-1,2,133,2,52,3,0,11,2,6,-72,3,0,3,2,134,0,1677656575,-166,0,4161266656,0,4071,0,15360,-4,0,28,-13,3,0,2,2,37,2,0,2,136,2,137,2,55,2,0,2,138,2,139,2,140,3,0,10,2,141,2,142,2,15,3,37,2,3,53,2,3,54,2,0,4294954999,2,0,-16,2,0,2,88,2,0,0,2105343,0,4160749584,0,65534,-42,0,4194303871,0,2011,-6,2,0,0,1073684479,0,17407,-11,2,0,2,31,-40,3,0,6,0,8323103,-1,3,0,2,2,42,-37,2,55,2,144,2,145,2,146,2,147,2,148,-105,2,24,-32,3,0,1334,2,9,-1,3,0,129,2,27,3,0,6,2,9,3,0,180,2,149,3,0,233,0,1,-96,3,0,16,2,9,-47,3,0,154,2,56,-22381,3,0,7,2,23,-6130,3,5,2,-1,0,69207040,3,44,2,3,0,14,2,57,2,58,-3,0,3168731136,0,4294956864,2,1,2,0,2,59,3,0,4,0,4294966275,3,0,4,2,16,2,60,2,0,2,33,-1,2,17,2,61,-1,2,0,2,56,0,4294885376,3,0,2,0,3145727,0,2617294944,0,4294770688,2,23,2,62,3,0,2,0,131135,2,95,0,70256639,0,71303167,0,272,2,40,2,56,-1,2,37,2,30,-1,2,96,2,63,0,4278255616,0,4294836227,0,4294549473,0,600178175,0,2952806400,0,268632067,0,4294543328,0,57540095,0,1577058304,0,1835008,0,4294688736,2,65,2,64,0,33554435,2,123,2,65,2,151,0,131075,0,3594373096,0,67094296,2,64,-1,0,4294828e3,0,603979263,2,160,0,3,0,4294828001,0,602930687,2,183,0,393219,0,4294828016,0,671088639,0,2154840064,0,4227858435,0,4236247008,2,66,2,36,-1,2,4,0,917503,2,36,-1,2,67,0,537788335,0,4026531935,-1,0,1,-1,2,32,2,68,0,7936,-3,2,0,0,2147485695,0,1010761728,0,4292984930,0,16387,2,0,2,14,2,15,3,0,10,2,69,2,0,2,70,2,71,2,72,2,0,2,73,2,0,2,11,-1,2,23,3,0,2,2,12,2,4,3,0,18,2,74,2,5,3,0,2,2,75,0,253951,3,19,2,0,122879,2,0,2,8,0,276824064,-2,3,0,2,2,40,2,0,0,4294903295,2,0,2,29,2,7,-1,2,17,2,49,2,0,2,76,2,41,-1,2,20,2,0,2,27,-2,0,128,-2,2,77,2,8,0,4064,-1,2,119,0,4227907585,2,0,2,118,2,0,2,48,2,173,2,9,2,38,2,10,-1,0,74440192,3,0,6,-2,3,0,8,2,12,2,0,2,78,2,9,2,0,2,79,2,80,2,81,-3,2,82,2,13,-3,2,83,2,84,2,85,2,0,2,33,-83,2,0,2,53,2,7,3,0,4,0,817183,2,0,2,14,2,0,0,33023,2,20,3,86,2,-17,2,87,0,524157950,2,4,2,0,2,88,2,4,2,0,2,15,2,77,2,16,3,0,2,2,47,2,0,-1,2,17,-16,3,0,206,-2,3,0,655,2,18,3,0,36,2,68,-1,2,17,2,9,3,0,8,2,89,0,3072,2,0,0,2147516415,2,9,3,0,2,2,23,2,90,2,91,3,0,2,2,92,2,0,2,93,2,94,0,4294965179,0,7,2,0,2,8,2,91,2,8,-1,0,1761345536,2,95,0,4294901823,2,36,2,18,2,96,2,34,2,166,0,2080440287,2,0,2,33,2,143,0,3296722943,2,0,0,1046675455,0,939524101,0,1837055,2,97,2,98,2,15,2,21,3,0,3,0,7,3,0,349,2,99,2,100,2,6,-264,3,0,11,2,22,3,0,2,2,31,-1,0,2700607615,2,101,2,102,3,0,2,2,19,2,103,3,0,10,2,9,2,17,2,0,2,45,2,0,2,30,2,104,-3,2,105,3,0,3,2,18,-1,3,5,2,2,26,2,0,2,7,2,106,-1,2,107,2,108,2,109,-1,3,0,3,2,11,-2,2,0,2,27,-8,2,18,2,0,2,35,-1,2,0,2,62,2,28,2,29,2,9,2,0,2,110,-1,3,0,4,2,9,2,17,2,111,2,6,2,0,2,112,2,0,2,48,-4,3,0,9,2,20,2,29,2,30,-4,2,113,2,114,2,29,2,20,2,7,-2,2,115,2,29,2,31,-2,2,0,2,116,-2,0,4277075969,2,29,-1,3,18,2,-1,2,32,2,117,2,0,3,29,2,2,34,2,19,-3,3,0,2,2,33,-1,2,0,2,34,2,0,2,34,2,0,2,48,-10,2,0,0,197631,-2,2,18,2,43,2,118,-2,2,17,2,117,2,20,2,119,2,51,-2,2,119,2,23,2,17,2,33,2,119,2,36,0,4294901904,0,4718591,2,119,2,34,0,335544350,-1,2,120,2,121,-2,2,122,2,38,2,7,-1,2,123,2,65,0,3758161920,0,3,-4,2,0,2,27,0,2147485568,0,3,2,0,2,23,0,176,-5,2,0,2,47,2,186,-1,2,0,2,23,2,197,-1,2,0,0,16779263,-2,2,11,-7,2,0,2,121,-3,3,0,2,2,124,2,125,0,2147549183,0,2,-2,2,126,2,35,0,10,0,4294965249,0,67633151,0,4026597376,2,0,0,536871935,-1,2,0,2,40,-8,2,54,2,47,0,1,2,127,2,23,-3,2,128,2,35,2,129,2,130,0,16778239,-10,2,34,-5,2,64,-2,3,0,28,2,31,-3,3,0,3,2,47,3,0,6,2,48,-85,3,0,33,2,47,-126,3,0,18,2,36,-269,3,0,17,2,40,2,7,-3,2,17,2,131,2,0,2,23,2,48,2,132,2,23,-21,3,0,2,-4,3,0,2,0,67583,-1,2,103,-2,0,11,3,0,191,2,51,3,0,38,2,29,-1,2,33,-279,3,0,8,2,7,-1,2,133,2,52,3,0,11,2,6,-72,3,0,3,2,134,2,135,-187,3,0,2,2,37,2,0,2,136,2,137,2,55,2,0,2,138,2,139,2,140,3,0,10,2,141,2,142,2,15,3,37,2,3,53,2,3,54,2,2,143,-73,2,0,0,1065361407,0,16384,-11,2,0,2,121,-40,3,0,6,2,117,-1,3,0,2,0,2063,-37,2,55,2,144,2,145,2,146,2,147,2,148,-138,3,0,1334,2,9,-1,3,0,129,2,27,3,0,6,2,9,3,0,180,2,149,3,0,233,0,1,-96,3,0,16,2,9,-47,3,0,154,2,56,-28517,2,0,0,1,-1,2,124,2,0,0,8193,-21,2,193,0,10255,0,4,-11,2,64,2,171,-1,0,71680,-1,2,161,0,4292900864,0,805306431,-5,2,150,-1,2,157,-1,0,6144,-2,2,127,-1,2,154,-1,0,2147532800,2,151,2,165,2,0,2,164,0,524032,0,4,-4,2,190,0,205128192,0,1333757536,0,2147483696,0,423953,0,747766272,0,2717763192,0,4286578751,0,278545,2,152,0,4294886464,0,33292336,0,417809,2,152,0,1327482464,0,4278190128,0,700594195,0,1006647527,0,4286497336,0,4160749631,2,153,0,469762560,0,4171219488,0,8323120,2,153,0,202375680,0,3214918176,0,4294508592,2,153,-1,0,983584,0,48,0,58720273,0,3489923072,0,10517376,0,4293066815,0,1,0,2013265920,2,177,2,0,0,2089,0,3221225552,0,201375904,2,0,-2,0,256,0,122880,0,16777216,2,150,0,4160757760,2,0,-6,2,167,-11,0,3263218176,-1,0,49664,0,2160197632,0,8388802,-1,0,12713984,-1,2,154,2,159,2,178,-2,2,162,-20,0,3758096385,-2,2,155,0,4292878336,2,90,2,169,0,4294057984,-2,2,163,2,156,2,175,-2,2,155,-1,2,182,-1,2,170,2,124,0,4026593280,0,14,0,4292919296,-1,2,158,0,939588608,-1,0,805306368,-1,2,124,0,1610612736,2,156,2,157,2,4,2,0,-2,2,158,2,159,-3,0,267386880,-1,2,160,0,7168,-1,0,65024,2,154,2,161,2,179,-7,2,168,-8,2,162,-1,0,1426112704,2,163,-1,2,164,0,271581216,0,2149777408,2,23,2,161,2,124,0,851967,2,180,-1,2,23,2,181,-4,2,158,-20,2,195,2,165,-56,0,3145728,2,185,-4,2,166,2,124,-4,0,32505856,-1,2,167,-1,0,2147385088,2,90,1,2155905152,2,-3,2,103,2,0,2,168,-2,2,169,-6,2,170,0,4026597375,0,1,-1,0,1,-1,2,171,-3,2,117,2,64,-2,2,166,-2,2,176,2,124,-878,2,159,-36,2,172,-1,2,201,-10,2,188,-5,2,174,-6,0,4294965251,2,27,-1,2,173,-1,2,174,-2,0,4227874752,-3,0,2146435072,2,159,-2,0,1006649344,2,124,-1,2,90,0,201375744,-3,0,134217720,2,90,0,4286677377,0,32896,-1,2,158,-3,2,175,-349,2,176,0,1920,2,177,3,0,264,-11,2,157,-2,2,178,2,0,0,520617856,0,2692743168,0,36,-3,0,524284,-11,2,23,-1,2,187,-1,2,184,0,3221291007,2,178,-1,2,202,0,2158720,-3,2,159,0,1,-4,2,124,0,3808625411,0,3489628288,2,200,0,1207959680,0,3221274624,2,0,-3,2,179,0,120,0,7340032,-2,2,180,2,4,2,23,2,163,3,0,4,2,159,-1,2,181,2,177,-1,0,8176,2,182,2,179,2,183,-1,0,4290773232,2,0,-4,2,163,2,189,0,15728640,2,177,-1,2,161,-1,0,4294934512,3,0,4,-9,2,90,2,170,2,184,3,0,4,0,704,0,1849688064,2,185,-1,2,124,0,4294901887,2,0,0,130547712,0,1879048192,2,199,3,0,2,-1,2,186,2,187,-1,0,17829776,0,2025848832,0,4261477888,-2,2,0,-1,0,4286580608,-1,0,29360128,2,192,0,16252928,0,3791388672,2,38,3,0,2,-2,2,196,2,0,-1,2,103,-1,0,66584576,-1,2,191,3,0,9,2,124,-1,0,4294755328,3,0,2,-1,2,161,2,178,3,0,2,2,23,2,188,2,90,-2,0,245760,0,2147418112,-1,2,150,2,203,0,4227923456,-1,2,164,2,161,2,90,-3,0,4292870145,0,262144,2,124,3,0,2,0,1073758848,2,189,-1,0,4227921920,2,190,0,68289024,0,528402016,0,4292927536,3,0,4,-2,0,268435456,2,91,-2,2,191,3,0,5,-1,2,192,2,163,2,0,-2,0,4227923936,2,62,-1,2,155,2,95,2,0,2,154,2,158,3,0,6,-1,2,177,3,0,3,-2,0,2146959360,0,9440640,0,104857600,0,4227923840,3,0,2,0,768,2,193,2,77,-2,2,161,-2,2,119,-1,2,155,3,0,8,0,512,0,8388608,2,194,2,172,2,187,0,4286578944,3,0,2,0,1152,0,1266679808,2,191,0,576,0,4261707776,2,95,3,0,9,2,155,3,0,5,2,16,-1,0,2147221504,-28,2,178,3,0,3,-3,0,4292902912,-6,2,96,3,0,85,-33,0,4294934528,3,0,126,-18,2,195,3,0,269,-17,2,155,2,124,2,198,3,0,2,2,23,0,4290822144,-2,0,67174336,0,520093700,2,17,3,0,21,-2,2,179,3,0,3,-2,0,30720,-1,0,32512,3,0,2,0,4294770656,-191,2,174,-38,2,170,2,0,2,196,3,0,279,-8,2,124,2,0,0,4294508543,0,65295,-11,2,177,3,0,72,-3,0,3758159872,0,201391616,3,0,155,-7,2,170,-1,0,384,-1,0,133693440,-3,2,196,-2,2,26,3,0,4,2,169,-2,2,90,2,155,3,0,4,-2,2,164,-1,2,150,0,335552923,2,197,-1,0,538974272,0,2214592512,0,132e3,-10,0,192,-8,0,12288,-21,0,134213632,0,4294901761,3,0,42,0,100663424,0,4294965284,3,0,6,-1,0,3221282816,2,198,3,0,11,-1,2,199,3,0,40,-6,0,4286578784,2,0,-2,0,1006694400,3,0,24,2,35,-1,2,94,3,0,2,0,1,2,163,3,0,6,2,197,0,4110942569,0,1432950139,0,2701658217,0,4026532864,0,4026532881,2,0,2,45,3,0,8,-1,2,158,-2,2,169,0,98304,0,65537,2,170,-5,0,4294950912,2,0,2,118,0,65528,2,177,0,4294770176,2,26,3,0,4,-30,2,174,0,3758153728,-3,2,169,-2,2,155,2,188,2,158,-1,2,191,-1,2,161,0,4294754304,3,0,2,-3,0,33554432,-2,2,200,-3,2,169,0,4175478784,2,201,0,4286643712,0,4286644216,2,0,-4,2,202,-1,2,165,0,4227923967,3,0,32,-1334,2,163,2,0,-129,2,94,-6,2,163,-180,2,203,-233,2,4,3,0,96,-16,2,163,3,0,47,-154,2,165,3,0,22381,-7,2,17,3,0,6128],[4294967295,4294967291,4092460543,4294828031,4294967294,134217726,268435455,2147483647,1048575,1073741823,3892314111,134217727,1061158911,536805376,4294910143,4160749567,4294901759,4294901760,536870911,262143,8388607,4294902783,4294918143,65535,67043328,2281701374,4294967232,2097151,4294903807,4194303,255,67108863,4294967039,511,524287,131071,127,4292870143,4294902271,4294549487,33554431,1023,67047423,4294901888,4286578687,4294770687,67043583,32767,15,2047999,67043343,16777215,4294902e3,4294934527,4294966783,4294967279,2047,262083,20511,4290772991,41943039,493567,4294959104,603979775,65536,602799615,805044223,4294965206,8191,1031749119,4294917631,2134769663,4286578493,4282253311,4294942719,33540095,4294905855,4294967264,2868854591,1608515583,265232348,534519807,2147614720,1060109444,4093640016,17376,2139062143,224,4169138175,4294909951,4286578688,4294967292,4294965759,2044,4292870144,4294966272,4294967280,8289918,4294934399,4294901775,4294965375,1602223615,4294967259,4294443008,268369920,4292804608,486341884,4294963199,3087007615,1073692671,4128527,4279238655,4294902015,4294966591,2445279231,3670015,3238002687,31,63,4294967288,4294705151,4095,3221208447,4294549472,2147483648,4285526655,4294966527,4294705152,4294966143,64,4294966719,16383,3774873592,458752,536807423,67043839,3758096383,3959414372,3755993023,2080374783,4294835295,4294967103,4160749565,4087,184024726,2862017156,1593309078,268434431,268434414,4294901763,536870912,2952790016,202506752,139264,402653184,4261412864,4227922944,49152,61440,3758096384,117440512,65280,3233808384,3221225472,2097152,4294965248,32768,57152,67108864,4293918720,4290772992,25165824,57344,4227915776,4278190080,4227907584,65520,4026531840,4227858432,4160749568,3758129152,4294836224,63488,1073741824,4294967040,4194304,251658240,196608,4294963200,64512,417808,4227923712,12582912,50331648,65472,4294967168,4294966784,16,4294917120,2080374784,4096,65408,524288,65532]);function l(e){return e.column++,e.currentChar=e.source.charCodeAt(++e.index)}function c(e,t){if(55296!=(64512&t))return 0;const n=e.source.charCodeAt(e.index+1);return 56320!=(64512&n)?0:(t=e.currentChar=65536+((1023&t)<<10)+(1023&n),0==(1&i[0+(t>>>5)]>>>t)&&o(e,18,p(t)),e.index++,e.column++,1)}function u(e,t){e.currentChar=e.source.charCodeAt(++e.index),e.flags|=1,0==(4&t)&&(e.column=0,e.line++)}function d(e){e.flags|=1,e.currentChar=e.source.charCodeAt(++e.index),e.column=0,e.line++}function p(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(e>>>10)+String.fromCharCode(1023&e)}function f(e){return e<65?e-48:e-65+10&15}const k=[0,0,0,0,0,0,0,0,0,0,1032,0,0,2056,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8192,0,3,0,0,8192,0,0,0,256,0,33024,0,0,242,242,114,114,114,114,114,114,594,594,0,0,16384,0,0,0,0,67,67,67,67,67,67,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,1,0,0,4099,0,71,71,71,71,71,71,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,16384,0,0,0,0],g=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],m=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0];function b(e){return e<=127?g[e]:1&i[34816+(e>>>5)]>>>e}function h(e){return e<=127?m[e]:1&i[0+(e>>>5)]>>>e||8204===e||8205===e}const P=["SingleLine","MultiLine","HTMLOpen","HTMLClose","HashbangComment"];function y(e,t,n,r,s,a,i,l){return 2048&r&&o(e,0),x(e,t,n,s,a,i,l)}function x(e,t,n,o,r,s,a){const{index:i}=e;for(e.tokenPos=e.index,e.linePos=e.line,e.colPos=e.column;e.index<e.end;){if(8&k[e.currentChar]){const n=13===e.currentChar;d(e),n&&e.index<e.end&&10===e.currentChar&&(e.currentChar=t.charCodeAt(++e.index));break}if((8232^e.currentChar)<=1){d(e);break}l(e),e.tokenPos=e.index,e.linePos=e.line,e.colPos=e.column}if(e.onComment){const n={start:{line:s,column:a},end:{line:e.linePos,column:e.colPos}};e.onComment(P[255&o],t.slice(i,e.tokenPos),r,e.tokenPos,n)}return 1|n}function v(e,t,n){const{index:r}=e;for(;e.index<e.end;)if(e.currentChar<43){let o=!1;for(;42===e.currentChar;)if(o||(n&=-5,o=!0),47===l(e)){if(l(e),e.onComment){const n={start:{line:e.linePos,column:e.colPos},end:{line:e.line,column:e.column}};e.onComment(P[1],t.slice(r,e.index-2),r-2,e.index,n)}return e.tokenPos=e.index,e.linePos=e.line,e.colPos=e.column,n}if(o)continue;8&k[e.currentChar]?13===e.currentChar?(n|=5,d(e)):(u(e,n),n=-5&n|1):l(e)}else(8232^e.currentChar)<=1?(n=-5&n|1,d(e)):(n&=-5,l(e));o(e,16)}function w(e,t){const n=e.index;let r=0;e:for(;;){const t=e.currentChar;if(l(e),1&r)r&=-2;else switch(t){case 47:if(r)break;break e;case 92:r|=1;break;case 91:r|=2;break;case 93:r&=1;break;case 13:case 10:case 8232:case 8233:o(e,32)}if(e.index>=e.source.length)return o(e,32)}const s=e.index-1;let a=0,i=e.currentChar;const{index:c}=e;for(;h(i);){switch(i){case 103:2&a&&o(e,34,"g"),a|=2;break;case 105:1&a&&o(e,34,"i"),a|=1;break;case 109:4&a&&o(e,34,"m"),a|=4;break;case 117:16&a&&o(e,34,"u"),a|=16;break;case 121:8&a&&o(e,34,"y"),a|=8;break;case 115:32&a&&o(e,34,"s"),a|=32;break;case 100:64&a&&o(e,34,"d"),a|=64;break;default:o(e,33)}i=l(e)}const u=e.source.slice(c,e.index),d=e.source.slice(n,s);return e.tokenRegExp={pattern:d,flags:u},512&t&&(e.tokenRaw=e.source.slice(e.tokenPos,e.index)),e.tokenValue=function(e,t,n){try{return new RegExp(t,n)}catch(r){try{return new RegExp(t,n.replace("d","")),null}catch(t){o(e,32)}}}(e,d,u),65540}function q(e,t,n){const{index:r}=e;let s="",a=l(e),i=e.index;for(;0==(8&k[a]);){if(a===n)return s+=e.source.slice(i,e.index),l(e),512&t&&(e.tokenRaw=e.source.slice(r,e.index)),e.tokenValue=s,134283267;if(8==(8&a)&&92===a){if(s+=e.source.slice(i,e.index),a=l(e),a<127||8232===a||8233===a){const n=C(e,t,a);n>=0?s+=p(n):E(e,n,0)}else s+=p(a);i=e.index+1}e.index>=e.end&&o(e,14),a=l(e)}o(e,14)}function C(e,t,n){switch(n){case 98:return 8;case 102:return 12;case 114:return 13;case 110:return 10;case 116:return 9;case 118:return 11;case 13:if(e.index<e.end){const t=e.source.charCodeAt(e.index+1);10===t&&(e.index=e.index+1,e.currentChar=t)}case 10:case 8232:case 8233:return e.column=-1,e.line++,-1;case 48:case 49:case 50:case 51:{let o=n-48,r=e.index+1,s=e.column+1;if(r<e.end){const n=e.source.charCodeAt(r);if(0==(32&k[n])){if((0!==o||512&k[n])&&1024&t)return-2}else{if(1024&t)return-2;if(e.currentChar=n,o=o<<3|n-48,r++,s++,r<e.end){const t=e.source.charCodeAt(r);32&k[t]&&(e.currentChar=t,o=o<<3|t-48,r++,s++)}e.flags|=64,e.index=r-1,e.column=s-1}}return o}case 52:case 53:case 54:case 55:{if(1024&t)return-2;let o=n-48;const r=e.index+1,s=e.column+1;if(r<e.end){const t=e.source.charCodeAt(r);32&k[t]&&(o=o<<3|t-48,e.currentChar=t,e.index=r,e.column=s)}return e.flags|=64,o}case 120:{const t=l(e);if(0==(64&k[t]))return-4;const n=f(t),o=l(e);if(0==(64&k[o]))return-4;return n<<4|f(o)}case 117:{const t=l(e);if(123===e.currentChar){let t=0;for(;0!=(64&k[l(e)]);)if(t=t<<4|f(e.currentChar),t>1114111)return-5;return e.currentChar<1||125!==e.currentChar?-4:t}{if(0==(64&k[t]))return-4;const n=e.source.charCodeAt(e.index+1);if(0==(64&k[n]))return-4;const o=e.source.charCodeAt(e.index+2);if(0==(64&k[o]))return-4;const r=e.source.charCodeAt(e.index+3);return 0==(64&k[r])?-4:(e.index+=3,e.column+=3,e.currentChar=e.source.charCodeAt(e.index),f(t)<<12|f(n)<<8|f(o)<<4|f(r))}}case 56:case 57:if(0==(256&t))return-3;default:return n}}function E(e,t,n){switch(t){case-1:return;case-2:o(e,n?2:1);case-3:o(e,13);case-4:o(e,6);case-5:o(e,102)}}function S(e,t){const{index:n}=e;let r=67174409,s="",a=l(e);for(;96!==a;){if(36===a&&123===e.source.charCodeAt(e.index+1)){l(e),r=67174408;break}if(8==(8&a)&&92===a)if(a=l(e),a>126)s+=p(a);else{const n=C(e,1024|t,a);if(n>=0)s+=p(n);else{if(-1!==n&&65536&t){s=void 0,a=A(e,a),a<0&&(r=67174408);break}E(e,n,1)}}else e.index<e.end&&13===a&&10===e.source.charCodeAt(e.index)&&(s+=p(a),e.currentChar=e.source.charCodeAt(++e.index)),((83&a)<3&&10===a||(8232^a)<=1)&&(e.column=-1,e.line++),s+=p(a);e.index>=e.end&&o(e,15),a=l(e)}return l(e),e.tokenValue=s,e.tokenRaw=e.source.slice(n+1,e.index-(67174409===r?1:2)),r}function A(e,t){for(;96!==t;){switch(t){case 36:{const n=e.index+1;if(n<e.end&&123===e.source.charCodeAt(n))return e.index=n,e.column++,-t;break}case 10:case 8232:case 8233:e.column=-1,e.line++}e.index>=e.end&&o(e,15),t=l(e)}return t}function D(e,t){return e.index>=e.end&&o(e,0),e.index--,e.column--,S(e,t)}function L(e,t,n){let r=e.currentChar,s=0,i=9,c=64&n?0:1,u=0,d=0;if(64&n)s="."+V(e,r),r=e.currentChar,110===r&&o(e,11);else{if(48===r)if(r=l(e),120==(32|r)){for(n=136,r=l(e);4160&k[r];)95!==r?(d=1,s=16*s+f(r),u++,r=l(e)):(d||o(e,147),d=0,r=l(e));0!==u&&d||o(e,0===u?19:148)}else if(111==(32|r)){for(n=132,r=l(e);4128&k[r];)95!==r?(d=1,s=8*s+(r-48),u++,r=l(e)):(d||o(e,147),d=0,r=l(e));0!==u&&d||o(e,0===u?0:148)}else if(98==(32|r)){for(n=130,r=l(e);4224&k[r];)95!==r?(d=1,s=2*s+(r-48),u++,r=l(e)):(d||o(e,147),d=0,r=l(e));0!==u&&d||o(e,0===u?0:148)}else if(32&k[r])for(1024&t&&o(e,1),n=1;16&k[r];){if(512&k[r]){n=32,c=0;break}s=8*s+(r-48),r=l(e)}else 512&k[r]?(1024&t&&o(e,1),e.flags|=64,n=32):95===r&&o(e,0);if(48&n){if(c){for(;i>=0&&4112&k[r];)95!==r?(d=0,s=10*s+(r-48),r=l(e),--i):(r=l(e),(95===r||32&n)&&a(e.index,e.line,e.index+1,147),d=1);if(d&&a(e.index,e.line,e.index+1,148),i>=0&&!b(r)&&46!==r)return e.tokenValue=s,512&t&&(e.tokenRaw=e.source.slice(e.tokenPos,e.index)),134283266}s+=V(e,r),r=e.currentChar,46===r&&(95===l(e)&&o(e,0),n=64,s+="."+V(e,e.currentChar),r=e.currentChar)}}const p=e.index;let g=0;if(110===r&&128&n)g=1,r=l(e);else if(101==(32|r)){r=l(e),256&k[r]&&(r=l(e));const{index:t}=e;0==(16&k[r])&&o(e,10),s+=e.source.substring(p,t)+V(e,r),r=e.currentChar}return(e.index<e.end&&16&k[r]||b(r))&&o(e,12),g?(e.tokenRaw=e.source.slice(e.tokenPos,e.index),e.tokenValue=BigInt(s),134283389):(e.tokenValue=15&n?s:32&n?parseFloat(e.source.substring(e.tokenPos,e.index)):+s,512&t&&(e.tokenRaw=e.source.slice(e.tokenPos,e.index)),134283266)}function V(e,t){let n=0,o=e.index,r="";for(;4112&k[t];)if(95!==t)n=0,t=l(e);else{const{index:s}=e;95===(t=l(e))&&a(e.index,e.line,e.index+1,147),n=1,r+=e.source.substring(o,s),o=e.index}return n&&a(e.index,e.line,e.index+1,148),r+e.source.substring(o,e.index)}const T=["end of source","identifier","number","string","regular expression","false","true","null","template continuation","template tail","=>","(","{",".","...","}",")",";",",","[","]",":","?","'",'"',"</","/>","++","--","=","<<=",">>=",">>>=","**=","+=","-=","*=","/=","%=","^=","|=","&=","||=","&&=","??=","typeof","delete","void","!","~","+","-","in","instanceof","*","%","/","**","&&","||","===","!==","==","!=","<=",">=","<",">","<<",">>",">>>","&","|","^","var","let","const","break","case","catch","class","continue","debugger","default","do","else","export","extends","finally","for","function","if","import","new","return","super","switch","this","throw","try","while","with","implements","interface","package","private","protected","public","static","yield","as","async","await","constructor","get","set","from","of","enum","eval","arguments","escaped keyword","escaped future reserved keyword","reserved if strict","#","BigIntLiteral","??","?.","WhiteSpace","Illegal","LineTerminator","PrivateField","Template","@","target","meta","LineFeed","Escaped","JSXText"],R=Object.create(null,{this:{value:86113},function:{value:86106},if:{value:20571},return:{value:20574},var:{value:86090},else:{value:20565},for:{value:20569},new:{value:86109},in:{value:8738868},typeof:{value:16863277},while:{value:20580},case:{value:20558},break:{value:20557},try:{value:20579},catch:{value:20559},delete:{value:16863278},throw:{value:86114},switch:{value:86112},continue:{value:20561},default:{value:20563},instanceof:{value:8476725},do:{value:20564},void:{value:16863279},finally:{value:20568},async:{value:209007},await:{value:209008},class:{value:86096},const:{value:86092},constructor:{value:12401},debugger:{value:20562},export:{value:20566},extends:{value:20567},false:{value:86021},from:{value:12404},get:{value:12402},implements:{value:36966},import:{value:86108},interface:{value:36967},let:{value:241739},null:{value:86023},of:{value:274549},package:{value:36968},private:{value:36969},protected:{value:36970},public:{value:36971},set:{value:12403},static:{value:36972},super:{value:86111},true:{value:86022},with:{value:20581},yield:{value:241773},enum:{value:86134},eval:{value:537079927},as:{value:77934},arguments:{value:537079928},target:{value:143494},meta:{value:143495}});function I(e,t,n){for(;m[l(e)];);return e.tokenValue=e.source.slice(e.tokenPos,e.index),92!==e.currentChar&&e.currentChar<=126?R[e.tokenValue]||208897:U(e,t,0,n)}function N(e,t){const n=O(e);return h(n)||o(e,4),e.tokenValue=p(n),U(e,t,1,4&k[n])}function U(e,t,n,r){let s=e.index;for(;e.index<e.end;)if(92===e.currentChar){e.tokenValue+=e.source.slice(s,e.index),n=1;const t=O(e);h(t)||o(e,4),r=r&&4&k[t],e.tokenValue+=p(t),s=e.index}else{if(!h(e.currentChar)&&!c(e,e.currentChar))break;l(e)}e.index<=e.end&&(e.tokenValue+=e.source.slice(s,e.index));const a=e.tokenValue.length;if(r&&a>=2&&a<=11){const o=R[e.tokenValue];return void 0===o?208897:n?209008===o?0==(4196352&t)?o:121:1024&t?36972===o||36864==(36864&o)?122:20480==(20480&o)?1073741824&t&&0==(8192&t)?o:121:143483:1073741824&t&&0==(8192&t)&&20480==(20480&o)?o:241773===o?1073741824&t?143483:2097152&t?121:o:209007===o?143483:36864==(36864&o)?o:121:o}return 208897}function B(e){return b(l(e))||o(e,94),131}function O(e){return 117!==e.source.charCodeAt(e.index+1)&&o(e,4),e.currentChar=e.source.charCodeAt(e.index+=2),function(e){let t=0;const n=e.currentChar;if(123===n){const n=e.index-2;for(;64&k[l(e)];)t=t<<4|f(e.currentChar),t>1114111&&a(n,e.line,e.index+1,102);return 125!==e.currentChar&&a(n,e.line,e.index-1,6),l(e),t}0==(64&k[n])&&o(e,6);const r=e.source.charCodeAt(e.index+1);0==(64&k[r])&&o(e,6);const s=e.source.charCodeAt(e.index+2);0==(64&k[s])&&o(e,6);const i=e.source.charCodeAt(e.index+3);0==(64&k[i])&&o(e,6);return t=f(n)<<12|f(r)<<8|f(s)<<4|f(i),e.currentChar=e.source.charCodeAt(e.index+=4),t}(e)}const G=[129,129,129,129,129,129,129,129,129,128,136,128,128,130,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,128,16842800,134283267,131,208897,8457015,8455751,134283267,67174411,16,8457014,25233970,18,25233971,67108877,8457016,134283266,134283266,134283266,134283266,134283266,134283266,134283266,134283266,134283266,134283266,21,1074790417,8456258,1077936157,8456259,22,133,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,208897,69271571,137,20,8455497,208897,132,4096,4096,4096,4096,4096,4096,4096,208897,4096,208897,208897,4096,208897,4096,208897,4096,208897,4096,4096,4096,208897,4096,4096,208897,4096,4096,2162700,8455240,1074790415,16842801,129];function j(e,t){if(e.flags=1^(1|e.flags),e.startPos=e.index,e.startColumn=e.column,e.startLine=e.line,e.token=F(e,t,0),e.onToken&&1048576!==e.token){const t={start:{line:e.linePos,column:e.colPos},end:{line:e.line,column:e.column}};e.onToken(function(e){switch(e){case 134283266:return"NumericLiteral";case 134283267:return"StringLiteral";case 86021:case 86022:return"BooleanLiteral";case 86023:return"NullLiteral";case 65540:return"RegularExpression";case 67174408:case 67174409:case 132:return"TemplateLiteral";default:return 143360==(143360&e)?"Identifier":4096==(4096&e)?"Keyword":"Punctuator"}}(e.token),e.tokenPos,e.index,t)}}function F(e,t,n){const r=0===e.index,s=e.source;let a=e.index,c=e.line,f=e.column;for(;e.index<e.end;){e.tokenPos=e.index,e.colPos=e.column,e.linePos=e.line;let g=e.currentChar;if(g<=126){const i=G[g];switch(i){case 67174411:case 16:case 2162700:case 1074790415:case 69271571:case 20:case 21:case 1074790417:case 18:case 16842801:case 133:case 129:return l(e),i;case 208897:return I(e,t,0);case 4096:return I(e,t,1);case 134283266:return L(e,t,144);case 134283267:return q(e,t,g);case 132:return S(e,t);case 137:return N(e,t);case 131:return B(e);case 128:l(e);break;case 130:n|=5,d(e);break;case 136:u(e,n),n=-5&n|1;break;case 8456258:let p=l(e);if(e.index<e.end){if(60===p)return e.index<e.end&&61===l(e)?(l(e),4194334):8456516;if(61===p)return l(e),8456256;if(33===p){const o=e.index+1;if(o+1<e.end&&45===s.charCodeAt(o)&&45==s.charCodeAt(o+1)){e.column+=3,e.currentChar=s.charCodeAt(e.index+=3),n=y(e,s,n,t,2,e.tokenPos,e.linePos,e.colPos),a=e.tokenPos,c=e.linePos,f=e.colPos;continue}return 8456258}if(47===p){if(0==(16&t))return 8456258;const n=e.index+1;if(n<e.end&&(p=s.charCodeAt(n),42===p||47===p))break;return l(e),25}}return 8456258;case 1077936157:{l(e);const t=e.currentChar;return 61===t?61===l(e)?(l(e),8455996):8455998:62===t?(l(e),10):1077936157}case 16842800:return 61!==l(e)?16842800:61!==l(e)?8455999:(l(e),8455997);case 8457015:return 61!==l(e)?8457015:(l(e),4194342);case 8457014:{if(l(e),e.index>=e.end)return 8457014;const t=e.currentChar;return 61===t?(l(e),4194340):42!==t?8457014:61!==l(e)?8457273:(l(e),4194337)}case 8455497:return 61!==l(e)?8455497:(l(e),4194343);case 25233970:{l(e);const t=e.currentChar;return 43===t?(l(e),33619995):61===t?(l(e),4194338):25233970}case 25233971:{l(e);const i=e.currentChar;if(45===i){if(l(e),(1&n||r)&&62===e.currentChar){0==(256&t)&&o(e,109),l(e),n=y(e,s,n,t,3,a,c,f),a=e.tokenPos,c=e.linePos,f=e.colPos;continue}return 33619996}return 61===i?(l(e),4194339):25233971}case 8457016:if(l(e),e.index<e.end){const o=e.currentChar;if(47===o){l(e),n=x(e,s,n,0,e.tokenPos,e.linePos,e.colPos),a=e.tokenPos,c=e.linePos,f=e.colPos;continue}if(42===o){l(e),n=v(e,s,n),a=e.tokenPos,c=e.linePos,f=e.colPos;continue}if(32768&t)return w(e,t);if(61===o)return l(e),4259877}return 8457016;case 67108877:const k=l(e);if(k>=48&&k<=57)return L(e,t,80);if(46===k){const t=e.index+1;if(t<e.end&&46===s.charCodeAt(t))return e.column+=2,e.currentChar=s.charCodeAt(e.index+=2),14}return 67108877;case 8455240:{l(e);const t=e.currentChar;return 124===t?(l(e),61===e.currentChar?(l(e),4194346):8979003):61===t?(l(e),4194344):8455240}case 8456259:{l(e);const t=e.currentChar;if(61===t)return l(e),8456257;if(62!==t)return 8456259;if(l(e),e.index<e.end){const t=e.currentChar;if(62===t)return 61===l(e)?(l(e),4194336):8456518;if(61===t)return l(e),4194335}return 8456517}case 8455751:{l(e);const t=e.currentChar;return 38===t?(l(e),61===e.currentChar?(l(e),4194347):8979258):61===t?(l(e),4194345):8455751}case 22:{let t=l(e);if(63===t)return l(e),61===e.currentChar?(l(e),4194348):276889982;if(46===t){const n=e.index+1;if(n<e.end&&(t=s.charCodeAt(n),!(t>=48&&t<=57)))return l(e),67108991}return 22}}}else{if((8232^g)<=1){n=-5&n|1,d(e);continue}if(55296==(64512&g)||0!=(1&i[34816+(g>>>5)]>>>g))return 56320==(64512&g)&&(g=(1023&g)<<10|1023&g|65536,0==(1&i[0+(g>>>5)]>>>g)&&o(e,18,p(g)),e.index++,e.currentChar=g),e.column++,e.tokenValue="",U(e,t,0,0);if(160===(k=g)||65279===k||133===k||5760===k||k>=8192&&k<=8203||8239===k||8287===k||12288===k||8201===k||65519===k){l(e);continue}o(e,18,p(g))}}var k;return 1048576}const H={AElig:"Æ",AMP:"&",Aacute:"Á",Abreve:"Ă",Acirc:"Â",Acy:"А",Afr:"𝔄",Agrave:"À",Alpha:"Α",Amacr:"Ā",And:"⩓",Aogon:"Ą",Aopf:"𝔸",ApplyFunction:"⁡",Aring:"Å",Ascr:"𝒜",Assign:"≔",Atilde:"Ã",Auml:"Ä",Backslash:"∖",Barv:"⫧",Barwed:"⌆",Bcy:"Б",Because:"∵",Bernoullis:"ℬ",Beta:"Β",Bfr:"𝔅",Bopf:"𝔹",Breve:"˘",Bscr:"ℬ",Bumpeq:"≎",CHcy:"Ч",COPY:"©",Cacute:"Ć",Cap:"⋒",CapitalDifferentialD:"ⅅ",Cayleys:"ℭ",Ccaron:"Č",Ccedil:"Ç",Ccirc:"Ĉ",Cconint:"∰",Cdot:"Ċ",Cedilla:"¸",CenterDot:"·",Cfr:"ℭ",Chi:"Χ",CircleDot:"⊙",CircleMinus:"⊖",CirclePlus:"⊕",CircleTimes:"⊗",ClockwiseContourIntegral:"∲",CloseCurlyDoubleQuote:"”",CloseCurlyQuote:"’",Colon:"∷",Colone:"⩴",Congruent:"≡",Conint:"∯",ContourIntegral:"∮",Copf:"ℂ",Coproduct:"∐",CounterClockwiseContourIntegral:"∳",Cross:"⨯",Cscr:"𝒞",Cup:"⋓",CupCap:"≍",DD:"ⅅ",DDotrahd:"⤑",DJcy:"Ђ",DScy:"Ѕ",DZcy:"Џ",Dagger:"‡",Darr:"↡",Dashv:"⫤",Dcaron:"Ď",Dcy:"Д",Del:"∇",Delta:"Δ",Dfr:"𝔇",DiacriticalAcute:"´",DiacriticalDot:"˙",DiacriticalDoubleAcute:"˝",DiacriticalGrave:"`",DiacriticalTilde:"˜",Diamond:"⋄",DifferentialD:"ⅆ",Dopf:"𝔻",Dot:"¨",DotDot:"⃜",DotEqual:"≐",DoubleContourIntegral:"∯",DoubleDot:"¨",DoubleDownArrow:"⇓",DoubleLeftArrow:"⇐",DoubleLeftRightArrow:"⇔",DoubleLeftTee:"⫤",DoubleLongLeftArrow:"⟸",DoubleLongLeftRightArrow:"⟺",DoubleLongRightArrow:"⟹",DoubleRightArrow:"⇒",DoubleRightTee:"⊨",DoubleUpArrow:"⇑",DoubleUpDownArrow:"⇕",DoubleVerticalBar:"∥",DownArrow:"↓",DownArrowBar:"⤓",DownArrowUpArrow:"⇵",DownBreve:"̑",DownLeftRightVector:"⥐",DownLeftTeeVector:"⥞",DownLeftVector:"↽",DownLeftVectorBar:"⥖",DownRightTeeVector:"⥟",DownRightVector:"⇁",DownRightVectorBar:"⥗",DownTee:"⊤",DownTeeArrow:"↧",Downarrow:"⇓",Dscr:"𝒟",Dstrok:"Đ",ENG:"Ŋ",ETH:"Ð",Eacute:"É",Ecaron:"Ě",Ecirc:"Ê",Ecy:"Э",Edot:"Ė",Efr:"𝔈",Egrave:"È",Element:"∈",Emacr:"Ē",EmptySmallSquare:"◻",EmptyVerySmallSquare:"▫",Eogon:"Ę",Eopf:"𝔼",Epsilon:"Ε",Equal:"⩵",EqualTilde:"≂",Equilibrium:"⇌",Escr:"ℰ",Esim:"⩳",Eta:"Η",Euml:"Ë",Exists:"∃",ExponentialE:"ⅇ",Fcy:"Ф",Ffr:"𝔉",FilledSmallSquare:"◼",FilledVerySmallSquare:"▪",Fopf:"𝔽",ForAll:"∀",Fouriertrf:"ℱ",Fscr:"ℱ",GJcy:"Ѓ",GT:">",Gamma:"Γ",Gammad:"Ϝ",Gbreve:"Ğ",Gcedil:"Ģ",Gcirc:"Ĝ",Gcy:"Г",Gdot:"Ġ",Gfr:"𝔊",Gg:"⋙",Gopf:"𝔾",GreaterEqual:"≥",GreaterEqualLess:"⋛",GreaterFullEqual:"≧",GreaterGreater:"⪢",GreaterLess:"≷",GreaterSlantEqual:"⩾",GreaterTilde:"≳",Gscr:"𝒢",Gt:"≫",HARDcy:"Ъ",Hacek:"ˇ",Hat:"^",Hcirc:"Ĥ",Hfr:"ℌ",HilbertSpace:"ℋ",Hopf:"ℍ",HorizontalLine:"─",Hscr:"ℋ",Hstrok:"Ħ",HumpDownHump:"≎",HumpEqual:"≏",IEcy:"Е",IJlig:"Ĳ",IOcy:"Ё",Iacute:"Í",Icirc:"Î",Icy:"И",Idot:"İ",Ifr:"ℑ",Igrave:"Ì",Im:"ℑ",Imacr:"Ī",ImaginaryI:"ⅈ",Implies:"⇒",Int:"∬",Integral:"∫",Intersection:"⋂",InvisibleComma:"⁣",InvisibleTimes:"⁢",Iogon:"Į",Iopf:"𝕀",Iota:"Ι",Iscr:"ℐ",Itilde:"Ĩ",Iukcy:"І",Iuml:"Ï",Jcirc:"Ĵ",Jcy:"Й",Jfr:"𝔍",Jopf:"𝕁",Jscr:"𝒥",Jsercy:"Ј",Jukcy:"Є",KHcy:"Х",KJcy:"Ќ",Kappa:"Κ",Kcedil:"Ķ",Kcy:"К",Kfr:"𝔎",Kopf:"𝕂",Kscr:"𝒦",LJcy:"Љ",LT:"<",Lacute:"Ĺ",Lambda:"Λ",Lang:"⟪",Laplacetrf:"ℒ",Larr:"↞",Lcaron:"Ľ",Lcedil:"Ļ",Lcy:"Л",LeftAngleBracket:"⟨",LeftArrow:"←",LeftArrowBar:"⇤",LeftArrowRightArrow:"⇆",LeftCeiling:"⌈",LeftDoubleBracket:"⟦",LeftDownTeeVector:"⥡",LeftDownVector:"⇃",LeftDownVectorBar:"⥙",LeftFloor:"⌊",LeftRightArrow:"↔",LeftRightVector:"⥎",LeftTee:"⊣",LeftTeeArrow:"↤",LeftTeeVector:"⥚",LeftTriangle:"⊲",LeftTriangleBar:"⧏",LeftTriangleEqual:"⊴",LeftUpDownVector:"⥑",LeftUpTeeVector:"⥠",LeftUpVector:"↿",LeftUpVectorBar:"⥘",LeftVector:"↼",LeftVectorBar:"⥒",Leftarrow:"⇐",Leftrightarrow:"⇔",LessEqualGreater:"⋚",LessFullEqual:"≦",LessGreater:"≶",LessLess:"⪡",LessSlantEqual:"⩽",LessTilde:"≲",Lfr:"𝔏",Ll:"⋘",Lleftarrow:"⇚",Lmidot:"Ŀ",LongLeftArrow:"⟵",LongLeftRightArrow:"⟷",LongRightArrow:"⟶",Longleftarrow:"⟸",Longleftrightarrow:"⟺",Longrightarrow:"⟹",Lopf:"𝕃",LowerLeftArrow:"↙",LowerRightArrow:"↘",Lscr:"ℒ",Lsh:"↰",Lstrok:"Ł",Lt:"≪",Map:"⤅",Mcy:"М",MediumSpace:" ",Mellintrf:"ℳ",Mfr:"𝔐",MinusPlus:"∓",Mopf:"𝕄",Mscr:"ℳ",Mu:"Μ",NJcy:"Њ",Nacute:"Ń",Ncaron:"Ň",Ncedil:"Ņ",Ncy:"Н",NegativeMediumSpace:"​",NegativeThickSpace:"​",NegativeThinSpace:"​",NegativeVeryThinSpace:"​",NestedGreaterGreater:"≫",NestedLessLess:"≪",NewLine:"\n",Nfr:"𝔑",NoBreak:"⁠",NonBreakingSpace:" ",Nopf:"ℕ",Not:"⫬",NotCongruent:"≢",NotCupCap:"≭",NotDoubleVerticalBar:"∦",NotElement:"∉",NotEqual:"≠",NotEqualTilde:"≂̸",NotExists:"∄",NotGreater:"≯",NotGreaterEqual:"≱",NotGreaterFullEqual:"≧̸",NotGreaterGreater:"≫̸",NotGreaterLess:"≹",NotGreaterSlantEqual:"⩾̸",NotGreaterTilde:"≵",NotHumpDownHump:"≎̸",NotHumpEqual:"≏̸",NotLeftTriangle:"⋪",NotLeftTriangleBar:"⧏̸",NotLeftTriangleEqual:"⋬",NotLess:"≮",NotLessEqual:"≰",NotLessGreater:"≸",NotLessLess:"≪̸",NotLessSlantEqual:"⩽̸",NotLessTilde:"≴",NotNestedGreaterGreater:"⪢̸",NotNestedLessLess:"⪡̸",NotPrecedes:"⊀",NotPrecedesEqual:"⪯̸",NotPrecedesSlantEqual:"⋠",NotReverseElement:"∌",NotRightTriangle:"⋫",NotRightTriangleBar:"⧐̸",NotRightTriangleEqual:"⋭",NotSquareSubset:"⊏̸",NotSquareSubsetEqual:"⋢",NotSquareSuperset:"⊐̸",NotSquareSupersetEqual:"⋣",NotSubset:"⊂⃒",NotSubsetEqual:"⊈",NotSucceeds:"⊁",NotSucceedsEqual:"⪰̸",NotSucceedsSlantEqual:"⋡",NotSucceedsTilde:"≿̸",NotSuperset:"⊃⃒",NotSupersetEqual:"⊉",NotTilde:"≁",NotTildeEqual:"≄",NotTildeFullEqual:"≇",NotTildeTilde:"≉",NotVerticalBar:"∤",Nscr:"𝒩",Ntilde:"Ñ",Nu:"Ν",OElig:"Œ",Oacute:"Ó",Ocirc:"Ô",Ocy:"О",Odblac:"Ő",Ofr:"𝔒",Ograve:"Ò",Omacr:"Ō",Omega:"Ω",Omicron:"Ο",Oopf:"𝕆",OpenCurlyDoubleQuote:"“",OpenCurlyQuote:"‘",Or:"⩔",Oscr:"𝒪",Oslash:"Ø",Otilde:"Õ",Otimes:"⨷",Ouml:"Ö",OverBar:"‾",OverBrace:"⏞",OverBracket:"⎴",OverParenthesis:"⏜",PartialD:"∂",Pcy:"П",Pfr:"𝔓",Phi:"Φ",Pi:"Π",PlusMinus:"±",Poincareplane:"ℌ",Popf:"ℙ",Pr:"⪻",Precedes:"≺",PrecedesEqual:"⪯",PrecedesSlantEqual:"≼",PrecedesTilde:"≾",Prime:"″",Product:"∏",Proportion:"∷",Proportional:"∝",Pscr:"𝒫",Psi:"Ψ",QUOT:'"',Qfr:"𝔔",Qopf:"ℚ",Qscr:"𝒬",RBarr:"⤐",REG:"®",Racute:"Ŕ",Rang:"⟫",Rarr:"↠",Rarrtl:"⤖",Rcaron:"Ř",Rcedil:"Ŗ",Rcy:"Р",Re:"ℜ",ReverseElement:"∋",ReverseEquilibrium:"⇋",ReverseUpEquilibrium:"⥯",Rfr:"ℜ",Rho:"Ρ",RightAngleBracket:"⟩",RightArrow:"→",RightArrowBar:"⇥",RightArrowLeftArrow:"⇄",RightCeiling:"⌉",RightDoubleBracket:"⟧",RightDownTeeVector:"⥝",RightDownVector:"⇂",RightDownVectorBar:"⥕",RightFloor:"⌋",RightTee:"⊢",RightTeeArrow:"↦",RightTeeVector:"⥛",RightTriangle:"⊳",RightTriangleBar:"⧐",RightTriangleEqual:"⊵",RightUpDownVector:"⥏",RightUpTeeVector:"⥜",RightUpVector:"↾",RightUpVectorBar:"⥔",RightVector:"⇀",RightVectorBar:"⥓",Rightarrow:"⇒",Ropf:"ℝ",RoundImplies:"⥰",Rrightarrow:"⇛",Rscr:"ℛ",Rsh:"↱",RuleDelayed:"⧴",SHCHcy:"Щ",SHcy:"Ш",SOFTcy:"Ь",Sacute:"Ś",Sc:"⪼",Scaron:"Š",Scedil:"Ş",Scirc:"Ŝ",Scy:"С",Sfr:"𝔖",ShortDownArrow:"↓",ShortLeftArrow:"←",ShortRightArrow:"→",ShortUpArrow:"↑",Sigma:"Σ",SmallCircle:"∘",Sopf:"𝕊",Sqrt:"√",Square:"□",SquareIntersection:"⊓",SquareSubset:"⊏",SquareSubsetEqual:"⊑",SquareSuperset:"⊐",SquareSupersetEqual:"⊒",SquareUnion:"⊔",Sscr:"𝒮",Star:"⋆",Sub:"⋐",Subset:"⋐",SubsetEqual:"⊆",Succeeds:"≻",SucceedsEqual:"⪰",SucceedsSlantEqual:"≽",SucceedsTilde:"≿",SuchThat:"∋",Sum:"∑",Sup:"⋑",Superset:"⊃",SupersetEqual:"⊇",Supset:"⋑",THORN:"Þ",TRADE:"™",TSHcy:"Ћ",TScy:"Ц",Tab:"\t",Tau:"Τ",Tcaron:"Ť",Tcedil:"Ţ",Tcy:"Т",Tfr:"𝔗",Therefore:"∴",Theta:"Θ",ThickSpace:"  ",ThinSpace:" ",Tilde:"∼",TildeEqual:"≃",TildeFullEqual:"≅",TildeTilde:"≈",Topf:"𝕋",TripleDot:"⃛",Tscr:"𝒯",Tstrok:"Ŧ",Uacute:"Ú",Uarr:"↟",Uarrocir:"⥉",Ubrcy:"Ў",Ubreve:"Ŭ",Ucirc:"Û",Ucy:"У",Udblac:"Ű",Ufr:"𝔘",Ugrave:"Ù",Umacr:"Ū",UnderBar:"_",UnderBrace:"⏟",UnderBracket:"⎵",UnderParenthesis:"⏝",Union:"⋃",UnionPlus:"⊎",Uogon:"Ų",Uopf:"𝕌",UpArrow:"↑",UpArrowBar:"⤒",UpArrowDownArrow:"⇅",UpDownArrow:"↕",UpEquilibrium:"⥮",UpTee:"⊥",UpTeeArrow:"↥",Uparrow:"⇑",Updownarrow:"⇕",UpperLeftArrow:"↖",UpperRightArrow:"↗",Upsi:"ϒ",Upsilon:"Υ",Uring:"Ů",Uscr:"𝒰",Utilde:"Ũ",Uuml:"Ü",VDash:"⊫",Vbar:"⫫",Vcy:"В",Vdash:"⊩",Vdashl:"⫦",Vee:"⋁",Verbar:"‖",Vert:"‖",VerticalBar:"∣",VerticalLine:"|",VerticalSeparator:"❘",VerticalTilde:"≀",VeryThinSpace:" ",Vfr:"𝔙",Vopf:"𝕍",Vscr:"𝒱",Vvdash:"⊪",Wcirc:"Ŵ",Wedge:"⋀",Wfr:"𝔚",Wopf:"𝕎",Wscr:"𝒲",Xfr:"𝔛",Xi:"Ξ",Xopf:"𝕏",Xscr:"𝒳",YAcy:"Я",YIcy:"Ї",YUcy:"Ю",Yacute:"Ý",Ycirc:"Ŷ",Ycy:"Ы",Yfr:"𝔜",Yopf:"𝕐",Yscr:"𝒴",Yuml:"Ÿ",ZHcy:"Ж",Zacute:"Ź",Zcaron:"Ž",Zcy:"З",Zdot:"Ż",ZeroWidthSpace:"​",Zeta:"Ζ",Zfr:"ℨ",Zopf:"ℤ",Zscr:"𝒵",aacute:"á",abreve:"ă",ac:"∾",acE:"∾̳",acd:"∿",acirc:"â",acute:"´",acy:"а",aelig:"æ",af:"⁡",afr:"𝔞",agrave:"à",alefsym:"ℵ",aleph:"ℵ",alpha:"α",amacr:"ā",amalg:"⨿",amp:"&",and:"∧",andand:"⩕",andd:"⩜",andslope:"⩘",andv:"⩚",ang:"∠",ange:"⦤",angle:"∠",angmsd:"∡",angmsdaa:"⦨",angmsdab:"⦩",angmsdac:"⦪",angmsdad:"⦫",angmsdae:"⦬",angmsdaf:"⦭",angmsdag:"⦮",angmsdah:"⦯",angrt:"∟",angrtvb:"⊾",angrtvbd:"⦝",angsph:"∢",angst:"Å",angzarr:"⍼",aogon:"ą",aopf:"𝕒",ap:"≈",apE:"⩰",apacir:"⩯",ape:"≊",apid:"≋",apos:"'",approx:"≈",approxeq:"≊",aring:"å",ascr:"𝒶",ast:"*",asymp:"≈",asympeq:"≍",atilde:"ã",auml:"ä",awconint:"∳",awint:"⨑",bNot:"⫭",backcong:"≌",backepsilon:"϶",backprime:"‵",backsim:"∽",backsimeq:"⋍",barvee:"⊽",barwed:"⌅",barwedge:"⌅",bbrk:"⎵",bbrktbrk:"⎶",bcong:"≌",bcy:"б",bdquo:"„",becaus:"∵",because:"∵",bemptyv:"⦰",bepsi:"϶",bernou:"ℬ",beta:"β",beth:"ℶ",between:"≬",bfr:"𝔟",bigcap:"⋂",bigcirc:"◯",bigcup:"⋃",bigodot:"⨀",bigoplus:"⨁",bigotimes:"⨂",bigsqcup:"⨆",bigstar:"★",bigtriangledown:"▽",bigtriangleup:"△",biguplus:"⨄",bigvee:"⋁",bigwedge:"⋀",bkarow:"⤍",blacklozenge:"⧫",blacksquare:"▪",blacktriangle:"▴",blacktriangledown:"▾",blacktriangleleft:"◂",blacktriangleright:"▸",blank:"␣",blk12:"▒",blk14:"░",blk34:"▓",block:"█",bne:"=⃥",bnequiv:"≡⃥",bnot:"⌐",bopf:"𝕓",bot:"⊥",bottom:"⊥",bowtie:"⋈",boxDL:"╗",boxDR:"╔",boxDl:"╖",boxDr:"╓",boxH:"═",boxHD:"╦",boxHU:"╩",boxHd:"╤",boxHu:"╧",boxUL:"╝",boxUR:"╚",boxUl:"╜",boxUr:"╙",boxV:"║",boxVH:"╬",boxVL:"╣",boxVR:"╠",boxVh:"╫",boxVl:"╢",boxVr:"╟",boxbox:"⧉",boxdL:"╕",boxdR:"╒",boxdl:"┐",boxdr:"┌",boxh:"─",boxhD:"╥",boxhU:"╨",boxhd:"┬",boxhu:"┴",boxminus:"⊟",boxplus:"⊞",boxtimes:"⊠",boxuL:"╛",boxuR:"╘",boxul:"┘",boxur:"└",boxv:"│",boxvH:"╪",boxvL:"╡",boxvR:"╞",boxvh:"┼",boxvl:"┤",boxvr:"├",bprime:"‵",breve:"˘",brvbar:"¦",bscr:"𝒷",bsemi:"⁏",bsim:"∽",bsime:"⋍",bsol:"\\",bsolb:"⧅",bsolhsub:"⟈",bull:"•",bullet:"•",bump:"≎",bumpE:"⪮",bumpe:"≏",bumpeq:"≏",cacute:"ć",cap:"∩",capand:"⩄",capbrcup:"⩉",capcap:"⩋",capcup:"⩇",capdot:"⩀",caps:"∩︀",caret:"⁁",caron:"ˇ",ccaps:"⩍",ccaron:"č",ccedil:"ç",ccirc:"ĉ",ccups:"⩌",ccupssm:"⩐",cdot:"ċ",cedil:"¸",cemptyv:"⦲",cent:"¢",centerdot:"·",cfr:"𝔠",chcy:"ч",check:"✓",checkmark:"✓",chi:"χ",cir:"○",cirE:"⧃",circ:"ˆ",circeq:"≗",circlearrowleft:"↺",circlearrowright:"↻",circledR:"®",circledS:"Ⓢ",circledast:"⊛",circledcirc:"⊚",circleddash:"⊝",cire:"≗",cirfnint:"⨐",cirmid:"⫯",cirscir:"⧂",clubs:"♣",clubsuit:"♣",colon:":",colone:"≔",coloneq:"≔",comma:",",commat:"@",comp:"∁",compfn:"∘",complement:"∁",complexes:"ℂ",cong:"≅",congdot:"⩭",conint:"∮",copf:"𝕔",coprod:"∐",copy:"©",copysr:"℗",crarr:"↵",cross:"✗",cscr:"𝒸",csub:"⫏",csube:"⫑",csup:"⫐",csupe:"⫒",ctdot:"⋯",cudarrl:"⤸",cudarrr:"⤵",cuepr:"⋞",cuesc:"⋟",cularr:"↶",cularrp:"⤽",cup:"∪",cupbrcap:"⩈",cupcap:"⩆",cupcup:"⩊",cupdot:"⊍",cupor:"⩅",cups:"∪︀",curarr:"↷",curarrm:"⤼",curlyeqprec:"⋞",curlyeqsucc:"⋟",curlyvee:"⋎",curlywedge:"⋏",curren:"¤",curvearrowleft:"↶",curvearrowright:"↷",cuvee:"⋎",cuwed:"⋏",cwconint:"∲",cwint:"∱",cylcty:"⌭",dArr:"⇓",dHar:"⥥",dagger:"†",daleth:"ℸ",darr:"↓",dash:"‐",dashv:"⊣",dbkarow:"⤏",dblac:"˝",dcaron:"ď",dcy:"д",dd:"ⅆ",ddagger:"‡",ddarr:"⇊",ddotseq:"⩷",deg:"°",delta:"δ",demptyv:"⦱",dfisht:"⥿",dfr:"𝔡",dharl:"⇃",dharr:"⇂",diam:"⋄",diamond:"⋄",diamondsuit:"♦",diams:"♦",die:"¨",digamma:"ϝ",disin:"⋲",div:"÷",divide:"÷",divideontimes:"⋇",divonx:"⋇",djcy:"ђ",dlcorn:"⌞",dlcrop:"⌍",dollar:"$",dopf:"𝕕",dot:"˙",doteq:"≐",doteqdot:"≑",dotminus:"∸",dotplus:"∔",dotsquare:"⊡",doublebarwedge:"⌆",downarrow:"↓",downdownarrows:"⇊",downharpoonleft:"⇃",downharpoonright:"⇂",drbkarow:"⤐",drcorn:"⌟",drcrop:"⌌",dscr:"𝒹",dscy:"ѕ",dsol:"⧶",dstrok:"đ",dtdot:"⋱",dtri:"▿",dtrif:"▾",duarr:"⇵",duhar:"⥯",dwangle:"⦦",dzcy:"џ",dzigrarr:"⟿",eDDot:"⩷",eDot:"≑",eacute:"é",easter:"⩮",ecaron:"ě",ecir:"≖",ecirc:"ê",ecolon:"≕",ecy:"э",edot:"ė",ee:"ⅇ",efDot:"≒",efr:"𝔢",eg:"⪚",egrave:"è",egs:"⪖",egsdot:"⪘",el:"⪙",elinters:"⏧",ell:"ℓ",els:"⪕",elsdot:"⪗",emacr:"ē",empty:"∅",emptyset:"∅",emptyv:"∅",emsp13:" ",emsp14:" ",emsp:" ",eng:"ŋ",ensp:" ",eogon:"ę",eopf:"𝕖",epar:"⋕",eparsl:"⧣",eplus:"⩱",epsi:"ε",epsilon:"ε",epsiv:"ϵ",eqcirc:"≖",eqcolon:"≕",eqsim:"≂",eqslantgtr:"⪖",eqslantless:"⪕",equals:"=",equest:"≟",equiv:"≡",equivDD:"⩸",eqvparsl:"⧥",erDot:"≓",erarr:"⥱",escr:"ℯ",esdot:"≐",esim:"≂",eta:"η",eth:"ð",euml:"ë",euro:"€",excl:"!",exist:"∃",expectation:"ℰ",exponentiale:"ⅇ",fallingdotseq:"≒",fcy:"ф",female:"♀",ffilig:"ﬃ",fflig:"ﬀ",ffllig:"ﬄ",ffr:"𝔣",filig:"ﬁ",fjlig:"fj",flat:"♭",fllig:"ﬂ",fltns:"▱",fnof:"ƒ",fopf:"𝕗",forall:"∀",fork:"⋔",forkv:"⫙",fpartint:"⨍",frac12:"½",frac13:"⅓",frac14:"¼",frac15:"⅕",frac16:"⅙",frac18:"⅛",frac23:"⅔",frac25:"⅖",frac34:"¾",frac35:"⅗",frac38:"⅜",frac45:"⅘",frac56:"⅚",frac58:"⅝",frac78:"⅞",frasl:"⁄",frown:"⌢",fscr:"𝒻",gE:"≧",gEl:"⪌",gacute:"ǵ",gamma:"γ",gammad:"ϝ",gap:"⪆",gbreve:"ğ",gcirc:"ĝ",gcy:"г",gdot:"ġ",ge:"≥",gel:"⋛",geq:"≥",geqq:"≧",geqslant:"⩾",ges:"⩾",gescc:"⪩",gesdot:"⪀",gesdoto:"⪂",gesdotol:"⪄",gesl:"⋛︀",gesles:"⪔",gfr:"𝔤",gg:"≫",ggg:"⋙",gimel:"ℷ",gjcy:"ѓ",gl:"≷",glE:"⪒",gla:"⪥",glj:"⪤",gnE:"≩",gnap:"⪊",gnapprox:"⪊",gne:"⪈",gneq:"⪈",gneqq:"≩",gnsim:"⋧",gopf:"𝕘",grave:"`",gscr:"ℊ",gsim:"≳",gsime:"⪎",gsiml:"⪐",gt:">",gtcc:"⪧",gtcir:"⩺",gtdot:"⋗",gtlPar:"⦕",gtquest:"⩼",gtrapprox:"⪆",gtrarr:"⥸",gtrdot:"⋗",gtreqless:"⋛",gtreqqless:"⪌",gtrless:"≷",gtrsim:"≳",gvertneqq:"≩︀",gvnE:"≩︀",hArr:"⇔",hairsp:" ",half:"½",hamilt:"ℋ",hardcy:"ъ",harr:"↔",harrcir:"⥈",harrw:"↭",hbar:"ℏ",hcirc:"ĥ",hearts:"♥",heartsuit:"♥",hellip:"…",hercon:"⊹",hfr:"𝔥",hksearow:"⤥",hkswarow:"⤦",hoarr:"⇿",homtht:"∻",hookleftarrow:"↩",hookrightarrow:"↪",hopf:"𝕙",horbar:"―",hscr:"𝒽",hslash:"ℏ",hstrok:"ħ",hybull:"⁃",hyphen:"‐",iacute:"í",ic:"⁣",icirc:"î",icy:"и",iecy:"е",iexcl:"¡",iff:"⇔",ifr:"𝔦",igrave:"ì",ii:"ⅈ",iiiint:"⨌",iiint:"∭",iinfin:"⧜",iiota:"℩",ijlig:"ĳ",imacr:"ī",image:"ℑ",imagline:"ℐ",imagpart:"ℑ",imath:"ı",imof:"⊷",imped:"Ƶ",in:"∈",incare:"℅",infin:"∞",infintie:"⧝",inodot:"ı",int:"∫",intcal:"⊺",integers:"ℤ",intercal:"⊺",intlarhk:"⨗",intprod:"⨼",iocy:"ё",iogon:"į",iopf:"𝕚",iota:"ι",iprod:"⨼",iquest:"¿",iscr:"𝒾",isin:"∈",isinE:"⋹",isindot:"⋵",isins:"⋴",isinsv:"⋳",isinv:"∈",it:"⁢",itilde:"ĩ",iukcy:"і",iuml:"ï",jcirc:"ĵ",jcy:"й",jfr:"𝔧",jmath:"ȷ",jopf:"𝕛",jscr:"𝒿",jsercy:"ј",jukcy:"є",kappa:"κ",kappav:"ϰ",kcedil:"ķ",kcy:"к",kfr:"𝔨",kgreen:"ĸ",khcy:"х",kjcy:"ќ",kopf:"𝕜",kscr:"𝓀",lAarr:"⇚",lArr:"⇐",lAtail:"⤛",lBarr:"⤎",lE:"≦",lEg:"⪋",lHar:"⥢",lacute:"ĺ",laemptyv:"⦴",lagran:"ℒ",lambda:"λ",lang:"⟨",langd:"⦑",langle:"⟨",lap:"⪅",laquo:"«",larr:"←",larrb:"⇤",larrbfs:"⤟",larrfs:"⤝",larrhk:"↩",larrlp:"↫",larrpl:"⤹",larrsim:"⥳",larrtl:"↢",lat:"⪫",latail:"⤙",late:"⪭",lates:"⪭︀",lbarr:"⤌",lbbrk:"❲",lbrace:"{",lbrack:"[",lbrke:"⦋",lbrksld:"⦏",lbrkslu:"⦍",lcaron:"ľ",lcedil:"ļ",lceil:"⌈",lcub:"{",lcy:"л",ldca:"⤶",ldquo:"“",ldquor:"„",ldrdhar:"⥧",ldrushar:"⥋",ldsh:"↲",le:"≤",leftarrow:"←",leftarrowtail:"↢",leftharpoondown:"↽",leftharpoonup:"↼",leftleftarrows:"⇇",leftrightarrow:"↔",leftrightarrows:"⇆",leftrightharpoons:"⇋",leftrightsquigarrow:"↭",leftthreetimes:"⋋",leg:"⋚",leq:"≤",leqq:"≦",leqslant:"⩽",les:"⩽",lescc:"⪨",lesdot:"⩿",lesdoto:"⪁",lesdotor:"⪃",lesg:"⋚︀",lesges:"⪓",lessapprox:"⪅",lessdot:"⋖",lesseqgtr:"⋚",lesseqqgtr:"⪋",lessgtr:"≶",lesssim:"≲",lfisht:"⥼",lfloor:"⌊",lfr:"𝔩",lg:"≶",lgE:"⪑",lhard:"↽",lharu:"↼",lharul:"⥪",lhblk:"▄",ljcy:"љ",ll:"≪",llarr:"⇇",llcorner:"⌞",llhard:"⥫",lltri:"◺",lmidot:"ŀ",lmoust:"⎰",lmoustache:"⎰",lnE:"≨",lnap:"⪉",lnapprox:"⪉",lne:"⪇",lneq:"⪇",lneqq:"≨",lnsim:"⋦",loang:"⟬",loarr:"⇽",lobrk:"⟦",longleftarrow:"⟵",longleftrightarrow:"⟷",longmapsto:"⟼",longrightarrow:"⟶",looparrowleft:"↫",looparrowright:"↬",lopar:"⦅",lopf:"𝕝",loplus:"⨭",lotimes:"⨴",lowast:"∗",lowbar:"_",loz:"◊",lozenge:"◊",lozf:"⧫",lpar:"(",lparlt:"⦓",lrarr:"⇆",lrcorner:"⌟",lrhar:"⇋",lrhard:"⥭",lrm:"‎",lrtri:"⊿",lsaquo:"‹",lscr:"𝓁",lsh:"↰",lsim:"≲",lsime:"⪍",lsimg:"⪏",lsqb:"[",lsquo:"‘",lsquor:"‚",lstrok:"ł",lt:"<",ltcc:"⪦",ltcir:"⩹",ltdot:"⋖",lthree:"⋋",ltimes:"⋉",ltlarr:"⥶",ltquest:"⩻",ltrPar:"⦖",ltri:"◃",ltrie:"⊴",ltrif:"◂",lurdshar:"⥊",luruhar:"⥦",lvertneqq:"≨︀",lvnE:"≨︀",mDDot:"∺",macr:"¯",male:"♂",malt:"✠",maltese:"✠",map:"↦",mapsto:"↦",mapstodown:"↧",mapstoleft:"↤",mapstoup:"↥",marker:"▮",mcomma:"⨩",mcy:"м",mdash:"—",measuredangle:"∡",mfr:"𝔪",mho:"℧",micro:"µ",mid:"∣",midast:"*",midcir:"⫰",middot:"·",minus:"−",minusb:"⊟",minusd:"∸",minusdu:"⨪",mlcp:"⫛",mldr:"…",mnplus:"∓",models:"⊧",mopf:"𝕞",mp:"∓",mscr:"𝓂",mstpos:"∾",mu:"μ",multimap:"⊸",mumap:"⊸",nGg:"⋙̸",nGt:"≫⃒",nGtv:"≫̸",nLeftarrow:"⇍",nLeftrightarrow:"⇎",nLl:"⋘̸",nLt:"≪⃒",nLtv:"≪̸",nRightarrow:"⇏",nVDash:"⊯",nVdash:"⊮",nabla:"∇",nacute:"ń",nang:"∠⃒",nap:"≉",napE:"⩰̸",napid:"≋̸",napos:"ŉ",napprox:"≉",natur:"♮",natural:"♮",naturals:"ℕ",nbsp:" ",nbump:"≎̸",nbumpe:"≏̸",ncap:"⩃",ncaron:"ň",ncedil:"ņ",ncong:"≇",ncongdot:"⩭̸",ncup:"⩂",ncy:"н",ndash:"–",ne:"≠",neArr:"⇗",nearhk:"⤤",nearr:"↗",nearrow:"↗",nedot:"≐̸",nequiv:"≢",nesear:"⤨",nesim:"≂̸",nexist:"∄",nexists:"∄",nfr:"𝔫",ngE:"≧̸",nge:"≱",ngeq:"≱",ngeqq:"≧̸",ngeqslant:"⩾̸",nges:"⩾̸",ngsim:"≵",ngt:"≯",ngtr:"≯",nhArr:"⇎",nharr:"↮",nhpar:"⫲",ni:"∋",nis:"⋼",nisd:"⋺",niv:"∋",njcy:"њ",nlArr:"⇍",nlE:"≦̸",nlarr:"↚",nldr:"‥",nle:"≰",nleftarrow:"↚",nleftrightarrow:"↮",nleq:"≰",nleqq:"≦̸",nleqslant:"⩽̸",nles:"⩽̸",nless:"≮",nlsim:"≴",nlt:"≮",nltri:"⋪",nltrie:"⋬",nmid:"∤",nopf:"𝕟",not:"¬",notin:"∉",notinE:"⋹̸",notindot:"⋵̸",notinva:"∉",notinvb:"⋷",notinvc:"⋶",notni:"∌",notniva:"∌",notnivb:"⋾",notnivc:"⋽",npar:"∦",nparallel:"∦",nparsl:"⫽⃥",npart:"∂̸",npolint:"⨔",npr:"⊀",nprcue:"⋠",npre:"⪯̸",nprec:"⊀",npreceq:"⪯̸",nrArr:"⇏",nrarr:"↛",nrarrc:"⤳̸",nrarrw:"↝̸",nrightarrow:"↛",nrtri:"⋫",nrtrie:"⋭",nsc:"⊁",nsccue:"⋡",nsce:"⪰̸",nscr:"𝓃",nshortmid:"∤",nshortparallel:"∦",nsim:"≁",nsime:"≄",nsimeq:"≄",nsmid:"∤",nspar:"∦",nsqsube:"⋢",nsqsupe:"⋣",nsub:"⊄",nsubE:"⫅̸",nsube:"⊈",nsubset:"⊂⃒",nsubseteq:"⊈",nsubseteqq:"⫅̸",nsucc:"⊁",nsucceq:"⪰̸",nsup:"⊅",nsupE:"⫆̸",nsupe:"⊉",nsupset:"⊃⃒",nsupseteq:"⊉",nsupseteqq:"⫆̸",ntgl:"≹",ntilde:"ñ",ntlg:"≸",ntriangleleft:"⋪",ntrianglelefteq:"⋬",ntriangleright:"⋫",ntrianglerighteq:"⋭",nu:"ν",num:"#",numero:"№",numsp:" ",nvDash:"⊭",nvHarr:"⤄",nvap:"≍⃒",nvdash:"⊬",nvge:"≥⃒",nvgt:">⃒",nvinfin:"⧞",nvlArr:"⤂",nvle:"≤⃒",nvlt:"<⃒",nvltrie:"⊴⃒",nvrArr:"⤃",nvrtrie:"⊵⃒",nvsim:"∼⃒",nwArr:"⇖",nwarhk:"⤣",nwarr:"↖",nwarrow:"↖",nwnear:"⤧",oS:"Ⓢ",oacute:"ó",oast:"⊛",ocir:"⊚",ocirc:"ô",ocy:"о",odash:"⊝",odblac:"ő",odiv:"⨸",odot:"⊙",odsold:"⦼",oelig:"œ",ofcir:"⦿",ofr:"𝔬",ogon:"˛",ograve:"ò",ogt:"⧁",ohbar:"⦵",ohm:"Ω",oint:"∮",olarr:"↺",olcir:"⦾",olcross:"⦻",oline:"‾",olt:"⧀",omacr:"ō",omega:"ω",omicron:"ο",omid:"⦶",ominus:"⊖",oopf:"𝕠",opar:"⦷",operp:"⦹",oplus:"⊕",or:"∨",orarr:"↻",ord:"⩝",order:"ℴ",orderof:"ℴ",ordf:"ª",ordm:"º",origof:"⊶",oror:"⩖",orslope:"⩗",orv:"⩛",oscr:"ℴ",oslash:"ø",osol:"⊘",otilde:"õ",otimes:"⊗",otimesas:"⨶",ouml:"ö",ovbar:"⌽",par:"∥",para:"¶",parallel:"∥",parsim:"⫳",parsl:"⫽",part:"∂",pcy:"п",percnt:"%",period:".",permil:"‰",perp:"⊥",pertenk:"‱",pfr:"𝔭",phi:"φ",phiv:"ϕ",phmmat:"ℳ",phone:"☎",pi:"π",pitchfork:"⋔",piv:"ϖ",planck:"ℏ",planckh:"ℎ",plankv:"ℏ",plus:"+",plusacir:"⨣",plusb:"⊞",pluscir:"⨢",plusdo:"∔",plusdu:"⨥",pluse:"⩲",plusmn:"±",plussim:"⨦",plustwo:"⨧",pm:"±",pointint:"⨕",popf:"𝕡",pound:"£",pr:"≺",prE:"⪳",prap:"⪷",prcue:"≼",pre:"⪯",prec:"≺",precapprox:"⪷",preccurlyeq:"≼",preceq:"⪯",precnapprox:"⪹",precneqq:"⪵",precnsim:"⋨",precsim:"≾",prime:"′",primes:"ℙ",prnE:"⪵",prnap:"⪹",prnsim:"⋨",prod:"∏",profalar:"⌮",profline:"⌒",profsurf:"⌓",prop:"∝",propto:"∝",prsim:"≾",prurel:"⊰",pscr:"𝓅",psi:"ψ",puncsp:" ",qfr:"𝔮",qint:"⨌",qopf:"𝕢",qprime:"⁗",qscr:"𝓆",quaternions:"ℍ",quatint:"⨖",quest:"?",questeq:"≟",quot:'"',rAarr:"⇛",rArr:"⇒",rAtail:"⤜",rBarr:"⤏",rHar:"⥤",race:"∽̱",racute:"ŕ",radic:"√",raemptyv:"⦳",rang:"⟩",rangd:"⦒",range:"⦥",rangle:"⟩",raquo:"»",rarr:"→",rarrap:"⥵",rarrb:"⇥",rarrbfs:"⤠",rarrc:"⤳",rarrfs:"⤞",rarrhk:"↪",rarrlp:"↬",rarrpl:"⥅",rarrsim:"⥴",rarrtl:"↣",rarrw:"↝",ratail:"⤚",ratio:"∶",rationals:"ℚ",rbarr:"⤍",rbbrk:"❳",rbrace:"}",rbrack:"]",rbrke:"⦌",rbrksld:"⦎",rbrkslu:"⦐",rcaron:"ř",rcedil:"ŗ",rceil:"⌉",rcub:"}",rcy:"р",rdca:"⤷",rdldhar:"⥩",rdquo:"”",rdquor:"”",rdsh:"↳",real:"ℜ",realine:"ℛ",realpart:"ℜ",reals:"ℝ",rect:"▭",reg:"®",rfisht:"⥽",rfloor:"⌋",rfr:"𝔯",rhard:"⇁",rharu:"⇀",rharul:"⥬",rho:"ρ",rhov:"ϱ",rightarrow:"→",rightarrowtail:"↣",rightharpoondown:"⇁",rightharpoonup:"⇀",rightleftarrows:"⇄",rightleftharpoons:"⇌",rightrightarrows:"⇉",rightsquigarrow:"↝",rightthreetimes:"⋌",ring:"˚",risingdotseq:"≓",rlarr:"⇄",rlhar:"⇌",rlm:"‏",rmoust:"⎱",rmoustache:"⎱",rnmid:"⫮",roang:"⟭",roarr:"⇾",robrk:"⟧",ropar:"⦆",ropf:"𝕣",roplus:"⨮",rotimes:"⨵",rpar:")",rpargt:"⦔",rppolint:"⨒",rrarr:"⇉",rsaquo:"›",rscr:"𝓇",rsh:"↱",rsqb:"]",rsquo:"’",rsquor:"’",rthree:"⋌",rtimes:"⋊",rtri:"▹",rtrie:"⊵",rtrif:"▸",rtriltri:"⧎",ruluhar:"⥨",rx:"℞",sacute:"ś",sbquo:"‚",sc:"≻",scE:"⪴",scap:"⪸",scaron:"š",sccue:"≽",sce:"⪰",scedil:"ş",scirc:"ŝ",scnE:"⪶",scnap:"⪺",scnsim:"⋩",scpolint:"⨓",scsim:"≿",scy:"с",sdot:"⋅",sdotb:"⊡",sdote:"⩦",seArr:"⇘",searhk:"⤥",searr:"↘",searrow:"↘",sect:"§",semi:";",seswar:"⤩",setminus:"∖",setmn:"∖",sext:"✶",sfr:"𝔰",sfrown:"⌢",sharp:"♯",shchcy:"щ",shcy:"ш",shortmid:"∣",shortparallel:"∥",shy:"­",sigma:"σ",sigmaf:"ς",sigmav:"ς",sim:"∼",simdot:"⩪",sime:"≃",simeq:"≃",simg:"⪞",simgE:"⪠",siml:"⪝",simlE:"⪟",simne:"≆",simplus:"⨤",simrarr:"⥲",slarr:"←",smallsetminus:"∖",smashp:"⨳",smeparsl:"⧤",smid:"∣",smile:"⌣",smt:"⪪",smte:"⪬",smtes:"⪬︀",softcy:"ь",sol:"/",solb:"⧄",solbar:"⌿",sopf:"𝕤",spades:"♠",spadesuit:"♠",spar:"∥",sqcap:"⊓",sqcaps:"⊓︀",sqcup:"⊔",sqcups:"⊔︀",sqsub:"⊏",sqsube:"⊑",sqsubset:"⊏",sqsubseteq:"⊑",sqsup:"⊐",sqsupe:"⊒",sqsupset:"⊐",sqsupseteq:"⊒",squ:"□",square:"□",squarf:"▪",squf:"▪",srarr:"→",sscr:"𝓈",ssetmn:"∖",ssmile:"⌣",sstarf:"⋆",star:"☆",starf:"★",straightepsilon:"ϵ",straightphi:"ϕ",strns:"¯",sub:"⊂",subE:"⫅",subdot:"⪽",sube:"⊆",subedot:"⫃",submult:"⫁",subnE:"⫋",subne:"⊊",subplus:"⪿",subrarr:"⥹",subset:"⊂",subseteq:"⊆",subseteqq:"⫅",subsetneq:"⊊",subsetneqq:"⫋",subsim:"⫇",subsub:"⫕",subsup:"⫓",succ:"≻",succapprox:"⪸",succcurlyeq:"≽",succeq:"⪰",succnapprox:"⪺",succneqq:"⪶",succnsim:"⋩",succsim:"≿",sum:"∑",sung:"♪",sup1:"¹",sup2:"²",sup3:"³",sup:"⊃",supE:"⫆",supdot:"⪾",supdsub:"⫘",supe:"⊇",supedot:"⫄",suphsol:"⟉",suphsub:"⫗",suplarr:"⥻",supmult:"⫂",supnE:"⫌",supne:"⊋",supplus:"⫀",supset:"⊃",supseteq:"⊇",supseteqq:"⫆",supsetneq:"⊋",supsetneqq:"⫌",supsim:"⫈",supsub:"⫔",supsup:"⫖",swArr:"⇙",swarhk:"⤦",swarr:"↙",swarrow:"↙",swnwar:"⤪",szlig:"ß",target:"⌖",tau:"τ",tbrk:"⎴",tcaron:"ť",tcedil:"ţ",tcy:"т",tdot:"⃛",telrec:"⌕",tfr:"𝔱",there4:"∴",therefore:"∴",theta:"θ",thetasym:"ϑ",thetav:"ϑ",thickapprox:"≈",thicksim:"∼",thinsp:" ",thkap:"≈",thksim:"∼",thorn:"þ",tilde:"˜",times:"×",timesb:"⊠",timesbar:"⨱",timesd:"⨰",tint:"∭",toea:"⤨",top:"⊤",topbot:"⌶",topcir:"⫱",topf:"𝕥",topfork:"⫚",tosa:"⤩",tprime:"‴",trade:"™",triangle:"▵",triangledown:"▿",triangleleft:"◃",trianglelefteq:"⊴",triangleq:"≜",triangleright:"▹",trianglerighteq:"⊵",tridot:"◬",trie:"≜",triminus:"⨺",triplus:"⨹",trisb:"⧍",tritime:"⨻",trpezium:"⏢",tscr:"𝓉",tscy:"ц",tshcy:"ћ",tstrok:"ŧ",twixt:"≬",twoheadleftarrow:"↞",twoheadrightarrow:"↠",uArr:"⇑",uHar:"⥣",uacute:"ú",uarr:"↑",ubrcy:"ў",ubreve:"ŭ",ucirc:"û",ucy:"у",udarr:"⇅",udblac:"ű",udhar:"⥮",ufisht:"⥾",ufr:"𝔲",ugrave:"ù",uharl:"↿",uharr:"↾",uhblk:"▀",ulcorn:"⌜",ulcorner:"⌜",ulcrop:"⌏",ultri:"◸",umacr:"ū",uml:"¨",uogon:"ų",uopf:"𝕦",uparrow:"↑",updownarrow:"↕",upharpoonleft:"↿",upharpoonright:"↾",uplus:"⊎",upsi:"υ",upsih:"ϒ",upsilon:"υ",upuparrows:"⇈",urcorn:"⌝",urcorner:"⌝",urcrop:"⌎",uring:"ů",urtri:"◹",uscr:"𝓊",utdot:"⋰",utilde:"ũ",utri:"▵",utrif:"▴",uuarr:"⇈",uuml:"ü",uwangle:"⦧",vArr:"⇕",vBar:"⫨",vBarv:"⫩",vDash:"⊨",vangrt:"⦜",varepsilon:"ϵ",varkappa:"ϰ",varnothing:"∅",varphi:"ϕ",varpi:"ϖ",varpropto:"∝",varr:"↕",varrho:"ϱ",varsigma:"ς",varsubsetneq:"⊊︀",varsubsetneqq:"⫋︀",varsupsetneq:"⊋︀",varsupsetneqq:"⫌︀",vartheta:"ϑ",vartriangleleft:"⊲",vartriangleright:"⊳",vcy:"в",vdash:"⊢",vee:"∨",veebar:"⊻",veeeq:"≚",vellip:"⋮",verbar:"|",vert:"|",vfr:"𝔳",vltri:"⊲",vnsub:"⊂⃒",vnsup:"⊃⃒",vopf:"𝕧",vprop:"∝",vrtri:"⊳",vscr:"𝓋",vsubnE:"⫋︀",vsubne:"⊊︀",vsupnE:"⫌︀",vsupne:"⊋︀",vzigzag:"⦚",wcirc:"ŵ",wedbar:"⩟",wedge:"∧",wedgeq:"≙",weierp:"℘",wfr:"𝔴",wopf:"𝕨",wp:"℘",wr:"≀",wreath:"≀",wscr:"𝓌",xcap:"⋂",xcirc:"◯",xcup:"⋃",xdtri:"▽",xfr:"𝔵",xhArr:"⟺",xharr:"⟷",xi:"ξ",xlArr:"⟸",xlarr:"⟵",xmap:"⟼",xnis:"⋻",xodot:"⨀",xopf:"𝕩",xoplus:"⨁",xotime:"⨂",xrArr:"⟹",xrarr:"⟶",xscr:"𝓍",xsqcup:"⨆",xuplus:"⨄",xutri:"△",xvee:"⋁",xwedge:"⋀",yacute:"ý",yacy:"я",ycirc:"ŷ",ycy:"ы",yen:"¥",yfr:"𝔶",yicy:"ї",yopf:"𝕪",yscr:"𝓎",yucy:"ю",yuml:"ÿ",zacute:"ź",zcaron:"ž",zcy:"з",zdot:"ż",zeetrf:"ℨ",zeta:"ζ",zfr:"𝔷",zhcy:"ж",zigrarr:"⇝",zopf:"𝕫",zscr:"𝓏",zwj:"‍",zwnj:"‌"},J={0:65533,128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};function M(e){return e.replace(/&(?:[a-zA-Z]+|#[xX][\da-fA-F]+|#\d+);/g,(e=>{if("#"===e.charAt(1)){const t=e.charAt(2);return function(e){if(e>=55296&&e<=57343||e>1114111)return"�";e in J&&(e=J[e]);return String.fromCodePoint(e)}("X"===t||"x"===t?parseInt(e.slice(3),16):parseInt(e.slice(2),10))}return H[e.slice(1,-1)]||e}))}function z(e,t){return e.startPos=e.tokenPos=e.index,e.startColumn=e.colPos=e.column,e.startLine=e.linePos=e.line,e.token=8192&k[e.currentChar]?function(e,t){const n=e.currentChar;let r=l(e);const s=e.index;for(;r!==n;)e.index>=e.end&&o(e,14),r=l(e);r!==n&&o(e,14);e.tokenValue=e.source.slice(s,e.index),l(e),512&t&&(e.tokenRaw=e.source.slice(e.tokenPos,e.index));return 134283267}(e,t):F(e,t,0),e.token}function X(e,t){if(e.startPos=e.tokenPos=e.index,e.startColumn=e.colPos=e.column,e.startLine=e.linePos=e.line,e.index>=e.end)return e.token=1048576;switch(G[e.source.charCodeAt(e.index)]){case 8456258:l(e),47===e.currentChar?(l(e),e.token=25):e.token=8456258;break;case 2162700:l(e),e.token=2162700;break;default:{let n=0;for(;e.index<e.end;){const t=k[e.source.charCodeAt(e.index)];if(1024&t?(n|=5,d(e)):2048&t?(u(e,n),n=-5&n|1):l(e),16384&k[e.currentChar])break}const o=e.source.slice(e.tokenPos,e.index);512&t&&(e.tokenRaw=o),e.tokenValue=M(o),e.token=138}}return e.token}function _(e){if(143360==(143360&e.token)){const{index:t}=e;let n=e.currentChar;for(;32770&k[n];)n=l(e);e.tokenValue+=e.source.slice(t,e.index)}return e.token=208897,e.token}function $(e,t,n){0!=(1&e.flags)||1048576==(1048576&e.token)||n||o(e,28,T[255&e.token]),W(e,t,1074790417)||e.onInsertedSemicolon?.(e.startPos)}function Y(e,t,n,o){return t-n<13&&"use strict"===o&&(1048576==(1048576&e.token)||1&e.flags)?1:0}function Z(e,t,n){return e.token!==n?0:(j(e,t),1)}function W(e,t,n){return e.token===n&&(j(e,t),!0)}function K(e,t,n){e.token!==n&&o(e,23,T[255&n]),j(e,t)}function Q(e,t){switch(t.type){case"ArrayExpression":t.type="ArrayPattern";const n=t.elements;for(let t=0,o=n.length;t<o;++t){const o=n[t];o&&Q(e,o)}return;case"ObjectExpression":t.type="ObjectPattern";const r=t.properties;for(let t=0,n=r.length;t<n;++t)Q(e,r[t]);return;case"AssignmentExpression":return t.type="AssignmentPattern","="!==t.operator&&o(e,69),delete t.operator,void Q(e,t.left);case"Property":return void Q(e,t.value);case"SpreadElement":t.type="RestElement",Q(e,t.argument)}}function ee(e,t,n,r,s){1024&t&&(36864==(36864&r)&&o(e,115),s||537079808!=(537079808&r)||o(e,116)),20480==(20480&r)&&o(e,100),24&n&&241739===r&&o(e,98),4196352&t&&209008===r&&o(e,96),2098176&t&&241773===r&&o(e,95,"yield")}function te(e,t,n){1024&t&&(36864==(36864&n)&&o(e,115),537079808==(537079808&n)&&o(e,116),122===n&&o(e,93),121===n&&o(e,93)),20480==(20480&n)&&o(e,100),4196352&t&&209008===n&&o(e,96),2098176&t&&241773===n&&o(e,95,"yield")}function ne(e,t,n){return 209008===n&&(4196352&t&&o(e,96),e.destructible|=128),241773===n&&2097152&t&&o(e,95,"yield"),20480==(20480&n)||36864==(36864&n)||122==n}function oe(e,t,n,r){for(;t;){if(t["$"+n])return r&&o(e,134),1;r&&t.loop&&(r=0),t=t.$}return 0}function re(e,t,n,o,r,s){return 2&t&&(s.start=n,s.end=e.startPos,s.range=[n,e.startPos]),4&t&&(s.loc={start:{line:o,column:r},end:{line:e.startLine,column:e.startColumn}},e.sourceFile&&(s.loc.source=e.sourceFile)),s}function se(e){switch(e.type){case"JSXIdentifier":return e.name;case"JSXNamespacedName":return e.namespace+":"+e.name;case"JSXMemberExpression":return se(e.object)+"."+se(e.property)}}function ae(e,t,n){const o=le({parent:void 0,type:2},1024);return ue(e,t,o,n,1,0),o}function ie(e,t,...n){const{index:o,line:r,column:s}=e;return{type:t,params:n,index:o,line:r,column:s}}function le(e,t){return{parent:e,type:t,scopeError:void 0}}function ce(e,t,n,o,r,s){4&r?de(e,t,n,o,r):ue(e,t,n,o,r,s),64&s&&pe(e,o)}function ue(e,t,n,r,s,a){const i=n["#"+r];i&&0==(2&i)&&(1&s?n.scopeError=ie(e,141,r):256&t&&64&i&&2&a||o(e,141,r)),128&n.type&&n.parent["#"+r]&&0==(2&n.parent["#"+r])&&o(e,141,r),1024&n.type&&i&&0==(2&i)&&1&s&&(n.scopeError=ie(e,141,r)),64&n.type&&768&n.parent["#"+r]&&o(e,154,r),n["#"+r]=s}function de(e,t,n,r,s){let a=n;for(;a&&0==(256&a.type);){const i=a["#"+r];248&i&&(256&t&&0==(1024&t)&&(128&s&&68&i||128&i&&68&s)||o(e,141,r)),a===n&&1&i&&1&s&&(a.scopeError=ie(e,141,r)),768&i&&(0==(512&i)||0==(256&t)||1024&t)&&o(e,141,r),a["#"+r]=s,a=a.parent}}function pe(e,t){void 0!==e.exportedNames&&""!==t&&(e.exportedNames["#"+t]&&o(e,142,t),e.exportedNames["#"+t]=1)}function fe(e,t){void 0!==e.exportedBindings&&""!==t&&(e.exportedBindings["#"+t]=1)}function ke(e,t){return 2098176&e?!(2048&e&&209008===t)&&(!(2097152&e&&241773===t)&&(143360==(143360&t)||12288==(12288&t))):143360==(143360&t)||12288==(12288&t)||36864==(36864&t)}function ge(e,t,n,r){537079808==(537079808&n)&&(1024&t&&o(e,116),r&&(e.flags|=512)),ke(t,n)||o(e,0)}function me(e,t,n){let r,s,a,i="";null!=t&&(t.module&&(n|=3072),t.next&&(n|=1),t.loc&&(n|=4),t.ranges&&(n|=2),t.uniqueKeyInPattern&&(n|=-2147483648),t.lexical&&(n|=64),t.webcompat&&(n|=256),t.directives&&(n|=520),t.globalReturn&&(n|=32),t.raw&&(n|=512),t.preserveParens&&(n|=128),t.impliedStrict&&(n|=1024),t.jsx&&(n|=16),t.identifierPattern&&(n|=268435456),t.specDeviation&&(n|=536870912),t.source&&(i=t.source),null!=t.onComment&&(r=Array.isArray(t.onComment)?function(e,t){return function(n,o,r,s,a){const i={type:n,value:o};2&e&&(i.start=r,i.end=s,i.range=[r,s]),4&e&&(i.loc=a),t.push(i)}}(n,t.onComment):t.onComment),null!=t.onInsertedSemicolon&&(s=t.onInsertedSemicolon),null!=t.onToken&&(a=Array.isArray(t.onToken)?function(e,t){return function(n,o,r,s){const a={token:n};2&e&&(a.start=o,a.end=r,a.range=[o,r]),4&e&&(a.loc=s),t.push(a)}}(n,t.onToken):t.onToken));const c=function(e,t,n,o,r){return{source:e,flags:0,index:0,line:1,column:0,startPos:0,end:e.length,tokenPos:0,startColumn:0,colPos:0,linePos:1,startLine:1,sourceFile:t,tokenValue:"",token:1048576,tokenRaw:"",tokenRegExp:void 0,currentChar:e.charCodeAt(0),exportedNames:[],exportedBindings:[],assignable:1,destructible:0,onComment:n,onToken:o,onInsertedSemicolon:r,leadingDecorators:[]}}(e,i,r,a,s);1&n&&function(e){const t=e.source;35===e.currentChar&&33===t.charCodeAt(e.index+1)&&(l(e),l(e),x(e,t,0,4,e.tokenPos,e.linePos,e.colPos))}(c);const u=64&n?{parent:void 0,type:2}:void 0;let d=[],p="script";if(2048&n){if(p="module",d=function(e,t,n){j(e,32768|t);const o=[];if(8&t)for(;134283267===e.token;){const{tokenPos:n,linePos:r,colPos:s,token:a}=e;o.push(qe(e,t,ot(e,t),a,n,r,s))}for(;1048576!==e.token;)o.push(be(e,t,n));return o}(c,8192|n,u),u)for(const e in c.exportedBindings)"#"!==e[0]||u[e]||o(c,143,e.slice(1))}else d=function(e,t,n){j(e,1073774592|t);const o=[];for(;134283267===e.token;){const{index:n,tokenPos:r,tokenValue:s,linePos:a,colPos:i,token:l}=e,c=ot(e,t);Y(e,n,r,s)&&(t|=1024),o.push(qe(e,t,c,l,r,a,i))}for(;1048576!==e.token;)o.push(he(e,t,n,4,{}));return o}(c,8192|n,u);const f={type:"Program",sourceType:p,body:d};return 2&n&&(f.start=0,f.end=e.length,f.range=[0,e.length]),4&n&&(f.loc={start:{line:1,column:0},end:{line:c.line,column:c.column}},c.sourceFile&&(f.loc.source=i)),f}function be(e,t,n){let r;switch(e.leadingDecorators=xt(e,t),e.token){case 20566:r=function(e,t,n){const r=e.tokenPos,s=e.linePos,a=e.colPos;j(e,32768|t);const i=[];let l,c=null,u=null;if(W(e,32768|t,20563)){switch(e.token){case 86106:c=rt(e,t,n,4,1,1,0,e.tokenPos,e.linePos,e.colPos);break;case 133:case 86096:c=yt(e,t,n,1,e.tokenPos,e.linePos,e.colPos);break;case 209007:const{tokenPos:o,linePos:r,colPos:s}=e;c=nt(e,t,0);const{flags:a}=e;0==(1&a)&&(86106===e.token?c=rt(e,t,n,4,1,1,1,o,r,s):67174411===e.token?(c=Pt(e,t,c,1,1,0,a,o,r,s),c=ze(e,t,c,0,0,o,r,s),c=Ge(e,t,0,0,o,r,s,c)):143360&e.token&&(n&&(n=ae(e,t,e.tokenValue)),c=nt(e,t,0),c=gt(e,t,n,[c],1,o,r,s)));break;default:c=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos),$(e,32768|t)}return n&&pe(e,"default"),re(e,t,r,s,a,{type:"ExportDefaultDeclaration",declaration:c})}switch(e.token){case 8457014:{j(e,t);let i=null;return W(e,t,77934)&&(n&&pe(e,e.tokenValue),i=nt(e,t,0)),K(e,t,12404),134283267!==e.token&&o(e,103,"Export"),u=ot(e,t),$(e,32768|t),re(e,t,r,s,a,{type:"ExportAllDeclaration",source:u,exported:i})}case 2162700:{j(e,t);const r=[],s=[];for(;143360&e.token;){const{tokenPos:a,tokenValue:l,linePos:c,colPos:u}=e,d=nt(e,t,0);let p;77934===e.token?(j(e,t),134217728==(134217728&e.token)&&o(e,104),n&&(r.push(e.tokenValue),s.push(l)),p=nt(e,t,0)):(n&&(r.push(e.tokenValue),s.push(e.tokenValue)),p=d),i.push(re(e,t,a,c,u,{type:"ExportSpecifier",local:d,exported:p})),1074790415!==e.token&&K(e,t,18)}if(K(e,t,1074790415),W(e,t,12404))134283267!==e.token&&o(e,103,"Export"),u=ot(e,t);else if(n){let t=0,n=r.length;for(;t<n;t++)pe(e,r[t]);for(t=0,n=s.length;t<n;t++)fe(e,s[t])}$(e,32768|t);break}case 86096:c=yt(e,t,n,2,e.tokenPos,e.linePos,e.colPos);break;case 86106:c=rt(e,t,n,4,1,2,0,e.tokenPos,e.linePos,e.colPos);break;case 241739:c=Se(e,t,n,8,64,e.tokenPos,e.linePos,e.colPos);break;case 86092:c=Se(e,t,n,16,64,e.tokenPos,e.linePos,e.colPos);break;case 86090:c=Ae(e,t,n,64,e.tokenPos,e.linePos,e.colPos);break;case 209007:const{tokenPos:d,linePos:p,colPos:f}=e;if(j(e,t),0==(1&e.flags)&&86106===e.token){c=rt(e,t,n,4,1,2,1,d,p,f),n&&(l=c.id?c.id.name:"",pe(e,l));break}default:o(e,28,T[255&e.token])}return re(e,t,r,s,a,{type:"ExportNamedDeclaration",declaration:c,specifiers:i,source:u})}(e,t,n);break;case 86108:r=function(e,t,n){const r=e.tokenPos,s=e.linePos,a=e.colPos;j(e,t);let i=null;const{tokenPos:l,linePos:c,colPos:u}=e;let d=[];if(134283267===e.token)i=ot(e,t);else{if(143360&e.token){if(d=[re(e,t,l,c,u,{type:"ImportDefaultSpecifier",local:Ve(e,t,n)})],W(e,t,18))switch(e.token){case 8457014:d.push(Te(e,t,n));break;case 2162700:Re(e,t,n,d);break;default:o(e,105)}}else switch(e.token){case 8457014:d=[Te(e,t,n)];break;case 2162700:Re(e,t,n,d);break;case 67174411:return Ne(e,t,r,s,a);case 67108877:return Ie(e,t,r,s,a);default:o(e,28,T[255&e.token])}i=function(e,t){W(e,t,12404),134283267!==e.token&&o(e,103,"Import");return ot(e,t)}(e,t)}return $(e,32768|t),re(e,t,r,s,a,{type:"ImportDeclaration",specifiers:d,source:i})}(e,t,n);break;default:r=he(e,t,n,4,{})}return e.leadingDecorators.length&&o(e,165),r}function he(e,t,n,r,s){const a=e.tokenPos,i=e.linePos,l=e.colPos;switch(e.token){case 86106:return rt(e,t,n,r,1,0,0,a,i,l);case 133:case 86096:return yt(e,t,n,0,a,i,l);case 86092:return Se(e,t,n,16,0,a,i,l);case 241739:return function(e,t,n,r,s,a,i){const{token:l,tokenValue:c}=e;let u=nt(e,t,0);if(2240512&e.token){const o=De(e,t,n,8,0);return $(e,32768|t),re(e,t,s,a,i,{type:"VariableDeclaration",kind:"let",declarations:o})}e.assignable=1,1024&t&&o(e,83);if(21===e.token)return ve(e,t,n,r,{},c,u,l,0,s,a,i);if(10===e.token){let n;64&t&&(n=ae(e,t,c)),e.flags=128^(128|e.flags),u=gt(e,t,n,[u],0,s,a,i)}else u=ze(e,t,u,0,0,s,a,i),u=Ge(e,t,0,0,s,a,i,u);18===e.token&&(u=Be(e,t,0,s,a,i,u));return xe(e,t,u,s,a,i)}(e,t,n,r,a,i,l);case 20566:o(e,101,"export");case 86108:switch(j(e,t),e.token){case 67174411:return Ne(e,t,a,i,l);case 67108877:return Ie(e,t,a,i,l);default:o(e,101,"import")}case 209007:return we(e,t,n,r,s,1,a,i,l);default:return Pe(e,t,n,r,s,1,a,i,l)}}function Pe(e,t,n,r,s,a,i,l,c){switch(e.token){case 86090:return Ae(e,t,n,0,i,l,c);case 20574:return function(e,t,n,r,s){0==(32&t)&&8192&t&&o(e,90);j(e,32768|t);const a=1&e.flags||1048576&e.token?null:Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);return $(e,32768|t),re(e,t,n,r,s,{type:"ReturnStatement",argument:a})}(e,t,i,l,c);case 20571:return function(e,t,n,o,r,s,a){j(e,t),K(e,32768|t,67174411),e.assignable=1;const i=Oe(e,t,0,1,e.tokenPos,e.line,e.colPos);K(e,32768|t,16);const l=Ce(e,t,n,o,e.tokenPos,e.linePos,e.colPos);let c=null;20565===e.token&&(j(e,32768|t),c=Ce(e,t,n,o,e.tokenPos,e.linePos,e.colPos));return re(e,t,r,s,a,{type:"IfStatement",test:i,consequent:l,alternate:c})}(e,t,n,s,i,l,c);case 20569:return function(e,t,n,r,s,a,i){j(e,t);const l=((4194304&t)>0||(2048&t)>0&&(8192&t)>0)&&W(e,t,209008);K(e,32768|t,67174411),n&&(n=le(n,1));let c,u=null,d=null,p=0,f=null,k=86090===e.token||241739===e.token||86092===e.token;const{token:g,tokenPos:m,linePos:b,colPos:h}=e;k?241739===g?(f=nt(e,t,0),2240512&e.token?(8738868===e.token?1024&t&&o(e,65):f=re(e,t,m,b,h,{type:"VariableDeclaration",kind:"let",declarations:De(e,134217728|t,n,8,32)}),e.assignable=1):1024&t?o(e,65):(k=!1,e.assignable=1,f=ze(e,t,f,0,0,m,b,h),274549===e.token&&o(e,112))):(j(e,t),f=re(e,t,m,b,h,86090===g?{type:"VariableDeclaration",kind:"var",declarations:De(e,134217728|t,n,4,32)}:{type:"VariableDeclaration",kind:"const",declarations:De(e,134217728|t,n,16,32)}),e.assignable=1):1074790417===g?l&&o(e,80):2097152==(2097152&g)?(f=2162700===g?ut(e,t,void 0,1,0,0,2,32,m,b,h):at(e,t,void 0,1,0,0,2,32,m,b,h),p=e.destructible,256&t&&64&p&&o(e,61),e.assignable=16&p?2:1,f=ze(e,134217728|t,f,0,0,e.tokenPos,e.linePos,e.colPos)):f=Me(e,134217728|t,1,0,1,m,b,h);if(262144==(262144&e.token)){if(274549===e.token){2&e.assignable&&o(e,78,l?"await":"of"),Q(e,f),j(e,32768|t),c=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos),K(e,32768|t,16);return re(e,t,s,a,i,{type:"ForOfStatement",left:f,right:c,body:Ee(e,t,n,r),await:l})}2&e.assignable&&o(e,78,"in"),Q(e,f),j(e,32768|t),l&&o(e,80),c=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos),K(e,32768|t,16);return re(e,t,s,a,i,{type:"ForInStatement",body:Ee(e,t,n,r),left:f,right:c})}l&&o(e,80);k||(8&p&&1077936157!==e.token&&o(e,78,"loop"),f=Ge(e,134217728|t,0,0,m,b,h,f));18===e.token&&(f=Be(e,t,0,e.tokenPos,e.linePos,e.colPos,f));K(e,32768|t,1074790417),1074790417!==e.token&&(u=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos));K(e,32768|t,1074790417),16!==e.token&&(d=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos));K(e,32768|t,16);const P=Ee(e,t,n,r);return re(e,t,s,a,i,{type:"ForStatement",init:f,test:u,update:d,body:P})}(e,t,n,s,i,l,c);case 20564:return function(e,t,n,o,r,s,a){j(e,32768|t);const i=Ee(e,t,n,o);K(e,t,20580),K(e,32768|t,67174411);const l=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);return K(e,32768|t,16),W(e,32768|t,1074790417),re(e,t,r,s,a,{type:"DoWhileStatement",body:i,test:l})}(e,t,n,s,i,l,c);case 20580:return function(e,t,n,o,r,s,a){j(e,t),K(e,32768|t,67174411);const i=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);K(e,32768|t,16);const l=Ee(e,t,n,o);return re(e,t,r,s,a,{type:"WhileStatement",test:i,body:l})}(e,t,n,s,i,l,c);case 86112:return function(e,t,n,r,s,a,i){j(e,t),K(e,32768|t,67174411);const l=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);K(e,t,16),K(e,t,2162700);const c=[];let u=0;n&&(n=le(n,8));for(;1074790415!==e.token;){const{tokenPos:s,linePos:a,colPos:i}=e;let l=null;const d=[];for(W(e,32768|t,20558)?l=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos):(K(e,32768|t,20563),u&&o(e,87),u=1),K(e,32768|t,21);20558!==e.token&&1074790415!==e.token&&20563!==e.token;)d.push(he(e,4096|t,n,2,{$:r}));c.push(re(e,t,s,a,i,{type:"SwitchCase",test:l,consequent:d}))}return K(e,32768|t,1074790415),re(e,t,s,a,i,{type:"SwitchStatement",discriminant:l,cases:c})}(e,t,n,s,i,l,c);case 1074790417:return function(e,t,n,o,r){return j(e,32768|t),re(e,t,n,o,r,{type:"EmptyStatement"})}(e,t,i,l,c);case 2162700:return ye(e,t,n?le(n,2):n,s,i,l,c);case 86114:return function(e,t,n,r,s){j(e,32768|t),1&e.flags&&o(e,88);const a=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);return $(e,32768|t),re(e,t,n,r,s,{type:"ThrowStatement",argument:a})}(e,t,i,l,c);case 20557:return function(e,t,n,r,s,a){j(e,32768|t);let i=null;if(0==(1&e.flags)&&143360&e.token){const{tokenValue:r}=e;i=nt(e,32768|t,0),oe(e,n,r,0)||o(e,135,r)}else 0==(135168&t)&&o(e,67);return $(e,32768|t),re(e,t,r,s,a,{type:"BreakStatement",label:i})}(e,t,s,i,l,c);case 20561:return function(e,t,n,r,s,a){0==(131072&t)&&o(e,66);j(e,t);let i=null;if(0==(1&e.flags)&&143360&e.token){const{tokenValue:r}=e;i=nt(e,32768|t,0),oe(e,n,r,1)||o(e,135,r)}return $(e,32768|t),re(e,t,r,s,a,{type:"ContinueStatement",label:i})}(e,t,s,i,l,c);case 20579:return function(e,t,n,r,s,a,i){j(e,32768|t);const l=n?le(n,32):void 0,c=ye(e,t,l,{$:r},e.tokenPos,e.linePos,e.colPos),{tokenPos:u,linePos:d,colPos:p}=e,f=W(e,32768|t,20559)?function(e,t,n,r,s,a,i){let l=null,c=n;W(e,t,67174411)&&(n&&(n=le(n,4)),l=St(e,t,n,2097152==(2097152&e.token)?256:512,0,e.tokenPos,e.linePos,e.colPos),18===e.token?o(e,84):1077936157===e.token&&o(e,85),K(e,32768|t,16),n&&(c=le(n,64)));const u=ye(e,t,c,{$:r},e.tokenPos,e.linePos,e.colPos);return re(e,t,s,a,i,{type:"CatchClause",param:l,body:u})}(e,t,n,r,u,d,p):null;let k=null;if(20568===e.token){j(e,32768|t);k=ye(e,t,l?le(n,4):void 0,{$:r},e.tokenPos,e.linePos,e.colPos)}f||k||o(e,86);return re(e,t,s,a,i,{type:"TryStatement",block:c,handler:f,finalizer:k})}(e,t,n,s,i,l,c);case 20581:return function(e,t,n,r,s,a,i){j(e,t),1024&t&&o(e,89);K(e,32768|t,67174411);const l=Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos);K(e,32768|t,16);const c=Pe(e,t,n,2,r,0,e.tokenPos,e.linePos,e.colPos);return re(e,t,s,a,i,{type:"WithStatement",object:l,body:c})}(e,t,n,s,i,l,c);case 20562:return function(e,t,n,o,r){return j(e,32768|t),$(e,32768|t),re(e,t,n,o,r,{type:"DebuggerStatement"})}(e,t,i,l,c);case 209007:return we(e,t,n,r,s,0,i,l,c);case 20559:o(e,157);case 20568:o(e,158);case 86106:o(e,1024&t?74:0==(256&t)?76:75);case 86096:o(e,77);default:return function(e,t,n,r,s,a,i,l,c){const{tokenValue:u,token:d}=e;let p;if(241739===d)p=nt(e,t,0),1024&t&&o(e,83),69271571===e.token&&o(e,82);else p=_e(e,t,2,0,1,0,0,1,e.tokenPos,e.linePos,e.colPos);if(143360&d&&21===e.token)return ve(e,t,n,r,s,u,p,d,a,i,l,c);p=ze(e,t,p,0,0,i,l,c),p=Ge(e,t,0,0,i,l,c,p),18===e.token&&(p=Be(e,t,0,i,l,c,p));return xe(e,t,p,i,l,c)}(e,t,n,r,s,a,i,l,c)}}function ye(e,t,n,o,r,s,a){const i=[];for(K(e,32768|t,2162700);1074790415!==e.token;)i.push(he(e,t,n,2,{$:o}));return K(e,32768|t,1074790415),re(e,t,r,s,a,{type:"BlockStatement",body:i})}function xe(e,t,n,o,r,s){return $(e,32768|t),re(e,t,o,r,s,{type:"ExpressionStatement",expression:n})}function ve(e,t,n,r,s,a,i,l,c,u,d,p){ee(e,t,0,l,1),function(e,t,n){let r=t;for(;r;)r["$"+n]&&o(e,133,n),r=r.$;t["$"+n]=1}(e,s,a),j(e,32768|t);return re(e,t,u,d,p,{type:"LabeledStatement",label:i,body:c&&0==(1024&t)&&256&t&&86106===e.token?rt(e,t,le(n,2),r,0,0,0,e.tokenPos,e.linePos,e.colPos):Pe(e,t,n,r,s,c,e.tokenPos,e.linePos,e.colPos)})}function we(e,t,n,r,s,a,i,l,c){const{token:u,tokenValue:d}=e;let p=nt(e,t,0);if(21===e.token)return ve(e,t,n,r,s,d,p,u,1,i,l,c);const f=1&e.flags;if(!f){if(86106===e.token)return a||o(e,120),rt(e,t,n,r,1,0,1,i,l,c);if(143360==(143360&e.token))return p=ht(e,t,1,i,l,c),18===e.token&&(p=Be(e,t,0,i,l,c,p)),xe(e,t,p,i,l,c)}return 67174411===e.token?p=Pt(e,t,p,1,1,0,f,i,l,c):(10===e.token&&(ge(e,t,u,1),p=ft(e,t,e.tokenValue,p,0,1,0,i,l,c)),e.assignable=1),p=ze(e,t,p,0,0,i,l,c),p=Ge(e,t,0,0,i,l,c,p),e.assignable=1,18===e.token&&(p=Be(e,t,0,i,l,c,p)),xe(e,t,p,i,l,c)}function qe(e,t,n,o,r,s,a){return 1074790417!==o&&(e.assignable=2,n=ze(e,t,n,0,0,r,s,a),1074790417!==e.token&&(n=Ge(e,t,0,0,r,s,a,n),18===e.token&&(n=Be(e,t,0,r,s,a,n))),$(e,32768|t)),8&t&&"Literal"===n.type&&"string"==typeof n.value?re(e,t,r,s,a,{type:"ExpressionStatement",expression:n,directive:n.raw.slice(1,-1)}):re(e,t,r,s,a,{type:"ExpressionStatement",expression:n})}function Ce(e,t,n,o,r,s,a){return 1024&t||0==(256&t)||86106!==e.token?Pe(e,t,n,0,{$:o},0,e.tokenPos,e.linePos,e.colPos):rt(e,t,le(n,2),0,0,0,0,r,s,a)}function Ee(e,t,n,o){return Pe(e,134217728^(134217728|t)|131072,n,0,{loop:1,$:o},0,e.tokenPos,e.linePos,e.colPos)}function Se(e,t,n,o,r,s,a,i){j(e,t);const l=De(e,t,n,o,r);return $(e,32768|t),re(e,t,s,a,i,{type:"VariableDeclaration",kind:8&o?"let":"const",declarations:l})}function Ae(e,t,n,o,r,s,a){j(e,t);const i=De(e,t,n,4,o);return $(e,32768|t),re(e,t,r,s,a,{type:"VariableDeclaration",kind:"var",declarations:i})}function De(e,t,n,r,s){let a=1;const i=[Le(e,t,n,r,s)];for(;W(e,t,18);)a++,i.push(Le(e,t,n,r,s));return a>1&&32&s&&262144&e.token&&o(e,59,T[255&e.token]),i}function Le(e,t,n,r,a){const{token:i,tokenPos:l,linePos:c,colPos:u}=e;let d=null;const p=St(e,t,n,r,a,l,c,u);return 1077936157===e.token?(j(e,32768|t),d=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos),(32&a||0==(2097152&i))&&(274549===e.token||8738868===e.token&&(2097152&i||0==(4&r)||1024&t))&&s(l,e.line,e.index-3,58,274549===e.token?"of":"in")):(16&r||(2097152&i)>0)&&262144!=(262144&e.token)&&o(e,57,16&r?"const":"destructuring"),re(e,t,l,c,u,{type:"VariableDeclarator",id:p,init:d})}function Ve(e,t,n){return ke(t,e.token)||o(e,115),537079808==(537079808&e.token)&&o(e,116),n&&ue(e,t,n,e.tokenValue,8,0),nt(e,t,0)}function Te(e,t,n){const{tokenPos:o,linePos:r,colPos:a}=e;return j(e,t),K(e,t,77934),134217728==(134217728&e.token)&&s(o,e.line,e.index,28,T[255&e.token]),re(e,t,o,r,a,{type:"ImportNamespaceSpecifier",local:Ve(e,t,n)})}function Re(e,t,n,r){for(j(e,t);143360&e.token;){let{token:s,tokenValue:a,tokenPos:i,linePos:l,colPos:c}=e;const u=nt(e,t,0);let d;W(e,t,77934)?(134217728==(134217728&e.token)||18===e.token?o(e,104):ee(e,t,16,e.token,0),a=e.tokenValue,d=nt(e,t,0)):(ee(e,t,16,s,0),d=u),n&&ue(e,t,n,a,8,0),r.push(re(e,t,i,l,c,{type:"ImportSpecifier",local:d,imported:u})),1074790415!==e.token&&K(e,t,18)}return K(e,t,1074790415),r}function Ie(e,t,n,o,r){let s=$e(e,t,re(e,t,n,o,r,{type:"Identifier",name:"import"}),n,o,r);return s=ze(e,t,s,0,0,n,o,r),s=Ge(e,t,0,0,n,o,r,s),18===e.token&&(s=Be(e,t,0,n,o,r,s)),xe(e,t,s,n,o,r)}function Ne(e,t,n,o,r){let s=Ye(e,t,0,n,o,r);return s=ze(e,t,s,0,0,n,o,r),18===e.token&&(s=Be(e,t,0,n,o,r,s)),xe(e,t,s,n,o,r)}function Ue(e,t,n,o,r,s,a,i){let l=_e(e,t,2,0,n,o,r,1,s,a,i);return l=ze(e,t,l,r,0,s,a,i),Ge(e,t,r,0,s,a,i,l)}function Be(e,t,n,o,r,s,a){const i=[a];for(;W(e,32768|t,18);)i.push(Ue(e,t,1,0,n,e.tokenPos,e.linePos,e.colPos));return re(e,t,o,r,s,{type:"SequenceExpression",expressions:i})}function Oe(e,t,n,o,r,s,a){const i=Ue(e,t,o,0,n,r,s,a);return 18===e.token?Be(e,t,n,r,s,a,i):i}function Ge(e,t,n,r,s,a,i,l){const{token:c}=e;if(4194304==(4194304&c)){2&e.assignable&&o(e,24),(!r&&1077936157===c&&"ArrayExpression"===l.type||"ObjectExpression"===l.type)&&Q(e,l),j(e,32768|t);const u=Ue(e,t,1,1,n,e.tokenPos,e.linePos,e.colPos);return e.assignable=2,re(e,t,s,a,i,r?{type:"AssignmentPattern",left:l,right:u}:{type:"AssignmentExpression",left:l,operator:T[255&c],right:u})}return 8454144==(8454144&c)&&(l=He(e,t,n,s,a,i,4,c,l)),W(e,32768|t,22)&&(l=Fe(e,t,l,s,a,i)),l}function je(e,t,n,o,r,s,a,i){const{token:l}=e;j(e,32768|t);const c=Ue(e,t,1,1,n,e.tokenPos,e.linePos,e.colPos);return i=re(e,t,r,s,a,o?{type:"AssignmentPattern",left:i,right:c}:{type:"AssignmentExpression",left:i,operator:T[255&l],right:c}),e.assignable=2,i}function Fe(e,t,n,o,r,s){const a=Ue(e,134217728^(134217728|t),1,0,0,e.tokenPos,e.linePos,e.colPos);K(e,32768|t,21),e.assignable=1;const i=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);return e.assignable=2,re(e,t,o,r,s,{type:"ConditionalExpression",test:n,consequent:a,alternate:i})}function He(e,t,n,r,s,a,i,l,c){const u=8738868&-((134217728&t)>0);let d,p;for(e.assignable=2;8454144&e.token&&(d=e.token,p=3840&d,(524288&d&&268435456&l||524288&l&&268435456&d)&&o(e,160),!(p+((8457273===d)<<8)-((u===d)<<12)<=i));)j(e,32768|t),c=re(e,t,r,s,a,{type:524288&d||268435456&d?"LogicalExpression":"BinaryExpression",left:c,right:He(e,t,n,e.tokenPos,e.linePos,e.colPos,p,d,Me(e,t,0,n,1,e.tokenPos,e.linePos,e.colPos)),operator:T[255&d]});return 1077936157===e.token&&o(e,24),c}function Je(e,t,n,a,i,l){const{tokenPos:c,linePos:u,colPos:d}=e;K(e,32768|t,2162700);const p=[],f=t;if(1074790415!==e.token){for(;134283267===e.token;){const{index:n,tokenPos:o,tokenValue:r,token:a}=e,i=ot(e,t);Y(e,n,o,r)&&(t|=1024,128&e.flags&&s(e.index,e.line,e.tokenPos,64),64&e.flags&&s(e.index,e.line,e.tokenPos,8)),p.push(qe(e,t,i,a,o,e.linePos,e.colPos))}1024&t&&(i&&(537079808==(537079808&i)&&o(e,116),36864==(36864&i)&&o(e,38)),512&e.flags&&o(e,116),256&e.flags&&o(e,115)),64&t&&n&&void 0!==l&&0==(1024&f)&&0==(8192&t)&&r(l)}for(e.flags=832^(832|e.flags),e.destructible=256^(256|e.destructible);1074790415!==e.token;)p.push(he(e,t,n,4,{}));return K(e,24&a?32768|t:t,1074790415),e.flags&=-193,1077936157===e.token&&o(e,24),re(e,t,c,u,d,{type:"BlockStatement",body:p})}function Me(e,t,n,o,r,s,a,i){return ze(e,t,_e(e,t,2,0,n,0,o,r,s,a,i),o,0,s,a,i)}function ze(e,t,n,r,s,a,i,l){if(33619968==(33619968&e.token)&&0==(1&e.flags))n=function(e,t,n,r,s,a){2&e.assignable&&o(e,53);const{token:i}=e;return j(e,t),e.assignable=2,re(e,t,r,s,a,{type:"UpdateExpression",argument:n,operator:T[255&i],prefix:!1})}(e,t,n,a,i,l);else if(67108864==(67108864&e.token)){switch(t=134217728^(134217728|t),e.token){case 67108877:j(e,8192^(1073750016|t)),e.assignable=1;n=re(e,t,a,i,l,{type:"MemberExpression",object:n,computed:!1,property:Xe(e,65536|t)});break;case 69271571:{let o=!1;2048==(2048&e.flags)&&(o=!0,e.flags=2048^(2048|e.flags)),j(e,32768|t);const{tokenPos:s,linePos:c,colPos:u}=e,d=Oe(e,t,r,1,s,c,u);K(e,t,20),e.assignable=1,n=re(e,t,a,i,l,{type:"MemberExpression",object:n,computed:!0,property:d}),o&&(e.flags|=2048);break}case 67174411:{if(1024==(1024&e.flags))return e.flags=1024^(1024|e.flags),n;let o=!1;2048==(2048&e.flags)&&(o=!0,e.flags=2048^(2048|e.flags));const s=tt(e,t,r);e.assignable=2,n=re(e,t,a,i,l,{type:"CallExpression",callee:n,arguments:s}),o&&(e.flags|=2048);break}case 67108991:j(e,8192^(1073750016|t)),e.flags|=2048,e.assignable=2,n=function(e,t,n,r,s,a){let i,l=!1;69271571!==e.token&&67174411!==e.token||2048==(2048&e.flags)&&(l=!0,e.flags=2048^(2048|e.flags));if(69271571===e.token){j(e,32768|t);const{tokenPos:o,linePos:l,colPos:c}=e,u=Oe(e,t,0,1,o,l,c);K(e,t,20),e.assignable=2,i=re(e,t,r,s,a,{type:"MemberExpression",object:n,computed:!0,optional:!0,property:u})}else if(67174411===e.token){const o=tt(e,t,0);e.assignable=2,i=re(e,t,r,s,a,{type:"CallExpression",callee:n,arguments:o,optional:!0})}else{0==(143360&e.token)&&o(e,155);const l=nt(e,t,0);e.assignable=2,i=re(e,t,r,s,a,{type:"MemberExpression",object:n,computed:!1,optional:!0,property:l})}l&&(e.flags|=2048);return i}(e,t,n,a,i,l);break;default:2048==(2048&e.flags)&&o(e,161),e.assignable=2,n=re(e,t,a,i,l,{type:"TaggedTemplateExpression",tag:n,quasi:67174408===e.token?Ke(e,65536|t):We(e,t,e.tokenPos,e.linePos,e.colPos)})}n=ze(e,t,n,0,1,a,i,l)}return 0===s&&2048==(2048&e.flags)&&(e.flags=2048^(2048|e.flags),n=re(e,t,a,i,l,{type:"ChainExpression",expression:n})),n}function Xe(e,t){return 0==(143360&e.token)&&131!==e.token&&o(e,155),1&t&&131===e.token?Ct(e,t,e.tokenPos,e.linePos,e.colPos):nt(e,t,0)}function _e(e,t,n,r,a,i,l,c,u,d,p){if(143360==(143360&e.token)){switch(e.token){case 209008:return function(e,t,n,r,a,i,l){if(r&&(e.destructible|=128),4194304&t||2048&t&&8192&t){n&&o(e,0),8388608&t&&s(e.index,e.line,e.index,29),j(e,32768|t);const r=Me(e,t,0,0,1,e.tokenPos,e.linePos,e.colPos);return 8457273===e.token&&o(e,31),e.assignable=2,re(e,t,a,i,l,{type:"AwaitExpression",argument:r})}return 2048&t&&o(e,96),pt(e,t,a,i,l)}(e,t,r,l,u,d,p);case 241773:return function(e,t,n,r,s,a,i){if(n&&(e.destructible|=256),2097152&t){j(e,32768|t),8388608&t&&o(e,30),r||o(e,24),22===e.token&&o(e,121);let n=null,l=!1;return 0==(1&e.flags)&&(l=W(e,32768|t,8457014),(77824&e.token||l)&&(n=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos))),e.assignable=2,re(e,t,s,a,i,{type:"YieldExpression",argument:n,delegate:l})}return 1024&t&&o(e,95,"yield"),pt(e,t,s,a,i)}(e,t,l,a,u,d,p);case 209007:return function(e,t,n,r,s,a,i,l,c,u){const{token:d}=e,p=nt(e,t,a),{flags:f}=e;if(0==(1&f)){if(86106===e.token)return st(e,t,1,n,l,c,u);if(143360==(143360&e.token))return r||o(e,0),ht(e,t,s,l,c,u)}return i||67174411!==e.token?10===e.token?(ge(e,t,d,1),i&&o(e,49),ft(e,t,e.tokenValue,p,i,s,0,l,c,u)):(e.assignable=1,p):Pt(e,t,p,s,1,0,f,l,c,u)}(e,t,l,c,a,i,r,u,d,p)}const{token:f,tokenValue:k}=e,g=nt(e,65536|t,i);return 10===e.token?(c||o(e,0),ge(e,t,f,1),ft(e,t,k,g,r,a,0,u,d,p)):(16384&t&&537079928===f&&o(e,127),241739===f&&(1024&t&&o(e,110),24&n&&o(e,98)),e.assignable=1024&t&&537079808==(537079808&f)?2:1,g)}if(134217728==(134217728&e.token))return ot(e,t);switch(e.token){case 33619995:case 33619996:return function(e,t,n,r,s,a,i){n&&o(e,54),r||o(e,0);const{token:l}=e;j(e,32768|t);const c=Me(e,t,0,0,1,e.tokenPos,e.linePos,e.colPos);return 2&e.assignable&&o(e,53),e.assignable=2,re(e,t,s,a,i,{type:"UpdateExpression",argument:c,operator:T[255&l],prefix:!0})}(e,t,r,c,u,d,p);case 16863278:case 16842800:case 16842801:case 25233970:case 25233971:case 16863277:case 16863279:return function(e,t,n,r,s,a,i){n||o(e,0);const l=e.token;j(e,32768|t);const c=Me(e,t,0,i,1,e.tokenPos,e.linePos,e.colPos);var u;return 8457273===e.token&&o(e,31),1024&t&&16863278===l&&("Identifier"===c.type?o(e,118):(u=c).property&&"PrivateIdentifier"===u.property.type&&o(e,124)),e.assignable=2,re(e,t,r,s,a,{type:"UnaryExpression",operator:T[255&l],argument:c,prefix:!0})}(e,t,c,u,d,p,l);case 86106:return st(e,t,0,l,u,d,p);case 2162700:return function(e,t,n,r,s,a,i){const l=ut(e,t,void 0,n,r,0,2,0,s,a,i);256&t&&64&e.destructible&&o(e,61);8&e.destructible&&o(e,60);return l}(e,t,a?0:1,l,u,d,p);case 69271571:return function(e,t,n,r,s,a,i){const l=at(e,t,void 0,n,r,0,2,0,s,a,i);256&t&&64&e.destructible&&o(e,61);8&e.destructible&&o(e,60);return l}(e,t,a?0:1,l,u,d,p);case 67174411:return function(e,t,n,r,s,a,i,l){e.flags=128^(128|e.flags);const{tokenPos:c,linePos:u,colPos:d}=e;j(e,1073774592|t);const p=64&t?le({parent:void 0,type:2},1024):void 0;if(W(e,t=134217728^(134217728|t),16))return kt(e,t,p,[],n,0,a,i,l);let f,k=0;e.destructible&=-385;let g=[],m=0,b=0;const{tokenPos:h,linePos:P,colPos:y}=e;e.assignable=1;for(;16!==e.token;){const{token:n,tokenPos:a,linePos:i,colPos:l}=e;if(143360&n)p&&ue(e,t,p,e.tokenValue,1,0),f=_e(e,t,r,0,1,0,1,1,a,i,l),16===e.token||18===e.token?2&e.assignable?(k|=16,b=1):537079808!=(537079808&n)&&36864!=(36864&n)||(b=1):(1077936157===e.token?b=1:k|=16,f=ze(e,t,f,1,0,a,i,l),16!==e.token&&18!==e.token&&(f=Ge(e,t,1,0,a,i,l,f)));else{if(2097152!=(2097152&n)){if(14===n){f=lt(e,t,p,16,r,s,0,1,0,a,i,l),16&e.destructible&&o(e,72),b=1,!m||16!==e.token&&18!==e.token||g.push(f),k|=8;break}if(k|=16,f=Ue(e,t,1,0,1,a,i,l),!m||16!==e.token&&18!==e.token||g.push(f),18===e.token&&(m||(m=1,g=[f])),m){for(;W(e,32768|t,18);)g.push(Ue(e,t,1,0,1,e.tokenPos,e.linePos,e.colPos));e.assignable=2,f=re(e,t,h,P,y,{type:"SequenceExpression",expressions:g})}return K(e,t,16),e.destructible=k,f}f=2162700===n?ut(e,1073741824|t,p,0,1,0,r,s,a,i,l):at(e,1073741824|t,p,0,1,0,r,s,a,i,l),k|=e.destructible,b=1,e.assignable=2,16!==e.token&&18!==e.token&&(8&k&&o(e,119),f=ze(e,t,f,0,0,a,i,l),k|=16,16!==e.token&&18!==e.token&&(f=Ge(e,t,0,0,a,i,l,f)))}if(!m||16!==e.token&&18!==e.token||g.push(f),!W(e,32768|t,18))break;if(m||(m=1,g=[f]),16===e.token){k|=8;break}}m&&(e.assignable=2,f=re(e,t,h,P,y,{type:"SequenceExpression",expressions:g}));K(e,t,16),16&k&&8&k&&o(e,146);if(k|=256&e.destructible?256:0|128&e.destructible?128:0,10===e.token)return 48&k&&o(e,47),4196352&t&&128&k&&o(e,29),2098176&t&&256&k&&o(e,30),b&&(e.flags|=128),kt(e,t,p,m?g:[f],n,0,a,i,l);8&k&&o(e,140);return e.destructible=256^(256|e.destructible)|k,128&t?re(e,t,c,u,d,{type:"ParenthesizedExpression",expression:f}):f}(e,65536|t,a,1,0,u,d,p);case 86021:case 86022:case 86023:return function(e,t,n,o,r){const s=T[255&e.token],a=86023===e.token?null:"true"===s;return j(e,t),e.assignable=2,re(e,t,n,o,r,512&t?{type:"Literal",value:a,raw:s}:{type:"Literal",value:a})}(e,t,u,d,p);case 86113:return function(e,t){const{tokenPos:n,linePos:o,colPos:r}=e;return j(e,t),e.assignable=2,re(e,t,n,o,r,{type:"ThisExpression"})}(e,t);case 65540:return function(e,t,n,o,r){const{tokenRaw:s,tokenRegExp:a,tokenValue:i}=e;return j(e,t),e.assignable=2,re(e,t,n,o,r,512&t?{type:"Literal",value:i,regex:a,raw:s}:{type:"Literal",value:i,regex:a})}(e,t,u,d,p);case 133:case 86096:return function(e,t,n,r,s,a){let i=null,l=null;const c=xt(e,t=16777216^(16778240|t));c.length&&(r=e.tokenPos,s=e.linePos,a=e.colPos);j(e,t),4096&e.token&&20567!==e.token&&(ne(e,t,e.token)&&o(e,115),537079808==(537079808&e.token)&&o(e,116),i=nt(e,t,0));let u=t;W(e,32768|t,20567)?(l=Me(e,t,0,n,0,e.tokenPos,e.linePos,e.colPos),u|=524288):u=524288^(524288|u);const d=wt(e,u,t,void 0,2,0,n);return e.assignable=2,re(e,t,r,s,a,1&t?{type:"ClassExpression",id:i,superClass:l,decorators:c,body:d}:{type:"ClassExpression",id:i,superClass:l,body:d})}(e,t,l,u,d,p);case 86111:return function(e,t,n,r,s){switch(j(e,t),e.token){case 67108991:o(e,162);case 67174411:0==(524288&t)&&o(e,26),16384&t&&o(e,27),e.assignable=2;break;case 69271571:case 67108877:0==(262144&t)&&o(e,27),16384&t&&o(e,27),e.assignable=1;break;default:o(e,28,"super")}return re(e,t,n,r,s,{type:"Super"})}(e,t,u,d,p);case 67174409:return We(e,t,u,d,p);case 67174408:return Ke(e,t);case 86109:return function(e,t,n,r,s,a){const i=nt(e,32768|t,0),{tokenPos:l,linePos:c,colPos:u}=e;if(W(e,t,67108877)){if(67108864&t&&143494===e.token)return e.assignable=2,function(e,t,n,o,r,s){const a=nt(e,t,0);return re(e,t,o,r,s,{type:"MetaProperty",meta:n,property:a})}(e,t,i,r,s,a);o(e,92)}e.assignable=2,16842752==(16842752&e.token)&&o(e,63,T[255&e.token]);const d=_e(e,t,2,1,0,0,n,1,l,c,u);t=134217728^(134217728|t),67108991===e.token&&o(e,163);const p=bt(e,t,d,n,l,c,u);return e.assignable=2,re(e,t,r,s,a,{type:"NewExpression",callee:p,arguments:67174411===e.token?tt(e,t,n):[]})}(e,t,l,u,d,p);case 134283389:return Ze(e,t,u,d,p);case 131:return Ct(e,t,u,d,p);case 86108:return function(e,t,n,r,s,a,i){let l=nt(e,t,0);if(67108877===e.token)return $e(e,t,l,s,a,i);n&&o(e,138);return l=Ye(e,t,r,s,a,i),e.assignable=2,ze(e,t,l,r,0,s,a,i)}(e,t,r,l,u,d,p);case 8456258:if(16&t)return Dt(e,t,1,u,d,p);default:if(ke(t,e.token))return pt(e,t,u,d,p);o(e,28,T[255&e.token])}}function $e(e,t,n,r,s,a){return 0==(2048&t)&&o(e,164),j(e,t),143495!==e.token&&"meta"!==e.tokenValue&&o(e,28,T[255&e.token]),e.assignable=2,re(e,t,r,s,a,{type:"MetaProperty",meta:n,property:nt(e,t,0)})}function Ye(e,t,n,r,s,a){K(e,32768|t,67174411),14===e.token&&o(e,139);const i=Ue(e,t,1,0,n,e.tokenPos,e.linePos,e.colPos);return K(e,t,16),re(e,t,r,s,a,{type:"ImportExpression",source:i})}function Ze(e,t,n,o,r){const{tokenRaw:s,tokenValue:a}=e;return j(e,t),e.assignable=2,re(e,t,n,o,r,512&t?{type:"Literal",value:a,bigint:s.slice(0,-1),raw:s}:{type:"Literal",value:a,bigint:s.slice(0,-1)})}function We(e,t,n,o,r){e.assignable=2;const{tokenValue:s,tokenRaw:a,tokenPos:i,linePos:l,colPos:c}=e;K(e,t,67174409);return re(e,t,n,o,r,{type:"TemplateLiteral",expressions:[],quasis:[Qe(e,t,s,a,i,l,c,!0)]})}function Ke(e,t){t=134217728^(134217728|t);const{tokenValue:n,tokenRaw:r,tokenPos:s,linePos:a,colPos:i}=e;K(e,32768|t,67174408);const l=[Qe(e,t,n,r,s,a,i,!1)],c=[Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos)];for(1074790415!==e.token&&o(e,81);67174409!==(e.token=D(e,t));){const{tokenValue:n,tokenRaw:r,tokenPos:s,linePos:a,colPos:i}=e;K(e,32768|t,67174408),l.push(Qe(e,t,n,r,s,a,i,!1)),c.push(Oe(e,t,0,1,e.tokenPos,e.linePos,e.colPos)),1074790415!==e.token&&o(e,81)}{const{tokenValue:n,tokenRaw:o,tokenPos:r,linePos:s,colPos:a}=e;K(e,t,67174409),l.push(Qe(e,t,n,o,r,s,a,!0))}return re(e,t,s,a,i,{type:"TemplateLiteral",expressions:c,quasis:l})}function Qe(e,t,n,o,r,s,a,i){const l=re(e,t,r,s,a,{type:"TemplateElement",value:{cooked:n,raw:o},tail:i}),c=i?1:2;return 2&t&&(l.start+=1,l.range[0]+=1,l.end-=c,l.range[1]-=c),4&t&&(l.loc.start.column+=1,l.loc.end.column-=c),l}function et(e,t,n,o,r){K(e,32768|(t=134217728^(134217728|t)),14);const s=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);return e.assignable=1,re(e,t,n,o,r,{type:"SpreadElement",argument:s})}function tt(e,t,n){j(e,32768|t);const o=[];if(16===e.token)return j(e,65536|t),o;for(;16!==e.token&&(14===e.token?o.push(et(e,t,e.tokenPos,e.linePos,e.colPos)):o.push(Ue(e,t,1,0,n,e.tokenPos,e.linePos,e.colPos)),18===e.token)&&(j(e,32768|t),16!==e.token););return K(e,t,16),o}function nt(e,t,n){const{tokenValue:o,tokenPos:r,linePos:s,colPos:a}=e;return j(e,t),re(e,t,r,s,a,268435456&t?{type:"Identifier",name:o,pattern:1===n}:{type:"Identifier",name:o})}function ot(e,t){const{tokenValue:n,tokenRaw:o,tokenPos:r,linePos:s,colPos:a}=e;return 134283389===e.token?Ze(e,t,r,s,a):(j(e,t),e.assignable=2,re(e,t,r,s,a,512&t?{type:"Literal",value:n,raw:o}:{type:"Literal",value:n}))}function rt(e,t,n,r,s,a,i,l,c,u){j(e,32768|t);const d=s?Z(e,t,8457014):0;let p,f=null,k=n?{parent:void 0,type:2}:void 0;if(67174411===e.token)0==(1&a)&&o(e,37,"Function");else{const s=4&r&&(0==(8192&t)||0==(2048&t))?4:64;te(e,t|(3072&t)<<11,e.token),n&&(4&s?de(e,t,n,e.tokenValue,s):ue(e,t,n,e.tokenValue,s,r),k=le(k,256),a&&2&a&&pe(e,e.tokenValue)),p=e.token,143360&e.token?f=nt(e,t,0):o(e,28,T[255&e.token])}t=32243712^(32243712|t)|67108864|2*i+d<<21|(d?0:1073741824),n&&(k=le(k,512));return re(e,t,l,c,u,{type:"FunctionDeclaration",id:f,params:mt(e,8388608|t,k,0,1),body:Je(e,143360^(143360|t),n?le(k,128):k,8,p,n?k.scopeError:void 0),async:1===i,generator:1===d})}function st(e,t,n,o,r,s,a){j(e,32768|t);const i=Z(e,t,8457014),l=2*n+i<<21;let c,u=null,d=64&t?{parent:void 0,type:2}:void 0;(176128&e.token)>0&&(te(e,32243712^(32243712|t)|l,e.token),d&&(d=le(d,256)),c=e.token,u=nt(e,t,0)),t=32243712^(32243712|t)|67108864|l|(i?0:1073741824),d&&(d=le(d,512));const p=mt(e,8388608|t,d,o,1),f=Je(e,-134377473&t,d?le(d,128):d,0,c,void 0);return e.assignable=2,re(e,t,r,s,a,{type:"FunctionExpression",id:u,params:p,body:f,async:1===n,generator:1===i})}function at(e,t,n,r,s,a,i,l,c,u,d){j(e,32768|t);const p=[];let f=0;for(t=134217728^(134217728|t);20!==e.token;)if(W(e,32768|t,18))p.push(null);else{let r;const{token:c,tokenPos:u,linePos:d,colPos:k,tokenValue:g}=e;if(143360&c)if(r=_e(e,t,i,0,1,0,s,1,u,d,k),1077936157===e.token){2&e.assignable&&o(e,24),j(e,32768|t),n&&ce(e,t,n,g,i,l);const c=Ue(e,t,1,1,s,e.tokenPos,e.linePos,e.colPos);r=re(e,t,u,d,k,a?{type:"AssignmentPattern",left:r,right:c}:{type:"AssignmentExpression",operator:"=",left:r,right:c}),f|=256&e.destructible?256:0|128&e.destructible?128:0}else 18===e.token||20===e.token?(2&e.assignable?f|=16:n&&ce(e,t,n,g,i,l),f|=256&e.destructible?256:0|128&e.destructible?128:0):(f|=1&i?32:0==(2&i)?16:0,r=ze(e,t,r,s,0,u,d,k),18!==e.token&&20!==e.token?(1077936157!==e.token&&(f|=16),r=Ge(e,t,s,a,u,d,k,r)):1077936157!==e.token&&(f|=2&e.assignable?16:32));else 2097152&c?(r=2162700===e.token?ut(e,t,n,0,s,a,i,l,u,d,k):at(e,t,n,0,s,a,i,l,u,d,k),f|=e.destructible,e.assignable=16&e.destructible?2:1,18===e.token||20===e.token?2&e.assignable&&(f|=16):8&e.destructible?o(e,69):(r=ze(e,t,r,s,0,u,d,k),f=2&e.assignable?16:0,18!==e.token&&20!==e.token?r=Ge(e,t,s,a,u,d,k,r):1077936157!==e.token&&(f|=2&e.assignable?16:32))):14===c?(r=lt(e,t,n,20,i,l,0,s,a,u,d,k),f|=e.destructible,18!==e.token&&20!==e.token&&o(e,28,T[255&e.token])):(r=Me(e,t,1,0,1,u,d,k),18!==e.token&&20!==e.token?(r=Ge(e,t,s,a,u,d,k,r),0==(3&i)&&67174411===c&&(f|=16)):2&e.assignable?f|=16:67174411===c&&(f|=1&e.assignable&&3&i?32:16));if(p.push(r),!W(e,32768|t,18))break;if(20===e.token)break}K(e,t,20);const k=re(e,t,c,u,d,{type:a?"ArrayPattern":"ArrayExpression",elements:p});return!r&&4194304&e.token?it(e,t,f,s,a,c,u,d,k):(e.destructible=f,k)}function it(e,t,n,r,s,a,i,l,c){1077936157!==e.token&&o(e,24),j(e,32768|t),16&n&&o(e,24),s||Q(e,c);const{tokenPos:u,linePos:d,colPos:p}=e,f=Ue(e,t,1,1,r,u,d,p);return e.destructible=72^(72|n)|(128&e.destructible?128:0)|(256&e.destructible?256:0),re(e,t,a,i,l,s?{type:"AssignmentPattern",left:c,right:f}:{type:"AssignmentExpression",left:c,operator:"=",right:f})}function lt(e,t,n,r,s,a,i,l,c,u,d,p){j(e,32768|t);let f=null,k=0,{token:g,tokenValue:m,tokenPos:b,linePos:h,colPos:P}=e;if(143360&g)e.assignable=1,f=_e(e,t,s,0,1,0,l,1,b,h,P),g=e.token,f=ze(e,t,f,l,0,b,h,P),18!==e.token&&e.token!==r&&(2&e.assignable&&1077936157===e.token&&o(e,69),k|=16,f=Ge(e,t,l,c,b,h,P,f)),2&e.assignable?k|=16:g===r||18===g?n&&ce(e,t,n,m,s,a):k|=32,k|=128&e.destructible?128:0;else if(g===r)o(e,39);else{if(!(2097152&g)){k|=32,f=Me(e,t,1,l,1,e.tokenPos,e.linePos,e.colPos);const{token:n,tokenPos:s,linePos:a,colPos:i}=e;return 1077936157===n&&n!==r&&18!==n?(2&e.assignable&&o(e,24),f=Ge(e,t,l,c,s,a,i,f),k|=16):(18===n?k|=16:n!==r&&(f=Ge(e,t,l,c,s,a,i,f)),k|=1&e.assignable?32:16),e.destructible=k,e.token!==r&&18!==e.token&&o(e,156),re(e,t,u,d,p,{type:c?"RestElement":"SpreadElement",argument:f})}f=2162700===e.token?ut(e,t,n,1,l,c,s,a,b,h,P):at(e,t,n,1,l,c,s,a,b,h,P),g=e.token,1077936157!==g&&g!==r&&18!==g?(8&e.destructible&&o(e,69),f=ze(e,t,f,l,0,b,h,P),k|=2&e.assignable?16:0,4194304==(4194304&e.token)?(1077936157!==e.token&&(k|=16),f=Ge(e,t,l,c,b,h,P,f)):(8454144==(8454144&e.token)&&(f=He(e,t,1,b,h,P,4,g,f)),W(e,32768|t,22)&&(f=Fe(e,t,f,b,h,P)),k|=2&e.assignable?16:32)):k|=1074790415===r&&1077936157!==g?16:e.destructible}if(e.token!==r)if(1&s&&(k|=i?16:32),W(e,32768|t,1077936157)){16&k&&o(e,24),Q(e,f);const n=Ue(e,t,1,1,l,e.tokenPos,e.linePos,e.colPos);f=re(e,t,b,h,P,c?{type:"AssignmentPattern",left:f,right:n}:{type:"AssignmentExpression",left:f,operator:"=",right:n}),k=16}else k|=16;return e.destructible=k,re(e,t,u,d,p,{type:c?"RestElement":"SpreadElement",argument:f})}function ct(e,t,n,s,a,i,l){const c=0==(64&n)?31981568:14680064;let u=64&(t=(t|c)^c|(88&n)<<18|100925440)?le({parent:void 0,type:2},512):void 0;const d=function(e,t,n,s,a,i){K(e,t,67174411);const l=[];if(e.flags=128^(128|e.flags),16===e.token)return 512&s&&o(e,35,"Setter","one",""),j(e,t),l;256&s&&o(e,35,"Getter","no","s");512&s&&14===e.token&&o(e,36);t=134217728^(134217728|t);let c=0,u=0;for(;18!==e.token;){let r=null;const{tokenPos:d,linePos:p,colPos:f}=e;if(143360&e.token?(0==(1024&t)&&(36864==(36864&e.token)&&(e.flags|=256),537079808==(537079808&e.token)&&(e.flags|=512)),r=At(e,t,n,1|s,0,d,p,f)):(2162700===e.token?r=ut(e,t,n,1,i,1,a,0,d,p,f):69271571===e.token?r=at(e,t,n,1,i,1,a,0,d,p,f):14===e.token&&(r=lt(e,t,n,16,a,0,0,i,1,d,p,f)),u=1,48&e.destructible&&o(e,48)),1077936157===e.token){j(e,32768|t),u=1;r=re(e,t,d,p,f,{type:"AssignmentPattern",left:r,right:Ue(e,t,1,1,0,e.tokenPos,e.linePos,e.colPos)})}if(c++,l.push(r),!W(e,t,18))break;if(16===e.token)break}512&s&&1!==c&&o(e,35,"Setter","one","");n&&void 0!==n.scopeError&&r(n.scopeError);u&&(e.flags|=128);return K(e,t,16),l}(e,8388608|t,u,n,1,s);u&&(u=le(u,128));return re(e,t,a,i,l,{type:"FunctionExpression",params:d,body:Je(e,-134230017&t,u,0,void 0,void 0),async:(16&n)>0,generator:(8&n)>0,id:null})}function ut(e,t,n,r,a,i,l,c,u,d,p){j(e,t);const f=[];let k=0,g=0;for(t=134217728^(134217728|t);1074790415!==e.token;){const{token:r,tokenValue:u,linePos:d,colPos:p,tokenPos:m}=e;if(14===r)f.push(lt(e,t,n,1074790415,l,c,0,a,i,m,d,p));else{let b,h=0,P=null;const y=e.token;if(143360&e.token||121===e.token)if(P=nt(e,t,0),18===e.token||1074790415===e.token||1077936157===e.token)if(h|=4,1024&t&&537079808==(537079808&r)?k|=16:ee(e,t,l,r,0),n&&ce(e,t,n,u,l,c),W(e,32768|t,1077936157)){k|=8;const n=Ue(e,t,1,1,a,e.tokenPos,e.linePos,e.colPos);k|=256&e.destructible?256:0|128&e.destructible?128:0,b=re(e,t,m,d,p,{type:"AssignmentPattern",left:-2147483648&t?Object.assign({},P):P,right:n})}else k|=(209008===r?128:0)|(121===r?16:0),b=-2147483648&t?Object.assign({},P):P;else if(W(e,32768|t,21)){const{tokenPos:s,linePos:d,colPos:p}=e;if("__proto__"===u&&g++,143360&e.token){const o=e.token,r=e.tokenValue;k|=121===y?16:0,b=_e(e,t,l,0,1,0,a,1,s,d,p);const{token:u}=e;b=ze(e,t,b,a,0,s,d,p),18===e.token||1074790415===e.token?1077936157===u||1074790415===u||18===u?(k|=128&e.destructible?128:0,2&e.assignable?k|=16:n&&143360==(143360&o)&&ce(e,t,n,r,l,c)):k|=1&e.assignable?32:16:4194304==(4194304&e.token)?(2&e.assignable?k|=16:1077936157!==u?k|=32:n&&ce(e,t,n,r,l,c),b=Ge(e,t,a,i,s,d,p,b)):(k|=16,8454144==(8454144&e.token)&&(b=He(e,t,1,s,d,p,4,u,b)),W(e,32768|t,22)&&(b=Fe(e,t,b,s,d,p)))}else 2097152==(2097152&e.token)?(b=69271571===e.token?at(e,t,n,0,a,i,l,c,s,d,p):ut(e,t,n,0,a,i,l,c,s,d,p),k=e.destructible,e.assignable=16&k?2:1,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):8&e.destructible?o(e,69):(b=ze(e,t,b,a,0,s,d,p),k=2&e.assignable?16:0,4194304==(4194304&e.token)?b=je(e,t,a,i,s,d,p,b):(8454144==(8454144&e.token)&&(b=He(e,t,1,s,d,p,4,r,b)),W(e,32768|t,22)&&(b=Fe(e,t,b,s,d,p)),k|=2&e.assignable?16:32))):(b=Me(e,t,1,a,1,s,d,p),k|=1&e.assignable?32:16,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):(b=ze(e,t,b,a,0,s,d,p),k=2&e.assignable?16:0,18!==e.token&&1074790415!==r&&(1077936157!==e.token&&(k|=16),b=Ge(e,t,a,i,s,d,p,b))))}else 69271571===e.token?(k|=16,209007===r&&(h|=16),h|=2|(12402===r?256:12403===r?512:1),P=dt(e,t,a),k|=e.assignable,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):143360&e.token?(k|=16,121===r&&o(e,93),209007===r&&(1&e.flags&&o(e,129),h|=16),P=nt(e,t,0),h|=12402===r?256:12403===r?512:1,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):67174411===e.token?(k|=16,h|=1,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):8457014===e.token?(k|=16,12402===r?o(e,40):12403===r?o(e,41):143483===r&&o(e,93),j(e,t),h|=9|(209007===r?16:0),143360&e.token?P=nt(e,t,0):134217728==(134217728&e.token)?P=ot(e,t):69271571===e.token?(h|=2,P=dt(e,t,a),k|=e.assignable):o(e,28,T[255&e.token]),b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):134217728==(134217728&e.token)?(209007===r&&(h|=16),h|=12402===r?256:12403===r?512:1,k|=16,P=ot(e,t),b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):o(e,130);else if(134217728==(134217728&e.token))if(P=ot(e,t),21===e.token){K(e,32768|t,21);const{tokenPos:o,linePos:s,colPos:d}=e;if("__proto__"===u&&g++,143360&e.token){b=_e(e,t,l,0,1,0,a,1,o,s,d);const{token:r,tokenValue:u}=e;b=ze(e,t,b,a,0,o,s,d),18===e.token||1074790415===e.token?1077936157===r||1074790415===r||18===r?2&e.assignable?k|=16:n&&ce(e,t,n,u,l,c):k|=1&e.assignable?32:16:1077936157===e.token?(2&e.assignable&&(k|=16),b=Ge(e,t,a,i,o,s,d,b)):(k|=16,b=Ge(e,t,a,i,o,s,d,b))}else 2097152==(2097152&e.token)?(b=69271571===e.token?at(e,t,n,0,a,i,l,c,o,s,d):ut(e,t,n,0,a,i,l,c,o,s,d),k=e.destructible,e.assignable=16&k?2:1,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):8!=(8&e.destructible)&&(b=ze(e,t,b,a,0,o,s,d),k=2&e.assignable?16:0,4194304==(4194304&e.token)?b=je(e,t,a,i,o,s,d,b):(8454144==(8454144&e.token)&&(b=He(e,t,1,o,s,d,4,r,b)),W(e,32768|t,22)&&(b=Fe(e,t,b,o,s,d)),k|=2&e.assignable?16:32))):(b=Me(e,t,1,0,1,o,s,d),k|=1&e.assignable?32:16,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):(b=ze(e,t,b,a,0,o,s,d),k=1&e.assignable?0:16,18!==e.token&&1074790415!==e.token&&(1077936157!==e.token&&(k|=16),b=Ge(e,t,a,i,o,s,d,b))))}else 67174411===e.token?(h|=1,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos),k=16|e.assignable):o(e,131);else if(69271571===e.token)if(P=dt(e,t,a),k|=256&e.destructible?256:0,h|=2,21===e.token){j(e,32768|t);const{tokenPos:s,linePos:u,colPos:d,tokenValue:p,token:f}=e;if(143360&e.token){b=_e(e,t,l,0,1,0,a,1,s,u,d);const{token:o}=e;b=ze(e,t,b,a,0,s,u,d),4194304==(4194304&e.token)?(k|=2&e.assignable?16:1077936157===o?0:32,b=je(e,t,a,i,s,u,d,b)):18===e.token||1074790415===e.token?1077936157===o||1074790415===o||18===o?2&e.assignable?k|=16:n&&143360==(143360&f)&&ce(e,t,n,p,l,c):k|=1&e.assignable?32:16:(k|=16,b=Ge(e,t,a,i,s,u,d,b))}else 2097152==(2097152&e.token)?(b=69271571===e.token?at(e,t,n,0,a,i,l,c,s,u,d):ut(e,t,n,0,a,i,l,c,s,u,d),k=e.destructible,e.assignable=16&k?2:1,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):8&k?o(e,60):(b=ze(e,t,b,a,0,s,u,d),k=2&e.assignable?16|k:0,4194304==(4194304&e.token)?(1077936157!==e.token&&(k|=16),b=je(e,t,a,i,s,u,d,b)):(8454144==(8454144&e.token)&&(b=He(e,t,1,s,u,d,4,r,b)),W(e,32768|t,22)&&(b=Fe(e,t,b,s,u,d)),k|=2&e.assignable?16:32))):(b=Me(e,t,1,0,1,s,u,d),k|=1&e.assignable?32:16,18===e.token||1074790415===e.token?2&e.assignable&&(k|=16):(b=ze(e,t,b,a,0,s,u,d),k=1&e.assignable?0:16,18!==e.token&&1074790415!==e.token&&(1077936157!==e.token&&(k|=16),b=Ge(e,t,a,i,s,u,d,b))))}else 67174411===e.token?(h|=1,b=ct(e,t,h,a,e.tokenPos,d,p),k=16):o(e,42);else if(8457014===r)if(K(e,32768|t,8457014),h|=8,143360&e.token){const{token:n,line:o,index:r}=e;P=nt(e,t,0),h|=1,67174411===e.token?(k|=16,b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):s(r,o,r,209007===n?44:12402===n||12403===e.token?43:45,T[255&n])}else 134217728==(134217728&e.token)?(k|=16,P=ot(e,t),h|=1,b=ct(e,t,h,a,m,d,p)):69271571===e.token?(k|=16,h|=3,P=dt(e,t,a),b=ct(e,t,h,a,e.tokenPos,e.linePos,e.colPos)):o(e,123);else o(e,28,T[255&r]);k|=128&e.destructible?128:0,e.destructible=k,f.push(re(e,t,m,d,p,{type:"Property",key:P,value:b,kind:768&h?512&h?"set":"get":"init",computed:(2&h)>0,method:(1&h)>0,shorthand:(4&h)>0}))}if(k|=e.destructible,18!==e.token)break;j(e,t)}K(e,t,1074790415),g>1&&(k|=64);const m=re(e,t,u,d,p,{type:i?"ObjectPattern":"ObjectExpression",properties:f});return!r&&4194304&e.token?it(e,t,k,a,i,u,d,p,m):(e.destructible=k,m)}function dt(e,t,n){j(e,32768|t);const o=Ue(e,134217728^(134217728|t),1,0,n,e.tokenPos,e.linePos,e.colPos);return K(e,t,20),o}function pt(e,t,n,o,r){const{tokenValue:s}=e,a=nt(e,t,0);if(e.assignable=1,10===e.token){let i;return 64&t&&(i=ae(e,t,s)),e.flags=128^(128|e.flags),gt(e,t,i,[a],0,n,o,r)}return a}function ft(e,t,n,r,s,a,i,l,c,u){a||o(e,55),s&&o(e,49),e.flags&=-129;return gt(e,t,64&t?ae(e,t,n):void 0,[r],i,l,c,u)}function kt(e,t,n,r,s,a,i,l,c){s||o(e,55);for(let t=0;t<r.length;++t)Q(e,r[t]);return gt(e,t,n,r,a,i,l,c)}function gt(e,t,n,s,a,i,l,c){1&e.flags&&o(e,46),K(e,32768|t,10),t=15728640^(15728640|t)|a<<22;const u=2162700!==e.token;let d;if(n&&void 0!==n.scopeError&&r(n.scopeError),u)d=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);else{switch(n&&(n=le(n,128)),d=Je(e,134246400^(134246400|t),n,16,void 0,void 0),e.token){case 69271571:0==(1&e.flags)&&o(e,113);break;case 67108877:case 67174409:case 22:o(e,114);case 67174411:0==(1&e.flags)&&o(e,113),e.flags|=1024}8454144==(8454144&e.token)&&0==(1&e.flags)&&o(e,28,T[255&e.token]),33619968==(33619968&e.token)&&o(e,122)}return e.assignable=2,re(e,t,i,l,c,{type:"ArrowFunctionExpression",params:s,body:d,async:1===a,expression:u})}function mt(e,t,n,s,a){K(e,t,67174411),e.flags=128^(128|e.flags);const i=[];if(W(e,t,16))return i;t=134217728^(134217728|t);let l=0;for(;18!==e.token;){let r;const{tokenPos:c,linePos:u,colPos:d}=e;if(143360&e.token?(0==(1024&t)&&(36864==(36864&e.token)&&(e.flags|=256),537079808==(537079808&e.token)&&(e.flags|=512)),r=At(e,t,n,1|a,0,c,u,d)):(2162700===e.token?r=ut(e,t,n,1,s,1,a,0,c,u,d):69271571===e.token?r=at(e,t,n,1,s,1,a,0,c,u,d):14===e.token?r=lt(e,t,n,16,a,0,0,s,1,c,u,d):o(e,28,T[255&e.token]),l=1,48&e.destructible&&o(e,48)),1077936157===e.token){j(e,32768|t),l=1;r=re(e,t,c,u,d,{type:"AssignmentPattern",left:r,right:Ue(e,t,1,1,s,e.tokenPos,e.linePos,e.colPos)})}if(i.push(r),!W(e,t,18))break;if(16===e.token)break}return l&&(e.flags|=128),n&&(l||1024&t)&&void 0!==n.scopeError&&r(n.scopeError),K(e,t,16),i}function bt(e,t,n,o,r,s,a){const{token:i}=e;if(67108864&i){if(67108877===i){j(e,1073741824|t),e.assignable=1;return bt(e,t,re(e,t,r,s,a,{type:"MemberExpression",object:n,computed:!1,property:Xe(e,t)}),0,r,s,a)}if(69271571===i){j(e,32768|t);const{tokenPos:i,linePos:l,colPos:c}=e,u=Oe(e,t,o,1,i,l,c);return K(e,t,20),e.assignable=1,bt(e,t,re(e,t,r,s,a,{type:"MemberExpression",object:n,computed:!0,property:u}),0,r,s,a)}if(67174408===i||67174409===i)return e.assignable=2,bt(e,t,re(e,t,r,s,a,{type:"TaggedTemplateExpression",tag:n,quasi:67174408===e.token?Ke(e,65536|t):We(e,t,e.tokenPos,e.linePos,e.colPos)}),0,r,s,a)}return n}function ht(e,t,n,r,s,a){return 209008===e.token&&o(e,29),2098176&t&&241773===e.token&&o(e,30),537079808==(537079808&e.token)&&(e.flags|=512),ft(e,t,e.tokenValue,nt(e,t,0),0,n,1,r,s,a)}function Pt(e,t,n,r,s,a,i,l,c,u){j(e,32768|t);const d=64&t?le({parent:void 0,type:2},1024):void 0;if(W(e,t=134217728^(134217728|t),16))return 10===e.token?(1&i&&o(e,46),kt(e,t,d,[],r,1,l,c,u)):re(e,t,l,c,u,{type:"CallExpression",callee:n,arguments:[]});let p=0,f=null,k=0;e.destructible=384^(384|e.destructible);const g=[];for(;16!==e.token;){const{token:r,tokenPos:i,linePos:m,colPos:b}=e;if(143360&r)d&&ue(e,t,d,e.tokenValue,s,0),f=_e(e,t,s,0,1,0,1,1,i,m,b),16===e.token||18===e.token?2&e.assignable?(p|=16,k=1):537079808==(537079808&r)?e.flags|=512:36864==(36864&r)&&(e.flags|=256):(1077936157===e.token?k=1:p|=16,f=ze(e,t,f,1,0,i,m,b),16!==e.token&&18!==e.token&&(f=Ge(e,t,1,0,i,m,b,f)));else if(2097152&r)f=2162700===r?ut(e,t,d,0,1,0,s,a,i,m,b):at(e,t,d,0,1,0,s,a,i,m,b),p|=e.destructible,k=1,16!==e.token&&18!==e.token&&(8&p&&o(e,119),f=ze(e,t,f,0,0,i,m,b),p|=16,8454144==(8454144&e.token)&&(f=He(e,t,1,l,c,u,4,r,f)),W(e,32768|t,22)&&(f=Fe(e,t,f,l,c,u)));else{if(14!==r){for(f=Ue(e,t,1,0,0,i,m,b),p=e.assignable,g.push(f);W(e,32768|t,18);)g.push(Ue(e,t,1,0,0,i,m,b));return p|=e.assignable,K(e,t,16),e.destructible=16|p,e.assignable=2,re(e,t,l,c,u,{type:"CallExpression",callee:n,arguments:g})}f=lt(e,t,d,16,s,a,1,1,0,i,m,b),p|=(16===e.token?0:16)|e.destructible,k=1}if(g.push(f),!W(e,32768|t,18))break}return K(e,t,16),p|=256&e.destructible?256:0|128&e.destructible?128:0,10===e.token?(48&p&&o(e,25),(1&e.flags||1&i)&&o(e,46),128&p&&o(e,29),2098176&t&&256&p&&o(e,30),k&&(e.flags|=128),kt(e,t,d,g,r,1,l,c,u)):(8&p&&o(e,60),e.assignable=2,re(e,t,l,c,u,{type:"CallExpression",callee:n,arguments:g}))}function yt(e,t,n,r,s,a,i){let l=xt(e,t=16777216^(16778240|t));l.length&&(s=e.tokenPos,a=e.linePos,i=e.colPos),e.leadingDecorators.length&&(e.leadingDecorators.push(...l),l=e.leadingDecorators,e.leadingDecorators=[]),j(e,t);let c=null,u=null;const{tokenValue:d}=e;4096&e.token&&20567!==e.token?(ne(e,t,e.token)&&o(e,115),537079808==(537079808&e.token)&&o(e,116),n&&(ue(e,t,n,d,32,0),r&&2&r&&pe(e,d)),c=nt(e,t,0)):0==(1&r)&&o(e,37,"Class");let p=t;W(e,32768|t,20567)?(u=Me(e,t,0,0,0,e.tokenPos,e.linePos,e.colPos),p|=524288):p=524288^(524288|p);const f=wt(e,p,t,n,2,8,0);return re(e,t,s,a,i,1&t?{type:"ClassDeclaration",id:c,superClass:u,decorators:l,body:f}:{type:"ClassDeclaration",id:c,superClass:u,body:f})}function xt(e,t){const n=[];if(1&t)for(;133===e.token;)n.push(vt(e,t,e.tokenPos,e.linePos,e.colPos));return n}function vt(e,t,n,o,r){j(e,32768|t);let s=_e(e,t,2,0,1,0,0,1,n,o,r);return s=ze(e,t,s,0,0,n,o,r),re(e,t,n,o,r,{type:"Decorator",expression:s})}function wt(e,t,n,r,s,a,i){const{tokenPos:l,linePos:c,colPos:u}=e;K(e,32768|t,2162700),t=134217728^(134217728|t);let d=32&e.flags;e.flags=32^(32|e.flags);const p=[];let f;for(;1074790415!==e.token;){let a=0;f=xt(e,t),a=f.length,a>0&&"constructor"===e.tokenValue&&o(e,107),1074790415===e.token&&o(e,106),W(e,t,1074790417)?a>0&&o(e,117):p.push(qt(e,t,r,n,s,f,0,i,e.tokenPos,e.linePos,e.colPos))}return K(e,8&a?32768|t:t,1074790415),e.flags=-33&e.flags|d,re(e,t,l,c,u,{type:"ClassBody",body:p})}function qt(e,t,n,r,s,a,i,l,c,u,d){let p=i?32:0,f=null;const{token:k,tokenPos:g,linePos:m,colPos:b}=e;if(176128&k)switch(f=nt(e,t,0),k){case 36972:if(!i&&67174411!==e.token&&1048576!=(1048576&e.token)&&1077936157!==e.token)return qt(e,t,n,r,s,a,1,l,c,u,d);break;case 209007:if(67174411!==e.token&&0==(1&e.flags)){if(1&t&&1073741824==(1073741824&e.token))return Et(e,t,f,p,a,g,m,b);p|=16|(Z(e,t,8457014)?8:0)}break;case 12402:if(67174411!==e.token){if(1&t&&1073741824==(1073741824&e.token))return Et(e,t,f,p,a,g,m,b);p|=256}break;case 12403:if(67174411!==e.token){if(1&t&&1073741824==(1073741824&e.token))return Et(e,t,f,p,a,g,m,b);p|=512}}else if(69271571===k)p|=2,f=dt(e,r,l);else if(134217728==(134217728&k))f=ot(e,t);else if(8457014===k)p|=8,j(e,t);else if(1&t&&131===e.token)p|=4096,f=Ct(e,16384|t,g,m,b);else if(1&t&&1073741824==(1073741824&e.token))p|=128;else{if(i&&2162700===k)return function(e,t,n,o,r,s){n&&(n=le(n,2));const a=540672;t=(t|a)^a|262144;const{body:i}=ye(e,t,n,{},o,r,s);return re(e,t,o,r,s,{type:"StaticBlock",body:i})}(e,t,n,g,m,b);122===k?(f=nt(e,t,0),67174411!==e.token&&o(e,28,T[255&e.token])):o(e,28,T[255&e.token])}if(792&p&&(143360&e.token?f=nt(e,t,0):134217728==(134217728&e.token)?f=ot(e,t):69271571===e.token?(p|=2,f=dt(e,t,0)):122===e.token?f=nt(e,t,0):1&t&&131===e.token?(p|=4096,f=Ct(e,t,g,m,b)):o(e,132)),0==(2&p)&&("constructor"===e.tokenValue?(1073741824==(1073741824&e.token)?o(e,126):0==(32&p)&&67174411===e.token&&(920&p?o(e,51,"accessor"):0==(524288&t)&&(32&e.flags?o(e,52):e.flags|=32)),p|=64):0==(4096&p)&&824&p&&"prototype"===e.tokenValue&&o(e,50)),1&t&&67174411!==e.token)return Et(e,t,f,p,a,g,m,b);const h=ct(e,t,p,l,e.tokenPos,e.linePos,e.colPos);return re(e,t,c,u,d,1&t?{type:"MethodDefinition",kind:0==(32&p)&&64&p?"constructor":256&p?"get":512&p?"set":"method",static:(32&p)>0,computed:(2&p)>0,key:f,decorators:a,value:h}:{type:"MethodDefinition",kind:0==(32&p)&&64&p?"constructor":256&p?"get":512&p?"set":"method",static:(32&p)>0,computed:(2&p)>0,key:f,value:h})}function Ct(e,t,n,r,s){j(e,t);const{tokenValue:a}=e;return"constructor"===a&&o(e,125),j(e,t),re(e,t,n,r,s,{type:"PrivateIdentifier",name:a})}function Et(e,t,n,r,s,a,i,l){let c=null;if(8&r&&o(e,0),1077936157===e.token){j(e,32768|t);const{tokenPos:n,linePos:r,colPos:s}=e;537079928===e.token&&o(e,116),c=_e(e,16384|t,2,0,1,0,0,1,n,r,s),1073741824==(1073741824&e.token)&&4194304!=(4194304&e.token)||(c=ze(e,16384|t,c,0,0,n,r,s),c=Ge(e,16384|t,0,0,n,r,s,c),18===e.token&&(c=Be(e,t,0,a,i,l,c)))}return re(e,t,a,i,l,{type:"PropertyDefinition",key:n,value:c,static:(32&r)>0,computed:(2&r)>0,decorators:s})}function St(e,t,n,r,s,a,i,l){if(143360&e.token)return At(e,t,n,r,s,a,i,l);2097152!=(2097152&e.token)&&o(e,28,T[255&e.token]);const c=69271571===e.token?at(e,t,n,1,0,1,r,s,a,i,l):ut(e,t,n,1,0,1,r,s,a,i,l);return 16&e.destructible&&o(e,48),32&e.destructible&&o(e,48),c}function At(e,t,n,r,s,a,i,l){const{tokenValue:c,token:u}=e;return 1024&t&&(537079808==(537079808&u)?o(e,116):36864==(36864&u)&&o(e,115)),20480==(20480&u)&&o(e,100),2099200&t&&241773===u&&o(e,30),241739===u&&24&r&&o(e,98),4196352&t&&209008===u&&o(e,96),j(e,t),n&&ce(e,t,n,c,r,s),re(e,t,a,i,l,{type:"Identifier",name:c})}function Dt(e,t,n,r,s,a){if(j(e,t),8456259===e.token)return re(e,t,r,s,a,{type:"JSXFragment",openingFragment:Lt(e,t,r,s,a),children:Tt(e,t),closingFragment:Vt(e,t,n,e.tokenPos,e.linePos,e.colPos)});let i=null,l=[];const c=function(e,t,n,r,s,a){143360!=(143360&e.token)&&4096!=(4096&e.token)&&o(e,0);const i=It(e,t,e.tokenPos,e.linePos,e.colPos),l=function(e,t){const n=[];for(;8457016!==e.token&&8456259!==e.token&&1048576!==e.token;)n.push(Ut(e,t,e.tokenPos,e.linePos,e.colPos));return n}(e,t),c=8457016===e.token;8456259===e.token?X(e,t):(K(e,t,8457016),n?K(e,t,8456259):X(e,t));return re(e,t,r,s,a,{type:"JSXOpeningElement",name:i,attributes:l,selfClosing:c})}(e,t,n,r,s,a);if(!c.selfClosing){l=Tt(e,t),i=function(e,t,n,o,r,s){K(e,t,25);const a=It(e,t,e.tokenPos,e.linePos,e.colPos);n?K(e,t,8456259):e.token=X(e,t);return re(e,t,o,r,s,{type:"JSXClosingElement",name:a})}(e,t,n,e.tokenPos,e.linePos,e.colPos);const r=se(i.name);se(c.name)!==r&&o(e,150,r)}return re(e,t,r,s,a,{type:"JSXElement",children:l,openingElement:c,closingElement:i})}function Lt(e,t,n,o,r){return X(e,t),re(e,t,n,o,r,{type:"JSXOpeningFragment"})}function Vt(e,t,n,o,r,s){return K(e,t,25),K(e,t,8456259),re(e,t,o,r,s,{type:"JSXClosingFragment"})}function Tt(e,t){const n=[];for(;25!==e.token;)e.index=e.tokenPos=e.startPos,e.column=e.colPos=e.startColumn,e.line=e.linePos=e.startLine,X(e,t),n.push(Rt(e,t,e.tokenPos,e.linePos,e.colPos));return n}function Rt(e,t,n,r,s){return 138===e.token?function(e,t,n,o,r){X(e,t);const s={type:"JSXText",value:e.tokenValue};512&t&&(s.raw=e.tokenRaw);return re(e,t,n,o,r,s)}(e,t,n,r,s):2162700===e.token?Ot(e,t,0,0,n,r,s):8456258===e.token?Dt(e,t,0,n,r,s):void o(e,0)}function It(e,t,n,o,r){_(e);let s=Gt(e,t,n,o,r);if(21===e.token)return Bt(e,t,s,n,o,r);for(;W(e,t,67108877);)_(e),s=Nt(e,t,s,n,o,r);return s}function Nt(e,t,n,o,r,s){return re(e,t,o,r,s,{type:"JSXMemberExpression",object:n,property:Gt(e,t,e.tokenPos,e.linePos,e.colPos)})}function Ut(e,t,n,r,s){if(2162700===e.token)return function(e,t,n,o,r){j(e,t),K(e,t,14);const s=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);return K(e,t,1074790415),re(e,t,n,o,r,{type:"JSXSpreadAttribute",argument:s})}(e,t,n,r,s);_(e);let a=null,i=Gt(e,t,n,r,s);if(21===e.token&&(i=Bt(e,t,i,n,r,s)),1077936157===e.token){const n=z(e,t),{tokenPos:r,linePos:s,colPos:i}=e;switch(n){case 134283267:a=ot(e,t);break;case 8456258:a=Dt(e,t,1,r,s,i);break;case 2162700:a=Ot(e,t,1,1,r,s,i);break;default:o(e,149)}}return re(e,t,n,r,s,{type:"JSXAttribute",value:a,name:i})}function Bt(e,t,n,o,r,s){K(e,t,21);return re(e,t,o,r,s,{type:"JSXNamespacedName",namespace:n,name:Gt(e,t,e.tokenPos,e.linePos,e.colPos)})}function Ot(e,t,n,r,s,a,i){j(e,32768|t);const{tokenPos:l,linePos:c,colPos:u}=e;if(14===e.token)return function(e,t,n,o,r){K(e,t,14);const s=Ue(e,t,1,0,0,e.tokenPos,e.linePos,e.colPos);return K(e,t,1074790415),re(e,t,n,o,r,{type:"JSXSpreadChild",expression:s})}(e,t,s,a,i);let d=null;return 1074790415===e.token?(r&&o(e,152),d=function(e,t,n,o,r){return e.startPos=e.tokenPos,e.startLine=e.linePos,e.startColumn=e.colPos,re(e,t,n,o,r,{type:"JSXEmptyExpression"})}(e,t,e.startPos,e.startLine,e.startColumn)):d=Ue(e,t,1,0,0,l,c,u),n?K(e,t,1074790415):X(e,t),re(e,t,s,a,i,{type:"JSXExpressionContainer",expression:d})}function Gt(e,t,n,o,r){const{tokenValue:s}=e;return j(e,t),re(e,t,n,o,r,{type:"JSXIdentifier",name:s})}var jt=Object.freeze({__proto__:null});e.ESTree=jt,e.parse=function(e,t){return me(e,t,0)},e.parseModule=function(e,t){return me(e,t,3072)},e.parseScript=function(e,t){return me(e,t,0)},e.version="4.4.2",Object.defineProperty(e,"__esModule",{value:!0})}));
    
    },{}]},{},[1]);
    