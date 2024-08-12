"use strict";
const cer = customElements;
const NativeHTMLElement = HTMLElement;
const { hasAttribute: nativeHasAttribute, setAttribute: nativeSetAttribute, removeAttribute: nativeRemoveAttribute, getAttribute: nativeGetAttribute, } = NativeHTMLElement.prototype;
const { apply: ReflectApply, setPrototypeOf: ReflectSetPrototypeOf, construct: ReflectConstruct } = Reflect;
const { defineProperties: ObjectDefineProperties } = Object;
const { get: nativeGet, define: nativeDefine, whenDefined: nativeWhenDefined, } = CustomElementRegistry.prototype;
const nativeNodeIsConnectedGetter = Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected').get;
function valueToString(value) {
    try {
        return String(value);
    }
    catch { }
    return '';
}
function createDefinitionRecord(constructor) {
    const { connectedCallback, disconnectedCallback, adoptedCallback, attributeChangedCallback, formAssociatedCallback, formDisabledCallback, formResetCallback, formStateRestoreCallback, } = constructor.prototype;
    const observedAttributes = new Set(constructor.observedAttributes || []);
    const formAssociated = constructor.formAssociated || false;
    return {
        LatestCtor: constructor,
        connectedCallback,
        disconnectedCallback,
        adoptedCallback,
        formAssociatedCallback,
        formDisabledCallback,
        formResetCallback,
        formStateRestoreCallback,
        attributeChangedCallback,
        observedAttributes,
        formAssociated
    };
}
function getObservedAttributesOffset(originalDefinition, instancedDefinition) {
    return new Set([...originalDefinition.observedAttributes].filter((x) => !instancedDefinition.observedAttributes.has(x)));
}
function patchAttributes(instance, originalDefinition, instancedDefinition) {
    const { observedAttributes, attributeChangedCallback } = instancedDefinition;
    if (observedAttributes.size === 0 || !attributeChangedCallback) {
        return;
    }
    const offset = getObservedAttributesOffset(originalDefinition, instancedDefinition);
    if (offset.size === 0) {
        return;
    }
    ObjectDefineProperties(instance, {
        setAttribute: {
            value: function setAttribute(name, value) {
                if (offset.has(name)) {
                    const old = nativeGetAttribute.call(this, name);
                    nativeSetAttribute.call(this, name, value);
                    attributeChangedCallback.call(this, name, old, valueToString(value));
                }
                else {
                    nativeSetAttribute.call(this, name, value);
                }
            },
            writable: true,
            enumerable: true,
            configurable: true,
        },
        removeAttribute: {
            value: function removeAttribute(name) {
                if (offset.has(name)) {
                    const old = nativeGetAttribute.call(this, name);
                    nativeRemoveAttribute.call(this, name);
                    attributeChangedCallback.call(this, name, old, null);
                }
                else {
                    nativeRemoveAttribute.call(this, name);
                }
            },
            writable: true,
            enumerable: true,
            configurable: true,
        },
    });
}
function createPivotingClass(originalDefinition, tagName) {
    var _a;
    return _a = class PivotCtor extends NativeHTMLElement {
            constructor(definition, args) {
                super();
                if (definition) {
                    internalUpgrade(this, originalDefinition, definition, args);
                    return this;
                }
                definition = definitionsByTag.get(tagName);
                if (definition) {
                    internalUpgrade(this, originalDefinition, definition);
                }
                else {
                    pendingRegistryForElement.set(this, originalDefinition);
                    ReflectSetPrototypeOf(this, patchedHTMLElement.prototype);
                }
            }
            connectedCallback() {
                const definition = definitionForElement.get(this);
                if (definition) {
                    definition.connectedCallback?.call(this);
                }
                else {
                    let awaiting = awaitingUpgrade.get(tagName);
                    if (!awaiting) {
                        awaitingUpgrade.set(tagName, (awaiting = new Set()));
                    }
                    awaiting.add(this);
                }
            }
            disconnectedCallback() {
                const definition = definitionForElement.get(this);
                if (definition) {
                    definition.disconnectedCallback?.call(this);
                }
                else {
                    const awaiting = awaitingUpgrade.get(tagName);
                    if (awaiting) {
                        awaiting.delete(this);
                    }
                }
            }
            adoptedCallback() {
                const definition = definitionForElement.get(this);
                definition?.adoptedCallback?.call(this);
            }
            formAssociatedCallback() {
                const definition = definitionForElement.get(this);
                definition?.formAssociatedCallback?.apply(this, arguments);
            }
            formDisabledCallback() {
                const definition = definitionForElement.get(this);
                definition?.formDisabledCallback?.apply(this, arguments);
            }
            formResetCallback() {
                const definition = definitionForElement.get(this);
                definition?.formResetCallback?.apply(this, arguments);
            }
            formStateRestoreCallback() {
                const definition = definitionForElement.get(this);
                definition?.formStateRestoreCallback?.apply(this, arguments);
            }
            attributeChangedCallback(...args) {
                const definition = definitionForElement.get(this);
                if (originalDefinition === definition || definition?.observedAttributes.has(args[0])) {
                    definition.attributeChangedCallback?.apply(this, args);
                }
            }
        },
        _a.observedAttributes = originalDefinition.observedAttributes,
        _a.formAssociated = originalDefinition.formAssociated,
        _a;
}
let upgradingInstance;
const definitionForElement = new WeakMap();
const pendingRegistryForElement = new WeakMap();
const definitionForConstructor = new WeakMap();
const pivotCtorByTag = new Map();
const definitionsByTag = new Map();
const definitionsByClass = new Map();
const definedPromises = new Map();
const definedResolvers = new Map();
const awaitingUpgrade = new Map();
function internalUpgrade(instance, originalDefinition, instancedDefinition, args) {
    ReflectSetPrototypeOf(instance, instancedDefinition.LatestCtor.prototype);
    definitionForElement.set(instance, instancedDefinition);
    if (instancedDefinition !== originalDefinition) {
        patchAttributes(instance, originalDefinition, instancedDefinition);
    }
    upgradingInstance = instance;
    ReflectConstruct(instancedDefinition.LatestCtor, args || []);
    const { observedAttributes, attributeChangedCallback } = instancedDefinition;
    if (observedAttributes.size > 0 && attributeChangedCallback) {
        const offset = getObservedAttributesOffset(originalDefinition, instancedDefinition);
        if (offset.size > 0) {
            offset.forEach((name) => {
                if (nativeHasAttribute.call(instance, name)) {
                    const newValue = nativeGetAttribute.call(instance, name);
                    attributeChangedCallback.call(instance, name, null, newValue);
                }
            });
        }
    }
    if (ReflectApply(nativeNodeIsConnectedGetter, instance, [])) {
        instancedDefinition.disconnectedCallback?.call(instance);
    }
}
function getDefinitionForConstructor(constructor) {
    if (!constructor || !constructor.prototype || typeof constructor.prototype !== 'object') {
        throw new TypeError(`The referenced constructor is not a constructor.`);
    }
    let definition = definitionForConstructor.get(constructor);
    if (!definition) {
        definition = createDefinitionRecord(constructor);
        definitionForConstructor.set(constructor, definition);
    }
    return definition;
}
const patchedHTMLElement = function HTMLElement(...args) {
    if (!new.target) {
        throw new TypeError(`Failed to construct 'HTMLElement': Please use the 'new' operator, this DOM object constructor cannot be called as a function.`);
    }
    if (new.target === patchedHTMLElement) {
        throw new TypeError(`Illegal constructor`);
    }
    const pendingUpgradeInstance = upgradingInstance;
    if (pendingUpgradeInstance) {
        upgradingInstance = undefined;
        return pendingUpgradeInstance;
    }
    const { constructor } = this;
    const definition = definitionsByClass.get(constructor);
    if (!definition || !definition.PivotCtor) {
        throw new TypeError('Illegal constructor');
    }
    return new definition.PivotCtor(definition, args);
};
patchedHTMLElement.prototype = NativeHTMLElement.prototype;
Object.assign(CustomElementRegistry.prototype, {
    get(...args) {
        if (this !== cer) {
            throw new TypeError('Illegal invocation');
        }
        const { 0: tagName } = args;
        return (
        ReflectApply(nativeGet, this, args) &&
            definitionsByTag.get(tagName)?.LatestCtor);
    },
    define(...args) {
        if (this !== cer) {
            throw new TypeError('Illegal invocation');
        }
        const { 0: tagName, 1: constructor, 2: options } = args;
        if (options && options.extends) {
            throw new DOMException('NotSupportedError: ');
        }
        let PivotCtor = ReflectApply(nativeGet, this, [tagName]); 
        if (PivotCtor && PivotCtor !== definitionsByTag.get(tagName)?.PivotCtor) {
            throw new DOMException(`Failed to execute 'define' on 'CustomElementRegistry': the name "${tagName}" has already been used with this registry`);
        }
        const definition = getDefinitionForConstructor(constructor);
        if (definitionsByClass.get(constructor)) {
            throw new DOMException(`Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry`);
        }
        definitionsByTag.set(tagName, definition);
        definitionsByClass.set(constructor, definition);
        PivotCtor = pivotCtorByTag.get(tagName);
        if (!PivotCtor) {
            PivotCtor = createPivotingClass(definition, tagName);
            pivotCtorByTag.set(tagName, PivotCtor);
            ReflectApply(nativeDefine, this, [tagName, PivotCtor]);
        }
        definition.PivotCtor = PivotCtor;
        const awaiting = awaitingUpgrade.get(tagName);
        if (awaiting) {
            awaitingUpgrade.delete(tagName);
            awaiting.forEach((element) => {
                const originalDefinition = pendingRegistryForElement.get(element);
                if (originalDefinition) {
                    pendingRegistryForElement.delete(element);
                    internalUpgrade(element, originalDefinition, definition);
                }
            });
        }
        const resolver = definedResolvers.get(tagName);
        if (resolver) {
            resolver(constructor);
        }
    },
    whenDefined(...args) {
        if (this !== cer) {
            throw new TypeError('Illegal invocation');
        }
        const { 0: tagName } = args;
        return ReflectApply(nativeWhenDefined, this, args).then(() => {
            let promise = definedPromises.get(tagName);
            if (!promise) {
                const definition = definitionsByTag.get(tagName);
                if (definition) {
                    return Promise.resolve(definition.LatestCtor);
                }
                let resolve;
                promise = new Promise((r) => {
                    resolve = r;
                });
                definedPromises.set(tagName, promise);
                definedResolvers.set(tagName, resolve);
            }
            return promise;
        });
    },
    constructor: patchedHTMLElement,
});
window.HTMLElement = patchedHTMLElement;